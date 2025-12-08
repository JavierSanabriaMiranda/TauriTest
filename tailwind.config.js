/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- VITAL para que funcione el botón
  theme: {
    extend: {},
  },
  plugins: [],
}