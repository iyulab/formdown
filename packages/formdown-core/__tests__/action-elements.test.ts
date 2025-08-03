import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Action Elements - New Syntax', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Parser - Action Element Syntax', () => {
        test('should parse submit action element', () => {
            const content = '@[submit "Send Message"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            const field = result.forms[0]
            expect(field.type).toBe('button')
            expect(field.label).toBe('Send Message')
            expect(field.attributes?.type).toBe('submit')
        })

        test('should parse reset action element', () => {
            const content = '@[reset "Clear Form"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            const field = result.forms[0]
            expect(field.type).toBe('button')
            expect(field.label).toBe('Clear Form')
            expect(field.attributes?.type).toBe('reset')
        })

        test('should parse button action element with onclick', () => {
            const content = '@[button "Calculate" onclick="calculate()"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            const field = result.forms[0]
            expect(field.type).toBe('button')
            expect(field.label).toBe('Calculate')
            expect(field.attributes?.type).toBe('button')
            expect(field.attributes?.onclick).toBe('calculate()')
        })

        test('should parse image action element', () => {
            const content = '@[image "Submit" src="/images/submit.png"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            const field = result.forms[0]
            expect(field.type).toBe('image')
            expect(field.label).toBe('Submit')
            expect(field.attributes?.type).toBe('image')
            expect(field.attributes?.src).toBe('/images/submit.png')
        })

        test('should parse action element with multiple attributes', () => {
            const content = '@[button "Advanced" class="btn-primary" data-action="process"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            const field = result.forms[0]
            expect(field.attributes?.class).toBe('btn-primary')
            expect(field.attributes?.['data-action']).toBe('process')
        })

        test('should not parse invalid action types', () => {
            const content = '@[invalid "Test"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(0)
        })

        test('should not parse malformed action syntax', () => {
            const invalidSyntaxes = [
                '@[submit]',           // Missing label
                '@[submit Test]',      // Missing quotes
                '@submit "Test"]',     // Missing opening bracket
                '@[submit "Test"',     // Missing closing bracket
            ]

            invalidSyntaxes.forEach(syntax => {
                const result = parser.parseFormdown(syntax)
                expect(result.forms).toHaveLength(0)
            })
        })
    })

    describe('Generator - Action Element HTML', () => {
        test('should generate submit button HTML', () => {
            const field = {
                name: 'submit_123',
                type: 'button',
                label: 'Send Message',
                attributes: { type: 'submit' }
            }
            
            const html = generator.generateFieldHTML(field, 'test-form')
            
            expect(html).toContain('<button type="submit"')
            expect(html).toContain('form="test-form"')
            expect(html).toContain('>Send Message</button>')
            expect(html).toContain('id="submit_123"')
        })

        test('should generate reset button HTML', () => {
            const field = {
                name: 'reset_456',
                type: 'button',
                label: 'Clear Form',
                attributes: { type: 'reset' }
            }
            
            const html = generator.generateFieldHTML(field, 'test-form')
            
            expect(html).toContain('<button type="reset"')
            expect(html).toContain('form="test-form"')
            expect(html).toContain('>Clear Form</button>')
        })

        test('should generate button with custom attributes', () => {
            const field = {
                name: 'calc_789',
                type: 'button',
                label: 'Calculate',
                attributes: { 
                    type: 'button',
                    onclick: 'calculate()',
                    class: 'btn-primary'
                }
            }
            
            const html = generator.generateFieldHTML(field, 'test-form')
            
            expect(html).toContain('<button type="button"')
            expect(html).toContain('onclick="calculate()"')
            expect(html).toContain('class="btn-primary"')
            expect(html).toContain('>Calculate</button>')
        })

        test('should generate image input HTML', () => {
            const field = {
                name: 'image_submit',
                type: 'image',
                label: 'Submit Form',
                attributes: { 
                    type: 'image',
                    src: '/images/submit.png',
                    alt: 'Submit'
                }
            }
            
            const html = generator.generateFieldHTML(field, 'test-form')
            
            expect(html).toContain('<input type="image"')
            expect(html).toContain('src="/images/submit.png"')
            expect(html).toContain('alt="Submit"')
            expect(html).toContain('form="test-form"')
        })

        test('should handle image without src attribute', () => {
            const field = {
                name: 'image_no_src',
                type: 'image',
                label: 'Submit',
                attributes: { type: 'image' }
            }
            
            const html = generator.generateFieldHTML(field, 'test-form')
            
            expect(html).toContain('<input type="image"')
            expect(html).toContain('src=""') // Empty src but still valid HTML
            expect(html).toContain('alt="Submit"')
        })
    })

    describe('Backward Compatibility', () => {
        test('should still support old button syntax', () => {
            const content = '@submit_btn: [submit label="Send Message"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            const field = result.forms[0]
            expect(field.name).toBe('submit_btn')
            expect(field.type).toBe('submit')
            expect(field.label).toBe('Send Message')
        })

        test('should support both syntaxes in same document', () => {
            const content = `
@name: [text required]
@[submit "Send Message"]
@reset_btn: [reset label="Clear"]
@[button "Calculate" onclick="calc()"]
`
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(4)
            
            // Text field (standard syntax)
            expect(result.forms[0].name).toBe('name')
            expect(result.forms[0].type).toBe('text')
            
            // Submit (new syntax)
            expect(result.forms[1].type).toBe('button')
            expect(result.forms[1].attributes?.type).toBe('submit')
            expect(result.forms[1].label).toBe('Send Message')
            
            // Reset (old syntax)
            expect(result.forms[2].name).toBe('reset_btn')
            expect(result.forms[2].type).toBe('reset')
            
            // Button (new syntax)
            expect(result.forms[3].type).toBe('button')
            expect(result.forms[3].attributes?.type).toBe('button')
            expect(result.forms[3].attributes?.onclick).toBe('calc()')
        })
    })

    describe('End-to-End Integration', () => {
        test('should generate complete HTML from action element syntax', () => {
            const content = `
# Contact Form

@name: [text required]
@email: [email required]

@[submit "Send Message"]
@[reset "Clear Form"]
`
            
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)
            
            // Should contain hidden form
            expect(html).toContain('<form hidden')
            
            // Should contain input fields with form attribute
            expect(html).toContain('name="name"')
            expect(html).toContain('name="email"')
            expect(html).toContain('type="text"')
            expect(html).toContain('type="email"')
            
            // Should contain action buttons with form attribute
            expect(html).toContain('<button type="submit"')
            expect(html).toContain('>Send Message</button>')
            expect(html).toContain('<button type="reset"')
            expect(html).toContain('>Clear Form</button>')
            
            // All elements should reference the same form
            const formIdMatches = html.match(/form="([^"]+)"/g)
            expect(formIdMatches).toBeTruthy()
            if (formIdMatches) {
                const formIds = formIdMatches.map(match => match.split('"')[1])
                const uniqueFormIds = [...new Set(formIds)]
                expect(uniqueFormIds).toHaveLength(1) // All should use same form ID
            }
        })
    })
})