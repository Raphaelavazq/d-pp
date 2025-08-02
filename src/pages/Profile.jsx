import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Profile = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    preferences: {
      newsletter: false,
      promotions: false,
      recommendations: true,
      darkMode: false,
    },
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Initialize form data from current user
    if (currentUser) {
      const displayName = currentUser.displayName || "";
      const [firstName = "", lastName = ""] = displayName.split(" ");

      setFormData({
        firstName,
        lastName,
        email: currentUser.email || "",
        phone: currentUser.phoneNumber || "",
        bio: currentUser.bio || "",
        preferences: {
          newsletter: currentUser.preferences?.newsletter || false,
          promotions: currentUser.preferences?.promotions || false,
          recommendations: currentUser.preferences?.recommendations || true,
          darkMode: currentUser.preferences?.darkMode || false,
        },
      });

      if (currentUser.photoURL) {
        setImagePreview(currentUser.photoURL);
      }
    }

    // Enhanced entrance animations
    gsap.fromTo(
      profileRef.current?.children || [],
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      }
    );
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("preferences.")) {
      const prefKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Image must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
        phoneNumber: formData.phone,
        bio: formData.bio,
        preferences: formData.preferences,
      };

      await updateUserProfile(updateData, profileImage);
      setSuccess("Profile updated successfully!");

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setProfileImage(null);
    } catch (err) {
      setError("Failed to update profile");
      console.error(err);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rhode-cream to-white">
        <div className="text-center backdrop-blur-lg bg-white/80 border border-white/20 rounded-3xl shadow-2xl p-12">
          <h2 className="text-3xl font-chillax text-rhode-text mb-4">
            Access Denied
          </h2>
          <p className="text-rhode-text/70 font-[Chillax] text-lg">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rhode-cream to-white py-12 px-4">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rhode-text/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-rhode-text/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-rhode-text/3 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div
          ref={profileRef}
          className="backdrop-blur-lg bg-white/80 border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-rhode-text to-rhode-text/90 px-8 py-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h1 className="text-4xl font-chillax mb-2">Profile Settings</h1>
                <p className="text-rhode-cream/80 font-[Chillax] text-lg">
                  Manage your account and preferences
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-3 rounded-xl font-[Chillax] font-medium transition-all duration-300 backdrop-blur-sm hover:scale-105"
              >
                Sign Out
              </button>
            </div>

            {/* Floating elements */}
            <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-sm animate-float"></div>
            <div className="absolute bottom-4 right-1/4 w-10 h-10 bg-rhode-cream/20 rounded-full blur-sm animate-float-delayed"></div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-rhode-text/10 bg-white/50 backdrop-blur-sm">
            <nav className="flex space-x-8 px-8">
              {[
                {
                  id: "profile",
                  label: "Profile",
                  icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                },
                {
                  id: "preferences",
                  label: "Preferences",
                  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
                },
                {
                  id: "security",
                  label: "Security",
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-[Chillax] font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-rhode-text text-rhode-text"
                      : "border-transparent text-rhode-text/60 hover:text-rhode-text/80 hover:border-rhode-text/30"
                  }`}
                >
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
                      d={tab.icon}
                    />
                  </svg>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center space-x-2">
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
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Picture Section */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-rhode-text/20 shadow-lg bg-gradient-to-br from-rhode-cream to-white">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-rhode-text/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute bottom-2 right-2 bg-rhode-text text-white rounded-full p-3 shadow-lg hover:bg-rhode-text/90 transition-all duration-300 hover:scale-110"
                    >
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
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <p className="mt-4 text-sm text-rhode-text/60 font-[Chillax]">
                    Click the camera icon to upload a new photo (max 5MB)
                  </p>
                </div>

                {/* Personal Information */}
                <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-chillax text-rhode-text mb-6 flex items-center space-x-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Personal Information</span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-rhode-text font-[Chillax] mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/50 border border-rhode-text/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rhode-text/30 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter first name"
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
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/50 border border-rhode-text/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rhode-text/30 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter last name"
                      />
                    </div>

                    <div>
                      <label className="block text-rhode-text font-[Chillax] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-rhode-text/20 rounded-xl text-rhode-text/60 cursor-not-allowed"
                        placeholder="Email address"
                      />
                      <p className="mt-1 text-xs text-rhode-text/50 font-[Chillax]">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-rhode-text font-[Chillax] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/50 border border-rhode-text/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rhode-text/30 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-rhode-text font-[Chillax] mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/50 border border-rhode-text/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-rhode-text/30 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 py-3 border border-rhode-text/20 text-rhode-text rounded-xl font-[Chillax] font-medium hover:bg-rhode-text/5 transition-all duration-300 backdrop-blur-sm"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-rhode-text to-rhode-text/90 text-white rounded-xl font-[Chillax] font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              </form>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-8">
                <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-chillax text-rhode-text mb-6 flex items-center space-x-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-5 5v-5zM4.257 3.093l8.143 8.143M8.136 8.136l-4.136 4.136M12 5l7 7-7 7"
                      />
                    </svg>
                    <span>Communication Preferences</span>
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-rhode-text/10">
                      <div>
                        <h3 className="font-[Chillax] font-medium text-rhode-text">
                          Newsletter Subscription
                        </h3>
                        <p className="text-sm text-rhode-text/60 font-[Chillax]">
                          Receive our weekly newsletter with updates and tips
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="preferences.newsletter"
                          checked={formData.preferences.newsletter}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rhode-text/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rhode-text"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-rhode-text/10">
                      <div>
                        <h3 className="font-[Chillax] font-medium text-rhode-text">
                          Promotional Emails
                        </h3>
                        <p className="text-sm text-rhode-text/60 font-[Chillax]">
                          Get notified about sales and special offers
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="preferences.promotions"
                          checked={formData.preferences.promotions}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rhode-text/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rhode-text"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-rhode-text/10">
                      <div>
                        <h3 className="font-[Chillax] font-medium text-rhode-text">
                          Product Recommendations
                        </h3>
                        <p className="text-sm text-rhode-text/60 font-[Chillax]">
                          Receive personalized product suggestions
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="preferences.recommendations"
                          checked={formData.preferences.recommendations}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-rhode-text/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rhode-text"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-rhode-text to-rhode-text/90 text-white rounded-xl font-[Chillax] font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
                  <h2 className="text-2xl font-chillax text-rhode-text mb-6 flex items-center space-x-2">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span>Account Security</span>
                  </h2>

                  <div className="space-y-6">
                    <div className="p-4 bg-white/50 rounded-xl border border-rhode-text/10">
                      <h3 className="font-[Chillax] font-medium text-rhode-text mb-2">
                        Account Information
                      </h3>
                      <div className="space-y-2 text-sm text-rhode-text/70">
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {currentUser?.email}
                        </p>
                        <p>
                          <span className="font-medium">Member Since:</span>{" "}
                          {new Date(
                            currentUser?.metadata?.creationTime
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Last Sign In:</span>{" "}
                          {new Date(
                            currentUser?.metadata?.lastSignInTime
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white/50 rounded-xl border border-rhode-text/10">
                      <h3 className="font-[Chillax] font-medium text-rhode-text mb-4">
                        Password & Authentication
                      </h3>
                      <Button
                        variant="primary"
                        size="medium"
                        className="w-full sm:w-auto rounded-xl"
                      >
                        Change Password
                      </Button>
                    </div>

                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <h3 className="font-[Chillax] font-medium text-red-800 mb-2">
                        Danger Zone
                      </h3>
                      <p className="text-sm text-red-600 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <Button
                        variant="destructive"
                        size="medium"
                        className="rounded-xl"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
