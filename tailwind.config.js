/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        berserk: {
          dark: '#000000', // Absolute Black
          card: '#0a0a0a', // Almost black
          border: '#1a1a1a', // Subtle dark border
          red: '#7f1d1d', // Deep Blood Red
          brightRed: '#dc2626', // Fresh blood accent
          gold: '#D4AF37', // Antique Gold
          goldDim: '#8a7e4a', // Dim Antique Gold
          sacredGold: '#FFD700', // Sacred Gold (brighter)
          steel: '#6b7280', // Steel Gray
          crimson: '#4a0000', // Deep Crimson
          text: '#e5e5e5', // High readability light gray
          muted: '#525252', // Ash gray
        }
      },
      boxShadow: {
        'glow-red': '0 0 15px rgba(220, 38, 38, 0.5)',
        'glow-red-strong': '0 0 25px rgba(220, 38, 38, 0.7)',
        'pulse-red': '0 0 10px rgba(220, 38, 38, 0.4)',
        'card-hover': '0 0 20px rgba(127, 29, 29, 0.3)',
        'glow-gold': '0 0 15px rgba(212, 175, 55, 0.4)',
        'glow-gold-strong': '0 0 25px rgba(212, 175, 55, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breath': 'breath 4s ease-in-out infinite',
        'glow-pulse': 'box-shadow-pulse 2s infinite',
        'blob': 'blob 7s infinite',
        'divine-aura': 'divineAura 30s ease-in-out infinite alternate',
        'spin-slow': 'spin 3s linear infinite',
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
        },
        'box-shadow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px #991b1b' },
          '50%': { boxShadow: '0 0 20px #991b1b' },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" }
        },
        'pulse-slow': {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 }
        },
        divineAura: {
          "0%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          "50%": { transform: "translate(10px, -15px) rotate(-0.5deg) scale(0.98)" },
          "100%": { transform: "translate(-20px, 15px) rotate(1.5deg) scale(1)" }
        },
      }
    },
  },
  plugins: [],
}
