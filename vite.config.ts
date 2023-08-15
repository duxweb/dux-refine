import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { buildPlugin } from 'vite-plugin-build'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    buildPlugin({
      fileBuild: {
        emitDeclaration: true,
        esOutputDir: 'dist',
        commonJsOutputDir: false,
      },
    }),
  ],
})
