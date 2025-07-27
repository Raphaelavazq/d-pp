import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const [openItems, setOpenItems] = useState(new Set());
  const heroRef = useRef(null);
  const faqRef = useRef(null);

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

    // FAQ items animation
    gsap.fromTo(
      faqRef.current.children,
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
          trigger: faqRef.current,
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
            "We focus on quality without compromise. Our formulas are vegan, sustainably packaged, and we plant a tree with every purchase. No marketing fluff — just products that work.",
        },
        {
          question: "How do you ensure product quality?",
          answer:
            "All our products are dermatologist-tested, made with clinically-proven ingredients, and manufactured in certified facilities. We maintain strict quality control standards.",
        },
      ],
    },
    {
      category: "Sustainability",
      items: [
        {
          question: "How does the tree planting program work?",
          answer:
            "For every order placed, we plant one tree through our partnership with One Tree Planted. You'll receive updates on the impact of your purchase and can track our progress on our Impact page.",
        },
        {
          question: "Is your packaging sustainable?",
          answer:
            "Yes, our packaging is made from 85% recycled materials. We offer refillable options for most products and use carbon-neutral shipping methods.",
        },
        {
          question: "What's your carbon footprint policy?",
          answer:
            "We offset 100% of our shipping emissions and are working toward becoming carbon-negative by 2025. Our manufacturing partners use renewable energy sources.",
        },
      ],
    },
    {
      category: "Orders & Shipping",
      items: [
        {
          question: "How long does shipping take?",
          answer:
            "Standard shipping takes 3-5 business days. We offer express 1-2 day shipping for orders over $50. All shipping is carbon-neutral.",
        },
        {
          question: "Do you offer international shipping?",
          answer:
            "Currently, we ship within the US and Canada. We're working on expanding to Europe and Australia in 2024.",
        },
        {
          question: "What's your return policy?",
          answer:
            "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, return it for a full refund or exchange.",
        },
      ],
    },
    {
      category: "Ingredients",
      items: [
        {
          question: "Do you use harmful chemicals?",
          answer:
            "Never. We avoid parabens, sulfates, phthalates, synthetic fragrances, and other potentially harmful ingredients. Our clean ingredient list is available for every product.",
        },
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
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-[#b2bbc1]">
        <div ref={heroRef} className="container mx-auto px-6 text-center">
          <h1 className="font-chillax text-5xl md:text-6xl font-bold text-white mb-6">
            Questions?
          </h1>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            We keep it simple. Here are the answers you're looking for.
          </p>
          <div className="w-24 h-0.5 bg-[#f6febb] mx-auto"></div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-8">
                {category.category}
              </h2>
              <div ref={faqRef} className="space-y-4">
                {category.items.map((item, itemIndex) => {
                  const globalIndex = `${categoryIndex}-${itemIndex}`;
                  const isOpen = openItems.has(globalIndex);

                  return (
                    <div
                      key={itemIndex}
                      className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      <button
                        className="w-full px-8 py-6 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors duration-200"
                        onClick={() => toggleItem(globalIndex)}
                      >
                        <h3 className="font-semibold text-lg text-[#b2bbc1] pr-4">
                          {item.question}
                        </h3>
                        <ChevronDown
                          className={`w-6 h-6 text-[#b2bbc1] transition-transform duration-300 flex-shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-chillax text-3xl font-bold text-[#b2bbc1] mb-6">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Our team is here to help. Reach out and we'll get back to you within
            24 hours.
          </p>
          <button className="bg-[#b2bbc1] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#a0a9b0] transition-all duration-300 transform hover:scale-105">
            Contact Support
          </button>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
