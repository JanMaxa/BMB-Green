import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In development the API and uploaded files come from the Node server (`npm start` in server/)
      '/api': 'http://localhost:8090',
      '/uploads': 'http://localhost:8090',
    },
  },
})
