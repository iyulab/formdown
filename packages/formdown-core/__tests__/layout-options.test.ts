/**
 * Layout Options Tests
 * Tests for form-level and field-level layout attributes (#7)
 */

import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Layout Options', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Form-Level Layout Options', () => {
        it('should generate data-layout attribute for layout option', () => {
            const content = `
@form[id="myform" layout="horizontal"]

@name: []
@email: @[]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('data-layout="horizontal"')
        })

        it('should generate CSS custom property for label-width', () => {
            const content = `
@form[id="myform" layout="horizontal" label-width="120px"]

@name: []
@email: @[]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('--formdown-label-width: 120px')
        })

        it('should generate CSS custom property for columns', () => {
            const content = `
@form[id="myform" columns="2"]

@name: []
@email: @[]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('--formdown-columns: 2')
        })

        it('should generate CSS custom property for gap', () => {
            const content = `
@form[id="myform" gap="1rem"]

@name: []
@email: @[]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('--formdown-gap: 1rem')
        })

        it('should support multiple layout options together', () => {
            const content = `
@form[id="myform" layout="grid" columns="3" gap="20px" label-width="100px"]

@name: []
@email: @[]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('data-layout="grid"')
            expect(html).toContain('--formdown-columns: 3')
            expect(html).toContain('--formdown-gap: 20px')
            expect(html).toContain('--formdown-label-width: 100px')
        })

        it('should support custom CSS properties on forms', () => {
            const content = `
@form[id="myform" --custom-color="blue" --custom-spacing="10px"]

@name: []
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('--custom-color: blue')
            expect(html).toContain('--custom-spacing: 10px')
        })

        it('should escape HTML in layout values', () => {
            const content = `
@form[id="myform" layout="<script>alert(1)</script>"]

@name: []
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).not.toContain('<script>')
            expect(html).toContain('&lt;script&gt;')
        })
    })

    describe('Field-Level Layout Options', () => {
        it('should generate width style for field-level width attribute', () => {
            const content = `
@name: [width="50%"]
@email: @[]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('style="width: 50%"')
        })

        it('should generate grid-column for field-level span attribute', () => {
            const content = `
@name: []
@description: [textarea span="2"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('grid-column: span 2')
        })

        it('should support multiple field-level layout attributes', () => {
            const content = `
@comments: [textarea width="100%" span="3"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('width: 100%')
            expect(html).toContain('grid-column: span 3')
        })

        it('should support custom CSS properties on fields', () => {
            const content = `
@name: [--field-bg="lightgray" --field-padding="10px"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('--field-bg: lightgray')
            expect(html).toContain('--field-padding: 10px')
        })

        it('should escape HTML in field layout values', () => {
            const content = `
@name: [width="<script>alert(1)</script>"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).not.toContain('<script>')
            expect(html).toContain('&lt;script&gt;')
        })

        it('should combine conditional and layout attributes on same field', () => {
            const content = `
@show_more: c[]
@details: [textarea width="100%" visible-if="show_more"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('style="width: 100%"')
            expect(html).toContain('data-visible-if-field="show_more"')
            expect(html).toContain('formdown-conditional')
        })
    })

    describe('Real-World Layout Scenarios', () => {
        it('should handle horizontal contact form layout', () => {
            const content = `
@form[id="contact" layout="horizontal" label-width="150px"]

@name*: []
@email*: @[]
@phone: [tel]
@message*: [textarea]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('data-layout="horizontal"')
            expect(html).toContain('--formdown-label-width: 150px')
            expect(result.forms.length).toBe(4)
        })

        it('should handle grid layout with column spanning', () => {
            const content = `
@form[id="registration" layout="grid" columns="2" gap="16px"]

@first_name*: []
@last_name*: []
@email*: @[span="2"]
@address: [span="2"]
@city: []
@zip: [width="120px"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('data-layout="grid"')
            expect(html).toContain('--formdown-columns: 2')
            expect(html).toContain('--formdown-gap: 16px')
            // Email should span 2 columns
            expect(html).toContain('grid-column: span 2')
        })

        it('should handle mixed layout with conditional fields', () => {
            const content = `
@form[id="order" layout="grid" columns="2"]

@order_type{Personal,Business}: r[]
@company_name: [span="2" visible-if="order_type=Business"]
@first_name*: []
@last_name*: []
@email*: @[span="2"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            // Company name should have both span and conditional
            expect(html).toContain('grid-column: span 2')
            expect(html).toContain('data-visible-if-field="order_type"')
            expect(html).toContain('data-visible-if-value="Business"')
        })
    })
})
