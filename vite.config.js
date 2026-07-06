import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

// Relative base so the built quiz can be hosted from any sub-path.
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    port: 5191,
    open: true
  }
})
