/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 24px 60px rgba(15, 23, 42, 0.18)",
        soft: "0 8px 30px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        body: ["Inter", "SF Pro Text", "SF Pro Display", "Segoe UI", "sans-serif"],
        display: ["Inter", "SF Pro Display", "Segoe UI", "sans-serif"]
      },
      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)"
          },
          "50%": {
            transform: "translateY(-10px)"
          }
        }
      },
      animation: {
        fadeUp: "fadeUp 0.55s ease forwards",
        float: "float 9s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
