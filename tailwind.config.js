/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.html"],
  theme: {
    extend: {
      colors: {
        dzgreen: "#006233",
        dzred: "#d21034",
        dzgold: "#d4af37",
        dzdark: "#1e293b",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
    },
  },
  plugins: [],
};
