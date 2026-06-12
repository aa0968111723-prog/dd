import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 以 preact/compat 取代 react，縮小產出體積（API 相容）
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
})
