/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mainBackground: '#0d1117',
        columnBackground: '#161b22',
      },
    },
  },
  plugins: [],
};
