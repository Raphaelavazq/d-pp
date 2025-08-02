import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="bg-[#f5f5f0] rounded-t-2xl pt-12 pb-20 px-8">
          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
            {/* NAVIGATE */}
            <div>
              <h4 className="text-xl md:text-xl font-semibold mb-4 tracking-tight text-rhode-text leading-tight">
                Navigate
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/shop"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    to="/impact"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Impact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vlog"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    VLOG
                  </Link>
                </li>
              </ul>
            </div>

            {/* OFFICIAL */}
            <div>
              <h4 className="text-xl md:text-xl font-semibold mb-4 tracking-tight text-rhode-text leading-tight">
                Official
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accessibility"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h4 className="text-xl md:text-xl font-semibold mb-4 tracking-tight text-rhode-text leading-tight">
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/contact"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    We're here M–F 9am – 5pm CET
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Drop us a note anytime
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Do Not Sell / Share
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookie"
                    className="text-lg font-semibold text-rhode-text leading-relaxed hover:text-rhode-dark transition-all duration-300"
                  >
                    Cookie Preferences
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal Bar */}
          <div className="text-center text-xs text-gray-500 pt-8">
            © 2025 düpp. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
