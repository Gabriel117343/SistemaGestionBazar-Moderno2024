import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path' // Asegúrate de importar 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Establece la ruta de alias a la carpeta src
    }
  },
  build: {
    outDir: 'dist', // Especifica el directorio de salida para la construcción
    assetsDir: 'assets', // Especifica el directorio de salida para los activos (relativo al directorio de salida)
  }
  
})
