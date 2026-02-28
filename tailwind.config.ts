import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E8F0FE',
          100: '#D2E3FD',
          200: '#A8C8FC',
          300: '#7EADFB',
          400: '#5499F9',
          500: '#1A73E8',
          600: '#1557B0',
          700: '#104078',
          800: '#0B2840',
          900: '#051018',
        },
        success: {
          50: '#E6F4EA',
          100: '#CEEAD6',
          200: '#9ED5AD',
          300: '#6DBF84',
          400: '#3BAA5B',
          500: '#34A853',
          600: '#2B8742',
          700: '#22652D',
          800: '#194819',
          900: '#0F2D0B',
        },
        danger: {
          50: '#FCE8E6',
          100: '#F8D7D3',
          200: '#F3AEA7',
          300: '#ED8682',
          400: '#E85D5C',
          500: '#EA4335',
          600: '#BF360C',
          700: '#8D2B0F',
          800: '#5B1C0A',
          900: '#2D0D06',
        },
        warning: {
          50: '#FEF7E0',
          100: '#FEF1C3',
          200: '#FED87B',
          300: '#FEC34D',
          400: '#FBBC04',
          500: '#FBBC04',
          600: '#F8A400',
          700: '#DE8400',
          800: '#B88300',
          900: '#664D00',
        },
        background: '#F8F9FA',
        card: '#FFFFFF',
        text: {
          primary: '#1B1B1F',
          secondary: '#5F6368',
        },
        border: '#DADCE0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
      },
      borderRadius: {
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
