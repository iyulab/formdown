import { parseFormdown, generateFormHTML } from '../src/index.js'

describe('Simplified Other Option HTML Generation', () => {
    it('should generate radio button with simplified structure', () => {
        const content = '@source{Website,Social Media,*(Please specify)}: r[]'
        const parseResult = parseFormdown(content)
        const html = generateFormHTML(parseResult)

        // Should have all radio buttons with same name
        expect(html).toContain('name="source"')
        
        // Other radio button should have empty value initially
        expect(html).toContain('id="source_other_radio" name="source" value=""')
        
        // Text input should not have name attribute initially (no name="source_other")
        expect(html).not.toContain('name="source_other"')
        
        // Should have oninput handler to update radio value
        expect(html).toContain('this.value = otherInput.value')
        expect(html).toContain('otherRadio.value = this.value')
        
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
        expect(html).toContain('id="interests_other_checkbox" name="interests" value=""')
        
        // Text input should not have name attribute (no name="interests_other")
        expect(html).not.toContain('name="interests_other"')
        
        // Should have oninput handler to update checkbox value
        expect(html).toContain('this.value = otherInput.value')
        expect(html).toContain('otherCheckbox.value = this.value')
        
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
        
        // Should have script to update select value
        expect(html).toContain('select.value = this.value')
        
        // Should use custom label
        expect(html).toContain('Other Country')
    })

    it('should not have complex form submission scripts', () => {
        const content = '@source{Website,Social Media,*}: r[]'
        const parseResult = parseFormdown(content)
        const html = generateFormHTML(parseResult)

        // Should not have the old complex handleFormdownSubmit function
        expect(html).not.toContain('handleFormdownSubmit')
        expect(html).not.toContain('hiddenInput')
        expect(html).not.toContain('disabled = true')
        
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
        
        // Should use dynamic value setting instead of fixed "_other" value
        expect(html).toContain('this.value = otherInput.value')
        expect(html).toContain('otherRadio.value = this.value')
        expect(html).toContain('select.value = this.value')
    })
})