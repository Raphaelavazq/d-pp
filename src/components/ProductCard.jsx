import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { gsap } from "gsap";

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Initial animation for card entrance
    gsap.fromTo(
      cardRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Rhode-style button animation
    gsap.to(buttonRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      selectedSize: product.sizes?.[0] || "One Size",
      selectedColor: product.colors?.[0] || "Default",
      quantity: 1,
    });
  };

  const handleMouseEnter = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex(1);
    }

    // Subtle Rhode-style hover animations
    gsap.to(imageRef.current, {
      scale: 1.02,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(buttonRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);

    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(buttonRef.current, {
      y: 8,
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div
        ref={cardRef}
        className="bg-white overflow-hidden transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-cream/5">
          <img
            ref={imageRef}
            src={product.images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Rhode-style "new" badge */}
          {product.featured && (
            <div className="absolute top-3 left-3">
              <span
                className="bg-white text-charcoal text-xs font-medium px-2 py-1 shadow-sm uppercase tracking-wide"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                new
              </span>
            </div>
          )}

          {/* Rhode-style Add Button */}
          <div
            ref={buttonRef}
            className="absolute bottom-3 left-3 right-3 opacity-0 transform translate-y-2"
          >
            <button
              onClick={handleAddToCart}
              className="w-full bg-charcoal text-white py-3 px-4 text-sm font-medium tracking-wide hover:bg-charcoal/90 transition-all duration-200 uppercase"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              BUY {product.category.toUpperCase()} - ${product.price.toFixed(2)}
            </button>
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="py-4 space-y-1">
          {/* Category */}
          <p
            className="text-xs text-charcoal/70 font-medium tracking-wide lowercase"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            {product.category}
          </p>

          {/* "new" text indicator like Rhode */}
          {product.featured && (
            <p
              className="text-xs text-charcoal font-medium tracking-wide lowercase"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              new
            </p>
          )}

          {/* Product Name */}
          <h3
            className="font-medium text-charcoal text-base leading-tight tracking-wide uppercase"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            {product.name}
          </h3>

          {/* Price */}
          <p
            className="text-base font-medium text-charcoal pt-1"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            ${product.price.toFixed(2)}
          </p>

          {/* Description */}
          <p
            className="text-sm text-charcoal/70 font-normal leading-relaxed"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            {product.description?.substring(0, 40) ||
              "Premium designer inspired"}
            .
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
