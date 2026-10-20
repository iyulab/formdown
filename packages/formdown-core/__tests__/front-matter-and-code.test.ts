import { parseFormdown, generateFormHTML, readFrontMatter, getSchema, FormManager } from '../src/index'
import { FormdownParser } from '../src/parser'
import { yamlFrontMatter } from '../src/front-matter'

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

describe('Front matter readers', () => {
    const doc = '---\nseverity: high\n---\n\n@severity: [select options="low,high"]\n@note: [text]'

    it('a parser without a reader keeps the block out of the fields and says its values were not read', () => {
        const result = new FormdownParser().parseFormdown(doc)
        expect(result.forms.map(f => f.name)).toEqual(['severity', 'note'])
        expect(result.forms[0].value).toBeUndefined()
        expect(result.frontMatter).toMatchObject({ data: {}, raw: 'severity: high' })
        expect(result.diagnostics).toEqual([expect.objectContaining({ code: 'front-matter-unread', severity: 'warning' })])
    })

    it('says nothing when the block is empty or there is none', () => {
        expect(new FormdownParser().parseFormdown('---\n---\n@a: [text]').diagnostics).toEqual([])
        expect(new FormdownParser().parseFormdown('@a: [text]').diagnostics).toEqual([])
    })

    it('a parser given yamlFrontMatter reads the values as parseFormdown does', () => {
        const result = new FormdownParser({ frontMatter: yamlFrontMatter }).parseFormdown(doc)
        expect(result.forms[0].value).toBe('high')
        expect(result).toEqual(parseFormdown(doc))
    })

    it('a parser can be given another reader', () => {
        const result = new FormdownParser({ frontMatter: () => ({ data: { severity: 'low' }, diagnostics: [] }) }).parseFormdown(doc)
        expect(result.forms[0].value).toBe('low')
    })

    it('reports invalid YAML from the standard reader', () => {
        const result = new FormdownParser({ frontMatter: yamlFrontMatter }).parseFormdown('---\na: [\n---\n@a: [text]')
        expect(result.diagnostics?.map(d => d.code)).toEqual(['front-matter-invalid-yaml'])
    })

    it('getSchema takes parsed content without parsing it again, and FormManager reads front matter', () => {
        expect(getSchema(parseFormdown(doc))).toEqual(getSchema(doc))
        const manager = new FormManager()
        manager.parse(doc)
        expect(manager.getSchema()?.severity.value).toBe('high')
    })
})
