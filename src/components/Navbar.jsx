import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, User, Search } from "lucide-react";
import { useCart } from "../hooks/useCart";
import CartDrawer from "./CartDrawer";
import MobileMenu from "./MobileMenu";
import { gsap } from "gsap";
import logo2Svg from "../assets/logo2.svg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
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

    // Add test scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { label: "Shop", to: "/shop" },
    { label: "About", to: "/about" },
    { label: "Impact", to: "/impact" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <Link
            to="/impact"
            className="block bg-rhode-cream rounded-none text-center py-2 px-4 text-sm font-medium text-rhode-text hover:opacity-80 transition-colors duration-200"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            WE PLANT A TREE WITH EVERY ORDER
          </Link>
        </div>
      </div>

      {/* Hover area at top of screen to trigger navbar */}
      <div
        className="fixed top-10 left-0 right-0 h-20 z-40"
        onMouseEnter={() => setIsVisible(true)}
      />

      <nav
        ref={navRef}
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out bg-white ${
          isVisible ? "top-10" : "-top-20"
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
                    src={logo2Svg}
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
                    src={logo2Svg}
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
                <button className="p-3 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300 hover:scale-110">
                  <User size={20} />
                </button>
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
              <div className="md:hidden flex items-center justify-end">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-3 bg-rhode-light text-rhode-text hover:bg-rhode-text hover:text-rhode-light rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Menu size={24} />
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
      />

      <CartDrawer />
    </>
  );
};

export default Navbar;
