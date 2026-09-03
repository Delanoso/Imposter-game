import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { setupSocketServer } from './server/socketServer.js'

// Custom Vite plugin to attach socket.io server in development
const socketPlugin = () => ({
  name: 'configure-socket-server',
  configureServer(server: any) {
    if (server.httpServer) {
      setupSocketServer(server.httpServer);
    }
  },
  configurePreviewServer(server: any) {
    if (server.httpServer) {
      setupSocketServer(server.httpServer);
    }
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    socketPlugin(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
})
