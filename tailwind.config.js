/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        hazmat: "#ffe700", // Your desired custom border color
        rnflowerblue: "#6495ED",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tw-elements-react/dist/plugin.cjs"),
  ],
};
