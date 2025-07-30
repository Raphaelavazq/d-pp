import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const formRef = useRef(null);
  const heroRef = useRef(null);

  const from = location.state?.from?.pathname || "/";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      setError("Failed to sign in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      setError("Failed to sign in with Google: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setError("");
      await resetPassword(email);
      setError("Password reset email sent! Check your inbox.");
    } catch (error) {
      setError("Failed to send reset email: " + error.message);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-rhode-light via-white to-rhode-cream overflow-hidden"
      style={{ paddingTop: "5rem" }}
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rhode-text/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-charcoal/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left side - Hero content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div ref={heroRef} className="text-center space-y-8">
            <h1
              className="text-4xl md:text-5xl font-bold text-rhode-dark leading-tight tracking-tight"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Welcome
              <span className="block text-transparent bg-gradient-to-r from-rhode-text to-charcoal bg-clip-text">
                Back
              </span>
            </h1>

            <p
              className="text-xl text-rhode-text leading-relaxed max-w-md font-normal"
              style={{ fontFamily: "Aglonema, serif" }}
            >
              Sign in to access your account and continue your skincare journey
              with düpp.
            </p>

            <div className="flex items-center justify-center gap-8 pt-4 opacity-70">
              <div className="text-center">
                <div className="text-2xl font-bold text-rhode-dark">50k+</div>
                <div className="text-sm text-rhode-text">Happy Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-rhode-dark">98%</div>
                <div className="text-sm text-rhode-text">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div
            ref={formRef}
            className="w-full max-w-md bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20"
          >
            <div className="text-center mb-8">
              <h2
                className="text-2xl md:text-3xl font-medium text-rhode-dark mb-2"
                style={{ fontFamily: "Aglonema, serif" }}
              >
                Sign In
              </h2>
              <p
                className="text-rhode-text"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Welcome back to your düpp account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p
                  className="text-sm text-red-600"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-rhode-dark mb-2"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/80 border border-rhode-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rhode-text/30 transition-all duration-300"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-rhode-dark mb-2"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/80 border border-rhode-text/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-rhode-text/30 transition-all duration-300 pr-12"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-rhode-text hover:text-rhode-dark transition-colors"
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
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-rhode-text hover:text-rhode-dark transition-colors"
                  style={{ fontFamily: "Chillax, sans-serif" }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rhode-text text-white py-3 rounded-full font-medium hover:bg-rhode-dark transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-rhode-text/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className="px-4 bg-white/60 text-rhode-text"
                    style={{ fontFamily: "Chillax, sans-serif" }}
                  >
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white/80 border border-rhode-text/20 text-rhode-text py-3 rounded-full font-medium hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            <div className="mt-8 text-center">
              <p
                className="text-rhode-text"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-rhode-text font-medium hover:text-rhode-dark transition-colors underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
