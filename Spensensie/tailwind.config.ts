import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: "#E6F4F1",
          100: "#C3E5DE",
          200: "#97D2C5",
          300: "#67BBA9",
          400: "#3E9F8E",
          500: "#01796F", // Classic Pine Green Primary
          600: "#01635B",
          700: "#014D47",
          800: "#023935", // Deep Pine Forest Card
          900: "#012724", // Pine Dark Mode Surface
          950: "#001715", // Pine Dark Mode Background
        },
        brand: {
          50: "#E6F4F1",
          100: "#C3E5DE",
          200: "#97D2C5",
          300: "#67BBA9",
          400: "#3E9F8E",
          500: "#01796F",
          600: "#01635B",
          700: "#014D47",
          800: "#023935",
          900: "#012724",
          950: "#001715",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "sans-serif"],
        display: ["var(--font-display)", "Poppins", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
