import { parseFormdown, generateFormHTML } from '../src/index'
import { ExtensionManager, getDefaultExtensionManager } from '../src/extensions/extension-manager'
import type { Hook } from '../src/extensions/types'

describe('Hook pipeline', () => {
    let manager: ExtensionManager
    const added: Hook[] = []
    const add = (hook: Hook) => { manager.registerHook(hook); added.push(hook) }

    beforeAll(async () => {
        manager = getDefaultExtensionManager()
        await manager.initialize()
    })

    afterEach(() => {
        for (const hook of added.splice(0)) manager.unregisterHook(hook.name, hook.handler)
    })

    it('pre-parse can rewrite the source before parsing', () => {
        add({ name: 'pre-parse', priority: 1, handler: (_ctx, source: string) => source.replace('{{who}}', '___@who') })
        expect(parseFormdown('Name: {{who}}').forms.map(f => f.name)).toEqual(['who'])
    })

    it('field-parse sees each field with its source text and can replace it', () => {
        const seen: string[] = []
        add({
            name: 'field-parse',
            priority: 1,
            handler: (ctx, field) => {
                seen.push(ctx.input!)
                return field.name === 'b' ? { ...field, label: 'Custom' } : undefined
            }
        })
        const result = parseFormdown('___@a and @b: [text]'.replace(' and ', '\n'))
        expect(seen).toEqual(['___@a', '@b: [text]'])
        expect(result.forms[1].label).toBe('Custom')
    })

    it('post-parse can change the result', () => {
        add({ name: 'post-parse', priority: 1, handler: (_ctx, content) => ({ ...content, forms: content.forms.filter((f: { name: string }) => f.name !== 'hidden') }) })
        expect(parseFormdown('___@a ___@hidden').forms.map(f => f.name)).toEqual(['a'])
    })

    it('runs hooks in priority order, each receiving the previous result', () => {
        add({ name: 'pre-parse', priority: 1, handler: (_ctx, s: string) => s + 'b' })
        add({ name: 'pre-parse', priority: 10, handler: (_ctx, s: string) => s + 'a' })
        add({ name: 'post-parse', priority: 1, handler: (ctx, content) => ({ ...content, markdown: ctx.input }) })
        expect(parseFormdown('x').markdown).toBe('xab')
    })

    it('reports a failing hook as a diagnostic and keeps parsing', () => {
        add({ name: 'field-parse', priority: 1, handler: () => { throw new Error('boom') } })
        const result = parseFormdown('___@a')
        expect(result.forms.map(f => f.name)).toEqual(['a'])
        expect(result.diagnostics).toEqual([expect.objectContaining({ code: 'hook-error', severity: 'error' })])
        expect(result.diagnostics![0].message).toContain('boom')
    })

    it('reports an async hook used during parsing', () => {
        add({ name: 'pre-parse', priority: 1, handler: async (_ctx, s: string) => s })
        expect(parseFormdown('x').diagnostics!.map(d => d.code)).toEqual(['hook-error'])
    })

    it('field-render can change the markup of a block field', () => {
        add({ name: 'field-render', priority: 1, handler: (ctx, html: string) => html.replace('<input', `<input data-hooked="${ctx.field!.name}"`) })
        expect(generateFormHTML('@email: [email]')).toContain('data-hooked="email"')
    })

    it('pre-generate and post-generate wrap generation', () => {
        add({ name: 'pre-generate', priority: 1, handler: (_ctx, content) => ({ ...content, markdown: content.markdown + '\n\nAdded.' }) })
        add({ name: 'post-generate', priority: 1, handler: (_ctx, html: string) => `<div class="wrapped">${html}</div>` })
        const html = generateFormHTML('Text')
        expect(html.startsWith('<div class="wrapped">')).toBe(true)
        expect(html).toContain('Added.')
    })

    it('reports a hook that returns a different kind of value, and keeps the value it was given', () => {
        // A handler written as (context) => context hands back the context object in place of the source.
        add({ name: 'pre-parse', priority: 1, handler: (ctx) => ctx })
        add({ name: 'post-parse', priority: 1, handler: () => 'not a result' })
        const result = parseFormdown('___@a')
        expect(result.forms.map(f => f.name)).toEqual(['a'])
        expect(result.diagnostics!.map(d => d.code)).toEqual(['hook-error', 'hook-error'])
        expect(result.diagnostics![0].message).toContain('returned an object where a string was expected')
    })

    it('passes values through unchanged before the extension system is initialized', () => {
        expect(new ExtensionManager().transformSync('pre-parse', {}, 'x')).toBe('x')
    })
})
