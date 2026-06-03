import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Relative base so the built quiz can be hosted from any sub-path (e.g. GitHub Pages).
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    port: 5180,
    open: true
  }
})
