import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "../data/productData";
import { useCart } from "../hooks/useCart";
import Carousel from "../components/Carousel";
import StayInTouch from "../components/StayInTouch";

gsap.registerPlugin(ScrollTrigger);

const ProductDetail2 = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { addToCart } = useCart();

  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);
  const reviewsRef = useRef(null);
  const relatedRef = useRef(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
    if (foundProduct) {
      setSelectedSize(foundProduct.sizes?.[0] || "");
      setSelectedColor(foundProduct.colors?.[0] || "");
    }
  }, [id]);

  useEffect(() => {
    if (product) {
      // Enhanced entrance animations
      gsap.fromTo(
        heroRef.current?.children || [],
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          delay: 0.3,
        }
      );

      // Product image animation with parallax
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { opacity: 0, scale: 0.9, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "back.out(1.2)",
          }
        );

        // Parallax effect for product image
        gsap.to(imageRef.current, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Product details animation
      if (detailsRef.current) {
        gsap.fromTo(
          detailsRef.current.children,
          { opacity: 0, x: 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            delay: 0.5,
          }
        );
      }

      // Reviews section animation
      if (reviewsRef.current) {
        gsap.fromTo(
          reviewsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: reviewsRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Related products animation
      if (relatedRef.current) {
        const relatedCards =
          relatedRef.current.querySelectorAll(".related-product");
        gsap.fromTo(
          relatedCards,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.3)",
            scrollTrigger: {
              trigger: relatedRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [product]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        selectedSize,
        selectedColor,
        quantity,
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-rhode-text border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p
            className="text-rhode-text"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-24 pb-12 bg-gradient-to-br from-rhode-light via-white to-rhode-cream"
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rhode-text/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-charcoal/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Link
                to="/"
                className="text-rhode-text hover:text-rhode-dark transition-colors"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Home
              </Link>
              <span className="text-rhode-text/50">/</span>
              <Link
                to="/shop"
                className="text-rhode-text hover:text-rhode-dark transition-colors"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Shop
              </Link>
              <span className="text-rhode-text/50">/</span>
              <span
                className="text-rhode-dark font-medium"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                {product.name}
              </span>
            </div>
          </nav>

          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Enhanced Product Images */}
              <div className="space-y-6">
                <div ref={imageRef} className="relative group">
                  <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
                    <div className="absolute -inset-4 bg-gradient-to-r from-rhode-text/20 to-charcoal/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <img
                      src={product.images?.[selectedImage] || product.image}
                      alt={product.name}
                      className="relative w-full h-auto rounded-3xl shadow-2xl object-cover border-4 border-white/50"
                      style={{ aspectRatio: "1/1" }}
                    />
                  </div>
                </div>

                {/* Image thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-4 justify-center">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          selectedImage === index
                            ? "border-rhode-text shadow-lg scale-110"
                            : "border-white/50 hover:border-rhode-text/50"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Product Details */}
              <div ref={detailsRef} className="space-y-8">
                <div>
                  <h1
                    className="text-3xl md:text-4xl font-bold text-rhode-dark leading-tight tracking-tight mb-4"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    {product.name}
                  </h1>

                  <div className="flex items-center space-x-4 mb-6">
                    <span
                      className="text-2xl font-bold text-rhode-text"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span
                        className="text-lg text-rhode-text/60 line-through"
                        style={{ fontFamily: "Chillax, sans-serif" }}
                      >
                        ${product.originalPrice}
                      </span>
                    )}
                    {product.badge && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center space-x-2 mb-6">
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(product.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span
                        className="text-sm text-rhode-text"
                        style={{ fontFamily: "Chillax, sans-serif" }}
                      >
                        ({product.rating}) • {product.reviews || 0} reviews
                      </span>
                    </div>
                  )}

                  <p
                    className="text-rhode-text leading-relaxed mb-8"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    {product.description}
                  </p>
                </div>

                {/* Product Options */}
                <div className="space-y-6">
                  {/* Size Selection */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <label
                        className="block text-sm font-medium text-rhode-dark mb-3"
                        style={{ fontFamily: "Chillax, sans-serif" }}
                      >
                        Size
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {product.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 ${
                              selectedSize === size
                                ? "border-rhode-text bg-rhode-text text-white"
                                : "border-rhode-text/20 text-rhode-text hover:border-rhode-text"
                            }`}
                            style={{ fontFamily: "Chillax, sans-serif" }}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Selection */}
                  {product.colors && product.colors.length > 0 && (
                    <div>
                      <label
                        className="block text-sm font-medium text-rhode-dark mb-3"
                        style={{ fontFamily: "Chillax, sans-serif" }}
                      >
                        Color
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300 capitalize ${
                              selectedColor === color
                                ? "border-rhode-text bg-rhode-text text-white"
                                : "border-rhode-text/20 text-rhode-text hover:border-rhode-text"
                            }`}
                            style={{ fontFamily: "Chillax, sans-serif" }}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label
                      className="block text-sm font-medium text-rhode-dark mb-3"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border-2 border-rhode-text/20 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 text-rhode-text hover:bg-rhode-text/10 transition-colors rounded-l-lg"
                        >
                          -
                        </button>
                        <span
                          className="px-4 py-2 border-x-2 border-rhode-text/20 min-w-[60px] text-center"
                          style={{ fontFamily: "Chillax, sans-serif" }}
                        >
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-4 py-2 text-rhode-text hover:bg-rhode-text/10 transition-colors rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-rhode-text text-white py-4 rounded-full font-medium hover:bg-rhode-dark transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </button>

                {/* Product Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-rhode-text/20">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-rhode-text/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-6 h-6 text-rhode-text"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div
                      className="text-sm font-medium text-rhode-dark"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Free Shipping
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-rhode-text/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-6 h-6 text-rhode-text"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </div>
                    <div
                      className="text-sm font-medium text-rhode-dark"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Cruelty Free
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-rhode-text/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-6 h-6 text-rhode-text"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div
                      className="text-sm font-medium text-rhode-dark"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      30-Day Return
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Information Tabs */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-rhode-cream/30 rounded-3xl p-8 lg:p-12">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {["description", "ingredients", "usage"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 capitalize ${
                    activeTab === tab
                      ? "bg-rhode-text text-white shadow-lg"
                      : "bg-white/80 text-rhode-text hover:bg-white"
                  }`}
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="text-center">
              {activeTab === "description" && (
                <div>
                  <h3
                    className="text-xl font-medium mb-4 text-rhode-dark"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Product Description
                  </h3>
                  <p
                    className="text-rhode-text leading-relaxed"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    {product.description ||
                      "This premium skincare product is carefully formulated with the finest ingredients to deliver exceptional results. Experience the düpp difference with our commitment to quality and sustainability."}
                  </p>
                </div>
              )}
              {activeTab === "ingredients" && (
                <div>
                  <h3
                    className="text-xl font-medium mb-4 text-rhode-dark"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Key Ingredients
                  </h3>
                  <p
                    className="text-rhode-text leading-relaxed"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    {product.ingredients ||
                      "Aqua, Glycerin, Hyaluronic Acid, Vitamin E, Natural Botanical Extracts. All ingredients are sustainably sourced and cruelty-free."}
                  </p>
                </div>
              )}
              {activeTab === "usage" && (
                <div>
                  <h3
                    className="text-xl font-medium mb-4 text-rhode-dark"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    How to Use
                  </h3>
                  <p
                    className="text-rhode-text leading-relaxed"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    {product.usage ||
                      "Apply to clean skin morning and evening. Gently massage until fully absorbed. For best results, use consistently as part of your daily skincare routine."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section
          ref={relatedRef}
          className="py-20 bg-gradient-to-br from-white to-rhode-light/30"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2
                className="text-3xl md:text-4xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                You Might Also Like
              </h2>
              <p
                className="text-rhode-text leading-relaxed"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Discover more from the {product.category} collection
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="related-product">
                  <Link
                    to={`/product/${relatedProduct.id}`}
                    className="block bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3
                      className="font-medium text-rhode-dark mb-2"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      {relatedProduct.name}
                    </h3>
                    <p
                      className="text-rhode-text font-medium"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      ${relatedProduct.price}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Carousel */}
      <Carousel />

      <StayInTouch />
    </div>
  );
};

export default ProductDetail2;
