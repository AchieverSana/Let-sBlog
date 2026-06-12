import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  plugins: [react()],
  optimizeDeps: {
    // react-quill accesses `document` during module init, which breaks
    // Vite's Node.js pre-bundling step and causes a white screen in production.
    exclude: ['react-quill'],
  },
});
