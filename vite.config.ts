import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), UnoCSS()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'dux',
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: Object.keys(pkg.dependencies),
    },
  },
})
