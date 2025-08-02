import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import DemoCheckoutForm from "../components/DemoCheckoutForm";

const Checkout = () => {
  const { items, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // Redirect to cart if no items
  React.useEffect(() => {
    if (!items || items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  const handlePaymentSuccess = (paymentIntent, order) => {
    // Demo payment succeeded - redirect to confirmation
    navigate("/order-confirmation", {
      state: {
        paymentIntentId: paymentIntent.id,
        orderId: order.id,
        orderTotal: getTotalPrice(),
        trackingNumber: order.trackingNumber,
        isDemoMode: true,
        order: order,
      },
    });
  };

  const handlePaymentError = (error) => {
    console.error("Demo payment failed:", error);
    setError(error.message || "Payment failed. Please try again.");
  };

  const subtotal = getTotalPrice();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Don't render if no items
  if (!items || items.length === 0) {
    return null;
  }

  if (error) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-sm text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => setError(null)}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Demo Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <DemoCheckoutForm
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
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

            {/* Security Badge */}
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-orange-800 font-medium">
                  Demo Mode - Test Environment
                </span>
              </div>
              <p className="text-xs text-orange-700 mt-1">
                This is a realistic demo with full order processing simulation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
