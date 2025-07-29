import { getSchema } from '../src/schema'
import { FormDownSchema, FieldSchema } from '../src/types'

describe('Schema Extraction', () => {
    describe('Basic Field Types', () => {
        test('should extract basic text field schema', () => {
            const content = '@name: [text required]'
            const schema = getSchema(content)

            expect(schema).toEqual({
                name: {
                    type: 'text',
                    label: 'Name',
                    required: true,
                    position: 1,
                    isInline: undefined,
                    layout: 'vertical',
                    htmlAttributes: {
                        form: 'formdown-form-default'
                    }
                }
            })
        })

        test('should extract email field schema', () => {
            const content = '@email: [email required placeholder="Enter your email"]'
            const schema = getSchema(content)

            expect(schema.email).toEqual({
                type: 'email',
                label: 'Email',
                required: true,
                placeholder: 'Enter your email',
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should extract field with value attribute', () => {
            const content = '@name(Full Name)*: [placeholder="Enter your full name" value="hello"]'
            const schema = getSchema(content)

            expect(schema.name).toEqual({
                type: 'text',
                label: 'Full Name',
                required: true,
                placeholder: 'Enter your full name',
                value: 'hello',
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should extract different value types correctly', () => {
            const content = `
@text_field: [text value="string value"]
@number_field: [number value=42]
@boolean_field: [checkbox value=true]
@quoted_boolean: [checkbox value="false"]
@empty_value: [text value=""]
            `
            const schema = getSchema(content)

            expect(schema.text_field.value).toBe('string value')
            expect(schema.number_field.value).toBe(42)
            expect(schema.boolean_field.value).toBe(true)
            expect(schema.quoted_boolean.value).toBe('false')
            expect(schema.empty_value.value).toBe('')
        })

        test('should extract number field with validation', () => {
            const content = '@age: [number min=18 max=120]'
            const schema = getSchema(content)

            expect(schema.age).toEqual({
                type: 'number',
                label: 'Age',
                required: undefined,
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                validation: {
                    min: 18,
                    max: 120
                },
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })
    })

    describe('Shorthand Syntax', () => {
        test('should extract email field from shorthand', () => {
            const content = '@email*: @[]'
            const schema = getSchema(content)

            expect(schema.email).toEqual({
                type: 'email',
                label: 'Email',
                required: true,
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should extract number field from shorthand', () => {
            const content = '@age: #[min=13 max=120]'
            const schema = getSchema(content)

            expect(schema.age).toEqual({
                type: 'number',
                label: 'Age',
                required: undefined,
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                validation: {
                    min: 13,
                    max: 120
                },
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should extract textarea with rows', () => {
            const content = '@bio: T4[maxlength=500]'
            const schema = getSchema(content)

            expect(schema.bio).toEqual({
                type: 'textarea',
                label: 'Bio',
                required: undefined,
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                validation: {
                    maxlength: 500
                },
                htmlAttributes: {
                    rows: 4,
                    form: 'formdown-form-default'
                }
            })
        })

        test('should extract pattern validation from content', () => {
            const content = '@username*{^[a-zA-Z0-9_]{3,20}$}: []'
            const schema = getSchema(content)

            expect(schema.username).toEqual({
                type: 'text',
                label: 'Username',
                required: true,
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                pattern: '^[a-zA-Z0-9_]{3,20}$',
                validation: {
                    pattern: '^[a-zA-Z0-9_]{3,20}$'
                },
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })
    })

    describe('Selection Fields', () => {
        test('should extract radio field with options', () => {
            const content = '@gender{Male,Female,Other}: r[]'
            const schema = getSchema(content)

            expect(schema.gender).toEqual({
                type: 'radio',
                label: 'Gender',
                required: undefined,
                options: ['Male', 'Female', 'Other'],
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should extract checkbox field with allowOther', () => {
            const content = '@interests{Web,Mobile,AI,*}: c[]'
            const schema = getSchema(content)

            expect(schema.interests).toEqual({
                type: 'checkbox',
                label: 'Interests',
                required: undefined,
                options: ['Web', 'Mobile', 'AI'],
                allowOther: true,
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should extract select field', () => {
            const content = '@country{USA,UK,Canada}: s[]'
            const schema = getSchema(content)

            expect(schema.country).toEqual({
                type: 'select',
                label: 'Country',
                required: undefined,
                options: ['USA', 'UK', 'Canada'],
                position: 1,
                isInline: undefined,
                layout: 'vertical',
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })
    })

    describe('Inline Fields', () => {
        test('should extract inline field with proper layout', () => {
            const content = 'Please enter your name: ___@name[text]'
            const schema = getSchema(content)

            expect(schema.name).toEqual({
                type: 'text',
                label: 'Name',
                required: undefined,
                position: 1,
                isInline: true,
                layout: 'inline',
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should extract inline field with shorthand', () => {
            const content = 'Your email: @___@email*'
            const schema = getSchema(content)

            expect(schema.email).toEqual({
                type: 'email',
                label: 'Email',
                required: true,
                position: 1,
                isInline: true,
                layout: 'inline',
                htmlAttributes: {
                    form: 'formdown-form-default'
                }
            })
        })
    })

    describe('Complex Forms', () => {
        test('should extract multiple fields with correct positions', () => {
            const content = `
# User Registration

@username*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="Enter username"]
@email*: @[]
@age: #[min=13 max=120]
@bio: T4[maxlength=500]
@gender{Male,Female,Other}: r[]
@interests{Web,Mobile,AI,*}: c[]
@newsletter: c[]
@submit: [submit label="Create Account"]
            `.trim()

            const schema = getSchema(content)

            expect(Object.keys(schema)).toHaveLength(8)
            expect(schema.username.position).toBe(1)
            expect(schema.email.position).toBe(2)
            expect(schema.age.position).toBe(3)
            expect(schema.bio.position).toBe(4)
            expect(schema.gender.position).toBe(5)
            expect(schema.interests.position).toBe(6)
            expect(schema.newsletter.position).toBe(7)
            expect(schema.submit.position).toBe(8)
        })

        test('should handle mixed inline and block fields', () => {
            const content = `
# Contact Form

@name: [text required]
Please enter your email: ___@email*
@message: T5[required]
            `.trim()

            const schema = getSchema(content)

            expect(Object.keys(schema)).toHaveLength(3)
            expect(schema.name.layout).toBe('vertical')
            expect(schema.email.layout).toBe('inline')
            expect(schema.message.layout).toBe('vertical')
        })
    })

    describe('Validation Rules', () => {
        test('should extract all validation types', () => {
            const content = '@field: [text required min=5 max=50 minlength=3 maxlength=100]'
            const schema = getSchema(content)

            expect(schema.field.validation).toEqual({
                min: 5,
                max: 50,
                minlength: 3,
                maxlength: 100
            })
            expect(schema.field.htmlAttributes).toEqual({
                form: 'formdown-form-default'
            })
        })

        test('should extract pattern validation', () => {
            const content = '@field: [text pattern=abc123]'
            const schema = getSchema(content)

            expect(schema.field.validation).toEqual({
                pattern: 'abc123'
            })
            expect(schema.field.htmlAttributes).toEqual({
                form: 'formdown-form-default'
            })
        })

        test('should extract file validation', () => {
            const content = '@upload: [file accept=".pdf,.doc" required]'
            const schema = getSchema(content)

            expect(schema.upload.validation).toEqual({
                accept: '.pdf,.doc'
            })
            expect(schema.upload.htmlAttributes).toEqual({
                form: 'formdown-form-default'
            })
        })
    })

    describe('HTML Attributes', () => {
        test('should separate validation and HTML attributes', () => {
            const content = '@field: [text required min=5 placeholder="Enter text" class="custom-input" data-test="field"]'
            const schema = getSchema(content)

            expect(schema.field.validation).toEqual({
                min: 5
            })
            expect(schema.field.placeholder).toBe('Enter text')
            expect(schema.field.htmlAttributes).toEqual({
                class: 'custom-input',
                'data-test': 'field',
                form: 'formdown-form-default'
            })
        })
    })

    describe('Smart Labels', () => {
        test('should generate smart labels for snake_case', () => {
            const content = '@first_name: [text]'
            const schema = getSchema(content)

            expect(schema.first_name.label).toBe('First Name')
            expect(schema.first_name.htmlAttributes).toEqual({
                form: 'formdown-form-default'
            })
        })

        test('should generate smart labels for camelCase', () => {
            const content = '@firstName: [text]'
            const schema = getSchema(content)

            expect(schema.firstName.label).toBe('First Name')
            expect(schema.firstName.htmlAttributes).toEqual({
                form: 'formdown-form-default'
            })
        })

        test('should use custom label when provided', () => {
            const content = '@user_name(Full Name): [text]'
            const schema = getSchema(content)

            expect(schema.user_name.label).toBe('Full Name')
            expect(schema.user_name.htmlAttributes).toEqual({
                form: 'formdown-form-default'
            })
        })
    })

    describe('Edge Cases', () => {
        test('should handle empty content', () => {
            const content = ''
            const schema = getSchema(content)

            expect(schema).toEqual({})
        })

        test('should handle content with no fields', () => {
            const content = `
# Just a title

Some regular markdown content.
            `.trim()

            const schema = getSchema(content)

            expect(schema).toEqual({})
        })

        test('should handle invalid field names', () => {
            const content = '@1invalid: [text]'
            const schema = getSchema(content)

            expect(schema).toEqual({})
        })
    })
})