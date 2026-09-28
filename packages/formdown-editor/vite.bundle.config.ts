import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/standalone.ts',
            name: 'FormdownEditor',
            fileName: () => 'formdown-editor.bundle.js',
            formats: ['iife']
        },
        rolldownOptions: {
            output: {
                codeSplitting: false,
                format: 'iife'
            },
            external: [],  // Include all dependencies in bundle
            treeshake: false  // Keep all imports
        },
        outDir: 'dist/bundle',
        emptyOutDir: true,
        minify: false,
        sourcemap: false
    }
})
