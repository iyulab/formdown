import { parseFormdown, applyEdits, updateFrontMatter } from '../src/index'

const spanText = (src: string) => parseFormdown(src).forms.map(f => src.slice(f.span!.start, f.span!.end))

describe('Field spans', () => {
    it('cover inline fields', () => {
        expect(spanText('Name: ___@name, age: #___@age*')).toEqual(['___@name', '#___@age*'])
    })

    it('cover inline fields with labels and attributes, including quoted brackets', () => {
        const src = 'A ___@a(Label)[text placeholder="x ] y"] and ___@b{x,y}: s[] end'
        expect(spanText(src)).toEqual(['___@a(Label)[text placeholder="x ] y"]', '___@b{x,y}: s[]'])
    })

    it('cover block fields', () => {
        expect(spanText('intro\n  @email*: @[placeholder="you"]\n@notes: [textarea]'))
            .toEqual(['@email*: @[placeholder="you"]', '@notes: [textarea]'])
    })

    it('stay correct after front matter, CRLF line endings and inline code', () => {
        const src = '---\r\na: 1\r\n---\r\n`___@no` then ___@a\r\n@b: [text]'
        expect(spanText(src)).toEqual(['___@a', '@b: [text]'])
    })

    it('give 1-based line and column', () => {
        const [, b] = parseFormdown('x ___@a\n  @b: [text]').forms
        expect(b.span).toEqual(expect.objectContaining({ line: 2, column: 3 }))
    })

    it('cover fields in tables', () => {
        const src = '| Name | Age |\n|---|---|\n| ___@name | ___@age[number] |'
        expect(spanText(src)).toEqual(['___@name', '___@age[number]'])
    })
})

describe('applyEdits', () => {
    it('returns the source unchanged when there are no edits', () => {
        const src = '---\r\na: 1\r\n---\r\n﻿body ___@a'
        expect(applyEdits(src, [])).toBe(src)
    })

    it('applies non-overlapping edits in any order', () => {
        expect(applyEdits('abcdef', [{ start: 4, end: 5, text: 'E' }, { start: 0, end: 1, text: 'A' }])).toBe('AbcdEf')
    })

    it('rejects overlapping edits', () => {
        expect(() => applyEdits('abcdef', [{ start: 0, end: 3, text: '' }, { start: 2, end: 4, text: '' }])).toThrow(RangeError)
    })
})

describe('updateFrontMatter', () => {
    const body = '\nSymptom: ___@symptom\r\n\r\n```\r\ncode ___@x\r\n```\r\n'

    it('sets values in existing front matter and leaves the body byte-identical', () => {
        const src = '---\n# reported by support\nsymptom: old\nseverity: low # triage\n---' + body
        const out = updateFrontMatter(src, { symptom: 'Freezes on save' })
        expect(out.endsWith('---' + body)).toBe(true)
        expect(out).toContain('# reported by support')
        expect(out).toContain('severity: low # triage')
        expect(parseFormdown(out).frontMatter!.data).toEqual({ symptom: 'Freezes on save', severity: 'low' })
    })

    it('writes values that YAML would otherwise reinterpret as strings', () => {
        const out = updateFrontMatter('---\na: 1\n---\n', { code: '007', flag: 'true', notes: 'line one\nline "two"' })
        expect(parseFormdown(out).frontMatter!.data).toEqual({ a: 1, code: '007', flag: 'true', notes: 'line one\nline "two"' })
    })

    it('removes keys set to undefined', () => {
        const out = updateFrontMatter('---\na: 1\nb: 2\n---\nx', { a: undefined })
        expect(parseFormdown(out).frontMatter!.data).toEqual({ b: 2 })
    })

    it('creates front matter when the document has none, after a byte order mark', () => {
        const src = '﻿Body ___@a\n'
        const out = updateFrontMatter(src, { a: 'value' })
        expect(out).toBe('﻿---\na: value\n---\nBody ___@a\n')
        expect(parseFormdown(out).forms[0].value).toBe('value')
    })

    it('uses the line ending of the document', () => {
        const out = updateFrontMatter('---\r\na: 1\r\n---\r\nBody\r\n', { b: 2 })
        expect(out).toBe('---\r\na: 1\r\nb: 2\r\n---\r\nBody\r\n')
    })

    it('round-trips a filled form', () => {
        const form = '@symptom: [textarea]\n\n@severity: [select options="low,high"]\n'
        const filled = updateFrontMatter(form, { symptom: 'It "froze"\nafter save', severity: 'high' })
        const values = Object.fromEntries(parseFormdown(filled).forms.map(f => [f.name, f.value]))
        expect(values).toEqual({ symptom: 'It "froze"\nafter save', severity: 'high' })
        expect(filled.endsWith(form)).toBe(true)
    })

    it('refuses to rewrite front matter that is not valid YAML', () => {
        expect(() => updateFrontMatter('---\na: [unclosed\n---\n', { a: 1 })).toThrow()
    })
})
