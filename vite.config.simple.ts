import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simplified config without PWA
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})