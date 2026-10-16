import { parseFormdown, generateFormHTML, getSchema } from '../src/index'

describe('a field description', () => {
    it('is read from the description attribute, not passed on to the control', () => {
        const parsed = parseFormdown('@purpose: [textarea required description="What the goods are for, in a line"]')
        const field = parsed.forms[0]
        expect(field.description).toBe('What the goods are for, in a line')
        expect(field.attributes?.description).toBeUndefined()

        const html = generateFormHTML(parsed)
        expect(html).not.toMatch(/<textarea[^>]*description=/)
    })

    it('is shown under its field and names it to assistive technology', () => {
        const html = generateFormHTML('@amount: [number description="In won, tax included"]')
        const described = /aria-describedby="([^"]+)"/.exec(html)?.[1]
        expect(described).toBeTruthy()
        expect(html).toContain(`<div id="${described}" class="formdown-field-description" part="description">In won, tax included</div>`)
    })

    it('is kept for every kind of field, with the label and options as before', () => {
        const parsed = parseFormdown([
            '@kind{Goods,Service}: [radio description="Pick one"]',
            '@agree: [checkbox description="Read the terms first"]',
            '@team: [select options="A,B" description="Where it goes"]',
        ].join('\n'))
        expect(parsed.forms.map((f) => f.description)).toEqual(['Pick one', 'Read the terms first', 'Where it goes'])
        expect(parsed.forms[2].options?.map((o) => o.value)).toEqual(['A', 'B'])
        const html = generateFormHTML(parsed)
        expect(html.match(/class="formdown-field-description"/g)).toHaveLength(3)
    })

    it('goes into the JSON schema of the form', () => {
        const schema = getSchema('@amount: [number description="In won"]')
        expect(schema.amount.description).toBe('In won')
    })
})
