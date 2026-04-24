/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
          light: '#3b82f6',
        },
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626',
        operations: '#06b6d4',
        documental: '#8b5cf6',
        ingresos: '#ec4899',
        pendientes: '#f97316',
        proveedores: '#22c55e',
      },
    },
  },
  plugins: [],
}