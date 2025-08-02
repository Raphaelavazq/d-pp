import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) => {
  const baseClasses =
    "font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-rhode-text text-rhode-light hover:bg-rhode-text/90 focus:ring-rhode-text/50",
    secondary:
      "border border-rhode-text text-rhode-text bg-transparent hover:bg-rhode-text hover:text-rhode-light focus:ring-rhode-text/50",
    outline:
      "border border-rhode-text text-rhode-text bg-transparent hover:bg-rhode-text/10 focus:ring-rhode-text/50",
    ghost:
      "text-rhode-text hover:text-rhode-dark hover:bg-rhode-light focus:ring-rhode-text/50",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50",
    charcoal:
      "bg-charcoal text-white hover:bg-charcoal/90 focus:ring-charcoal/50",
    gradient:
      "bg-gradient-to-r from-rhode-text to-rhode-text/90 text-white hover:shadow-lg focus:ring-rhode-text/50",
  };

  const sizes = {
    small: "px-4 py-2 text-sm rounded-lg",
    medium: "px-6 py-3 text-sm rounded-xl",
    large: "px-8 py-4 text-base rounded-xl",
    xl: "px-10 py-5 text-lg rounded-2xl",
  };

  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.medium;

  const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  const handleClick = (e) => {
    if (disabled || loading) return;
    if (onClick) onClick(e);
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
