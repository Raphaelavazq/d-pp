import React from 'react';
import { LogOut } from 'lucide-react';
import { usePasswordProtection } from '../hooks/usePasswordProtection';

const AdminAccess = () => {
  const { revokeAccess } = usePasswordProtection();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to exit preview mode?')) {
      revokeAccess();
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2 text-sm"
        title="Exit Preview Mode"
      >
        <LogOut size={16} />
        <span>Exit Preview</span>
      </button>
    </div>
  );
};

export default AdminAccess;
