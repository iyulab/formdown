import { parseFormdown, generateFormHTML } from '../src/index'

describe('Custom Other Label', () => {
  describe('Parser - *(label) syntax', () => {
    it('should parse *(label) in shorthand syntax for radio', () => {
      const content = '@priority{Low,Medium,High,*(Custom Label)}: r[required]'
      const parsed = parseFormdown(content)
      
      expect(parsed.forms[0].allowOther).toBe(true)
      expect(parsed.forms[0].otherLabel).toBe('Custom Label')
      expect(parsed.forms[0].options).toEqual(['Low', 'Medium', 'High'])
    })

    it('should parse *(label) in shorthand syntax for select', () => {
      const content = '@country{USA,Canada,*(Please specify country)}: s[]'
      const parsed = parseFormdown(content)
      
      expect(parsed.forms[0].allowOther).toBe(true)
      expect(parsed.forms[0].otherLabel).toBe('Please specify country')
      expect(parsed.forms[0].options).toEqual(['USA', 'Canada'])
    })

    it('should parse *(label) in shorthand syntax for checkbox', () => {
      const content = '@skills{JS,Python,*(Other skill)}: c[]'
      const parsed = parseFormdown(content)
      
      expect(parsed.forms[0].allowOther).toBe(true)
      expect(parsed.forms[0].otherLabel).toBe('Other skill')
      expect(parsed.forms[0].options).toEqual(['JS', 'Python'])
    })

    it('should parse *(label) in standard syntax', () => {
      const content = '@skills: [checkbox options="JavaScript,Python,*(Different label)" required]'
      const parsed = parseFormdown(content)
      
      expect(parsed.forms[0].allowOther).toBe(true)
      expect(parsed.forms[0].otherLabel).toBe('Different label')
      expect(parsed.forms[0].options).toEqual(['JavaScript', 'Python'])
    })

    it('should default to "Other" when no custom label provided', () => {
      const content = '@priority{Low,Medium,High,*}: r[]'
      const parsed = parseFormdown(content)
      
      expect(parsed.forms[0].allowOther).toBe(true)
      expect(parsed.forms[0].otherLabel).toBeUndefined()
      expect(parsed.forms[0].options).toEqual(['Low', 'Medium', 'High'])
    })

    it('should handle multiple *(label) entries (use first one)', () => {
      const content = '@test{A,*(Label 1),B,*(Label 2)}: s[]'
      const parsed = parseFormdown(content)
      
      expect(parsed.forms[0].allowOther).toBe(true)
      expect(parsed.forms[0].otherLabel).toBe('Label 1')
      expect(parsed.forms[0].options).toEqual(['A', 'B'])
    })
  })

  describe('Generator - Custom other labels', () => {
    it('should generate radio with custom other label', () => {
      const content = '@priority{Low,Medium,High,*(Priority Level)}: r[]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      expect(html).toContain('<span>Priority Level:</span>')
      expect(html).not.toContain('<span>Other:</span>')
    })

    it('should generate select with custom other label', () => {
      const content = '@country{USA,Canada,*(Custom Country)}: s[]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      expect(html).toContain('Custom Country (please specify)')
      expect(html).not.toContain('Other (please specify)')
    })

    it('should generate checkbox with custom other label', () => {
      const content = '@skills{JS,Python,*(Additional Skill)}: c[]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      expect(html).toContain('<span>Additional Skill:</span>')
      expect(html).not.toContain('<span>Other:</span>')
    })

    it('should default to "Other" when no custom label', () => {
      const content = '@priority{Low,Medium,High,*}: r[]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      expect(html).toContain('<span>Other:</span>')
    })

    it('should handle labels with special characters', () => {
      const content = '@test{A,B,*(Custom: Label & More)}: r[]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      expect(html).toContain('<span>Custom: Label &amp; More:</span>')
    })
  })

  describe('Integration with data handling', () => {
    it('should work with custom labels and data transformation', () => {
      const content = '@priority{Low,Medium,High,*(Priority Level)}: r[required]'
      const parsed = parseFormdown(content)
      const html = generateFormHTML(parsed)
      
      // Should have custom label
      expect(html).toContain('<span>Priority Level:</span>')
      
      // Should have simplified data handling (no complex scripts needed)
      expect(html).not.toContain('handleFormdownSubmit')
      expect(html).toContain('name="priority"')
      expect(html).not.toContain('name="priority_other"')  // Text input doesn't have name attribute
      
      // Radio value should change when other text is entered
      expect(html).toContain('this.value = otherInput.value')
      expect(html).toContain('otherRadio.value = this.value')
    })
  })
})