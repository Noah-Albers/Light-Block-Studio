// Plugins
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// Utilities
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    vue({ 
      template: { transformAssetUrls }
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  build: {
    outDir: "../Distribute/webapp/"
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      //'@': fileURLToPath(new URL('./src', import.meta.url)),
      '@webapp': fileURLToPath(new URL('./src/webapp', import.meta.url)),
      "@cppgen": fileURLToPath(new URL('./src/cppgenerator', import.meta.url)),
      "@test": fileURLToPath(new URL('./src/test', import.meta.url)),
      "@procedure": fileURLToPath(new URL('./src/procedure', import.meta.url)),
      "@visualizer": fileURLToPath(new URL('./src/visualizer', import.meta.url)),
      "@mathSolver": fileURLToPath(new URL('./src/mathSolver', import.meta.url)),
      "@nodes": fileURLToPath(new URL('./src/nodes', import.meta.url)),
      "@registry": fileURLToPath(new URL('./src/registry', import.meta.url)),
      "@utils": fileURLToPath(new URL('./src/jsutils', import.meta.url)),
      "@template": fileURLToPath(new URL('./src/template', import.meta.url)),
      "@localisation": fileURLToPath(new URL('./src/localisation', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
})
