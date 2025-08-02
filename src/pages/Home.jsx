import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import Carousel from "../components/Carousel";
import ImpactButton from "../components/ImpactButton";
import StayInTouch from "../components/StayInTouch";
import Values from "../components/Values";
import { designSystem } from "../utils/designSystem";

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
        className="relative min-h-[80vh] flex items-center justify-center bg-white"
        style={{ paddingTop: "5rem" }}
      >
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rhode-text/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-charcoal/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8">
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-6 lg:p-12 shadow-2xl border border-white/20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Enhanced Text Content */}
              <div className="text-center lg:text-left space-y-6">
                <div ref={heroTextRef} className="space-y-4">
                  <h1
                    className="text-4xl md:text-5xl lg:text-6xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Soft, Simple
                    <span
                      className="block text-4xl md:text-5xl lg:text-6xl font-medium text-rhode-text leading-tight"
                      style={{
                        fontFamily: "Chillax, sans-serif",
                      }}
                    >
                      and Sensibly Priced
                    </span>
                  </h1>
                </div>

                <div ref={heroSubtitleRef} className="space-y-3">
                  <p
                    className="text-lg md:text-xl text-rhode-text  max-w-2xl font-normal"
                    style={{
                      fontFamily: designSystem.typography.fonts.secondary,
                    }}
                  >
                    Discover our curated collection of essentials that
                    blend luxury with everyday simplicity.
                  </p>
                </div>

                <div
                  ref={heroButtonsRef}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <ImpactButton
                    variant="filled"
                    className="px-6 py-3 text-sm font-medium tracking-wide transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Discover Collection
                  </ImpactButton>
                  <ImpactButton
                    variant="outline"
                    className="px-6 py-3 text-sm font-medium tracking-wide transform hover:scale-105 transition-all duration-300"
                  >
                    Our Impact
                  </ImpactButton>
                </div>
              </div>

              {/* Enhanced Video */}
              <div ref={heroImageRef} className="relative">
                <div className="relative z-10">
                  <video
                    src={heroVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="relative w-full h-auto rounded-2xl shadow-xl object-cover"
                    style={{ aspectRatio: "3/4", maxHeight: "500px" }}
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

     

      {/* Enhanced Brand Story Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-12 lg:p-20 shadow-xl">
            <div ref={brandStoryRef} className="space-y-16">
              {/* Hero-style layout with text and video side by side */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2
                      className="text-4xl md:text-5xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Confident and Effortlessly Cool
                    </h2>
                    <p
                      className="text-xl md:text-2xl text-rhode-text font-normal leading-relaxed"
                      style={{
                        fontFamily: designSystem.typography.fonts.secondary,
                      }}
                    >
                      Welcome to düpp
                    </p>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-rhode-text/20 to-charcoal/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <video
                    src={sectionvid1}
                    className="relative w-full h-auto rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
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
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-white to-rhode-light/30">
        <div className="max-w-6xl mx-auto px-8">
          <div ref={valuesRef}>
            <Values cardStyle="home" />
          </div>
        </div>
      </section>
  
    {/* Stay In Touch */}
    <StayInTouch />
    </div>
  );
}
