import React from "react";
import { designSystem } from "../utils/designSystem";

const Values = ({
  title = "Our Values",
  subtitle = "The principles that guide everything we do",
  values,
  className = "",
  cardStyle = "default", // "default" or "home"
}) => {
  // Default values if none provided
  const defaultValues = [
    {
      id: "honest-intentions",
      title: "Honest Intentions",
      description: "We care and take responsibility",
      icon: (
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
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      id: "simplicity",
      title: "Simplicity",
      description: "Design for comfort and confidence",
      icon: (
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
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      id: "care-as-culture",
      title: "Care as Culture",
      description: "For your mind, body and wallet",
      icon: (
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
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: "always-better",
      title: "Always Better",
      description: "We're transparent, intentional, and always evolving.",
      icon: (
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
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
    },
  ];

  const valuesToRender = values || defaultValues;

  // Different card styles based on usage
  const getCardClasses = () => {
    if (cardStyle === "home") {
      return "value-card bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center h-full flex flex-col";
    }
    return "value-card bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/20 text-center";
  };

  return (
    <div className={className}>
      <div className="text-center mb-16">
        <h2
          className="text-4xl md:text-5xl font-medium mb-6 tracking-tight text-rhode-text leading-tight"
          style={{ fontFamily: "Aglonema, serif" }}
        >
          {title}
        </h2>
        <p
          className="text-xl text-rhode-text max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "Chillax, sans-serif" }}
        >
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {valuesToRender.map((value) => (
          <div key={value.id} className={getCardClasses()}>
            <div className="w-16 h-16 bg-rhode-text/10 rounded-full flex items-center justify-center mx-auto mb-6">
              {value.icon}
            </div>
            <h3
              className="text-xl font-medium mb-3 text-rhode-dark"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              {value.title}
            </h3>
            <p
              className={`text-rhode-text text-sm leading-relaxed ${cardStyle === "home" ? "flex-grow" : ""}`}
              style={{
                fontFamily: designSystem.typography.fonts.secondary,
              }}
            >
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Values;
