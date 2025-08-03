import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'FormdownUI',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: ['lit', '@formdown/core'],
            output: {
                globals: {
                    lit: 'Lit',
                    '@formdown/core': 'FormdownCore'
                }
            }
        }
    }
})