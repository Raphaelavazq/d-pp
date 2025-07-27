import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Impact = () => {
  const [treeCount, setTreeCount] = useState(0);
  const counterRef = useRef(null);
  const heroRef = useRef(null);
  const impactGridRef = useRef(null);

  // Simulate tree counter (would be real data from API)
  const totalTrees = 12847;

  useEffect(() => {
    // Hero animation
    gsap.fromTo(
      heroRef.current.children,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      }
    );

    // Tree counter animation
    gsap.fromTo(
      counterRef.current,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: counterRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Animate number counting
    ScrollTrigger.create({
      trigger: counterRef.current,
      start: "top 80%",
      onEnter: () => {
        gsap.to(
          { count: 0 },
          {
            count: totalTrees,
            duration: 2,
            ease: "power2.out",
            onUpdate: function () {
              setTreeCount(Math.round(this.targets()[0].count));
            },
          }
        );
      },
    });

    // Impact grid animation
    gsap.fromTo(
      impactGridRef.current.children,
      {
        y: 60,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: impactGridRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [totalTrees]);

  const impactStats = [
    {
      icon: "🌱",
      number: "100%",
      label: "Vegan Formulas",
      description: "Every product is plant-based and cruelty-free",
    },
    {
      icon: "♻️",
      number: "85%",
      label: "Recycled Packaging",
      description: "Sustainable materials from post-consumer waste",
    },
    {
      icon: "💧",
      number: "50%",
      label: "Water Reduction",
      description: "Manufacturing process saves millions of liters",
    },
    {
      icon: "🌍",
      number: "Carbon",
      label: "Neutral Shipping",
      description: "Offset 100% of delivery emissions",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80')`,
          }}
        />

        <div
          ref={heroRef}
          className="relative z-10 text-center text-white px-6 max-w-4xl"
        >
          <h1 className="font-chillax text-6xl md:text-8xl font-bold mb-6">
            Growing Impact
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 opacity-90">
            Every purchase plants a tree. Every choice matters.
          </p>
          <div className="w-24 h-0.5 bg-[#f6febb] mx-auto"></div>
        </div>
      </section>

      {/* Tree Counter Section */}
      <section className="py-20 bg-[#b2bbc1]">
        <div className="container mx-auto px-6 text-center">
          <div ref={counterRef} className="max-w-2xl mx-auto">
            <h2 className="font-chillax text-2xl md:text-3xl font-bold text-white mb-8">
              Trees Planted This Year
            </h2>
            <div className="bg-white rounded-2xl p-12 shadow-xl">
              <div className="text-8xl md:text-9xl font-chillax font-bold text-[#b2bbc1] mb-4">
                {treeCount.toLocaleString()}
              </div>
              <p className="text-xl text-gray-600 font-light">
                and counting...
              </p>
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-500">
                  Partner:{" "}
                  <span className="font-semibold text-[#b2bbc1]">
                    One Tree Planted
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-chillax text-4xl md:text-5xl font-bold text-[#b2bbc1] mb-6">
              Beyond Beauty
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quality products that respect both you and the planet
            </p>
          </div>

          <div
            ref={impactGridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 rounded-2xl p-8 h-full transition-all duration-300 group-hover:bg-[#f6febb] group-hover:scale-105">
                  <div className="text-4xl mb-4">{stat.icon}</div>
                  <div className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-2">
                    {stat.number}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-3">
                    {stat.label}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-chillax text-4xl font-bold text-[#b2bbc1] mb-8">
              Our Commitment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h3 className="font-chillax text-2xl font-bold mb-4">
                  Partnership with One Tree Planted
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  For every order placed, we plant a tree through our
                  partnership with One Tree Planted. These reforestation
                  projects help restore forests, create habitat for
                  biodiversity, and contribute to the health of our planet.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#f6febb] rounded-full"></div>
                    <span className="text-gray-700">
                      Verified impact tracking
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#f6febb] rounded-full"></div>
                    <span className="text-gray-700">
                      Global reforestation projects
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#f6febb] rounded-full"></div>
                    <span className="text-gray-700">
                      Biodiversity restoration
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1574263867128-a3d5c1b1decc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Tree planting"
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-[#b2bbc1]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-chillax text-4xl font-bold text-white mb-6">
            Make an Impact Today
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Every purchase contributes to a more sustainable future. Shop with
            purpose.
          </p>
          <button className="bg-[#f6febb] text-[#b2bbc1] px-12 py-4 rounded-full font-semibold text-lg hover:bg-white transition-all duration-300 transform hover:scale-105">
            Shop Collection
          </button>
        </div>
      </section>
    </div>
  );
};

export default Impact;
