import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: 'src/standalone.ts',
            name: 'FormdownEditor',
            fileName: () => 'standalone.js',
            formats: ['es']
        },
        rollupOptions: {
            output: {
                inlineDynamicImports: true
            }
        },
        outDir: 'dist',
        emptyOutDir: false
    }
})
