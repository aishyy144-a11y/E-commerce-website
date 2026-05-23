/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#EBF5FF',
          DEFAULT: '#1E40AF', // Deep Blue
          dark: '#1E3A8A',
        },
        secondary: {
          light: '#F3F4F6',
          DEFAULT: '#FFFFFF',
          dark: '#E5E7EB',
        },
        accent: '#3B82F6', // Brighter Blue
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

