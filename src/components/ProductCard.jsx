import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useBigBuyStock } from "../hooks/useBigBuyStock";
import { gsap } from "gsap";
import ImpactButton from "./ImpactButton";
import StockStatus from "./StockStatus";

const ProductCard = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { inStock, isLoading: stockLoading } = useBigBuyStock(
    product.bigbuyId || product.id
  );
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

    // Don't add to cart if out of stock
    if (!inStock) {
      return;
    }

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
        className="group bg-sand rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden p-4">
          <div
            ref={imageRef}
            className="w-[200px] h-[267px] bg-sand rounded-lg overflow-hidden mx-auto"
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
            <div className="absolute top-6 left-6 bg-stone text-gray-300 text-xs font-bold px-2 py-1 rounded-full shadow-sm uppercase font-chillax">
              new
            </div>
          )}
        </div>

        <div className="p-4 pt-0 flex-1 flex flex-col">
          <div className="flex-1 flex flex-col justify-between min-h-[80px]">
            <div>
              <h3
                className="font-medium text-base mb-1 text-stone leading-tight overflow-hidden text-ellipsis font-chillax"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {product.name}
              </h3>
              <p className="font-semibold text-lg text-stone mb-1">
                €{product.price}
              </p>
              <p className="text-stone text-xs leading-relaxed font-semibold font-chillax">
                {product.description?.substring(0, 40) || "Premium skincare"}
              </p>

              {/* Stock Status */}
              <StockStatus
                productId={product.bigbuyId || product.id}
                className="mt-2"
              />
            </div>
          </div>

          <ImpactButton
            ref={buttonRef}
            className={`w-full mt-4 py-2.5 px-4 text-sm ${
              !inStock ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAddToCart}
            variant="outline"
            disabled={!inStock}
            title={!inStock ? "Unavailable right now" : undefined}
          >
            {stockLoading
              ? "Checking..."
              : !inStock
                ? "Out of Stock"
                : product.buttonText || "Add to Cart"}
          </ImpactButton>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
