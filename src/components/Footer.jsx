import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-bluegray/90 backdrop-blur-md border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div
              className="text-4xl font-extrabold text-cream"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              düpp
            </div>
            <p
              className="text-white text-lg leading-relaxed font-normal"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Redefining luxury through accessibility. Designer-inspired pieces
              that celebrate style without compromise.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3
              className="text-xl font-bold mb-6 text-white"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Shop
            </h3>
            <ul className="space-y-3 text-base">
              <li>
                <Link
                  to="/shop/handbags"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Handbags
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/shoes"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Shoes
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/accessories"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/watches"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Watches
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/clothing"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Clothing
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/beauty"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Beauty
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3
              className="text-xl font-bold mb-6 text-white"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Support
            </h3>
            <ul className="space-y-3 text-base">
              <li>
                <Link
                  to="/contact"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/size-guide"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Size Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className="text-xl font-bold mb-6 text-white"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Stay in Touch
            </h3>
            <p
              className="text-white text-base mb-6 leading-relaxed font-normal"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Be the first to discover new collections and exclusive offers.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl border border-white/20 focus:border-white/40 focus:outline-none placeholder-white/50 transition-all duration-300"
                style={{ fontFamily: "Chillax, sans-serif" }}
              />
              <button
                className="w-full bg-cream text-charcoal py-4 rounded-2xl hover:bg-cream/90 transition-all duration-300 font-semibold transform hover:scale-105"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div
            className="text-base text-white font-normal flex items-center space-x-2"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            <span>© 2024 düpp. Made with</span>
            <Heart size={16} className="text-white" fill="currentColor" />
            <span>for style lovers.</span>
          </div>
          <div className="flex space-x-8 mt-6 md:mt-0 text-base">
            <Link
              to="/privacy"
              className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-white hover:text-cream transition-all duration-300 hover:tracking-wide font-normal"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
