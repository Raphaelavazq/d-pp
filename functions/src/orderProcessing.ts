import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

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
export const createPaymentIntent = functions.https.onCall(
  async (data: any, context: any) => {
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
          throw new functions.https.HttpsError(
            "not-found",
            `Product ${item.productId} not found`
          );
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
      throw new functions.https.HttpsError(
        "internal",
        "Payment intent creation failed"
      );
    }
  }
);

// Create order (Step 2 - after successful payment)
export const createOrder = functions.https.onCall(
  async (data: any, context: any) => {
    try {
      const { items, paymentIntentId, userId } = data;

      // Verify payment intent
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== "succeeded") {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Payment not completed"
        );
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
          throw new functions.https.HttpsError(
            "not-found",
            `Product ${item.productId} not found`
          );
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
        userId: userId || context.auth?.uid || "guest",
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total: calculatedTotal,
        status: "pending",
        paymentStatus: "paid",
        shippingAddress: paymentIntent.shipping?.address
          ? {
              firstName: paymentIntent.shipping.name?.split(" ")[0] || "",
              lastName:
                paymentIntent.shipping.name?.split(" ").slice(1).join(" ") ||
                "",
              address1: paymentIntent.shipping.address.line1 || "",
              address2: paymentIntent.shipping.address.line2 || "",
              city: paymentIntent.shipping.address.city || "",
              state: paymentIntent.shipping.address.state || "",
              zipCode: paymentIntent.shipping.address.postal_code || "",
              country: paymentIntent.shipping.address.country || "",
            }
          : ({} as Address),
        billingAddress: {} as Address, // Will be populated if different from shipping
        createdAt: admin.firestore.FieldValue.serverTimestamp() as any,
        updatedAt: admin.firestore.FieldValue.serverTimestamp() as any,
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
        } else {
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
      throw new functions.https.HttpsError("internal", "Order creation failed");
    }
  }
);

// Update order status
export const updateOrderStatus = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    try {
      const { orderId, status, trackingNumber } = data;

      const orderRef = db.collection("orders").doc(orderId);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Order not found");
      }

      const updateData: any = {
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }

      await orderRef.update(updateData);

      // Send notification email
      if (status === "shipped" && trackingNumber) {
        const orderData = { id: orderId, ...orderDoc.data() } as Order;
        await sendShippingNotification(orderData, trackingNumber);
      }

      return { success: true };
    } catch (error) {
      console.error("Order update error:", error);
      throw new functions.https.HttpsError("internal", "Order update failed");
    }
  }
);

// Process order (triggered when order is created)
export const processOrder = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data() as Order;
    const orderId = context.params.orderId;

    try {
      // Group items by supplier
      const supplierOrders = new Map<string, OrderItem[]>();

      for (const item of order.items) {
        if (!supplierOrders.has(item.supplierId)) {
          supplierOrders.set(item.supplierId, []);
        }
        supplierOrders.get(item.supplierId)!.push(item);
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
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error);

      // Update order status to failed
      await snap.ref.update({
        status: "cancelled",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  });

// Cancel order
export const cancelOrder = functions.https.onCall(
  async (data: any, context: any) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "Authentication required"
      );
    }

    try {
      const { orderId, reason } = data;
      const userId = context.auth.uid;

      const orderRef = db.collection("orders").doc(orderId);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Order not found");
      }

      const order = orderDoc.data() as Order;

      // Check if user owns the order or is admin
      if (order.userId !== userId && !context.auth.token.admin) {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Access denied"
        );
      }

      // Can only cancel pending or processing orders
      if (!["pending", "processing"].includes(order.status)) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "Order cannot be cancelled"
        );
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
    } catch (error) {
      console.error("Order cancellation error:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Order cancellation failed"
      );
    }
  }
);

async function sendShippingNotification(order: Order, trackingNumber: string) {
  // Implementation for sending shipping notification email
  console.log(
    `Sending shipping notification for order ${order.id} with tracking ${trackingNumber}`
  );
  // This would integrate with your email service (SendGrid, etc.)
}

export const orderProcessing = {
  processOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};
