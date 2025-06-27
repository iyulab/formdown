import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('UI Rendering Tests', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('HTML5 Compliance', () => {
        test('should generate single form for multiple block fields', () => {
            const content = `
# Registration Form

@username*: []
@email*: @[]
@password*: ?[]
@submit: [submit label="Register"]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should contain only one <form> tag
            const formMatches = html.match(/<form/g)
            expect(formMatches).toHaveLength(1)
            
            // Should contain all fields within the single form
            expect(html).toContain('name="username"')
            expect(html).toContain('name="email"')
            expect(html).toContain('name="password"')
            expect(html).toContain('type="submit"')
        })

        test('should separate inline and block fields correctly', () => {
            const content = `
# Contact Form

Hello ___@name*, your email is ___@email*.

@message*: T4[]
@submit: [submit]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should have inline spans
            expect(html).toContain('class="formdown-inline-field"')
            expect(html).toContain('contenteditable="true"')
            
            // Should have one form for block fields
            const formMatches = html.match(/<form/g)
            expect(formMatches).toHaveLength(1)
            
            // Form should contain block fields only
            expect(html).toContain('name="message"')
            expect(html).toContain('type="submit"')
        })

        test('should generate proper accessibility attributes', () => {
            const content = `
@username(Username)*: [description="Enter your username"]
@age: #[description="Your age in years"]
`
            const parsed = parser.parseFormdown(content)
            parsed.forms[0].description = "Enter your username"
            parsed.forms[1].description = "Your age in years"
            
            const html = generator.generateHTML(parsed)
            
            // Should have aria-describedby attributes
            expect(html).toContain('aria-describedby="username-description"')
            expect(html).toContain('aria-describedby="age-description"')
            
            // Should have description elements
            expect(html).toContain('id="username-description"')
            expect(html).toContain('id="age-description"')
            expect(html).toContain('class="formdown-field-description"')
        })

        test('should generate proper radio group structure', () => {
            const content = `@size{S,M,L,XL}: r[]`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should use fieldset and legend
            expect(html).toContain('<fieldset')
            expect(html).toContain('<legend>Size</legend>')
            
            // Should have role="radiogroup"
            expect(html).toContain('role="radiogroup"')
            
            // Should have proper radio inputs
            expect(html).toContain('type="radio"')
            expect(html).toContain('name="size"')
            expect(html).toContain('value="S"')
            expect(html).toContain('value="M"')
        })

        test('should generate proper checkbox group structure', () => {
            const content = `@interests{Web,Mobile,AI}: c[]`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should use fieldset and legend
            expect(html).toContain('<fieldset')
            expect(html).toContain('<legend>Interests</legend>')
            
            // Should have role="group"
            expect(html).toContain('role="group"')
            
            // Should have proper checkbox inputs
            expect(html).toContain('type="checkbox"')
            expect(html).toContain('name="interests"')
            expect(html).toContain('value="Web"')
            expect(html).toContain('value="Mobile"')
        })
    })

    describe('Extended HTML5 Input Types', () => {
        test('should support range input type', () => {
            const content = `@volume: R[min=0 max=100 step=5]`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('type="range"')
            expect(html).toContain('name="volume"')
            expect(html).toContain('min="0"')
            expect(html).toContain('max="100"')
            expect(html).toContain('step="5"')
            expect(html).toContain('<output for="volume"')
        })

        test('should support file input type', () => {
            const content = `@avatar: F[accept="image/*"]`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('type="file"')
            expect(html).toContain('name="avatar"')
            expect(html).toContain('accept="image/*"')
        })

        test('should support color input type', () => {
            const content = `@theme_color: C[]`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('type="color"')
            expect(html).toContain('name="theme_color"')
        })

        test('should support week input type', () => {
            const content = `@work_week: W[]`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('type="week"')
            expect(html).toContain('name="work_week"')
        })

        test('should support month input type', () => {
            const content = `@birth_month: M[]`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('type="month"')
            expect(html).toContain('name="birth_month"')
        })
    })

    describe('Shorthand Syntax Rendering', () => {
        test('should render shorthand required fields correctly', () => {
            const content = `@name*: []`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('required')
            expect(html).toContain('Name *')
            expect(html).toContain('name="name"')
        })

        test('should render shorthand type markers correctly', () => {
            const content = `
@email: @[]
@age: #[]
@phone: %[]
@website: &[]
@password: ?[]
@birth_date: d[]
@meeting_time: t[]
@appointment: dt[]
@description: T[]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('type="email"')
            expect(html).toContain('type="number"')
            expect(html).toContain('type="tel"')
            expect(html).toContain('type="url"')
            expect(html).toContain('type="password"')
            expect(html).toContain('type="date"')
            expect(html).toContain('type="time"')
            expect(html).toContain('type="datetime-local"')
            expect(html).toContain('<textarea')
        })

        test('should render shorthand content patterns correctly', () => {
            const content = `
@username{^[a-zA-Z0-9_]{3,20}$}: []
@size{S,M,L,XL}: r[]
@birth_date{yyyy-MM-dd}: d[]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Pattern validation
            expect(html).toContain('pattern="^[a-zA-Z0-9_]{3,20}$"')
            
            // Radio options
            expect(html).toContain('value="S"')
            expect(html).toContain('value="M"')
            expect(html).toContain('value="L"')
            expect(html).toContain('value="XL"')
            
            // Date format
            expect(html).toContain('format="yyyy-MM-dd"')
        })

        test('should render textarea with rows from shorthand', () => {
            const content = `@notes: T4[]`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('<textarea')
            expect(html).toContain('rows="4"')
            expect(html).toContain('name="notes"')
        })
    })

    describe('Inline Field Rendering', () => {
        test('should render inline fields as contenteditable spans', () => {
            const content = `Hello ___@name[text required]!`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('contenteditable="true"')
            expect(html).toContain('data-field-name="name"')
            expect(html).toContain('data-field-type="text"')
            expect(html).toContain('class="formdown-inline-field"')
            expect(html).toContain('role="textbox"')
        })

        test('should render shorthand inline fields correctly', () => {
            const content = `
Hello ___@name*!
Your email: @___@email*
Age: #___@age
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('data-field-type="text"')
            expect(html).toContain('data-field-type="email"')
            expect(html).toContain('data-field-type="number"')
            expect(html).toContain('data-required="true"')
        })

        test('should not create form elements for inline fields', () => {
            const content = `Contact: ___@email*, Phone: ___@phone`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Should not contain any form tags (no block fields)
            expect(html).not.toContain('<form')
            
            // But should contain inline spans
            expect(html).toContain('contenteditable="true"')
            expect(html).toContain('data-field-name="email"')
            expect(html).toContain('data-field-name="phone"')
        })
    })

    describe('Error Handling and Edge Cases', () => {
        test('should handle empty content gracefully', () => {
            const content = ``
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toBe('')
        })

        test('should handle invalid field syntax gracefully', () => {
            const content = `
@: []
@123invalid: []
Normal text without fields
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('Normal text without fields')
            // Should not contain invalid fields
            expect(html).not.toContain('name=""')
            expect(html).not.toContain('name="123invalid"')
        })

        test('should preserve markdown content with fields', () => {
            const content = `
# Registration Form

Please **fill out** the form below:

@name*: []
@email*: @[]

*All fields are required*
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('<h1>Registration Form</h1>')
            expect(html).toContain('<strong>fill out</strong>')
            expect(html).toContain('<em>All fields are required</em>')
            expect(html).toContain('name="name"')
            expect(html).toContain('name="email"')
        })
    })

    describe('Validation and Required Fields', () => {
        test('should add required attribute for required fields', () => {
            const content = `
@name*: []
@email: @[required]
@optional: []
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Required via shorthand
            expect(html).toContain('name="name"')
            expect(html).toMatch(/name="name"[^>]*required/)
            
            // Required via attribute
            expect(html).toContain('name="email"')
            expect(html).toMatch(/name="email"[^>]*required/)
            
            // Not required
            expect(html).toContain('name="optional"')
            expect(html).not.toMatch(/name="optional"[^>]*required/)
        })

        test('should show required indicator in labels', () => {
            const content = `
@name*: []
@email(Email Address)*: @[]
@optional: []
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('Name *')
            expect(html).toContain('Email Address *')
            expect(html).toContain('>Optional<') // No asterisk
        })
    })
})