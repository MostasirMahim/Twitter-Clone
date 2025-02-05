import daisyui from 'daisyui'
import scrollbar from 'tailwind-scrollbar'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': {'max': '639px'},
      },
      fontFamily: {
        kaushan: ['"Kaushan Script"', 'cursive'],
        lato: ['Lato', 'sans-serif'],
        spartan: ['"League Spartan"', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        notosans: ["Noto Sans", 'sans-serif'],
        amaranth: ["Amaranth", 'sans-serif'],
        smoch: ["Smooch Sans", 'sans-serif'],
      },
    },
  },
  plugins: [
    daisyui,
    scrollbar
  ],
}