import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Change from 3000 to 5173 (Vite's default)
    host: true, // Listen on all addresses
    open: true // Open browser automatically
  }
})