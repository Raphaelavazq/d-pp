import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { products, categories } from "../data/products";
import ProductCard from "../components/ProductCard";

const Shop = () => {
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Featured first
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(filtered);
  }, [category, sortBy]);

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1
            className="text-5xl md:text-7xl font-bold text-charcoal mb-6 tracking-tight"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Shop
          </h1>
          <p
            className="text-xl text-charcoal/70 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            One of EVERYTHING really GOOD.
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-6 border-b border-taupe/20 pb-6">
          <button
            className={`text-sm font-medium tracking-wide uppercase transition-all duration-300 pb-2 border-b-2 ${
              !category
                ? "text-charcoal border-charcoal"
                : "text-charcoal/60 hover:text-charcoal border-transparent hover:border-charcoal/30"
            }`}
            style={{ fontFamily: "Chillax, sans-serif" }}
            onClick={() => (window.location.href = "/shop")}
          >
            FEATURED
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`text-sm font-medium tracking-wide uppercase transition-all duration-300 pb-2 border-b-2 ${
                category === cat.id
                  ? "text-charcoal border-charcoal"
                  : "text-charcoal/60 hover:text-charcoal border-transparent hover:border-charcoal/30"
              }`}
              style={{ fontFamily: "Chillax, sans-serif" }}
              onClick={() => (window.location.href = `/shop/${cat.id}`)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="mb-12 flex justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border-0 text-sm font-medium text-charcoal/70 bg-transparent focus:outline-none cursor-pointer uppercase tracking-wide"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            <option value="featured">SORT BY</option>
            <option value="newest">NEWEST</option>
            <option value="price-low">PRICE: LOW TO HIGH</option>
            <option value="price-high">PRICE: HIGH TO LOW</option>
            <option value="rating">BEST RATED</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="pb-20">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-32">
              <h3
                className="text-2xl font-medium text-charcoal mb-4"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                No products found
              </h3>
              <p
                className="text-charcoal/60 text-lg"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Try browsing other categories
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
