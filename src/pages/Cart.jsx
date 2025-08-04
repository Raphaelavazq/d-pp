import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-normal text-charcoal mb-8">
            Cart
          </h1>
          <p className="text-xl text-charcoal/70 font-light mb-8">
            Your cart is empty
          </p>
          <Link
            to="/shop"
            className="inline-block bg-charcoal text-white px-8 py-3 rounded-full font-medium hover:bg-charcoal/90 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-6xl font-normal text-charcoal">
            Cart ({items.length})
          </h1>
          <button
            onClick={clearCart}
            className="text-charcoal/70 hover:text-charcoal font-light underline"
          >
            Clear all
          </button>
        </div>

        {/* Cart Items */}
        <div className="space-y-8 mb-12">
          {items.map((item) => (
            <div
              key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
              className="flex gap-6 border-b border-gray-100 pb-8"
            >
              {/* Product Image */}
              <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-charcoal mb-1">
                  {item.name}
                </h3>

                {/* Size & Color */}
                <div className="flex gap-4 text-sm text-charcoal/70 mb-2">
                  {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  {item.selectedColor && (
                    <span>Color: {item.selectedColor}</span>
                  )}
                </div>

                {/* Price */}
                <p className="text-lg font-medium text-charcoal mb-3">
                  €{item.price.toFixed(2)}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedSize,
                          item.selectedColor,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-charcoal transition-colors"
                    >
                      -
                    </button>
                    <span className="text-charcoal font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.selectedSize,
                          item.selectedColor,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:border-charcoal transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(
                        item.id,
                        item.selectedSize,
                        item.selectedColor
                      )
                    }
                    className="text-charcoal/70 hover:text-charcoal font-light underline text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border-t border-gray-100 pt-8">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-medium text-charcoal">Total</span>
            <span className="text-2xl font-medium text-charcoal">
              €{getTotalPrice().toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/shop"
              className="flex-1 text-center border border-charcoal text-charcoal px-8 py-4 rounded-full font-medium hover:bg-charcoal hover:text-white transition-colors duration-200"
            >
              Continue Shopping
            </Link>
            <Link
              to="/checkout"
              className="flex-1 text-center bg-charcoal text-white px-8 py-4 rounded-full font-medium hover:bg-charcoal/90 transition-colors duration-200"
            >
              CHECKOUT - €{getTotalPrice().toFixed(2)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
