import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'FormdownEditor',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'umd']
        },
        rolldownOptions: {
            external: ['lit'],
            output: {
                globals: {
                    lit: 'Lit'
                }
            }
        }
    }
})
