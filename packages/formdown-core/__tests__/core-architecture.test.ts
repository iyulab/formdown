/**
 * @fileoverview Core Architecture Tests
 * Tests for the main architectural components and their integration
 */

import { 
    parseFormdown, 
    generateFormHTML, 
    getSchema,
    FormdownParser,
    FormdownGenerator,
    SchemaExtractor,
    extensionManager
} from '../src/index'

describe('Core Architecture', () => {
    beforeAll(async () => {
        // Initialize extension system once for all tests
        try {
            await extensionManager.initialize()
        } catch (error) {
            // Ignore if already initialized
            if (!(error instanceof Error) || !error.message?.includes('already registered')) {
                throw error
            }
        }
    })

    afterAll(async () => {
        // Clean up extension system after all tests
        await extensionManager.destroy()
    })

    describe('Parser Role', () => {
        test('should parse formdown syntax to structured data', () => {
            const input = `
# Contact Form
Please fill out your information.

@name: [text required]
@email: [email required]
@message: [textarea rows=5]
`
            const result = parseFormdown(input)
            
            expect(result).toHaveProperty('markdown')
            expect(result).toHaveProperty('forms')
            expect(result.forms).toHaveLength(3)
            
            // Check field structure
            expect(result.forms[0]).toMatchObject({
                name: 'name',
                type: 'text',
                label: 'Name',
                required: true
            })
            
            expect(result.forms[1]).toMatchObject({
                name: 'email', 
                type: 'email',
                label: 'Email',
                required: true
            })
            
            expect(result.forms[2]).toMatchObject({
                name: 'message',
                type: 'textarea',
                label: 'Message'
            })
        })

        test('should handle shorthand syntax', () => {
            const input = '@email*: @[]'
            const result = parseFormdown(input)
            
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toMatchObject({
                name: 'email',
                type: 'email',
                required: true
            })
        })

        test('should handle inline fields', () => {
            const input = 'Your name is ___@name[text] and email is ___@email[email]'
            const result = parseFormdown(input)
            
            expect(result.forms).toHaveLength(2)
            expect(result.forms[0].inline).toBe(true)
            expect(result.forms[1].inline).toBe(true)
        })
    })

    describe('HTML Generation Role', () => {
        test('should generate valid HTML from parsed formdown', () => {
            const input = '@name: [text required]\n@email: [email required]'
            const parsed = parseFormdown(input)
            const html = generateFormHTML(parsed)
            
            expect(html).toContain('<form class="formdown-form"')
            expect(html).toContain('type="text"')
            expect(html).toContain('type="email"')
            expect(html).toContain('required')
            expect(html).toContain('label for="name"')
            expect(html).toContain('label for="email"')
        })

        test('should preserve markdown content', () => {
            const input = `
# Contact Form
Please fill out your information.

@name: [text required]
`
            const parsed = parseFormdown(input)
            const html = generateFormHTML(parsed)
            
            expect(html).toContain('<h1>Contact Form</h1>')
            expect(html).toContain('<p>Please fill out your information.</p>')
        })

        test('should handle complex field types', () => {
            const input = '@size: [select options="S,M,L,XL"]'
            const parsed = parseFormdown(input)
            const html = generateFormHTML(parsed)
            
            expect(html).toContain('<select')
            expect(html).toContain('<option value="S">S</option>')
            expect(html).toContain('<option value="M">M</option>')
        })
    })

    describe('Schema Extraction Role', () => {
        test('should extract structured schema from formdown', () => {
            const input = `
@name: [text required minlength=2]
@email: [email required]
@age: [number min=18 max=120]
@terms: [checkbox required]
`
            const schema = getSchema(input)
            
            expect(schema).toHaveProperty('name')
            expect(schema).toHaveProperty('email')
            expect(schema).toHaveProperty('age')
            expect(schema).toHaveProperty('terms')
            
            // Check field schema structure
            expect(schema.name).toMatchObject({
                type: 'text',
                label: 'Name',
                required: true,
                position: 1,
                validation: {
                    minlength: 2
                }
            })
            
            expect(schema.age).toMatchObject({
                type: 'number',
                validation: {
                    min: 18,
                    max: 120
                }
            })
        })

        test('should extract validation rules correctly', () => {
            const input = '@phone: [tel pattern="\\\\d{3}-\\\\d{4}-\\\\d{4}"]'
            const schema = getSchema(input)
            
            expect(schema.phone.validation).toMatchObject({
                pattern: '\\\\d{3}-\\\\d{4}-\\\\d{4}'
            })
        })

        test('should handle inline field positions', () => {
            const input = 'Name: ___@name[text] Email: ___@email[email]'
            const schema = getSchema(input)
            
            expect(schema.name.isInline).toBe(true)
            expect(schema.email.isInline).toBe(true)
            expect(schema.name.position).toBe(1)
            expect(schema.email.position).toBe(2)
        })
    })

    describe('Class-based API', () => {
        test('FormdownParser should work independently', () => {
            const parser = new FormdownParser()
            const result = parser.parseFormdown('@name: [text]')
            
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0].name).toBe('name')
        })

        test('FormdownGenerator should work independently', () => {
            const generator = new FormdownGenerator()
            const content = {
                markdown: '<!--FORMDOWN_FIELD_0-->\n\n# Test Form',
                forms: [{
                    name: 'test',
                    type: 'text',
                    label: 'Test',
                    attributes: { form: "formdown-form-default" }
                }]
            }
            
            const html = generator.generateHTML(content)
            expect(html).toContain('<h1>Test Form</h1>')
            expect(html).toContain('type="text"')
            expect(html).toContain('class="formdown-form"')
        })

        test('SchemaExtractor should work independently', () => {
            const extractor = new SchemaExtractor()
            const schema = extractor.extractSchema('@name: [text required]')
            
            expect(schema.name).toMatchObject({
                type: 'text',
                required: true
            })
        })
    })

    describe('Extension System Integration', () => {
        test('should provide access to extension system', () => {
            expect(extensionManager).toBeDefined()
            expect(extensionManager.getStats).toBeDefined()
            
            const stats = extensionManager.getStats()
            expect(stats).toHaveProperty('initialized')
            expect(stats).toHaveProperty('plugins')
            expect(stats).toHaveProperty('fieldTypes')
        })

        test('should allow plugin registration', async () => {
            const testPlugin = {
                metadata: {
                    name: 'test-plugin',
                    version: '1.0.0',
                    description: 'Test plugin'
                },
                fieldTypes: [{
                    type: 'custom-test',
                    defaultAttributes: { 'data-custom': 'true' }
                }]
            }
            
            await extensionManager.registerPlugin(testPlugin)
            
            const stats = extensionManager.getStats()
            expect(stats.plugins.some(p => p.name === 'test-plugin')).toBe(true)
            expect(stats.fieldTypes.includes('custom-test')).toBe(true)
        })
    })

    describe('Error Handling', () => {
        test('should handle malformed formdown gracefully', () => {
            const input = '@: [invalid]'  // Invalid field name
            const result = parseFormdown(input)
            
            expect(result.forms).toHaveLength(0)  // Should skip invalid fields
        })

        test('should handle empty input', () => {
            const result = parseFormdown('')
            expect(result.forms).toHaveLength(0)
            expect(result.markdown).toBe('')
        })

        test('should handle schema extraction on empty input', () => {
            const schema = getSchema('')
            expect(schema).toEqual({})
        })
    })

    describe('Performance Requirements', () => {
        test('should parse large forms efficiently', () => {
            // Generate a large form with 100 fields
            const fields = Array.from({ length: 100 }, (_, i) => 
                `@field${i}: [text required]`
            ).join('\n')
            
            const start = performance.now()
            const result = parseFormdown(fields)
            const end = performance.now()
            
            expect(result.forms).toHaveLength(100)
            expect(end - start).toBeLessThan(1000) // Should parse in under 1 second
        })

        test('should generate HTML for large forms efficiently', () => {
            const fieldPlaceholders = Array.from({ length: 50 }, (_, i) => `<!--FORMDOWN_FIELD_${i}-->`).join('\n')
            const fields = Array.from({ length: 50 }, (_, i) => ({
                name: `field${i}`,
                type: 'text',
                label: `Field ${i}`,
                attributes: { form: "formdown-form-default" }
            }))
            
            const content = {
                markdown: `${fieldPlaceholders}\n\n# Large Form`,
                forms: fields
            }
            
            const start = performance.now()
            const html = generateFormHTML(content)
            const end = performance.now()
            
            expect(html).toContain('class="formdown-form"')
            expect(html).toContain('<h1>Large Form</h1>')
            expect(end - start).toBeLessThan(500) // Should generate in under 0.5 seconds
        })
    })
})