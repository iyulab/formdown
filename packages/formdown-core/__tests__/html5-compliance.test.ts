import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('HTML5 Compliance Tests', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Form Structure Validation', () => {
        test('should not create nested forms', () => {
            const content = `
@name: []
@email: @[]
@submit: [submit]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Count form tags
            const formMatches = html.match(/<form/g)
            expect(formMatches).toHaveLength(1)
            
            // Ensure no nested forms
            expect(html).not.toMatch(/<form[^>]*>[\s\S]*<form/)
        })

        test('should generate valid form with role attribute', () => {
            const content = `
@username: []
@submit: [submit]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('<form class="formdown-form" role="form">')
        })

        test('should properly associate labels with inputs', () => {
            const content = `
@username: []
@email: @[]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Each label should have matching for attribute and input id
            expect(html).toMatch(/<label for="username">[\s\S]*<input[^>]*id="username"/)
            expect(html).toMatch(/<label for="email">[\s\S]*<input[^>]*id="email"/)
        })

        test('should use fieldset and legend for grouped inputs', () => {
            const content = `
@gender{male,female,other}: r[]
@interests{web,mobile,ai}: c[]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should have fieldset elements
            expect(html).toMatch(/<fieldset[^>]*>[\s\S]*<legend>Gender<\/legend>/)
            expect(html).toMatch(/<fieldset[^>]*>[\s\S]*<legend>Interests<\/legend>/)
            
            // Radio group should have radiogroup role
            expect(html).toMatch(/role="radiogroup"/)
            
            // Checkbox group should have group role
            expect(html).toMatch(/role="group"/)
        })
    })

    describe('Accessibility Compliance', () => {
        test('should generate proper ARIA attributes for descriptions', () => {
            const content = `@username: []`
            const parsed = parser.parseFormdown(content)
            parsed.forms[0].description = "Enter your preferred username"
            
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('aria-describedby="username-description"')
            expect(html).toContain('id="username-description"')
            expect(html).toContain('class="formdown-field-description"')
        })

        test('should generate proper ARIA attributes for errors', () => {
            const content = `@email: @[]`
            const parsed = parser.parseFormdown(content)
            parsed.forms[0].errorMessage = "Please enter a valid email address"
            
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('aria-describedby="email-error"')
            expect(html).toContain('id="email-error"')
            expect(html).toContain('class="formdown-field-error"')
            expect(html).toContain('role="alert"')
        })

        test('should combine description and error in aria-describedby', () => {
            const content = `@password: ?[]`
            const parsed = parser.parseFormdown(content)
            parsed.forms[0].description = "Must be at least 8 characters"
            parsed.forms[0].errorMessage = "Password is too short"
            
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('aria-describedby="password-description password-error"')
        })

        test('should add proper roles for inline fields', () => {
            const content = `Hello ___@name!`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('role="textbox"')
            expect(html).toContain('contenteditable="true"')
        })

        test('should properly describe radio groups', () => {
            const content = `@size: r[options="S,M,L"]`
            const parsed = parser.parseFormdown(content)
            parsed.forms[0].description = "Choose your preferred size"
            
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('aria-describedby="size-description"')
            expect(html).toMatch(/<fieldset[^>]*aria-describedby="size-description"/)
        })
    })

    describe('Input Type Validation', () => {
        test('should generate valid HTML5 input types', () => {
            const content = `
@text_field: []
@email_field: @[]
@number_field: #[]
@tel_field: %[]
@url_field: &[]
@password_field: ?[]
@date_field: d[]
@time_field: t[]
@datetime_field: dt[]
@range_field: R[]
@file_field: F[]
@color_field: C[]
@week_field: W[]
@month_field: M[]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            const validTypes = [
                'text', 'email', 'number', 'tel', 'url', 'password',
                'date', 'time', 'datetime-local', 'range', 'file',
                'color', 'week', 'month'
            ]
            
            validTypes.forEach(type => {
                expect(html).toContain(`type="${type}"`)
            })
        })

        test('should add proper attributes for range inputs', () => {
            const content = `@volume: R[min=0 max=100 step=5 value=50]`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('type="range"')
            expect(html).toContain('min="0"')
            expect(html).toContain('max="100"')
            expect(html).toContain('step="5"')
            expect(html).toContain('<output for="volume"')
        })

        test('should preserve all HTML5 validation attributes', () => {
            const content = `
@username: [minlength=3 maxlength=20 pattern="[a-zA-Z0-9_]+"]
@age: #[min=13 max=120]
@description: T[maxlength=500]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('minlength="3"')
            expect(html).toContain('maxlength="20"')
            expect(html).toContain('pattern="[a-zA-Z0-9_]+"')
            expect(html).toContain('min="13"')
            expect(html).toContain('max="120"')
        })
    })

    describe('Semantic HTML Structure', () => {
        test('should use proper semantic markup for form fields', () => {
            const content = `
@bio: T4[placeholder="Tell us about yourself"]
@country: s[options="USA,Canada,UK"]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Textarea should be properly structured
            expect(html).toMatch(/<div class="formdown-field">[\s\S]*<label for="bio">[\s\S]*<textarea/)
            
            // Select should be properly structured
            expect(html).toMatch(/<div class="formdown-field">[\s\S]*<label for="country">[\s\S]*<select/)
            expect(html).toContain('<option value="USA">USA</option>')
        })

        test('should maintain proper document structure with markdown', () => {
            const content = `
# Registration Form

Please fill out the form below.

## Personal Information

@name*: []
@email*: @[]

## Preferences

@newsletter: c[]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should maintain heading hierarchy
            expect(html).toContain('<h1>Registration Form</h1>')
            expect(html).toContain('<h2>Personal Information</h2>')
            expect(html).toContain('<h2>Preferences</h2>')
            
            // Should have proper paragraph structure
            expect(html).toContain('<p>Please fill out the form below.</p>')
        })

        test('should generate valid name attributes', () => {
            const content = `
@user_name: []
@email_address: @[]
@birth_date: d[]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Name attributes should match field names exactly
            expect(html).toContain('name="user_name"')
            expect(html).toContain('name="email_address"')
            expect(html).toContain('name="birth_date"')
            
            // IDs should match names
            expect(html).toContain('id="user_name"')
            expect(html).toContain('id="email_address"')
            expect(html).toContain('id="birth_date"')
        })
    })

    describe('Custom Attributes Preservation', () => {
        test('should preserve all custom HTML attributes', () => {
            const content = `
@username: [class="form-control" data-validation="username" autocomplete="username"]
@password: ?[class="form-control" data-strength="true" aria-describedby="pwd-help"]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('class="form-control"')
            expect(html).toContain('data-validation="username"')
            expect(html).toContain('autocomplete="username"')
            expect(html).toContain('data-strength="true"')
        })

        test('should handle boolean attributes correctly', () => {
            const content = `
@email: @[required readonly disabled]
@terms: c[required]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Boolean attributes should appear without values
            expect(html).toMatch(/required(?![="])/g)
            expect(html).toMatch(/readonly(?![="])/g)
            expect(html).toMatch(/disabled(?![="])/g)
        })

        test('should not duplicate standard attributes', () => {
            const content = `@email*: @[required]` // Both shorthand and explicit required
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should not have duplicate required attributes
            const requiredMatches = html.match(/required/g)
            expect(requiredMatches?.length).toBeLessThanOrEqual(2) // One in input, one in label check
        })
    })

    describe('Error Prevention', () => {
        test('should handle malformed shorthand gracefully', () => {
            const content = `
@field{unclosed_brace: []
@field*unclosed: []
@field}: []
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should not break the parsing
            expect(html).toBeTruthy()
            expect(typeof html).toBe('string')
        })

        test('should handle empty or invalid options gracefully', () => {
            const content = `
@empty_radio{}: r[]
@invalid_checkbox{}: c[]
@valid_select{A,B,C}: s[]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Empty radio should fallback to text input
            expect(html).toMatch(/type="text"[^>]*id="empty_radio"/)
            
            // Empty checkbox should be single checkbox
            expect(html).toMatch(/type="checkbox"[^>]*id="invalid_checkbox"/)
            
            // Valid select should work normally
            expect(html).toContain('<option value="A">A</option>')
        })

        test('should validate field names', () => {
            const content = `
@123invalid: []
@_underscore_start: []
@valid_name: []
@: []
`
            const parsed = parser.parseFormdown(content)
            
            // Should reject field names starting with numbers or empty names
            const validFields = parsed.forms.filter(f => f.name && f.name.length > 0)
            expect(validFields.every(f => !/^\d/.test(f.name))).toBe(true)
        })
    })
})