import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const heroRef = useRef();
  const formRef = useRef();

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
        ".contact-form",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="hero-title text-6xl md:text-8xl font-normal text-charcoal mb-8"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Contact
          </h1>
          <p
            className="text-xl text-charcoal/70 font-light leading-relaxed max-w-2xl mx-auto"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section ref={formRef} className="pb-20">
        <div className="max-w-2xl mx-auto px-6">
          {isSubmitted ? (
            <div className="contact-form text-center py-16">
              <h2
                className="text-3xl font-normal text-charcoal mb-4"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Thank you!
              </h2>
              <p
                className="text-charcoal/70 font-light mb-8"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-charcoal text-white px-6 py-3 rounded-full font-medium hover:bg-charcoal/90 transition-colors duration-200"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-charcoal mb-2"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-charcoal transition-colors duration-200"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-charcoal mb-2"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-charcoal transition-colors duration-200"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-charcoal mb-2"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-charcoal transition-colors duration-200"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-charcoal mb-2"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-charcoal transition-colors duration-200 resize-none"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="bg-charcoal text-white px-8 py-3 rounded-full font-medium hover:bg-charcoal/90 transition-colors duration-200"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3
                className="text-lg font-medium text-charcoal mb-3"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Email
              </h3>
              <p
                className="text-charcoal/70 font-light"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                hello@dupp.com
              </p>
            </div>
            <div>
              <h3
                className="text-lg font-medium text-charcoal mb-3"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Response Time
              </h3>
              <p
                className="text-charcoal/70 font-light"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Within 24 hours
              </p>
            </div>
            <div>
              <h3
                className="text-lg font-medium text-charcoal mb-3"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Support Hours
              </h3>
              <p
                className="text-charcoal/70 font-light"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Mon-Fri, 9AM-6PM EST
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
