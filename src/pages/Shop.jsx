import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, categories } from "../data/productData";
import ProductCard from "../components/ProductCard";
import shopBanner from "../assets/shop_banner.mp4";

gsap.registerPlugin(ScrollTrigger);

const Shop = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Animation refs
  const heroRef = useRef(null);
  const filtersRef = useRef(null);
  const productsGridRef = useRef(null);

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

  useEffect(() => {
    // Hero animation
    gsap.fromTo(
      heroRef.current?.children || [],
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.3,
      }
    );

    // Filters animation
    if (filtersRef.current) {
      gsap.fromTo(
        filtersRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: filtersRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Products grid animation
    if (productsGridRef.current) {
      const productCards = productsGridRef.current.querySelectorAll(
        ".product-card-animated"
      );
      gsap.fromTo(
        productCards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: productsGridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [filteredProducts]);

  const categoryInfo = category
    ? categories.find((cat) => cat.id === category)
    : null;

  const subcategories = categoryInfo?.subcategories || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-rhode-light via-white to-rhode-cream overflow-hidden"
        style={{ paddingTop: "5rem" }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rhode-text/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-charcoal/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 lg:p-16 shadow-2xl border border-white/20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="text-center lg:text-left space-y-8">
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-rhode-dark leading-tight tracking-tight"
                  style={{ fontFamily: "Aglonema, serif" }}
                >
                  {categoryInfo ? categoryInfo.name : "Shop"}
                  <span className="block text-transparent bg-gradient-to-r from-rhode-text to-charcoal bg-clip-text text-2xl md:text-3xl mt-2">
                    Collection
                  </span>
                </h1>

                <p
                  className="text-xl md:text-2xl text-rhode-text leading-relaxed max-w-2xl font-normal"
                  style={{ fontFamily: "Aglonema, serif" }}
                >
                  {categoryInfo?.description ||
                    "Discover our premium collection of carefully curated skincare essentials"}
                </p>

                {/* Collection stats */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-4 opacity-70">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rhode-dark">
                      {filteredProducts.length}
                    </div>
                    <div className="text-sm text-rhode-text">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rhode-dark">
                      98%
                    </div>
                    <div className="text-sm text-rhode-text">Natural</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-rhode-dark">5★</div>
                    <div className="text-sm text-rhode-text">Rated</div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute -inset-4 bg-gradient-to-r from-rhode-text/20 to-charcoal/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <video
                    src={shopBanner}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="relative w-full h-auto rounded-3xl shadow-2xl object-cover border-4 border-white/50"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <source src={shopBanner} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Filters & Controls */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div
            ref={filtersRef}
            className="bg-rhode-cream/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
          >
            {/* Category Navigation */}
            <div className="mb-8">
              <h3
                className="text-xl font-medium mb-4 text-rhode-dark"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Categories
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/shop")}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    !category
                      ? "bg-rhode-text text-white shadow-lg"
                      : "bg-white/80 text-rhode-text hover:bg-white"
                  }`}
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/shop/${cat.id}`)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      category === cat.id
                        ? "bg-rhode-text text-white shadow-lg"
                        : "bg-white/80 text-rhode-text hover:bg-white"
                    }`}
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subcategories & Sort Controls */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Subcategories */}
              {subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedSubcategory("")}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                      !selectedSubcategory
                        ? "bg-charcoal text-white"
                        : "bg-white/60 text-charcoal hover:bg-white"
                    }`}
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    All {categoryInfo?.name}
                  </button>
                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcategory(sub)}
                      className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                        selectedSubcategory === sub
                          ? "bg-charcoal text-white"
                          : "bg-white/60 text-charcoal hover:bg-white"
                      }`}
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}

              {/* Sort Controls */}
              <div className="flex items-center gap-4">
                <span
                  className="text-sm text-rhode-text font-medium"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/80 border border-rhode-text/20 rounded-lg px-4 py-2 text-sm text-rhode-text focus:outline-none focus:ring-2 focus:ring-rhode-text/30 transition-all duration-300"
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
          </div>
        </div>
      </section>

      {/* Enhanced Products Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {filteredProducts.length > 0 ? (
            <div
              ref={productsGridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
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
                  style={{ fontFamily: "Aglonema, serif" }}
                >
                  No products found
                </h3>
                <p
                  className="text-rhode-text"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Try adjusting your filters or browse all products
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
