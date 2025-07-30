import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products, categories } from "../data/productData";
import ProductCard from "../components/ProductCard";
import shopBanner from "../assets/shop_banner.mp4";

const Shop = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

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

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Video Banner with Overlaid Text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative w-full" style={{ aspectRatio: "16/6" }}>
          <video
            src={shopBanner}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover rounded-3xl shadow-lg"
            style={{ aspectRatio: "16/6" }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1
              className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-lg uppercase"
              style={{
                fontFamily: "Aglonema, serif",
                color: "white",
                textShadow: "0 2px 16px rgba(0,0,0,0.28)",
              }}
            >
              SHOP
            </h1>
            <p
              className="text-xl md:text-2xl font-bold max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
              style={{
                fontFamily: "Aglonema, serif",
                color: "white",
                textShadow: "0 2px 16px rgba(0,0,0,0.28)",
              }}
            >
              One of EVERYTHING really GOOD.
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/30 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Navigation */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-6 border-b border-taupe/20 pb-6">
          <button
            className={`text-sm font-medium tracking-wide uppercase transition-all duration-300 pb-2 border-b-2 ${
              !category
                ? "text-charcoal border-charcoal"
                : "text-charcoal/60 hover:text-charcoal border-transparent hover:border-charcoal/30"
            }`}
            style={{ fontFamily: "Chillax, sans-serif" }}
            onClick={() => {
              setSelectedSubcategory("");
              navigate("/shop");
            }}
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
              onClick={() => {
                setSelectedSubcategory("");
                navigate(`/shop/${cat.id}`);
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Subcategory Navigation */}
        {category && (
          <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
            {categories
              .find((cat) => cat.id === category)
              ?.subcategories.map((sub) => (
                <button
                  key={sub}
                  className={`text-xs font-medium tracking-wide uppercase transition-all duration-200 px-3 py-1 rounded-full ${
                    selectedSubcategory === sub
                      ? "bg-charcoal text-white"
                      : "bg-gray-100 text-charcoal hover:bg-charcoal/10"
                  }`}
                  style={{ fontFamily: "Chillax, sans-serif" }}
                  onClick={() =>
                    setSelectedSubcategory(
                      selectedSubcategory === sub ? "" : sub
                    )
                  }
                >
                  {sub}
                </button>
              ))}
          </div>
        )}

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
