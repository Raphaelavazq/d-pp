import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { gsap } from "gsap";

const SearchBar = ({
  onSearch,
  placeholder = "Search for designer dupes...",
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      gsap.to(containerRef.current, {
        width: "100%",
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(inputRef.current, {
        opacity: 1,
        duration: 0.3,
        delay: 0.2,
        ease: "power2.out",
      });
      inputRef.current?.focus();
    } else {
      gsap.to(inputRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
      });
      gsap.to(containerRef.current, {
        width: "48px",
        duration: 0.4,
        delay: 0.1,
        ease: "power3.out",
      });
    }
  }, [isExpanded]);

  const handleSearchClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else if (searchTerm.trim()) {
      onSearch?.(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setIsExpanded(false);
    onSearch?.("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      onSearch?.(searchTerm);
    }
    if (e.key === "Escape") {
      handleClear();
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      onSearch?.("");
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="flex items-center bg-white/80 backdrop-blur-sm border border-taupe/30 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
        style={{ width: "48px" }}
      >
        <button
          onClick={handleSearchClick}
          className="p-3 text-charcoal hover:text-charcoal/80 transition-all duration-300 hover:scale-110 flex-shrink-0"
          aria-label="Search"
        >
          <Search size={20} />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 py-3 pr-3 bg-transparent text-charcoal placeholder-charcoal/50 focus:outline-none opacity-0"
          style={{
            fontFamily: "Chillax, sans-serif",
            fontWeight: "300",
          }}
        />

        {isExpanded && searchTerm && (
          <button
            onClick={handleClear}
            className="p-3 text-charcoal/60 hover:text-charcoal transition-all duration-300 hover:scale-110 flex-shrink-0"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Animated placeholder when collapsed */}
      {!isExpanded && (
        <div
          className="absolute left-14 top-1/2 transform -translate-y-1/2 text-charcoal/50 text-sm font-light pointer-events-none"
          style={{ fontFamily: "Chillax, sans-serif" }}
        >
          Search
        </div>
      )}
    </div>
  );
};

export default SearchBar;
