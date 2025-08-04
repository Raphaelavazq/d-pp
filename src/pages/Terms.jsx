import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import ImpactButton from "../components/ImpactButton";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const TermsConditions = () => {
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

  const termsSections = [
    {
      title: "Agreement",
      subtitle: "Welcome to düpp",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            By accessing and using our website and purchasing our products, you agree to be bound by these Terms & Conditions.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-stone/60 leading-relaxed font-light">
            These terms govern your relationship with düpp and outline the rights and responsibilities of both parties. 
            Please read them carefully before making any purchases.
          </p>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <p className="text-sm text-stone/60 font-light italic">
              If you do not agree with any part of these terms, please do not use our services or make any purchases.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Products & Services",
      subtitle: "What we offer",
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">Product Descriptions</h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>We strive to display product colors and details accurately</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Actual products may vary slightly from images due to lighting and screen settings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>We reserve the right to modify product descriptions and pricing</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">Availability</h3>
            <p className="text-sm sm:text-base text-stone/70 font-light leading-relaxed">
              All products are subject to availability. We cannot guarantee that any product will be available 
              at the time of your order. If a product becomes unavailable after your order, we will notify you 
              immediately and provide a full refund.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Orders & Payment",
      subtitle: "Purchasing process",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">Order Process</h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Orders are confirmed once payment is successfully processed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>You will receive an order confirmation email within 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>We reserve the right to cancel orders for any reason</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">Payment Terms</h3>
            <p className="text-sm sm:text-base text-stone/70 font-light leading-relaxed">
              All payments are processed securely through Stripe. We accept major credit cards and other payment methods 
              as displayed at checkout. Prices are in USD and include applicable taxes where required.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Shipping & Returns",
      subtitle: "Delivery and exchanges",
      content: (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-medium text-stone">Shipping Policy</h3>
              <ul className="space-y-2 text-sm text-stone/70 font-light">
                <li>• Standard shipping: 3-7 business days</li>
                <li>• Express shipping: 1-3 business days</li>
                <li>• International shipping available</li>
                <li>• Free shipping on orders over $75</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-medium text-stone">Return Policy</h3>
              <ul className="space-y-2 text-sm text-stone/70 font-light">
                <li>• 30-day return window</li>
                <li>• Items must be unworn and with tags</li>
                <li>• Original packaging required</li>
                <li>• Return shipping fees may apply</li>
              </ul>
            </div>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <p className="text-sm text-stone/60 font-light">
              <strong>Note:</strong> Custom or personalized items are final sale and cannot be returned 
              unless defective or damaged upon arrival.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "User Conduct",
      subtitle: "Community guidelines",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            We expect all users to interact respectfully with our platform and community.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">Prohibited Activities</h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Using our website for any unlawful purpose</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Attempting to gain unauthorized access to our systems</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Posting harmful, offensive, or inappropriate content</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Interfering with other users' experience</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Intellectual Property",
      subtitle: "Rights and ownership",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            All content on our website is protected by intellectual property laws.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">Our Rights</h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>düpp brand name, logo, and trademarks</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Product designs and descriptions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Website content, images, and videos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Software and website functionality</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <p className="text-sm text-stone/60 font-light">
              You may not reproduce, distribute, or create derivative works from our content 
              without express written permission.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Limitations",
      subtitle: "Legal disclaimers",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">Liability Limitations</h3>
            <p className="text-sm sm:text-base text-stone/70 font-light leading-relaxed">
              To the fullest extent permitted by law, düpp shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of our 
              products or services.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">Warranties</h3>
            <p className="text-sm sm:text-base text-stone/70 font-light leading-relaxed">
              While we strive for quality, our products are provided "as is" without any express 
              or implied warranties beyond those required by law. We warrant products against 
              manufacturing defects for 30 days from purchase.
            </p>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <p className="text-sm text-stone/60 font-light">
              Some jurisdictions do not allow limitations on warranties or liability, 
              so these limitations may not apply to you.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative pt-16 md:pt-20">
      {/* Hero Section */}
      <section
        data-section="hero"
        className="h-screen w-full overflow-hidden bg-white flex items-center justify-center relative"
      >
        <div className="relative z-20 text-center max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-stone mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-[0.9] tracking-tight"
          >
            Terms &
            <span className="block text-stone">Conditions</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-stone/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Clear. Fair. Protecting everyone's interests.
          </p>
          <p className="text-sm sm:text-base text-stone/60 font-light">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Terms Sections */}
      {termsSections.map((section, index) => (
        <section
          key={index}
          data-section={`section-${index}`}
          className={`h-screen w-full rounded-t-[3rem] overflow-hidden ${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          } flex items-center justify-center relative`}
        >
          <div className="relative z-20 text-center max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-stone mb-4 sm:mb-6 md:mb-8 leading-[0.95] tracking-tight"
            >
              {section.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-stone/70 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              {section.subtitle}
            </p>
            <div className="text-left max-w-4xl mx-auto">
              {section.content}
            </div>
          </div>
        </section>
      ))}

      {/* Contact CTA Section */}
      <section
        data-section="cta"
        className="h-screen w-full rounded-t-[3rem] overflow-hidden bg-stone flex items-center justify-center relative"
      >
        <div className="relative z-20 text-center max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 sm:mb-8 md:mb-10 leading-[0.95] tracking-tight"
          >
            Questions?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            We're here to help clarify any terms or conditions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <ImpactButton 
              href="mailto:legal@dupp.com"
              className="bg-white text-stone hover:bg-white/90 transition-colors duration-300"
            >
              Contact Legal Team
            </ImpactButton>
            <a 
              href="/contact" 
              className="text-white/70 hover:text-white transition-colors duration-300 font-light underline"
            >
              General Support
            </a>
          </div>
          <div className="mt-8 sm:mt-10 md:mt-12 text-sm text-white/50 font-light">
            <p>düpp Terms & Conditions | All rights reserved</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
