import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { usePasswordProtection } from "../hooks/usePasswordProtection";
import logoSvg from "../assets/logo.svg";
import heroVideo from "../assets/heroVideo.mp4";

const ComingSoon = ({ onPasswordSubmit }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { validatePassword } = usePasswordProtection();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate password check
    setTimeout(() => {
      if (validatePassword(password)) {
        onPasswordSubmit(true);
      } else {
        setError("Invalid password. Please try again.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src={heroVideo}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8 sm:mb-12 mt-8 sm:mt-12 md:mt-16">
            <img
              src={logoSvg}
              alt="Logo"
              className="h-20 sm:h-24 md:h-28 lg:h-32 w-auto mx-auto mb-6 sm:mb-8 filter invert"
            />
            <p
              className="text-lg sm:text-xl md:text-2xl text-white/80 mb-2 px-4"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Something Beautiful is Coming
            </p>
          </div>

          {/* Password Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 mx-4 sm:mx-0">
            <h2
              className="text-xl sm:text-2xl font-medium text-white mb-4 sm:mb-6 text-center"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Early Access
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter access password"
                  className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent pr-10 sm:pr-12 text-sm sm:text-base"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>

              {error && (
                <div className="text-red-400 text-xs sm:text-sm text-center bg-red-400/10 border border-red-400/20 rounded-lg py-2 px-3 sm:px-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="w-full py-3 sm:py-4 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-sm sm:text-base"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                {isLoading ? "Verifying..." : "Enter"}
              </button>
            </form>

            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20">
              <p
                className="text-white/60 text-xs sm:text-sm text-center px-2"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Don't have access? Contact us for early preview.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 sm:mt-12 mb-4 sm:mb-8">
            <p
              className="text-white/40 text-xs sm:text-sm px-4"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              © 2025 All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-white/3 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
    </div>
  );
};

export default ComingSoon;
