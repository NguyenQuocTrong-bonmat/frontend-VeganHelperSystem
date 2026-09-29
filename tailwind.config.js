/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Botanical Hearth design tokens (DESIGN.md)
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
      },
      fontFamily: {
        caslon: ["'Libre Caslon Text'", "serif"],
        fraunces: ["Fraunces", "serif"],
        vietnam: ["'Be Vietnam Pro'", "sans-serif"],
      },
      boxShadow: {
        floating: "0 2px 12px rgba(43,42,37,0.12)",
      },
    },
  },
  plugins: [],
}
