/** @type {import('tailwindcss').Config} */
export default { // Use 'module.exports =' if you are in a CommonJS environment (e.g. older Create React App)
    content: [
      "./index.html", // Path to your main HTML file
      "./src/**/*.{js,ts,jsx,tsx}", // Path to all your React components and JS/TS files in the src folder
    ],
    theme: {
      extend: {
        // You can extend Tailwind's default theme here
        // For example, adding custom colors, fonts, spacing, etc.
        colors: {
          'brand-blue': '#007bff', // Example custom brand color
          'brand-green': '#28a745',
          'brand-light': '#f8f9fa',
          'brand-dark': '#343a40',
        },
        fontFamily: {
          // The 'sans' key is used by default for Tailwind's sans-serif font stack.
          // By adding 'Inter' here, you make it the primary sans-serif font.
          // Make sure you've imported 'Inter' in your HTML or CSS (e.g., via Google Fonts).
          sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
        },
        // Example: Extending spacing
        // spacing: {
        //   '128': '32rem',
        // }
      },
    },
    plugins: [
      // You can add Tailwind CSS plugins here
      // For example: require('@tailwindcss/forms'), require('@tailwindcss/typography')
      // Make sure to install them first via npm/yarn if you use them.
    ],
  }
  