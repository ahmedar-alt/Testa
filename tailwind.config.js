/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', //手动切换 dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626',
          600: '#E71F1F',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        tn: {
          red: '#E71F1F',
          green: '#10b981',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'arabic': ['Almarai', 'Noto Kufi Arabic', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translate3d(0, 20px, 0)' },
          '100%': { opacity: 1, transform: 'translate3d(0, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}