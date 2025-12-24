import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // target: 'http://localhost:8123',
        target: 'https://image-sharing-backend-mzr-eradcrcdedctbqbr.uksouth-01.azurewebsites.net',
        changeOrigin: true
      }
    }
  }
})

