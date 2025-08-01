import { useState, useEffect } from "react";

const VALID_PASSWORDS = [
  import.meta.env.VITE_ACCESS_PASSWORD || "dupp2024",
  "preview2024",
  "admin",
];
const ACCESS_KEY = "dupp_preview_access";

export const usePasswordProtection = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if coming soon mode is enabled
    const comingSoonMode = import.meta.env.VITE_COMING_SOON_MODE === "true";

    // If coming soon mode is disabled, grant access immediately
    if (!comingSoonMode) {
      setHasAccess(true);
      setIsLoading(false);
      return;
    }

    const storedAccess = localStorage.getItem(ACCESS_KEY);
    setHasAccess(storedAccess === "granted");
    setIsLoading(false);
  }, []);

  const validatePassword = (password) => {
    return VALID_PASSWORDS.includes(password.toLowerCase());
  };

  const grantAccess = () => {
    localStorage.setItem(ACCESS_KEY, "granted");
    setHasAccess(true);
  };

  const revokeAccess = () => {
    localStorage.removeItem(ACCESS_KEY);
    setHasAccess(false);
  };

  return {
    hasAccess,
    isLoading,
    validatePassword,
    grantAccess,
    revokeAccess,
  };
};
