/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.tsx',
    './app/**/*.ts',
  ],
  theme: {
    extend: {
      colors: {
        // Under Armour brand colors
        'ua-dark': '#1D1D1D',      // Primary text
        'ua-grey': '#5F5F5F',       // Secondary text
        'ua-light': '#FFFFFF',      // White/background
        'ua-black': '#000000',      // Black backgrounds
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'base': ['16px', { lineHeight: '1.6' }],
        'lg': ['18px', { lineHeight: '1.6' }],
        'xl': ['20px', { lineHeight: '1.6' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.3' }],
        '4xl': ['48px', { lineHeight: '1.2' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px',
        '4xl': '64px',
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
