import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "../hooks/useAuth";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const formRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    // Enhanced entrance animations
    gsap.fromTo(
      heroRef.current?.children || [],
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.3,
      }
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5,
      }
    );
  }, []);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return { text: "Weak", color: "text-red-500" };
      case 2:
      case 3:
        return { text: "Medium", color: "text-yellow-500" };
      case 4:
      case 5:
        return { text: "Strong", color: "text-green-500" };
      default:
        return { text: "", color: "" };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signup(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      navigate("/");
    } catch (error) {
      setError("Failed to create an account");
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      setError("Failed to sign in with Google");
    }
  };

  const strengthText = getPasswordStrengthText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rhode-cream to-white flex">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rhode-text/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-rhode-text/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-rhode-text/3 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Left side - Hero content */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-rhode-text to-rhode-text/90">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          ref={heroRef}
          className="relative z-10 flex flex-col justify-center items-start px-16 text-white"
        >
          <h1 className="text-5xl font-[Aglonema] mb-6 leading-tight">
            Join the
            <br />
            <span className="bg-gradient-to-r from-rhode-cream to-white bg-clip-text text-transparent">
              düpp Experience
            </span>
          </h1>
          <p className="text-xl font-[Chillax] opacity-90 mb-8 max-w-md leading-relaxed">
            Create your account and discover our premium collection of
            sustainable luxury products.
          </p>
          <div className="space-y-4 text-rhode-cream/80">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-rhode-cream rounded-full"></div>
              <span className="font-[Chillax]">Exclusive member benefits</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-rhode-cream rounded-full"></div>
              <span className="font-[Chillax]">
                Early access to new collections
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-rhode-cream rounded-full"></div>
              <span className="font-[Chillax]">
                Personalized recommendations
              </span>
            </div>
          </div>
        </div>

        {/* Floating elements for the hero side */}
        <div className="absolute top-1/4 right-10 w-20 h-20 bg-white/10 rounded-full blur-sm animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 bg-rhode-cream/20 rounded-full blur-sm animate-float-delayed"></div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex-1 flex items-center justify-center px-8 sm:px-16 lg:px-24">
        <div
          ref={formRef}
          className="w-full max-w-md backdrop-blur-lg bg-white/80 border border-white/20 rounded-3xl shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-[Aglonema] text-rhode-text mb-2">
              Create Account
            </h2>
            <p className="text-rhode-text/70 font-[Chillax]">
              Join our community of conscious consumers
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-rhode-text font-[Chillax] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-rhode-text/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rhode-text/30 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label className="block text-rhode-text font-[Chillax] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/50 border border-rhode-text/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rhode-text/30 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-rhode-text font-[Chillax] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/50 border border-rhode-text/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rhode-text/30 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-rhode-text font-[Chillax] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-white/50 border border-rhode-text/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rhode-text/30 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rhode-text/60 hover:text-rhode-text transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          passwordStrength <= 2
                            ? "bg-red-500"
                            : passwordStrength <= 3
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span
                      className={`text-xs font-[Chillax] ${strengthText.color}`}
                    >
                      {strengthText.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-rhode-text font-[Chillax] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-white/50 border border-rhode-text/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rhode-text/30 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rhode-text/60 hover:text-rhode-text transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 font-[Chillax]">
                    Passwords do not match
                  </p>
                )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rhode-text to-rhode-text/90 text-white py-3 px-6 rounded-xl font-[Chillax] font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-rhode-text/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-rhode-text/70 font-[Chillax]">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-3 bg-white/70 border border-rhode-text/20 text-rhode-text py-3 px-6 rounded-xl font-[Chillax] font-medium hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-rhode-text/70 font-[Chillax]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-rhode-text font-medium hover:underline transition-all duration-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
