import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StayInTouch from "../components/StayInTouch";

gsap.registerPlugin(ScrollTrigger);

const Impact = () => {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const impactGridRef = useRef(null);
  const initiativesRef = useRef(null);
  const sustainabilityRef = useRef(null);

  useEffect(() => {
    // Impact statistics
    const targetStats = {
      trees: 12847,
      plastic: 2500,
      carbon: 850,
      water: 15000,
    };
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

    // Stats counter animation
    if (statsRef.current) {
      const counters = statsRef.current.querySelectorAll("[data-stat]");
      counters.forEach((counter) => {
        const statType = counter.dataset.stat;
        const target = targetStats[statType];

        ScrollTrigger.create({
          trigger: counter,
          start: "top 90%",
          onEnter: () => {
            gsap.fromTo(
              counter,
              { textContent: 0 },
              {
                textContent: target,
                duration: 2.5,
                ease: "power2.out",
                snap: { textContent: 1 },
                onUpdate: function () {
                  const value = Math.round(this.targets()[0].textContent);
                  counter.textContent =
                    statType === "plastic" || statType === "carbon"
                      ? `${value.toLocaleString()}${statType === "plastic" ? "kg" : "t"}`
                      : statType === "water"
                        ? `${value.toLocaleString()}L`
                        : value.toLocaleString();
                },
              }
            );
          },
        });
      });
    }

    // Impact grid animation
    if (impactGridRef.current) {
      const impactCards =
        impactGridRef.current.querySelectorAll(".impact-card");
      gsap.fromTo(
        impactCards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: impactGridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Initiatives animation
    if (initiativesRef.current) {
      gsap.fromTo(
        initiativesRef.current.children,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: initiativesRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Sustainability section animation
    if (sustainabilityRef.current) {
      const sustainabilityItems = sustainabilityRef.current.querySelectorAll(
        ".sustainability-item"
      );
      gsap.fromTo(
        sustainabilityItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sustainabilityRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
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
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-rhode-cream"
        style={{ paddingTop: "5rem" }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-rhode-text/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 lg:p-16 shadow-2xl border border-white/20 text-center">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-rhode-dark leading-tight tracking-tight mb-6"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Our
              <span className="block text-transparent bg-gradient-to-r from-green-600 to-rhode-text bg-clip-text">
                Impact
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl text-rhode-text leading-relaxed max-w-3xl mx-auto font-normal mb-8"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Making a positive difference for our planet, one product at a
              time.
              <span className="block mt-2 text-lg opacity-80">
                Join us in creating a more sustainable future
              </span>
            </p>

            {/* Key impact highlight */}
            <div className="bg-green-50/50 backdrop-blur-sm rounded-2xl p-8 border border-green-200/30 max-w-md mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
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
                </div>
                <h3
                  className="text-2xl font-bold text-green-700 mb-2"
                  style={{ fontFamily: "Aglonema, serif" }}
                >
                  Carbon Neutral
                </h3>
                <p
                  className="text-green-600 text-sm"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Since 2023
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Impact by Numbers
            </h2>
            <p
              className="text-rhode-text leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Real impact through sustainable practices and conscious choices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-green-50/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-green-200/30 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
                  />
                </svg>
              </div>
              <div
                className="text-3xl font-bold text-green-700 mb-2"
                data-stat="trees"
              >
                0
              </div>
              <h3
                className="text-lg font-medium text-green-800 mb-1"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Trees Planted
              </h3>
              <p
                className="text-green-600 text-sm"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Through our reforestation program
              </p>
            </div>

            <div className="bg-blue-50/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-blue-200/30 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <div
                className="text-3xl font-bold text-blue-700 mb-2"
                data-stat="plastic"
              >
                0kg
              </div>
              <h3
                className="text-lg font-medium text-blue-800 mb-1"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Plastic Avoided
              </h3>
              <p
                className="text-blue-600 text-sm"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Through sustainable packaging
              </p>
            </div>

            <div className="bg-purple-50/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-purple-200/30 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                  />
                </svg>
              </div>
              <div
                className="text-3xl font-bold text-purple-700 mb-2"
                data-stat="carbon"
              >
                0t
              </div>
              <h3
                className="text-lg font-medium text-purple-800 mb-1"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                CO₂ Offset
              </h3>
              <p
                className="text-purple-600 text-sm"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Carbon footprint reduction
              </p>
            </div>

            <div className="bg-cyan-50/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-cyan-200/30 text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-cyan-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
              </div>
              <div
                className="text-3xl font-bold text-cyan-700 mb-2"
                data-stat="water"
              >
                0L
              </div>
              <h3
                className="text-lg font-medium text-cyan-800 mb-1"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Water Saved
              </h3>
              <p
                className="text-cyan-600 text-sm"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Through efficient processes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Initiatives */}
      <section
        ref={initiativesRef}
        className="py-20 bg-gradient-to-br from-white to-green-50/30"
      >
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Our Initiatives
            </h2>
            <p
              className="text-rhode-text leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Concrete actions for a sustainable future
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="text-xl font-medium mb-2 text-rhode-dark"
                      style={{ fontFamily: "Aglonema, serif" }}
                    >
                      Reforestation Program
                    </h3>
                    <p
                      className="text-rhode-text leading-relaxed"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      For every product sold, we plant a tree. Our partnership
                      with global reforestation organizations has resulted in
                      over 12,000 trees planted worldwide.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3
                      className="text-xl font-medium mb-2 text-rhode-dark"
                      style={{ fontFamily: "Aglonema, serif" }}
                    >
                      Zero Waste Packaging
                    </h3>
                    <p
                      className="text-rhode-text leading-relaxed"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      100% recyclable and biodegradable packaging made from
                      post-consumer materials. Our innovative design eliminates
                      plastic waste entirely.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-purple-600"
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
                  </div>
                  <div>
                    <h3
                      className="text-xl font-medium mb-2 text-rhode-dark"
                      style={{ fontFamily: "Aglonema, serif" }}
                    >
                      Renewable Energy
                    </h3>
                    <p
                      className="text-rhode-text leading-relaxed"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Our facilities run on 100% renewable energy, and we're
                      carbon neutral across our entire supply chain since 2023.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl p-8 text-white text-center">
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "Aglonema, serif" }}
                >
                  Join Our Mission
                </h3>
                <p
                  className="text-white/90 mb-6 leading-relaxed"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Every purchase contributes to a more sustainable future.
                  Together, we can make a lasting impact on our planet.
                </p>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-3xl font-bold mb-2">1,500+</div>
                  <div className="text-white/90 text-sm">
                    Customers making a difference
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Commitments */}
      <section ref={sustainabilityRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Our Commitments
            </h2>
            <p
              className="text-rhode-text leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Promises we keep for a better tomorrow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="sustainability-item text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
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
              </div>
              <h3
                className="text-xl font-medium mb-4 text-rhode-dark"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                2030 Goals
              </h3>
              <ul
                className="text-rhode-text space-y-2 text-left"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                <li>• 100% renewable energy</li>
                <li>• Carbon negative operations</li>
                <li>• Zero waste to landfill</li>
                <li>• 50,000 trees planted</li>
              </ul>
            </div>

            <div className="sustainability-item text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3
                className="text-xl font-medium mb-4 text-rhode-dark"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Certifications
              </h3>
              <ul
                className="text-rhode-text space-y-2 text-left"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                <li>• B Corp Certified</li>
                <li>• Leaping Bunny</li>
                <li>• PETA Approved</li>
                <li>• Carbon Trust Certified</li>
              </ul>
            </div>

            <div className="sustainability-item text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-xl font-medium mb-4 text-rhode-dark"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Community
              </h3>
              <ul
                className="text-rhode-text space-y-2 text-left"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                <li>• Fair trade partnerships</li>
                <li>• Local sourcing priority</li>
                <li>• Community education</li>
                <li>• Transparency reports</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <StayInTouch />
    </div>
  );
};

export default Impact;
