import { parseFormdown, generateFormHTML } from '../src/index'

describe('Other Option Data Handling', () => {
  describe('Form submission data transformation', () => {
    it('should generate form with proper other option data handling', () => {
      const content = '@priority{Low,Medium,High,*}: r[required]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      // Verify the form has submit handler
      expect(html).toContain('onsubmit="handleFormdownSubmit(event, this)"')
      
      // Verify the JavaScript function is included
      expect(html).toContain('handleFormdownSubmit')
      expect(html).toContain('input[name$="_other"]')
      
      // Verify the other input has correct name
      expect(html).toContain('name="priority_other"')
      
      // Verify radio button for other has correct value
      expect(html).toContain('value="_other"')
    })

    it('should handle multiple field forms with other options', () => {
      const content = `
@priority{Low,Medium,High,*}: r[required]
@category{Web,Mobile,*}: s[]
@skills{JS,Python,*}: c[]
      `.trim()
      
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      // Should have form submit handlers (one per field due to field ordering fix)
      expect(html).toContain('onsubmit="handleFormdownSubmit(event, this)"')
      
      // Should have all other inputs
      expect(html).toContain('name="priority_other"')
      expect(html).toContain('name="category_other"')
      expect(html).toContain('name="skills_other"')
      
      // Should have the JavaScript function for handling other options
      expect(html).toContain('handleFormdownSubmit')
      expect(html).toContain('input[name$="_other"]')
      
      // Should handle radio other options
      expect(html).toContain('otherRadio && otherRadio.checked')
    })

    it('should include JavaScript function only once per form', () => {
      const content = `
@field1{A,B,*}: r[]
@field2{X,Y,*}: r[]
      `.trim()
      
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      // Should have the JavaScript function
      expect(html).toContain('handleFormdownSubmit')
      
      // Should check for existing function before defining
      expect(html).toContain('if (typeof handleFormdownSubmit === \'undefined\')')
    })

    it('should handle single field forms with other options', () => {
      const content = '@country{USA,Canada,*}: s[required]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      // Should generate individual form for single field
      expect(html).toContain('<form class="formdown-form"')
      expect(html).toContain('onsubmit="handleFormdownSubmit(event, this)"')
      expect(html).toContain('name="country_other"')
      
      // Should include JavaScript for handling other option
      expect(html).toContain('handleFormdownSubmit')
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
      expect(html).toContain('value="_other"')
      
      // Should have other text input
      expect(html).toContain('name="preference_other"')
      expect(html).toContain('placeholder="Please specify..."')
      
      // Should have proper JavaScript event handlers
      expect(html).toContain('otherInput.style.display = \'inline-block\'')
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
      expect(html).toContain('<option value="_other">Other (please specify)</option>')
      
      // Should have other text input
      expect(html).toContain('name="country_other"')
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
      expect(html).toContain('value="_other"')
      
      // Should have other text input
      expect(html).toContain('name="skills_other"')
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
      
      // Both fields should have other option support
      expect(html).toContain('name="field1_other"')
      expect(html).toContain('name="field2_other"')
    })
  })
})