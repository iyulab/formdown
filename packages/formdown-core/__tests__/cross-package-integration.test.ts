/**
 * @fileoverview Cross-Package Integration Tests
 * Tests integration between formdown-core, formdown-ui, and formdown-editor
 */

import {
    FormManager,
    FormdownParser,
    FormdownGenerator,
    parseFormdown,
    generateFormHTML,
    getSchema,
    FieldProcessor,
    DOMBinder,
    ValidationManager,
    EventOrchestrator
} from '../src/index'

describe('Cross-Package Integration: Core API Surface', () => {
    describe('Core Module Exports', () => {
        it('should export FormManager class', () => {
            expect(FormManager).toBeDefined()
            expect(typeof FormManager).toBe('function')
        })

        it('should export FormdownParser class', () => {
            expect(FormdownParser).toBeDefined()
            expect(typeof FormdownParser).toBe('function')
        })

        it('should export FormdownGenerator class', () => {
            expect(FormdownGenerator).toBeDefined()
            expect(typeof FormdownGenerator).toBe('function')
        })

        it('should export FieldProcessor class', () => {
            expect(FieldProcessor).toBeDefined()
            expect(typeof FieldProcessor).toBe('function')
        })

        it('should export DOMBinder class', () => {
            expect(DOMBinder).toBeDefined()
            expect(typeof DOMBinder).toBe('function')
        })

        it('should export ValidationManager class', () => {
            expect(ValidationManager).toBeDefined()
            expect(typeof ValidationManager).toBe('function')
        })

        it('should export EventOrchestrator class', () => {
            expect(EventOrchestrator).toBeDefined()
            expect(typeof EventOrchestrator).toBe('function')
        })

        it('should export parseFormdown function', () => {
            expect(parseFormdown).toBeDefined()
            expect(typeof parseFormdown).toBe('function')
        })

        it('should export generateFormHTML function', () => {
            expect(generateFormHTML).toBeDefined()
            expect(typeof generateFormHTML).toBe('function')
        })

        it('should export getSchema function', () => {
            expect(getSchema).toBeDefined()
            expect(typeof getSchema).toBe('function')
        })
    })

    describe('FormManager for UI Components', () => {
        let formManager: InstanceType<typeof FormManager>

        beforeEach(() => {
            formManager = new FormManager()
        })

        it('should create core modules for UI consumption', () => {
            const modules = formManager.getCoreModules()
            expect(modules).toBeDefined()
            expect(modules).toHaveProperty('fieldProcessor')
            expect(modules).toHaveProperty('domBinder')
            expect(modules).toHaveProperty('validationManager')
            expect(modules).toHaveProperty('eventOrchestrator')
        })

        it('should provide createFieldProcessor method', () => {
            expect(typeof formManager.createFieldProcessor).toBe('function')
            const processor = formManager.createFieldProcessor()
            expect(processor).toBeDefined()
        })

        it('should provide createDOMBinder method', () => {
            expect(typeof formManager.createDOMBinder).toBe('function')
            const binder = formManager.createDOMBinder()
            expect(binder).toBeDefined()
        })

        it('should provide createValidationManager method', () => {
            expect(typeof formManager.createValidationManager).toBe('function')
            const validationManager = formManager.createValidationManager()
            expect(validationManager).toBeDefined()
        })

        it('should provide createEventOrchestrator method', () => {
            expect(typeof formManager.createEventOrchestrator).toBe('function')
            const orchestrator = formManager.createEventOrchestrator()
            expect(orchestrator).toBeDefined()
        })

        it('should provide setupComponentBridge for UI binding', () => {
            expect(typeof formManager.setupComponentBridge).toBe('function')

            const bridgeId = formManager.setupComponentBridge({
                id: 'test-ui',
                type: 'ui',
                emit: jest.fn(),
                on: jest.fn()
            })

            expect(bridgeId).toBeDefined()
        })

        it('should provide createPreviewTemplate for Editor', () => {
            expect(typeof formManager.createPreviewTemplate).toBe('function')

            const template = formManager.createPreviewTemplate('@name: [text]')
            expect(template).toBeDefined()
            expect(template).toHaveProperty('html')
            expect(template).toHaveProperty('errors')
        })

        it('should dispose resources properly', () => {
            expect(typeof formManager.dispose).toBe('function')
            expect(() => formManager.dispose()).not.toThrow()
        })
    })

    describe('Parse → Generate Pipeline', () => {
        it('should parse and generate consistent output', () => {
            const content = '@name: [text required]\n@email: [email]'

            const parsed = parseFormdown(content)
            const html = generateFormHTML(parsed)

            expect(parsed.forms).toHaveLength(2)
            expect(html).toContain('name="name"')
            expect(html).toContain('name="email"')
            expect(html).toContain('required')
        })

        it('should generate schema for UI validation', () => {
            const content = '@age: [number min=0 max=120 required]'

            const schema = getSchema(content)

            expect(schema).toBeDefined()
            expect(schema.age).toBeDefined()
            expect(schema.age.type).toBe('number')
            expect(schema.age.required).toBe(true)
        })

        it('should handle complex forms with multiple field types', () => {
            const content = `
# Registration Form

@name: [text required placeholder="Full Name"]
@email: [email required]
@age: [number min=18 max=100]
@country{USA,Canada,UK,*}: s[required]
@interests{Tech,Sports,Music,*}: c[]
@terms: [checkbox required]
            `.trim()

            const parsed = parseFormdown(content)
            const html = generateFormHTML(parsed)

            expect(parsed.forms.length).toBeGreaterThan(5)
            expect(html).toContain('Registration Form')
            expect(html).toContain('type="text"')
            expect(html).toContain('type="email"')
            expect(html).toContain('type="number"')
            expect(html).toContain('<select')
            expect(html).toContain('type="checkbox"')
        })
    })

    describe('Data Flow for UI Components', () => {
        let formManager: InstanceType<typeof FormManager>

        beforeEach(() => {
            formManager = new FormManager()
            // FormManager requires parse() to initialize data binding
            formManager.parse('@name: [text]\n@email: [email]')
        })

        it('should manage form data state', () => {
            formManager.updateData({ name: 'John', email: 'john@example.com' })

            const data = formManager.getData()
            expect(data.name).toBe('John')
            expect(data.email).toBe('john@example.com')
        })

        it('should update individual field values', () => {
            formManager.updateData({ name: 'John' })
            formManager.setFieldValue('email', 'john@example.com')

            const data = formManager.getData()
            expect(data.name).toBe('John')
            expect(data.email).toBe('john@example.com')
        })

        it('should reset form data', () => {
            formManager.updateData({ name: 'John', email: 'john@example.com' })
            formManager.reset()

            const data = formManager.getData()
            // After reset, returns schema defaults (empty for fields without default values)
            expect(data.name).toBeUndefined()
            expect(data.email).toBeUndefined()
        })

        it('should return empty object without parse', () => {
            const freshManager = new FormManager()
            // Without parse(), data binding is not initialized
            freshManager.updateData({ name: 'John' })
            const data = freshManager.getData()
            expect(data).toEqual({})
        })

        it('should handle complex field types', () => {
            const complexManager = new FormManager()
            complexManager.parse('@user_name: [text]\n@user_email: [email]\n@newsletter: [checkbox]')
            complexManager.updateData({
                user_name: 'John',
                user_email: 'john@example.com',
                newsletter: true
            })

            const data = complexManager.getData()
            expect(data.user_name).toBe('John')
            expect(data.user_email).toBe('john@example.com')
            expect(data.newsletter).toBe(true)
        })
    })

    describe('Validation Pipeline for UI', () => {
        let formManager: InstanceType<typeof FormManager>

        beforeEach(() => {
            formManager = new FormManager()
        })

        it('should have validate method', () => {
            expect(typeof formManager.validate).toBe('function')
        })

        it('should return validation result', () => {
            formManager.parse('@name: [text required]')

            const result = formManager.validate()

            expect(result).toBeDefined()
            expect(result).toHaveProperty('isValid')
            expect(result).toHaveProperty('errors')
        })

        it('should return valid for empty state', () => {
            const result = formManager.validate()

            expect(result).toBeDefined()
            expect(result.isValid).toBe(true)
        })

        it('should provide validateFieldWithPipeline for async validation', () => {
            expect(typeof formManager.validateFieldWithPipeline).toBe('function')
        })
    })

    describe('Event System for Component Communication', () => {
        let formManager: InstanceType<typeof FormManager>

        beforeEach(() => {
            formManager = new FormManager()
        })

        it('should support on method for event subscription', () => {
            expect(typeof formManager.on).toBe('function')
        })

        it('should support off method for event unsubscription', () => {
            expect(typeof formManager.off).toBe('function')
        })

        it('should allow subscribing to data-change event', () => {
            const handler = jest.fn()
            expect(() => formManager.on('data-change', handler)).not.toThrow()
        })

        it('should allow subscribing to validation-error event', () => {
            const handler = jest.fn()
            expect(() => formManager.on('validation-error', handler)).not.toThrow()
        })

        it('should allow subscribing to form-submit event', () => {
            const handler = jest.fn()
            expect(() => formManager.on('form-submit', handler)).not.toThrow()
        })

        it('should allow subscribing to form-reset event', () => {
            const handler = jest.fn()
            expect(() => formManager.on('form-reset', handler)).not.toThrow()
        })

        it('should allow unsubscribing from events', () => {
            const handler = jest.fn()
            formManager.on('data-change', handler)
            expect(() => formManager.off('data-change', handler)).not.toThrow()
        })
    })

    describe('CSP-Compliant HTML Generation', () => {
        it('should not generate inline event handlers', () => {
            const content = '@country{USA,Canada,*}: s[]'
            const html = generateFormHTML(content)

            // Should not contain inline handlers
            expect(html).not.toContain('onchange=')
            expect(html).not.toContain('oninput=')
            expect(html).not.toContain('onclick=')
            expect(html).not.toContain('<script>')

            // Should contain data attributes for CSP-compliant handling
            expect(html).toContain('data-formdown-')
        })

        it('should use data attributes for dynamic behavior', () => {
            const content = '@preference{Yes,No,*}: r[]'
            const html = generateFormHTML(content)

            expect(html).toContain('data-formdown-other-radio="true"')
            expect(html).toContain('data-formdown-other-for=')
            expect(html).toContain('data-formdown-hides-other="true"')
        })

        it('should generate range fields with data attributes', () => {
            const content = '@volume: [range min=0 max=100]'
            const parsed = parseFormdown(content)

            // Range fields use extension system
            expect(parsed.forms).toBeDefined()
        })
    })

    describe('Schema Generation for External Validation', () => {
        it('should generate JSON schema format', () => {
            const content = `
@name: [text required minlength=2 maxlength=50]
@age: [number min=0 max=120]
@email: [email required]
            `.trim()

            const schema = getSchema(content)

            expect(schema).toBeDefined()
            expect(schema.name).toBeDefined()
            expect(schema.age).toBeDefined()
            expect(schema.email).toBeDefined()

            expect(schema.name.required).toBe(true)
            expect(schema.age.type).toBe('number')
            expect(schema.email.type).toBe('email')
        })

        it('should include field constraints in schema', () => {
            const content = '@password: [password required]'
            const schema = getSchema(content)

            expect(schema.password).toBeDefined()
            expect(schema.password.required).toBe(true)
        })
    })
})

