import React, { useState } from "react";
import { Menu, Search } from "lucide-react";

const AdminHeader = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
  };

  return (
    <header className="bg-white border-b border-rhode-cream/30 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left Section */}
        <div className="flex items-center flex-1">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-rhode-text hover:text-rhode-text/80 hover:bg-rhode-cream/50 focus:outline-none focus:ring-2 focus:ring-rhode-text/20 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:block ml-4 flex-1 max-w-md"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-stone/40" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-rhode-cream rounded-lg leading-5 bg-rhode-cream/20 placeholder-stone/50 text-rhode-text focus:outline-none focus:placeholder-stone/40 focus:ring-2 focus:ring-rhode-text/20 focus:border-rhode-text/30 focus:bg-white text-sm transition-all"
                placeholder="Search products, orders, users..."
                aria-label="Search"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="sm:hidden px-4 pb-3 border-t border-gray-100">
        <form onSubmit={handleSearch} className="mt-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-sm"
              placeholder="Search..."
              aria-label="Mobile search"
            />
          </div>
        </form>
      </div>
    </header>
  );
};

export default AdminHeader;
