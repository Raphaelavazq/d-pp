import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { gsap } from "gsap";
import ImpactButton from "./ImpactButton";

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  // const contentRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Initial animation for card entrance
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Rhode-style button animation
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      images: product.images || [product.image],
      selectedSize: product.sizes?.[0] || "One Size",
      selectedColor: product.colors?.[0] || "Default",
      quantity: 1,
    });
  };

  const handleMouseEnter = () => {
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex(1);
    }

    // Subtle Rhode-style hover animations
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.02,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
    // Do not hide the button on mouse leave; keep it visible
  };

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <div
        ref={cardRef}
        className="group bg-rhode-cream rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden p-4">
          <div
            ref={imageRef}
            className="w-[200px] h-[267px] bg-rhode-light rounded-lg overflow-hidden mx-auto"
          >
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[currentImageIndex] || product.images[0]
                  : product.image
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Badge (featured/new) */}
          {product.featured && (
            <div
              className="absolute top-6 left-6 bg-rhode-text text-gray-300 text-xs font-bold px-2 py-1 rounded-full shadow-sm uppercase"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              new
            </div>
          )}
        </div>

        <div className="p-4 pt-0 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col justify-between min-h-[80px]">
            <div>
              <h3
                className="font-medium text-base mb-1 text-rhode-text leading-tight overflow-hidden text-ellipsis"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  fontFamily: "Chillax, sans-serif",
                }}
              >
                {product.name}
              </h3>
              <p className="font-semibold text-lg text-rhode-text mb-1">
                €{product.price}
              </p>
              <p
                className="text-rhode-text text-xs leading-relaxed font-semibold"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                {product.description?.substring(0, 40) || "Premium skincare"}
              </p>
            </div>
          </div>

          <ImpactButton
            ref={buttonRef}
            className="w-full mt-4 py-2.5 px-4 text-sm"
            onClick={handleAddToCart}
            variant="outline"
          >
            {product.buttonText || "Add to Cart"}
          </ImpactButton>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
