import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "../data/products";
import { useCart } from "../hooks/useCart";

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
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm">
            <Link
              to="/shop"
              className="text-charcoal/70 hover:text-charcoal font-light"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Shop
            </Link>
            <span className="text-charcoal/40">/</span>
            <span
              className="text-charcoal font-light"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              {product.name}
            </span>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div ref={imageRef} className="product-image">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? "border-charcoal" : "border-gray-200"
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

          {/* Product Details */}
          <div ref={detailsRef} className="product-details">
            <div className="sticky top-24">
              {/* Badge */}
              {product.badge && (
                <span
                  className="inline-block bg-charcoal text-white text-xs px-2 py-1 rounded-full mb-4 uppercase tracking-wide"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  {product.badge}
                </span>
              )}

              <h1
                className="text-4xl font-normal text-charcoal mb-4"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                {product.name}
              </h1>

              <p
                className="text-3xl font-normal text-charcoal mb-6"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                €{product.price.toFixed(2)}
              </p>

              <p
                className="text-charcoal/70 font-light leading-relaxed mb-8"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                {product.description || "A beautifully crafted piece inspired by designer luxury."}
              </p>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3
                    className="text-sm font-medium text-charcoal mb-3 uppercase tracking-wide"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Size
                  </h3>
                  <div className="flex space-x-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                          selectedSize === size
                            ? "border-charcoal bg-charcoal text-white"
                            : "border-gray-200 text-charcoal hover:border-charcoal"
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
                <div className="mb-6">
                  <h3
                    className="text-sm font-medium text-charcoal mb-3 uppercase tracking-wide"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Color
                  </h3>
                  <div className="flex space-x-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                          selectedColor === color
                            ? "border-charcoal bg-charcoal text-white"
                            : "border-gray-200 text-charcoal hover:border-charcoal"
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
              <div className="mb-8">
                <h3
                  className="text-sm font-medium text-charcoal mb-3 uppercase tracking-wide"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Quantity
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-charcoal transition-colors"
                  >
                    -
                  </button>
                  <span
                    className="text-lg font-medium text-charcoal"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:border-charcoal transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-charcoal text-white py-4 rounded-full font-medium hover:bg-charcoal/90 transition-colors duration-200 mb-4"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                ADD TO CART - €{(product.price * quantity).toFixed(2)}
              </button>

              {/* Product Info */}
              <div className="border-t border-gray-100 pt-6 space-y-4">
                <div>
                  <h4
                    className="text-sm font-medium text-charcoal mb-2 uppercase tracking-wide"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Details
                  </h4>
                  <p
                    className="text-charcoal/70 font-light text-sm"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Designer-inspired quality materials and craftsmanship.
                  </p>
                </div>
                <div>
                  <h4
                    className="text-sm font-medium text-charcoal mb-2 uppercase tracking-wide"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Care
                  </h4>
                  <p
                    className="text-charcoal/70 font-light text-sm"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Follow care instructions for best results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
