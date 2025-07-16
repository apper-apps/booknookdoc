/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B4513",
        secondary: "#D2691E",
        accent: "#FF6B6B",
        surface: "#FFF8DC",
        background: "#FAF0E6",
        success: "#228B22",
        warning: "#FF8C00",
        error: "#DC143C",
        info: "#4682B4",
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'book-spines': "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"20\" height=\"100\" fill=\"%23D2691E\" opacity=\"0.1\"/><rect x=\"25\" width=\"15\" height=\"100\" fill=\"%238B4513\" opacity=\"0.1\"/><rect x=\"45\" width=\"18\" height=\"100\" fill=\"%23FF6B6B\" opacity=\"0.1\"/><rect x=\"68\" width=\"16\" height=\"100\" fill=\"%23D2691E\" opacity=\"0.1\"/><rect x=\"89\" width=\"11\" height=\"100\" fill=\"%238B4513\" opacity=\"0.1\"/></svg>')",
        'page-texture': "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"30\" r=\"0.5\" fill=\"%23D2691E\" opacity=\"0.1\"/><circle cx=\"80\" cy=\"70\" r=\"0.3\" fill=\"%238B4513\" opacity=\"0.1\"/><circle cx=\"50\" cy=\"50\" r=\"0.4\" fill=\"%23D2691E\" opacity=\"0.1\"/></svg>')",
      },
      animation: {
        'page-curl': 'curl 300ms ease-out',
        'bookmark-drop': 'drop 400ms ease-out',
      },
      keyframes: {
        curl: {
          '0%': { transform: 'rotateY(0deg)' },
          '50%': { transform: 'rotateY(-5deg)' },
          '100%': { transform: 'rotateY(0deg)' },
        },
        drop: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0px)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}