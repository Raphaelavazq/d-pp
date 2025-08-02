import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import ImpactButton from "../components/ImpactButton";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Accessibility = () => {
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

  const accessibilitySections = [
    {
      title: "Our Commitment",
      subtitle: "Beauty should be accessible to everyone",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            At düpp, we believe that everyone deserves access to beauty and
            confidence, regardless of ability. We're committed to making our
            website and products accessible to all users.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-stone/60 leading-relaxed font-light">
            This commitment extends beyond legal compliance — it's about
            creating an inclusive experience where everyone feels welcome and
            empowered to express their authentic selves.
          </p>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <p className="text-sm text-stone/60 font-light italic">
              We continuously work to improve accessibility and welcome your
              feedback on how we can better serve our community.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Web Standards",
      subtitle: "WCAG 2.1 AA compliance",
      content: (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">
              Current Features
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Keyboard navigation support throughout the site</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  High contrast color schemes for improved readability
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Alt text for all product images and graphics</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Screen reader compatible structure and headings</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  Scalable text that works with browser zoom up to 200%
                </span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">
              In Progress
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Enhanced voice-over descriptions for product videos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  Improved focus indicators for better keyboard navigation
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Additional language support and translations</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Product Access",
      subtitle: "Inclusive beauty for all",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            We design our products with diverse needs and preferences in mind.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-medium text-stone">
                Product Design
              </h3>
              <ul className="space-y-2 text-sm text-stone/70 font-light">
                <li>• Easy-grip packaging for all hand sizes</li>
                <li>• Clear, large product labeling</li>
                <li>• Tactile elements for identification</li>
                <li>• Pump and squeeze packaging options</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-medium text-stone">
                Shopping Support
              </h3>
              <ul className="space-y-2 text-sm text-stone/70 font-light">
                <li>• Detailed product descriptions</li>
                <li>• Multiple product images from all angles</li>
                <li>• Color descriptions and texture details</li>
                <li>• Video tutorials and demonstrations</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Assistive Technology",
      subtitle: "Compatible with your tools",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            Our website works seamlessly with assistive technologies.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">
              Supported Technologies
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  Voice recognition software (Dragon NaturallySpeaking)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Switch navigation devices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Eye-tracking systems</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Browser accessibility features and extensions</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Getting Help",
      subtitle: "Support when you need it",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            We're here to help you navigate our website and find the perfect
            products.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">
              Support Options
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Phone support with accessibility specialists</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Email assistance for detailed questions</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Live chat with accessibility-trained staff</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  Alternative format product information (Braille, large print)
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <p className="text-sm text-stone/60 font-light">
              <strong>Quick Access:</strong> Press Alt+0 (Windows) or Option+0
              (Mac) on any page to access our accessibility menu and support
              options.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Continuous Improvement",
      subtitle: "Always getting better",
      content: (
        <div className="space-y-6">
          <p className="text-base sm:text-lg md:text-xl text-stone/70 leading-relaxed font-light">
            Accessibility is an ongoing journey, not a destination.
          </p>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">
              Our Process
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-stone/70 font-light">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>
                  Regular accessibility audits with third-party experts
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>User testing with people who have disabilities</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Team training on accessibility best practices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 bg-stone rounded-full mt-2 flex-shrink-0"></span>
                <span>Quarterly accessibility reviews and updates</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-medium text-stone">
              Your Feedback Matters
            </h3>
            <p className="text-sm sm:text-base text-stone/70 font-light leading-relaxed">
              We rely on our community to help us identify areas for
              improvement. If you encounter any barriers while using our website
              or have suggestions for making our products more accessible,
              please reach out to us.
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
            className="font-chillax"
          >
            Accessibility
            <span className="block text-stone">Statement</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-stone/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Inclusive. Empowering. Beauty for everyone.
          </p>
          <p className="text-sm sm:text-base text-stone/60 font-light">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Accessibility Sections */}
      {accessibilitySections.map((section, index) => (
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
              className="font-chillax"
            >
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
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 sm:mb-8 md:mb-10 leading-[0.95] tracking-tight"
            className="font-chillax"
          >
            Need Help?
          </h2>
          <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            Our accessibility team is here to support you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <ImpactButton
              href="mailto:accessibility@dupp.com"
              className="bg-white text-stone hover:bg-white/90 transition-colors duration-300"
            >
              Contact Accessibility Team
            </ImpactButton>
            <a
              href="tel:+1-800-DUPP-ACCESS"
              className="text-white/70 hover:text-white transition-colors duration-300 font-light underline"
            >
              Call: 1-800-DUPP-ACCESS
            </a>
          </div>
          <div className="mt-8 sm:mt-10 md:mt-12 text-sm text-white/50 font-light">
            <p>düpp Accessibility Statement | Committed to inclusion</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accessibility;
