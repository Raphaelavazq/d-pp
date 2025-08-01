import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    paymentIntentId,
    orderId,
    orderTotal,
    trackingNumber,
    isDemoMode = false,
    order,
  } = location.state || {};

  // Redirect if no order data
  React.useEffect(() => {
    if (!paymentIntentId || !orderId) {
      navigate("/");
    }
  }, [paymentIntentId, orderId, navigate]);

  if (!paymentIntentId || !orderId) {
    return null;
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isDemoMode ? "Demo Order Confirmed!" : "Order Confirmed!"}
          </h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email
            shortly.
          </p>
        </div>

        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-blue-800 font-medium">
                Demo Mode Complete
              </span>
            </div>
            <p className="text-blue-700 text-sm mt-1">
              This was a demonstration order. No real payment was processed and
              no items will be shipped.
            </p>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Order Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Order Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium text-gray-900">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-sm text-gray-700">
                    {paymentIntentId}
                  </span>
                </div>
                {trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking:</span>
                    <span className="font-medium text-primary-600">
                      {trackingNumber}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold text-gray-900">
                    €{orderTotal?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {isDemoMode ? "Demo Complete" : "Confirmed"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Customer Information
              </h3>
              <div className="space-y-2">
                {order?.customerInfo && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="text-gray-900">
                        {order.customerInfo.firstName}{" "}
                        {order.customerInfo.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="text-gray-900">
                        {order.customerInfo.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Address:</span>
                      <div className="text-right text-gray-900">
                        <div>{order.customerInfo.address}</div>
                        <div>
                          {order.customerInfo.city},{" "}
                          {order.customerInfo.postalCode}
                        </div>
                        <div>{order.customerInfo.country}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order?.items && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                >
                  <img
                    src={item.image || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.selectedSize && `Size: ${item.selectedSize}`}
                      {item.selectedSize && item.selectedColor && " • "}
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      €{item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What's Next?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 text-sm font-semibold">
                  1
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Order Confirmation
                </h3>
                <p className="text-gray-600 text-sm">
                  {isDemoMode
                    ? "You've completed the demo checkout process successfully."
                    : "You'll receive an email confirmation within the next few minutes."}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 text-sm font-semibold">
                  2
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {isDemoMode ? "Explore More Features" : "Order Processing"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {isDemoMode
                    ? "This demo shows the complete e-commerce experience. In production, your order would be processed."
                    : "We'll start preparing your order and send you tracking information."}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary-600 text-sm font-semibold">
                  3
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {isDemoMode ? "Ready for Production" : "Shipping & Delivery"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {isDemoMode
                    ? "When ready for production, enable real Stripe payments and start processing actual orders."
                    : "Your items will be shipped within 1-2 business days with tracking information."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Continue Shopping
          </button>
          {user && (
            <button
              onClick={() => navigate("/profile")}
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              View Order History
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
