/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          green: '#1DB954',
          'green-hover': '#1ed760',
          dark: '#121212',
          black: '#090909',
          card: '#181818',
          hover: '#282828',
          subtext: '#b3b3b3',
          divider: '#282828',
        }
      }
    },
  },
  plugins: [],
}
