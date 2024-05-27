import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  
  //   port: 3001,           
  //   strictPort: true,       
  //   hmr: {
  //     host: '192.168.1.105', 
  //     port: 3001
  //   }
  },
})
