/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx"],
  theme: {
    extend: {
      colors: {
        'cosmic': {
          900: '#050510',
          800: '#0a0a1a',
          700: '#1a0a2e',
          600: '#2a1a4e'
        },
        'mystic': {
          gold: '#d4af37',
          silver: '#c0c0c0',
          purple: '#9370db',
          red: '#b22222'
        }
      },
      fontFamily: {
        'display': ['Cinzel', 'serif'],
        'body': ['"Cormorant Garamond"', 'serif'],
        'mono': ['"JetBrains Mono"', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathing': 'breathing 4s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        breathing: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
}
