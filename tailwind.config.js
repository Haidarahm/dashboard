/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	   extend: {
      colors: {
        primary: {
          DEFAULT: '#2e84fb',
          light: '#5aa1fd',
          dark: '#1b63c7',
        },
        gray: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        black: {
          DEFAULT: '#000000',
          light: '#1a1a1a',
          soft: '#0f0f0f',
        },
        error: {
          DEFAULT: '#ef4444',
          light: '#f87171',
          dark: '#b91c1c',
        },
      },
    },
  },
}
