/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0e0f",
        "on-surface": "#ffffff",
        "on-surface-variant": "#adaaab",
        primary: "#89acff",
        "primary-dim": "#0f6df3",
        secondary: "#3fff8b",
        "secondary-dim": "#24f07e",
        "secondary-container": "#006d35",
        "on-secondary-fixed": "#004820",
        "surface-container-lowest": "#000000",
        "surface-container-low": "#131314",
        "surface-container": "#1a191b",
        "surface-container-high": "#201f21",
        "surface-container-highest": "#262627",
        "surface-variant": "#262627",
        outline: "#767576",
        "outline-variant": "#484849",
      },
      fontFamily: {
        headline: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      }
    },
  },
  plugins: [],
}