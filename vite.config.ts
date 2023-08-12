import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import typescript from '@rollup/plugin-typescript'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    typescript({
      target: 'es5',
      rootDir: resolve('src/'),
      declaration: true,
      declarationDir: resolve('dist'),
      exclude: resolve('node_modules/**'),
    }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'dux-ui',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'unocss'],
      output: {
        globals: {
          react: 'react',
          'react-dom': 'react-dom',
        },
      },
    },
  },
})
