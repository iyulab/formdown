import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'FormdownViewer',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: ['lit'],
            output: {
                globals: {
                    lit: 'Lit'
                }
            }
        }
    }
})
