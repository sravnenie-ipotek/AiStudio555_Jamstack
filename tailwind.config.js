/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./shared/components/**/*.{html,js}",
    "./backups/newDesign/**/*.{html,js}",
    "./tests/**/*.{html,js}",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        'nav-bg': '#fff',
        'nav-text': '#333',
        'primary-button': '#ffd659',
        'primary-text': '#05051a',
        'dropdown-bg': 'rgba(5, 5, 26, 0.98)'
      },
      backdropBlur: {
        'menu': '20px'
      }
    },
  },
  plugins: [],
}