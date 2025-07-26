import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";
import { useCart } from "../hooks/useCart";
import CartDrawer from "./CartDrawer";
import { gsap } from "gsap";
import logoSvg from "../assets/logo.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOverVideo, setIsOverVideo] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { getTotalItems, toggleCart } = useCart();
  const location = useLocation();
  const logoRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    // Initial navbar animation
    const tl = gsap.timeline();
    tl.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    // Scroll detection for video section and navbar visibility
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (location.pathname === "/") {
        const videoSection = document.querySelector("video");

        if (videoSection) {
          const videoHeight = videoSection.offsetHeight;
          const threshold = videoHeight - 100;

          setIsOverVideo(currentScrollY < threshold);

          // Only apply hide/show logic when not over video (when grey bar is visible)
          if (currentScrollY >= threshold) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              // Scrolling down - hide navbar
              setIsVisible(false);
            } else {
              // Scrolling up - show navbar
              setIsVisible(true);
            }
          } else {
            // Always show when over video
            setIsVisible(true);
          }
        } else {
          setIsOverVideo(false);
          // Apply hide/show logic for other sections
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
        }
      } else {
        setIsOverVideo(false);
        // Apply hide/show logic for other pages
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname, lastScrollY]);

  const navItems = [
    { label: "Shop", to: "/shop" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <>
      {/* Hover area at top of screen to trigger navbar */}
      {!isOverVideo && (
        <div
          className="fixed top-0 left-0 right-0 h-20 z-40"
          onMouseEnter={() => setIsVisible(true)}
        />
      )}

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isOverVideo
            ? "bg-transparent translate-y-0"
            : `bg-bluegray mx-4 mt-4 rounded-2xl shadow-xl ${
                isVisible ? "translate-y-0" : "-translate-y-full"
              }`
        }`}
        onMouseEnter={() => !isOverVideo && setIsVisible(true)}
        onMouseLeave={() => !isOverVideo && setIsVisible(false)}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img
                ref={logoRef}
                src={logoSvg}
                alt="düpp logo"
                className="h-10 w-auto transition-all duration-300 hover:opacity-80"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-lg font-normal text-white leading-relaxed hover:text-cream transition-all duration-300 lowercase ${
                    location.pathname === item.to ? "text-cream" : ""
                  }`}
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110">
                <Search size={20} />
              </button>
              <button className="p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110">
                <User size={20} />
              </button>
              <button
                onClick={toggleCart}
                className="relative p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110"
              >
                <ShoppingBag size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cream text-charcoal text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/10 bg-bluegray/90">
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block text-white text-lg font-normal leading-relaxed hover:text-cream transition-all duration-300 lowercase"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                {/* Mobile Actions */}
                <div className="flex items-center space-x-4 pt-4 border-t border-white/10">
                  <button className="p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110">
                    <Search size={20} />
                  </button>
                  <button className="p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110">
                    <User size={20} />
                  </button>
                  <button
                    onClick={() => {
                      toggleCart();
                      setIsMenuOpen(false);
                    }}
                    className="relative p-3 bg-white/10 backdrop-blur-sm text-white hover:bg-cream hover:text-charcoal rounded-full transition-all duration-300 hover:scale-110"
                  >
                    <ShoppingBag size={20} />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-cream text-charcoal text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <CartDrawer />
    </>
  );
};

export default Navbar;
