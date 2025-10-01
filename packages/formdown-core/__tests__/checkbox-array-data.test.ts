import { FormManager } from '../src/index'

describe('Checkbox Array Data Extraction', () => {
  describe('Basic checkbox array functionality', () => {
    it('should return array for checkbox group with multiple options', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events}: c[]')

      // Simulate selecting multiple checkboxes
      fm.setFieldValue('interests', ['Tech News', 'Events'])

      const data = fm.getData()

      expect(data.interests).toEqual(['Tech News', 'Events'])
      expect(Array.isArray(data.interests)).toBe(true)
    })

    it('should return empty array when no checkboxes selected', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events}: c[]')

      // Without setting any value, getData returns default values from schema
      // For checkbox arrays, default is undefined if not set
      // Set empty array explicitly to test behavior
      fm.setFieldValue('interests', [])

      const data = fm.getData()

      expect(data.interests).toEqual([])
      expect(Array.isArray(data.interests)).toBe(true)
    })

    it('should return array with single item when one checkbox selected', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events}: c[]')

      fm.setFieldValue('interests', ['Product Updates'])

      const data = fm.getData()

      expect(data.interests).toEqual(['Product Updates'])
      expect(Array.isArray(data.interests)).toBe(true)
    })

    it('should return all selected values when all checkboxes selected', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events}: c[]')

      fm.setFieldValue('interests', ['Tech News', 'Product Updates', 'Events'])

      const data = fm.getData()

      expect(data.interests).toEqual(['Tech News', 'Product Updates', 'Events'])
      expect(Array.isArray(data.interests)).toBe(true)
    })
  })

  describe('Custom option (other) functionality', () => {
    it('should handle custom option input correctly', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events,*(Custom Topic)}: c[]')

      // Simulate selecting custom option
      fm.setFieldValue('interests', ['Custom Input Value'])

      const data = fm.getData()

      expect(data.interests).toEqual(['Custom Input Value'])
      expect(Array.isArray(data.interests)).toBe(true)
    })

    it('should handle multiple custom option inputs', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events,*(Custom Topic)}: c[]')

      // Note: Multiple custom values would typically require UI support for multiple "other" inputs
      // For now, test single custom value as designed
      fm.setFieldValue('interests', ['First Custom', 'Second Custom'])

      const data = fm.getData()

      expect(data.interests).toContain('First Custom')
      expect(data.interests).toContain('Second Custom')
      expect(Array.isArray(data.interests)).toBe(true)
    })

    it('should preserve custom option label in HTML', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events,*(Custom Topic)}: c[]')

      const html = fm.render()

      expect(html).toContain('Custom Topic:')
      expect(html).toContain('type="text"')
      expect(html).toContain('placeholder="Please specify..."')
    })
  })

  describe('Mixed regular and custom options', () => {
    it('should handle mix of regular and custom options', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events,*(Custom Topic)}: c[]')

      // Simulate selecting both regular and custom options
      fm.setFieldValue('interests', ['Tech News', 'Custom Value', 'Events'])

      const data = fm.getData()

      expect(data.interests).toEqual(['Tech News', 'Custom Value', 'Events'])
      expect(Array.isArray(data.interests)).toBe(true)
      expect(data.interests).toContain('Tech News')
      expect(data.interests).toContain('Custom Value')
      expect(data.interests).toContain('Events')
    })

    it('should preserve order of mixed selections', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events,*(Custom Topic)}: c[]')

      fm.setFieldValue('interests', ['Events', 'Custom First', 'Tech News', 'Custom Second'])

      const data = fm.getData()

      expect(data.interests[0]).toBe('Events')
      expect(data.interests[1]).toBe('Custom First')
      expect(data.interests[2]).toBe('Tech News')
      expect(data.interests[3]).toBe('Custom Second')
    })

    it('should handle only custom options selected', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events,*(Custom Topic)}: c[]')

      fm.setFieldValue('interests', ['Only Custom'])

      const data = fm.getData()

      expect(data.interests).toEqual(['Only Custom'])
      expect(Array.isArray(data.interests)).toBe(true)
    })

    it('should handle custom option mixed at different positions', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events,*(Custom Topic)}: c[]')

      // Custom at beginning
      fm.setFieldValue('interests', ['Custom Start', 'Tech News'])
      expect(fm.getData().interests).toEqual(['Custom Start', 'Tech News'])

      // Custom in middle
      fm.setFieldValue('interests', ['Tech News', 'Custom Middle', 'Events'])
      expect(fm.getData().interests).toEqual(['Tech News', 'Custom Middle', 'Events'])

      // Custom at end
      fm.setFieldValue('interests', ['Tech News', 'Custom End'])
      expect(fm.getData().interests).toEqual(['Tech News', 'Custom End'])
    })
  })

  describe('Multiple checkbox groups in same form', () => {
    it('should handle multiple checkbox arrays independently', () => {
      const fm = new FormManager()
      fm.parse(`
@interests{Tech News,Product Updates,Events}: c[]
@skills{JavaScript,Python,Go}: c[]
      `.trim())

      fm.setFieldValue('interests', ['Tech News', 'Events'])
      fm.setFieldValue('skills', ['Python', 'Go'])

      const data = fm.getData()

      expect(data.interests).toEqual(['Tech News', 'Events'])
      expect(data.skills).toEqual(['Python', 'Go'])
      expect(Array.isArray(data.interests)).toBe(true)
      expect(Array.isArray(data.skills)).toBe(true)
    })

    it('should handle multiple checkbox arrays with custom options', () => {
      const fm = new FormManager()
      fm.parse(`
@interests{Tech News,Product Updates,*(Other Interest)}: c[]
@skills{JavaScript,Python,*(Other Skill)}: c[]
      `.trim())

      fm.setFieldValue('interests', ['Tech News', 'Custom Interest'])
      fm.setFieldValue('skills', ['Python', 'Custom Skill'])

      const data = fm.getData()

      expect(data.interests).toEqual(['Tech News', 'Custom Interest'])
      expect(data.skills).toEqual(['Python', 'Custom Skill'])
    })
  })

  describe('Edge cases and validation', () => {
    it('should handle checkbox array with whitespace in options', () => {
      const fm = new FormManager()
      fm.parse('@interests{  Tech News  ,  Product Updates  }: c[]')

      fm.setFieldValue('interests', ['Tech News', 'Product Updates'])

      const data = fm.getData()

      expect(data.interests).toEqual(['Tech News', 'Product Updates'])
    })

    it('should differentiate checkbox array from single checkbox', () => {
      const fm = new FormManager()
      fm.parse(`
@single: c[]
@array{Option 1,Option 2}: c[]
      `.trim())

      fm.setFieldValue('single', true)
      fm.setFieldValue('array', ['Option 1'])

      const data = fm.getData()

      // Single checkbox returns boolean
      expect(typeof data.single).toBe('boolean')
      expect(data.single).toBe(true)

      // Checkbox array returns array
      expect(Array.isArray(data.array)).toBe(true)
      expect(data.array).toEqual(['Option 1'])
    })

    it('should handle required checkbox arrays', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events}: c[required]')

      const schema = fm.getSchema()
      const field = schema?.['interests']

      expect(field?.required).toBe(true)
      expect(field?.type).toBe('checkbox')
      expect(field?.options).toEqual(['Tech News', 'Product Updates', 'Events'])
    })

    it('should update checkbox array values correctly', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,Events}: c[]')

      // Initial selection
      fm.setFieldValue('interests', ['Tech News'])
      expect(fm.getData().interests).toEqual(['Tech News'])

      // Update selection
      fm.setFieldValue('interests', ['Tech News', 'Events'])
      expect(fm.getData().interests).toEqual(['Tech News', 'Events'])

      // Clear selection
      fm.setFieldValue('interests', [])
      expect(fm.getData().interests).toEqual([])
    })
  })

  describe('Custom option with various labels', () => {
    it('should handle default "Other" label', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,*}: c[]')

      const html = fm.render()

      expect(html).toContain('Other:')
    })

    it('should handle custom "Other" label', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,*(Something Else)}: c[]')

      const html = fm.render()

      expect(html).toContain('Something Else:')
      expect(html).not.toContain('Other:')
    })

    it('should handle custom label with special characters', () => {
      const fm = new FormManager()
      fm.parse('@interests{Tech News,Product Updates,*(Other - Please Specify)}: c[]')

      const html = fm.render()

      expect(html).toContain('Other - Please Specify:')
    })
  })
})
