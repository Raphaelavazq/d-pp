import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CarouselCard from "./CarouselCard.jsx";
import ImpactButton from "./ImpactButton.jsx";
import { carouselProducts } from "../data/productData";

gsap.registerPlugin(ScrollTrigger);

export default function Carousel() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;

    // Title animation
    gsap.fromTo(
      title,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Container animation
    gsap.fromTo(
      container,
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-8">
        <div className="bg-rhode-cream rounded-3xl p-12 lg:p-16 shadow-sm">
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-medium mb-4  text-rhode-text tracking-wider"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Featured Products
            </h2>
            <p
              className="text-xl text-rhode-text max-w-2xl mx-auto leading-relaxed font-bold"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Discover our carefully curated collection of premium skincare
              essentials, formulated with the finest ingredients for radiant,
              healthy skin.
            </p>
          </div>

          <div
            ref={containerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {carouselProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex-none w-80"
                style={{ scrollSnapAlign: "start" }}
              >
                <CarouselCard product={product} index={index} />
              </div>
            ))}
          </div>

          {/* Scroll hint for mobile */}
          <div className="text-center mt-8 md:hidden">
            <p
              className="text-sm text-rhode-text"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              ← Swipe to see more products →
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
