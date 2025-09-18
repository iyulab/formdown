import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'
import { parseFormdown, generateFormHTML } from '../src/index'

describe('Hidden Form HTML Generation', () => {
  let parser: FormdownParser
  let generator: FormdownGenerator

  beforeEach(() => {
    parser = new FormdownParser()
    generator = new FormdownGenerator()
  })

  describe('Hidden Form Element Generation', () => {
    test('should generate hidden form element for basic @form declaration', () => {
      const content = `
@form[action="/submit" method="POST"]

@name: [text required]
@email: [email required]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      // Should contain hidden form element
      expect(html).toContain('<form hidden id="formdown-form-1" action="/submit" method="POST"></form>')
      
      // Should contain fields with form attribute
      expect(html).toContain('form="formdown-form-1"')
      expect(html).toContain('name="name"')
      expect(html).toContain('name="email"')
    })

    test('should generate hidden form with custom ID', () => {
      const content = `
@form[id="contact-form" action="/contact" method="POST"]

@name: [text required]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      expect(html).toContain('<form hidden id="contact-form" action="/contact" method="POST"></form>')
      expect(html).toContain('form="contact-form"')
    })

    test('should generate multiple hidden forms', () => {
      const content = `
@form[id="login" action="/login" method="POST"]
@form[id="register" action="/register" method="POST"]

@username: [text required form="login"]
@password: [password required form="login"]
@reg_email: [email required form="register"]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      expect(html).toContain('<form hidden id="login" action="/login" method="POST"></form>')
      expect(html).toContain('<form hidden id="register" action="/register" method="POST"></form>')
      expect(html).toContain('form="login"')
      expect(html).toContain('form="register"')
    })

    test('should generate default hidden form when no @form declared', () => {
      const content = `
@username: [text required]
@password: [password required]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      expect(html).toContain('<form hidden id="formdown-form-default" action="." method="GET"></form>')
      expect(html).toContain('form="formdown-form-default"')
    })

    test('should handle all HTML form attributes', () => {
      const content = `
@form[action="/submit" method="POST" target="_blank" autocomplete="off" novalidate enctype="multipart/form-data"]

@file: [file]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      expect(html).toContain('action="/submit"')
      expect(html).toContain('method="POST"')
      expect(html).toContain('target="_blank"')
      expect(html).toContain('autocomplete="off"')
      expect(html).toContain('novalidate')
      expect(html).toContain('enctype="multipart/form-data"')
    })
  })

  describe('Field Form Association in HTML', () => {
    test('should add form attribute to all input fields', () => {
      const content = `
@form[id="test-form" action="/test"]

@text_field: [text]
@email_field: [email]
@password_field: [password]
@number_field: [number]
@date_field: [date]
@textarea_field: [textarea]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      const formAttributeMatches = html.match(/form="test-form"/g)
      expect(formAttributeMatches).toHaveLength(6) // All 6 fields should have form attribute
    })

    test('should add form attribute to selection fields', () => {
      const content = `
@form[id="selection-form" action="/select"]

@radio_field: [radio options="Option1,Option2,Option3"]
@checkbox_single: [checkbox]
@checkbox_group: [checkbox options="A,B,C"]
@select_field: [select options="X,Y,Z"]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      // Should contain form attributes in radio, checkbox, and select elements
      expect(html).toContain('form="selection-form"')
      
      // Count how many times the form attribute appears
      const formAttributeMatches = html.match(/form="selection-form"/g)
      expect(formAttributeMatches).toBeTruthy()
      expect(formAttributeMatches!.length).toBeGreaterThanOrEqual(2) // At least checkbox and select should have form attributes
    })

    test('should add form attribute to submit and reset buttons', () => {
      const content = `
@form[id="button-form" action="/submit"]

@name: [text]
@submit_btn: [submit label="Submit Form"]
@reset_btn: [reset label="Reset Form"]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      expect(html).toContain('<button type="submit" id="submit_btn" form="button-form">Submit Form</button>')
      expect(html).toContain('<button type="reset" id="reset_btn" form="button-form">Reset Form</button>')
    })

    test('should handle inline fields with form association', () => {
      const content = `
@form[id="inline-form" action="/inline"]

Your name is ___@name[text] and age is ___@age[number].
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      // Inline fields should have form association in their data attributes or similar
      expect(html).toContain('data-field-name="name"')
      expect(html).toContain('data-field-name="age"')
    })
  })

  describe('Form Positioning and Structure', () => {
    test('should place hidden forms at the beginning of HTML output', () => {
      const content = `
# Contact Form

@form[action="/contact" method="POST"]

Please fill out the form below:

@name: [text required]
@email: [email required]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      // Hidden form should appear early in the HTML
      const hiddenFormIndex = html.indexOf('<form hidden')
      const firstFieldIndex = html.indexOf('<div class="formdown-field"')
      
      expect(hiddenFormIndex).toBeLessThan(firstFieldIndex)
      expect(hiddenFormIndex).toBeGreaterThan(-1)
    })

    test('should not interfere with existing HTML structure', () => {
      const content = `
# My Form

Some **markdown** content here.

@form[action="/test"]

@field: [text]

More content after the field.
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      // Should contain markdown-generated HTML
      expect(html).toContain('<h1>My Form</h1>')
      expect(html).toContain('<strong>markdown</strong>')
      expect(html).toContain('<p>More content after the field.</p>')
      
      // Should also contain hidden form
      expect(html).toContain('<form hidden')
      expect(html).toContain('form="formdown-form-1"')
    })
  })

  describe('Multi-Form Scenarios', () => {
    test('should generate separate hidden forms for different form IDs', () => {
      const content = `
@form[id="form1" action="/submit1" method="POST"]
@form[id="form2" action="/submit2" method="GET"]

# Form 1 Fields
@field1: [text form="form1"]
@field2: [email form="form1"]

# Form 2 Fields  
@field3: [text form="form2"]
@field4: [number form="form2"]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      expect(html).toContain('<form hidden id="form1" action="/submit1" method="POST"></form>')
      expect(html).toContain('<form hidden id="form2" action="/submit2" method="GET"></form>')
      
      expect(html).toContain('name="field1"')
      expect(html).toContain('form="form1"')
      expect(html).toContain('name="field3"')
      expect(html).toContain('form="form2"')
    })

    test('should handle complex form scenarios with inline and block fields', () => {
      const content = `
@form[id="survey" action="/survey" method="POST"]
@form[id="feedback" action="/feedback" method="POST"]

# Survey Section
Please tell us your name ___@name[text form="survey"] and age ___@age[number form="survey"].

@interests: [checkbox options="Tech,Sports,Music" form="survey"]
@submit_survey: [submit label="Submit Survey" form="survey"]

# Feedback Section
@rating: [range min=1 max=5 form="feedback"]
@comments: [textarea rows=3 form="feedback"]
@submit_feedback: [submit label="Submit Feedback" form="feedback"]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      expect(html).toContain('<form hidden id="survey"')
      expect(html).toContain('<form hidden id="feedback"')
      expect(html).toContain('form="survey"')
      expect(html).toContain('form="feedback"')
      expect(html).toContain('id="submit_survey" form="survey"')
      expect(html).toContain('id="submit_feedback" form="feedback"')
    })
  })

  describe('Error Handling in HTML Generation', () => {
    test('should handle missing form references gracefully', () => {
      const content = `
@field1: [text form="nonexistent"]
@field2: [email]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      // Should fallback to default form
      expect(html).toContain('<form hidden id="formdown-form-default"')
      expect(html).toContain('form="formdown-form-default"')
    })

    test('should handle empty form declarations', () => {
      const content = `
@form[]

@field: [text]
`
      const result = parser.parseFormdown(content)
      const html = generator.generateHTML(result)
      
      // Should still generate a form with auto-generated ID
      expect(html).toContain('<form hidden id="formdown-form-1"')
    })
  })
})