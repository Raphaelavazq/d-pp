import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16">
      {/* Footer Content with grey background and constrained width */}
      <div className="w-full flex justify-center">
        <div className="max-w-6xl w-full px-6 lg:px-8 pt-12 pb-20 bg-[#f5f5f0] rounded-t-2xl">
          {/* Newsletter Signup - centered, no logo */}
          <div className="mb-16 text-center">
            <div className="max-w-md mx-auto">
              <p className="mb-2 text-base font-medium">
                Join us on the düpp journey.
              </p>
              <p className="mb-4 text-gray-600">
                Get skincare tips, exclusive offers & behind-the-scenes updates.
              </p>
              <form className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="px-4 py-2 border border-gray-400 text-sm w-full sm:max-w-xs focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 text-sm font-semibold"
                >
                  SUBSCRIBE
                </button>
              </form>
              <p className="mt-2 text-xs text-gray-500">
                By signing up, you agree to our{" "}
                <Link
                  to="/privacy"
                  className="underline transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 border-t border-gray-300 pt-12 pb-12">
            {/* NAVIGATE */}
            <div>
              <h4
                className="text-xl md:text-xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Navigate
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/shop"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Shop
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link
                    to="/impact"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Impact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vlog"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    VLOG
                  </Link>
                </li>
              </ul>
            </div>

            {/* SOCIAL */}
            <div>
              <h4
                className="text-xl md:text-xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Social
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    YouTube
                  </a>
                </li>
                <li>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    TikTok
                  </a>
                </li>
              </ul>
            </div>

            {/* OFFICIAL */}
            <div>
              <h4
                className="text-xl md:text-xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Official
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/privacy"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/accessibility"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Accessibility
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h4
                className="text-xl md:text-xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/contact"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    We're here M–F 9am – 5pm CET
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Drop us a note anytime
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Do Not Sell / Share
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookie"
                    className="transition-all duration-200 hover:text-white hover:bg-[#23231f] hover:rounded-md hover:px-2 hover:py-1"
                  >
                    Cookie Preferences
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Legal Bar */}
          <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-300">
            © 2025 düpp. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
