/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F2C31B",
        secondary: "#2196F3",
        white: "#FFFFFF",
        primaryHover: "#cf8b04",
        primaryDull: "rgb(242, 195, 27,0.1)",
        black: "#000000",
      },
      fontFamily: {
        cormorant: ["'cormorant Garamond'"],
        garamond: ["'Garamond'"],
      },
    },
  },
  plugins: [],
};
