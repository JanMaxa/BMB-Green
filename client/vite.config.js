import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy uploaded images to the API server in development
      '/uploads': 'http://localhost:8090',
    },
  },
})
