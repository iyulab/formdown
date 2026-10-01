import { esbuildPlugin } from '@web/dev-server-esbuild'

// Layout the jsdom tests cannot see — widths, scrolling, what covers what — in a real browser.
export default {
  files: 'browser/**/*.test.ts',
  // One page at a time: only the focused page gets focus and blur, and the focus and layout tests depend on them.
  concurrency: 1,
  nodeResolve: true,
  plugins: [esbuildPlugin({ ts: true, target: 'es2022', tsconfig: 'tsconfig.json' })],
}
