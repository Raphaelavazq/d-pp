import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { Link } from "react-router-dom";
import Button from "../components/Button";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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
    <div className="relative pt-16 md:pt-20">
      {/* Hero Section */}
      <section
        data-section="hero"
        className="h-screen w-full overflow-hidden bg-white shadow-xl flex items-center justify-center relative"
      >
        <div className="relative z-20 text-center max-w-4xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-stone mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-[0.9] tracking-tight">
            Get in
            <span className="block text-stone">Touch</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-stone/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section
        data-section="contact-info"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-sand shadow-xl flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center min-h-0">
            {/* Text Content - Left side, centered */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-8 sm:py-12 md:py-16 lg:py-0">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-stone leading-[1.1]">
                  Let's
                  <span className="block">Connect</span>
                </h2>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone/80 leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                Your questions and feedback matter to us. Reach out and we'll
                respond within 24 hours.
              </p>
            </div>

            {/* Contact Details - Right side */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-8 sm:py-12 md:py-16 lg:py-0">
              <div className="space-y-6 sm:space-y-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-stone mb-2">
                    Email
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-stone/70">
                    hello@dupp.com
                  </p>
                </div>

                <div className="text-center lg:text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-stone mb-2">
                    Phone
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-stone/70">
                    +1 (555) 123-4567
                  </p>
                </div>

                <div className="text-center lg:text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-stone mb-2">
                    Location
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-stone/70">
                    Los Angeles, CA
                  </p>
                </div>

                <div className="text-center lg:text-left">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-stone mb-2">
                    Hours
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-stone/70">
                    Monday - Friday
                    <br />
                    9AM - 6PM PST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        data-section="contact-form"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 w-full h-full items-center min-h-0">
            {/* Form - Left side */}
            <div className="space-y-4 sm:space-y-5 lg:space-y-6 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-6 sm:py-8 md:py-10 lg:py-0 order-2 lg:order-1">
              {isSubmitted ? (
                <div className="text-center lg:text-left">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4 sm:mb-5">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-green-600"
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
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-medium mb-3 sm:mb-4 text-stone">
                    Message Sent!
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-stone/80 leading-relaxed font-light">
                    Thank you for reaching out. We'll be in touch soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
                  <div className="grid gap-4 sm:gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm sm:text-base font-medium text-stone mb-1 sm:mb-2"
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
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-stone/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone/30 transition-all duration-300 text-sm sm:text-base"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm sm:text-base font-medium text-stone mb-1 sm:mb-2"
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
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-stone/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone/30 transition-all duration-300 text-sm sm:text-base"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm sm:text-base font-medium text-stone mb-1 sm:mb-2"
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
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-stone/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone/30 transition-all duration-300 text-sm sm:text-base"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm sm:text-base font-medium text-stone mb-1 sm:mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border border-stone/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone/30 transition-all duration-300 resize-none text-sm sm:text-base"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>
                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-stone text-white px-5 sm:px-6 md:px-7 py-2 sm:py-3 md:py-3 rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Text Content - Right side, centered */}
            <div className="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10 px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 flex flex-col justify-center h-full py-8 sm:py-12 md:py-16 lg:py-0 order-1 lg:order-2">
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tight text-stone leading-[1.1]">
                  Send us a<span className="block">Message</span>
                </h2>
              </div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone/80 leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
                We'll get back to you within 24 hours with a thoughtful response
                to your inquiry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        data-section="faq"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-sand shadow-xl flex items-center"
      >
        <div className="w-full h-full flex items-center">
          <div className="max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 w-full">
            <div className="text-center mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-3 sm:mb-4 tracking-tight text-stone leading-tight">
                FAQ
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-stone/80 leading-relaxed font-light max-w-2xl mx-auto">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid gap-2 sm:gap-3 max-w-3xl mx-auto">
              {/* FAQ Item 1 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(0)}
                  className="w-full p-3 sm:p-4 text-left flex justify-between items-center hover:bg-white/20 transition-colors"
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-stone pr-3">
                    How long does shipping take?
                  </h3>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-stone transition-transform duration-300 flex-shrink-0 ${
                      openFAQ === 0 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFAQ === 0 && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-xs sm:text-sm md:text-base text-stone/80 leading-relaxed font-light">
                      We offer free shipping on orders over $50. Standard
                      shipping takes 3-5 business days, while express shipping
                      takes 1-2 business days.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 2 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(1)}
                  className="w-full p-3 sm:p-4 text-left flex justify-between items-center hover:bg-white/20 transition-colors"
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-stone pr-3">
                    What is your return policy?
                  </h3>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-stone transition-transform duration-300 flex-shrink-0 ${
                      openFAQ === 1 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFAQ === 1 && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-xs sm:text-sm md:text-base text-stone/80 leading-relaxed font-light">
                      We offer a 30-day return policy for unopened products. If
                      you're not satisfied, contact us within 30 days for a full
                      refund.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 3 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(2)}
                  className="w-full p-3 sm:p-4 text-left flex justify-between items-center hover:bg-white/20 transition-colors"
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-stone pr-3">
                    Are your products cruelty-free?
                  </h3>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-stone transition-transform duration-300 flex-shrink-0 ${
                      openFAQ === 2 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFAQ === 2 && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-xs sm:text-sm md:text-base text-stone/80 leading-relaxed font-light">
                      Yes, all düpp products are cruelty-free and never tested
                      on animals. We're committed to ethical beauty practices.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 4 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(3)}
                  className="w-full p-3 sm:p-4 text-left flex justify-between items-center hover:bg-white/20 transition-colors"
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-stone pr-3">
                    Do you offer international shipping?
                  </h3>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-stone transition-transform duration-300 flex-shrink-0 ${
                      openFAQ === 3 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFAQ === 3 && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-xs sm:text-sm md:text-base text-stone/80 leading-relaxed font-light">
                      Currently, we ship within the United States and Canada.
                      International shipping options are coming soon!
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Item 5 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(4)}
                  className="w-full p-3 sm:p-4 text-left flex justify-between items-center hover:bg-white/20 transition-colors"
                >
                  <h3 className="text-sm sm:text-base md:text-lg font-medium text-stone pr-3">
                    How can I track my order?
                  </h3>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-stone transition-transform duration-300 flex-shrink-0 ${
                      openFAQ === 4 ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFAQ === 4 && (
                  <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                    <p className="text-xs sm:text-sm md:text-base text-stone/80 leading-relaxed font-light">
                      Once your order ships, you'll receive a tracking number
                      via email. You can also check your order status in your
                      account dashboard.
                    </p>
                  </div>
                )}
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium mb-6 sm:mb-8 md:mb-10 tracking-tight text-stone leading-tight">
            Stay In Touch
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 md:mb-12 lg:mb-16 leading-relaxed max-w-4xl mx-auto text-stone font-medium">
            Be the first to know about new products, exclusive offers, and
            behind-the-scenes content.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 sm:gap-6 max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 sm:px-8 py-4 sm:py-5 md:py-6 rounded-full border border-stone/20 focus:outline-none focus:border-stone/50 text-base sm:text-lg md:text-xl"
            />
            <button
              type="submit"
              className="bg-stone text-white px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-full hover:bg-stone/90 transition-colors text-base sm:text-lg md:text-xl font-medium"
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
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-medium text-stone">
                  düpp
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-stone/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Soft, simple, and sensibly priced. Discover our curated
                  collection of essentials that blend luxury with everyday
                  simplicity.
                </p>
                <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 sm:gap-6">
                  <Link
                    to="/shop"
                    className="bg-stone text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full hover:bg-stone/90 transition-colors font-medium"
                  >
                    Shop Now
                  </Link>
                  <Link
                    to="/about"
                    className="border border-stone text-stone px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-full hover:bg-stone hover:text-white transition-colors font-medium"
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

export default Contact;
