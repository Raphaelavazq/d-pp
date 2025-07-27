import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="bg-bluegray text-white pt-16 pb-8"
      style={{ backgroundColor: "#B0BBC1" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span
                className="text-3xl font-bold bg-gradient-to-r from-cream to-white bg-clip-text text-transparent"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                düpp
              </span>
            </Link>
            <p
              className="font-light leading-relaxed mb-6 max-w-md"
              style={{ fontFamily: "Chillax, sans-serif", color: "#ffffff" }}
            >
              Only quality düpp here. Premium skincare that's 100% vegan,
              cruelty-free, and plants a tree with every purchase.
            </p>
            <div className="flex items-center space-x-4">
              <span
                className="text-cream font-medium text-sm"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Follow us:
              </span>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-cream hover:text-charcoal transition-colors"
                >
                  <span className="text-sm">𝕏</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-cream hover:text-charcoal transition-colors"
                >
                  <span className="text-sm">IG</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-cream hover:text-charcoal transition-colors"
                >
                  <span className="text-sm">TT</span>
                </a>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3
              className="text-cream font-semibold mb-4 text-sm uppercase tracking-wide"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/shop"
                  className="hover:text-cream transition-colors font-light"
                  style={{
                    fontFamily: "Chillax, sans-serif",
                    color: "#ffffff",
                  }}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=serums"
                  className="hover:text-cream transition-colors font-light"
                  style={{
                    fontFamily: "Chillax, sans-serif",
                    color: "#ffffff",
                  }}
                >
                  Serums
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=moisturizers"
                  className="hover:text-cream transition-colors font-light"
                  style={{
                    fontFamily: "Chillax, sans-serif",
                    color: "#ffffff",
                  }}
                >
                  Moisturizers
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=cleansers"
                  className="hover:text-cream transition-colors font-light"
                  style={{
                    fontFamily: "Chillax, sans-serif",
                    color: "#ffffff",
                  }}
                >
                  Cleansers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3
              className="text-cream font-semibold mb-4 text-sm uppercase tracking-wide"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="hover:text-cream transition-colors font-light"
                  style={{
                    fontFamily: "Chillax, sans-serif",
                    color: "#ffffff",
                  }}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/impact"
                  className="hover:text-cream transition-colors font-light"
                  style={{
                    fontFamily: "Chillax, sans-serif",
                    color: "#ffffff",
                  }}
                >
                  Our Impact
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-cream transition-colors font-light"
                  style={{
                    fontFamily: "Chillax, sans-serif",
                    color: "#ffffff",
                  }}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="hover:text-cream transition-colors font-light"
                  style={{
                    fontFamily: "Chillax, sans-serif",
                    color: "#ffffff",
                  }}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3
              className="text-cream font-semibold mb-3"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Join the düpp community
            </h3>
            <p
              className="font-light text-sm mb-4"
              style={{ fontFamily: "Chillax, sans-serif", color: "#ffffff" }}
            >
              Get early access to new products and sustainability updates.
            </p>
            <div className="flex max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-l-full text-white placeholder-white/50 focus:outline-none focus:border-cream"
                style={{ fontFamily: "Chillax, sans-serif" }}
              />
              <button
                className="px-6 py-2 bg-cream text-charcoal font-medium rounded-r-full hover:bg-white transition-colors"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p
              className="text-sm font-light"
              style={{ fontFamily: "Chillax, sans-serif", color: "#ffffff" }}
            >
              © 2025 düpp. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/privacy"
                className="hover:text-cream text-sm font-light transition-colors"
                style={{ fontFamily: "Chillax, sans-serif", color: "#ffffff" }}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-cream text-sm font-light transition-colors"
                style={{ fontFamily: "Chillax, sans-serif", color: "#ffffff" }}
              >
                Terms of Service
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-cream text-lg">🌱</span>
              <span
                className="text-sm font-light"
                style={{ fontFamily: "Chillax, sans-serif", color: "#ffffff" }}
              >
                Carbon neutral shipping
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-cream text-lg">🐰</span>
              <span
                className="text-sm font-light"
                style={{ fontFamily: "Chillax, sans-serif", color: "#ffffff" }}
              >
                Cruelty-free certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
