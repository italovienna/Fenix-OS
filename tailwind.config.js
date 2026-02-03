/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        berserk: {
          dark: '#050505', // Deep abyss black
          start: '#0a0a0a',
          card: '#121212', // Dark iron
          border: '#2a2a2a', // Rusted iron shade
          red: '#7f1d1d', // Dried blood
          brightRed: '#dc2626', // Fresh blood accent
          text: '#d4d4d4', // Bone white
          muted: '#525252', // Ash gray
        }
      },
      boxShadow: {
        'glow-red': '0 0 15px rgba(220, 38, 38, 0.5)',
        'glow-red-strong': '0 0 25px rgba(220, 38, 38, 0.7)',
        'pulse-red': '0 0 10px rgba(220, 38, 38, 0.4)',
        'card-hover': '0 0 20px rgba(127, 29, 29, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breath': 'breath 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        breath: {
          '0%, 100%': { filter: 'drop-shadow(0 0 5px rgba(220,38,38,0.3))' },
          '50%': { filter: 'drop-shadow(0 0 15px rgba(220,38,38,0.6))' },
        }
      }
    },
  },
  plugins: [],
}
