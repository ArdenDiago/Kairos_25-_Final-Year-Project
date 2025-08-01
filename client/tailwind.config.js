/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        color: {
          1: "#AC6AFF",
          2: "#FFC876",
          3: "#FF776F",
          4: "#7ADB78",
          5: "#858DFF",
          6: "#FF98E2",
        },
        stroke: {
          1: "#26242C",
        },
        n: {
          1: "#FFFFFF",
          2: "#CAC6DD",
          3: "#ADA8C3",
          4: "#757185",
          5: "#3F3A52",
          6: "#252134",
          7: "#15131D",
          8: "#0E0C15",
          9: "#474060",
          10: "#43435C",
          11: "#1B1B2E",
          12: "#2E2A41",
          13: "#6C7275",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", ...fontFamily.sans],
        code: "var(--font-code)",
        grotesk: "var(--font-grotesk)",
      },
      letterSpacing: {
        tagline: ".15em",
      },
      spacing: {
        0.25: "0.0625rem",
        7.5: "1.875rem",
        15: "3.75rem",
      },
      opacity: {
        15: ".15",
      },
      transitionDuration: {
        DEFAULT: "00ms",
      },
      transitionTimingFunction: {
        DEFAULT: "linear",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      borderWidth: {
        DEFAULT: "0.0625rem",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
        "conic-gradient":
          "conic-gradient(from 225deg, #FFC876, #79FFF7, #9F53FF, #FF98E2, #FFC876)",
      },
      animation: {
        // Synchronized circle animations with different speeds
        "spin-speed-1": "spin-from-common-point 5s linear infinite",
        "spin-speed-2": "spin-from-common-point 4s linear infinite",
        "spin-speed-3": "spin-from-common-point 3s linear infinite",
        "spin-speed-4": "spin-from-common-point 2s linear infinite",
        "spin-speed-5": "spin-from-common-point 1s linear infinite",
        "spin-speed-6": "spin-from-common-point 0.7s linear infinite",
        "spin-speed-7": "spin-from-common-point 0.5s linear infinite",
        
        // Reverse animations for variety
        "spin-speed-1-reverse": "spin-from-common-point-reverse 5s linear infinite",
        "spin-speed-2-reverse": "spin-from-common-point-reverse 4s linear infinite",
        "spin-speed-3-reverse": "spin-from-common-point-reverse 3s linear infinite",
        "spin-speed-4-reverse": "spin-from-common-point-reverse 2s linear infinite",
        "spin-speed-5-reverse": "spin-from-common-point-reverse 1s linear infinite",
        
        // Maintain legacy animations for compatibility
        "spin-slow": "spin 20s linear infinite",
        "spin-medium": "spin 15s linear infinite",
        "spin-fast": "spin 10s linear infinite",
        "spin-with-delay": "spin-with-delay 20s linear infinite",
      },
      keyframes: {
        // Forward spinning animation from common point
        "spin-from-common-point": {
          "0%": { 
            transform: "translate(-50%, -50%) rotate(0deg)",
            transformOrigin: "center center"
          },
          "100%": { 
            transform: "translate(-50%, -50%) rotate(360deg)",
            transformOrigin: "center center"
          },
        },
        // Reverse spinning animation from common point
        "spin-from-common-point-reverse": {
          "0%": { 
            transform: "translate(-50%, -50%) rotate(0deg)",
            transformOrigin: "center center"
          },
          "100%": { 
            transform: "translate(-50%, -50%) rotate(-360deg)",
            transformOrigin: "center center"
          },
        },
        // Legacy animations for compatibility
        "spin": {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
        "spin-with-delay": {
          "0%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "5%": { transform: "translate(-50%, -50%) rotate(0deg)" },
          "100%": { transform: "translate(-50%, -50%) rotate(360deg)" },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      addBase({});
      addComponents({
        ".container": {
          "@apply max-w-[77.5rem] mx-auto px-5 md:px-10 lg:px-15 xl:max-w-[87.5rem]":
            {},
        },
        ".h1": {
          "@apply font-semibold text-[2.5rem] leading-[3.25rem] md:text-[2.75rem] md:leading-[3.75rem] lg:text-[3.25rem] lg:leading-[4.0625rem] xl:text-[3.75rem] xl:leading-[4.5rem]":
            {},
        },
        ".h2": {
          "@apply text-[1.75rem] leading-[2.5rem] md:text-[2rem] md:leading-[2.5rem] lg:text-[2.5rem] lg:leading-[3.5rem] xl:text-[3rem] xl:leading-tight":
            {},
        },
        ".h3": {
          "@apply text-[2rem] leading-normal md:text-[2.5rem]": {},
        },
        ".h4": {
          "@apply text-[2rem] leading-normal": {},
        },
        ".h5": {
          "@apply text-2xl leading-normal": {},
        },
        ".h6": {
          "@apply font-semibold text-lg leading-8": {},
        },
        ".body-1": {
          "@apply text-[0.875rem] leading-[1.5rem] md:text-[1rem] md:leading-[1.75rem] lg:text-[1.25rem] lg:leading-8":
            {},
        },
        ".body-2": {
          "@apply font-light text-[0.875rem] leading-6 md:text-base": {},
        },
        ".caption": {
          "@apply text-sm": {},
        },
        ".tagline": {
          "@apply font-grotesk font-light text-xs tracking-tagline uppercase":
            {},
        },
        ".quote": {
          "@apply font-code text-lg leading-normal": {},
        },
        ".button": {
          "@apply font-code text-xs font-bold uppercase tracking-wider": {},
        },
      });
      addUtilities({
        ".tap-highlight-color": {
          "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)",
        },
      });
    }),
  ],
};