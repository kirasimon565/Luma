/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6E4AFF",
        secondary: "#FFD35C",
        "light-bg": "#F9F7FF",
        "dark-bg": "#111014",
        "light-text": "#1A1A1A",
        "dark-text": "#E5E5E5",
        success: "#4AEF8D",
        error: "#FF3E57",
        warning: "#E86A17",
      },
      fontFamily: {
        display: ["Clash Display", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "gradient-xy": "gradient-xy 15s ease infinite",
        "fade-in-up": "fade-in-up 1s ease-out",
      },
      keyframes: {
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [],
};
module.exports = config;
