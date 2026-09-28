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
