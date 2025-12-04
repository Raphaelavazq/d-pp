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
      "relative inline-flex items-center justify-center px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone select-none";
    // Variant styles
    const filled =
      "bg-stone text-sand border border-stone hover:bg-transparent hover:text-stone";
    const outline =
      "bg-transparent text-stone border-2 border-stone hover:bg-stone hover:text-sand";
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
