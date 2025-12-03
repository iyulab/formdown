import { parseFormdown, generateFormHTML } from '../src/index.js'

describe('Simplified Other Option HTML Generation', () => {
    it('should generate radio button with simplified structure', () => {
        const content = '@source{Website,Social Media,*(Please specify)}: r[]'
        const parseResult = parseFormdown(content)
        const html = generateFormHTML(parseResult)

        // Should have all radio buttons with same name
        expect(html).toContain('name="source"')

        // Other radio button should have empty value initially
        expect(html).toContain('name="source" value=""')

        // Text input should not have name attribute initially (no name="source_other")
        expect(html).not.toContain('name="source_other"')

        // CSP-compliant: Should have data attributes instead of inline handlers
        expect(html).toContain('data-formdown-other-radio="true"')
        expect(html).toContain('data-formdown-other-for="source"')

        // Should use custom label
        expect(html).toContain('Please specify:')
    })

    it('should generate checkbox with simplified structure', () => {
        const content = '@interests{Tech,Sports,*(Custom Interest)}: c[]'
        const parseResult = parseFormdown(content)
        const html = generateFormHTML(parseResult)

        // Should have all checkboxes with same name
        expect(html).toContain('name="interests"')

        // Other checkbox should have empty value initially
        expect(html).toContain('name="interests" value=""')

        // Text input should not have name attribute (no name="interests_other")
        expect(html).not.toContain('name="interests_other"')

        // CSP-compliant: Should have data attributes instead of inline handlers
        expect(html).toContain('data-formdown-other-checkbox="true"')
        expect(html).toContain('data-formdown-other-for="interests"')

        // Should use custom label
        expect(html).toContain('Custom Interest:')
    })

    it('should generate select with simplified structure', () => {
        const content = '@country{USA,Canada,*(Other Country)}: s[]'
        const parseResult = parseFormdown(content)
        const html = generateFormHTML(parseResult)

        // Other option should have empty value
        expect(html).toContain('<option value="">Other Country (please specify)</option>')

        // Text input should not have name attribute
        expect(html).not.toContain('name="country_other"')

        // CSP-compliant: Should have data attributes instead of inline script
        expect(html).toContain('data-formdown-has-other="true"')
        expect(html).toContain('data-formdown-other-target="country_other"')

        // Should use custom label
        expect(html).toContain('Other Country')
    })

    it('should not have complex form submission scripts or inline handlers', () => {
        const content = '@source{Website,Social Media,*}: r[]'
        const parseResult = parseFormdown(content)
        const html = generateFormHTML(parseResult)

        // Should not have the old complex handleFormdownSubmit function
        expect(html).not.toContain('handleFormdownSubmit')
        expect(html).not.toContain('hiddenInput')
        expect(html).not.toContain('disabled = true')

        // CSP-compliant: Should not have inline event handlers
        expect(html).not.toContain('oninput=')
        expect(html).not.toContain('onchange=')
        expect(html).not.toContain('<script>')

        // Should have empty value for other option (not "_other")
        expect(html).toContain('value=""')
    })

    it('should work with all field types that support other options', () => {
        const content = `
@radio_field{A,B,*(Custom)}: r[]
@checkbox_field{X,Y,*(Custom)}: c[]
@select_field{1,2,*(Custom)}: s[]
`
        const parseResult = parseFormdown(content)
        const html = generateFormHTML(parseResult)

        // All "other" controls should use empty value
        expect(html).toContain('name="radio_field" value=""')
        expect(html).toContain('name="checkbox_field" value=""')
        expect(html).toContain('<option value="">Custom (please specify)</option>')

        // CSP-compliant: Should use data attributes for dynamic value setting
        expect(html).toContain('data-formdown-other-radio="true"')
        expect(html).toContain('data-formdown-other-for="radio_field"')
        expect(html).toContain('data-formdown-other-checkbox="true"')
        expect(html).toContain('data-formdown-other-for="checkbox_field"')
        expect(html).toContain('data-formdown-has-other="true"')
        expect(html).toContain('data-formdown-other-target="select_field_other"')
    })
})