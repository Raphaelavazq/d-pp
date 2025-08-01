"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderProcessing = exports.cancelOrder = exports.processOrder = exports.updateOrderStatus = exports.createOrder = exports.createPaymentIntent = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
const db = admin.firestore();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});
// Create payment intent (Step 1 of checkout)
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
    try {
        const { items, userId } = data;
        // Calculate totals
        let subtotal = 0;
        for (const item of items) {
            const productDoc = await db
                .collection("products")
                .doc(item.productId)
                .get();
            if (!productDoc.exists) {
                throw new functions.https.HttpsError("not-found", `Product ${item.productId} not found`);
            }
            const product = productDoc.data();
            subtotal += product.price * item.quantity;
        }
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
        const total = subtotal + tax + shipping;
        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Convert to cents
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: userId || "guest",
                orderType: "ecommerce",
            },
        });
        return {
            clientSecret: paymentIntent.client_secret,
            amount: total,
        };
    }
    catch (error) {
        console.error("Payment intent creation error:", error);
        throw new functions.https.HttpsError("internal", "Payment intent creation failed");
    }
});
// Create order (Step 2 - after successful payment)
exports.createOrder = functions.https.onCall(async (data, context) => {
    var _a, _b, _c, _d, _e;
    try {
        const { items, paymentIntentId, userId } = data;
        // Verify payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== "succeeded") {
            throw new functions.https.HttpsError("failed-precondition", "Payment not completed");
        }
        // Calculate totals and prepare order items
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const productDoc = await db
                .collection("products")
                .doc(item.productId)
                .get();
            if (!productDoc.exists) {
                throw new functions.https.HttpsError("not-found", `Product ${item.productId} not found`);
            }
            const product = productDoc.data();
            const itemTotal = product.price * item.quantity;
            subtotal += itemTotal;
            orderItems.push({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: product.price,
                title: product.title,
                image: ((_a = product.images) === null || _a === void 0 ? void 0 : _a[0]) || "",
                supplierId: product.supplierId || "default",
            });
        }
        const tax = subtotal * 0.08;
        const shipping = subtotal > 50 ? 0 : 9.99;
        const calculatedTotal = subtotal + tax + shipping;
        // Create order in Firestore
        const orderData = {
            userId: userId || ((_b = context.auth) === null || _b === void 0 ? void 0 : _b.uid) || "guest",
            items: orderItems,
            subtotal,
            tax,
            shipping,
            total: calculatedTotal,
            status: "pending",
            paymentStatus: "paid",
            shippingAddress: ((_c = paymentIntent.shipping) === null || _c === void 0 ? void 0 : _c.address)
                ? {
                    firstName: ((_d = paymentIntent.shipping.name) === null || _d === void 0 ? void 0 : _d.split(" ")[0]) || "",
                    lastName: ((_e = paymentIntent.shipping.name) === null || _e === void 0 ? void 0 : _e.split(" ").slice(1).join(" ")) ||
                        "",
                    address1: paymentIntent.shipping.address.line1 || "",
                    address2: paymentIntent.shipping.address.line2 || "",
                    city: paymentIntent.shipping.address.city || "",
                    state: paymentIntent.shipping.address.state || "",
                    zipCode: paymentIntent.shipping.address.postal_code || "",
                    country: paymentIntent.shipping.address.country || "",
                }
                : {},
            billingAddress: {}, // Will be populated if different from shipping
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const orderRef = await db.collection("orders").add(orderData);
        // Update inventory
        const batch = db.batch();
        for (const item of orderItems) {
            const inventoryRef = db.collection("inventory").doc(item.productId);
            const inventoryDoc = await inventoryRef.get();
            if (inventoryDoc.exists) {
                batch.update(inventoryRef, {
                    quantity: admin.firestore.FieldValue.increment(-item.quantity),
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
            else {
                // Create inventory record if it doesn't exist
                batch.set(inventoryRef, {
                    productId: item.productId,
                    quantity: Math.max(0, 100 - item.quantity), // Assume initial stock of 100
                    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                });
            }
        }
        await batch.commit();
        // Send order confirmation email (we'll implement this later)
        console.log(`Order ${orderRef.id} created successfully for user ${userId}`);
        return {
            orderId: orderRef.id,
            status: "success",
            message: "Order created successfully",
        };
    }
    catch (error) {
        console.error("Order creation error:", error);
        throw new functions.https.HttpsError("internal", "Order creation failed");
    }
});
// Update order status
exports.updateOrderStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required");
    }
    try {
        const { orderId, status, trackingNumber } = data;
        const orderRef = db.collection("orders").doc(orderId);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            throw new functions.https.HttpsError("not-found", "Order not found");
        }
        const updateData = {
            status,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        if (trackingNumber) {
            updateData.trackingNumber = trackingNumber;
        }
        await orderRef.update(updateData);
        // Send notification email
        if (status === "shipped" && trackingNumber) {
            const orderData = Object.assign({ id: orderId }, orderDoc.data());
            await sendShippingNotification(orderData, trackingNumber);
        }
        return { success: true };
    }
    catch (error) {
        console.error("Order update error:", error);
        throw new functions.https.HttpsError("internal", "Order update failed");
    }
});
// Process order (triggered when order is created)
exports.processOrder = functions.firestore
    .document("orders/{orderId}")
    .onCreate(async (snap, context) => {
    const order = snap.data();
    const orderId = context.params.orderId;
    try {
        // Group items by supplier
        const supplierOrders = new Map();
        for (const item of order.items) {
            if (!supplierOrders.has(item.supplierId)) {
                supplierOrders.set(item.supplierId, []);
            }
            supplierOrders.get(item.supplierId).push(item);
        }
        // Create supplier orders
        const batch = db.batch();
        for (const [supplierId, items] of supplierOrders) {
            const supplierOrderRef = db.collection("supplierOrders").doc();
            batch.set(supplierOrderRef, {
                orderId,
                supplierId,
                items,
                status: "pending",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                shippingAddress: order.shippingAddress,
            });
        }
        await batch.commit();
        // Update order status to processing
        await snap.ref.update({
            status: "processing",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Order ${orderId} processed successfully`);
    }
    catch (error) {
        console.error(`Error processing order ${orderId}:`, error);
        // Update order status to failed
        await snap.ref.update({
            status: "cancelled",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
});
// Cancel order
exports.cancelOrder = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required");
    }
    try {
        const { orderId, reason } = data;
        const userId = context.auth.uid;
        const orderRef = db.collection("orders").doc(orderId);
        const orderDoc = await orderRef.get();
        if (!orderDoc.exists) {
            throw new functions.https.HttpsError("not-found", "Order not found");
        }
        const order = orderDoc.data();
        // Check if user owns the order or is admin
        if (order.userId !== userId && !context.auth.token.admin) {
            throw new functions.https.HttpsError("permission-denied", "Access denied");
        }
        // Can only cancel pending or processing orders
        if (!["pending", "processing"].includes(order.status)) {
            throw new functions.https.HttpsError("failed-precondition", "Order cannot be cancelled");
        }
        // Update order status
        await orderRef.update({
            status: "cancelled",
            cancelReason: reason,
            cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        // Restore inventory
        const batch = db.batch();
        for (const item of order.items) {
            const inventoryRef = db.collection("inventory").doc(item.productId);
            batch.update(inventoryRef, {
                quantity: admin.firestore.FieldValue.increment(item.quantity),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        await batch.commit();
        // Process refund if payment was made
        if (order.paymentStatus === "paid") {
            // Implement refund logic here
            console.log(`Processing refund for order ${orderId}`);
        }
        return { success: true };
    }
    catch (error) {
        console.error("Order cancellation error:", error);
        throw new functions.https.HttpsError("internal", "Order cancellation failed");
    }
});
async function sendShippingNotification(order, trackingNumber) {
    // Implementation for sending shipping notification email
    console.log(`Sending shipping notification for order ${order.id} with tracking ${trackingNumber}`);
    // This would integrate with your email service (SendGrid, etc.)
}
exports.orderProcessing = {
    processOrder: exports.processOrder,
    createOrder: exports.createOrder,
    updateOrderStatus: exports.updateOrderStatus,
    cancelOrder: exports.cancelOrder,
};
//# sourceMappingURL=orderProcessing.js.map