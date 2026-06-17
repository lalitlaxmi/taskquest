export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#8B5CF6",
        success: "#22C55E",
        accent: "#06B6D4",

        dark: {
          100: "#1F2937",
          200: "#111827",
          300: "#0F172A",
        },
      },

      boxShadow: {
        glow: "0 0 25px rgba(139, 92, 246, 0.25)",
      },

      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },

  plugins: [],
};