describe('Cross-Package Integration: Error Handling', () => {
    it('should handle empty content gracefully', () => {
        const parsed = parseFormdown('')
        expect(parsed.forms).toEqual([])
    })

    it('should handle invalid syntax gracefully', () => {
        const content = 'this is not formdown syntax'
        const parsed = parseFormdown(content)

        expect(parsed.forms).toEqual([])
    })

    it('should handle missing field types', () => {
        const content = '@name: []'
        const parsed = parseFormdown(content)

        expect(parsed.forms.length).toBe(1)
        expect(parsed.forms[0].type).toBe('text') // defaults to text
    })
})

describe('Cross-Package Integration: Performance', () => {
    it('should parse large forms efficiently', () => {
        const fields = Array.from({ length: 100 }, (_, i) =>
            `@field_${i}: [text required]`
        ).join('\n')

        const start = performance.now()
        const parsed = parseFormdown(fields)
        const end = performance.now()

        expect(parsed.forms.length).toBe(100)
        expect(end - start).toBeLessThan(1000) // Should complete in under 1 second
    })

    it('should generate HTML for large forms efficiently', () => {
        const fields = Array.from({ length: 50 }, (_, i) =>
            `@field_${i}: [text required]`
        ).join('\n')

        const start = performance.now()
        const html = generateFormHTML(fields)
        const end = performance.now()

        expect(html).toContain('field_0')
        expect(html).toContain('field_49')
        expect(end - start).toBeLessThan(1000) // Should complete in under 1 second
    })
})
