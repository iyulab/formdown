import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('HTML5 Compliance', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Form Structure', () => {
        test('should generate forms with proper structure', () => {
            const content = `
@name: [text required]
@email: [email required]
@submit: [submit]
            `.trim()

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should have multiple forms (one per field due to field ordering fix)
            const formMatches = html.match(/<form/g)
            expect(formMatches).toHaveLength(3) // One form per field
            
            // Each form should have proper attributes
            expect(html).toContain('<form class="formdown-form" role="form"')
            
            // Should not have nested forms within each individual form
            const formBlocks = html.split('</form>')
            formBlocks.slice(0, -1).forEach(formBlock => {
                const nestedFormMatches = formBlock.match(/<form/g)
                expect(nestedFormMatches).toHaveLength(1) // Only one form tag per block
            })
        })

        test('should properly associate labels with inputs', () => {
            const content = '@username: [text]\n@email: [email]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Each label should have matching for/id attributes
            expect(html).toMatch(/<label for="username">[\s\S]*<input[^>]*id="username"/)
            expect(html).toMatch(/<label for="email">[\s\S]*<input[^>]*id="email"/)
        })

        test('should use fieldset for radio and checkbox groups', () => {
            const content = `
@gender{Male,Female}: r[]
@interests{Web,Mobile}: c[]
            `.trim()

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should have fieldset elements with legends
            expect(html).toMatch(/<fieldset[^>]*>[\s\S]*<legend>Gender<\/legend>/)
            expect(html).toMatch(/<fieldset[^>]*>[\s\S]*<legend>Interests<\/legend>/)
            
            // Should have proper ARIA roles
            expect(html).toMatch(/role="radiogroup"/)
            expect(html).toMatch(/role="group"/)
        })
    })

    describe('Input Validation', () => {
        test('should preserve HTML5 validation attributes', () => {
            const content = `
@username: [text required minlength=3 maxlength=20]
@age: [number min=13 max=120]
@email: [email required]
            `.trim()

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('required')
            expect(html).toContain('minlength="3"')
            expect(html).toContain('maxlength="20"')
            expect(html).toContain('min="13"')
            expect(html).toContain('max="120"')
            expect(html).toContain('type="email"')
        })

        test('should handle custom HTML attributes', () => {
            const content = '@field: [text class="custom" data-test="value" aria-label="Custom field"]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('class="custom"')
            expect(html).toContain('data-test="value"')
            expect(html).toContain('aria-label="Custom field"')
        })
    })

    describe('Accessibility', () => {
        test('should generate ARIA attributes for field descriptions', () => {
            const content = '@username: [text]'
            const parsed = parser.parseFormdown(content)
            
            // Add description to test ARIA generation
            parsed.forms[0].description = "Enter your username"
            
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('aria-describedby="username-description"')
            expect(html).toContain('id="username-description"')
            expect(html).toContain('class="formdown-field-description"')
        })

        test('should generate ARIA attributes for error messages', () => {
            const content = '@email: [email]'
            const parsed = parser.parseFormdown(content)
            
            // Add error message to test ARIA generation
            parsed.forms[0].errorMessage = "Invalid email format"
            
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('aria-describedby="email-error"')
            expect(html).toContain('id="email-error"')
            expect(html).toContain('class="formdown-field-error"')
            expect(html).toContain('role="alert"')
        })

        test('should handle required field indicators', () => {
            const content = '@name: [text required]\n@optional: [text]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Required fields should have asterisk in label
            expect(html).toMatch(/<label[^>]*>Name \*<\/label>/)
            expect(html).toMatch(/<label[^>]*>Optional<\/label>/)
        })
    })

    describe('Input Types', () => {
        test('should generate all supported input types correctly', () => {
            const content = `
@text_field: [text]
@email_field: [email]
@password_field: [password]
@number_field: [number]
@tel_field: [tel]
@url_field: [url]
@date_field: [date]
@time_field: [time]
@file_field: [file]
@color_field: [color]
@range_field: [range]
            `.trim()

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('type="text"')
            expect(html).toContain('type="email"')
            expect(html).toContain('type="password"')
            expect(html).toContain('type="number"')
            expect(html).toContain('type="tel"')
            expect(html).toContain('type="url"')
            expect(html).toContain('type="date"')
            expect(html).toContain('type="time"')
            expect(html).toContain('type="file"')
            expect(html).toContain('type="color"')
            expect(html).toContain('type="range"')
        })

        test('should generate textarea correctly', () => {
            const content = '@message: [textarea rows=5 cols=40]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('<textarea')
            expect(html).toContain('rows="5"')
            expect(html).toContain('cols="40"')
            expect(html).toContain('name="message"')
            expect(html).toContain('id="message"')
        })
    })
})