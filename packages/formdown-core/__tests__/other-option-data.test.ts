import { parseFormdown, generateFormHTML } from '../src/index'

describe('Other Option Data Handling', () => {
  describe('Form submission data transformation', () => {
    it('should generate form with simplified other option data handling', () => {
      const content = '@priority{Low,Medium,High,*}: r[required]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)

      // Verify no complex submit handlers needed
      expect(html).not.toContain('onsubmit="handleFormdownSubmit(event, this)"')
      expect(html).not.toContain('handleFormdownSubmit')

      // Verify simplified structure
      expect(html).not.toContain('name="priority_other"')  // Text input doesn't have name
      expect(html).toContain('value=""')  // Other radio has empty value

      // CSP-compliant: Verify data attributes instead of inline handlers
      expect(html).toContain('data-formdown-other-radio="true"')
      expect(html).toContain('data-formdown-other-for="priority"')
    })

    it('should handle multiple field forms with other options', () => {
      const content = `
@priority{Low,Medium,High,*}: r[required]
@category{Web,Mobile,*}: s[]
@skills{JS,Python,*}: c[]
      `.trim()

      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)

      // Should have simple forms without complex handlers
      expect(html).not.toContain('onsubmit="handleFormdownSubmit(event, this)"')
      expect(html).not.toContain('handleFormdownSubmit')

      // Should not have "_other" named inputs
      expect(html).not.toContain('name="priority_other"')
      expect(html).not.toContain('name="category_other"')
      expect(html).not.toContain('name="skills_other"')

      // Should have simplified value handling
      expect(html).toContain('value=""')  // Empty values for other options

      // CSP-compliant: Should have data attributes for dynamic value handling
      expect(html).toContain('data-formdown-other-radio="true"')
      expect(html).toContain('data-formdown-has-other="true"')
      expect(html).toContain('data-formdown-other-checkbox="true"')
    })

    it('should not have any inline scripts or event handlers', () => {
      const content = `
@field1{A,B,*}: r[]
@field2{X,Y,*}: r[]
      `.trim()

      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)

      // Should not have complex JavaScript handling
      expect(html).not.toContain('handleFormdownSubmit')

      // CSP-compliant: Should not have inline event handlers
      expect(html).not.toContain('oninput=')
      expect(html).not.toContain('onchange=')
      expect(html).not.toContain('<script>')

      // CSP-compliant: Should use data attributes
      expect(html).toContain('data-formdown-other-radio="true"')
    })

    it('should handle single field forms with other options', () => {
      const content = '@country{USA,Canada,*}: s[required]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)

      // Should generate hidden form for single field
      expect(html).toContain('<form hidden id="formdown-form-default"')
      expect(html).not.toContain('onsubmit="handleFormdownSubmit(event, this)"')
      expect(html).not.toContain('name="country_other"')  // Text input doesn't have name

      // CSP-compliant: Should include data attributes for handling other option
      expect(html).toContain('data-formdown-has-other="true"')
      expect(html).toContain('data-formdown-other-target="country_other"')
    })
  })

  describe('Other option behavior verification', () => {
    it('should generate correct HTML structure for radio with other', () => {
      const content = '@preference{Email,SMS,*}: r[required]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)

      // Should have radio buttons with correct names and values
      expect(html).toContain('name="preference"')
      expect(html).toContain('value="Email"')
      expect(html).toContain('value="SMS"')
      expect(html).toContain('value=""')  // Other radio has empty value initially

      // Should have other text input without name attribute
      expect(html).not.toContain('name="preference_other"')
      expect(html).toContain('placeholder="Please specify..."')

      // CSP-compliant: Should have data attributes for event handling
      expect(html).toContain('data-formdown-other-radio="true"')
      expect(html).toContain('data-formdown-other-for="preference"')
      expect(html).toContain('data-formdown-hides-other="true"')
    })

    it('should generate correct HTML structure for select with other', () => {
      const content = '@country{USA,Canada,*}: s[required]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)

      // Should have select with correct options
      expect(html).toContain('<select')
      expect(html).toContain('name="country"')
      expect(html).toContain('<option value="USA">USA</option>')
      expect(html).toContain('<option value="Canada">Canada</option>')
      expect(html).toContain('<option value="">Other (please specify)</option>')

      // Should have other text input without name attribute
      expect(html).not.toContain('name="country_other"')

      // CSP-compliant: Should have data attributes
      expect(html).toContain('data-formdown-has-other="true"')
      expect(html).toContain('data-formdown-other-target="country_other"')
    })

    it('should generate correct HTML structure for checkbox with other', () => {
      const content = '@skills{JavaScript,Python,*}: c[]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)

      // Should have checkboxes with correct names and values
      expect(html).toContain('type="checkbox"')
      expect(html).toContain('name="skills"')
      expect(html).toContain('value="JavaScript"')
      expect(html).toContain('value="Python"')
      expect(html).toContain('value=""')  // Other checkbox has empty value initially

      // Should have other text input without name attribute
      expect(html).not.toContain('name="skills_other"')

      // CSP-compliant: Should have data attributes
      expect(html).toContain('data-formdown-other-checkbox="true"')
      expect(html).toContain('data-formdown-other-for="skills"')
    })
  })

  describe('Integration with field ordering', () => {
    it('should maintain field order with other options', () => {
      const content = `# Form

First field:
@field1{A,B,*}: r[]

Some text here.

Second field:
@field2{X,Y,*}: s[]`

      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      // Should maintain proper ordering
      const field1Index = html.indexOf('name="field1"')
      const textIndex = html.indexOf('Some text here')
      const field2Index = html.indexOf('name="field2"')
      
      expect(field1Index).toBeLessThan(textIndex)
      expect(textIndex).toBeLessThan(field2Index)
      
      // Both fields should have other option support (without name attributes on text inputs)
      expect(html).not.toContain('name="field1_other"')
      expect(html).not.toContain('name="field2_other"')
      
      // Should have simplified value handling
      expect(html).toContain('value=""')  // Empty values for other options
    })
  })
})