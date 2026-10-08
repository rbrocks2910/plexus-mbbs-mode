/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        'plexus-blue': {
          DEFAULT: '#1A3C5A',
          dark: '#122B40'
        },
        'plexus-accent': '#4A90E2',
        'plexus-red': '#FF4D4F',
        'ivory': '#F8F1E9',
        'cool-gray': '#D3E3FC',
        'soft-green': '#E6F7E6',
        'plexus-bg-secondary': '#F4F4F4',
        'plexus-user-chat': '#E6F0FA',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        textFadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseHeart: {
          '0%, 100%': { opacity: '0.08' },
          '50%': { opacity: '0.22' },
        },
        typingPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
        'text-fade': 'textFadeIn 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards',
        'gradient': 'gradient 15s ease infinite',
        'wave': 'wave 4s linear infinite',
        'pulse-heart': 'pulseHeart 2s cubic-bezier(0.4, 0.0, 0.2, 1) infinite',
        'typing-pulse': 'typingPulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'plexus': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'plexus-lg': '0 8px 24px rgba(0, 0, 0, 0.1)',
      },
      transitionTimingFunction: {
        'plexus-ease': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      }
    },
  },
  plugins: [],
}
