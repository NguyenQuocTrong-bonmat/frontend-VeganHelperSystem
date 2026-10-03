/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Botanical Hearth design tokens (Old)
        "bg-herb-white": "#F3F6EE",
        "surface-paper": "#FDFBF6",
        "primary-moss": "#2F5233",
        "primary-moss-hover": "#25401F",
        "accent-beetroot": "#A63446",
        "accent-turmeric": "#D9A441",
        "text-charcoal": "#2B2A25",
        "text-stem-gray": "#6B6F63",
        "border-sage-mist": "#DCE3D5",
        "success-sprout": "#4C8C4A",
        "error-chili": "#C1432E",
        "error-chili-bg": "#FBEAE7",
        "warning-turmeric-deep": "#B8791A",
        // VeganHelper Master Design System (New)
        "vh-forest": "#244C38",
        "vh-sage": "#A8BDA2",
        "vh-mint": "#DDF2E1",
        "vh-cream": "#FAF8F0",
        "vh-glass": "rgba(255, 255, 255, 0.65)",
        "vh-gold": "#D6B66A",
        "vh-text-primary": "#26342B",
        "vh-text-secondary": "#667568",
        "vh-border": "#DCE5D9",
        "vh-success": "#347A50",
        "vh-warning": "#A66A19",
        "vh-error": "#B54747",
        "vh-surface": "#FFFFFF",
      },
      fontFamily: {
        caslon: ["'Libre Caslon Text'", "serif"],
        fraunces: ["Fraunces", "serif"],
        vietnam: ["'Be Vietnam Pro'", "sans-serif"],
        "dm-serif": ["'DM Serif Display'", "serif"],
        "dm-sans": ["'DM Sans'", "sans-serif"],
      },
      boxShadow: {
        floating: "0 2px 12px rgba(43,42,37,0.12)",
        glass: "0 8px 32px rgba(36, 76, 56, 0.08)",
      },
      borderRadius: {
        "control-sm": "10px",
        "control": "12px",
        "card": "18px",
        "card-lg": "24px",
        "modal": "24px",
      },
      transitionDuration: {
        "fast": "150ms",
        "normal": "220ms",
        "slow": "350ms",
      },
      transitionTimingFunction: {
        "vh": "cubic-bezier(0.2, 0.8, 0.2, 1)",
      }
    },
  },
  plugins: [],
}
