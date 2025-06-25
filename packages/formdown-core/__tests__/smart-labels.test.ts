import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Smart Label Generation', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Snake Case Field Names', () => {
        test('should convert snake_case to Title Case', () => {
            const content = '@full_name: []'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('Full Name')
            expect(parsed.forms[0].label).toBe('Full Name')
        })

        test('should handle multiple underscores', () => {
            const content = '@first_name_last_name: []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('First Name Last Name')
        })

        test('should handle single word with underscore', () => {
            const content = '@email_address: []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('Email Address')
        })
    })

    describe('Camel Case Field Names', () => {
        test('should convert camelCase to Title Case', () => {
            const content = '@fullName: []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('Full Name')
        })

        test('should handle multiple camel case words', () => {
            const content = '@firstName: []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('First Name')
        })

        test('should handle complex camel case', () => {
            const content = '@userPhoneNumber: []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('User Phone Number')
        })
    })

    describe('Simple Field Names', () => {
        test('should capitalize single word', () => {
            const content = '@name: []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('Name')
        })

        test('should handle lowercase single word', () => {
            const content = '@email: []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('Email')
        })

        test('should handle uppercase single word', () => {
            const content = '@NAME: []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('Name')
        })
    })

    describe('Field Name Validation', () => {
        test('should throw error for field names starting with number', () => {
            expect(() => {
                const content = '@1name: []'
                parser.parseFormdown(content)
            }).toThrow('Invalid field name \'1name\': Field names cannot start with a number')
        })

        test('should throw error for field names starting with number in generator', () => {
            expect(() => {
                const field = {
                    name: '2email',
                    type: 'text' as const,
                    label: '',
                    attributes: {}
                }
                generator.generateFieldHTML(field)
            }).toThrow('Invalid field name \'2email\': Field names cannot start with a number')
        })

        test('should allow field names starting with letters', () => {
            const content = '@name1: []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].name).toBe('name1')
            expect(parsed.forms[0].label).toBe('Name1')
        })
    })

    describe('Custom Labels Override Smart Generation', () => {
        test('should use custom label when provided with parentheses', () => {
            const content = '@full_name(Your Full Name): []'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('Your Full Name')
        })

        test('should use custom label when provided with attribute', () => {
            const content = '@full_name: [text label="Your Full Name"]'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('Your Full Name')
        })
    })

    describe('HTML Generation with Smart Labels', () => {
        test('should generate correct HTML with smart labels', () => {
            const content = '@user_name: []\n@email_address: [email required]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('<label for="user_name">User Name</label>')
            expect(html).toContain('<label for="email_address">Email Address *</label>')
        })

        test('should work with inline fields', () => {
            const content = 'Hello ___@full_name!'
            const parsed = parser.parseFormdown(content)

            expect(parsed.forms[0].label).toBe('Full Name')
        })
    })
})
