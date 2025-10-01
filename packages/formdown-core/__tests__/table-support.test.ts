import { FormManager } from '../src/index'

describe('Table Support with Inline Fields', () => {
  describe('Basic table parsing', () => {
    it('should parse simple table with inline fields', () => {
      const content = `
| name | type |
|---|---|
|___@name|___@type|
      `.trim()

      const fm = new FormManager()
      fm.parse(content)
      const html = fm.render()

      // Should generate table HTML
      expect(html).toContain('<table class="formdown-table">')
      expect(html).toContain('<thead>')
      expect(html).toContain('<th>name</th>')
      expect(html).toContain('<th>type</th>')
      expect(html).toContain('<tbody>')

      // Should contain inline fields
      expect(html).toContain('contenteditable="true"')
      expect(html).toContain('data-field-name="name"')
      expect(html).toContain('data-field-name="type"')
    })

    it('should extract fields from table cells', () => {
      const content = `
| name | type |
|---|---|
|___@name|___@type|
      `.trim()

      const fm = new FormManager()
      fm.parse(content)
      const fields = fm.getFields()

      // Should have 2 inline fields
      expect(fields).toHaveLength(2)
      expect(fields[0].name).toBe('name')
      expect(fields[0].inline).toBe(true)
      expect(fields[1].name).toBe('type')
      expect(fields[1].inline).toBe(true)
    })

    it('should handle data collection from table fields', () => {
      const content = `
| name | type |
|---|---|
|___@name|___@type|
      `.trim()

      const fm = new FormManager()
      fm.parse(content)

      // Set values
      fm.setFieldValue('name', 'John Doe')
      fm.setFieldValue('type', 'Admin')

      const data = fm.getData()

      expect(data.name).toBe('John Doe')
      expect(data.type).toBe('Admin')
    })
  })

  describe('Multiple row tables', () => {
    it('should parse table with multiple data rows', () => {
      const content = `
| name | type |
|---|---|
|___@name1|___@type1|
|___@name2|___@type2|
      `.trim()

      const fm = new FormManager()
      fm.parse(content); const fields = fm.getFields()

      // Should have 4 inline fields
      expect(fields).toHaveLength(4)
      expect(fields.map(f => f.name)).toEqual(['name1', 'type1', 'name2', 'type2'])
    })

    it('should generate correct HTML for multiple rows', () => {
      const content = `
| name | type |
|---|---|
|___@name1|___@type1|
|___@name2|___@type2|
      `.trim()

      const fm = new FormManager()
      fm.parse(content)
      const html = fm.render()

      // Should have 2 data rows
      expect(html.match(/<tr>/g)?.length).toBe(3) // 1 header + 2 data rows
      expect(html).toContain('data-field-name="name1"')
      expect(html).toContain('data-field-name="name2"')
    })
  })

  describe('Table with more columns', () => {
    it('should handle table with 3+ columns', () => {
      const content = `
| name | email | role |
|---|---|---|
|___@name|___@email|___@role|
      `.trim()

      const fm = new FormManager()
      fm.parse(content); const fields = fm.getFields()

      expect(fields).toHaveLength(3)
      expect(fields.map(f => f.name)).toEqual(['name', 'email', 'role'])

      const html = fm.render()
      expect(html).toContain('<th>name</th>')
      expect(html).toContain('<th>email</th>')
      expect(html).toContain('<th>role</th>')
    })

    it('should handle mixed content in table cells', () => {
      const content = `
| name | details |
|---|---|
|___@name|Age: ___@age|
      `.trim()

      const fm = new FormManager()
      fm.parse(content); const fields = fm.getFields()

      // Should have both fields
      expect(fields).toHaveLength(2)
      expect(fields.map(f => f.name)).toEqual(['name', 'age'])

      const html = fm.render()
      expect(html).toContain('Age:')
      expect(html).toContain('data-field-name="age"')
    })
  })

  describe('Table validation', () => {
    it('should require at least 3 lines for valid table', () => {
      const content = `
| name | type |
|---|---|
      `.trim()

      const fm = new FormManager()
      fm.parse(content)
      const html = fm.render()

      // Should not create table without data rows
      expect(html).not.toContain('<table class="formdown-table">')
    })

    it('should validate separator line format', () => {
      const content = `
| name | type |
| invalid | separator |
|___@name|___@type|
      `.trim()

      const fm = new FormManager()
      fm.parse(content)
      const html = fm.render()

      // Should not create table with invalid separator
      expect(html).not.toContain('<table class="formdown-table">')
    })

    it('should handle colon-aligned separators', () => {
      const content = `
| name | type |
|:---|---:|
|___@name|___@type|
      `.trim()

      const fm = new FormManager()
      fm.parse(content)
      const html = fm.render()

      // Should create table with aligned separators
      expect(html).toContain('<table class="formdown-table">')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty cells', () => {
      const content = `
| name | type |
|---|---|
|___@name||
      `.trim()

      const fm = new FormManager()
      fm.parse(content); const fields = fm.getFields()

      expect(fields).toHaveLength(1)
      expect(fields[0].name).toBe('name')

      const html = fm.render()
      expect(html).toContain('<td></td>')
    })

    it('should handle cells with special characters', () => {
      const content = `
| name | description |
|---|---|
|___@name|This is a test value|
      `.trim()

      const fm = new FormManager()
      fm.parse(content)
      const html = fm.render()

      // Should contain table and cell content
      expect(html).toContain('<table class="formdown-table">')
      expect(html).toContain('This is a test value')
    })

    it('should handle whitespace in cells', () => {
      const content = `
| name | type |
|---|---|
|  ___@name  |  ___@type  |
      `.trim()

      const fm = new FormManager()
      fm.parse(content); const fields = fm.getFields()

      // Should trim whitespace from field names
      expect(fields.map(f => f.name)).toEqual(['name', 'type'])
    })
  })

  describe('Integration with other features', () => {
    it('should work with form declarations', () => {
      const content = `
@form[id="user-form"]

| name | email |
|---|---|
|___@name|___@email|
      `.trim()

      const fm = new FormManager()
      fm.parse(content)
      const html = fm.render()

      expect(html).toContain('id="user-form"')
      expect(html).toContain('<table class="formdown-table">')
    })

    it('should work alongside regular fields', () => {
      const content = `
@title: [text]

| name | type |
|---|---|
|___@name|___@type|

@description: [textarea]
      `.trim()

      const fm = new FormManager()
      fm.parse(content); const fields = fm.getFields()

      // Should have 4 fields total (2 block + 2 table inline)
      expect(fields).toHaveLength(4)
      expect(fields.map(f => f.name)).toEqual(['title', 'name', 'type', 'description'])
    })

    it('should preserve field order with tables', () => {
      const content = `
@first: [text]

| col1 | col2 |
|---|---|
|___@second|___@third|

@fourth: [text]
      `.trim()

      const fm = new FormManager()
      fm.parse(content); const fields = fm.getFields()

      expect(fields.map(f => f.name)).toEqual(['first', 'second', 'third', 'fourth'])
    })
  })

  describe('Table with field types', () => {
    it('should support required fields in tables', () => {
      const content = `
| name | age |
|---|---|
|___@name*|___@age|
      `.trim()

      const fm = new FormManager()
      fm.parse(content); const fields = fm.getFields()

      expect(fields[0].required).toBe(true)
      expect(fields[0].name).toBe('name')
      expect(fields[1].name).toBe('age')
    })

    it('should extract all inline fields from table', () => {
      const content = `
| field1 | field2 | field3 |
|---|---|---|
|___@a|___@b|___@c|
|___@d|___@e|___@f|
      `.trim()

      const fm = new FormManager()
      fm.parse(content); const fields = fm.getFields()

      expect(fields).toHaveLength(6)
      expect(fields.map(f => f.name)).toEqual(['a', 'b', 'c', 'd', 'e', 'f'])
      expect(fields.every(f => f.inline)).toBe(true)
    })
  })
})
