import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, User, LogOut, ShoppingBag } from "lucide-react";
import { gsap } from "gsap";

const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  location,
  currentUser,
  logout,
}) => {
  const menuRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Show menu animation
      gsap.set(menuRef.current, { display: "block" });
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        contentRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.4, ease: "power2.out" }
      );
    } else {
      // Hide menu animation
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(contentRef.current, {
        x: "100%",
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(menuRef.current, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed inset-0 z-50 lg:hidden"
      style={{ display: "none" }}
    >
      {/* Overlay */}
      <button
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 border-0 cursor-default"
        onClick={onClose}
        aria-label="Close menu"
        type="button"
      />

      {/* Menu Content */}
      <div
        ref={contentRef}
        className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* User Section */}
          {currentUser ? (
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-rhode-light rounded-full flex items-center justify-center">
                    <User size={24} className="text-rhode-text" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">
                    {currentUser.displayName || "User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <User size={18} />
                  <span>Profile Settings</span>
                </Link>
                <Link
                  to="/orders"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShoppingBag size={18} />
                  <span>My Orders</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors w-full text-left"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="block w-full px-4 py-3 text-center border border-rhode-text text-rhode-text rounded-lg hover:bg-rhode-text hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={handleLinkClick}
                  className="block w-full px-4 py-3 text-center bg-rhode-text text-white rounded-lg hover:bg-rhode-text/90 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleLinkClick}
                className={`block text-lg font-semibold transition-colors ${
                  location.pathname === item.to
                    ? "text-rhode-dark"
                    : "text-gray-700 hover:text-rhode-dark"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
