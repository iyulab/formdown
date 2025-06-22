import { FormdownGenerator } from '../src/generator'
import { FormdownParser } from '../src/parser'
import { FormdownContent, Field } from '../src/types'

describe('FormdownGenerator', () => {
    let generator: FormdownGenerator
    let parser: FormdownParser

    beforeEach(() => {
        generator = new FormdownGenerator()
        parser = new FormdownParser()
    })

    describe('Markdown Integration', () => {
        test('should generate HTML from markdown content', () => {
            const content: FormdownContent = {
                markdown: '# Test Title\n\nThis is a test paragraph.',
                forms: []
            }

            const html = generator.generateHTML(content)

            expect(html).toContain('<h1>Test Title</h1>')
            expect(html).toContain('<p>This is a test paragraph.</p>')
        })

        test('should combine markdown and form HTML', () => {
            const content: FormdownContent = {
                markdown: '# Contact Us\n\nPlease fill out the form below:',
                forms: [{
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                    required: true,
                    attributes: {}
                }]
            }

            const html = generator.generateHTML(content)

            expect(html).toContain('<h1>Contact Us</h1>')
            expect(html).toContain('<p>Please fill out the form below:</p>')
            expect(html).toContain('<form class="formdown-form">')
            expect(html).toContain('<input type="text"')
        })
    })

    describe('Form Generation', () => {
        test('should generate empty string for no fields', () => {
            const html = generator.generateFormHTML([])
            expect(html).toBe('')
        })

        test('should generate basic text input', () => {
            const fields: Field[] = [{
                name: 'username',
                type: 'text',
                label: 'Username',
                required: true,
                attributes: {}
            }]

            const html = generator.generateFormHTML(fields)

            expect(html).toContain('<form class="formdown-form">')
            expect(html).toContain('<div class="formdown-field">')
            expect(html).toContain('<label for="username">Username *</label>')
            expect(html).toContain('<input type="text" id="username" name="username" required>')
        })

        test('should generate email input with placeholder', () => {
            const fields: Field[] = [{
                name: 'email',
                type: 'email',
                label: 'Email Address',
                required: true,
                placeholder: 'Enter your email',
                attributes: {}
            }]

            const html = generator.generateFormHTML(fields)

            expect(html).toContain('<input type="email"')
            expect(html).toContain('id="email"')
            expect(html).toContain('name="email"')
            expect(html).toContain('placeholder="Enter your email"')
            expect(html).toContain('required')
        })

        test('should generate number input with min/max', () => {
            const fields: Field[] = [{
                name: 'age',
                type: 'number',
                label: 'Age',
                attributes: {
                    min: 18,
                    max: 100
                }
            }]

            const html = generator.generateFormHTML(fields)

            expect(html).toContain('<input type="number"')
            expect(html).toContain('min="18"')
            expect(html).toContain('max="100"')
        })
    })

    describe('Textarea Generation', () => {
        test('should generate textarea with rows and cols', () => {
            const fields: Field[] = [{
                name: 'description',
                type: 'textarea',
                label: 'Description',
                attributes: {
                    rows: 4,
                    cols: 50
                }
            }]

            const html = generator.generateFormHTML(fields)

            expect(html).toContain('<textarea')
            expect(html).toContain('rows="4"')
            expect(html).toContain('cols="50"')
            expect(html).toContain('id="description"')
            expect(html).toContain('name="description"')
        })
    })

    describe('Select Generation', () => {
        test('should generate select with options', () => {
            const fields: Field[] = [{
                name: 'country',
                type: 'select',
                label: 'Country',
                options: ['USA', 'Canada', 'UK'],
                attributes: {}
            }]

            const html = generator.generateFormHTML(fields)

            expect(html).toContain('<select')
            expect(html).toContain('<option value="USA">USA</option>')
            expect(html).toContain('<option value="Canada">Canada</option>')
            expect(html).toContain('<option value="UK">UK</option>')
        })
    })

    describe('Radio Button Generation', () => {
        test('should generate radio buttons with options', () => {
            const fields: Field[] = [{
                name: 'gender',
                type: 'radio',
                label: 'Gender',
                required: true,
                options: ['Male', 'Female', 'Other'],
                attributes: {}
            }]

            const html = generator.generateFormHTML(fields)

            expect(html).toContain('<fieldset>')
            expect(html).toContain('<legend>Gender *</legend>')
            expect(html).toContain('type="radio"')
            expect(html).toContain('value="Male"')
            expect(html).toContain('value="Female"')
            expect(html).toContain('value="Other"')
            expect(html).toContain('name="gender"')
        })
    })

    describe('Checkbox Generation', () => {
        test('should generate checkboxes with options', () => {
            const fields: Field[] = [{
                name: 'interests',
                type: 'checkbox',
                label: 'Interests',
                options: ['Programming', 'Design', 'Music'],
                attributes: {}
            }]

            const html = generator.generateFormHTML(fields)

            expect(html).toContain('<fieldset>')
            expect(html).toContain('<legend>Interests</legend>')
            expect(html).toContain('type="checkbox"')
            expect(html).toContain('value="Programming"')
            expect(html).toContain('value="Design"')
            expect(html).toContain('value="Music"')
            expect(html).toContain('name="interests"')
        })
    })

    describe('Complex Forms', () => {
        test('should generate multiple fields correctly', () => {
            const fields: Field[] = [
                {
                    name: 'name',
                    type: 'text',
                    label: 'Full Name',
                    required: true,
                    attributes: {}
                },
                {
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    required: true,
                    placeholder: 'your@email.com',
                    attributes: {}
                },
                {
                    name: 'age',
                    type: 'number',
                    label: 'Age',
                    attributes: { min: 18 }
                }
            ]

            const html = generator.generateFormHTML(fields)

            expect(html).toContain('Full Name *')
            expect(html).toContain('Email *')
            expect(html).toContain('Age')
            expect(html).toContain('placeholder="your@email.com"')
            expect(html).toContain('min="18"')
        })
    })

    describe('Edge Cases', () => {
        test('should handle field without label', () => {
            const fields: Field[] = [{
                name: 'test',
                type: 'text',
                label: '',
                attributes: {}
            }]

            const html = generator.generateFormHTML(fields)
            expect(html).toContain('<label for="test"></label>')
        })

        test('should handle boolean attributes correctly', () => {
            const fields: Field[] = [{
                name: 'test',
                type: 'text',
                label: 'Test',
                attributes: {
                    disabled: true,
                    readonly: false,
                    autocomplete: 'off'
                }
            }]

            const html = generator.generateFormHTML(fields)
            expect(html).toContain('disabled')
            expect(html).not.toContain('readonly')
            expect(html).toContain('autocomplete="off"')
        })
    })

    describe('Preview Issue Tests', () => {
        test('should render both markdown headers and fields from Basic FormDown Examples', () => {
            const content = `# Basic FormDown Examples

## Minimal Syntax

Simple fields with minimal syntax (defaults to text input):

@name: []
@email: []
@phone: []`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            console.log('Parsed content:', JSON.stringify(parsed, null, 2))
            console.log('Generated HTML:', html)

            // Should contain markdown headers
            expect(html).toContain('<h1>')
            expect(html).toContain('Basic FormDown Examples')
            expect(html).toContain('<h2>')
            expect(html).toContain('Minimal Syntax')

            // Should contain form fields
            expect(html).toContain('<form class="formdown-form">')
            expect(html).toContain('name="name"')
            expect(html).toContain('name="email"')
            expect(html).toContain('name="phone"')
        })

        test('should preserve markdown content when fields are present', () => {
            const content = `# User Registration

Please fill out this form:

@username: [text required]
@password: [password required]

Thank you for registering!`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            console.log('Complex content parsed:', JSON.stringify(parsed, null, 2))
            console.log('Complex content HTML:', html)

            // Should preserve all markdown content
            expect(html).toContain('<h1>')
            expect(html).toContain('User Registration')
            expect(html).toContain('<p>')
            expect(html).toContain('Please fill out this form')
            expect(html).toContain('Thank you for registering')

            // Should also have form fields
            expect(html).toContain('<form class="formdown-form">')
            expect(html).toContain('username')
            expect(html).toContain('password')
        })

        test('should handle mixed markdown and fields correctly', () => {
            const content = `## Contact Form

**Name**: ___@name[text required]
**Email**: ___@email[email required]

> Please ensure all information is correct.

@submit: [submit]`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            console.log('Mixed content parsed:', JSON.stringify(parsed, null, 2))
            console.log('Mixed content HTML:', html)

            // Should preserve markdown structure
            expect(html).toContain('<h2>Contact Form</h2>')
            expect(html).toContain('<strong>Name</strong>')
            expect(html).toContain('<strong>Email</strong>')
            expect(html).toContain('<blockquote>')

            // Should have form fields
            expect(html).toContain('name="name"')
            expect(html).toContain('name="email"')
            expect(html).toContain('type="submit"')
        })
    })
})
