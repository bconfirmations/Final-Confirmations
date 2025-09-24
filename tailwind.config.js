/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#00a3ef',
        'primary-blue-dark': '#0088cc',
        'primary-blue-light': '#33b5f2',
      },
    },
  },
  plugins: [],
};
