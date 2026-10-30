import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages sirve el sitio en /Freecation/
  base: '/Freecation/',
  plugins: [react(), tailwindcss()],
})
