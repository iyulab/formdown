import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'
import { parseFormdown, generateFormHTML } from '../src/index'

describe('Hidden Form Architecture', () => {
  let parser: FormdownParser
  let generator: FormdownGenerator

  beforeEach(() => {
    parser = new FormdownParser()
    generator = new FormdownGenerator()
  })

  describe('@form Declaration Parsing', () => {
    test('should parse basic @form declaration', () => {
      const content = `
@form[action="/submit" method="POST"]

@name: [text required]
@email: [email required]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(2) // 2 fields
      expect(result.forms[0].name).toBe('name')
      expect(result.forms[1].name).toBe('email')
    })

    test('should parse @form with custom ID', () => {
      const content = `
@form[id="contact-form" action="/contact" method="POST"]

@name: [text required]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(1)
      expect(result.forms[0].name).toBe('name')
    })

    test('should parse multiple @form declarations', () => {
      const content = `
@form[id="login" action="/login" method="POST"]
@form[id="register" action="/register" method="POST"]

@username: [text required]
@password: [password required]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(2)
      expect(result.forms[0].name).toBe('username')
      expect(result.forms[1].name).toBe('password')
    })

    test('should handle @form without explicit ID', () => {
      const content = `
@form[action="/submit" method="POST"]

@field1: [text]
@field2: [email]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(2)
      expect(result.forms[0].name).toBe('field1')
      expect(result.forms[1].name).toBe('field2')
    })

    test('should parse all HTML form attributes', () => {
      const content = `
@form[action="/submit" method="POST" target="_blank" autocomplete="off" novalidate enctype="multipart/form-data"]

@file: [file]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(1)
      expect(result.forms[0].name).toBe('file')
    })
  })

  describe('Field-Form Association', () => {
    test('should auto-associate fields with most recent @form', () => {
      const content = `
@form[action="/submit"]

@field1: [text]
@field2: [email]

@form[id="other" action="/other"]

@field3: [text]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(3)
      // All fields should be parsed but association logic will be handled later
      expect(result.forms.map(f => f.name)).toEqual(['field1', 'field2', 'field3'])
    })

    test('should handle explicit form attribute in fields', () => {
      const content = `
@form[id="form1" action="/submit1"]
@form[id="form2" action="/submit2"]

@field1: [text form="form1"]
@field2: [email form="form2"]
@field3: [text form="form1"]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(3)
      // Verify fields have explicit form attributes
      const field1 = result.forms.find(f => f.name === 'field1')
      const field2 = result.forms.find(f => f.name === 'field2')
      const field3 = result.forms.find(f => f.name === 'field3')
      
      expect(field1?.attributes?.form).toBe('form1')
      expect(field2?.attributes?.form).toBe('form2')
      expect(field3?.attributes?.form).toBe('form1')
    })

    test('should handle inline fields with form association', () => {
      const content = `
@form[id="survey" action="/survey"]

Your name is ___@name[text form="survey"] and age is ___@age[number form="survey"].
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(2)
      const nameField = result.forms.find(f => f.name === 'name')
      const ageField = result.forms.find(f => f.name === 'age')
      
      expect(nameField?.inline).toBe(true)
      expect(ageField?.inline).toBe(true)
      expect(nameField?.attributes?.form).toBe('survey')
      expect(ageField?.attributes?.form).toBe('survey')
    })

    test('should create default form when no @form declared', () => {
      const content = `
@username: [text required]
@password: [password required]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(2)
      expect(result.forms[0].name).toBe('username')
      expect(result.forms[1].name).toBe('password')
      // Default form association will be handled in implementation
    })
  })

  describe('Error Handling', () => {
    test('should handle invalid @form syntax gracefully', () => {
      const content = `
@form[invalid syntax
@name: [text]
`
      const result = parser.parseFormdown(content)
      
      // Should still parse the field even if form declaration is invalid
      expect(result.forms).toHaveLength(1)
      expect(result.forms[0].name).toBe('name')
    })

    test('should handle non-existent form ID references', () => {
      // Spy on console.warn to verify warning is logged
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
      
      const content = `
@field1: [text form="non-existent-form"]
@field2: [email]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(2)
      // Should fallback to default form when referenced form doesn't exist
      expect(result.forms[0].attributes?.form).toBe('formdown-form-default')
      expect(result.forms[1].attributes?.form).toBe('formdown-form-default')
      
      // Should log warning about non-existent form
      expect(consoleSpy).toHaveBeenCalledWith('FormDown: Referenced form "non-existent-form" does not exist. Using current or default form.')
      
      consoleSpy.mockRestore()
    })

    test('should handle duplicate form IDs', () => {
      const content = `
@form[id="duplicate" action="/submit1"]
@form[id="duplicate" action="/submit2"]

@field: [text]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(1)
      expect(result.forms[0].name).toBe('field')
    })
  })

  describe('Integration with Existing Features', () => {
    test('should work with shorthand syntax', () => {
      const content = `
@form[action="/submit"]

@name*: []
@email*: @[]
@age: #[]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(3)
      expect(result.forms[0].name).toBe('name')
      expect(result.forms[0].required).toBe(true)
      expect(result.forms[1].name).toBe('email')
      expect(result.forms[1].type).toBe('email')
      expect(result.forms[2].name).toBe('age')
      expect(result.forms[2].type).toBe('number')
    })

    test('should work with custom labels and attributes', () => {
      const content = `
@form[action="/contact" method="POST"]

@user_name(Full Name): [text required maxlength=50]
@email_address: [email required class="form-control"]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(2)
      expect(result.forms[0].label).toBe('Full Name')
      expect(result.forms[0].attributes?.maxlength).toBe(50)
      expect(result.forms[1].attributes?.class).toBe('form-control')
    })

    test('should work with selection fields', () => {
      const content = `
@form[action="/survey"]

@gender: [radio options="Male,Female,Other"]
@interests: [checkbox options="Web,Mobile,AI" layout="vertical"]
@country: [select options="USA,Canada,UK"]
`
      const result = parser.parseFormdown(content)
      
      expect(result.forms).toHaveLength(3)
      expect(result.forms[0].type).toBe('radio')
      expect(result.forms[0].options).toEqual(['Male', 'Female', 'Other'])
      expect(result.forms[1].type).toBe('checkbox')
      expect(result.forms[1].attributes?.layout).toBe('vertical')
      expect(result.forms[2].type).toBe('select')
    })
  })
})