import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StayInTouch from "../components/StayInTouch";
import Values from "../components/Values";
import aboutBanner from "../assets/about.mp4";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const missionRef = useRef(null);
  const statsRef = useRef(null);

  // Custom values for About page
  const aboutValues = [
    {
      id: "honest-care",
      title: "Honest Care",
      description:
        "We care about your skin and the planet, making choices that benefit both",
      icon: (
        <svg
          className="w-8 h-8 text-rhode-text"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      id: "simple-power",
      title: "Simple Power",
      description: "Powerful results through simple, effective formulations",
      icon: (
        <svg
          className="w-8 h-8 text-rhode-text"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: "proven-quality",
      title: "Proven Quality",
      description:
        "Every product is rigorously tested for safety and effectiveness",
      icon: (
        <svg
          className="w-8 h-8 text-rhode-text"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: "sustainable-future",
      title: "Sustainable Future",
      description: "Building a better tomorrow through responsible practices",
      icon: (
        <svg
          className="w-8 h-8 text-rhode-text"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    // Hero animation with enhanced entrance
    gsap.fromTo(
      heroRef.current?.children || [],
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.3,
      }
    );

    // Story section animation
    if (storyRef.current) {
      gsap.fromTo(
        storyRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: storyRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Values cards animation
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

    // Mission section animation
    if (missionRef.current) {
      gsap.fromTo(
        missionRef.current.children,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Stats counter animation
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
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rhode-text/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-charcoal/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 lg:p-16 shadow-2xl border border-white/20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Enhanced Text Content */}
              <div className="text-center lg:text-left space-y-8">
                <h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-rhode-dark leading-tight tracking-tight"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  About
                  <span className="block text-transparent bg-gradient-to-r from-rhode-text to-charcoal bg-clip-text">
                    düpp
                  </span>
                </h1>

                <p
                  className="text-xl md:text-2xl text-rhode-text leading-relaxed max-w-2xl font-normal"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  One of EVERYTHING really GOOD.
                  <span className="block mt-4 text-lg opacity-80">
                    We believe in quality. We believe in honesty. We don't
                    compromise.
                  </span>
                </p>

                {/* Company stats */}
                <div
                  ref={statsRef}
                  className="flex flex-wrap items-center justify-center lg:justify-start gap-8 pt-8 opacity-70"
                >
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-rhode-dark"
                      data-count="2020"
                    >
                      0
                    </div>
                    <div className="text-sm text-rhode-text">Founded</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-rhode-dark"
                      data-count="100"
                    >
                      0
                    </div>
                    <div className="text-sm text-rhode-text">% Sustainable</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-rhode-dark"
                      data-count="50"
                    >
                      0
                    </div>
                    <div className="text-sm text-rhode-text">Countries</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Video */}
              <div className="relative group">
                <div className="relative z-10 transform transition-transform duration-500 group-hover:scale-105">
                  <div className="absolute -inset-4 bg-gradient-to-r from-rhode-text/20 to-charcoal/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <video
                    src={aboutBanner}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="relative w-full h-auto rounded-3xl shadow-2xl object-cover border-4 border-white/50"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <source src={aboutBanner} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="bg-rhode-cream rounded-3xl p-12 lg:p-16 shadow-sm">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-medium mb-6 tracking-tight text-rhode-text leading-tight"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Our Story
              </h2>
              <p
                className="text-xl text-rhode-text max-w-3xl mx-auto leading-relaxed"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                düpp was born from a simple belief: skincare should be
                effective, honest, and accessible. We're here to cut through the
                noise and deliver what really works.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3
                  className="text-2xl font-medium text-rhode-text"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Founded on Authenticity
                </h3>
                <p
                  className="text-rhode-text leading-relaxed"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  In a world of overcomplicated routines and empty promises, we
                  chose a different path. Every product we create is tested,
                  refined, and perfected before it reaches you.
                </p>
                <p
                  className="text-rhode-text leading-relaxed"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  We believe in transparency, sustainability, and most
                  importantly, results that speak for themselves.
                </p>
              </div>
              <div className="space-y-4">
                <div className="bg-white/50 p-6 rounded-2xl">
                  <h4
                    className="font-medium text-rhode-dark mb-2"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Quality First
                  </h4>
                  <p
                    className="text-sm text-rhode-text"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Every ingredient is carefully sourced and rigorously tested
                  </p>
                </div>
                <div className="bg-white/50 p-6 rounded-2xl">
                  <h4
                    className="font-medium text-rhode-dark mb-2"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Sustainable Beauty
                  </h4>
                  <p
                    className="text-sm text-rhode-text"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Committed to eco-friendly practices and packaging
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        ref={valuesRef}
        className="py-20 bg-gradient-to-br from-white to-rhode-light/30"
      >
        <div className="max-w-6xl mx-auto px-8">
          <Values
            title="Our Values"
            subtitle="The principles that guide everything we do"
            values={aboutValues}
            cardStyle="default"
          />
        </div>
      </section>

      {/* Mission Statement */}
      <section ref={missionRef} className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div className="bg-rhode-cream/50 backdrop-blur-sm rounded-3xl p-12 lg:p-16 shadow-lg border border-white/20">
            <h2
              className="text-3xl md:text-4xl font-medium mb-8 tracking-tight text-rhode-text leading-tight"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Our Mission
            </h2>
            <p
              className="text-xl md:text-2xl text-rhode-text leading-relaxed mb-8"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              To create skincare that works as hard as you do, without the
              complexity or compromise.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-4 bg-rhode-text text-white rounded-full font-medium hover:bg-rhode-dark transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Explore Our Products
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <StayInTouch />
    </div>
  );
};

export default About;
