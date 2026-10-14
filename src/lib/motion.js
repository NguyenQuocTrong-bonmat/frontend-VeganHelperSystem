// src/lib/motion.js

export const motionTokens = {
  duration: {
    micro: 0.15,
    short: 0.3,
    medium: 0.5,
    long: 0.8,
  },
  distance: {
    micro: 4,
    small: 10,
    medium: 20,
  },
  scale: {
    press: 0.98,
    entrance: 0.95,
  },
  easing: {
    entrance: [0.0, 0.0, 0.2, 1],
    standard: [0.4, 0.0, 0.2, 1],
    exit: [0.4, 0.0, 1, 1],
  }
};
