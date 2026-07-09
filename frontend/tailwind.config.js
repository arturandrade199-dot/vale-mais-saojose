/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2E8B3D",
          greenLight: "#3BA84A",
          navy: "#0B2545",
        },
      },
    },
  },
  plugins: [],
};
