import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "../data/productData";
import { useCart } from "../hooks/useCart";
import Carousel from "../components/carousel";

gsap.registerPlugin(ScrollTrigger);

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const imageRef = useRef();
  const detailsRef = useRef();

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
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".product-image",
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          }
        );

        gsap.fromTo(
          ".product-details",
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      });

      return () => ctx.revert();
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2
            className="text-3xl font-normal text-charcoal mb-4"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Product not found
          </h2>
          <Link
            to="/shop"
            className="text-charcoal/70 hover:text-charcoal font-light"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Product */}
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="mb-12">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link
                to="/shop"
                className="hover:text-gray-900 transition-colors"
              >
                Shop
              </Link>
              <span>/</span>
              <span className="text-gray-900">{product.name}</span>
            </div>
          </nav>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Product Images - Rhode Style */}
            <div ref={imageRef} className="product-image">
              <div className="bg-gray-50 rounded-2xl overflow-hidden mb-6 aspect-square">
                <img
                  src={product.images?.[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        selectedImage === index
                          ? "border-gray-900 ring-2 ring-gray-900/20"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details - Rhode Style */}
            <div ref={detailsRef} className="product-details">
              <div className="lg:sticky lg:top-32">
                {/* Product Title & Price */}
                <div className="mb-8">
                  <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 leading-tight">
                    {product.name}
                  </h1>

                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-2xl font-medium text-gray-900">
                      €{product.price.toFixed(2)}
                    </span>
                    {product.originalPrice &&
                      product.originalPrice > product.price && (
                        <span className="text-lg text-gray-500 line-through">
                          €{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-10">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>

                {/* Size Selection - Rhode Style */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
                      Size
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 px-4 border rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedSize === size
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 text-gray-700 hover:border-gray-900"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection - Rhode Style */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
                      Color
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`py-3 px-6 border rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedColor === color
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-300 text-gray-700 hover:border-gray-900"
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity - Rhode Style */}
                <div className="mb-10">
                  <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wider">
                    Quantity
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-900 transition-colors text-lg"
                    >
                      −
                    </button>
                    <span className="text-lg font-medium text-gray-900 min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 border border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-900 transition-colors text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button - Rhode Style */}
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-gray-900 text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 text-lg mb-8"
                >
                  Add to Cart · €{(product.price * quantity).toFixed(2)}
                </button>

                {/* Product Features */}
                <div className="space-y-6 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <span>✓</span>
                    <span>Free shipping on orders over €50</span>
                  </div>
                  {product.vegan && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>✓</span>
                      <span>100% Vegan</span>
                    </div>
                  )}
                  {product.crueltyFree && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>✓</span>
                      <span>Cruelty-free</span>
                    </div>
                  )}
                  {product.sustainable && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>✓</span>
                      <span>Sustainably sourced</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-light text-gray-900 mb-12 text-center">
            You may also like
          </h2>
          <Carousel />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
