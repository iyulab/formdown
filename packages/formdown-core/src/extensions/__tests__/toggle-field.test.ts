import { toggleFieldPlugin } from '../field-types/toggle-field'

describe('Toggle Field Plugin', () => {
    describe('Parser', () => {
        const parse = (input: string) => toggleFieldPlugin.parser!(input, { input })

        test('should parse basic toggle field', () => {
            const result = parse('@darkMode: [toggle]')
            expect(result).not.toBeNull()
            expect(result!.name).toBe('darkMode')
            expect(result!.type).toBe('toggle')
            expect(result!.attributes?.checked).toBe(false)
        })

        test('should parse toggle with custom label', () => {
            const result = parse('@notify(Email Notifications): [toggle]')
            expect(result).not.toBeNull()
            expect(result!.label).toBe('Email Notifications')
        })

        test('should parse toggle with checked attribute', () => {
            const result = parse('@active: [toggle checked]')
            expect(result).not.toBeNull()
            expect(result!.attributes?.checked).toBe(true)
        })

        test('should parse toggle with required attribute', () => {
            const result = parse('@terms: [toggle required]')
            expect(result).not.toBeNull()
            expect(result!.required).toBe(true)
        })

        test('should parse toggle with checked and required', () => {
            const result = parse('@agree: [toggle checked required]')
            expect(result).not.toBeNull()
            expect(result!.attributes?.checked).toBe(true)
            expect(result!.required).toBe(true)
        })

        test('should not match non-toggle fields', () => {
            expect(parse('@name: [text]')).toBeNull()
            expect(parse('@check: [checkbox]')).toBeNull()
            expect(parse('random text')).toBeNull()
        })

        test('should generate label from name', () => {
            const result = parse('@dark_mode: [toggle]')
            expect(result).not.toBeNull()
            expect(result!.label).toBe('Dark Mode')
        })
    })

    describe('Validator', () => {
        const validate = toggleFieldPlugin.validator!

        test('should pass when required and value is true', () => {
            const field = { name: 'agree', type: 'toggle', label: 'Agree', required: true }
            const rules = validate(field, true)
            expect(rules).toHaveLength(0)
        })

        test('should fail when required and value is false', () => {
            const field = { name: 'agree', type: 'toggle', label: 'Agree', required: true }
            const rules = validate(field, false)
            expect(rules).toHaveLength(1)
            expect(rules[0].type).toBe('required')
        })

        test('should pass when not required regardless of value', () => {
            const field = { name: 'option', type: 'toggle', label: 'Option' }
            expect(validate(field, false)).toHaveLength(0)
            expect(validate(field, true)).toHaveLength(0)
        })
    })

    describe('Generator', () => {
        const generate = toggleFieldPlugin.generator!

        test('should generate checkbox with role="switch"', () => {
            const field = { name: 'toggle1', type: 'toggle', label: 'Toggle', attributes: {} }
            const html = generate(field, { input: '' })
            expect(html).toContain('role="switch"')
            expect(html).toContain('type="checkbox"')
        })

        test('should include field id and name', () => {
            const field = { name: 'darkMode', type: 'toggle', label: 'Dark Mode', attributes: {} }
            const html = generate(field, { input: '' })
            expect(html).toContain('id="darkMode"')
            expect(html).toContain('name="darkMode"')
        })

        test('should include form attribute from context', () => {
            const field = { name: 'toggle1', type: 'toggle', label: 'Toggle', attributes: {} }
            const html = generate(field, { input: '', metadata: { formId: 'my-form' } })
            expect(html).toContain('form="my-form"')
        })

        test('should include checked when set', () => {
            const field = { name: 'toggle1', type: 'toggle', label: 'Toggle', attributes: { checked: true } }
            const html = generate(field, { input: '' })
            expect(html).toContain('checked')
            expect(html).toContain('aria-checked="true"')
        })

        test('should include required when set', () => {
            const field = { name: 'toggle1', type: 'toggle', label: 'Toggle', required: true, attributes: {} }
            const html = generate(field, { input: '' })
            expect(html).toContain('required')
        })

        test('should include toggle slider markup', () => {
            const field = { name: 'toggle1', type: 'toggle', label: 'Toggle', attributes: {} }
            const html = generate(field, { input: '' })
            expect(html).toContain('formdown-toggle-slider')
            expect(html).toContain('formdown-toggle-switch')
        })
    })

    describe('DataProcessor', () => {
        const dp = toggleFieldPlugin.dataProcessor!
        const field = { name: 'test', type: 'toggle', label: 'Test' }

        test('processInput should convert string to boolean', () => {
            expect(dp.processInput!('true', field)).toBe(true)
            expect(dp.processInput!('false', field)).toBe(false)
            expect(dp.processInput!('on', field)).toBe(true)
            expect(dp.processInput!('off', field)).toBe(false)
        })

        test('processInput should pass through booleans', () => {
            expect(dp.processInput!(true, field)).toBe(true)
            expect(dp.processInput!(false, field)).toBe(false)
        })

        test('processOutput should return string', () => {
            expect(dp.processOutput!(true, field)).toBe('true')
            expect(dp.processOutput!(false, field)).toBe('false')
        })

        test('serialize/deserialize round-trip', () => {
            expect(dp.deserialize!(dp.serialize!(true, field), field)).toBe(true)
            expect(dp.deserialize!(dp.serialize!(false, field), field)).toBe(false)
        })
    })

    describe('SchemaGenerator', () => {
        const generateSchema = toggleFieldPlugin.schemaGenerator!

        test('should generate boolean type schema', () => {
            const field = { name: 'toggle1', type: 'toggle', label: 'My Toggle' }
            const schema = generateSchema(field) as any
            expect(schema.type).toBe('boolean')
            expect(schema.title).toBe('My Toggle')
        })

        test('should include required when set', () => {
            const field = { name: 'toggle1', type: 'toggle', label: 'Test', required: true }
            const schema = generateSchema(field) as any
            expect(schema.required).toBe(true)
        })
    })

    describe('Styles and ClientScript', () => {
        test('should have styles defined', () => {
            expect(toggleFieldPlugin.styles).toBeDefined()
            expect(toggleFieldPlugin.styles).toContain('formdown-toggle')
        })

        test('should have client script defined', () => {
            expect(toggleFieldPlugin.clientScript).toBeDefined()
            expect(toggleFieldPlugin.clientScript).toContain('aria-checked')
        })
    })

    describe('Default Attributes', () => {
        test('should have checked: false as default', () => {
            expect(toggleFieldPlugin.defaultAttributes).toEqual({ checked: false })
        })
    })
})
