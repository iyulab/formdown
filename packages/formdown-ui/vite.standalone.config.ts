import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/standalone.ts',
            name: 'FormdownUI',
            fileName: () => 'standalone.js',
            formats: ['es']
        },
        rolldownOptions: {
            output: {
                codeSplitting: false
            }
        },
        outDir: 'dist',
        emptyOutDir: false
    }
})
