/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust this path to match your project structure
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#333333",
        accent: "#EE8220",
        hover: "#3366FF",
        heading: "#002147",
        muted: "#f9fafb",
      },
      fontFamily: {
        sans: ['Whitney', 'Calibri', 'sans-serif'],
        heading: ['Whitney', 'Calibri', 'sans-serif'],
        body: ['Whitney', 'Calibri', 'sans-serif'],
      },      
      spacing: {
        section: "5rem",
        container: "1.5rem",
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        md: "0.5rem",
      },
    },
  },
  plugins: [],
};
