/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'barclays-blue': '#00a3ef',
        'barclays-blue-dark': '#0088cc',
        'barclays-blue-light': '#33b5f2',
      },
    },
  },
  plugins: [],
};
