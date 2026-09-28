import { parseFormdown, generateFormHTML } from '../src/index'
import { ExtensionManager, getDefaultExtensionManager } from '../src/extensions/extension-manager'
import type { Hook } from '../src/extensions/types'

/** The rendered element for one inline field. */
function inlineField(html: string, name: string): string {
    const match = html.match(new RegExp(`<span[^>]*data-field-name="${name}"[^>]*>[^<]*</span>`))
    if (!match) throw new Error(`no inline field "${name}" in:\n${html}`)
    return match[0]
}

describe('Inline field rendering', () => {
    it('shows a value bound from front matter, escaped', () => {
        const html = generateFormHTML('---\ntitle: "Save <fails> & \\"hangs\\""\n---\n**Title**: ___@title')
        expect(inlineField(html, 'title')).toMatch(/>Save &lt;fails&gt; &amp; &quot;hangs&quot;<\/span>$/)
    })

    it('shows a value written in the field itself', () => {
        const html = generateFormHTML('Name: ___@name[text value="Ada"]')
        expect(inlineField(html, 'name')).toMatch(/>Ada<\/span>$/)
    })

    it('shows the label when there is no value', () => {
        const html = generateFormHTML('Name: ___@full_name')
        expect(inlineField(html, 'full_name')).toMatch(/data-placeholder="Full Name"/)
        expect(inlineField(html, 'full_name')).toMatch(/>Full Name<\/span>$/)
    })

    it('shows bound values in table cells', () => {
        const html = generateFormHTML('---\nos: Windows 11\n---\n| Item | Value |\n|---|---|\n| OS | ___@os |')
        expect(inlineField(html, 'os')).toMatch(/>Windows 11<\/span>$/)
    })

    it('keeps several inline fields on one line in place', () => {
        const html = generateFormHTML('---\nb: 42\n---\nA ___@a then #___@b and ___@c[text value="three"]')
        const order = ['a', 'b', 'c'].map(name => html.indexOf(`data-field-name="${name}"`))
        expect(order.every(i => i >= 0)).toBe(true)
        expect(order).toEqual([...order].sort((x, y) => x - y))
        expect(inlineField(html, 'b')).toMatch(/>42<\/span>$/)
        expect(inlineField(html, 'c')).toMatch(/>three<\/span>$/)
    })

    it('does not leave field markup in the parsed markdown', () => {
        const { markdown } = parseFormdown('Name: ___@name')
        expect(markdown).not.toContain('<span')
    })

    describe('with hooks', () => {
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

        it('field-render can change the markup of an inline field', () => {
            add({ name: 'field-render', priority: 1, handler: (ctx, html: string) => html.replace('<span', `<span data-hooked="${ctx.field!.name}"`) })
            expect(generateFormHTML('Name: ___@name')).toContain('data-hooked="name"')
        })
    })
})
