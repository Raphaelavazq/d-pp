import React, { useState } from "react";
import {
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

const CheckoutForm = ({ onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (error) {
        setMessage(error.message);
        onError(error);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Create order in Firestore
        const createOrder = httpsCallable(functions, "createOrder");

        const orderData = {
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
            title: item.title,
            image: item.image,
          })),
          paymentIntentId: paymentIntent.id,
          total: getTotalPrice(),
          userId: user?.uid,
        };

        await createOrder(orderData);

        clearCart();
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setMessage(err.message);
      onError(err);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Shipping Address
        </h3>
        <AddressElement
          options={{
            mode: "shipping",
            allowedCountries: ["US", "CA"],
          }}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Details
        </h3>
        <PaymentElement />
      </div>

      {message && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${
          isProcessing || !stripe || !elements
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Processing...</span>
          </div>
        ) : (
          `Pay $${getTotalPrice().toFixed(2)}`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
