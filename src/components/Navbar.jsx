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
                        {currentUser.displayName ||
                          currentUser.email?.split("@")[0]}
                      </span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {currentUser.displayName || "User"}
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
