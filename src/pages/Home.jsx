import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCarousel from "../components/ProductCarousel";
import ImpactButton from "../components/ImpactButton";
import StayInTouch from "../components/StayInTouch";
import heroVideo from "../assets/heroVideo.mp4";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const heroText = heroTextRef.current;
    const heroImage = heroImageRef.current;

    // Hero animations
    const tl = gsap.timeline();

    tl.fromTo(
      heroText,
      {
        y: 80,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      }
    ).fromTo(
      heroImage,
      {
        y: 60,
        opacity: 0,
        scale: 0.95,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.6"
    );

    // Parallax effect for hero
    gsap.to(heroImage, {
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-24"
      >
        <div className="relative z-20 max-w-6xl mx-auto px-8">
          <div className="bg-rhode-cream rounded-3xl p-12 lg:p-16 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div ref={heroTextRef} className="text-center lg:text-left">
                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-rhode-text mb-8 tracking-tight leading-tight uppercase"
                  style={{ fontFamily: "Aglonema, serif" }}
                >
                  soft, simple
                  <span className="block text-rhode-text">
                    and sensibly priced
                  </span>
                </h1>
                <p
                  className="text-xl md:text-2xl text-rhode-text mb-12 leading-relaxed max-w-2xl font-normal"
                  style={{ fontFamily: "Aglonema, serif" }}
                >
                  Inspired by icons. Designed for now.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <ImpactButton variant="filled" className="px-8 py-4 text-sm">
                    Discover Collection
                  </ImpactButton>
                  <ImpactButton variant="outline" className="px-8 py-4 text-sm">
                    Our Impact
                  </ImpactButton>
                </div>
              </div>

              <div ref={heroImageRef} className="relative">
                <div className="relative z-10">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-auto rounded-3xl shadow-2xl object-cover"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <source src={heroVideo} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <ProductCarousel />

      {/* Stay In Touch Section */}
      <StayInTouch />

      {/* Brand Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-rhode-cream rounded-3xl p-12 lg:p-16 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2
                  className="text-4xl md:text-5xl font-semibold mb-8 tracking-tight text-rhode-dark"
                  style={{ fontFamily: "Aglonema, serif" }}
                >
                  Quality. Conscious. Confident.
                </h2>
                <p
                  className="text-xl text-rhode-text mb-8 leading-relaxed"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  We don't compromise. Every formula is 100% vegan,
                  cruelty-free, and crafted with integrity. No marketing fluff —
                  just products that work.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3
                      className="text-xl font-semibold mb-3 text-[#f6febb]"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      100% Vegan
                    </h3>
                    <p
                      className="text-rhode-text"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Plant-based formulas that deliver results
                    </p>
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold mb-3 text-[#f6febb]"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Zero Waste Goal
                    </h3>
                    <p
                      className="text-rhode-text"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Refillable packaging and carbon-neutral shipping
                    </p>
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold mb-3 text-[#f6febb]"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Cruelty-Free Always
                    </h3>
                    <p
                      className="text-rhode-text"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Never tested on animals. Period.
                    </p>
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold mb-3 text-[#f6febb]"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Tree Planting
                    </h3>
                    <p
                      className="text-rhode-text"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      One tree planted with every purchase
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=600&fit=crop&crop=center"
                  alt="düpp sustainable beauty"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
