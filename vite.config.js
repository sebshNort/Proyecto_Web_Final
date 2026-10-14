import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {

    port: 5173,
    proxy:{

      '/Usuario': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },

      '/Apuesta': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },

      '/Historial': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },

    },

  },
});
