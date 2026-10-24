import { describe, it, expect } from '@jest/globals'
import { parseFormdown, generateFormHTML, getSchema, formatField, formatFormdown } from '../src/index'

const FORM = [
    '@customer: [text suggest:evidence=false]',
    '@handler: [select options="kim,lee,park" suggest:role=judged suggest:policy=confirm suggest:must-catch="lee, park"]',
    '@code: [text suggest:role=judged suggest:coarse=2 suggest:parent=handler]',
    '@note: [textarea suggest:role=observed]'
].join('\n')

describe('suggest: attributes', () => {
    it('are read into the field, checked', () => {
        const { forms, diagnostics } = parseFormdown(FORM)
        expect(diagnostics).toEqual([])
        expect(forms.map(f => f.suggest)).toEqual([
            { evidence: false },
            { role: 'judged', policy: 'confirm', mustCatch: ['lee', 'park'] },
            { role: 'judged', coarse: 2, parent: 'handler' },
            { role: 'observed' }
        ])
    })

    it('are never drawn on the page — a role= there would be read as the element\'s ARIA role', () => {
        const html = generateFormHTML(FORM)
        expect(html).not.toContain('suggest:')
        expect(html.match(/<select[^>]*>/)![0]).not.toMatch(/\brole=/)
    })

    it('leave the field\'s other attributes as they were', () => {
        const [field] = parseFormdown('@code: [text maxlength=8 suggest:role=judged data-x="y"]').forms
        expect(field.attributes).toEqual({ maxlength: 8, 'data-x': 'y', form: 'formdown-form-default' })
    })

    it('are carried in the schema and not among its HTML attributes', () => {
        const schema = getSchema(FORM)
        expect(schema.handler.suggest).toEqual({ role: 'judged', policy: 'confirm', mustCatch: ['lee', 'park'] })
        expect(schema.customer.suggest).toEqual({ evidence: false })
        expect(schema.handler.htmlAttributes ?? {}).not.toHaveProperty('suggest:role')
        expect(schema.customer.htmlAttributes ?? {}).not.toHaveProperty('suggest:evidence')
    })

    it('are written back so that parsing gives the same field', () => {
        const fields = parseFormdown(FORM).forms
        const again = parseFormdown(formatFormdown(fields))
        expect(again.diagnostics).toEqual([])
        expect(again.forms.map(f => f.suggest)).toEqual(fields.map(f => f.suggest))
        expect(formatField(fields[1])).toBe('@handler: [select options="kim,lee,park" suggest:role="judged" suggest:policy="confirm" suggest:must-catch="lee, park"]')
    })

    it('report a name formdown does not know and a value it cannot read, and leave them out', () => {
        const { forms, diagnostics } = parseFormdown([
            '@a: [select options="x,y" suggest:rol=judged suggest:role=decided suggest:policy=maybe suggest:evidence=no]',
            '@b: [text suggest:coarse=0 suggest:must-catch suggest:parent=b]'
        ].join('\n'))
        expect(forms.map(f => f.suggest)).toEqual([undefined, undefined])
        expect(diagnostics?.map(d => [d.code, d.field, d.severity])).toEqual([
            ['suggest-unknown', 'a', 'warning'],
            ['suggest-invalid', 'a', 'warning'],
            ['suggest-invalid', 'a', 'warning'],
            ['suggest-invalid', 'a', 'warning'],
            ['suggest-invalid', 'b', 'warning'],
            ['suggest-invalid', 'b', 'warning'],
            ['suggest-invalid', 'b', 'warning']
        ])
        expect(generateFormHTML('@a: [text suggest:rol=judged]')).not.toContain('suggest:')
    })

    it('report a parent that is not a field and a value not to miss that is not an option', () => {
        const { forms, diagnostics } = parseFormdown('@a: [select options="x,y" suggest:parent=nowhere suggest:must-catch="y, z"]')
        expect(forms[0].suggest).toEqual({ mustCatch: ['y'] })
        expect(diagnostics?.map(d => [d.code, d.related])).toEqual([
            ['suggest-parent-unknown', 'nowhere'],
            ['suggest-must-catch-unlisted', 'z']
        ])
    })

    it('report a suggesting policy on an observed field and drop the policy', () => {
        const { forms, diagnostics } = parseFormdown('@note: [text suggest:role=observed suggest:policy=offer]')
        expect(forms[0].suggest).toEqual({ role: 'observed' })
        expect(diagnostics?.map(d => d.code)).toEqual(['suggest-policy-on-observed'])
        expect(parseFormdown('@note: [text suggest:role=observed suggest:policy=off]').diagnostics).toEqual([])
    })

    it('read a group of fields settled together, and write it back', () => {
        const content = [
            '@industry: [select options="a,b" suggest:role=judged suggest:together=coding]',
            '@occupation: [select options="x,y" suggest:role=judged suggest:together=" coding "]'
        ].join('\n')
        const { forms, diagnostics } = parseFormdown(content)
        expect(diagnostics ?? []).toEqual([])
        expect(forms.map(f => f.suggest)).toEqual([
            { role: 'judged', together: 'coding' },
            { role: 'judged', together: 'coding' }
        ])
        expect(getSchema(content).occupation.suggest).toEqual({ role: 'judged', together: 'coding' })
        expect(formatField(forms[0])).toBe('@industry: [select options="a,b" suggest:role="judged" suggest:together="coding"]')
    })

    it('report a group of one, an empty group and a group on an observed field, and leave them out', () => {
        const { forms, diagnostics } = parseFormdown([
            '@a: [text suggest:role=judged suggest:together=alone]',
            '@b: [text suggest:together=""]',
            '@c: [text suggest:role=observed suggest:together=g]',
            '@d: [text suggest:together=g]'
        ].join('\n'))
        expect(forms.map(f => f.suggest)).toEqual([{ role: 'judged' }, undefined, { role: 'observed' }, undefined])
        expect(diagnostics?.map(d => [d.code, d.field])).toEqual([
            ['suggest-invalid', 'b'],
            ['suggest-together-on-observed', 'c'],
            ['suggest-together-alone', 'a'],
            ['suggest-together-alone', 'd']
        ])
    })

    it('read in the shorthand syntax too', () => {
        const [field] = parseFormdown('@handler{kim,lee}: r[suggest:role=judged]').forms
        expect(field.suggest).toEqual({ role: 'judged' })
    })
})
