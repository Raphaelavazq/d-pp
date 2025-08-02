import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import Carousel from "../components/Carousel";
import ImpactButton from "../components/ImpactButton";
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

  useEffect(() => {
    // Enable smooth scrolling
    ScrollTrigger.normalizeScroll(true);

    // Set initial states for hero elements
    gsap.set(
      [heroTextRef.current, heroSubtitleRef.current, heroButtonsRef.current],
      {
        opacity: 0,
        y: 60,
      }
    );
    gsap.set(heroImageRef.current, {
      opacity: 0,
      scale: 1.05,
    });

    // Get all sections with data-section attribute
    const sections = document.querySelectorAll("[data-section]");

    // Minimal Cityzen-style pinning and animations
    sections.forEach((section) => {
      // Pin each section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        scrub: 0.5,
      });

      // From bottom animation on enter
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Hero entrance animation
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .to(heroTextRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
      .to(
        heroSubtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        heroImageRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.6"
      )
      .to(
        heroButtonsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative pt-16 md:pt-20">
      {/* New Hero Section - Ready to Experience düpp? */}
      <section
        data-section="new-hero"
        className="h-screen w-full overflow-hidden bg-white shadow-xl flex items-center justify-center relative"
      >
        {/* Video background */}
        <div className="absolute inset-0 opacity-20 md:opacity-30">
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 md:px-8 lg:px-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-rhode-text mb-4 sm:mb-6 md:mb-8 lg:mb-12 leading-[0.9]"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Ready to
            <span className="block text-rhode-text">Experience düpp?</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-rhode-text/80 mb-6 sm:mb-8 md:mb-10 lg:mb-16 max-w-2xl mx-auto leading-relaxed font-light">
            Join thousands who have discovered the perfect blend of luxury and
            simplicity
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 justify-center">
            <ImpactButton
              variant="filled"
              className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 text-sm sm:text-base md:text-lg font-medium tracking-wide"
            >
              Shop Collection
            </ImpactButton>
            <ImpactButton
              variant="outline"
              className="px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 text-sm sm:text-base md:text-lg font-medium tracking-wide"
            >
              Learn More
            </ImpactButton>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section
        data-section="story"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center">
            {/* Video - Now on the left, full width to edge */}
            <div className="relative h-full flex items-center justify-center order-2 lg:order-1 bg-gray-50">
              <video
                src={sectionvid1}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Text Content - Now on the right, centered */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8 order-1 lg:order-2 px-6 sm:px-8 md:px-8 lg:px-12 flex flex-col justify-center h-full py-8 md:py-0">
              <div className="space-y-2 sm:space-y-4">
                <h2
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight text-rhode-text leading-[1.1] px-2 sm:px-0"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Confident and
                  <span className="block">Effortlessly Cool</span>
                </h2>
              </div>

              <div className="space-y-2 sm:space-y-4 hidden md:block">
                <p
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-rhode-text sm:text-rhode-text/70 max-w-xl font-light leading-relaxed"
                  style={{
                    fontFamily: designSystem.typography.fonts.secondary,
                  }}
                >
                  Welcome to düpp
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Original Hero Section - Now moved down */}
      <section
        ref={heroRef}
        data-section="hero"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center justify-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center">
            {/* Text Content - On the left, centered */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8 px-6 sm:px-8 md:px-8 lg:px-12 flex flex-col justify-center h-full py-8 md:py-0">
              <div ref={heroTextRef} className="space-y-2 sm:space-y-4">
                <h1
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium tracking-tight text-rhode-text leading-[1.1] px-2 sm:px-0"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Soft, Simple
                  <span className="block">and Sensibly Priced</span>
                </h1>
              </div>

              <div
                ref={heroSubtitleRef}
                className="space-y-2 sm:space-y-4 hidden md:block"
              >
                <p
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-rhode-text sm:text-rhode-text/70 max-w-xl font-light leading-relaxed"
                  style={{
                    fontFamily: designSystem.typography.fonts.secondary,
                  }}
                >
                  Discover our curated collection of essentials that blend
                  luxury with everyday simplicity.
                </p>
              </div>

              <div
                ref={heroButtonsRef}
                className="hidden md:flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center lg:justify-start pt-2 sm:pt-4"
              >
                <ImpactButton
                  variant="filled"
                  className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium tracking-wide"
                >
                  Discover Collection
                </ImpactButton>
                <ImpactButton
                  variant="outline"
                  className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base font-medium tracking-wide"
                >
                  Our Impact
                </ImpactButton>
              </div>
            </div>

            {/* Video - On the right, full width to edge */}
            <div
              ref={heroImageRef}
              className="relative h-full flex items-center justify-center bg-gray-50"
            >
              {/* Light grey overlay */}
              <div className="absolute inset-0 bg-gray-300/30 z-10"></div>
              <video
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        data-section="values"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white  shadow-xl items-center hidden lg:flex"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
          <Values cardStyle="home" />
        </div>
      </section>

      {/* Stay In Touch Section */}
      <section
        data-section="stay-in-touch"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-rhode-cream shadow-xl flex items-center justify-center"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 w-full text-center">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-medium mb-3 sm:mb-4 tracking-tight text-rhode-text leading-tight"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Stay In Touch
          </h2>

          <p
            className="text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto text-rhode-text font-medium"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Be the first to know about new launches, exclusive offers, and
            skincare tips from our experts.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto mb-6 sm:mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-none border-b-2 border-rhode-text bg-transparent placeholder-rhode-text focus:outline-none focus:border-rhode-dark text-base sm:text-lg transition-all duration-200 text-rhode-dark"
              style={{ fontFamily: "Chillax, sans-serif" }}
            />
            <button
              type="submit"
              className="py-3 sm:py-4 px-6 sm:px-8 bg-rhode-text text-rhode-light hover:bg-rhode-dark transition-all duration-300 uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>

          <p
            className="text-xs sm:text-sm text-rhode-text font-light"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <section
        data-section="footer"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center justify-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
          <footer className="text-center lg:text-left">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-8 sm:mb-10 md:mb-12">
              {/* Brand Section */}
              <div className="md:col-span-2 lg:col-span-2 space-y-4 sm:space-y-6">
                <h3
                  className="text-2xl sm:text-3xl font-medium text-rhode-text"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  düpp
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-rhode-text/70 max-w-md mx-auto lg:mx-0 leading-relaxed">
                  Soft, simple, and sensibly priced. Discover our curated
                  collection of essentials that blend luxury with everyday
                  simplicity.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4">
                  <ImpactButton
                    variant="filled"
                    className="px-4 py-2 sm:px-6 sm:py-3 text-sm"
                  >
                    Shop Now
                  </ImpactButton>
                  <ImpactButton
                    variant="outline"
                    className="px-4 py-2 sm:px-6 sm:py-3 text-sm"
                  >
                    Learn More
                  </ImpactButton>
                </div>
              </div>

              {/* Quick Links - Hidden on small screens */}
              <div className="space-y-3 sm:space-y-4 hidden sm:block">
                <h4
                  className="text-lg sm:text-xl font-medium text-rhode-text"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Quick Links
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <a
                      href="/shop"
                      className="text-sm sm:text-base text-rhode-text/70 hover:text-rhode-text transition-colors"
                    >
                      Shop
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="text-sm sm:text-base text-rhode-text/70 hover:text-rhode-text transition-colors"
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="/impact"
                      className="text-sm sm:text-base text-rhode-text/70 hover:text-rhode-text transition-colors"
                    >
                      Impact
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-sm sm:text-base text-rhode-text/70 hover:text-rhode-text transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support - Hidden on small screens */}
              <div className="space-y-3 sm:space-y-4 hidden sm:block">
                <h4
                  className="text-lg sm:text-xl font-medium text-rhode-text"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Support
                </h4>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <a
                      href="/faq"
                      className="text-sm sm:text-base text-rhode-text/70 hover:text-rhode-text transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/shipping"
                      className="text-sm sm:text-base text-rhode-text/70 hover:text-rhode-text transition-colors"
                    >
                      Shipping
                    </a>
                  </li>
                  <li>
                    <a
                      href="/returns"
                      className="text-sm sm:text-base text-rhode-text/70 hover:text-rhode-text transition-colors"
                    >
                      Returns
                    </a>
                  </li>
                  <li>
                    <a
                      href="/help"
                      className="text-sm sm:text-base text-rhode-text/70 hover:text-rhode-text transition-colors"
                    >
                      Help Center
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-rhode-text/20 pt-6 sm:pt-8 flex flex-col lg:flex-row justify-between items-center space-y-3 sm:space-y-4 lg:space-y-0">
              <p className="text-rhode-text/60 text-xs sm:text-sm">
                © 2024 düpp. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <a
                  href="/privacy"
                  className="text-rhode-text/60 hover:text-rhode-text text-xs sm:text-sm transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms"
                  className="text-rhode-text/60 hover:text-rhode-text text-xs sm:text-sm transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="/cookies"
                  className="text-rhode-text/60 hover:text-rhode-text text-xs sm:text-sm transition-colors"
                >
                  Cookies
                </a>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
