import { generateFormHTML, FormManager } from '../src/index'

const body = [
    '# Request',
    '',
    'Read <a href="https://example.com/" target="_blank">the policy</a> first.',
    '',
    '<div style="position: fixed; inset: 0">Fake dialog</div>',
    '',
    '[Open](javascript:alert(1)) · [Mail](mailto:desk@example.com) · ![logo](data:image/svg+xml,x)',
    '',
    'Name: ___@name',
    '',
    '@team: [select options="Network,Facilities"]',
].join('\n')

describe('HTML written in the body', () => {
    it('is rendered as written by default', () => {
        const html = generateFormHTML(body)
        expect(html).toContain('<a href="https://example.com/" target="_blank">the policy</a>')
        expect(html).toContain('<div style="position: fixed; inset: 0">Fake dialog</div>')
        expect(html).toContain('href="javascript:alert(1)"')
    })

    describe('escaped', () => {
        const html = generateFormHTML(body, { html: 'escape' })

        it('is shown as text, inline and in a block of its own', () => {
            expect(html).toContain('Read &lt;a href=&quot;https://example.com/&quot; target=&quot;_blank&quot;&gt;the policy&lt;/a&gt; first.')
            expect(html).toContain('<p>&lt;div style=&quot;position: fixed; inset: 0&quot;&gt;Fake dialog&lt;/div&gt;</p>')
            expect(html).not.toMatch(/<a href="https:\/\/example\.com\/"|<div style=/)
        })

        it('keeps a Markdown link to the web or to mail, and drops the link of one to a script or data', () => {
            expect(html).toContain('<a href="mailto:desk@example.com">Mail</a>')
            expect(html).not.toContain('javascript:')
            expect(html).not.toContain('data:image')
            expect(html).toContain('Open')
            expect(html).toContain('logo')
        })

        it('still generates the fields where they were written', () => {
            expect(html).toMatch(/<span[^>]*data-field-name="name"/)
            expect(html).toMatch(/<select[^>]*name="team"/)
            expect(html).not.toContain('FORMDOWN_FIELD')
            expect(html).not.toContain('&lt;!--')
        })

        it('is what a form manager asked to escape renders', () => {
            const manager = new FormManager({ html: 'escape' })
            manager.parse(body)
            expect(manager.render()).toBe(html)
        })
    })
})
