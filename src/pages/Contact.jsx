import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StayInTouch from "../components/StayInTouch";
import Button from "../components/Button";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const faqRef = useRef(null);

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

    // Form animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // Info cards animation
    if (infoRef.current) {
      const infoCards = infoRef.current.querySelectorAll(".info-card");
      gsap.fromTo(
        infoCards,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.3)",
          scrollTrigger: {
            trigger: infoRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    // FAQ animation
    if (faqRef.current) {
      gsap.fromTo(
        faqRef.current.children,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Enhanced Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-rhode-light via-white to-rhode-cream"
        style={{ paddingTop: "5rem" }}
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rhode-text/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-charcoal/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl p-8 lg:p-16 shadow-2xl border border-white/20 text-center">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-rhode-dark leading-tight tracking-tight mb-6"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Get in
              <span className="block text-transparent bg-gradient-to-r from-rhode-text to-charcoal bg-clip-text tracking-wider">
                Touch
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl text-rhode-text leading-relaxed max-w-3xl mx-auto font-normal"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
              <span className="block mt-2 text-lg opacity-80">
                Your questions and feedback matter to us
              </span>
            </p>

            {/* Contact stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 opacity-70">
              <div className="text-center">
                <div className="text-2xl font-bold text-rhode-dark">24h</div>
                <div className="text-sm text-rhode-text">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rhode-dark">5★</div>
                <div className="text-sm text-rhode-text">Support Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rhode-dark">24/7</div>
                <div className="text-sm text-rhode-text">Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section ref={infoRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="info-card bg-rhode-cream/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <div className="w-16 h-16 bg-rhode-text/10 rounded-full flex items-center justify-center mx-auto mb-6">
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-medium mb-2 text-rhode-dark"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Email Us
              </h3>
              <p
                className="text-rhode-text text-sm"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                hello@dupp.com
              </p>
            </div>

            <div className="info-card bg-rhode-cream/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <div className="w-16 h-16 bg-rhode-text/10 rounded-full flex items-center justify-center mx-auto mb-6">
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-medium mb-2 text-rhode-dark"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Call Us
              </h3>
              <p
                className="text-rhode-text text-sm"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                +1 (555) 123-4567
              </p>
            </div>

            <div className="info-card bg-rhode-cream/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <div className="w-16 h-16 bg-rhode-text/10 rounded-full flex items-center justify-center mx-auto mb-6">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-medium mb-2 text-rhode-dark"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Visit Us
              </h3>
              <p
                className="text-rhode-text text-sm"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Los Angeles, CA
              </p>
            </div>

            <div className="info-card bg-rhode-cream/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center">
              <div className="w-16 h-16 bg-rhode-text/10 rounded-full flex items-center justify-center mx-auto mb-6">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-lg font-medium mb-2 text-rhode-dark"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Hours
              </h3>
              <p
                className="text-rhode-text text-sm"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Mon-Fri 9AM-6PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Form */}
      <section className="py-20 bg-gradient-to-br from-white to-rhode-light/30">
        <div className="max-w-4xl mx-auto px-8">
          <div
            ref={formRef}
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20"
          >
            <div className="text-center mb-12">
              <h2
                className="text-3xl md:text-4xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Send us a Message
              </h2>
              <p
                className="text-rhode-text leading-relaxed"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                We'll get back to you within 24 hours
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12">
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3
                  className="text-2xl font-medium mb-4 text-rhode-dark"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Message Sent!
                </h3>
                <p
                  className="text-rhode-text"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Thank you for reaching out. We'll be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-rhode-dark mb-2"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/80 border border-rhode-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rhode-text/30 transition-all duration-300"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-rhode-dark mb-2"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/80 border border-rhode-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rhode-text/30 transition-all duration-300"
                      style={{ fontFamily: "Chillax, sans-serif" }}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-rhode-dark mb-2"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/80 border border-rhode-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rhode-text/30 transition-all duration-300"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-rhode-dark mb-2"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/80 border border-rhode-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rhode-text/30 transition-all duration-300 resize-none"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    loading={isSubmitting}
                    variant="primary"
                    size="large"
                    className="rounded-full transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-medium mb-4 tracking-tight text-rhode-text leading-tight"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Frequently Asked Questions
            </h2>
            <p
              className="text-rhode-text leading-relaxed"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-rhode-cream/30 rounded-2xl p-6">
              <h3
                className="text-lg font-medium mb-2 text-rhode-dark"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                How long does shipping take?
              </h3>
              <p
                className="text-rhode-text"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                We offer free shipping on orders over $50. Standard shipping
                takes 3-5 business days, while express shipping takes 1-2
                business days.
              </p>
            </div>

            <div className="bg-rhode-cream/30 rounded-2xl p-6">
              <h3
                className="text-lg font-medium mb-2 text-rhode-dark"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                What is your return policy?
              </h3>
              <p
                className="text-rhode-text"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                We offer a 30-day return policy for unopened products. If you're
                not satisfied, contact us within 30 days for a full refund.
              </p>
            </div>

            <div className="bg-rhode-cream/30 rounded-2xl p-6">
              <h3
                className="text-lg font-medium mb-2 text-rhode-dark"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Are your products cruelty-free?
              </h3>
              <p
                className="text-rhode-text"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Yes, all düpp products are cruelty-free and never tested on
                animals. We're committed to ethical beauty practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <StayInTouch />
    </div>
  );
};

export default Contact;
