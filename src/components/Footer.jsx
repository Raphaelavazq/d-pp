import React from "react";
import { Link } from "react-router-dom";
import logoFooter from "../assets/logofooter.png";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-rhode-text text-sm">
      {/* Footer Content with white background */}
      <div className="w-full flex justify-center">
        <div className="max-w-6xl w-full px-6 lg:px-8 pt-12 pb-20">
          {/* Newsletter Signup with Logo on the left, in grey box */}
          <div className="mb-16 bg-[#f5f5f0] rounded-xl">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 px-6 py-8">
              <div className="flex-shrink-0 flex justify-center md:justify-start w-full md:w-auto mb-4 md:mb-0">
                <img
                  src={logoFooter}
                  alt="düpp footer logo"
                  className="w-[120px] md:w-[160px] lg:w-[200px] h-auto mx-auto md:mx-0"
                />
              </div>
              <div className="flex-1 w-full">
                <p className="mb-2 text-base font-medium">
                  Join us on the düpp journey.
                </p>
                <p className="mb-4 text-gray-600">
                  Get skincare tips, exclusive offers & behind-the-scenes
                  updates.
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
                  <Link to="/privacy" className="underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 border-t border-gray-300 pt-12 pb-12">
            {/* NAVIGATE */}
            <div>
              <h4 className="font-semibold mb-4 uppercase text-xs">Navigate</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/shop">Shop</Link>
                </li>
                <li>
                  <Link to="/about">Our Story</Link>
                </li>
                <li>
                  <Link to="/impact">Impact</Link>
                </li>
                <li>
                  <Link to="/vlog">VLOG</Link>
                </li>
              </ul>
            </div>

            {/* SOCIAL */}
            <div>
              <h4 className="font-semibold mb-4 uppercase text-xs">Social</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://instagram.com" target="_blank">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com" target="_blank">
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com" target="_blank">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>

            {/* OFFICIAL */}
            <div>
              <h4 className="font-semibold mb-4 uppercase text-xs">Official</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms</Link>
                </li>
                <li>
                  <Link to="/accessibility">Accessibility</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            {/* SUPPORT */}
            <div>
              <h4 className="font-semibold mb-4 uppercase text-xs">Support</h4>
              <ul className="space-y-2">
                <li>We're here M–F 9am – 5pm CET</li>
                <li>Drop us a note anytime</li>
                <li>
                  <Link to="/privacy">Do Not Sell / Share</Link>
                </li>
                <li>
                  <Link to="/cookie">Cookie Preferences</Link>
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
