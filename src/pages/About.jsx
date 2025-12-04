import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import about from "../assets/about.mp4";
import about3 from "../assets/about3.mp4";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const About = () => {
  useEffect(() => {
    // Enable smooth scrolling
    ScrollTrigger.normalizeScroll(true);

    // Get all sections with data-section attribute
    const sections = document.querySelectorAll("[data-section]");

    // Minimal scroll pinning and animations
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

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative pt-16 md:pt-20">
      {/* Hero Section */}
      <section
        data-section="hero"
        className="h-screen w-full overflow-hidden bg-white shadow-xl flex items-center justify-center relative"
      >
        {/* Video background */}
        <div className="absolute inset-0 opacity-20 md:opacity-30">
          <video
            src={about3}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Video overlay */}
          <div className="absolute inset-0 bg-gray-300/40 z-10"></div>
        </div>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-stone mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-[0.9] tracking-tight font-chillax">
            About
            <span className="block text-stone">düpp</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-stone/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            Bold. Fashion-Forward. Unapologetically You.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section
        data-section="story"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center min-h-0">
            {/* Video - Left side, full width to edge */}
            <div className="relative h-full flex items-center justify-center order-2 lg:order-1 bg-gray-50 min-h-[300px] sm:min-h-[400px] lg:min-h-full">
              <video
                src={about}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Video overlay */}
              <div className="absolute inset-0 bg-gray-300/40 z-10"></div>
            </div>

            {/* Text Content - Right side, centered */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-8 sm:py-12 md:py-16 lg:py-0 order-1 lg:order-2">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-stone leading-[1.1] font-chillax">
                  Our Story
                  <span className="block">Begins Here</span>
                </h2>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone/80 leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                düpp was born in true startup style - wanting to create
                affordable, timeless pieces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        data-section="values"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center min-h-0">
            {/* Text Content - Left side, centered */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-8 sm:py-12 md:py-16 lg:py-0">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-stone leading-[1.1] font-chillax">
                  What We
                  <span className="block">Stand For</span>
                </h2>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone/80 leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                The values that drive our dream big attitude and empower you to
                be unapologetically yourself.
              </p>
            </div>

            {/* Video - Right side, full width to edge */}
            <div className="relative h-full flex items-center justify-center bg-gray-50 min-h-[300px] sm:min-h-[400px] lg:min-h-full">
              <video
                src={about3}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Video overlay */}
              <div className="absolute inset-0 bg-gray-300/40 z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section
        data-section="mission"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-sand shadow-xl flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center min-h-0">
            {/* Video - Left side, full width to edge */}
            <div className="relative h-full flex items-center justify-center order-2 lg:order-1 bg-gray-50 min-h-[300px] sm:min-h-[400px] lg:min-h-full">
              <video
                src={about}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
              {/* Video overlay */}
              <div className="absolute inset-0 bg-gray-300/40 z-10"></div>
            </div>

            {/* Text Content - Right side, centered */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-8 sm:py-12 md:py-16 lg:py-0 order-1 lg:order-2">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-stone leading-[1.1] font-chillax">
                  Our
                  <span className="block">Mission</span>
                </h2>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone/80 leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                To promote powerful babes across the globe and inspire girls
                everywhere to be exactly who they want to be.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center lg:justify-start">
                <Link
                  to="/shop"
                  className="bg-stone text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full text-base sm:text-lg md:text-xl font-medium hover:bg-opacity-90 transition-all duration-300 inline-block text-center font-chillax"
                >
                  Explore Our Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stay In Touch Section */}
      <section
        data-section="stay-in-touch"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-sand shadow-xl flex items-center justify-center"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 w-full text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-6 sm:mb-8 md:mb-10 tracking-tight text-stone leading-tight font-chillax">
            Stay In Touch
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 md:mb-12 lg:mb-16 leading-relaxed max-w-4xl mx-auto text-stone font-medium font-chillax">
            Be the first to know about new launches, exclusive offers, and
            skincare tips from our experts.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 sm:px-8 py-4 sm:py-5 md:py-6 rounded-full border border-stone/20 focus:outline-none focus:border-stone/50 text-base sm:text-lg md:text-xl font-chillax"
            />
            <button
              type="submit"
              className="bg-stone text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full hover:bg-stone/90 transition-colors text-base sm:text-lg md:text-xl font-medium font-chillax"
            >
              Subscribe
            </button>
          </form>

          <p className="text-sm sm:text-base md:text-lg text-stone/60 font-medium">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Footer Section */}
      <section
        data-section="footer"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center justify-center"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 w-full">
          <footer className="text-center lg:text-left">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 mb-8 sm:mb-10 md:mb-12">
              {/* Brand Section */}
              <div className="md:col-span-2 lg:col-span-2 space-y-6 sm:space-y-8">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium text-stone font-chillax">
                  düpp
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Bold, fashion-forward, and unapologetically you. Discover our
                  curated collection that blends affordable luxury with everyday
                  style.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-6">
                  <Link
                    to="/shop"
                    className="bg-stone text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full hover:bg-stone/90 transition-colors font-medium font-chillax"
                  >
                    Shop Now
                  </Link>
                  <Link
                    to="/about"
                    className="border border-stone text-stone px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full hover:bg-stone hover:text-white transition-colors font-medium font-chillax"
                  >
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6 sm:space-y-8">
                <h4 className="text-lg sm:text-xl md:text-2xl font-medium text-stone">
                  Quick Links
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg md:text-xl text-stone/70">
                  <li>
                    <Link
                      to="/shop"
                      className="hover:text-stone transition-colors"
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/about"
                      className="hover:text-stone transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="hover:text-stone transition-colors"
                    >
                      Contact
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/faq"
                      className="hover:text-stone transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Care */}
              <div className="space-y-6 sm:space-y-8">
                <h4 className="text-lg sm:text-xl md:text-2xl font-medium text-stone">
                  Customer Care
                </h4>
                <ul className="space-y-3 sm:space-y-4 text-base sm:text-lg md:text-xl text-stone/70">
                  <li>
                    <Link
                      to="/privacy"
                      className="hover:text-stone transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/terms"
                      className="hover:text-stone transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/accessibility"
                      className="hover:text-stone transition-colors"
                    >
                      Accessibility
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-8 sm:pt-10 border-t border-stone/10 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8">
              <p className="text-sm sm:text-base md:text-lg text-stone/60">
                © 2024 düpp. All rights reserved.
              </p>
              <div className="flex space-x-6 sm:space-x-8">
                <a
                  href="#"
                  className="text-stone/60 hover:text-stone transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.291L12.017 8.806l6.89 6.891c-.875.801-2.026 1.291-3.323 1.291H8.449z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-stone/60 hover:text-stone transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default About;
