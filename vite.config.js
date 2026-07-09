import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function excludeReviewsJson() {
  return {
    name: 'exclude-reviews-json',
    closeBundle() {
      const filePath = path.resolve('dist', 'data', 'reviews.json')
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), excludeReviewsJson()],
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:80',
        changeOrigin: true,
      },
    },
  },
})
