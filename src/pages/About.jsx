import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StayInTouch from "../components/StayInTouch";
import aboutBanner from "../assets/about.mp4";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const heroRef = useRef();
  const contentRef = useRef();
  const valuesRef = useRef();

  useEffect(() => {
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

    gsap.fromTo(
      contentRef.current.children,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      valuesRef.current.children,
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: valuesRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Video */}
      <div
        ref={heroRef}
        className="relative w-full max-w-6xl mx-auto px-8 mb-16"
        style={{ aspectRatio: "16/6" }}
      >
        <video
          src={aboutBanner}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover rounded-3xl shadow-lg"
          style={{ aspectRatio: "16/6" }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1
            className="text-5xl md:text-7xl font-bold mb-4 tracking-tight drop-shadow-lg uppercase"
            style={{
              fontFamily: "Aglonema, serif",
              color: "white",
              textShadow: "0 2px 16px rgba(0,0,0,0.28)",
            }}
          >
            About düpp
          </h1>
          <p
            className="text-xl md:text-2xl font-bold max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
            style={{
              fontFamily: "Aglonema, serif",
              color: "white",
              textShadow: "0 2px 16px rgba(0,0,0,0.28)",
            }}
          >
            One of EVERYTHING really GOOD.
          </p>
          <p
            className="text-base mt-4 font-medium text-white/80"
            style={{
              fontFamily: "Chillax, sans-serif",
              textTransform: "lowercase",
            }}
          >
            We believe in <span className="uppercase">quality</span>. We believe
            in <span className="uppercase">honesty</span>. We don't compromise.
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/30 to-transparent pointer-events-none" />
      </div>

      {/* Story Section */}
      <section className="py-20">
        <div ref={contentRef} className="container mx-auto px-6">
          {/* ...rest of the content... */}
        </div>
      </section>

      {/* Values Section Placeholder for GSAP animation */}
      <div ref={valuesRef} style={{ display: "none" }} />

      {/* ...all other sections stay as is... */}

      <StayInTouch />
    </div>
  );
};

export default About;
