import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <section
      data-section="footer"
      className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center justify-center"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <footer className="text-center lg:text-left">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-8 sm:mb-10 md:mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
              <h3
                className="text-2xl sm:text-3xl font-medium text-rhode-text"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                düpp
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-rhode-text/70 max-w-md mx-auto lg:mx-0 leading-relaxed">
                Soft, simple, and sensibly priced. Discover our curated
                collection of essentials that blend luxury with everyday
                simplicity.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  to="/shop"
                  className="bg-rhode-text text-white px-4 py-2 sm:px-6 sm:py-3 text-sm rounded-full hover:bg-rhode-text/90 transition-colors font-medium"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Shop Now
                </Link>
                <Link
                  to="/about"
                  className="border border-rhode-text text-rhode-text px-4 py-2 sm:px-6 sm:py-3 text-sm rounded-full hover:bg-rhode-text hover:text-white transition-colors font-medium"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-base sm:text-lg font-medium text-rhode-text">
                Quick Links
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-rhode-text/70">
                <li>
                  <Link
                    to="/shop"
                    className="hover:text-rhode-text transition-colors"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-rhode-text transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-rhode-text transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="hover:text-rhode-text transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Care */}
            <div className="space-y-4 sm:space-y-6">
              <h4 className="text-base sm:text-lg font-medium text-rhode-text">
                Customer Care
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-rhode-text/70">
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-rhode-text transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-rhode-text transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accessibility"
                    className="hover:text-rhode-text transition-colors"
                  >
                    Accessibility
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-6 sm:pt-8 border-t border-rhode-text/10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-xs sm:text-sm text-rhode-text/60">
              © 2024 düpp. All rights reserved.
            </p>
            <div className="flex space-x-4 sm:space-x-6">
              <a
                href="#"
                className="text-rhode-text/60 hover:text-rhode-text transition-colors"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.291L12.017 8.806l6.89 6.891c-.875.801-2.026 1.291-3.323 1.291H8.449z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-rhode-text/60 hover:text-rhode-text transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Footer;
