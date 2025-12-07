/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./*.ts",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
