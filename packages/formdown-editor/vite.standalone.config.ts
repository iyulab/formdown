import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/standalone.ts',
            name: 'FormdownEditor',
            fileName: () => 'standalone.js',
            formats: ['es']
        },
        rolldownOptions: {
            output: {
                codeSplitting: false,
                format: 'es'
            }
        },
        outDir: 'dist',
        emptyOutDir: false,
        minify: false,
        sourcemap: true
    }
})
