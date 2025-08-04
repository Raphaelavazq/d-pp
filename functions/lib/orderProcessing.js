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
exports.getUserOrders = exports.processOrder = exports.createOrder = exports.createPaymentIntent = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});
// Create payment intent (Step 1 of checkout)
exports.createPaymentIntent = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    try {
        const { items, userId } = request.data;
        // Calculate totals
        let subtotal = 0;
        for (const item of items) {
            const productDoc = await db
                .collection("products")
                .doc(item.productId)
                .get();
            if (!productDoc.exists) {
                throw new Error(`Product ${item.productId} not found`);
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
        throw new Error("Payment intent creation failed");
    }
});
// Create order (Step 2 - after successful payment)
exports.createOrder = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    var _a, _b;
    try {
        const { items, paymentIntentId, userId } = request.data;
        // Verify payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== "succeeded") {
            throw new Error("Payment not completed");
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
                throw new Error(`Product ${item.productId} not found`);
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
            userId: userId || ((_b = request.auth) === null || _b === void 0 ? void 0 : _b.uid) || "guest",
            items: orderItems,
            subtotal,
            tax,
            shipping,
            total: calculatedTotal,
            status: "pending",
            paymentStatus: "paid",
            shippingAddress: {}, // Will be populated from form
            billingAddress: {}, // Will be populated if different from shipping
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const orderRef = await db.collection("orders").add(orderData);
        console.log(`Order ${orderRef.id} created successfully for user ${userId}`);
        return {
            orderId: orderRef.id,
            status: "success",
            message: "Order created successfully",
        };
    }
    catch (error) {
        console.error("Order creation error:", error);
        throw new Error("Order creation failed");
    }
});
// Process order (triggered when order is created)
exports.processOrder = (0, firestore_1.onDocumentCreated)({
    document: "orders/{orderId}",
    region: "europe-west1",
}, async (event) => {
    var _a;
    const order = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    const orderId = event.params.orderId;
    try {
        if (!order) {
            console.error("No order data in event");
            return;
        }
        // Update order status to processing
        await db.collection("orders").doc(orderId).update({
            status: "processing",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        console.log(`Order ${orderId} processed successfully`);
    }
    catch (error) {
        console.error(`Error processing order ${orderId}:`, error);
        // Update order status to indicate error
        await db
            .collection("orders")
            .doc(orderId)
            .update({
            status: "pending",
            processingError: error instanceof Error ? error.message : "Unknown error",
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
});
// Get user orders
exports.getUserOrders = (0, https_1.onCall)({ region: "europe-west1" }, async (request) => {
    if (!request.auth) {
        throw new Error("Authentication required");
    }
    try {
        const { limit = 10, status } = request.data;
        const userId = request.auth.uid;
        let query = db
            .collection("orders")
            .where("userId", "==", userId)
            .orderBy("createdAt", "desc")
            .limit(limit);
        if (status) {
            query = query.where("status", "==", status);
        }
        const snapshot = await query.get();
        const orders = snapshot.docs.map((doc) => (Object.assign({ id: doc.id }, doc.data())));
        return {
            success: true,
            orders,
        };
    }
    catch (error) {
        console.error("Error getting user orders:", error);
        throw new Error("Failed to get user orders");
    }
});
//# sourceMappingURL=orderProcessing.js.map