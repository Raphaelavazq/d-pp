export const ANIMATION_CONFIG = {
  entrance: {
    duration: 1,
    offset: 30,
    ease: "power3.out",
  },
  shake: {
    sequence: [-10, 10, -10, 10, 0],
    duration: 0.5,
    ease: "power2.out",
  },
  scroll: {
    duration: 0.8,
    offset: 40,
    ease: "power2.out",
    stagger: 0.2,
  },
  hover: {
    scale: 1.05,
    duration: 0.3,
  },
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export const Z_INDEX = {
  dropdown: 10,
  sticky: 20,
  modal: 30,
  toast: 40,
  tooltip: 50,
};
