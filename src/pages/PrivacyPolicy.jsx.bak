import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import ImpactButton from "../components/ImpactButton";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const PrivacyPolicy = () => {
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

  const privacySections = [
    {
      title: "Our Commitment",
      subtitle: "Transparency in everything we do",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            At düpp, we believe in transparency. This privacy policy explains
            how we collect, use, and protect your information when you visit our
            website or purchase our products.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-stone/60 leading-relaxed font-light">
            We're committed to keeping your data safe and giving you complete
            control over your privacy. No hidden practices, no confusing
            language — just honest, straightforward information.
          </p>
        </div>
      ),
    },
    {
      title: "What We Collect",
      subtitle: "Only what we need, nothing more",
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">
              Information You Provide
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  Name and contact information when you create an account
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Billing and shipping addresses for orders</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Payment information (processed securely by Stripe)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Communications you send us</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">
              Information We Automatically Collect
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Device information and browser type</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Website usage and interaction data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Cookies and similar tracking technologies</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "How We Use It",
      subtitle: "Your data works for you",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            We use your information to create the best possible experience for
            you.
          </p>
          <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
              <span>Process and fulfill your orders</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
              <span>Provide customer support and respond to inquiries</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
              <span>Send order confirmations and shipping updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
              <span>Improve our website and products</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
              <span>Send marketing communications (with your consent)</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Your Rights",
      subtitle: "You're in control",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            You have complete control over your personal information.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-stone">Access</h4>
                <p className="text-sm text-stone/60 font-light">
                  Request a copy of your personal data
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-stone">Correction</h4>
                <p className="text-sm text-stone/60 font-light">
                  Update or correct your information
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-stone">Deletion</h4>
                <p className="text-sm text-stone/60 font-light">
                  Request deletion of your account and data
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-stone">Portability</h4>
                <p className="text-sm text-stone/60 font-light">
                  Receive your data in a portable format
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-stone">Opt-out</h4>
                <p className="text-sm text-stone/60 font-light">
                  Unsubscribe from marketing communications
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-medium text-stone">Cookies</h4>
                <p className="text-sm text-stone/60 font-light">
                  Manage cookie preferences in your browser
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Data Security",
      subtitle: "Protected every step of the way",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            We implement industry-standard security measures to protect your
            information.
          </p>
          <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
              <span>SSL encryption for all data transmission</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
              <span>Secure payment processing through Stripe</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
              <span>Regular security audits and updates</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
              <span>
                Limited access to personal data on a need-to-know basis
              </span>
            </li>
          </ul>
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-stone mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-[0.9] tracking-tight font-chillax">
            Privacy
            <span className="block text-stone">Policy</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-stone/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Transparent. Honest. Your data, your choice.
          </p>
          <p className="text-sm sm:text-base text-stone/60 font-light">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Content */}
      {/* Privacy Sections */}
      {privacySections.map((section, index) => (
        <section
          key={index}
          data-section={`section-${index}`}
          className={`h-screen w-full rounded-t-[3rem] overflow-hidden ${
            index % 2 === 0 ? "bg-gray-50" : "bg-white"
          } flex items-center justify-center relative`}
        >
          <div className="relative z-20 text-center max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-stone mb-4 sm:mb-6 md:mb-8 leading-[0.95] tracking-tight font-chillax">
              {section.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-stone/70 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              {section.subtitle}
            </p>
            <div className="text-left max-w-4xl mx-auto">{section.content}</div>
          </div>
        </section>
      ))}

      {/* Contact CTA Section */}
      <section
        data-section="cta"
        className="h-screen w-full rounded-t-[3rem] overflow-hidden bg-stone flex items-center justify-center relative"
      >
        <div className="relative z-20 text-center max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 sm:mb-8 md:mb-10 leading-[0.95] tracking-tight font-chillax">
            Questions?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            We're here to help. Contact us about any privacy concerns or
            questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <ImpactButton
              href="mailto:privacy@dupp.com"
              className="bg-white text-stone hover:bg-white/90 transition-colors duration-300"
            >
              Contact Privacy Team
            </ImpactButton>
            <a
              href="/contact"
              className="text-white/70 hover:text-white transition-colors duration-300 font-light underline"
            >
              General Contact
            </a>
          </div>
          <div className="mt-8 sm:mt-10 md:mt-12 text-sm text-white/50 font-light">
            <p>düpp Privacy Policy | All rights reserved</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
