import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { DemoStripeService } from "../services/demoStripeService";

const DemoCheckoutForm = ({ onSuccess, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState("form"); // form, processing, success
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Portugal",
    cardNumber: "4242 4242 4242 4242",
    expiry: "12/25",
    cvc: "123",
    nameOnCard: "",
  });
  const [errors, setErrors] = useState({});
  const [processingStep, setProcessingStep] = useState("");

  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required";
    if (!formData.cardNumber) newErrors.cardNumber = "Card number is required";
    if (!formData.expiry) newErrors.expiry = "Expiry date is required";
    if (!formData.cvc) newErrors.cvc = "CVC is required";
    if (!formData.nameOnCard) newErrors.nameOnCard = "Name on card is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);
    setCurrentStep("processing");

    try {
      // Step 1: Create payment intent
      setProcessingStep("Creating secure payment session...");
      const paymentIntent = await DemoStripeService.createPaymentIntent(
        items,
        user?.uid
      );

      // Step 2: Process payment
      setProcessingStep("Processing payment...");
      const result = await DemoStripeService.confirmPayment(
        paymentIntent.clientSecret,
        {
          cardNumber: formData.cardNumber,
          userId: user?.uid,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country,
            },
          },
          shipping: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country,
            },
          },
        }
      );

      // Step 3: Create order
      setProcessingStep("Creating your order...");
      const order = await DemoStripeService.createOrder(
        {
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor,
            image: item.images?.[0],
          })),
          subtotal: getTotalPrice(),
          shipping: getTotalPrice() > 50 ? 0 : 9.99,
          tax: getTotalPrice() * 0.08,
          total:
            getTotalPrice() +
            (getTotalPrice() > 50 ? 0 : 9.99) +
            getTotalPrice() * 0.08,
          userId: user?.uid,
          customerInfo: {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        },
        result.paymentIntent
      );

      // Step 4: Finalize
      setProcessingStep("Finalizing order...");
      await DemoStripeService.delay(800);

      // Clear cart and show success
      clearCart();
      setCurrentStep("success");

      // Call success callback after a brief delay
      setTimeout(() => {
        onSuccess(result.paymentIntent, order);
      }, 2000);
    } catch (error) {
      console.error("Demo payment error:", error);
      setCurrentStep("form");
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\s/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .substring(0, 19);
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  };

  const formatExpiry = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .substring(0, 5);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setFormData((prev) => ({ ...prev, expiry: formatted }));
  };

  if (currentStep === "processing") {
    return (
      <div className="text-center py-12">
        <div className="animate-spin h-16 w-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Processing Your Payment
        </h3>
        <p className="text-gray-600 mb-4">{processingStep}</p>
        <div className="max-w-md mx-auto bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-blue-600 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-blue-800 text-sm font-medium">
              Secure Processing
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
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
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 mb-4">
          Your order has been confirmed and you'll receive an email shortly.
        </p>
        <div className="animate-pulse text-primary-600">
          Redirecting to order confirmation...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Demo Mode Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
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
          </div>
          <div>
            <h3 className="text-blue-800 font-medium">Demo Mode Active</h3>
            <p className="text-blue-700 text-sm">
              This is a realistic demo - no real payments will be processed
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.firstName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.lastName ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shipping Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.address ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="123 Main Street"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.city ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Lisbon"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.postalCode ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="1000-001"
              />
              {errors.postalCode && (
                <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Information
          </h3>

          {/* Test Cards Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Test Cards Available:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {DemoStripeService.getTestCards().map((card, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">{card.number}</span>
                  <span
                    className={`font-medium ${
                      card.result === "Success"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {card.result}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.nameOnCard ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="John Doe"
              />
              {errors.nameOnCard && (
                <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.cardNumber ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="4242 4242 4242 4242"
                maxLength="19"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiry"
                value={formData.expiry}
                onChange={handleExpiryChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.expiry ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="MM/YY"
                maxLength="5"
              />
              {errors.expiry && (
                <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <input
                type="text"
                name="cvc"
                value={formData.cvc}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.cvc ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="123"
                maxLength="4"
              />
              {errors.cvc && (
                <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            isProcessing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Processing Payment...</span>
            </div>
          ) : (
            `Complete Demo Order - €${(getTotalPrice() + (getTotalPrice() > 50 ? 0 : 9.99) + getTotalPrice() * 0.08).toFixed(2)}`
          )}
        </button>
      </form>
    </div>
  );
};

export default DemoCheckoutForm;
