#!/bin/bash

# 🚀 Complete Authentication Setup Script
# This script sets up Firebase authentication and connects everything

echo "🔥 Setting up Firebase Authentication for düpp E-Commerce"
echo "=================================================="

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Install Firebase dependencies
echo "📦 Installing Firebase dependencies..."
npm install firebase

# Install authentication-related dependencies
echo "📦 Installing additional dependencies..."
npm install react-router-dom @stripe/react-stripe-js @stripe/stripe-js

echo "✅ Dependencies installed successfully!"

# Create Firebase project setup instructions
echo ""
echo "🔧 FIREBASE PROJECT SETUP REQUIRED:"
echo "=================================="
echo "1. Go to https://console.firebase.google.com/"
echo "2. Create a new project or select existing project"
echo "3. Enable Authentication:"
echo "   - Go to Authentication > Sign-in method"
echo "   - Enable Email/Password"
echo "   - Enable Google sign-in"
echo "4. Create Firestore Database:"
echo "   - Go to Firestore Database"
echo "   - Create database in test mode"
echo "5. Get your Firebase config:"
echo "   - Go to Project Settings > General"
echo "   - Scroll down to 'Your apps'"
echo "   - Add web app or view existing config"
echo ""

# Create a Firebase config template
echo "📝 Creating Firebase configuration template..."
cat > firebase-config-template.txt << 'EOF'
// Replace the values in .env with your actual Firebase config:

VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-actual-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

// Find these values in Firebase Console > Project Settings > General > Your apps
EOF

# Update .env with better defaults for development
echo "🔧 Updating .env configuration..."
cat > .env << 'EOF'
# Firebase Configuration - UPDATE THESE WITH YOUR ACTUAL VALUES
VITE_FIREBASE_API_KEY=demo-api-key-replace-me
VITE_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-project-replace-me
VITE_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=demo-app-id-replace-me
VITE_FIREBASE_MEASUREMENT_ID=G-DEMO123456

# Development Mode (set to false when using real Firebase project)
VITE_USE_FIREBASE_EMULATOR=false

# Other API Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_demo_key
VITE_ALIEXPRESS_API_KEY=your_aliexpress_api_key
EOF

# Update Firebase config to disable emulators by default
echo "🔧 Updating Firebase configuration..."
cat > src/config/firebase.js << 'EOF'
// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
EOF

# Fix the useAuth hook import path
echo "🔧 Fixing useAuth hook..."
cat > src/hooks/useAuth.js << 'EOF'
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
EOF

# Create a click-outside hook for the user menu
echo "🔧 Creating click-outside hook..."
cat > src/hooks/useClickOutside.js << 'EOF'
import { useEffect, useRef } from 'react';

export const useClickOutside = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [callback]);

  return ref;
};
EOF

# Update Navbar to use click-outside functionality
echo "🔧 Updating Navbar with proper user menu..."
cat > src/components/Navbar.jsx << 'EOF'
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, User, Search, LogOut } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useClickOutside } from "../hooks/useClickOutside";
import CartDrawer from "./CartDrawer";
import MobileMenu from "./MobileMenu";
import { gsap } from "gsap";
import logoSvg from "../assets/logo.svg";

