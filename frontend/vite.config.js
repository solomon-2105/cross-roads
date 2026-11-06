import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In development, requests to /api are forwarded to the FastAPI backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Lets VS Code port-forwarding links (*.devtunnels.ms) reach the dev server.
    allowedHosts: ['.devtunnels.ms'],
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
