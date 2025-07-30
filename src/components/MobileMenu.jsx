import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { X, User, LogOut, ShoppingBag } from "lucide-react";
import { gsap } from "gsap";

const MobileMenu = ({ isOpen, onClose, navItems, location, currentUser, logout }) => {
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
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Menu Content */}
      <div
        ref={contentRef}
        className="absolute right-0 top-0 h-full w-80 bg-gradient-to-br from-white to-rhode-cream/20 backdrop-blur-lg shadow-2xl border-l border-white/20"
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-[Aglonema] text-rhode-text">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-rhode-text/10 rounded-xl transition-colors"
            >
              <X size={24} className="text-rhode-text" />
            </button>
          </div>

          {/* User Section */}
          {currentUser ? (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30 shadow-lg">
              <div className="flex items-center space-x-4 mb-6">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-4 border-white/50"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-rhode-cream to-rhode-text/20 rounded-full flex items-center justify-center border-4 border-white/50">
                    <User size={28} className="text-rhode-text" />
                  </div>
                )}
                <div>
                  <p className="font-[Chillax] font-semibold text-rhode-text text-lg">
                    {currentUser.displayName || 'User'}
                  </p>
                  <p className="text-sm text-rhode-text/60 truncate font-[Chillax]">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Link
                  to="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 transition-all duration-200 border border-rhode-text/10"
                >
                  <div className="w-10 h-10 bg-rhode-text/10 rounded-lg flex items-center justify-center">
                    <User size={20} className="text-rhode-text" />
                  </div>
                  <div>
                    <span className="font-[Chillax] font-medium text-rhode-text">Profile Settings</span>
                    <p className="text-xs text-rhode-text/60 font-[Chillax]">Manage account</p>
                  </div>
                </Link>
                
                <Link
                  to="/orders"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 transition-all duration-200 border border-rhode-text/10"
                >
                  <div className="w-10 h-10 bg-rhode-text/10 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={20} className="text-rhode-text" />
                  </div>
                  <div>
                    <span className="font-[Chillax] font-medium text-rhode-text">My Orders</span>
                    <p className="text-xs text-rhode-text/60 font-[Chillax]">Track purchases</p>
                  </div>
                </Link>

                <Link
                  to="/wishlist"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-white/50 transition-all duration-200 border border-rhode-text/10"
                >
                  <div className="w-10 h-10 bg-rhode-text/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-rhode-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-[Chillax] font-medium text-rhode-text">Wishlist</span>
                    <p className="text-xs text-rhode-text/60 font-[Chillax]">Saved items</p>
                  </div>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 w-full text-left border border-red-200"
                >
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <LogOut size={20} />
                  </div>
                  <div>
                    <span className="font-[Chillax] font-medium">Sign Out</span>
                    <p className="text-xs text-red-500 font-[Chillax]">End session</p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/30 shadow-lg">
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="block w-full px-6 py-3 text-center border-2 border-rhode-text text-rhode-text rounded-xl hover:bg-rhode-text hover:text-white transition-all duration-300 font-[Chillax] font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={handleLinkClick}
                  className="block w-full px-6 py-3 text-center bg-gradient-to-r from-rhode-text to-rhode-text/90 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-[Chillax] font-medium"
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
                className={`block text-lg font-medium transition-colors ${
                  location.pathname === item.to
                    ? "text-rhode-dark"
                    : "text-gray-700 hover:text-rhode-dark"
                }`}
                style={{ fontFamily: "Aglonema, serif" }}
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
