import { parseFormdown, generateFormHTML, readFrontMatter } from '../src/index'

describe('Front matter', () => {
    const doc = [
        '---',
        'symptom: "Freezes on save"',
        'severity: high',
        'code: "007"',
        'notes: |',
        '  line one',
        '  line "two"',
        'template: bug-report@1',
        '---',
        '',
        'Symptom: ___@symptom',
        '',
        '@severity: [select options="low,high"]',
        '',
        'Code: ___@code, notes: ___@notes[textarea]'
    ].join('\n')

    it('is exposed as data, raw text and a span', () => {
        const { frontMatter } = parseFormdown(doc)
        expect(frontMatter).toBeDefined()
        expect(frontMatter!.data).toEqual({
            symptom: 'Freezes on save',
            severity: 'high',
            code: '007',
            notes: 'line one\nline "two"\n',
            template: 'bug-report@1'
        })
        expect(frontMatter!.raw).toBe(doc.split('\n').slice(1, 8).join('\n'))
        expect(frontMatter!.span).toEqual({ start: 0, end: doc.indexOf('---', 4) + 3, line: 1, column: 1 })
    })

    it('binds values to fields with the same name, keeping strings as strings', () => {
        const values = Object.fromEntries(parseFormdown(doc).forms.map(f => [f.name, f.value]))
        expect(values).toEqual({
            symptom: 'Freezes on save',
            severity: 'high',
            code: '007',
            notes: 'line one\nline "two"\n'
        })
    })

    it('overrides a value written in the field itself', () => {
        const [field] = parseFormdown('---\na: from front matter\n---\n___@a[text value="from field"]').forms
        expect(field.value).toBe('from front matter')
    })

    it('is not part of the markdown and not rendered', () => {
        const result = parseFormdown(doc)
        expect(result.markdown).not.toContain('template: bug-report@1')
        expect(generateFormHTML(doc)).not.toContain('<h2>')
        expect(result.diagnostics).toEqual([])
    })

    it('handles CRLF line endings and a byte order mark', () => {
        const crlf = '﻿---\r\na: 1\r\n---\r\n___@a'
        const result = parseFormdown(crlf)
        expect(result.frontMatter!.data).toEqual({ a: 1 })
        expect(result.forms[0].value).toBe(1)
        expect(result.markdown).not.toContain('---')
    })

    it('accepts "..." as the closing line', () => {
        expect(parseFormdown('---\na: 1\n...\ntext').frontMatter!.data).toEqual({ a: 1 })
    })

    it('reports invalid YAML and keeps the raw text', () => {
        const result = parseFormdown('---\na: [unclosed\n---\n___@a')
        expect(result.frontMatter!.raw).toBe('a: [unclosed')
        expect(result.frontMatter!.data).toEqual({})
        expect(result.diagnostics!.map(d => d.code)).toEqual(['front-matter-invalid-yaml'])
    })

    it('reports front matter that is not a mapping', () => {
        const result = parseFormdown('---\n- a\n- b\n---\ntext')
        expect(result.diagnostics!.map(d => d.code)).toEqual(['front-matter-not-mapping'])
    })

    it('only exists at the very start of the document', () => {
        const result = parseFormdown('Intro\n\n---\na: 1\n---\n')
        expect(result.frontMatter).toBeUndefined()
    })

    it('treats a leading horizontal rule without a closing line as markdown', () => {
        const result = parseFormdown('---\n\nJust a rule above.')
        expect(result.frontMatter).toBeUndefined()
        expect(result.diagnostics).toEqual([])
    })

    it('keeps source line numbers for diagnostics after the front matter', () => {
        const [diagnostic] = parseFormdown('---\na: 1\n---\n@1st: [text]').diagnostics!
        expect(diagnostic.span).toEqual(expect.objectContaining({ line: 4, column: 1 }))
    })
})

describe('readFrontMatter', () => {
    test('reads the front matter alone, the same as a full parse does', () => {
        const source = ['---', 'template: intake@1', '요청: "007"', '---', '# Intake', '', '@요청: [text]', ''].join('\n')
        const read = readFrontMatter(source)
        expect(read?.frontMatter.data).toEqual({ template: 'intake@1', 요청: '007' })
        expect(read?.frontMatter).toEqual(parseFormdown(source).frontMatter)
        expect(read?.lineCount).toBe(4)
        expect(read?.diagnostics).toEqual([])
    })

    test('is null without front matter, and reports YAML it cannot read', () => {
        expect(readFrontMatter('# No front matter\n')).toBeNull()
        const broken = readFrontMatter(['---', '- a list', '---', ''].join('\n'))
        expect(broken?.frontMatter.data).toEqual({})
        expect(broken?.diagnostics.map((d) => d.code)).toEqual(['front-matter-not-mapping'])
    })
})

describe('Code is not parsed for fields', () => {
    it.each([
        ['backtick fence', '```\n___@notafield\n@nope: [text]\n```\n___@real'],
        ['tilde fence', '~~~md\n___@notafield\n~~~\n___@real'],
        ['longer fence closed by a longer run', '````\n```\n___@notafield\n```\n````\n___@real'],
        ['indented fence', '   ```\n___@notafield\n   ```\n___@real'],
        ['inline code span', 'Use `___@notafield` like this: ___@real'],
        ['double-backtick span', 'Use ``a ` ___@notafield`` then ___@real']
    ])('%s', (_label, src) => {
        const result = parseFormdown(src)
        expect(result.forms.map(f => f.name)).toEqual(['real'])
        expect(result.diagnostics).toEqual([])
    })

    it('leaves fenced code untouched in the markdown', () => {
        const src = '```\n___@notafield\n```'
        expect(parseFormdown(src).markdown).toBe(src)
    })

    it('leaves inline code untouched in the markdown', () => {
        expect(parseFormdown('a `___@x` b').markdown).toBe('a `___@x` b')
    })

    it('treats an unclosed fence as running to the end of the document', () => {
        expect(parseFormdown('```\n___@notafield').forms).toEqual([])
    })
})
