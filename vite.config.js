import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/gh600-agentic-ai-study-site/',
  build: {
    chunkSizeWarningLimit: 3600
  }
});
