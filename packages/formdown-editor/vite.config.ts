import { defineConfig } from 'vite'

// Every import path of a dependency stays outside the bundle — `lit/decorators.js` as well as `lit`.
const external = [/^lit(\/|$)/, /^@lit\//, /^@formdown\/(core|ui)(\/|$)/]

export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
            name: 'FormdownEditor',
            fileName: (format) => `index.${format}.js`,
            formats: ['es', 'umd']
        },
        rolldownOptions: {
            external,
            output: {
                globals: (id) =>
                    id.startsWith('@formdown/core') ? 'FormdownCore' : id.startsWith('@formdown/ui') ? 'FormdownUI' : 'Lit'
            }
        }
    }
})
