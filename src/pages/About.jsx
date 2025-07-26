import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const heroRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Simple fade-in animations
      gsap.fromTo(
        ".hero-title",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".content-section",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="hero-title text-6xl md:text-8xl font-normal text-charcoal mb-8"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            About düpp
          </h1>
          <p
            className="text-xl text-charcoal/70 font-light leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            We believe luxury should be accessible to everyone. Our curated
            collection of designer-inspired pieces brings you the best of
            high-end fashion without the price tag.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section ref={contentRef} className="pb-20">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          {/* Our Story */}
          <div className="content-section">
            <h2
              className="text-3xl font-normal text-charcoal mb-6"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Our Story
            </h2>
            <p
              className="text-charcoal/70 font-light leading-relaxed mb-4"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Founded with a simple belief: style shouldn't be exclusive. We
              started düpp to democratize fashion, creating beautiful pieces
              inspired by the world's most coveted designs.
            </p>
            <p
              className="text-charcoal/70 font-light leading-relaxed"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Every piece in our collection is carefully crafted with attention
              to detail and quality that rivals the originals, but at a fraction
              of the cost.
            </p>
          </div>

          {/* Our Mission */}
          <div className="content-section">
            <h2
              className="text-3xl font-normal text-charcoal mb-6"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Our Mission
            </h2>
            <p
              className="text-charcoal/70 font-light leading-relaxed"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              To make luxury accessible without compromising on quality or
              ethics. We work with trusted manufacturers who share our
              commitment to fair labor practices and sustainable production.
            </p>
          </div>

          {/* Our Values */}
          <div className="content-section">
            <h2
              className="text-3xl font-normal text-charcoal mb-6"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3
                  className="text-lg font-medium text-charcoal mb-3"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Quality
                </h3>
                <p
                  className="text-charcoal/70 font-light"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  We never compromise on materials or craftsmanship.
                </p>
              </div>
              <div>
                <h3
                  className="text-lg font-medium text-charcoal mb-3"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Accessibility
                </h3>
                <p
                  className="text-charcoal/70 font-light"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Beautiful design should be available to everyone.
                </p>
              </div>
              <div>
                <h3
                  className="text-lg font-medium text-charcoal mb-3"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Transparency
                </h3>
                <p
                  className="text-charcoal/70 font-light"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  We're honest about our processes and inspirations.
                </p>
              </div>
              <div>
                <h3
                  className="text-lg font-medium text-charcoal mb-3"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Sustainability
                </h3>
                <p
                  className="text-charcoal/70 font-light"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  We're committed to responsible production practices.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="content-section text-center pt-8">
            <Link
              to="/shop"
              className="inline-block bg-charcoal text-white px-8 py-3 rounded-full font-medium hover:bg-charcoal/90 transition-colors duration-200"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
