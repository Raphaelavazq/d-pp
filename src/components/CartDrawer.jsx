import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { gsap } from "gsap";

const CartDrawer = () => {
  const {
    items,
    isOpen,
    toggleCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
  } = useCart();

  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.set(".cart-drawer", { x: "100%" });
      gsap.set(".cart-overlay", { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          drawerRef.current,
          {
            x: 0,
            duration: 0.4,
            ease: "power3.out",
          },
          "-=0.1"
        )
        .fromTo(
          ".cart-item",
          {
            x: 50,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.2"
        );
    } else {
      const tl = gsap.timeline();
      tl.to(drawerRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power2.in",
      }).to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        "-=0.1"
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="cart-overlay absolute inset-0 bg-charcoal/20 backdrop-blur-sm"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="cart-drawer absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform translate-x-full border-l border-taupe/20"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-taupe/20 bg-cream/10">
            <h2
              className="text-xl font-bold text-charcoal"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Shopping Cart
            </h2>
            <button
              onClick={toggleCart}
              className="p-3 hover:bg-taupe/20 rounded-full transition-all duration-300 hover:scale-110"
            >
              <X size={20} className="text-charcoal" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag size={40} className="text-charcoal/60" />
                </div>
                <h3
                  className="text-xl font-bold text-charcoal mb-3"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Your cart is empty
                </h3>
                <p
                  className="text-charcoal/70 mb-8 font-light leading-relaxed"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Discover our curated collection of designer-inspired pieces
                </p>
                <Link
                  to="/shop"
                  onClick={toggleCart}
                  className="bg-charcoal text-white px-8 py-4 rounded-2xl hover:bg-charcoal/90 transition-all duration-300 font-semibold transform hover:scale-105"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {items.map((item, index) => (
                  <div
                    key={item.cartId}
                    className="cart-item flex items-center space-x-4 p-4 border border-taupe/20 rounded-2xl bg-cream/10 hover:bg-cream/20 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <img
                        src={item.images?.[0] || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-semibold text-charcoal truncate mb-1"
                        style={{ fontFamily: "Chillax, sans-serif" }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className="text-xs text-charcoal/60 mb-2 font-light"
                        style={{ fontFamily: "Chillax, sans-serif" }}
                      >
                        {item.selectedSize} • {item.selectedColor}
                      </p>
                      <p
                        className="text-sm font-bold text-charcoal"
                        style={{ fontFamily: "Chillax, sans-serif" }}
                      >
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-white rounded-xl p-1 border border-taupe/20">
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity - 1)
                          }
                          className="p-2 hover:bg-cream/50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Minus size={12} className="text-charcoal" />
                        </button>
                        <span
                          className="text-sm font-semibold w-8 text-center text-charcoal"
                          style={{ fontFamily: "Chillax, sans-serif" }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.cartId, item.quantity + 1)
                          }
                          className="p-2 hover:bg-cream/50 rounded-lg transition-all duration-200 hover:scale-110"
                        >
                          <Plus size={12} className="text-charcoal" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-700 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-taupe/20 p-6 space-y-6 bg-cream/5">
              <div
                className="flex justify-between text-xl font-bold text-charcoal"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="space-y-4">
                <Link
                  to="/cart"
                  onClick={toggleCart}
                  className="block w-full bg-white border-2 border-charcoal text-charcoal text-center py-4 rounded-2xl hover:bg-charcoal hover:text-white transition-all duration-300 font-semibold"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="block w-full bg-charcoal text-white text-center py-4 rounded-2xl hover:bg-charcoal/90 transition-all duration-300 font-semibold transform hover:scale-105"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
