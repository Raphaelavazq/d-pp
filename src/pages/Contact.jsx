import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import StayInTouch from "../components/StayInTouch";

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
  const infoRef = useRef();

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

    // Form animation
    gsap.fromTo(
      formRef.current,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Info cards animation
    gsap.fromTo(
      infoRef.current.children,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: infoRef.current,
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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      info: "hello@dupp.com",
      description: "We respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      info: "+1 (555) 123-4567",
      description: "Mon-Fri, 9am-6pm PST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      info: "123 Sustainable Street",
      description: "Green City, CA 90210",
    },
    {
      icon: Clock,
      title: "Response Time",
      info: "24 hours",
      description: "Average response time",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-rhode-grey">
        <div ref={heroRef} className="container mx-auto px-6 text-center">
          <h1 className="font-chillax text-5xl md:text-6xl font-bold mb-6 text-rhode-text">
            Let's Talk
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-rhode-text-light">
            Questions, feedback, or just want to say hi? We're here.
          </p>
          <div className="w-24 h-0.5 bg-[#f6febb] mx-auto"></div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div
            ref={infoRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {contactInfo.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="bg-[#f6febb] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-[#b2bbc1]" />
                  </div>
                  <h3 className="font-chillax text-xl font-bold text-rhode-text mb-3">
                    {item.title}
                  </h3>
                  <p className="font-semibold text-rhode-text mb-2">
                    {item.info}
                  </p>
                  <p className="text-rhode-text-light text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Form */}
              <div ref={formRef}>
                <h2 className="font-chillax text-4xl font-bold text-rhode-text mb-8">
                  Send us a message
                </h2>

                {isSubmitted ? (
                  <div className="bg-[#f6febb] p-8 rounded-2xl text-center">
                    <h3 className="font-chillax text-2xl font-bold text-rhode-text mb-4">
                      Message sent!
                    </h3>
                    <p className="text-rhode-text">
                      Thanks for reaching out. We'll get back to you within 24
                      hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-rhode-text font-semibold mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rhode-text focus:outline-none focus:ring-2 focus:ring-rhode-text/20 transition-all duration-200"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-rhode-text font-semibold mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rhode-text focus:outline-none focus:ring-2 focus:ring-rhode-text/20 transition-all duration-200"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-rhode-text font-semibold mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rhode-text focus:outline-none focus:ring-2 focus:ring-rhode-text/20 transition-all duration-200"
                        placeholder="What's this about?"
                      />
                    </div>

                    <div>
                      <label className="block text-rhode-text font-semibold mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rhode-text focus:outline-none focus:ring-2 focus:ring-rhode-text/20 transition-all duration-200 resize-none"
                        placeholder="Tell us what's on your mind..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-rhode-text text-white py-4 px-8 rounded-xl font-semibold hover:bg-rhode-text-light transition-all duration-300 transform hover:scale-105"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>

              {/* Additional Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-chillax text-2xl font-bold text-rhode-text mb-6">
                    Why choose düpp?
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-[#f6febb] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-rhode-text mb-2">
                          100% Vegan
                        </h4>
                        <p className="text-rhode-text-light">
                          Every product is plant-based and cruelty-free
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-[#f6febb] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-rhode-text mb-2">
                          Sustainable Impact
                        </h4>
                        <p className="text-rhode-text-light">
                          We plant a tree with every purchase
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-3 h-3 bg-[#f6febb] rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="font-semibold text-rhode-text mb-2">
                          Quality First
                        </h4>
                        <p className="text-rhode-text-light">
                          Premium ingredients, proven results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-8 rounded-2xl">
                  <h4 className="font-chillax text-xl font-bold text-rhode-text mb-4">
                    Quick responses
                  </h4>
                  <p className="text-rhode-text-light mb-4">
                    We typically respond to all inquiries within 24 hours. For
                    urgent matters, call us directly during business hours.
                  </p>
                  <p className="text-sm text-rhode-text-light">
                    Business hours: Monday-Friday, 9am-6pm PST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-rhode-grey">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-chillax text-3xl font-bold mb-6 text-rhode-text">
            Ready to discover quality skincare?
          </h2>
          <p className="mb-8 max-w-xl mx-auto text-rhode-text-light">
            Browse our collection of vegan, cruelty-free products.
          </p>
          <button className="bg-[#f6febb] text-rhode-text px-8 py-4 rounded-full font-semibold hover:bg-white transition-all duration-300 transform hover:scale-105">
            Shop Collection
          </button>
        </div>
      </section>

      {/* Stay In Touch Section */}
      <StayInTouch />
    </div>
  );
};

export default Contact;
