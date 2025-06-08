import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    esbuild: {
        jsx: 'transform',
        jsxFactory: 'h',
        jsxFragment: 'Fragment'
    },
    define: {
        global: 'globalThis',
        process: {
            env: {}
        }
    },
    server: {
        fs: {
            allow: ['..', '../..']
        }
    },
    optimizeDeps: {
        exclude: ['@salernoelia/propa']
    },
    plugins: [tailwindcss(),],
})