const navItems = [
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Impact", to: "/impact" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getTotalItems, toggleCart } = useCart();
  const { currentUser, logout, loading } = useAuth();
  const location = useLocation();
  const logoRef = useRef(null);
  const navRef = useRef(null);
  
  // Close user menu when clicking outside
  const userMenuRef = useClickOutside(() => setShowUserMenu(false));

  useEffect(() => {
    // Initial navbar animation
    const tl = gsap.timeline();
    tl.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only hide if scrolling down past 100px
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      // Show if scrolling up or at the top
      else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-rhode-cream rounded-t-3xl shadow-sm">
            <div className="grid grid-cols-3 items-center h-20 px-8">
              <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
              <div className="flex justify-center">
                <div className="animate-pulse bg-gray-200 h-12 w-12 rounded"></div>
              </div>
              <div className="flex justify-end space-x-2">
                <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
                <div className="animate-pulse bg-gray-200 h-10 w-10 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 w-full z-50 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        onMouseEnter={() => setIsVisible(true)}
      >
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-rhode-cream rounded-t-3xl shadow-sm">
            <div className="grid grid-cols-3 items-center h-20 px-8">
              {/* Left Side - Logo on mobile, Navigation on desktop */}
              <div className="flex items-center">
                {/* Logo - Mobile */}
                <Link to="/" className="md:hidden flex items-center">
                  <img
                    ref={logoRef}
                    src={logoSvg}
                    alt="düpp logo"
                    className="h-10 w-auto"
                  />
                </Link>

                {/* Navigation - Desktop */}
                <div className="hidden md:flex items-center space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`text-lg font-normal text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300 uppercase ${
                        location.pathname === item.to ? "text-rhode-dark" : ""
                      }`}
                      style={{ fontFamily: "Aglonema, serif" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Center - Logo on desktop only */}
              <div className="hidden md:flex items-center justify-center">
                <Link to="/" className="flex items-center">
                  <img
                    ref={logoRef}
                    src={logoSvg}
                    alt="düpp logo"
                    className="h-14 lg:h-16 w-auto"
                  />
                </Link>
              </div>

              {/* Empty center space on mobile */}
              <div className="md:hidden"></div>

              {/* Right Actions - Desktop */}
              <div className="hidden md:flex items-center space-x-4 justify-end">
                <button className="p-3 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300 hover:scale-110">
                  <Search size={20} />
                </button>
                
                {/* User Authentication */}
                {currentUser ? (
                  <div className="relative" ref={userMenuRef}>
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-3 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300 hover:scale-110 flex items-center space-x-2"
                      title={currentUser.displayName || currentUser.email}
                    >
                      <User size={20} />
                      <span className="hidden lg:block text-sm font-medium max-w-20 truncate">
                        {currentUser.displayName || currentUser.email?.split('@')[0]}
                      </span>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {currentUser.displayName || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User size={16} className="inline mr-2" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <ShoppingBag size={16} className="inline mr-2" />
                          My Orders
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut size={16} className="inline mr-2" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm text-rhode-text hover:text-rhode-text/80 transition-colors font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-6 py-2 text-sm bg-rhode-text text-rhode-light rounded-full hover:bg-rhode-text/90 transition-all duration-300 hover:scale-105 font-medium"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
                
                <button
                  onClick={toggleCart}
                  className="relative p-3 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ShoppingBag size={20} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rhode-text text-rhode-light text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Menu Button - Mobile Only */}
              <div className="md:hidden flex items-center justify-end space-x-2">
                {/* Mobile Cart */}
                <button
                  onClick={toggleCart}
                  className="relative p-2 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300"
                >
                  <ShoppingBag size={20} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rhode-text text-rhode-light text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
                
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300"
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navItems={navItems}
        location={location}
        currentUser={currentUser}
        logout={handleLogout}
      />

      <CartDrawer />
    </>
  );
};

export default Navbar;
EOF

# Update MobileMenu to include authentication
echo "🔧 Updating MobileMenu with authentication..."
cat > src/components/MobileMenu.jsx << 'EOF'
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
                <div className="w-12 h-12 bg-rhode-light rounded-full flex items-center justify-center">
                  <User size={24} className="text-rhode-text" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {currentUser.displayName || 'User'}
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
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors w-full text-left"
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
EOF

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "🚀 NEXT STEPS:"
echo "1. Update your Firebase configuration in .env file"
echo "2. Start the development server: npm run dev"
echo "3. Test the authentication system"
echo ""
echo "📁 Files created/updated:"
echo "  ✅ setup-auth.sh (this script)"
echo "  ✅ firebase-config-template.txt (config guide)"
echo "  ✅ .env (updated with placeholders)"
echo "  ✅ src/config/firebase.js (updated)"
echo "  ✅ src/hooks/useAuth.js (fixed)"
echo "  ✅ src/hooks/useClickOutside.js (new)"
echo "  ✅ src/components/Navbar.jsx (enhanced)"
echo "  ✅ src/components/MobileMenu.jsx (enhanced)"
echo ""
echo "🔥 Your authentication system is now fully connected!"
echo "📖 See firebase-config-template.txt for Firebase setup instructions"
echo ""
echo "🌐 Start your app with: npm run dev"
echo "🔗 Then visit: http://localhost:5173/d-pp/"
