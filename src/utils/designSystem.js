// Enhanced Professional Design System for düpp
// Consistent colors, spacing, typography, and animations

export const designSystem = {
  // Brand Colors - Consistent across all pages
  colors: {
    primary: {
      cream: "#F1F0ED",
      dark: "#1A1A1A",
      text: "#68655F",
      light: "#F7F7F5",
      accent: "#D6C5C5",
    },
    neutral: {
      white: "#FFFFFF",
      off_white: "#FAFAFA",
      light_gray: "#F5F5F5",
      gray: "#E5E5E5",
      dark_gray: "#3A3A3A",
      charcoal: "#2A2A2A",
      black: "#000000",
    },
    semantic: {
      success: "#10B981",
      warning: "#F59E0B",
      error: "#EF4444",
      info: "#3B82F6",
    },
  },

  // Typography Scale
  typography: {
    fonts: {
      primary: "Chillax, sans-serif",
      secondary: "Chillax, sans-serif",
      body: "Chillax, sans-serif",
    },
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
      "8xl": "6rem", // 96px
      "9xl": "8rem", // 128px
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      black: 900,
    },
  },

  // Spacing Scale
  spacing: {
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
    "2xl": "4rem", // 64px
    "3xl": "6rem", // 96px
    "4xl": "8rem", // 128px
    "5xl": "12rem", // 192px
    "6xl": "16rem", // 256px
  },

  // Animation Presets
  animations: {
    durations: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
      slower: 0.8,
      slowest: 1.2,
    },
    easings: {
      smooth: "power2.out",
      bounce: "back.out(1.7)",
      elastic: "elastic.out(1, 0.3)",
      expo: "expo.out",
      circ: "circ.out",
    },
    stagger: {
      fast: 0.1,
      normal: 0.15,
      slow: 0.2,
    },
  },

  // Border Radius
  borderRadius: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },

  // Component Specific Styles
  components: {
    button: {
      primary: {
        bg: "#1A1A1A",
        text: "#F1F0ED",
        hover: "#2A2A2A",
        padding: "0.75rem 2rem",
        borderRadius: "0.75rem",
      },
      secondary: {
        bg: "transparent",
        text: "#1A1A1A",
        border: "1px solid #1A1A1A",
        hover: "#1A1A1A",
        hoverText: "#F1F0ED",
      },
    },
    card: {
      bg: "#FFFFFF",
      border: "1px solid #E5E5E5",
      borderRadius: "1.5rem",
      shadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      padding: "2rem",
    },
  },
};

// Animation Utilities
export const animations = {
  // Fade in animation
  fadeIn: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
  },

  // Scale in animation
  scaleIn: {
    from: { opacity: 0, scale: 0.9 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
  },

  // Slide in from left
  slideInLeft: {
    from: { opacity: 0, x: -50 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
  },

  // Slide in from right
  slideInRight: {
    from: { opacity: 0, x: 50 },
    to: { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" },
  },

  // Text reveal animation
  textReveal: {
    from: { opacity: 0, y: 100, rotationX: 90 },
    to: { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: "power3.out" },
  },

  // Stagger animation for lists
  staggerIn: (elements, delay = 0.1) => ({
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: delay },
  }),
};

export default designSystem;
