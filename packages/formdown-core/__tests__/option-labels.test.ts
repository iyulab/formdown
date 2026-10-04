import { describe, it, expect } from '@jest/globals'
import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'
import { parseOption, parseOptionList, formatOptions, optionLabel } from '../src/options'
import { getSchema } from '../src/index'

const parse = (source: string) => new FormdownParser().parseFormdown(source)
const render = (source: string) => new FormdownGenerator().generateHTML(parse(source))

describe('reading an option', () => {
    it('keeps a value apart from the text shown for it at the first =', () => {
        expect(parseOption('hw=Hardware')).toEqual({ value: 'hw', label: 'Hardware' })
        expect(parseOption(' sw = Software ')).toEqual({ value: 'sw', label: 'Software' })
        expect(parseOption('eq=a=b')).toEqual({ value: 'eq', label: 'a=b' })
    })

    it('reads anything else as a value shown as written', () => {
        expect(parseOption('Senior (6+ years)')).toEqual({ value: 'Senior (6+ years)' })
        expect(parseOption('=Pro')).toEqual({ value: '=Pro' })
        expect(parseOption('Pro=')).toEqual({ value: 'Pro=' })
        expect(parseOption('same=same')).toEqual({ value: 'same' })
    })

    it('shows the label, or the value when there is none', () => {
        expect(optionLabel({ value: 'hw', label: 'Hardware' })).toBe('Hardware')
        expect(optionLabel({ value: 'Low' })).toBe('Low')
    })

    it('reads the other choice beside the options', () => {
        expect(parseOptionList('a=A,b,*(Something else)')).toEqual({
            options: [{ value: 'a', label: 'A' }, { value: 'b' }],
            allowOther: true,
            otherLabel: 'Something else',
        })
        expect(parseOptionList('a,*').otherLabel).toBeUndefined()
    })

    it('writes options back as they are read', () => {
        const written = 'hw=Hardware,Low,eq=a=b'
        expect(formatOptions(parseOptionList(written).options)).toBe(written)
    })
})

describe('writing value=Label in each place options go', () => {
    const expected = [{ value: 'hw', label: 'Hardware' }, { value: 'sw', label: 'Software' }]

    it('in an options attribute', () => {
        expect(parse('@kind: [select options="hw=Hardware,sw=Software"]').forms[0].options).toEqual(expected)
    })

    it('in braces after the name', () => {
        expect(parse('@kind{hw=Hardware,sw=Software}: r[]').forms[0].options).toEqual(expected)
    })

    it('in an inline field', () => {
        expect(parse('Kind: ___@kind{hw=Hardware,sw=Software}: s[]').forms[0].options).toEqual(expected)
    })
})

describe('rendering options with labels', () => {
    it('stores the value and shows the label in a select', () => {
        const html = render('@kind: [select options="hw=Hardware,sw=Software"]')
        expect(html).toContain('<option value="hw">Hardware</option>')
        expect(html).toContain('<option value="sw">Software</option>')
    })

    it('stores the value and shows the label in radios and checkboxes', () => {
        const radio = render('@kind: [radio options="hw=Hardware,sw=Software"]')
        expect(radio).toMatch(/value="hw"[^>]*>\s*<span>Hardware<\/span>/)
        const checkbox = render('@kinds: [checkbox options="hw=Hardware,sw=Software"]')
        expect(checkbox).toMatch(/value="sw"[^>]*>\s*<span>Software<\/span>/)
    })

    it('chooses by value, so a saved value is offered rather than unlisted', () => {
        const html = render('---\nkind: hw\nkinds: hw, sw\n---\n@kind: [select options="hw=Hardware,sw=Software"]\n@kinds: [checkbox options="hw=Hardware,sw=Software"]')
        expect(html).toContain('<option value="hw" selected>Hardware</option>')
        expect(html).not.toContain('data-formdown-unlisted')
        expect(html).toMatch(/value="sw"[^>]* checked/)
    })

    it('still shows a value no option offers, as written', () => {
        const html = render('---\nkind: Hardware\n---\n@kind: [select options="hw=Hardware"]')
        expect(html).toContain('<option value="Hardware" selected data-formdown-unlisted="true">Hardware</option>')
    })
})

describe('the schema of a choice field', () => {
    it('carries the options with their labels and the other choice text', () => {
        const schema = getSchema('@kind: [radio options="hw=Hardware,Low,*(Something else)"]')
        expect(schema.kind.options).toEqual([{ value: 'hw', label: 'Hardware' }, { value: 'Low' }])
        expect(schema.kind.allowOther).toBe(true)
        expect(schema.kind.otherLabel).toBe('Something else')
        expect(schema.kind.htmlAttributes?.['other-label']).toBeUndefined()
    })
})

describe('inline fields with braces', () => {
    it('reads the other choice of an inline choice field', () => {
        const field = parse('Pay by ___@pay{Card,Cash,*(Other way)}: r[]').forms[0]
        expect(field.options).toEqual([{ value: 'Card' }, { value: 'Cash' }])
        expect(field.allowOther).toBe(true)
        expect(field.otherLabel).toBe('Other way')
    })

    it('gives a field one types into a datalist that exists', () => {
        const parsed = parse('City: ___@city{Seoul,Busan}: []')
        const list = parsed.forms[0].attributes?.list
        expect(list).toEqual(expect.any(String))
        expect(parsed.datalistDeclarations?.find(d => d.id === list)?.options).toEqual(['Seoul', 'Busan'])
    })
})
