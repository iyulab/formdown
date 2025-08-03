import { parseFormdown, generateFormHTML, getSchema, extensionManager } from '../src/index'

describe('Package Integration Tests', () => {
  const testContent = `
@form[action="/test" method="POST"]

@name: [text required]
@email: [email required]
@age: [number min=18]
@interests: [checkbox options="Tech,Sports,Music"]
@submit: [submit label="Submit"]
`

  describe('Core Functions Consistency', () => {
    test('All core functions should handle Hidden Form Architecture consistently', () => {
      const parseResult = parseFormdown(testContent)
      const html = generateFormHTML(testContent)
      const schema = getSchema(testContent)

      // Parse result should have form declarations
      expect(parseResult.formDeclarations).toBeDefined()
      expect(parseResult.formDeclarations!.length).toBe(1)
      expect(parseResult.formDeclarations![0].id).toBe('formdown-form-1')

      // HTML should contain hidden form
      expect(html).toContain('<form hidden id="formdown-form-1"')
      expect(html).toContain('form="formdown-form-1"')

      // Schema should be consistent with parsed fields
      const fieldNames = parseResult.forms.map(f => f.name)
      const schemaFieldNames = Object.keys(schema)
      expect(fieldNames.sort()).toEqual(schemaFieldNames.sort())
    })

    test('Should handle extensibility data structures', () => {
      const parseResult = parseFormdown(testContent)
      
      // Should provide extension-ready field metadata
      parseResult.forms.forEach(field => {
        expect(field.name).toBeDefined()
        expect(field.type).toBeDefined()
        expect(field.label).toBeDefined()
        expect(field.attributes).toBeDefined()
      })

      // Should provide form declarations for UI/Editor packages
      expect(parseResult.formDeclarations).toBeDefined()
      parseResult.formDeclarations!.forEach(form => {
        expect(form.id).toBeDefined()
        expect(form.attributes).toBeDefined()
      })
    })
  })

  describe('UI/Editor Integration Readiness', () => {
    test('Should provide UI-ready validation metadata', () => {
      const schema = getSchema(testContent)
      
      // Should have validation-ready structure
      expect(schema.name.type).toBe('text')
      expect(schema.name.required).toBe(true)
      expect(schema.email.type).toBe('email')
      expect(schema.age.validation?.min).toBe(18)
      expect(schema.interests.options).toEqual(['Tech', 'Sports', 'Music'])
    })

    test('Should provide Editor-ready parsing results', () => {
      const parseResult = parseFormdown(testContent)
      
      // Should have editor-friendly structure
      expect(parseResult.forms).toBeDefined()
      expect(parseResult.markdown).toBeDefined()
      
      // Each field should have editor metadata
      parseResult.forms.forEach(field => {
        expect(field.label).toBeDefined()
        expect(field.required !== undefined ? typeof field.required : typeof false).toBe('boolean')
      })
    })

    test('Should generate UI-compatible HTML structure', () => {
      const html = generateFormHTML(testContent)
      
      // Should be compatible with UI component expectations
      expect(html).toContain('<form hidden')
      expect(html).toContain('form="formdown-form-1"')
      expect(html).toContain('type="text"')
      expect(html).toContain('type="email"')
      expect(html).toContain('type="number"')
      expect(html).toContain('type="checkbox"')
      expect(html).toContain('<button type="submit"')
    })
  })

  describe('Extension System Integration', () => {
    test('Extension system should be available for UI/Editor packages', () => {
      expect(extensionManager).toBeDefined()
      expect(typeof extensionManager.initialize).toBe('function')
      expect(typeof extensionManager.executeHooks).toBe('function')
    })

    test('Should support plugin registration from UI/Editor packages', async () => {
      // Initialize extension manager first
      await extensionManager.initialize()
      
      const testPlugin = {
        name: 'test-integration-plugin',
        version: '1.0.0',
        metadata: {
          name: 'test-integration-plugin',
          version: '1.0.0',
          description: 'Test plugin for integration testing',
          author: 'Test Suite'
        },
        hooks: [
          {
            name: 'field-render' as const,
            priority: 1,
            handler: (context: any) => context
          }
        ]
      }

      // Should be able to register plugins
      await expect(extensionManager.registerPlugin(testPlugin)).resolves.not.toThrow()
      
      // Should be able to execute hooks
      const context = { input: 'test' }
      await expect(extensionManager.executeHooks('field-render', context)).resolves.toBeDefined()
    })
  })

  describe('Performance and Scalability', () => {
    test('Should handle large forms efficiently for UI/Editor', () => {
      // Generate large form
      const largeFormFields = Array.from({ length: 50 }, (_, i) => 
        `@field${i}: [text required]`
      ).join('\n')
      
      const largeContent = `
@form[action="/large"]
${largeFormFields}
@submit: [submit]
`

      const startTime = Date.now()
      
      const parseResult = parseFormdown(largeContent)
      const html = generateFormHTML(largeContent)
      const schema = getSchema(largeContent)
      
      const endTime = Date.now()
      
      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(500)
      
      // Should handle all fields
      expect(parseResult.forms).toHaveLength(51) // 50 fields + submit
      expect(Object.keys(schema)).toHaveLength(51)
      expect(html).toContain('formdown-form-1')
    })

    test('Should provide efficient data structures for real-time updates', () => {
      const parseResult = parseFormdown(testContent)
      
      // Should provide efficient field lookup
      const fieldMap = new Map(parseResult.forms.map(f => [f.name, f]))
      expect(fieldMap.get('name')).toBeDefined()
      expect(fieldMap.get('email')).toBeDefined()
      
      // Should provide efficient form lookup
      const formMap = new Map(parseResult.formDeclarations!.map(f => [f.id, f]))
      expect(formMap.get('formdown-form-1')).toBeDefined()
    })
  })

  describe('Error Handling Consistency', () => {
    test('Should handle malformed content consistently across packages', () => {
      const malformedContent = `
@invalid-field: [unknown-type]
@form[malformed syntax
@field: []
`

      // All functions should handle gracefully
      expect(() => parseFormdown(malformedContent)).not.toThrow()
      expect(() => generateFormHTML(malformedContent)).not.toThrow()
      expect(() => getSchema(malformedContent)).not.toThrow()
    })

    test('Should provide consistent error information for UI/Editor', () => {
      const emptyContent = ''
      
      const parseResult = parseFormdown(emptyContent)
      const html = generateFormHTML(emptyContent)
      const schema = getSchema(emptyContent)
      
      // Should return consistent empty states
      expect(parseResult.forms).toEqual([])
      expect(parseResult.formDeclarations).toEqual([])
      expect(html).toBe('')
      expect(schema).toEqual({})
    })
  })

  describe('Type Safety for UI/Editor Integration', () => {
    test('Should provide type-safe interfaces for UI/Editor packages', () => {
      const parseResult = parseFormdown(testContent)
      const schema = getSchema(testContent)
      
      // Parse result should have proper types
      expect(Array.isArray(parseResult.forms)).toBe(true)
      expect(Array.isArray(parseResult.formDeclarations)).toBe(true)
      expect(typeof parseResult.markdown).toBe('string')
      
      // Schema should have proper field types
      Object.values(schema).forEach(fieldSchema => {
        expect(typeof fieldSchema.type).toBe('string')
        if (fieldSchema.required !== undefined) {
          expect(typeof fieldSchema.required).toBe('boolean')
        }
        if (fieldSchema.options !== undefined) {
          expect(Array.isArray(fieldSchema.options)).toBe(true)
        }
      })
    })

    test('Should maintain backward compatibility for existing UI/Editor code', () => {
      // Test that existing FormdownParser/Generator classes still work
      const { FormdownParser, FormdownGenerator } = require('../src/index')
      
      const parser = new FormdownParser()
      const generator = new FormdownGenerator()
      
      const parseResult = parser.parseFormdown(testContent)
      const html = generator.generateHTML(parseResult)
      
      expect(parseResult.forms).toBeDefined()
      expect(html).toBeDefined()
    })
  })
})