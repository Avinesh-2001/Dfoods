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
          DEFAULT: '#E67E22',
          dark: '#D35400',
        },
        secondary: {
          DEFAULT: '#8B4513',
          light: '#C0392B',
        },
        accent: {
          DEFAULT: '#FDF6E3',
        },
      },
      fontFamily: {
        sans: ['Inter', 'fallback-inter_semi_bold', 'Arial', 'sans-serif'],
        display: ['Inter', 'fallback-inter_semi_bold', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

