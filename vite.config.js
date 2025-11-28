import { defineConfig } from 'vite';

export default defineConfig({
    root: 'frontend',
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        outDir: '../dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: 'frontend/index.html',
                tug: 'frontend/games/tug-of-war.html',
                reaction: 'frontend/games/reaction-test.html'
            }
        }
    },
});
