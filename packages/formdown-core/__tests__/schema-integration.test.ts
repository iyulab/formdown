import { getSchema } from '../src/schema'
import { FormDownSchema } from '../src/types'

describe('Schema Integration Tests', () => {
    describe('Real-world Forms', () => {
        test('should handle complete user registration form', () => {
            const content = `
# User Registration

@username*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="Enter username"]
@email*: @[]
@age: #[min=13 max=120]
@bio: T4[maxlength=500]
@gender{Male,Female,Other}: r[]
@interests{Web,Mobile,AI,*}: c[]
@submit: [submit label="Create Account"]
            `.trim()

            const schema = getSchema(content)

            expect(Object.keys(schema)).toHaveLength(7)

            // Check required fields
            expect(schema.username.required).toBe(true)
            expect(schema.email.required).toBe(true)

            // Check validation
            expect(schema.username.pattern).toBe('^[a-zA-Z0-9_]{3,20}$')
            expect(schema.age.validation?.min).toBe(13)
            expect(schema.age.validation?.max).toBe(120)
            expect(schema.bio.validation?.maxlength).toBe(500)

            // Check field types
            expect(schema.email.type).toBe('email')
            expect(schema.age.type).toBe('number')
            expect(schema.bio.type).toBe('textarea')
            expect(schema.gender.type).toBe('radio')

            // Check options
            expect(schema.gender.options).toEqual(['Male', 'Female', 'Other'])
            expect(schema.interests.options).toEqual(['Web', 'Mobile', 'AI'])
            expect(schema.interests.allowOther).toBe(true)
        })

        test('should handle inline and block field combinations', () => {
            const content = `
# Contact Form

Please enter your name: ___@first_name* and ___@last_name*

@email*: @[placeholder="your.email@example.com"]
@message: T5[required]
            `.trim()

            const schema = getSchema(content)

            expect(Object.keys(schema)).toHaveLength(4)

            // Check inline fields
            expect(schema.first_name.isInline).toBe(true)
            expect(schema.first_name.layout).toBe('inline')
            expect(schema.last_name.isInline).toBe(true)

            // Check block fields
            expect(schema.email.layout).toBe('vertical')
            expect(schema.message.layout).toBe('vertical')

            // Check field order
            expect(schema.first_name.position).toBe(1)
            expect(schema.last_name.position).toBe(2)
            expect(schema.email.position).toBe(3)
            expect(schema.message.position).toBe(4)
        })
    })

    describe('Complex Field Types', () => {
        test('should handle pattern validation and mask conversion', () => {
            const content = `
@ssn{###-##-####}: []
@phone_mask{(###) ###-####}: %[]
@credit_card{#### #### #### ####}: []
            `.trim()

            const schema = getSchema(content)

            // Check mask pattern conversion
            expect(schema.ssn.pattern).toBe('^\\d{3}\\-\\d{2}\\-\\d{4}$')
            expect(schema.phone_mask.pattern).toBe('^\\(\\d{3}\\) \\d{3}\\-\\d{4}$')
            expect(schema.credit_card.pattern).toBe('^\\d{4} \\d{4} \\d{4} \\d{4}$')
        })

        test('should handle custom labels and attributes', () => {
            const content = `
@user_name(Display Name)*: [maxlength=50 class="form-control"]
@bio_text(About You): T3[maxlength=500 class="textarea"]
            `.trim()

            const schema = getSchema(content)

            // Check custom labels
            expect(schema.user_name.label).toBe('Display Name')
            expect(schema.bio_text.label).toBe('About You')

            // Check validation and HTML attributes
            expect(schema.user_name.validation?.maxlength).toBe(50)
            expect(schema.user_name.htmlAttributes?.class).toBe('form-control')
            expect(schema.bio_text.htmlAttributes?.class).toBe('textarea')
        })
    })

    describe('Performance and Scale', () => {
        test('should handle large forms efficiently', () => {
            const fields = []
            for (let i = 1; i <= 50; i++) {
                fields.push(`@field${i}: [text]`)
            }
            const content = fields.join('\n')

            const startTime = Date.now()
            const schema = getSchema(content)
            const endTime = Date.now()

            expect(Object.keys(schema)).toHaveLength(50)
            expect(endTime - startTime).toBeLessThan(500) // Should complete quickly

            // Check first and last fields
            expect(schema.field1.position).toBe(1)
            expect(schema.field50.position).toBe(50)
        })

        test('should handle all field types', () => {
            const content = `
@text_field: []
@email_field: @[]
@number_field: #[]
@date_field: d[]
@textarea_field: T[]
@radio_field{A,B}: r[]
@select_field{X,Y}: s[]
@checkbox_field{1,2}: c[]
            `.trim()

            const schema = getSchema(content)

            expect(Object.keys(schema)).toHaveLength(8)
            expect(schema.text_field.type).toBe('text')
            expect(schema.email_field.type).toBe('email')
            expect(schema.number_field.type).toBe('number')
            expect(schema.date_field.type).toBe('date')
            expect(schema.textarea_field.type).toBe('textarea')
            expect(schema.radio_field.type).toBe('radio')
            expect(schema.select_field.type).toBe('select')
            expect(schema.checkbox_field.type).toBe('checkbox')
        })
    })

    describe('Error Handling', () => {
        test('should handle malformed fields gracefully', () => {
            const content = `
@valid_field: [text]
@: [invalid_no_name]
@123invalid: [text]
@another_valid: [email]
            `.trim()

            const schema = getSchema(content)

            // Should only extract valid fields
            expect(Object.keys(schema)).toHaveLength(2)
            expect(schema.valid_field).toBeDefined()
            expect(schema.another_valid).toBeDefined()
        })

        test('should handle empty and markdown-only content', () => {
            expect(getSchema('')).toEqual({})
            
            const markdownOnly = '# Title\n\nJust markdown content.'
            expect(getSchema(markdownOnly)).toEqual({})
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
        })

        test('should separate validation and HTML attributes', () => {
            const content = '@field: [text required min=5 placeholder="Enter text" class="custom-input"]'
            const schema = getSchema(content)

            expect(schema.field.validation).toEqual({
                min: 5
            })
            expect(schema.field.placeholder).toBe('Enter text')
            expect(schema.field.htmlAttributes).toEqual({
                class: 'custom-input',
                form: 'formdown-form-default'
            })
        })
    })

    describe('Smart Labels', () => {
        test('should generate smart labels for naming conventions', () => {
            const content = `
@first_name: [text]
@lastName: [text]
@email_address: [text]
            `.trim()

            const schema = getSchema(content)

            expect(schema.first_name.label).toBe('First Name')
            expect(schema.lastName.label).toBe('Last Name')
            expect(schema.email_address.label).toBe('Email Address')
        })

        test('should use custom labels when provided', () => {
            const content = '@user_name(Full Name): [text]'
            const schema = getSchema(content)

            expect(schema.user_name.label).toBe('Full Name')
        })
    })
})