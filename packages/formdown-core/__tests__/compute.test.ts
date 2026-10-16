import { parseComputation, parseFormdown, generateFormHTML, getSchema } from '../src/index'

const worked = (text: string, data: Record<string, unknown>) => {
    const read = parseComputation(text)
    if ('error' in read) throw new Error(read.error)
    return read.evaluate(data)
}

describe('a computed value', () => {
    it('works out numbers and fields with + - * / and parentheses, * and / first', () => {
        expect(worked('청구량 * 단가', { 청구량: 3, 단가: '1500' })).toBe(4500)
        expect(worked('a + b * 2', { a: 1, b: 2 })).toBe(5)
        expect(worked('(a + b) * 2', { a: 1, b: 2 })).toBe(6)
        expect(worked('-a + 10 / 4', { a: 1 })).toBe(1.5)
        expect(worked('a - b - c', { a: 10, b: 3, c: 2 })).toBe(5)
    })

    it('reads text that is a number, thousands separators and all, and keeps decimals clean', () => {
        expect(worked('a * b', { a: '1,200', b: '0.1' })).toBe(120)
        expect(worked('a + b', { a: 0.1, b: 0.2 })).toBe(0.3)
    })

    it('has no value while a field it reads holds no number, or where it divides by zero', () => {
        expect(worked('a * b', { a: 3 })).toBeUndefined()
        expect(worked('a * b', { a: 3, b: '' })).toBeUndefined()
        expect(worked('a * b', { a: 3, b: 'many' })).toBeUndefined()
        expect(worked('a / b', { a: 3, b: 0 })).toBeUndefined()
    })

    it('names the fields it reads, each once', () => {
        const read = parseComputation('단가 * 청구량 + 단가')
        expect('error' in read ? read.error : read.fields).toEqual(['단가', '청구량'])
    })

    it('says where text stops being a computation', () => {
        for (const text of ['', 'a *', '(a + b', 'a b', 'a ^ 2', 'a > 0 and b > 0']) {
            expect('error' in parseComputation(text)).toBe(true)
        }
    })
})

describe('a computed field', () => {
    it('is read from compute="…", shown read-only with what it is worked out from, and kept in the schema', () => {
        const source = '@청구량: [number]\n@단가: [number]\n@금액: [number compute="청구량 * 단가"]'
        const parsed = parseFormdown(source)
        expect(parsed.forms[2].compute).toBe('청구량 * 단가')
        expect(parsed.diagnostics ?? []).toEqual([])
        const html = generateFormHTML(parsed)
        expect(html).toMatch(/<input type="number"[^>]*name="금액"[^>]*readonly[^>]*data-compute="청구량 \* 단가"/)
        expect(getSchema(source).금액.compute).toBe('청구량 * 단가')
    })

    it('is reported when it cannot be read, or reads a field the form does not have, or itself', () => {
        const parsed = parseFormdown([
            '@a: [number]',
            '@b: [number compute="a *"]',
            '@c: [number compute="a * 수량"]',
            '@d: [number compute="d + 1"]',
        ].join('\n'))
        expect((parsed.diagnostics ?? []).map((d) => [d.code, d.field])).toEqual([
            ['invalid-compute', 'b'],
            ['compute-unknown-field', 'c'],
            ['compute-unknown-field', 'd'],
        ])
    })
})
