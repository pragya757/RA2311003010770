import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy all /eval-api/* calls through Vite to bypass browser CORS restrictions
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/eval-api': {
        target: 'http://20.207.122.201',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/eval-api/, '/evaluation-service'),
      },
    },
  },
})
