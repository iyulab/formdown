import { defineConfig } from 'vite'

// Every import path of a dependency stays outside the bundle — `lit/decorators.js` as well as `lit` —
// so the consumer's copy is the one that runs (and its `node` export condition applies outside a browser).
const external = [/^lit(\/|$)/, /^@lit\//, /^@formdown\/core(\/|$)/]

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'FormdownUI',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'umd']
        },
        rolldownOptions: {
            external,
            output: {
                globals: (id) => (id.startsWith('@formdown/core') ? 'FormdownCore' : 'Lit')
            }
        }
    }
})
