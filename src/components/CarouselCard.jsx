import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ImpactButton from "./ImpactButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CarouselCard({ product, index }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    const button = buttonRef.current;

    // Entrance animation
    gsap.fromTo(
      card,
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Card hover animations
    const handleCardMouseEnter = () => {
      gsap.to(image, {
        scale: 1.05,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(card, {
        y: -8,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleCardMouseLeave = () => {
      gsap.to(image, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(card, {
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    // Button hover animations - Rhode style (subtle)
    const handleButtonMouseEnter = () => {
      gsap.to(button, {
        opacity: 0.8,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    const handleButtonMouseLeave = () => {
      gsap.to(button, {
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    };

    // Add event listeners
    card.addEventListener("mouseenter", handleCardMouseEnter);
    card.addEventListener("mouseleave", handleCardMouseLeave);
    button.addEventListener("mouseenter", handleButtonMouseEnter);
    button.addEventListener("mouseleave", handleButtonMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleCardMouseEnter);
      card.removeEventListener("mouseleave", handleCardMouseLeave);
      button.removeEventListener("mouseenter", handleButtonMouseEnter);
      button.removeEventListener("mouseleave", handleButtonMouseLeave);
    };
  }, [index]);

  return (
    <Link to={`/product/${product.id}`} className="block h-full">
      <div
        ref={cardRef}
        className="group bg-rhode-cream rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
      >
        <div className="relative overflow-hidden p-4">
          <div
            ref={imageRef}
            className="w-[200px] h-[267px] bg-rhode-light rounded-lg overflow-hidden mx-auto"
          >
            <img
              src={product.image}
              alt={product.alt}
              className="w-full h-full object-cover"
            />
          </div>

          {product.badge && (
            <div
              className="absolute top-6 left-6 bg-rhode-text text-gray-300 text-xs font-bold px-2 py-1 rounded-full shadow-sm uppercase"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              {typeof product.badge === "string"
                ? product.badge
                : product.badge.text}
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
                style={{
                  fontFamily: "Chillax, sans-serif",
                }}
              >
                {product.tagline || "Premium skincare"}
              </p>
            </div>
          </div>

          <ImpactButton
            ref={buttonRef}
            className="w-full mt-4 py-2.5 px-4 text-sm"
            onClick={(e) => e.preventDefault()}
            variant="outline"
          >
            {product.buttonText || "Add to Cart"}
          </ImpactButton>
        </div>
      </div>
    </Link>
  );
}
