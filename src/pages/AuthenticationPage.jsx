import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { gsap } from "gsap";
import { useAuth } from "../hooks/useAuth";

const AuthenticationPage = () => {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.pathname === "/signup");
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

  const { signIn, signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  useEffect(() => {
    // Set initial mode based on URL
    setIsSignUp(location.pathname === "/signup");
  }, [location.pathname]);

  useEffect(() => {
    // Initial animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    // Set initial panel position only for desktop
    if (window.innerWidth >= 1024 && panelRef.current) {
      gsap.set(panelRef.current, {
        x: isSignUp ? "0%" : "100%",
      });
    }
  }, [isSignUp]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Only animate on desktop
    if (
      window.innerWidth >= 1024 &&
      panelRef.current &&
      leftPanelRef.current &&
      rightPanelRef.current
    ) {
      // Panel sliding animation
      gsap.to(panelRef.current, {
        x: isSignUp ? "0%" : "100%",
        duration: 0.6,
        ease: "power2.inOut",
      });

      // Content fade animation
      gsap.to([leftPanelRef.current, rightPanelRef.current], {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.to([leftPanelRef.current, rightPanelRef.current], {
            opacity: 1,
            duration: 0.3,
            delay: 0.3,
          });
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords don't match");
        }
        if (formData.password.length < 6) {
          throw new Error("Password should be at least 6 characters");
        }
        await signup(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
      } else {
        await signIn(formData.email, formData.password);
      }
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button - Fixed Position */}
      <Link
        to="/"
        className="fixed top-4 left-4 md:top-6 md:left-6 z-50 bg-rhode-text text-white px-3 py-2 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm hover:bg-rhode-text/90 transition-colors"
      >
        ← Back
      </Link>

      {/* Main Container */}
      <div ref={containerRef} className="relative w-full min-h-screen">
        {/* Desktop Layout - Sliding Overlay Panel */}
        <div
          ref={panelRef}
          className="hidden lg:block absolute top-0 left-0 w-1/2 h-full bg-rhode-text z-10 flex-col justify-center items-center p-12 text-white text-center"
        >
          <div className="flex flex-col justify-center items-center h-full">
            <h2
              className="text-4xl font-bold mb-6"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              {!isSignUp ? "New Here?" : "Already Have Account?"}
            </h2>
            <p className="text-white mb-8 text-lg leading-relaxed font-medium">
              {!isSignUp
                ? "Create an account and discover a world of possibilities"
                : "Sign in to access your account and continue your journey"}
            </p>
            <button
              onClick={toggleMode}
              className="px-8 py-3 border-2 border-white text-white rounded-full hover:bg-white hover:text-rhode-text transition-all duration-300 font-bold uppercase tracking-wide"
            >
              {!isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </div>

        {/* Desktop Layout - Left Panel - Sign In Form */}
        <div
          ref={leftPanelRef}
          className="hidden lg:block absolute top-0 left-0 w-1/2 h-full flex-col justify-center items-center p-12 bg-white"
        >
          <div className="flex flex-col justify-center items-center h-full">
            <h2
              className="text-2xl xl:text-3xl text-rhode-text leading-relaxed max-w-2xl font-normal mb-8 text-center"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
              {error && !isSignUp && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rhode-text hover:text-rhode-text/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || isSignUp}
                className="w-full bg-rhode-text text-white py-3 rounded-lg hover:bg-rhode-text/90 transition-colors font-bold disabled:opacity-50"
              >
                {loading && !isSignUp ? "Signing In..." : "Sign In"}
              </button>

              <div className="text-center">
                <span className="text-gray-600 font-medium">or</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading || isSignUp}
                className="w-full bg-white border border-rhode-text/30 text-rhode-text py-3 rounded-lg hover:bg-rhode-light transition-colors font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>
            </form>
          </div>
        </div>

        {/* Desktop Layout - Right Panel - Sign Up Form */}
        <div
          ref={rightPanelRef}
          className="hidden lg:block absolute top-0 right-0 w-1/2 h-full flex-col justify-center items-center p-12 bg-white"
        >
          <div className="flex flex-col justify-center items-center h-full">
            <h2
              className="text-2xl xl:text-3xl text-rhode-text leading-relaxed max-w-2xl font-normal mb-8 text-center"
              style={{ fontFamily: "Chillax, sans-serif" }}
            >
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
              {error && isSignUp && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rhode-text hover:text-rhode-text/70 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {formData.password && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600 font-medium">
                      Password strength
                    </span>
                    <span
                      className={`font-bold ${passwordStrength >= 75 ? "text-green-600" : passwordStrength >= 50 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {passwordStrength >= 75
                        ? "Strong"
                        : passwordStrength >= 50
                          ? "Medium"
                          : "Weak"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${passwordStrength >= 75 ? "bg-green-500" : passwordStrength >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rhode-text hover:text-rhode-text/70 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !isSignUp}
                className="w-full bg-rhode-text text-white py-3 rounded-lg hover:bg-rhode-text/90 transition-colors font-bold disabled:opacity-50"
              >
                {loading && isSignUp ? "Creating Account..." : "Sign Up"}
              </button>

              <div className="text-center">
                <span className="text-gray-600 font-medium">or</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading || !isSignUp}
                className="w-full bg-white border border-rhode-text/30 text-rhode-text py-3 rounded-lg hover:bg-rhode-light transition-colors font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Layout - Single Column */}
        <div className="lg:hidden min-h-screen flex flex-col">
          {/* Mobile Header with Toggle */}
          <div className="bg-rhode-text text-white p-6 pt-16">
            <div className="max-w-sm mx-auto text-center">
              <h1
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="text-white/90 mb-6 text-sm sm:text-base">
                {isSignUp
                  ? "Join us and discover a world of possibilities"
                  : "Sign in to access your account"}
              </p>
              <button
                onClick={toggleMode}
                className="px-6 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-rhode-text transition-all duration-300 font-bold text-sm uppercase tracking-wide"
              >
                {isSignUp ? "Already have an account?" : "Need an account?"}
              </button>
            </div>
          </div>

          {/* Mobile Form Container */}
          <div className="flex-1 bg-white p-6">
            <div className="max-w-sm mx-auto">
              <h2
                className="text-xl sm:text-2xl text-rhode-text font-normal mb-6 text-center"
                style={{ fontFamily: "Chillax, sans-serif" }}
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm font-medium">
                    {error}
                  </div>
                )}

                {isSignUp && (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium text-sm"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium text-sm"
                    />
                  </div>
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rhode-text hover:text-rhode-text/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {isSignUp && formData.password && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 font-medium">
                        Password strength
                      </span>
                      <span
                        className={`font-bold ${passwordStrength >= 75 ? "text-green-600" : passwordStrength >= 50 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {passwordStrength >= 75
                          ? "Strong"
                          : passwordStrength >= 50
                            ? "Medium"
                            : "Weak"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${passwordStrength >= 75 ? "bg-green-500" : passwordStrength >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {isSignUp && (
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-rhode-text hover:text-rhode-text/70 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-rhode-text text-white py-3 rounded-lg hover:bg-rhode-text/90 transition-colors font-bold disabled:opacity-50"
                >
                  {loading
                    ? isSignUp
                      ? "Creating Account..."
                      : "Signing In..."
                    : isSignUp
                      ? "Sign Up"
                      : "Sign In"}
                </button>

                <div className="text-center">
                  <span className="text-gray-600 font-medium">or</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={loading}
                  className="w-full bg-white border border-rhode-text/30 text-rhode-text py-3 rounded-lg hover:bg-rhode-light transition-colors font-bold flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  <span className="text-sm sm:text-base">
                    Continue with Google
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;
