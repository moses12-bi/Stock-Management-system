import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      clientPort: 3000
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['react-hot-toast', 'web-vitals', 'yup', 'react-hook-form', '@hookform/resolvers', './Components/SupplierTable/SupplierTable', '@mui/x-data-grid', '@mui/material', '@emotion/react', '@emotion/styled']
  },
  build: {
    manifest: true
  }
});