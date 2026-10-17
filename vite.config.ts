import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// Relative base so the same build works on a custom domain,
// on <user>.github.io, and on <user>.github.io/<repo>/ (routing is hash-based).
export default defineConfig({
  base: './',
  plugins: [vue()],
})
