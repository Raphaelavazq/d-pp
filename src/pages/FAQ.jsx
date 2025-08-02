import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import ImpactButton from "../components/ImpactButton";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());

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

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const faqData = [
    {
      category: "Products",
      items: [
        {
          question: "Are all düpp products vegan?",
          answer:
            "Yes, absolutely. Every single düpp product is 100% vegan and cruelty-free. We never use animal-derived ingredients or test on animals.",
        },
        {
          question: "What makes düpp different from other brands?",
          answer:
            "We focus on quality without compromise. Our formulas are vegan, sustainably packaged, and designed for everyday luxury. No marketing fluff — just products that work.",
        },
        {
          question: "How do you ensure product quality?",
          answer:
            "All our products are dermatologist-tested, made with clinically-proven ingredients, and manufactured in certified facilities. We maintain strict quality control standards.",
        },
        {
          question: "Do you use harmful chemicals?",
          answer:
            "Never. We avoid parabens, sulfates, phthalates, synthetic fragrances, and other potentially harmful ingredients. Our clean ingredient list is available for every product.",
        },
      ],
    },
    {
      category: "Orders & Shipping",
      items: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 3-5 business days. We offer express 1-2 day shipping for orders over $50. All orders are carefully packaged and tracked.",
        },
        {
          question: "Do you offer international shipping?",
          answer:
            "Currently, we ship within the US and Canada. We're working on expanding to Europe and Australia soon.",
        },
        {
          question: "What's your return policy?",
          answer:
            "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, return it for a full refund or exchange.",
        },
        {
          question: "How much is shipping?",
          answer:
            "Free shipping on orders over $75. Standard shipping is $5.99 for orders under $75. Express shipping available for $12.99.",
        },
      ],
    },
    {
      category: "Ingredients & Skin",
      items: [
        {
          question: "Are your products suitable for sensitive skin?",
          answer:
            "Most of our products are formulated for sensitive skin, but we recommend patch testing. Each product page lists all ingredients and suitability information.",
        },
        {
          question: "Where do you source your ingredients?",
          answer:
            "We source from certified organic and sustainable suppliers worldwide. All ingredients are ethically sourced and meet our strict quality standards.",
        },
        {
          question: "Do you test on animals?",
          answer:
            "Absolutely not. We are 100% cruelty-free and never test on animals. We're also certified by Leaping Bunny, the gold standard for cruelty-free certification.",
        },
        {
          question: "Can I use multiple düpp products together?",
          answer:
            "Yes! Our products are designed to work together harmoniously. For personalized routine recommendations, check our skincare guide or contact our team.",
        },
      ],
    },
    {
      category: "Account & Support",
      items: [
        {
          question: "How do I track my order?",
          answer:
            "You'll receive a tracking link via email once your order ships. You can also check your order status by logging into your account on our website.",
        },
        {
          question: "Can I change or cancel my order?",
          answer:
            "You can modify or cancel your order within 1 hour of placing it. After that, orders enter our fulfillment process and cannot be changed.",
        },
        {
          question: "Do you offer subscriptions?",
          answer:
            "Yes! Save 15% with our subscription service. You can pause, skip, or cancel anytime. Perfect for your daily essentials.",
        },
        {
          question: "How do I contact customer service?",
          answer:
            "Reach us via email at hello@dupp.com or through our contact form. We typically respond within 24 hours during business days.",
        },
      ],
    },
  ];

  return (
    <div className="relative pt-16 md:pt-20">
      {/* Hero Section */}
      <section
        data-section="hero"
        className="h-screen w-full overflow-hidden bg-white shadow-xl flex items-center justify-center relative"
      >
        <div className="relative z-20 text-center max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-rhode-text mb-6 sm:mb-8 md:mb-10 lg:mb-12 leading-[0.9] tracking-tight"
            style={{ fontFamily: "Chillax, sans-serif" }}
          >
            Questions?
            <span className="block text-rhode-text">We've Got Answers</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-rhode-text/80 mb-8 sm:mb-10 md:mb-12 lg:mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Simple, honest answers to help you feel confident about düpp
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      {faqData.map((category, categoryIndex) => (
        <section
          key={categoryIndex}
          data-section={`faq-${categoryIndex}`}
          className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-white shadow-xl flex items-center"
        >
          <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Category Title */}
              <div className="space-y-6 sm:space-y-8">
                <h2
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-rhode-text leading-[1.1]"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  {category.category}
                </h2>
                <p className="text-lg sm:text-xl text-rhode-text/70 max-w-lg font-light leading-relaxed">
                  {categoryIndex === 0 &&
                    "Everything you need to know about our products and formulations"}
                  {categoryIndex === 1 &&
                    "Shipping, returns, and order information"}
                  {categoryIndex === 2 &&
                    "Ingredients, skin compatibility, and usage guidance"}
                  {categoryIndex === 3 &&
                    "Account management and customer support"}
                </p>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4 sm:space-y-6">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems.has(globalIndex);

                  return (
                    <div
                      key={itemIndex}
                      className="border border-rhode-text/20 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-rhode-text/30"
                    >
                      <button
                        className="w-full px-6 sm:px-8 py-4 sm:py-6 text-left flex items-center justify-between bg-white hover:bg-gray-50/50 transition-colors duration-200"
                        onClick={() => toggleItem(globalIndex)}
                      >
                        <h3 className="font-medium text-base sm:text-lg text-rhode-text pr-4 leading-tight">
                          {item.question}
                        </h3>
                        <ChevronDown
                          className={`w-5 h-5 sm:w-6 sm:h-6 text-rhode-text transition-transform duration-300 flex-shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-6 sm:px-8 pb-4 sm:pb-6 text-sm sm:text-base text-rhode-text/70 leading-relaxed font-light">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Contact CTA Section */}
      <section
        data-section="contact"
        className="h-screen w-full rounded-t-[2rem] md:rounded-t-[3rem] overflow-hidden bg-rhode-cream shadow-xl flex items-center"
      >
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 text-center">
          <div className="space-y-8 sm:space-y-12 lg:space-y-16">
            <div className="space-y-6 sm:space-y-8">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-tight text-rhode-text leading-[0.9]"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Still Have
                <span className="block">Questions?</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-rhode-text/70 max-w-4xl mx-auto leading-relaxed font-light">
                Our team is here to help. Reach out and we'll get back to you
                within 24 hours
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center">
              <ImpactButton
                variant="filled"
                className="px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg md:text-xl font-medium tracking-wide"
              >
                Contact Support
              </ImpactButton>
              <ImpactButton
                variant="outline"
                className="px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg md:text-xl font-medium tracking-wide"
              >
                Live Chat
              </ImpactButton>
            </div>

            <div className="pt-8 sm:pt-12">
              <p className="text-sm sm:text-base text-rhode-text/60 max-w-2xl mx-auto leading-relaxed">
                Email us at hello@dupp.com or use our contact form. We're
                committed to providing exceptional support for every düpp
                customer.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
