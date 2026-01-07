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

    // Helper function to generate HTML using Hidden Form Architecture
    const generateFieldsHTML = (fields: Field[]): string => {
        const content: FormdownContent = {
            markdown: fields.map((_, i) => `<!--FORMDOWN_FIELD_${i}-->`).join('\n'),
            forms: fields.map(f => ({ ...f, attributes: { ...f.attributes, form: 'formdown-form-default' } })),
            formDeclarations: []
        }
        return generator.generateHTML(content)
    }

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
                markdown: '# Contact Us\n\nPlease fill out the form below:\n\n<!--FORMDOWN_FIELD_0-->',
                forms: [{
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                    required: true,
                    attributes: { form: "formdown-form-default" }
                }],
                formDeclarations: []
            }

            const html = generator.generateHTML(content)

            expect(html).toContain('<h1>Contact Us</h1>')
            expect(html).toContain('<p>Please fill out the form below:</p>')
            expect(html).toContain('<form hidden id="formdown-form-default"')
            expect(html).toContain('<input type="text"')
            expect(html).toContain('form="formdown-form-default"')
        })
    })

    describe('Form Generation with Hidden Form Architecture', () => {
        test('should generate empty form for no fields', () => {
            const content: FormdownContent = {
                markdown: '',
                forms: [],
                formDeclarations: []
            }
            const html = generator.generateHTML(content)
            // No hidden form when no fields
            expect(html).not.toContain('<form hidden')
        })

        test('should generate basic text input', () => {
            const fields: Field[] = [{
                name: 'username',
                type: 'text',
                label: 'Username',
                required: true,
                attributes: {}
            }]

            const html = generateFieldsHTML(fields)

            expect(html).toContain('<form hidden id="formdown-form-default"')
            expect(html).toContain('<div class="formdown-field" part="field">')
            expect(html).toContain('<label for="username" part="label">Username *</label>')
            expect(html).toContain('<input type="text" id="username" name="username" required form=')
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

            const html = generateFieldsHTML(fields)

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

            const html = generateFieldsHTML(fields)

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

            const html = generateFieldsHTML(fields)

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

            const html = generateFieldsHTML(fields)

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

            const html = generateFieldsHTML(fields)

            expect(html).toContain('<fieldset')
            expect(html).toContain('<legend part="legend">Gender *</legend>')
            expect(html).toContain('type="radio"')
            expect(html).toContain('value="Male"')
            expect(html).toContain('value="Female"')
            expect(html).toContain('value="Other"')
            expect(html).toContain('name="gender"')
            expect(html).toContain('radio-group')
        })

        test('should fallback to text input for radio without options', () => {
            const fields: Field[] = [{
                name: 'invalid_radio',
                type: 'radio',
                label: 'Invalid Radio',
                required: true,
                attributes: {}
            }]

            const html = generateFieldsHTML(fields)

            expect(html).toContain('<input type="text"')
            expect(html).toContain('name="invalid_radio"')
            expect(html).not.toContain('<fieldset>')
            expect(html).not.toContain('type="radio"')
        })

        test('should parse and generate radio group correctly', () => {
            const content = '@gender: [radio options="Male,Female,Other"]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(parsed.forms).toHaveLength(1)
            expect(parsed.forms[0].type).toBe('radio')
            expect(parsed.forms[0].options).toEqual(['Male', 'Female', 'Other'])

            expect(html).toContain('<fieldset')
            expect(html).toContain('<legend part="legend">Gender</legend>')
            expect(html).toContain('type="radio"')
            expect(html).toContain('value="Male"')
            expect(html).toContain('value="Female"')
            expect(html).toContain('value="Other"')
            expect(html).toContain('radio-group')
        })

        test('should parse radio without options and fallback to text', () => {
            const content = '@invalid: [radio required]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(parsed.forms).toHaveLength(1)
            expect(parsed.forms[0].type).toBe('radio')
            expect(parsed.forms[0].options).toBeUndefined()

            expect(html).toContain('<input type="text"')
            expect(html).not.toContain('type="radio"')
            expect(html).not.toContain('<fieldset>')
        })
    })

    describe('Checkbox Generation', () => {
        test('should generate single checkbox without options', () => {
            const fields: Field[] = [{
                name: 'agree_terms',
                type: 'checkbox',
                label: 'I agree to the terms',
                required: true,
                attributes: {}
            }]

            const html = generateFieldsHTML(fields)

            expect(html).toContain('<input type="checkbox"')
            expect(html).toContain('name="agree_terms"')
            expect(html).toContain('value="true"')
            expect(html).toContain('required')
            expect(html).toContain('I agree to the terms *')
            expect(html).not.toContain('<fieldset>')
            expect(html).not.toContain('<legend>')
        })

        test('should generate checkboxes with options (checkbox group)', () => {
            const fields: Field[] = [{
                name: 'interests',
                type: 'checkbox',
                label: 'Interests',
                options: ['Programming', 'Design', 'Music'],
                attributes: {}
            }]

            const html = generateFieldsHTML(fields)

            expect(html).toContain('<fieldset')
            expect(html).toContain('<legend part="legend">Interests</legend>')
            expect(html).toContain('type="checkbox"')
            expect(html).toContain('value="Programming"')
            expect(html).toContain('value="Design"')
            expect(html).toContain('value="Music"')
            expect(html).toContain('name="interests"')
            expect(html).toContain('checkbox-group')
        })

        test('should parse and generate single checkbox correctly', () => {
            const content = '@agree: [checkbox required]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(parsed.forms).toHaveLength(1)
            expect(parsed.forms[0].type).toBe('checkbox')
            expect(parsed.forms[0].required).toBe(true)
            expect(parsed.forms[0].options).toBeUndefined()

            expect(html).toContain('<input type="checkbox"')
            expect(html).toContain('value="true"')
            expect(html).not.toContain('<fieldset>')
        })

        test('should parse and generate checkbox group correctly', () => {
            const content = '@interests: [checkbox options="Programming,Design,Music"]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(parsed.forms).toHaveLength(1)
            expect(parsed.forms[0].type).toBe('checkbox')
            expect(parsed.forms[0].options).toEqual(['Programming', 'Design', 'Music'])

            expect(html).toContain('<fieldset')
            expect(html).toContain('<legend part="legend">Interests</legend>')
            expect(html).toContain('value="Programming"')
            expect(html).toContain('value="Design"')
            expect(html).toContain('value="Music"')
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
                    attributes: { form: "formdown-form-default" }
                },
                {
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    required: true,
                    placeholder: 'your@email.com',
                    attributes: { form: "formdown-form-default" }
                },
                {
                    name: 'age',
                    type: 'number',
                    label: 'Age',
                    attributes: { min: 18, form: "formdown-form-default" }
                }
            ]

            const html = generateFieldsHTML(fields)

            expect(html).toContain('Full Name *')
            expect(html).toContain('Email *')
            expect(html).toContain('Age')
            expect(html).toContain('placeholder="your@email.com"')
            expect(html).toContain('min="18"')
        })
    })

    describe('Edge Cases', () => {
        test('should generate smart label when no label provided', () => {
            const fields: Field[] = [{
                name: 'test',
                type: 'text',
                label: '',
                attributes: {}
            }]

            const html = generateFieldsHTML(fields)
            expect(html).toContain('<label for="test" part="label">Test</label>')
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

            const html = generateFieldsHTML(fields)
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


            // Should contain markdown headers
            expect(html).toContain('<h1>')
            expect(html).toContain('Basic FormDown Examples')
            expect(html).toContain('<h2>')
            expect(html).toContain('Minimal Syntax')

            // Should contain hidden form and form fields with form attributes
            expect(html).toContain('<form hidden id="formdown-form-default"')
            expect(html).toContain('name="name"')
            expect(html).toContain('name="email"')
            expect(html).toContain('name="phone"')
            expect(html).toContain('form="formdown-form-default"')
        })

        test('should preserve markdown content when fields are present', () => {
            const content = `# User Registration

Please fill out this form:

@username: [text required]
@password: [password required]

Thank you for registering!`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)


            // Should preserve all markdown content
            expect(html).toContain('<h1>')
            expect(html).toContain('User Registration')
            expect(html).toContain('<p>')
            expect(html).toContain('Please fill out this form')
            expect(html).toContain('Thank you for registering')

            // Should also have hidden form and form fields
            expect(html).toContain('<form hidden id="formdown-form-default"')
            expect(html).toContain('username')
            expect(html).toContain('password')
            expect(html).toContain('form="formdown-form-default"')
        })

        test('should handle mixed markdown and fields correctly', () => {
            const content = `## Contact Form

**Name**: ___@name[text required]
**Email**: ___@email[email required]

> Please ensure all information is correct.

@submit: [submit]`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)


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

    describe('generateFieldHTML', () => {
        test('should generate standalone field HTML with form attribute', () => {
            const field: Field = {
                name: 'standalone',
                type: 'text',
                label: 'Standalone Field',
                required: true,
                attributes: {}
            }

            const html = generator.generateFieldHTML(field, 'my-form')

            expect(html).toContain('name="standalone"')
            expect(html).toContain('form="my-form"')
            expect(html).toContain('Standalone Field *')
        })
    })

    describe('generateStandaloneFieldHTML', () => {
        test('should generate field without wrapper form', () => {
            const field: Field = {
                name: 'test_field',
                type: 'email',
                label: 'Test Email',
                attributes: {}
            }

            const html = generator.generateStandaloneFieldHTML(field, 'target-form')

            expect(html).toContain('type="email"')
            expect(html).toContain('name="test_field"')
            expect(html).toContain('form="target-form"')
            expect(html).not.toContain('<form ')
        })
    })
})
