import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Value Attribute - Comprehensive TDD Tests', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Parser Tests - Value Attribute Recognition', () => {
        test('should parse value attribute with required field and custom label', () => {
            const content = '@name(Full Name)*: [placeholder="Enter your full name" value="John snow"]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toMatchObject({
                name: 'name',
                type: 'text',
                label: 'Full Name',
                value: 'John snow',
                placeholder: 'Enter your full name',
                required: true
            })
        })

        test('should parse value attribute in different positions', () => {
            const cases = [
                '@name: [text value="John" placeholder="Name"]',
                '@name: [text placeholder="Name" value="John"]',
                '@name: [value="John" text placeholder="Name"]'
            ]

            cases.forEach(testCase => {
                const result = parser.parseFormdown(testCase)
                expect(result.forms[0].value).toBe('John')
                expect(result.forms[0].placeholder).toBe('Name')
            })
        })

        test('should parse numeric values correctly', () => {
            const cases = [
                { input: '@age: [number value=25]', expected: 25 },
                { input: '@price: [number value=19.99]', expected: 19.99 },
                { input: '@count: [number value=0]', expected: 0 },
                { input: '@negative: [number value=-5]', expected: -5 }
            ]

            cases.forEach(({ input, expected }) => {
                const result = parser.parseFormdown(input)
                expect(result.forms[0].value).toBe(expected)
            })
        })

        test('should parse boolean values correctly', () => {
            const cases = [
                { input: '@active: [checkbox value=true]', expected: true },
                { input: '@inactive: [checkbox value=false]', expected: false },
                { input: '@enabled: [checkbox value="true"]', expected: 'true' },
                { input: '@disabled: [checkbox value="false"]', expected: 'false' }
            ]

            cases.forEach(({ input, expected }) => {
                const result = parser.parseFormdown(input)
                expect(result.forms[0].value).toBe(expected)
            })
        })

        test('should parse string values with spaces and special characters', () => {
            const cases = [
                '@name: [text value="John Doe"]',
                '@message: [text value="Hello, World!"]',
                '@code: [text value="<script>alert(1)</script>"]',
                '@path: [text value="/path/to/file.txt"]'
            ]

            cases.forEach(testCase => {
                const result = parser.parseFormdown(testCase)
                expect(result.forms[0].value).toBeDefined()
                expect(typeof result.forms[0].value).toBe('string')
            })
        })

        test('should handle empty string values', () => {
            const content = '@empty: [text value=""]'
            const result = parser.parseFormdown(content)
            expect(result.forms[0].value).toBe('')
        })
    })

    describe('Generator Tests - HTML Value Generation', () => {
        test('should generate input with value attribute for text fields', () => {
            const field = {
                name: 'name',
                type: 'text',
                label: 'Name',
                value: 'John Doe',
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('value="John Doe"')
            expect(html).toContain('type="text"')
        })

        test('should generate textarea with content for textarea fields', () => {
            const field = {
                name: 'message',
                type: 'textarea',
                label: 'Message',
                value: 'Default message text',
                attributes: { rows: 4, form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('<textarea')
            expect(html).toContain('>Default message text</textarea>')
            expect(html).not.toContain('value="Default message text"') // textarea shouldn't have value attribute
        })

        test('should generate select with selected option', () => {
            const field = {
                name: 'country',
                type: 'select',
                label: 'Country',
                value: 'Canada',
                options: ['USA', 'Canada', 'UK', 'Australia'],
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('<option value="USA">USA</option>')
            expect(html).toContain('<option value="Canada" selected>Canada</option>')
            expect(html).toContain('<option value="UK">UK</option>')
        })

        test('should generate radio group with checked option', () => {
            const field = {
                name: 'priority',
                type: 'radio',
                label: 'Priority',
                value: 'High',
                options: ['Low', 'Medium', 'High'],
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('value="Low"')
            expect(html).toContain('value="Medium"')
            expect(html).toContain('value="High" checked')
        })

        test('should generate single checkbox with checked state', () => {
            const field = {
                name: 'newsletter',
                type: 'checkbox',
                label: 'Newsletter',
                value: true,
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('type="checkbox"')
            expect(html).toContain('checked')
        })

        test('should generate checkbox group with multiple selections', () => {
            const field = {
                name: 'features',
                type: 'checkbox',
                label: 'Features',
                value: 'Email,Push',
                options: ['Email', 'SMS', 'Push', 'Phone'],
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('value="Email" checked')
            expect(html).toContain('value="SMS"')
            expect(html).not.toContain('value="SMS" checked')
            expect(html).toContain('value="Push" checked')
            expect(html).toContain('value="Phone"')
            expect(html).not.toContain('value="Phone" checked')
        })

        test('should generate range input with initial value', () => {
            const field = {
                name: 'satisfaction',
                type: 'range',
                label: 'Satisfaction',
                value: 7,
                attributes: { min: 1, max: 10, form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('type="range"')
            expect(html).toContain('value="7"')
            expect(html).toContain('min="1"')
            expect(html).toContain('max="10"')
        })

        test('should handle special characters in values safely', () => {
            const field = {
                name: 'description',
                type: 'textarea',
                label: 'Description',
                value: 'Text with <special> & "characters"',
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('Text with &lt;special&gt; &amp; &quot;characters&quot;')
        })

        test('should not add value attribute to file inputs', () => {
            const field = {
                name: 'avatar',
                type: 'file',
                label: 'Avatar',
                value: 'should-not-appear.jpg',
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('type="file"')
            expect(html).not.toContain('value="should-not-appear.jpg"')
        })

        test('should handle edge cases correctly', () => {
            const cases = [
                {
                    name: 'zero_value',
                    field: { name: 'count', type: 'number', label: 'Count', value: 0, attributes: {} },
                    expectation: 'value="0"'
                },
                {
                    name: 'empty_string',
                    field: { name: 'empty', type: 'text', label: 'Empty', value: '', attributes: {} },
                    expectation: 'value=""'
                },
                {
                    name: 'false_checkbox',
                    field: { name: 'inactive', type: 'checkbox', label: 'Inactive', value: false, attributes: {} },
                    expectation: (html: string) => !html.includes('checked')
                }
            ]

            cases.forEach(({ name, field, expectation }) => {
                const html = generator.generateFieldHTML(field)
                if (typeof expectation === 'string') {
                    expect(html).toContain(expectation)
                } else {
                    expect(expectation(html)).toBe(true)
                }
            })
        })
    })

    describe('Integration Tests - Full Workflow', () => {
        test('should preserve value attributes through full parse and generate cycle', () => {
            const content = `# Comprehensive Form Test

@form[action="/test" method="POST"]

@name(Full Name)*: [placeholder="Enter your full name" value="John Snow"]
@email: [email value="john@example.com" required]
@age: [number value=30 min=18 max=100]
@bio: [textarea value="Tell us about yourself..." rows=4]
@country: [select value="Canada" options="USA,Canada,UK,Australia"]
@priority: [radio value="Medium" options="Low,Medium,High"]
@features: [checkbox value="Email,SMS" options="Email,SMS,Push,Phone"]
@newsletter: [checkbox value=true content="Subscribe to newsletter"]
@satisfaction: [range value=8 min=1 max=10]`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            // Check that all default values are present in HTML
            expect(html).toContain('value="John Snow"')
            expect(html).toContain('value="john@example.com"')
            expect(html).toContain('value="30"')
            expect(html).toContain('>Tell us about yourself...</textarea>')
            expect(html).toContain('<option value="Canada" selected>Canada</option>')
            expect(html).toContain('value="Medium" checked')
            expect(html).toContain('value="Email" checked')
            expect(html).toContain('value="SMS" checked')
            expect(html).toContain('checked') // Newsletter checkbox
            expect(html).toContain('value="8"') // Range
        })

        test('should handle complex field combinations correctly', () => {
            const content = `
@multi_attr: [text required value="Complex Value" placeholder="Enter text" maxlength=100 class="custom"]
@ordered_attrs: [email value="test@example.com" placeholder="Email" required pattern=".*@.*"]
`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(parsed.forms[0].value).toBe('Complex Value')
            expect(parsed.forms[0].required).toBe(true)
            expect(parsed.forms[0].placeholder).toBe('Enter text')
            
            expect(parsed.forms[1].value).toBe('test@example.com')
            expect(parsed.forms[1].required).toBe(true)
            expect(parsed.forms[1].pattern).toBe('.*@.*')

            expect(html).toContain('value="Complex Value"')
            expect(html).toContain('value="test@example.com"')
        })
    })

    describe('Error Handling and Edge Cases', () => {
        test('should handle missing value gracefully', () => {
            const content = '@name: [text placeholder="Enter name"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].value).toBeUndefined()
            
            const html = generator.generateFieldHTML(result.forms[0])
            expect(html).toContain('placeholder="Enter name"')
            expect(html).not.toContain('value=')
        })

        test('should handle invalid values for selection fields gracefully', () => {
            const field = {
                name: 'country',
                type: 'select',
                label: 'Country',
                value: 'NonExistentCountry',
                options: ['USA', 'Canada', 'UK'],
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).not.toContain('selected') // No option should be selected
        })

        test('should handle malformed attribute strings', () => {
            const cases = [
                '@test: [text value=]', // Empty value
                '@test: [text value="unclosed string]', // Unclosed quote
                '@test: [text value=multiple words without quotes]' // Unquoted multi-word
            ]

            cases.forEach(testCase => {
                expect(() => {
                    const result = parser.parseFormdown(testCase)
                    generator.generateFieldHTML(result.forms[0])
                }).not.toThrow() // Should not crash
            })
        })
    })
})