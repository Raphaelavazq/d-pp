import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../components/Button";

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Hero animation
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

    // Content animation
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
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
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
      {/* Hero Section */}
      <section className="py-20 bg-[#b2bbc1]">
        <div ref={heroRef} className="container mx-auto px-6 text-center">
          <h1 className="font-chillax text-5xl md:text-6xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Transparent. Honest. Your data, your choice.
          </p>
          <div className="text-white opacity-75">
            Last updated: January 2024
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div ref={contentRef} className="prose prose-lg max-w-none">
            <div className="mb-12">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
                Our Commitment
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At düpp, we believe in transparency. This privacy policy
                explains how we collect, use, and protect your information when
                you visit our website or purchase our products. We're committed
                to keeping your data safe and giving you control over your
                privacy.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
                Information We Collect
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl text-[#b2bbc1] mb-3">
                    Information You Provide
                  </h3>
                  <ul className="text-gray-600 space-y-2 ml-6">
                    <li>
                      • Name and contact information when you create an account
                    </li>
                    <li>• Billing and shipping addresses for orders</li>
                    <li>
                      • Payment information (processed securely by Stripe)
                    </li>
                    <li>• Communications you send us</li>
                    <li>• Reviews and feedback you provide</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-xl text-[#b2bbc1] mb-3">
                    Information We Automatically Collect
                  </h3>
                  <ul className="text-gray-600 space-y-2 ml-6">
                    <li>• Device information and browser type</li>
                    <li>• IP address and location data</li>
                    <li>• Website usage and interaction data</li>
                    <li>• Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
                How We Use Your Information
              </h2>
              <ul className="text-gray-600 space-y-3 ml-6">
                <li>• Process and fulfill your orders</li>
                <li>• Provide customer support and respond to inquiries</li>
                <li>• Send order confirmations and shipping updates</li>
                <li>• Improve our website and products</li>
                <li>• Send marketing communications (with your consent)</li>
                <li>• Prevent fraud and ensure security</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
                Information Sharing
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We don't sell your personal information. We only share your data
                in these situations:
              </p>
              <ul className="text-gray-600 space-y-3 ml-6">
                <li>
                  • With service providers who help us operate our business
                  (shipping, payment processing, analytics)
                </li>
                <li>• When required by law or to protect our rights</li>
                <li>• With your explicit consent</li>
                <li>
                  • In connection with a business transfer or merger (with
                  notice to you)
                </li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
                Your Rights and Choices
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  You have control over your personal information:
                </p>
                <ul className="text-gray-600 space-y-3 ml-6">
                  <li>
                    • <strong>Access:</strong> Request a copy of your personal
                    data
                  </li>
                  <li>
                    • <strong>Correction:</strong> Update or correct your
                    information
                  </li>
                  <li>
                    • <strong>Deletion:</strong> Request deletion of your
                    account and data
                  </li>
                  <li>
                    • <strong>Portability:</strong> Receive your data in a
                    portable format
                  </li>
                  <li>
                    • <strong>Opt-out:</strong> Unsubscribe from marketing
                    communications
                  </li>
                  <li>
                    • <strong>Cookies:</strong> Manage cookie preferences in
                    your browser
                  </li>
                </ul>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
                Data Security
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your
                information:
              </p>
              <ul className="text-gray-600 space-y-3 ml-6">
                <li>• SSL encryption for all data transmission</li>
                <li>• Secure payment processing through Stripe</li>
                <li>• Regular security audits and updates</li>
                <li>
                  • Limited access to personal data on a need-to-know basis
                </li>
                <li>• Secure data storage with reputable cloud providers</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
                Cookies and Tracking
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We use cookies and similar technologies to improve your
                experience:
              </p>
              <ul className="text-gray-600 space-y-3 ml-6">
                <li>
                  • <strong>Essential cookies:</strong> Required for basic
                  website functionality
                </li>
                <li>
                  • <strong>Analytics cookies:</strong> Help us understand how
                  you use our site
                </li>
                <li>
                  • <strong>Marketing cookies:</strong> Enable personalized
                  advertising (with consent)
                </li>
                <li>
                  • <strong>Preference cookies:</strong> Remember your settings
                  and preferences
                </li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
                Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have questions about this privacy policy or want to
                exercise your rights, contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> privacy@dupp.com
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Address:</strong> düpp Privacy Team, 123 Sustainable
                  Street, Green City, CA 90210
                </p>
                <p className="text-gray-600">
                  <strong>Response time:</strong> We'll respond within 30 days
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
                Changes to This Policy
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy from time to time. When we do,
                we'll post the updated version on this page and update the "Last
                updated" date. For significant changes, we'll notify you by
                email or through a prominent notice on our website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#b2bbc1]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-chillax text-3xl font-bold text-white mb-6">
            Questions about your privacy?
          </h2>
          <p className="text-white opacity-90 mb-8 max-w-xl mx-auto">
            We're here to help. Reach out to our privacy team anytime.
          </p>
          <Button
            variant="primary"
            size="large"
            className="bg-[#f6febb] text-[#b2bbc1] rounded-full hover:bg-white transform hover:scale-105"
          >
            Contact Privacy Team
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
