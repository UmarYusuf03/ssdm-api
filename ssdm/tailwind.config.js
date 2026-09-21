/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          light: "#EEF2FF",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "10px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 6px -1px rgba(0,0,0,0.06)",
      },
      maxWidth: {
        dashboard: "1440px",
      },
      width: {
        sidebar: "260px",
      },
      height: {
        navbar: "64px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
