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
                <button className="p-3 bg-white/80 backdrop-blur-sm border border-rhode-text/20 text-rhode-text hover:bg-rhode-text hover:text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-sm">
                  <Search size={20} />
                </button>

                {/* User Authentication */}
                {currentUser ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-3 p-3 bg-gradient-to-r from-rhode-text to-rhode-text/90 text-white rounded-xl transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm"
                      title={currentUser.displayName || currentUser.email}
                    >
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt="Profile"
                          className="w-6 h-6 rounded-full object-cover border-2 border-white/30"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <User size={16} />
                        </div>
                      )}
                      <span className="hidden lg:block text-sm font-[Chillax] font-medium max-w-20 truncate">
                        {currentUser.displayName?.split(' ')[0] ||
                          currentUser.email?.split("@")[0]}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden">
                        {/* User Info Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-rhode-text/5 to-rhode-cream/10 border-b border-rhode-text/10">
                          <div className="flex items-center space-x-3">
                            {currentUser.photoURL ? (
                              <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover border-2 border-rhode-text/20"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-rhode-cream to-rhode-text/20 rounded-full flex items-center justify-center">
                                <User size={20} className="text-rhode-text" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-[Chillax] font-semibold text-rhode-text truncate">
                                {currentUser.displayName || "User"}
                              </p>
                              <p className="text-xs text-rhode-text/60 truncate font-[Chillax]">
                                {currentUser.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-6 py-3 text-sm text-rhode-text hover:bg-rhode-text/5 transition-all duration-200 font-[Chillax]"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-8 h-8 bg-rhode-text/10 rounded-lg flex items-center justify-center">
                              <User size={16} />
                            </div>
                            <div>
                              <div className="font-medium">Profile Settings</div>
                              <div className="text-xs text-rhode-text/60">Manage your account</div>
                            </div>
                          </Link>
                          
                          <Link
                            to="/orders"
                            className="flex items-center space-x-3 px-6 py-3 text-sm text-rhode-text hover:bg-rhode-text/5 transition-all duration-200 font-[Chillax]"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-8 h-8 bg-rhode-text/10 rounded-lg flex items-center justify-center">
                              <ShoppingBag size={16} />
                            </div>
                            <div>
                              <div className="font-medium">My Orders</div>
                              <div className="text-xs text-rhode-text/60">Track your purchases</div>
                            </div>
                          </Link>

                          <Link
                            to="/wishlist"
                            className="flex items-center space-x-3 px-6 py-3 text-sm text-rhode-text hover:bg-rhode-text/5 transition-all duration-200 font-[Chillax]"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <div className="w-8 h-8 bg-rhode-text/10 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="font-medium">Wishlist</div>
                              <div className="text-xs text-rhode-text/60">Saved items</div>
                            </div>
                          </Link>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-rhode-text/10 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 w-full font-[Chillax]"
                          >
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                              <LogOut size={16} />
                            </div>
                            <div>
                              <div className="font-medium">Sign Out</div>
                              <div className="text-xs text-red-500">End your session</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm text-rhode-text hover:text-rhode-text/80 transition-colors font-[Chillax] font-medium"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-6 py-3 text-sm bg-gradient-to-r from-rhode-text to-rhode-text/90 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-[Chillax] font-medium backdrop-blur-sm"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                <button
                  onClick={toggleCart}
                  className="relative p-3 bg-white/80 backdrop-blur-sm border border-rhode-text/20 text-rhode-text hover:bg-rhode-text hover:text-white rounded-xl transition-all duration-300 hover:scale-110 shadow-sm"
                >
                  <ShoppingBag size={20} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rhode-text to-rhode-text/90 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-[Chillax] font-bold shadow-lg">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>

              {/* Mobile Menu Button - Mobile Only */}
              <div className="md:hidden flex items-center justify-end space-x-3">
                {/* Mobile User Profile */}
                {currentUser && (
                  <Link
                    to="/profile"
                    className="relative p-2 bg-white/80 backdrop-blur-sm border border-rhode-text/20 text-rhode-text hover:bg-rhode-text hover:text-white rounded-xl transition-all duration-300"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </Link>
                )}

                {/* Mobile Cart */}
                <button
                  onClick={toggleCart}
                  className="relative p-2 bg-white/80 backdrop-blur-sm border border-rhode-text/20 text-rhode-text hover:bg-rhode-text hover:text-white rounded-xl transition-all duration-300"
                >
                  <ShoppingBag size={20} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-rhode-text to-rhode-text/90 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-[Chillax] font-bold text-[10px] shadow-lg">
                      {getTotalItems()}
                    </span>
                  )}
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 bg-white/80 backdrop-blur-sm border border-rhode-text/20 text-rhode-text hover:bg-rhode-text hover:text-white rounded-xl transition-all duration-300"
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
