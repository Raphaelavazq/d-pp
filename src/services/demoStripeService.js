import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export class DemoStripeService {
  static async createPaymentIntent(items, userId) {
    // Simulate API delay
    await this.delay(800);

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      clientSecret: `pi_demo_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      amount: Math.round(total * 100), // Convert to cents
      currency: "eur",
      status: "requires_payment_method",
      metadata: {
        userId: userId || "guest",
        orderType: "demo_ecommerce",
      },
    };
  }

  static async confirmPayment(clientSecret, paymentDetails) {
    // Simulate payment processing delay
    await this.delay(2500);

    // Simulate card validation
    const cardNumber = paymentDetails.cardNumber?.replace(/\s/g, "") || "";

    // Simulate different card responses
    if (cardNumber.endsWith("0002")) {
      throw new Error(
        "Your card was declined. Please try a different payment method."
      );
    }
    if (cardNumber.endsWith("0004")) {
      throw new Error("Your card has expired. Please check your card details.");
    }
    if (cardNumber.endsWith("0005")) {
      throw new Error("Your card has insufficient funds.");
    }

    const paymentIntentId = clientSecret.split("_secret")[0];
    const amount =
      parseInt(clientSecret.split("_")[2]) ||
      Math.floor(Math.random() * 10000) + 1000;

    return {
      paymentIntent: {
        id: paymentIntentId,
        status: "succeeded",
        amount_received: amount,
        currency: "eur",
        payment_method: {
          type: "card",
          card: {
            brand: this.getCardBrand(cardNumber),
            last4: cardNumber.slice(-4) || "4242",
            exp_month: 12,
            exp_year: 2025,
            funding: "credit",
          },
        },
        created: Math.floor(Date.now() / 1000),
        metadata: {
          userId: paymentDetails.userId || "guest",
          orderType: "demo_ecommerce",
        },
        billing_details: paymentDetails.billing_details || {},
        shipping: paymentDetails.shipping || {},
      },
    };
  }

  static async createOrder(orderData, paymentIntent) {
    try {
      await this.delay(1000);

      const order = {
        ...orderData,
        id: `order_demo_${Date.now()}`,
        paymentIntentId: paymentIntent.id,
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: new Date(),
        updatedAt: new Date(),
        shippingStatus: "processing",
        trackingNumber: `DEMO${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        demoMode: true,
        paymentMethod: {
          brand: paymentIntent.payment_method.card.brand,
          last4: paymentIntent.payment_method.card.last4,
        },
      };

      // Save to Firestore (real database, demo order)
      const orderRef = await addDoc(collection(db, "orders"), order);

      // Simulate inventory update
      await this.updateInventory(orderData.items);

      // Simulate sending confirmation email
      await this.sendConfirmationEmail(order);

      return {
        ...order,
        firestoreId: orderRef.id,
      };
    } catch (error) {
      // In production, log to monitoring service instead
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  static async updateInventory(items) {
    // Demo: Simulate inventory update with delay
    for (let i = 0; i < items.length; i++) {
      await this.delay(150);
      // Demo: Updated inventory for product
    }
  }

  static async sendConfirmationEmail() {
    await this.delay(500);
    // Demo: Confirmation email sent and order confirmed
  }

  static getCardBrand(cardNumber) {
    if (cardNumber.startsWith("4")) return "visa";
    if (cardNumber.startsWith("5")) return "mastercard";
    if (cardNumber.startsWith("3")) return "amex";
    if (cardNumber.startsWith("6")) return "discover";
    return "visa"; // default
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Generate realistic test data
  static getTestCards() {
    return [
      { number: "4242 4242 4242 4242", brand: "Visa", result: "Success" },
      { number: "5555 5555 5555 4444", brand: "Mastercard", result: "Success" },
      { number: "4000 0000 0000 0002", brand: "Visa", result: "Declined" },
      { number: "4000 0000 0000 0004", brand: "Visa", result: "Expired" },
      {
        number: "4000 0000 0000 0005",
        brand: "Visa",
        result: "Insufficient Funds",
      },
    ];
  }
}
