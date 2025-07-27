import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, Search, X } from "lucide-react";
import { useCart } from "../hooks/useCart";

const MobileMenu = ({ isOpen, onClose, navItems, location }) => {
  const { getTotalItems, toggleCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-rhode-cream shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-rhode-text/10">
            <h2
              className="text-xl font-normal text-rhode-text uppercase tracking-wide"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Menu
            </h2>
            <button
              onClick={onClose}
              className="p-2 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 px-6 py-8">
            <nav className="space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block text-2xl font-normal text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300 uppercase tracking-wide ${
                    location.pathname === item.to ? "text-rhode-dark" : ""
                  }`}
                  style={{ fontFamily: "Aglonema, serif" }}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Additional Links */}
            <div className="mt-12 pt-8 border-t border-rhode-text/10">
              <div className="space-y-4">
                <Link
                  to="/contact"
                  className="block text-lg font-normal text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                  onClick={onClose}
                >
                  Contact Us
                </Link>
                <Link
                  to="/faq"
                  className="block text-lg font-normal text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                  onClick={onClose}
                >
                  FAQ
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-6 border-t border-rhode-text/10">
            <div className="flex items-center justify-center space-x-4">
              <button className="p-4 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300 hover:scale-110">
                <Search size={24} />
              </button>
              <button className="p-4 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300 hover:scale-110">
                <User size={24} />
              </button>
              <button
                onClick={() => {
                  toggleCart();
                  onClose();
                }}
                className="relative p-4 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300 hover:scale-110"
              >
                <ShoppingBag size={24} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rhode-text text-rhode-light text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
