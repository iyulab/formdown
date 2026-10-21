import { constraintErrors, getSchema, typedData, validateForm, ValidationManager } from '../src/index'
import { messages as ko } from '../src/messages/ko'

const form = `@title(Title): [text required minlength=3 maxlength=5]
@n: [number min=0 max=10]
@mail: [email]
@code: [text pattern="^[A-Z]+$"]
@site: [url]
@when: [date min=2026-01-01 max=2026-12-31]`

describe('validateForm checks what each field declares', () => {
    const schema = getSchema(form)
    const errors = (data: Record<string, unknown>) => validateForm(data, schema).errors

    it('says a required field is missing, and nothing else about it', () => {
        expect(errors({})).toEqual([{ field: 'title', message: 'Title is required' }])
    })

    it('holds length, range, format and pattern', () => {
        expect(errors({ title: 'abcdefgh', n: 50, mail: 'nope', code: 'abc', site: 'not a url', when: '2027-02-01' })).toEqual([
            { field: 'title', message: 'Must be at most 5 characters' },
            { field: 'n', message: 'Value must be at most 10' },
            { field: 'mail', message: 'Please enter a valid email address' },
            { field: 'code', message: 'Value does not match required format' },
            { field: 'site', message: 'Please enter a valid URL' },
            { field: 'when', message: 'Date must be on or before 2026-12-31' },
        ])
        expect(errors({ title: 'ab', n: '-1', when: '2025-12-31' })).toEqual([
            { field: 'title', message: 'Must be at least 3 characters' },
            { field: 'n', message: 'Value must be at least 0' },
            { field: 'when', message: 'Date must be on or after 2026-01-01' },
        ])
    })

    it('passes values that keep every rule, a number given as text or as a number', () => {
        expect(errors({ title: 'abc', n: '10', mail: 'a@b.co', code: 'ABC', site: 'https://example.com', when: '2026-06-01' })).toEqual([])
        expect(errors({ title: 'abc', n: 0 })).toEqual([])
    })

    it('says a value that is not a number only that', () => {
        expect(errors({ title: 'abc', n: 'twelve' })).toEqual([{ field: 'n', message: 'Please enter a valid number' }])
    })

    it('matches a pattern against the whole value, as the browser does', () => {
        const schema = getSchema('@zip: [text pattern="[0-9]{3}"]')
        expect(validateForm({ zip: '1234' }, schema).errors).toHaveLength(1)
        expect(validateForm({ zip: '123' }, schema).errors).toEqual([])
    })

    it('counts characters, not UTF-16 units', () => {
        const schema = getSchema('@name: [text maxlength=2]')
        expect(validateForm({ name: '😀😀' }, schema).errors).toEqual([])
    })

    it('says the sentences a host gives, with the label and bounds filled in', () => {
        const messages = { required: '{label}을(를) 입력하세요', maxLength: '{max}자 이하로 입력하세요' }
        expect(validateForm({}, schema, { messages }).errors).toEqual([{ field: 'title', message: 'Title을(를) 입력하세요' }])
        expect(validateForm({ title: 'abcdefgh' }, schema, { messages }).errors).toEqual([{ field: 'title', message: '5자 이하로 입력하세요' }])
    })
})

describe('constraintErrors', () => {
    it('lets a field say its own required and pattern sentences', () => {
        expect(constraintErrors('', { name: 'a', required: true, errorMessage: 'Fill it in' })).toEqual([{ rule: 'required', message: 'Fill it in' }])
        expect(constraintErrors('x', { name: 'a', pattern: '[0-9]+', patternMessage: 'Digits only' })).toEqual([{ rule: 'pattern', message: 'Digits only' }])
    })

    it('counts zero as given', () => {
        expect(constraintErrors(0, { type: 'number', required: true })).toEqual([])
    })
})

describe('ValidationManager gives the same answer', () => {
    it('reports the rule it broke as the code', async () => {
        const result = await new ValidationManager().validateAsync(
            { fieldName: 'n', fieldType: 'number', constraints: { max: 10 }, schema: { label: 'N' } },
            '50',
            {},
        )
        expect(result.errors).toEqual([{ field: 'n', code: 'max', message: 'Value must be at most 10', severity: 'error' }])
    })
})

describe('typedData', () => {
    it('gives number fields their values as numbers, and leaves the rest', () => {
        const schema = getSchema('@n: [number]\n@r: [range]\n@t: [text]')
        expect(typedData({ n: '0.50', r: '3', t: '7' }, schema)).toEqual({ n: 0.5, r: 3, t: '7' })
        expect(typedData({ n: '', r: 'x' }, schema)).toEqual({ n: '', r: 'x' })
    })
})

describe('the README example', () => {
    it('says what the README says', () => {
        const schema = getSchema('@title(Title)*: [minlength=3]\n@n: [number max=10]')
        expect(validateForm({ title: 'ab', n: '12' }, schema).errors).toEqual([
            { field: 'title', message: 'Must be at least 3 characters' },
            { field: 'n', message: 'Value must be at most 10' },
        ])
        expect(validateForm({}, schema, { messages: ko }).errors).toEqual([{ field: 'title', message: 'Title 칸을 채워 주세요' }])
        expect(typedData({ n: '12' }, schema)).toEqual({ n: 12 })
    })
})
