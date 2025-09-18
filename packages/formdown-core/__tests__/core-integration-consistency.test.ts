import { parseFormdown, generateFormHTML, getSchema } from '../src/index'

describe('Core Integration Consistency Tests', () => {
  const testContent = `
# Test Form

@form[action="/submit" method="POST"]

@name: [text required]
@email: [email required]
@age: [number min=18]
@bio: [textarea rows=3]
@interests: [checkbox options="Tech,Sports,Music"]
@country: [select options="USA,Canada,UK"]
@newsletter: [checkbox content="Subscribe to newsletter"]
@submit: [submit label="Submit Form"]
`

  describe('Core Functions Integration', () => {
    test('parseFormdown should work with Hidden Form Architecture', () => {
      const result = parseFormdown(testContent)
      
      expect(result.forms).toBeDefined()
      expect(result.forms.length).toBeGreaterThan(0)
      expect(result.formDeclarations).toBeDefined()
      expect(result.formDeclarations!.length).toBe(1)
      expect(result.formDeclarations![0].id).toBe('formdown-form-1')
      expect(result.formDeclarations![0].attributes.action).toBe('/submit')
      expect(result.formDeclarations![0].attributes.method).toBe('POST')
    })

    test('generateFormHTML should create hidden forms with field associations', () => {
      const html = generateFormHTML(testContent)
      
      // Should contain hidden form
      expect(html).toContain('<form hidden id="formdown-form-1" action="/submit" method="POST"></form>')
      
      // Should contain fields with form attribute
      expect(html).toContain('form="formdown-form-1"')
      expect(html).toContain('name="name"')
      expect(html).toContain('name="email"')
      expect(html).toContain('name="age"')
      
      // Should contain submit button with form association
      expect(html).toContain('<button type="submit" id="submit" form="formdown-form-1">Submit Form</button>')
    })

    test('getSchema should extract complete form metadata', () => {
      const schema = getSchema(testContent)
      
      expect(schema).toBeDefined()
      expect(schema.name).toBeDefined()
      expect(schema.name.type).toBe('text')
      expect(schema.name.required).toBe(true)
      
      expect(schema.email).toBeDefined()
      expect(schema.email.type).toBe('email')
      expect(schema.email.required).toBe(true)
      
      expect(schema.age).toBeDefined()
      expect(schema.age.type).toBe('number')
      expect(schema.age.validation?.min).toBe(18)
      
      expect(schema.interests).toBeDefined()
      expect(schema.interests.type).toBe('checkbox')
      expect(schema.interests.options).toEqual(['Tech', 'Sports', 'Music'])
    })

    test('All core functions should handle same content consistently', () => {
      const parseResult = parseFormdown(testContent)
      const html = generateFormHTML(testContent)
      const schema = getSchema(testContent)
      
      // Field count should match across functions
      const fieldNames = parseResult.forms.map(f => f.name)
      const schemaFieldNames = Object.keys(schema)
      
      expect(fieldNames).toHaveLength(schemaFieldNames.length)
      fieldNames.forEach(name => {
        expect(schemaFieldNames).toContain(name)
      })
      
      // Form declarations should be consistent
      expect(parseResult.formDeclarations).toHaveLength(1)
      expect(html).toContain('formdown-form-1')
    })
  })

  describe('Error Handling Consistency', () => {
    test('Should handle invalid content consistently across functions', () => {
      const invalidContent = `
@invalid-field-name: [unknown-type]
@form[invalid-syntax
@field-without-type: []
`
      
      // parseFormdown should handle gracefully
      const parseResult = parseFormdown(invalidContent)
      expect(parseResult.forms).toBeDefined()
      
      // generateFormHTML should handle gracefully
      expect(() => generateFormHTML(invalidContent)).not.toThrow()
      
      // getSchema should handle gracefully
      expect(() => getSchema(invalidContent)).not.toThrow()
    })

    test('Should handle empty content consistently', () => {
      const emptyContent = ''
      
      const parseResult = parseFormdown(emptyContent)
      expect(parseResult.forms).toEqual([])
      
      const html = generateFormHTML(emptyContent)
      expect(html).toBe('')
      
      const schema = getSchema(emptyContent)
      expect(schema).toEqual({})
    })
  })

  describe('Hidden Form Architecture Compliance', () => {
    test('Should create proper form associations for all field types', () => {
      const multiFormContent = `
@form[id="form1" action="/form1"]
@form[id="form2" action="/form2"]

@field1: [text form="form1"]
@field2: [email form="form2"]
@field3: [checkbox options="A,B,C" form="form1"]
@submit1: [submit label="Submit 1" form="form1"]
@submit2: [submit label="Submit 2" form="form2"]
`
      
      const html = generateFormHTML(multiFormContent)
      
      // Should contain both hidden forms
      expect(html).toContain('<form hidden id="form1" action="/form1"></form>')
      expect(html).toContain('<form hidden id="form2" action="/form2"></form>')
      
      // Should properly associate fields
      expect(html).toContain('name="field1"')
      expect(html).toContain('form="form1"')
      expect(html).toContain('name="field2"')
      expect(html).toContain('form="form2"')
      
      // Should associate submit buttons
      expect(html).toContain('<button type="submit" id="submit1" form="form1">Submit 1</button>')
      expect(html).toContain('<button type="submit" id="submit2" form="form2">Submit 2</button>')
    })

    test('Should handle automatic form association', () => {
      const autoAssociationContent = `
@form[action="/auto"]

@auto1: [text]
@auto2: [email]
`
      
      const parseResult = parseFormdown(autoAssociationContent)
      
      // Fields should be automatically associated with the form
      expect(parseResult.forms[0].attributes?.form).toBe('formdown-form-1')
      expect(parseResult.forms[1].attributes?.form).toBe('formdown-form-1')
    })

    test('Should create default form when no @form declared', () => {
      const noFormContent = `
@username: [text]
@password: [password]
`
      
      const html = generateFormHTML(noFormContent)
      
      // Should create default hidden form
      expect(html).toContain('<form hidden id="formdown-form-default"')
      expect(html).toContain('form="formdown-form-default"')
    })
  })

  describe('Extension System Integration Points', () => {
    test('Core functions should provide extension hooks data', () => {
      // This test validates that core functions expose the right data
      // for extension system integration in UI/Editor packages
      
      const parseResult = parseFormdown(testContent)
      
      // Should have extension-friendly structure
      expect(parseResult.forms).toBeDefined()
      expect(parseResult.formDeclarations).toBeDefined()
      
      // Each field should have complete metadata for extensions
      parseResult.forms.forEach(field => {
        expect(field.name).toBeDefined()
        expect(field.type).toBeDefined()
        expect(field.label).toBeDefined()
        expect(field.attributes).toBeDefined()
      })
    })

    test('Schema should provide validation metadata for UI packages', () => {
      const schema = getSchema(testContent)
      
      // Should provide validation-ready metadata
      Object.values(schema).forEach(fieldSchema => {
        expect(fieldSchema.type).toBeDefined()
        if (fieldSchema.required) {
          expect(typeof fieldSchema.required).toBe('boolean')
        }
        if (fieldSchema.validation) {
          expect(typeof fieldSchema.validation).toBe('object')
        }
      })
    })
  })

  describe('Performance and Consistency', () => {
    test('Should handle large forms consistently across functions', () => {
      // Generate large form content
      const largeFormFields = Array.from({ length: 100 }, (_, i) => 
        `@field${i}: [text required]`
      ).join('\n')
      
      const largeFormContent = `
@form[action="/large" method="POST"]

${largeFormFields}

@submit: [submit label="Submit Large Form"]
`
      
      const startTime = Date.now()
      
      const parseResult = parseFormdown(largeFormContent)
      const html = generateFormHTML(largeFormContent)
      const schema = getSchema(largeFormContent)
      
      const endTime = Date.now()
      const processingTime = endTime - startTime
      
      // Should complete within reasonable time (< 1 second)
      expect(processingTime).toBeLessThan(1000)
      
      // Should handle all fields consistently
      expect(parseResult.forms).toHaveLength(101) // 100 fields + 1 submit
      expect(Object.keys(schema)).toHaveLength(101)
      expect(html).toContain('formdown-form-1')
    })
  })
})