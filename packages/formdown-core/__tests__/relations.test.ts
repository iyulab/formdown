import { parseFormdown } from '../src/index'

const relations = (src: string) => parseFormdown(src).forms.map(f => [f.name, f.relation])

describe('Relations', () => {
    it('reads the record a field names, one or many, in every block form', () => {
        expect(relations([
            '@customer -> Customer: [select]',
            '@tags <-> Tag: [checkbox]',
            '@owner* -> Person: s[]',
            '@team(Team) -> Team: [select]',
        ].join('\n\n'))).toEqual([
            ['customer', { target: 'Customer', type: 'fk' }],
            ['tags', { target: 'Tag', type: 'many-to-many' }],
            ['owner', { target: 'Person', type: 'fk' }],
            ['team', { target: 'Team', type: 'fk' }],
        ])
    })

    it.each([
        ['a slug', 'food-business'],
        ['a dotted name', 'crm.contact'],
        ['one that starts with a digit', '2024-orders'],
        ['a name in any script', '거래처'],
    ])('names a target the host spells as %s', (_label, target) => {
        expect(relations(`@업소 -> ${target}: [select]`)).toEqual([['업소', { target, type: 'fk' }]])
        expect(relations(`@업소* -> ${target}: s[]`)).toEqual([['업소', { target, type: 'fk' }]])
    })

    it('does not take a target that ends in a separator', () => {
        expect(parseFormdown('@업소 -> food-: [select]').forms).toEqual([])
    })

    it('leaves a field without an arrow without a relation', () => {
        expect(relations('@customer: [select]')).toEqual([['customer', undefined]])
    })
})
