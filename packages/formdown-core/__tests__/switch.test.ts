import { describe, it, expect } from '@jest/globals'
import { parseFormdown, generateFormHTML, getSchema } from '../src/index'

describe('a switch', () => {
    it('is a single checkbox written with switch, in either syntax', () => {
        for (const source of ['@notify: c[switch]', '@notify: [checkbox switch]']) {
            const { forms, diagnostics } = parseFormdown(source)
            expect(forms[0]).toMatchObject({ type: 'checkbox', attributes: { switch: true } })
            expect(diagnostics).toEqual([])
        }
    })

    it('renders as the HTML switch, with the role for browsers that do not draw one, and value true', () => {
        const html = generateFormHTML('@notify(Notify me): c[switch checked]')
        const input = html.match(/<input[^>]*>/)![0]
        for (const part of ['type="checkbox"', 'name="notify"', 'value="true"', 'role="switch"', ' switch ', ' checked ']) expect(input).toContain(part)
    })

    it('is carried in the schema, its value a boolean like any single checkbox', () => {
        const schema = getSchema('---\nnotify: true\n---\n@notify: c[switch]\n@agree: c[]')
        expect(schema.notify).toMatchObject({ type: 'checkbox', switch: true, value: true })
        expect(schema.agree.switch).toBeUndefined()
    })

    it('is reported and ignored on a checkbox with options or another type', () => {
        const group = parseFormdown('@days{Mon,Tue}: c[switch]')
        expect(group.diagnostics).toEqual([expect.objectContaining({ code: 'switch-needs-single-checkbox', field: 'days', severity: 'warning' })])
        expect(generateFormHTML('@days{Mon,Tue}: c[switch]')).not.toContain('role="switch"')
        expect(getSchema('@days{Mon,Tue}: c[switch]').days.switch).toBeUndefined()
        expect(parseFormdown('@name: [text switch]').diagnostics?.map(d => d.code)).toEqual(['switch-needs-single-checkbox'])
    })

    it('reads the same before and after the extension system is initialized: [toggle] is not a type', () => {
        expect(parseFormdown('@a: [toggle]').forms[0].type).toBe('text')
    })
})
