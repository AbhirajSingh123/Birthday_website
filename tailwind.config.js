/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "midnight" now names the light cream background scale — the key
        // stayed the same across the theme switch so class names in
        // components didn't need renaming, only the hex values changed.
        midnight: {
          950: '#efe3c8',
          900: '#faf6ee',
          800: '#f4edda',
          700: '#ece0c2',
          600: '#dfcda3',
        },
        gold: {
          400: '#e6c878',
          500: '#c9a24b',
          600: '#a9843a',
        },
        plum: {
          500: '#7a2b45',
          600: '#5e2136',
        },
        // "champagne" is the primary text tone — dark ink on the light theme.
        champagne: '#2a2013',
        // Guaranteed-dark ink for high-contrast text (e.g. on gold buttons).
        ink: {
          900: '#241a0f',
          800: '#332512',
          700: '#4a3620',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-foil': 'linear-gradient(135deg, #e6c878 0%, #c9a24b 45%, #8a6b26 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.97)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        rise: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.75' },
          '100%': { transform: 'translateY(-120vh) scale(0.4)', opacity: '0' },
        },
        dropIn: {
          '0%': { transform: 'translateY(-60px) rotate(-3deg)', opacity: '0' },
          '60%': { transform: 'translateY(8px) rotate(1deg)', opacity: '1' },
          '100%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
        },
      },
      animation: {
        flicker: 'flicker 2.2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        rise: 'rise linear infinite',
        dropIn: 'dropIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
