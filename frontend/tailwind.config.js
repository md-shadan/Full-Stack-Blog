/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F1A",
        ember: "#FF5C35",
        sand: "#F5F2EA",
        slate: "#1C2431"
      }
    }
  },
  plugins: []
};
