/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'bg':'#110D14',
        'bg-grey':'#18141B',
        'btn-primary':'#423CF3'
      }
    },
  },
  plugins: [],
}

