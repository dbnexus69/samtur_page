/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#102846",
          dark: "#0a1c2e",
          light: "#1a3a5c",
        },
        accent: "#f2892f",
        "accent-dark": "#d97718",
        "gray-light": "#f5f5f5",
        "gray-border": "#e0e0e0",
        success: "#16a34a",
        warning: "#f59e0b",
        danger: "#dc2626",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
