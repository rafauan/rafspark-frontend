/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: [
    // require('@tailwindcss/typography'),
    require('@tailwindcss/forms')
    // require('@tailwindcss/aspect-ratio'),
    // require('@tailwindcss/container-queries')
  ]
}
