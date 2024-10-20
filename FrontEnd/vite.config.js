import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path' // Asegúrate de importar 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Establece la ruta de alias a la carpeta src
      '@constants': path.resolve(__dirname, './src/constants'), // Establece la ruta de alias a la carpeta src/constants
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  build: {
    globals: true,
    outDir: 'dist', // Especifica el directorio de salida para la construcción
    assetsDir: 'assets', // Especifica el directorio de salida para los activos (relativo al directorio de salida)
    setupFiles: './vite.setup.js',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
  },
  publicDir: 'public', // El directorio publico para servir archivos estáticos - uso para netlify
  
})
