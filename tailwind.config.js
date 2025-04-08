/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    "text-accent",
    "bg-accent",
    "text-primary",
    "bg-primary",
    "text-yellow-500",
    "bg-yellow-500",
    "text-light",
    "bg-light",
    "text-red-500",
    "bg-red-500",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Indigo
        secondary: "#4f46e5", // Darker indigo
        accent: "#10b981", // Emerald
        dark: "#0f172a", // Slate 900
        darker: "#020617", // Slate 950
        light: "#94a3b8", // Slate 400
        lighter: "#cbd5e1", // Slate 300
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(99, 102, 241, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.8)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      boxShadow: {
        neon: "0 0 10px rgba(99, 102, 241, 0.7)",
      },
    },
  },
  plugins: [],
};
