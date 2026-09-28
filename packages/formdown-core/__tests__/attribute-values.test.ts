import { parseFormdown, generateFormHTML } from '../src/index'

const field = (src: string) => {
    const result = parseFormdown(src)
    expect(result.diagnostics).toEqual([])
    expect(result.forms).toHaveLength(1)
    return result.forms[0]
}
const codes = (src: string) => parseFormdown(src).diagnostics!.map(d => d.code)

describe('Attribute values', () => {
    describe.each([
        ['inline', (attrs: string) => `___@f[${attrs}]`],
        ['block', (attrs: string) => `@f: [${attrs}]`],
        ['inline shorthand', (attrs: string) => `@___@f[${attrs}]`],
        ['block shorthand', (attrs: string) => `@f*: [${attrs}]`]
    ])('%s syntax', (_label, make) => {
        it('keeps escaped double quotes inside a double-quoted value', () => {
            expect(field(make('text value="He said \\"stop\\" twice"')).value).toBe('He said "stop" twice')
        })

        it('keeps a closing bracket inside a quoted value', () => {
            expect(field(make('text placeholder="a ] b"')).placeholder).toBe('a ] b')
        })

        it('keeps quoted values as strings', () => {
            const f = field(make('text data-code="007" data-flag="true" data-n="1.50"'))
            expect(f.attributes).toEqual(expect.objectContaining({ 'data-code': '007', 'data-flag': 'true', 'data-n': '1.50' }))
        })

        it('interprets unquoted numbers and booleans', () => {
            const f = field(make('text data-n=7 data-flag=false'))
            expect(f.attributes).toEqual(expect.objectContaining({ 'data-n': 7, 'data-flag': false }))
        })

        it('keeps an empty quoted value', () => {
            expect(field(make('text placeholder=""')).placeholder).toBe('')
        })

        it('keeps a backslash that escapes a backslash', () => {
            expect(field(make('text value="C:\\\\temp"')).value).toBe('C:\\temp')
        })

        it('keeps attributes with names outside [A-Za-z0-9-]', () => {
            const f = field(make('text x:note="kept" data.v="1"'))
            expect(f.attributes).toEqual(expect.objectContaining({ 'x:note': 'kept', 'data.v': '1' }))
        })
    })

    it('keeps numeric HTML attributes numeric', () => {
        const f = field('@age: [number min=0 max=120 step=1]')
        expect(f.attributes).toEqual(expect.objectContaining({ min: 0, max: 120, step: 1 }))
    })

    it('keeps single-quoted values with double quotes inside', () => {
        expect(field(`___@m[text value='He said "stop"']`).value).toBe('He said "stop"')
    })
})

describe('Rendered attributes', () => {
    const input = (src: string) => generateFormHTML(src).match(/<input[^>]*>/)![0]

    it('renders quoted "true"/"false" and leading zeros verbatim', () => {
        const html = input('@a: [text spellcheck="false" aria-hidden="true" data-code="007"]')
        expect(html).toContain('spellcheck="false"')
        expect(html).toContain('aria-hidden="true"')
        expect(html).toContain('data-code="007"')
    })

    it('escapes quotes in rendered values', () => {
        expect(input('@m: [text value="He said \\"stop\\""]')).toContain('value="He said &quot;stop&quot;"')
    })

    it('cannot break out of an attribute with a front matter value', () => {
        const html = input('---\nm: \'"><b onclick=x>hi</b>\'\n---\n@m: [text]')
        expect(html).toContain('value="&quot;&gt;&lt;b onclick=x&gt;hi&lt;/b&gt;"')
    })

    it('keeps a single backslash in a pattern', () => {
        expect(field('@zip: [text pattern="\\d{5}"]').pattern).toBe('\\d{5}')
    })
})

describe('Attribute diagnostics', () => {
    it.each([
        ['inline', '___@f[text value="x"'],
        ['block', '@f: [text value="x"'],
        ['block shorthand', '@f*: [text']
    ])('reports unterminated brackets (%s)', (_label, src) => {
        expect(codes(src)).toEqual(['unterminated-attributes'])
    })

    it.each([
        ['inline', '___@f[text value="x]'],
        ['block', '@f: [text value="line one]']
    ])('reports an unterminated quoted value (%s)', (_label, src) => {
        expect(codes(src)).toEqual(['unterminated-quoted-value'])
    })
})
