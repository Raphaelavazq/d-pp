import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

/**
 * Reusable ImpactButton for consistent, minimal, luxury-style buttons.
 * Supports filled, outline, and animated hover states.
 *
 * Props:
 * - children: Button text or node
 * - variant: 'filled' | 'outline' (default: 'filled')
 * - className: Additional Tailwind classes
 * - onClick: Click handler
 * - type: Button type (button, submit, etc)
 * - disabled: Disabled state
 * - ...rest: Other props
 */
const ImpactButton = React.forwardRef(
  (
    {
      children,
      variant = "filled",
      className = "",
      onClick,
      type = "button",
      disabled = false,
      ...rest
    },
    ref
  ) => {
    // Base styles for both variants
    const base =
      "relative inline-flex items-center justify-center px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rhode-text select-none";
    // Variant styles
    const filled =
      "bg-rhode-text text-rhode-light border border-rhode-text hover:bg-transparent hover:text-rhode-text";
    const outline =
      "bg-transparent text-rhode-text border border-rhode-text hover:bg-rhode-text hover:text-rhode-light";
    // Animation: subtle scale on hover
    const animation = "hover:scale-[1.04] active:scale-95";
    // Font
    const font = "font-semibold";
    // Disabled
    const disabledStyle = "opacity-50 pointer-events-none";

    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          base,
          font,
          animation,
          variant === "filled" ? filled : outline,
          disabled && disabledStyle,
          className
        )}
        onClick={onClick}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

ImpactButton.displayName = "ImpactButton";

ImpactButton.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["filled", "outline"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ImpactButton;
