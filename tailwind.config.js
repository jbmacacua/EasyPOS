/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", // Covers all subdirectories inside `app`
    "./components/**/*.{js,jsx,ts,tsx}", // Ensures components are included
  ],
  presets: [require("nativewind/preset")], // Ensures NativeWind works
  theme: {
    extend: {}, // Custom theme extensions can be added here
  },
  plugins: [], // Add plugins if necessary
};
