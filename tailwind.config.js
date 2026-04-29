/** @type {import('tailwindcss').Config} */

const config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },

    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"], // Inter
        serif: ["var(--font-serif)"], // Roboto Slab
        mono: ["var(--font-geist-mono)"],
      },
    },
  },

  plugins: [],
};

export default config;
