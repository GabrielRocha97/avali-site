import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2D5B',
          dark: '#142245',
          light: '#253D78',
        },
        coral: {
          DEFAULT: '#E8694A',
          light: '#F08060',
          dark: '#C95238',
        },
        cream: {
          DEFAULT: '#FFF9F3',
          card: '#FFF0E5',
          dark: '#F5EDE3',
        },
        brown: '#2C1F14',
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(44,31,20,0.08)',
        'card-hover': '0 8px 32px rgba(44,31,20,0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
