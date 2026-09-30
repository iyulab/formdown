import { esbuildPlugin } from '@web/dev-server-esbuild'

// Layout the jsdom tests cannot see — widths, scrolling, what covers what — in a real browser.
export default {
  files: 'browser/**/*.test.ts',
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true, target: 'es2022', tsconfig: 'tsconfig.json' })],
}
