/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F52BA', // African blue
        secondary: '#FFA500', // Orange
        accent: '#228B22', // Forest green
        dark: '#1A1A1A',
        light: '#F5F5F5',
      },
      backgroundColor: {
        dark: '#121212',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
