import { parseFormdown, generateFormHTML, parseFormFields } from '../src/index'
import { FormdownGenerator } from '../src/generator'

describe('Formdown Integration', () => {
    const generator = new FormdownGenerator()

    describe('parseFormdown function', () => {
        test('should parse complete formdown content', () => {
            const input = `# User Registration

Please fill out the form below:

@name: [text required placeholder="Full name"]
@email: [email required]

Your username is ___@username[text required].`

            const result = parseFormdown(input)

            expect(result.markdown).toContain('# User Registration')
            expect(result.markdown).toContain('Please fill out the form below:')
            expect(result.forms).toHaveLength(3)
            expect(result.forms.map(f => f.name)).toEqual(['name', 'email', 'username'])
        })
    })

    describe('generateFormHTML function', () => {
        test('should generate complete HTML from formdown content', () => {
            const content = {
                markdown: '# Contact Form\n\nPlease contact us:\n\n<!--FORMDOWN_FIELD_0-->',
                forms: [{
                    name: 'message',
                    type: 'textarea',
                    label: 'Message',
                    required: true,
                    attributes: { rows: 4, form: "formdown-form-default" }
                }]
            }

            const html = generator.generateHTML(content)

            expect(html).toContain('<h1>Contact Form</h1>')
            expect(html).toContain('<p>Please contact us:</p>')
            expect(html).toContain('formdown-form-default')
            expect(html).toContain('<textarea')
            expect(html).toContain('Message *')
        })
    })

    describe('parseFormFields function (legacy)', () => {
        test('should support legacy field parsing', () => {
            const input = '@name: [text required]\n@email: [email]'
            const result = parseFormFields(input)

            expect(result.fields).toHaveLength(2)
            expect(result.errors).toHaveLength(0)
        })
    })

    describe('End-to-End Workflow', () => {
        test('should parse and generate HTML for complete workflow', () => {
            const formdownContent = `# Contact Us

## Personal Information
@name: [text required placeholder="Full Name"]
@email: [email required]

## Message
@subject: [text required]
@message: [textarea rows=5 required]

Thank you for reaching out to us!`

            // Parse the formdown content
            const parsed = parseFormdown(formdownContent)

            // Generate HTML
            const html = generateFormHTML(parsed)

            // Verify parsing
            expect(parsed.forms).toHaveLength(4)
            expect(parsed.forms.map(f => f.name)).toEqual(['name', 'email', 'subject', 'message'])

            // Verify HTML generation
            expect(html).toContain('<h1>Contact Us</h1>')
            expect(html).toContain('<h2>Personal Information</h2>')
            expect(html).toContain('<h2>Message</h2>')
            expect(html).toContain('formdown-form-default')
            expect(html).toContain('placeholder="Full Name"')
            expect(html).toContain('rows="5"')
            expect(html).toContain('Thank you for reaching out to us!')
        })

        test('should handle inline fields in markdown context', () => {
            const formdownContent = `# Survey

Please rate our service: ___@rating[number min=1 max=5 required] out of 5.

Would you recommend us? ___@recommend[radio] Yes, No

Additional comments: ___@comments[textarea rows=2]`

            const parsed = parseFormdown(formdownContent)
            const html = generator.generateHTML(parsed)

            expect(parsed.forms).toHaveLength(3)
            expect(html).toContain('<h1>Survey</h1>')
            // 인라인 필드는 contenteditable span으로 렌더링되므로 attributes가 직접 표시되지 않음
            expect(html).toContain('data-field-name="rating"')
            expect(html).toContain('data-field-name="recommend"')
            expect(html).toContain('data-field-name="comments"')
        })
    })
})
