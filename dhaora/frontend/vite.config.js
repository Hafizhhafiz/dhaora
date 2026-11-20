import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5173',
        changeOrigin: true,
      },
      '/static': {
        target: 'http://127.0.0.1:5173',
        changeOrigin: true,
      },
      '/datasets': {
        target: 'http://127.0.0.1:5173',
        changeOrigin: true,
      }
    }
  }
})
