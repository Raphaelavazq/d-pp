import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Carousel from "../components/carousel";
import ImpactButton from "../components/ImpactButton";
import StayInTouch from "../components/StayInTouch";

import heroVideo from "../assets/heroVideo.mp4";
import sectionvid1 from "../assets/sectionvid1.mp4";

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
      <Carousel />

      {/* Stay In Touch Section */}
      <StayInTouch />

      {/* Brand Story Section */}
      <section className="py-20 bg-white leading-relaxed">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-rhode-cream rounded-3xl p-12 lg:p-16 shadow-sm">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2
                  className="text-4xl md:text-5xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                  style={{ fontFamily: "Aglonema, serif" }}
                >
                  Confident and Effortlessly Cool
                </h2>
                <p
                  className="text-3xl text-rhode-text font-semibold bold mb-8 tracking-tight"
                  style={{ fontFamily: "chillax, sans-serif" }}
                >
                  Welcome to düppS
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                  <div>
                    <h3
                      className="md:text-xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                      style={{ fontFamily: "Aglonema, serif" }}
                    >
                      Honest Intentions{" "}
                    </h3>
                    <p
                      className="text-rhode-text font-semibold leading-relaxed"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      We care and take responsibility.
                    </p>
                  </div>
                  <div>
                    <h3
                      className="md:text-xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                      style={{ fontFamily: "Aglonema, serif" }}
                    >
                      Simplicity is strength
                    </h3>
                    <p
                      className="text-rhode-text font-semibold leading-relaxed"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Design for comfort and confidence.
                    </p>
                  </div>
                  <div>
                    <h3
                      className="md:text-xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                      style={{ fontFamily: "Aglonema, serif" }}
                    >
                      Care as culture
                    </h3>
                    <p
                      className="text-rhode-text font-semibold"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      For your mind, body and wallet
                    </p>
                  </div>
                  <div>
                    <h3
                      className="md:text-xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                      style={{ fontFamily: "Aglonema, serif" }}
                    >
                      Better , not perfect
                    </h3>
                    <p
                      className="text-rhode-text font-semibold"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      We’re transparent, intentional, and evolving.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <video
                  src={sectionvid1}
                  className="w-full h-auto rounded-3xl shadow-2xl"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-label="düpp sustainable beauty video"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
