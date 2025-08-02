import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import ImpactButton from "../components/ImpactButton";

// Import videos
import impact1 from "../assets/impact1.mp4"; // Breaking Barriers
import impact2 from "../assets/impact2.mp4"; // 1% For Families
import impact3 from "../assets/impact3.mp4"; // Mental Health Matters
import impact4 from "../assets/impact4.mp4"; // Choosing Partners
import impact5 from "../assets/impact5.mp4"; // Hero background

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Impact = () => {
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
        className="h-screen w-full overflow-hidden bg-white flex items-center justify-center relative"
      >
        {/* Video background - Mental health/self-care focused */}
        <div className="absolute inset-0 opacity-30 md:opacity-40">
          <video
            src={impact5}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Minimal video overlay */}
          <div className="absolute inset-0 bg-gray-100/20 z-10"></div>
        </div>

        <div className="relative z-20 text-center max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-rhode-text mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-[0.9] tracking-tight"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Making
            <span className="block text-rhode-text">Impact</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-rhode-text/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Because confidence shouldn't be a luxury reserved for the few
          </p>
        </div>
      </section>

      {/* Mission Section - Mental Health Matters */}
      <section
        data-section="mission"
        className="h-screen w-full rounded-t-[3rem] overflow-hidden bg-gray-50 flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center min-h-0">
            {/* Video - Mental Health Matters */}
            <div className="relative h-full flex items-center justify-center order-2 lg:order-1 bg-gray-50 min-h-[300px] sm:min-h-[400px] lg:min-h-full">
              <video
                src={impact3}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Text Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 order-1 lg:order-2 px-6 sm:px-8 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-12 md:py-0">
              <div className="space-y-4 sm:space-y-6">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-rhode-text leading-[1.1]"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Mental Health
                  <span className="block">Matters</span>
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-rhode-text/70 max-w-xl font-light leading-relaxed">
                  We believe that feeling confident and beautiful shouldn't be a
                  privilege. When we feel good about ourselves, we naturally
                  extend that care to others.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-rhode-text/60 max-w-lg font-light leading-relaxed">
                  Too often, luxury becomes a barrier that separates us from our
                  own self-worth and from caring for our communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section - Breaking Barriers */}
      <section
        data-section="problem"
        className="h-screen w-full rounded-t-[3rem] overflow-hidden bg-white flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center min-h-0">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 order-1 px-6 sm:px-8 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-12 md:py-0">
              <div className="space-y-4 sm:space-y-6">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-rhode-text leading-[1.1]"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Breaking
                  <span className="block">Barriers</span>
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-rhode-text/70 max-w-xl font-light leading-relaxed">
                  When luxury becomes unattainable, we disconnect from ourselves
                  and stop nurturing our communities.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-rhode-text/60 max-w-lg font-light leading-relaxed">
                  We're changing this narrative by making confidence accessible
                  and using our success to support those who need it most.
                </p>
              </div>
            </div>

            {/* Video - Breaking Barriers */}
            <div className="relative h-full flex items-center justify-center order-2 bg-gray-100 min-h-[300px] sm:min-h-[400px] lg:min-h-full">
              <video
                src={impact1}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section - 1% For Families */}
      <section
        data-section="commitment"
        className="h-screen w-full rounded-t-[3rem] overflow-hidden bg-gray-50 flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center min-h-0">
            {/* Video - 1% For Families */}
            <div className="relative h-full flex items-center justify-center order-2 lg:order-1 bg-gray-50 min-h-[300px] sm:min-h-[400px] lg:min-h-full">
              <video
                src={impact2}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Text Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 order-1 lg:order-2 px-6 sm:px-8 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-12 md:py-0">
              <div className="space-y-4 sm:space-y-6">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-rhode-text leading-[1.1]"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  1% For
                  <span className="block">Families</span>
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-rhode-text/70 max-w-xl font-light leading-relaxed">
                  We commit 1% of our net sales to support mothers and children
                  in difficult situations.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-rhode-text/60 max-w-lg font-light leading-relaxed">
                  Every purchase you make helps fund organizations that provide
                  essential support, resources, and hope to families when they
                  need it most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Simple. Transparent. */}
      <section
        data-section="how-it-works"
        className="h-screen w-full rounded-t-[3rem] overflow-hidden bg-white flex items-center"
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="text-center space-y-12 sm:space-y-16 lg:space-y-20">
            <div className="space-y-6 sm:space-y-8">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight text-rhode-text leading-[0.9]"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Simple.
                <span className="block">Transparent.</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-rhode-text/70 max-w-4xl mx-auto leading-relaxed font-light">
                Every purchase creates ripples of positive change
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
              <div className="space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-rhode-text rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    1
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-rhode-text">
                  You Shop
                </h3>
                <p className="text-sm sm:text-base text-rhode-text/60 max-w-xs mx-auto leading-relaxed">
                  Choose pieces that make you feel confident and beautiful
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-rhode-text rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    2
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-rhode-text">
                  We Contribute
                </h3>
                <p className="text-sm sm:text-base text-rhode-text/60 max-w-xs mx-auto leading-relaxed">
                  1% of your purchase goes directly to our impact fund
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-rhode-text rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    3
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-rhode-text">
                  Families Thrive
                </h3>
                <p className="text-sm sm:text-base text-rhode-text/60 max-w-xs mx-auto leading-relaxed">
                  Funds support mothers and children through organizations we
                  trust
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section
        data-section="partners"
        className="h-screen w-full rounded-t-[3rem] overflow-hidden bg-gray-50 flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center min-h-0">
            {/* Text Content */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 order-1 px-6 sm:px-8 md:px-8 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-12 md:py-0">
              <div className="space-y-4 sm:space-y-6">
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-rhode-text leading-[1.1]"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Choosing
                  <span className="block">Partners</span>
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-rhode-text/70 max-w-xl font-light leading-relaxed">
                  We're carefully selecting organizations that align with our
                  values and demonstrate real impact.
                </p>
                <p className="text-sm sm:text-base md:text-lg text-rhode-text/60 max-w-lg font-light leading-relaxed">
                  Our partner announcement is coming soon. We believe in
                  transparency and will share exactly how your contributions are
                  making a difference.
                </p>
              </div>
            </div>

            {/* Video - Hope/community building */}
            <div className="relative h-full flex items-center justify-center order-2 bg-gray-100 min-h-[300px] sm:min-h-[400px] lg:min-h-full">
              <video
                src={impact4}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        data-section="cta"
        className="h-screen w-full rounded-t-[3rem] overflow-hidden bg-rhode-text flex items-center"
      >
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 text-center">
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            <div className="space-y-6 sm:space-y-8">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight text-white leading-[0.9]"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Feel Good.
                <span className="block">Do Good.</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                Join us in making confidence accessible and supporting families
                in need
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center">
              <Link to="/shop">
                <ImpactButton
                  variant="outline"
                  className="px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg md:text-xl font-medium tracking-wide text-white border-white hover:bg-white hover:text-rhode-text"
                >
                  Shop Collection
                </ImpactButton>
              </Link>
              <Link to="/about">
                <ImpactButton
                  variant="outline"
                  className="px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg md:text-xl font-medium tracking-wide text-white border-white hover:bg-white hover:text-rhode-text"
                >
                  Learn Our Story
                </ImpactButton>
              </Link>
            </div>

            <div className="pt-8 sm:pt-12">
              <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
                Every purchase matters. Every person matters. Together, we're
                building a world where confidence and care go hand in hand.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;
