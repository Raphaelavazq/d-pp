import React from "react";
import { LogOut } from "lucide-react";
import { usePasswordProtection } from "../hooks/usePasswordProtection";

const AdminAccess = () => {
  const { revokeAccess, hasAccess } = usePasswordProtection();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to exit preview mode?")) {
      revokeAccess();
      window.location.reload();
    }
  };

  // Only show the button if user has preview access and coming soon mode is enabled
  const comingSoonMode = import.meta.env.VITE_COMING_SOON_MODE === "true";
  const showExitButton = hasAccess && comingSoonMode;

  if (!showExitButton) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleLogout}
        className="bg-rhode-text hover:bg-rhode-text/90 text-rhode-light px-4 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2 text-sm hover:scale-105"
        title="Exit Preview Mode"
      >
        <LogOut size={16} />
        <span>Exit Preview</span>
      </button>
    </div>
  );
};

export default AdminAccess;
