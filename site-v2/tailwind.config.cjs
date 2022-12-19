/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "ping-once":
          "ping-once 2s cubic-bezier(0, 0, 0.2, 1) 1 normal forwards",
      },
      keyframes: {
        "ping-once": {
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
