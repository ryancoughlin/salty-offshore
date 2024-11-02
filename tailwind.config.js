/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        neutral: {
          50: '#f7f7f6',
          100: '#e5e4e2',
          200: '#cbc8c4',
          300: '#a9a69f',
          400: '#87827a',
          500: '#6c6860',
          600: '#56534b',
          700: '#46443f',
          800: '#3a3935',
          900: '#33312e',
          950: '#21201d',
        },
      },
      fontFamily: {
        sans: ['Spline Sans', 'sans-serif'],
        mono: ['Spline Sans Mono', 'monospace'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
