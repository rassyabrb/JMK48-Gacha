/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-gold': 'pulse-gold 1.5s ease-in-out infinite',
        'flip': 'flip-card 0.6s ease-in-out',
        'reveal': 'card-reveal 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': {
            boxShadow: '0 0 24px rgba(245,158,11,0.9), 0 0 48px rgba(245,158,11,0.4)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(245,158,11,1), 0 0 80px rgba(245,158,11,0.6)',
          },
        },
        'flip-card': {
          '0%':   { transform: 'rotateY(0deg)' },
          '50%':  { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        'card-reveal': {
          '0%':   { transform: 'scale(0.7) rotateY(180deg)', opacity: '0' },
          '60%':  { transform: 'scale(1.05) rotateY(0deg)',  opacity: '1' },
          '100%': { transform: 'scale(1) rotateY(0deg)',     opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
