import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShoppingBag, Star, Heart } from "lucide-react";
import underwaterVideo from "../assets/unnderwater_logo_sound.mp4";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Video entrance animation
      gsap.fromTo(
        videoRef.current,
        { opacity: 0, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" }
      );

      // Hero animation with new structure
      const heroTl = gsap.timeline();
      heroTl
        .fromTo(
          heroRef.current.querySelector("h1"),
          { opacity: 0, y: 100, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1.8, ease: "power3.out" }
        )
        .fromTo(
          heroRef.current.querySelector("p"),
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
          "-=1.0"
        )
        .fromTo(
          heroRef.current.querySelector(".mb-8"),
          { opacity: 0, y: 30, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" },
          "-=0.8"
        )
        .fromTo(
          heroRef.current.querySelectorAll(".flex a, .flex Link"),
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.6"
        )
        .fromTo(
          heroRef.current.querySelector(".mb-8:last-of-type"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          heroRef.current.querySelector(".bottom-8"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        );

      // Floating background elements animation
      const bgElements = heroRef.current.querySelectorAll(".absolute.blur-3xl");
      bgElements.forEach((el, index) => {
        gsap.to(el, {
          y: "random(-30, 30)",
          x: "random(-20, 20)",
          rotation: "random(-10, 10)",
          duration: "random(8, 12)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 2,
        });
      });

      // Container reveal with scale effect
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 100, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Cards staggered animation with rotation and scale
      gsap.fromTo(
        cardsRef.current,
        {
          opacity: 0,
          y: 80,
          rotationY: -15,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          rotationY: 0,
          scale: 1,
          duration: 1,
          stagger: {
            amount: 0.8,
            from: "start",
          },
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "top 40%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Individual card hover animations
      cardsRef.current.forEach((card) => {
        if (card) {
          const image = card.querySelector("img:first-of-type");
          const button = card.querySelector(".absolute button");

          // Card hover effect
          card.addEventListener("mouseenter", () => {
            gsap.to(card, {
              y: -10,
              scale: 1.02,
              duration: 0.4,
              ease: "power2.out",
            });
            gsap.to(image, { scale: 1.1, duration: 0.6, ease: "power2.out" });
            if (button) {
              gsap.to(button, {
                scale: 1.1,
                rotation: 5,
                duration: 0.3,
                ease: "back.out(1.7)",
              });
            }
          });

          card.addEventListener("mouseleave", () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: "power2.out",
            });
            gsap.to(image, { scale: 1, duration: 0.6, ease: "power2.out" });
            if (button) {
              gsap.to(button, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out",
              });
            }
          });
        }
      });

      // Brand story section animation
      const brandSection = document.querySelector(".brand-story");
      if (brandSection) {
        const textContent = brandSection.querySelector("div:first-child");
        const imageContent = brandSection.querySelector("div:last-child");

        gsap.fromTo(
          textContent,
          { opacity: 0, x: -100 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: brandSection,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          imageContent,
          { opacity: 0, x: 100, rotationY: 15 },
          {
            opacity: 1,
            x: 0,
            rotationY: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: brandSection,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Floating elements animation
        const floatingElements = brandSection.querySelectorAll(".absolute div");
        floatingElements.forEach((el, index) => {
          gsap.to(el, {
            y: "random(-20, 20)",
            x: "random(-10, 10)",
            rotation: "random(-5, 5)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.5,
          });
        });
      }

      // Text reveal animation for headings
      const headings = document.querySelectorAll("h2, h1");
      headings.forEach((heading) => {
        if (heading.closest("[ref]")) return; // Skip hero heading

        gsap.fromTo(
          heading,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Smooth page transitions
      gsap.set("body", { opacity: 1 });
    });

    return () => ctx.revert();
  }, []);

  const products = [
    {
      id: 1,
      name: "Peptide Glazing Fluid",
      price: 29,
      image:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      hoverImage:
        "https://images.unsplash.com/photo-1570194065650-d99bf96737d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      name: "Barrier Restore Cream",
      price: 32,
      image:
        "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      hoverImage:
        "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      name: "Pineapple Refresh Cleanser",
      price: 24,
      image:
        "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      hoverImage:
        "https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      name: "Pocket Blush",
      price: 38,
      image:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      hoverImage:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 5,
      name: "Lip Treatment",
      price: 16,
      image:
        "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      hoverImage:
        "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 6,
      name: "Solar Complex",
      price: 34,
      image:
        "https://images.unsplash.com/photo-1570194065650-d99bf96737d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      hoverImage:
        "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Underwater Logo Video Section */}
      <section className="relative w-full">
        <video
          ref={videoRef}
          className="w-full h-auto object-cover"
          autoPlay
          muted
          playsInline
          controls={false}
        >
          <source src={underwaterVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 pb-12"
        style={{ backgroundColor: "#F7FFBB" }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: "#D6C5C5" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 rounded-full opacity-15 blur-3xl"
            style={{ backgroundColor: "#B0BBC1" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[600px] h-80 sm:h-[600px] rounded-full opacity-5 blur-3xl"
            style={{ backgroundColor: "#D6C5C5" }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Main Headline */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight mb-3 sm:mb-4 md:mb-6"
            style={{ color: "#555555" }}
          >
            <span className="font-['Chillax'] font-extrabold tracking-tight">
              Only Good <span className="relative inline-block">düpp</span>.
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2"
            style={{ color: "#3A3A3A" }}
          >
            <span className="font-['Chillax'] font-normal">
              Luxury vibes, accessible prices. <br />
              The dupes your FYP can't stop talking about.
            </span>
          </p>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8 md:mb-10 max-w-xs sm:max-w-lg lg:max-w-xl mx-auto px-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trending dupes..."
                className="w-full px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base rounded-full border-2 border-transparent focus:border-opacity-50 transition-all duration-300 shadow-lg backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "#3A3A3A",
                }}
              />
              <button
                className="absolute right-1 sm:right-1.5 md:right-2 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 md:p-2.5 rounded-full transition-all duration-300 hover:scale-110"
                style={{ backgroundColor: "#3A3A3A" }}
              >
                <svg
                  width="14"
                  height="14"
                  className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 justify-center items-center mb-6 sm:mb-8 md:mb-12 px-2">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 px-5 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl transform w-full sm:w-auto max-w-xs sm:max-w-none justify-center"
              style={{
                backgroundColor: "#555555",
                color: "#F7FFBB",
              }}
            >
              <ShoppingBag
                size={16}
                className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
              />
              Shop Now
              <ArrowRight
                size={16}
                className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 px-5 sm:px-6 md:px-8 lg:px-10 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-full border-2 sm:border-2 md:border-3 transition-all duration-300 hover:scale-105 hover:shadow-xl transform w-full sm:w-auto max-w-xs sm:max-w-none justify-center"
              style={{
                borderColor: "#3A3A3A",
                color: "#3A3A3A",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
              }}
            >
              <svg
                width="16"
                height="16"
                className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
              TikTok Trending
              <ArrowRight
                size={16}
                className="sm:w-[18px] sm:h-[18px] md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Brand Badge */}
          <div>
            <div
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 rounded-full backdrop-blur-sm mx-2"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
            >
              <Star
                size={14}
                style={{ color: "#3A3A3A" }}
                className="fill-current sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]"
              />
              <span
                className="text-xs sm:text-xs md:text-sm font-medium"
                style={{ color: "#3A3A3A" }}
              >
                4.8/5 • 50K+ Happy Customers
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div
            className="w-4 h-6 sm:w-5 sm:h-8 md:w-6 md:h-10 border-2 rounded-full flex justify-center"
            style={{ borderColor: "#3A3A3A" }}
          >
            <div
              className="w-0.5 h-1.5 sm:w-0.5 sm:h-2 md:w-1 md:h-3 rounded-full mt-1 sm:mt-1.5 md:mt-2 animate-pulse"
              style={{ backgroundColor: "#3A3A3A" }}
            ></div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-gray-50">
        <div ref={containerRef} className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light text-charcoal-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-charcoal-600 max-w-2xl mx-auto">
              Discover our bestselling products crafted with clean ingredients
              for healthy, glowing skin
            </p>
          </div>

          <div className="bg-gray-100 rounded-3xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <img
                      src={product.hoverImage}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                        <Heart size={18} className="text-charcoal-700" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-charcoal-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-semibold text-charcoal-900">
                        ${product.price}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className="text-amber-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="mt-4 w-full bg-charcoal-900 text-white py-3 rounded-lg font-medium hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={18} />
                      Add to Cart
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 brand-story">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-light text-charcoal-900 mb-6">
                Clean Beauty, Simplified
              </h2>
              <p className="text-lg text-charcoal-600 mb-8 leading-relaxed">
                At düpp, we believe beauty shouldn't be complicated. Our
                carefully curated collection features clean, effective products
                that work in harmony with your skin's natural processes.
              </p>
              <p className="text-lg text-charcoal-600 mb-8 leading-relaxed">
                From our signature Peptide Glazing Fluid to our nourishing
                Barrier Restore Cream, each product is formulated with intention
                and crafted with care.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-charcoal-900 font-medium text-lg hover:gap-4 transition-all duration-300"
              >
                Learn More <ArrowRight size={20} />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Brand story"
                className="w-full rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cream-200 rounded-full opacity-60"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-charcoal-200 rounded-full opacity-40"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
