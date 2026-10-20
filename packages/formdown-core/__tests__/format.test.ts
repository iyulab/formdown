import { describe, it, expect } from '@jest/globals'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { parseFormdown, formatField, formatFormdown, getSchema, type Field } from '../src/index'

/** What a field means, without where it was written. */
const meaning = (field: Field) => {
    const { span, position, inline, group, ...rest } = field
    const attributes = { ...(rest.attributes ?? {}) }
    if (typeof attributes.form === 'string' && /^formdown-form-/.test(attributes.form)) delete attributes.form // placed by the parser
    return { ...rest, attributes }
}

const roundTrip = (fields: Field[]) => parseFormdown(formatFormdown(fields)).forms.map(meaning)

describe('formatField', () => {
    it('writes a field the parser reads back as the same field', () => {
        const source = [
            '@name(Full name): [text required placeholder="Jane Doe" pattern="^[A-Za-z ]+$" message="Letters only"]',
            '@email: [email]',
            '@kind{hw=Hardware,sw=Software,*}: r[]',
            '@days{Mon,Tue}: c[layout="vertical"]',
            '@notify(Notify me): c[switch checked]',
            '@terms: [checkbox required content="I agree, and I mean it"]',
            '@age: [number min=0 max=120 step=1 value=30]',
            '@rate: [number value="7"]',
            '@note: [textarea rows=4 visible-if="kind=hw" required-if="!notify" description="Say \\"why\\""]',
            '@quantity: [number]',
            '@price: [number]',
            '@total: [number compute="quantity * price"]',
            '@customer -> Customer: [select]',
            '@tags <-> Tag: [select]',
            '@due(마감일 (선택)): [date]',
            '@first_name: [text]',
        ].join('\n')
        const fields = parseFormdown(source).forms
        expect(parseFormdown(source).diagnostics).toEqual([])
        expect(roundTrip(fields)).toEqual(fields.map(meaning))
    })

    it('writes a field held as data, as a tool would give it', () => {
        const text = formatFormdown([
            { name: 'title', type: 'text', label: 'Title', required: true, pattern: '^.{3,}$', attributes: { message: 'At least three characters' } },
            { name: 'priority', type: 'select', options: [{ value: 'low' }, { value: 'high', label: 'High (urgent)' }], value: 'low' },
            { name: 'public', type: 'checkbox', attributes: { switch: true } },
        ])
        expect(text).toBe([
            '@title: [text required pattern="^.{3,}$" message="At least three characters"]',
            '@priority: [select options="low,high=High (urgent)" value="low"]',
            '@public: [checkbox switch]',
        ].join('\n'))
        const schema = getSchema(text)
        expect(schema.title).toMatchObject({ required: true, label: 'Title' })
        expect(schema.priority.options).toEqual([{ value: 'low' }, { value: 'high', label: 'High (urgent)' }])
        expect(schema.public.switch).toBe(true)
    })

    it('writes a label the parentheses cannot hold as an attribute', () => {
        const line = formatField({ name: 'q', type: 'text', label: 'Which (a) or (b (c))?' })
        expect(line).toBe('@q: [text label="Which (a) or (b (c))?"]')
        expect(parseFormdown(line).forms[0].label).toBe('Which (a) or (b (c))?')
    })

    it('refuses what the syntax cannot hold rather than write something else', () => {
        expect(() => formatField({ name: '1st', type: 'text' })).toThrow('not a valid field name')
        expect(() => formatField({ name: 'a', type: 'two words' })).toThrow('not one word')
        expect(() => formatField({ name: 'a', type: 'text', value: ['x', 'y'] })).toThrow('front matter')
        expect(() => formatField({ name: 'a', type: 'text', attributes: { 'bad key': 'x' } })).toThrow('attribute name')
        expect(() => formatField(parseFormdown('@[submit "Send"]').forms[0])).toThrow('action element')
    })

    it('round-trips every field of the site samples and the syntax guide', () => {
        const root = join(__dirname, '..', '..', '..')
        const samples = readdirSync(join(root, 'site/public/samples')).filter(f => f.endsWith('.fd'))
            .map(f => readFileSync(join(root, 'site/public/samples', f), 'utf8'))
        const guide = readFileSync(join(root, 'docs/SYNTAX.md'), 'utf8')
        let count = 0
        for (const source of [...samples, guide]) {
            // A datalist is a declaration of its own, and an action element is a button, not a field
            const fields = parseFormdown(source).forms.filter(f => !f.attributes?.list && f.attributes?.type === undefined)
            count += fields.length
            for (const field of fields) expect([formatField(field), roundTrip([field])]).toEqual([formatField(field), [meaning(field)]])
        }
        expect(count).toBeGreaterThan(200)
    })
})
