import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // 关键：端口必须固定为 10011，用于浏览器插件通信
    port: 10011,
    host: '0.0.0.0',
    strictPort: true,
    hmr: {
      host: 'localhost',
      port: 10011
    }
  }
})
