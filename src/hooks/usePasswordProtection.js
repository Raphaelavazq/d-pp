import { useState, useEffect } from 'react';

export const usePasswordProtection = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if coming soon mode is enabled
    const comingSoonMode = import.meta.env.VITE_COMING_SOON_MODE === 'true';
    
    // If coming soon mode is disabled, grant access immediately
    if (!comingSoonMode) {
      setHasAccess(true);
      setIsLoading(false);
      return;
    }

    // Check if user already has access from localStorage
    const accessGranted = localStorage.getItem('duppAccess');
    if (accessGranted === 'granted') {
      setHasAccess(true);
    }
    setIsLoading(false);
  }, []);

  const grantAccess = () => {
    setHasAccess(true);
    localStorage.setItem('duppAccess', 'granted');
  };

  const revokeAccess = () => {
    setHasAccess(false);
    localStorage.removeItem('duppAccess');
  };

  const validatePassword = (password) => {
    const validPasswords = [
      import.meta.env.VITE_ACCESS_PASSWORD || 'dupp2025',
      'preview',
      'admin'
    ];
    return validPasswords.includes(password);
  };

  return {
    hasAccess,
    isLoading,
    grantAccess,
    revokeAccess,
    validatePassword
  };
};
