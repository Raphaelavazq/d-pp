import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "./Button";

gsap.registerPlugin(ScrollTrigger);

const StayInTouch = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (section) {
      gsap.fromTo(
        section,
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section ref={sectionRef} className={`py-20 bg-white ${className}`}>
      <div className="max-w-6xl mx-auto px-8">
        <div className="bg-rhode-cream rounded-3xl p-12 lg:p-16 shadow-sm text-center">
          <h2
            className="text-4xl md:text-5xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Stay In Touch
          </h2>

          <p
            className="text-lg  md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto text-rhode-text font-medium"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Be the first to know about new launches, exclusive offers, and
            skincare tips from our experts.
          </p>

          {!isSubmitted ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-6 py-4 rounded-none border-b-2 border-rhode-text bg-transparent placeholder-rhode-text focus:outline-none focus:border-rhode-dark text-lg transition-all duration-200 text-rhode-dark"
                style={{ fontFamily: "Chillax, sans-serif" }}
              />
              <Button
                type="submit"
                variant="dark"
                className="py-4 px-8 rounded-none uppercase tracking-wider text-sm whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          ) : (
            <div className="max-w-lg mx-auto mb-8">
              <div className="bg-rhode-light border border-rhode-text py-4 px-8 rounded-lg">
                <p
                  className="text-rhode-dark font-medium"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  ✓ Thank you for subscribing! Welcome to the düpp community.
                </p>
              </div>
            </div>
          )}

          <p
            className="text-sm text-rhode-text font-light"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default StayInTouch;
