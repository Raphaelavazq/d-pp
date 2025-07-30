import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import Carousel from "../components/carousel";
import ImpactButton from "../components/ImpactButton";
import StayInTouch from "../components/StayInTouch";
import { designSystem, animations } from "../utils/designSystem";

import heroVideo from "../assets/heroVideo.mp4";
import sectionvid1 from "../assets/sectionvid1.mp4";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function Home() {
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const heroImageRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroButtonsRef = useRef(null);
  const brandStoryRef = useRef(null);
  const valuesRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Set initial states
    gsap.set(
      [heroTextRef.current, heroSubtitleRef.current, heroButtonsRef.current],
      {
        opacity: 0,
        y: 60,
      }
    );
    gsap.set(heroImageRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 40,
    });

    // Hero entrance animation
    const heroTl = gsap.timeline({
      delay: 0.3,
    });

    heroTl
      .to(heroTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      })
      .to(
        heroSubtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .to(
        heroImageRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.2)",
        },
        "-=0.8"
      )
      .to(
        heroButtonsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );

    // Parallax effect for hero image
    gsap.to(heroImageRef.current, {
      y: -50,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    // Brand story section animation
    if (brandStoryRef.current) {
      const brandElements = brandStoryRef.current.children;
      gsap.fromTo(
        brandElements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: brandStoryRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Values section animation
    if (valuesRef.current) {
      const valueCards = valuesRef.current.querySelectorAll(".value-card");
      gsap.fromTo(
        valueCards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: valuesRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Counter animation for stats
    if (statsRef.current) {
      const counters = statsRef.current.querySelectorAll("[data-count]");
      counters.forEach((counter) => {
        const target = parseInt(counter.dataset.count);
        ScrollTrigger.create({
          trigger: counter,
          start: "top 90%",
          onEnter: () => {
            gsap.to(counter, {
              textContent: target,
              duration: 2,
              ease: "power2.out",
              snap: { textContent: 1 },
              stagger: 0.2,
            });
          },
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-rhode-light via-white to-rhode-cream"
        style={{ paddingTop: "5rem" }}
      >
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rhode-text/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-charcoal/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 lg:p-16 shadow-2xl border border-white/20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Enhanced Text Content */}
              <div className="text-center lg:text-left space-y-8">
                <div ref={heroTextRef} className="space-y-6">
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-rhode-dark leading-tight tracking-tight"
                    style={{
                      fontFamily: designSystem.typography.fonts.primary,
                    }}
                  >
                    soft, simple
                    <span className="block text-transparent bg-gradient-to-r from-rhode-text to-charcoal bg-clip-text">
                      and sensibly priced
                    </span>
                  </h1>
                </div>

                <div ref={heroSubtitleRef}>
                  <p
                    className="text-xl md:text-2xl text-rhode-text leading-relaxed max-w-2xl font-normal"
                    style={{
                      fontFamily: designSystem.typography.fonts.primary,
                    }}
                  >
                    Inspired by icons. Designed for now.
                    <span className="block mt-2 text-lg opacity-80">
                      Premium skincare that elevates your daily ritual
                    </span>
                  </p>
                </div>

                <div
                  ref={heroButtonsRef}
                  className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                >
                  <ImpactButton
                    variant="filled"
                    className="px-8 py-4 text-sm font-medium tracking-wide transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Discover Collection
                  </ImpactButton>
                  <ImpactButton
                    variant="outline"
                    className="px-8 py-4 text-sm font-medium tracking-wide transform hover:scale-105 transition-all duration-300"
                  >
                    Our Impact
                  </ImpactButton>
                </div>

                {/* Trust indicators */}
                <div
                  ref={statsRef}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8 opacity-70"
                >
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-rhode-dark"
                      data-count="50000"
                    >
                      0
                    </div>
                    <div className="text-sm text-rhode-text">
                      Happy Customers
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-rhode-dark"
                      data-count="98"
                    >
                      0
                    </div>
                    <div className="text-sm text-rhode-text">
                      % Natural Ingredients
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-rhode-dark"
                      data-count="24"
                    >
                      0
                    </div>
                    <div className="text-sm text-rhode-text">
                      Hour Hydration
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Video */}
              <div ref={heroImageRef} className="relative group">
                <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute -inset-4 bg-gradient-to-r from-rhode-text/20 to-charcoal/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <video
                    src={heroVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="relative w-full h-auto rounded-3xl shadow-2xl object-cover border-4 border-white/50"
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-rhode-text/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-rhode-text/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel */}
      <Carousel />

      {/* Stay In Touch */}
      <StayInTouch />

      {/* Enhanced Brand Story Section */}
      <section className="py-24 bg-rhode-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-12 lg:p-20 shadow-xl">
            <div
              ref={brandStoryRef}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div className="space-y-8">
                <h2
                  className="text-4xl md:text-5xl font-bold text-rhode-dark leading-tight tracking-tight"
                  style={{ fontFamily: designSystem.typography.fonts.primary }}
                >
                  Confident and Effortlessly Cool
                </h2>
                <p
                  className="text-2xl text-rhode-text font-medium leading-relaxed"
                  style={{
                    fontFamily: designSystem.typography.fonts.secondary,
                  }}
                >
                  Welcome to düpp - where premium skincare meets modern luxury
                </p>

                <div
                  ref={valuesRef}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="value-card bg-rhode-light p-6 rounded-2xl border border-rhode-text/10 hover:shadow-lg transition-all duration-300">
                    <h3
                      className="text-xl font-medium mb-3 text-rhode-dark"
                      style={{
                        fontFamily: designSystem.typography.fonts.primary,
                      }}
                    >
                      Honest Intentions
                    </h3>
                    <p
                      className="text-rhode-text leading-relaxed"
                      style={{
                        fontFamily: designSystem.typography.fonts.secondary,
                      }}
                    >
                      We care and take responsibility for your skin and our
                      planet.
                    </p>
                  </div>

                  <div className="value-card bg-rhode-light p-6 rounded-2xl border border-rhode-text/10 hover:shadow-lg transition-all duration-300">
                    <h3
                      className="text-xl font-medium mb-3 text-rhode-dark"
                      style={{
                        fontFamily: designSystem.typography.fonts.primary,
                      }}
                    >
                      Simplicity is Strength
                    </h3>
                    <p
                      className="text-rhode-text leading-relaxed"
                      style={{
                        fontFamily: designSystem.typography.fonts.secondary,
                      }}
                    >
                      Design for comfort and confidence in every application.
                    </p>
                  </div>

                  <div className="value-card bg-rhode-light p-6 rounded-2xl border border-rhode-text/10 hover:shadow-lg transition-all duration-300">
                    <h3
                      className="text-xl font-medium mb-3 text-rhode-dark"
                      style={{
                        fontFamily: designSystem.typography.fonts.primary,
                      }}
                    >
                      Care as Culture
                    </h3>
                    <p
                      className="text-rhode-text leading-relaxed"
                      style={{
                        fontFamily: designSystem.typography.fonts.secondary,
                      }}
                    >
                      For your mind, body and wallet - sustainable luxury for
                      all.
                    </p>
                  </div>

                  <div className="value-card bg-rhode-light p-6 rounded-2xl border border-rhode-text/10 hover:shadow-lg transition-all duration-300">
                    <h3
                      className="text-xl font-medium mb-3 text-rhode-dark"
                      style={{
                        fontFamily: designSystem.typography.fonts.primary,
                      }}
                    >
                      Better, Not Perfect
                    </h3>
                    <p
                      className="text-rhode-text leading-relaxed"
                      style={{
                        fontFamily: designSystem.typography.fonts.secondary,
                      }}
                    >
                      We're transparent, intentional, and always evolving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-rhode-text/20 to-charcoal/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <video
                  src={sectionvid1}
                  className="relative w-full h-auto rounded-3xl shadow-2xl border-4 border-white/50 transform group-hover:scale-105 transition-transform duration-500"
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
