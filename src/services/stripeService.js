import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export { stripePromise };

export const stripeService = {
  // Get Stripe instance
  getStripe: () => stripePromise,

  // Format price for display (convert cents to dollars)
  formatPrice: (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100);
  },

  // Convert dollar amount to cents for Stripe
  toCents: (amount) => {
    return Math.round(amount * 100);
  },

  // Create payment intent (will call Firebase function)
  createPaymentIntent: async (orderData) => {
    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  },

  // Process payment
  processPayment: async (stripe, elements) => {
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  },
};
