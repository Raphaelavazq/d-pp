import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { products, categories } from "../data/productData";
import ProductCard from "../components/ProductCard";
import shop1 from "../assets/shop1.mp4";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Shop = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Enable smooth scrolling
    ScrollTrigger.normalizeScroll(true);

    // Get all sections with data-section attribute
    const sections = document.querySelectorAll("[data-section]");

    // Handle different section types like home page
    sections.forEach((section) => {
      const sectionType = section.getAttribute("data-section");

      // Shopping section should be scrollable, not pinned
      if (sectionType === "shopping") {
        // Just entrance animation for shopping section
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else {
        // Other sections get pinned and animated like home page
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          pin: true,
          pinSpacing: false,
          scrub: 0.5,
        });

        // From bottom animation on enter
        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Handle sidebar keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when sidebar is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    let filtered = [...products];

    if (category) {
      const catObj = categories.find((cat) => cat.id === category);
      if (catObj) {
        filtered = filtered.filter(
          (product) => product.category === catObj.name
        );
        if (selectedSubcategory) {
          filtered = filtered.filter(
            (product) => product.subcategory === selectedSubcategory
          );
        }
      }
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [category, sortBy, selectedSubcategory]);

  const handleCategoryChange = (newCategory) => {
    if (newCategory) {
      navigate(`/shop/${newCategory}`, { replace: true });
    } else {
      navigate("/shop", { replace: true });
    }
    setSelectedSubcategory("");

    // Update banner text with animation
    updateBannerText(newCategory);
  };

  const updateBannerText = (newCategory) => {
    const bannerTitle = document.querySelector(".banner-title");
    const bannerSubtitle = document.querySelector(".banner-subtitle");

    if (bannerTitle && bannerSubtitle) {
      // Animate out current text
      gsap.to([bannerTitle, bannerSubtitle], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          // Update text content
          const newCategoryInfo = newCategory
            ? categories.find((cat) => cat.id === newCategory)
            : null;

          // Update the text
          bannerTitle.textContent = newCategoryInfo
            ? newCategoryInfo.name
            : "Shop";
          bannerSubtitle.textContent =
            newCategoryInfo?.description ||
            "Discover our premium collection of carefully curated skincare essentials";

          // Animate in new text
          gsap.to([bannerTitle, bannerSubtitle], {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        },
      });
    }
  };

  const categoryInfo = category
    ? categories.find((cat) => cat.id === category)
    : null;

  const subcategories = categoryInfo?.subcategories || [];

  return (
    <div className="relative pt-16 md:pt-20">
      {/* Banner Section */}
      <section
        data-section="hero"
        className="h-screen w-full overflow-hidden bg-white shadow-xl flex items-center relative"
      >
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            src={shop1}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={shop1} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
        </div>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <h1
            className="banner-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-[0.9] tracking-tight"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            {categoryInfo ? categoryInfo.name : "Shop"}
            <span className="block text-white/90">Collection</span>
          </h1>
          <p className="banner-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            {categoryInfo?.description ||
              "Discover our premium collection of carefully curated skincare essentials"}
          </p>
        </div>
      </section>

      {/* Floating Filter Button - Always visible */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed bottom-6 right-6 bg-rhode-text text-white p-4 rounded-full shadow-lg hover:bg-rhode-text/90 transition-all duration-300 hover:scale-105 z-[80] md:hidden"
        style={{ fontFamily: "Chillax, sans-serif" }}
        aria-label="Open filters"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </button>

      {/* Shopping Section - Scrollable Products */}
      <section
        data-section="shopping"
        className="min-h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl"
      >
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSidebarOpen(false);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-label="Filter sidebar"
        >
          <div className="p-6 h-full overflow-y-auto">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-2xl font-medium text-rhode-text"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Filters
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rhode-text/10 transition-colors"
                aria-label="Close filters"
              >
                <svg
                  className="w-5 h-5 text-rhode-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3
                className="text-lg font-medium mb-4 text-rhode-text"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleCategoryChange(null);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    !category
                      ? "bg-rhode-text text-white"
                      : "bg-rhode-text/10 text-rhode-text hover:bg-rhode-text/20"
                  }`}
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategoryChange(cat.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      category === cat.id
                        ? "bg-rhode-text text-white"
                        : "bg-rhode-text/10 text-rhode-text hover:bg-rhode-text/20"
                    }`}
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div className="mb-8">
                <h3
                  className="text-lg font-medium mb-4 text-rhode-text"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  {categoryInfo?.name} Types
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedSubcategory("")}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                      !selectedSubcategory
                        ? "bg-charcoal text-white"
                        : "bg-charcoal/10 text-charcoal hover:bg-charcoal/20"
                    }`}
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    All {categoryInfo?.name}
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                        selectedSubcategory === sub
                          ? "bg-charcoal text-white"
                          : "bg-charcoal/10 text-charcoal hover:bg-charcoal/20"
                      }`}
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="mb-8">
              <h3
                className="text-lg font-medium mb-4 text-rhode-text"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Sort By
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-white border border-rhode-text/20 rounded-lg px-4 py-3 text-sm text-rhode-text focus:outline-none focus:ring-2 focus:ring-rhode-text/30"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="bg-rhode-text/10 rounded-lg p-4">
              <span className="text-sm font-medium text-rhode-text">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - With right sidebar layout */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20">
          <div className="flex gap-8">
            {/* Left Content - Products */}
            <div className="flex-1">
              {/* Top Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 sm:mb-12 relative z-10 gap-4">
                <div>
                  <h2
                    className="text-2xl sm:text-3xl md:text-4xl font-medium text-rhode-text mb-2"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    {categoryInfo ? categoryInfo.name : "All Products"}
                  </h2>
                  <p className="text-rhode-text/70 text-sm sm:text-base">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "product" : "products"}{" "}
                    available
                  </p>
                </div>

                {/* Desktop Filter Controls */}
                <div className="hidden md:flex items-center gap-4">
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="bg-rhode-text/10 text-rhode-text px-4 py-2 rounded-lg hover:bg-rhode-text/20 transition-colors font-medium flex items-center gap-2"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                    Filters
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-rhode-text/20 rounded-lg px-4 py-2 text-sm text-rhode-text focus:outline-none focus:ring-2 focus:ring-rhode-text/30"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card-animated">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-rhode-cream/30 rounded-2xl p-12 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-rhode-text/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-rhode-text"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3
                      className="text-xl font-medium text-rhode-dark mb-2"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      No products found
                    </h3>
                    <p
                      className="text-rhode-text mb-6"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Try adjusting your filters or browse all products
                    </p>
                    <button
                      onClick={() => {
                        handleCategoryChange(null);
                        setSortBy("featured");
                      }}
                      className="bg-rhode-text text-white px-6 py-3 rounded-full hover:bg-rhode-text/90 transition-colors font-medium"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      View All Products
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stay In Touch Section */}
      <section
        data-section="stay-in-touch"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-rhode-cream shadow-xl flex items-center justify-center"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 w-full text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-medium mb-3 sm:mb-4 tracking-tight text-rhode-text leading-tight"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Stay In Touch
          </h2>

          <p
            className="text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto text-rhode-text font-medium"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Be the first to know about new launches, exclusive offers, and
            skincare tips from our experts.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto mb-6 sm:mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-none border-b-2 border-rhode-text bg-transparent placeholder-rhode-text focus:outline-none focus:border-rhode-dark text-base sm:text-lg transition-all duration-200 text-rhode-dark"
              style={{ fontFamily: "Chillax, sans-serif" }}
            />
            <button
              type="submit"
              className="py-3 sm:py-4 px-6 sm:px-8 bg-rhode-text text-rhode-light hover:bg-rhode-dark transition-all duration-300 uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          <p
            className="text-xs sm:text-sm text-rhode-text font-light"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <section
        data-section="footer"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center justify-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
          <footer className="text-center lg:text-left">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-8 sm:mb-10 md:mb-12">
              {/* Brand Section */}
              <div className="md:col-span-2 lg:col-span-2 space-y-6 sm:space-y-8">
                <h3
                  className="text-3xl sm:text-4xl md:text-5xl font-medium text-rhode-text"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  düpp
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-rhode-text/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Soft, simple, and sensibly priced. Discover our curated
                  collection of essentials that blend luxury with everyday
                  simplicity.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-6">
                  <Link
                    to="/shop"
                    className="bg-rhode-text text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full hover:bg-rhode-text/90 transition-colors font-medium"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Shop Now
                  </Link>
                  <Link
                    to="/about"
                    className="border border-rhode-text text-rhode-text px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full hover:bg-rhode-text hover:text-white transition-colors font-medium"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6 sm:space-y-8">
                <h4 className="text-lg sm:text-xl md:text-2xl font-medium text-rhode-text">
                  Quick Links
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg md:text-xl text-rhode-text/70">
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
              <div className="space-y-6 sm:space-y-8">
                <h4 className="text-lg sm:text-xl md:text-2xl font-medium text-rhode-text">
                  Customer Care
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg md:text-xl text-rhode-text/70">
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
            <div className="pt-8 sm:pt-10 border-t border-rhode-text/10 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
              <p className="text-sm sm:text-base md:text-lg text-rhode-text/60">
                © 2024 düpp. All rights reserved.
              </p>
              <div className="flex space-x-6 sm:space-x-8">
                <a
                  href="#"
                  className="text-rhode-text/60 hover:text-rhode-text transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
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
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
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
    </div>
  );
};

export default Shop;
