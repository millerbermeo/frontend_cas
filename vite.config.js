import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,           
    strictPort: true,       
    hmr: {
      host: '10.193.131.11', 
      port: 3001
    }
  },
})
