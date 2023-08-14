import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { buildPlugin } from 'vite-plugin-build'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
    buildPlugin({
      fileBuild: {
        emitDeclaration: true,
      },
      libBuild: {
        buildOptions: {
          rollupOptions: {
            external: ['react'],
            output: { globals: { react: 'React' } },
          },
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'RbacComponents',
            fileName: (format) => `rbac-components.${format}.js`,
          },
        },
      },
      
    }),
  ],
})
