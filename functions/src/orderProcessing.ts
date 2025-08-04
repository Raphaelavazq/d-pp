import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
  supplierId: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

// Create payment intent (Step 1 of checkout)
export const createPaymentIntent = onCall(
  { region: "europe-west1" },
  async (request) => {
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
        const product = productDoc.data()!;
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
    } catch (error) {
      console.error("Payment intent creation error:", error);
      throw new Error("Payment intent creation failed");
    }
  }
);

// Create order (Step 2 - after successful payment)
export const createOrder = onCall(
  { region: "europe-west1" },
  async (request) => {
    try {
      const { items, paymentIntentId, userId } = request.data;

      // Verify payment intent
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== "succeeded") {
        throw new Error("Payment not completed");
      }

      // Calculate totals and prepare order items
      let subtotal = 0;
      const orderItems: OrderItem[] = [];

      for (const item of items) {
        const productDoc = await db
          .collection("products")
          .doc(item.productId)
          .get();
        if (!productDoc.exists) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const product = productDoc.data()!;
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: product.price,
          title: product.title,
          image: product.images?.[0] || "",
          supplierId: product.supplierId || "default",
        });
      }

      const tax = subtotal * 0.08;
      const shipping = subtotal > 50 ? 0 : 9.99;
      const calculatedTotal = subtotal + tax + shipping;

      // Create order in Firestore
      const orderData: Partial<Order> = {
        userId: userId || request.auth?.uid || "guest",
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total: calculatedTotal,
        status: "pending",
        paymentStatus: "paid",
        shippingAddress: {} as Address, // Will be populated from form
        billingAddress: {} as Address, // Will be populated if different from shipping
        createdAt: admin.firestore.FieldValue.serverTimestamp() as any,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as any,
      };

      const orderRef = await db.collection("orders").add(orderData);

      console.log(
        `Order ${orderRef.id} created successfully for user ${userId}`
      );

      return {
        orderId: orderRef.id,
        status: "success",
        message: "Order created successfully",
      };
    } catch (error) {
      console.error("Order creation error:", error);
      throw new Error("Order creation failed");
    }
  }
);

// Process order (triggered when order is created)
export const processOrder = onDocumentCreated(
  {
    document: "orders/{orderId}",
    region: "europe-west1",
  },
  async (event) => {
    const order = event.data?.data() as Order;
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
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error);

      // Update order status to indicate error
      await db
        .collection("orders")
        .doc(orderId)
        .update({
          status: "pending",
          processingError:
            error instanceof Error ? error.message : "Unknown error",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
  }
);

// Get user orders
export const getUserOrders = onCall(
  { region: "europe-west1" },
  async (request) => {
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
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        success: true,
        orders,
      };
    } catch (error) {
      console.error("Error getting user orders:", error);
      throw new Error("Failed to get user orders");
    }
  }
);
