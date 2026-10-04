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
            expect(html).toMatch(/<input[^>]* checked[ >]/)
        })

        test('carries value "true" like a single checkbox, so its form data is a boolean', () => {
            const field = { name: 'toggle1', type: 'toggle', label: 'Toggle', attributes: {} }
            expect(generate(field, { input: '' })).toContain('value="true"')
        })

        test('leaves its on/off state to the checkbox — no aria-checked to go stale', () => {
            const field = { name: 'toggle1', type: 'toggle', label: 'Toggle', attributes: { checked: true } }
            expect(generate(field, { input: '' })).not.toContain('aria-checked')
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

    describe('Styles', () => {
        test('should have styles defined', () => {
            expect(toggleFieldPlugin.styles).toBeDefined()
            expect(toggleFieldPlugin.styles).toContain('formdown-toggle')
        })
    })

    describe('Default Attributes', () => {
        test('should have checked: false as default', () => {
            expect(toggleFieldPlugin.defaultAttributes).toEqual({ checked: false })
        })
    })
})
