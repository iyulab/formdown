import { generateFormHTML } from '../src/index'

describe('the control of a number field', () => {
    it('can be styled apart from the other text-like inputs, and is still a text-input', () => {
        const html = generateFormHTML('@amount: [number]')
        expect(html).toMatch(/<input type="number"[^>]*part="input text-input number-input"/)
    })

    it('leaves the other text-like inputs as they were', () => {
        const html = generateFormHTML('@a: [text]\n@b: [email]\n@c: [tel]')
        expect(html.match(/part="input text-input"/g)).toHaveLength(3)
        expect(html).not.toContain('number-input')
    })
})
