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
exports.orderProcessing = exports.cancelOrder = exports.processOrder = exports.updateOrderStatus = exports.createOrder = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
const db = admin.firestore();
const stripe = new stripe_1.default(functions.config().stripe.secret_key, {
    apiVersion: "2023-10-16",
});
// Create order
exports.createOrder = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Authentication required");
    }
    try {
        const { items, shippingAddress, billingAddress, paymentMethodId } = data;
        const userId = context.auth.uid;
        // Calculate totals
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
                image: product.images[0],
                supplierId: product.supplierId,
            });
        }
        const tax = subtotal * 0.08; // 8% tax
        const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
        const total = subtotal + tax + shipping;
        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(total * 100), // Convert to cents
            currency: "usd",
            payment_method: paymentMethodId,
            confirm: true,
            metadata: {
                userId,
                orderType: "ecommerce",
            },
        });
        // Create order in Firestore
        const orderData = {
            userId,
            items: orderItems,
            subtotal,
            tax,
            shipping,
            total,
            status: "pending",
            paymentStatus: paymentIntent.status === "succeeded" ? "paid" : "pending",
            shippingAddress,
            billingAddress,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const orderRef = await db.collection("orders").add(orderData);
        // Update inventory
        const batch = db.batch();
        for (const item of orderItems) {
            const inventoryRef = db.collection("inventory").doc(item.productId);
            batch.update(inventoryRef, {
                quantity: admin.firestore.FieldValue.increment(-item.quantity),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            });
        }
        await batch.commit();
        return {
            orderId: orderRef.id,
            paymentIntent: paymentIntent.id,
            status: "success",
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