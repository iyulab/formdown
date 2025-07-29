import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Value Attribute Support', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Parser - Value Attribute Parsing', () => {
        test('should parse text field with value attribute', () => {
            const content = '@name: [text value="John Doe" placeholder="Enter your name"]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toMatchObject({
                name: 'name',
                type: 'text',
                label: 'Name',
                value: 'John Doe',
                placeholder: 'Enter your name'
            })
            expect(result.forms[0].attributes?.form).toBe('formdown-form-default')
        })

        test('should parse email field with value attribute', () => {
            const content = '@email: [email value="user@example.com" required]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toMatchObject({
                name: 'email',
                type: 'email',
                label: 'Email',
                value: 'user@example.com',
                required: true
            })
        })

        test('should parse number field with numeric value', () => {
            const content = '@age: [number value=25 min=18 max=100]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toMatchObject({
                name: 'age',
                type: 'number',
                label: 'Age',
                value: 25
            })
            expect(result.forms[0].attributes?.min).toBe(18)
            expect(result.forms[0].attributes?.max).toBe(100)
        })

        test('should parse date field with value attribute', () => {
            const content = '@birth_date: [date value="1995-05-15"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toMatchObject({
                name: 'birth_date',
                type: 'date',
                label: 'Birth Date',
                value: '1995-05-15'
            })
        })

        test('should parse textarea with value attribute', () => {
            const content = '@message: [textarea value="Default message text" rows=4]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toMatchObject({
                name: 'message',
                type: 'textarea',
                label: 'Message',
                value: 'Default message text'
            })
            expect(result.forms[0].attributes?.rows).toBe(4)
        })

        test('should parse select field with value attribute', () => {
            const content = '@country: [select value="USA" options="USA,Canada,UK,Australia"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toMatchObject({
                name: 'country',
                type: 'select',
                label: 'Country',
                value: 'USA',
                options: ['USA', 'Canada', 'UK', 'Australia']
            })
        })

        test('should parse radio field with value attribute', () => {
            const content = '@priority: [radio value="Medium" options="Low,Medium,High"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toMatchObject({
                name: 'priority',
                type: 'radio',
                label: 'Priority',
                value: 'Medium',
                options: ['Low', 'Medium', 'High']
            })
        })

        test('should parse checkbox group with multiple values', () => {
            const content = '@features: [checkbox value="Email,SMS" options="Email,SMS,Push,Phone"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toMatchObject({
                name: 'features',
                type: 'checkbox',
                label: 'Features',
                value: 'Email,SMS',
                options: ['Email', 'SMS', 'Push', 'Phone']
            })
        })

        test('should parse single checkbox with boolean value', () => {
            const content = '@newsletter: [checkbox value=true content="Subscribe to newsletter"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toMatchObject({
                name: 'newsletter',
                type: 'checkbox',
                label: 'Newsletter',
                value: true,
                content: 'Subscribe to newsletter'
            })
        })

        test('should parse range field with value attribute', () => {
            const content = '@satisfaction: [range value=8 min=1 max=10]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toMatchObject({
                name: 'satisfaction',
                type: 'range',
                label: 'Satisfaction',
                value: 8
            })
            expect(result.forms[0].attributes?.min).toBe(1)
            expect(result.forms[0].attributes?.max).toBe(10)
        })

        test('should handle both quoted and unquoted values', () => {
            const content1 = '@name: [text value="John Doe"]'
            const content2 = '@age: [number value=25]'
            const content3 = '@active: [checkbox value=true]'

            const result1 = parser.parseFormdown(content1)
            const result2 = parser.parseFormdown(content2)
            const result3 = parser.parseFormdown(content3)

            expect(result1.forms[0].value).toBe('John Doe')
            expect(result2.forms[0].value).toBe(25)
            expect(result3.forms[0].value).toBe(true)
        })
    })

    describe('Generator - Value Attribute HTML Generation', () => {
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

        test('should generate textarea with default content', () => {
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
        })

        test('should generate select with pre-selected option', () => {
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

        test('should generate radio group with pre-selected option', () => {
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
                content: 'Subscribe to newsletter',
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).toContain('type="checkbox"')
            expect(html).toContain('checked')
            expect(html).toContain('Subscribe to newsletter')
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

        test('should handle special characters in values', () => {
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
    })

    describe('Integration - Full Parse and Generate Flow', () => {
        test('should preserve value attributes through full workflow', () => {
            const content = `# Contact Form with Defaults

@form[action="/contact" method="POST"]

@name: [text value="John Doe" placeholder="Enter your full name"]
@email: [email value="john@example.com" required]
@age: [number value=30 min=18 max=100]
@country: [select value="Canada" options="USA,Canada,UK,Australia"]
@priority: [radio value="Medium" options="Low,Medium,High"]
@features: [checkbox value="Email,SMS" options="Email,SMS,Push,Phone"]
@newsletter: [checkbox value=true content="Subscribe to newsletter"]
@message: [textarea value="Please contact me about..." rows=4]`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            // Check that all default values are present in HTML
            expect(html).toContain('value="John Doe"')
            expect(html).toContain('value="john@example.com"')
            expect(html).toContain('value="30"')
            expect(html).toContain('<option value="Canada" selected>Canada</option>')
            expect(html).toContain('value="Medium" checked')
            expect(html).toContain('value="Email" checked')
            expect(html).toContain('value="SMS" checked')
            expect(html).toContain('Push">')  // Not checked
            expect(html).toContain('Phone">')  // Not checked
            expect(html).toContain('checked')  // Newsletter checkbox
            expect(html).toContain('>Please contact me about...</textarea>')
        })

        test('should handle edge cases correctly', () => {
            const content = `
@empty_value: [text value=""]
@zero_value: [number value=0]
@false_checkbox: [checkbox value=false]
@empty_select: [select value="" options="A,B,C"]
`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('value=""')  // Empty string value
            expect(html).toContain('value="0"')  // Zero value
            expect(html).not.toContain('checked')  // False checkbox should not be checked
        })
    })

    describe('Error Handling', () => {
        test('should handle missing value gracefully', () => {
            const content = '@name: [text placeholder="Enter name"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].value).toBeUndefined()
            
            const html = generator.generateFieldHTML(result.forms[0])
            expect(html).toContain('placeholder="Enter name"')
            expect(html).not.toContain('value=')
        })

        test('should handle invalid values for selection fields', () => {
            const field = {
                name: 'country',
                type: 'select',
                label: 'Country',
                value: 'NonExistentCountry',
                options: ['USA', 'Canada', 'UK'],
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)
            expect(html).not.toContain('selected')  // No option should be selected
        })
    })
})