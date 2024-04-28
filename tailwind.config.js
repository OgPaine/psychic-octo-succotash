module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // paths to all of your components
  ],
  theme: {
    extend: {
      colors: {
        'menu-blue': '#062d40',
        'hover-teal': '#02c4ab',
        'custom-white': '#ffffff',
      },
      backgroundImage: {
        'cir': "url('./assets/3920.jpg)",
      },
      spacing: {
        '5px': '5px',
      },
      borderRadius: {
        'menu': '5px',
      },
      boxShadow: {
        'menu': '0 2px 5px rgba(0, 0, 0, 0.2)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
