import tailwindScrollbar from 'tailwind-scrollbar';
import flowbitePlugin from 'flowbite-react/plugin/tailwindcss';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/dist/**/*.{js,mjs}',
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbar, flowbitePlugin],
};
