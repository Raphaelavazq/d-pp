import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../services/stripeService";
import CheckoutForm from "../components/CheckoutForm";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../services/stripeService";
import CheckoutForm from "../components/CheckoutForm";
import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebase";

const Checkout = () => {
  const { items, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to cart if no items
    if (!items || items.length === 0) {
      navigate("/cart");
      return;
    }

    // Create payment intent when component mounts
    createPaymentIntent();
  }, [items, navigate]);

  const createPaymentIntent = async () => {
    try {
      setIsLoading(true);
      const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");
      
      const result = await createPaymentIntent({
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          title: item.title,
        })),
        userId: user?.uid,
      });

      setClientSecret(result.data.clientSecret);
    } catch (err) {
      console.error("Error creating payment intent:", err);
      setError("Failed to initialize payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log("Payment succeeded:", paymentIntent);
    navigate("/order-confirmation", { 
      state: { 
        paymentIntentId: paymentIntent.id,
        orderTotal: getTotalPrice() 
      } 
    });
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    setError(error.message || "Payment failed. Please try again.");
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const stripeOptions = {
    clientSecret,
    appearance,
  };

  if (isLoading) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing secure checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            {clientSecret && (
              <Elements stripe={stripePromise} options={stripeOptions}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            )}
          </div>
              {/* Contact Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === "paypal"}
                      onChange={handleInputChange}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span>PayPal</span>
                  </label>
                </div>
              </div>

              {/* Demo Card Info */}
              {formData.paymentMethod === "card" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">
                    Demo Payment
                  </h3>
                  <p className="text-sm text-blue-800">
                    This is a demo checkout. No real payment will be processed.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary-600 text-white py-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing
                  ? "Processing..."
                  : `Complete Order - €${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-xl shadow-sm h-fit">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.cartId} className="flex items-center space-x-4">
                  <img
                    src={item.images?.[0] || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {item.selectedSize} • {item.selectedColor} • Qty:{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : `€${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">€{tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">
                    €{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
