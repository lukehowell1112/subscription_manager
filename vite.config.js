import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

console.log('Loaded correct vite.config.js');

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': 'http://localhost:4000',
        },
    },
});