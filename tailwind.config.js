/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FBF9F2',
        surface: '#FFFFFF',
        ink: '#152119',
        line: '#E5E0CF',
        farm: {
          50: '#EEF4EC',
          100: '#D6E6D1',
          200: '#AECFA5',
          300: '#80B473',
          400: '#57964B',
          500: '#2F6B3A',
          600: '#255730',
          700: '#1C4526',
          800: '#15361D',
          900: '#0F2814',
        },
        harvest: {
          50: '#FBF1DD',
          100: '#F5DFAF',
          300: '#EABE5E',
          500: '#DFA22B',
          600: '#B9821E',
          700: '#8F6416',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        soft: '0 4px 24px -4px rgba(21, 33, 25, 0.08)',
        lift: '0 12px 32px -8px rgba(21, 33, 25, 0.18)',
      },
      backgroundImage: {
        furrows: 'repeating-linear-gradient(115deg, rgba(47,107,58,0.07) 0px, rgba(47,107,58,0.07) 2px, transparent 2px, transparent 34px)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
        floaty: '6s ease-in-out infinite floaty',
      },
    },
  },
  plugins: [],
}
