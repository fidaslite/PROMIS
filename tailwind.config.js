/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom brand colors here for your RFID system
        primary: "#0f172a", // Slate 900
        secondary: "#334155", // Slate 700
      },
    },
  },
  plugins: [],
}