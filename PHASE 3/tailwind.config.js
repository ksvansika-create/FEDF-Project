/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        secondary: '#0EA5E9',
        accent: {
          DEFAULT: '#14B8A6',
          hover: '#0F766E',
        },
        dark: {
          DEFAULT: '#0F172A',
          card: 'rgba(15, 23, 42, 0.65)',
          bg: '#0B0F19',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
