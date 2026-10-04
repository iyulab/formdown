import { parseFormdown } from '../src/index'

const names = (src: string) => parseFormdown(src).forms.map(f => f.name)
const codes = (src: string) => parseFormdown(src).diagnostics!.map(d => d.code)

describe('Field names', () => {
    describe('Unicode letters are valid name characters', () => {
        it.each([
            ['inline', '증상: ___@증상', ['증상']],
            ['inline with attributes', '심각도: ___@심각도[select options="낮음,높음"]', ['심각도']],
            ['inline with label', '___@증상(증상 설명)', ['증상']],
            ['block', '@증상: [text]', ['증상']],
            ['block with label', '@증상(증상): [textarea]', ['증상']],
            ['block shorthand', '@이메일*: @[]', ['이메일']],
            ['mixed scripts and digits', '___@ｆｉｅｌｄ_2 ___@naïve ___@名前', ['ｆｉｅｌｄ_2', 'naïve', '名前']]
        ])('%s', (_label, src, expected) => {
            expect(names(src)).toEqual(expected)
        })

        it('keeps the name as the default label when it is not ASCII', () => {
            const [field] = parseFormdown('___@증상').forms
            expect(field.label).toBe('증상')
        })

        it('still formats ASCII names into labels', () => {
            const [field] = parseFormdown('___@first_name').forms
            expect(field.label).toBe('First Name')
        })

        it('turns underscores into spaces in any script', () => {
            const [field] = parseFormdown('@재현_절차: [textarea]').forms
            expect(field.label).toBe('재현 절차')
        })

        it('capitalizes letters that have case, whatever the script', () => {
            const [field] = parseFormdown('___@naïve').forms
            expect(field.label).toBe('Naïve')
        })
    })

    describe('duplicate names', () => {
        it('keeps both inline occurrences and reports the duplicate', () => {
            const result = parseFormdown('___@a and ___@a')
            expect(result.forms.map(f => f.name)).toEqual(['a', 'a'])
            expect(result.diagnostics!.map(d => d.code)).toEqual(['duplicate-field-name'])
        })

        it('reports a duplicate across block and inline fields', () => {
            expect(codes('@a: [text]\n\nsee ___@a')).toEqual(['duplicate-field-name'])
        })

        it('names the field and points at each later occurrence', () => {
            const source = '@a: [text]\n\nsee ___@a and\n@b: [text]\n@b: [select options="x,y"]'
            const duplicates = parseFormdown(source).diagnostics!.filter(d => d.code === 'duplicate-field-name')
            expect(duplicates.map(d => d.field)).toEqual(['a', 'b'])
            expect(duplicates.map(d => d.span)).toEqual([
                { start: 16, end: 21, line: 3, column: 5 },
                { start: 37, end: 63, line: 5, column: 1 },
            ])
            expect(source.slice(duplicates[0].span!.start, duplicates[0].span!.end)).toBe('___@a')
        })
    })
})

describe('Diagnostics', () => {
    it('is always present, empty for a clean document', () => {
        expect(parseFormdown('Name: ___@name').diagnostics).toEqual([])
    })

    it('reports a block field whose name starts with a digit', () => {
        const result = parseFormdown('@1st: [text]')
        expect(result.forms).toEqual([])
        expect(result.diagnostics).toEqual([
            expect.objectContaining({ code: 'invalid-field-name', severity: 'error' })
        ])
    })

    it('reports unterminated attribute brackets on an inline field', () => {
        expect(codes('___@a[text value="x"')).toEqual(['unterminated-attributes'])
    })

    it('points at the offending line and column', () => {
        const [diagnostic] = parseFormdown('first line\n  @1st: [text]').diagnostics!
        expect(diagnostic.span).toEqual(expect.objectContaining({ line: 2, column: 3 }))
    })
})

describe('a line that looks like a field but is not read as one', () => {
    it('is reported instead of becoming text without a word', () => {
        const parsed = parseFormdown('@browser: r{Chrome,Firefox,*}[]')
        expect(parsed.forms).toEqual([])
        const [d] = parsed.diagnostics!
        expect(d).toMatchObject({ code: 'unrecognized-field', severity: 'warning', field: 'browser' })
        expect(d.message).toContain('@browser{…}: r[]')
        expect(d.span).toMatchObject({ line: 1, column: 1 })
    })

    it('names what was not read without the braces hint when there are none', () => {
        const [d] = parseFormdown('@size: zz[]').diagnostics!
        expect(d).toMatchObject({ code: 'unrecognized-field', field: 'size' })
        expect(d.message).not.toContain('braces')
    })

    it('is not said of fields that are read, or of lines with another problem', () => {
        expect(codes('@browser{Chrome,Firefox,*}: r[]\n@plan: [radio options="a,b"]\n@kind*: s[options="a"]')).toEqual([])
        expect(codes('@1st: [text]')).toEqual(['invalid-field-name'])
        expect(codes('@open: [text placeholder="x"')).not.toContain('unrecognized-field')
    })
})
