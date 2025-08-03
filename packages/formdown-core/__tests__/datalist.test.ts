import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Datalist Support', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Parser - Explicit Datalist Declaration', () => {
        test('should parse @datalist declaration with id and options', () => {
            const content = '@datalist[id="countries" options="Korea,Japan,China,USA"]'
            const result = parser.parseFormdown(content)
            
            expect(result.datalistDeclarations).toHaveLength(1)
            const datalist = result.datalistDeclarations![0]
            expect(datalist.id).toBe('countries')
            expect(datalist.options).toEqual(['Korea', 'Japan', 'China', 'USA'])
        })

        test('should parse multiple datalist declarations', () => {
            const content = `
@datalist[id="countries" options="Korea,Japan,China"]
@datalist[id="cities" options="Seoul,Tokyo,Beijing"]
`
            const result = parser.parseFormdown(content)
            
            expect(result.datalistDeclarations).toHaveLength(2)
            expect(result.datalistDeclarations![0].id).toBe('countries')
            expect(result.datalistDeclarations![1].id).toBe('cities')
        })

        test('should trim whitespace in options', () => {
            const content = '@datalist[id="test" options=" Korea , Japan , China "]'
            const result = parser.parseFormdown(content)
            
            const datalist = result.datalistDeclarations![0]
            expect(datalist.options).toEqual(['Korea', 'Japan', 'China'])
        })

        test('should warn and ignore datalist without id', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
            const content = '@datalist[options="Korea,Japan,China"]'
            const result = parser.parseFormdown(content)
            
            expect(result.datalistDeclarations).toHaveLength(0)
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Datalist declaration missing required id attribute'),
                expect.any(String)
            )
            consoleSpy.mockRestore()
        })

        test('should warn and ignore datalist without options', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
            const content = '@datalist[id="test"]'
            const result = parser.parseFormdown(content)
            
            expect(result.datalistDeclarations).toHaveLength(0)
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('Datalist declaration missing required options attribute'),
                expect.any(String)
            )
            consoleSpy.mockRestore()
        })

        test('should warn and ignore datalist with empty options', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
            const content = '@datalist[id="test" options=""]'
            const result = parser.parseFormdown(content)
            
            expect(result.datalistDeclarations).toHaveLength(0)
            // Check that it was properly identified as empty options, not missing options
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('has empty options'),
                expect.any(String)
            )
            consoleSpy.mockRestore()
        })
    })

    describe('Parser - Shorthand Datalist Syntax', () => {
        test('should auto-create datalist from shorthand syntax', () => {
            const content = '@country{Korea,Japan,China}: [text]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            expect(result.datalistDeclarations).toHaveLength(1)
            
            // Check field has list attribute
            const field = result.forms[0]
            expect(field.attributes?.list).toBeDefined()
            
            // Check datalist was created
            const datalist = result.datalistDeclarations![0]
            expect(datalist.options).toEqual(['Korea', 'Japan', 'China'])
        })

        test('should generate unique datalist IDs for different content', () => {
            const content = `
@country{Korea,Japan,China}: [text]
@city{Seoul,Tokyo,Beijing}: [text]
`
            const result = parser.parseFormdown(content)
            
            expect(result.datalistDeclarations).toHaveLength(2)
            const ids = result.datalistDeclarations!.map(d => d.id)
            expect(ids[0]).not.toBe(ids[1])
            expect(ids[0]).toMatch(/^datalist-\d+$/)
            expect(ids[1]).toMatch(/^datalist-\d+$/)
        })

        test('should reuse datalist for identical content', () => {
            const content = `
@country1{Korea,Japan,China}: [text]
@country2{Korea,Japan,China}: [text]
`
            const result = parser.parseFormdown(content)
            
            // Should create only one datalist for identical content
            expect(result.datalistDeclarations).toHaveLength(1)
            
            // Both fields should reference the same datalist
            const listId1 = result.forms[0].attributes?.list
            const listId2 = result.forms[1].attributes?.list
            expect(listId1).toBe(listId2)
        })

        test('should handle mixed shorthand and explicit syntax', () => {
            const content = `
@datalist[id="explicit-countries" options="USA,Canada,UK"]
@country{Korea,Japan,China}: [text]
@region: [text datalist="explicit-countries"]
`
            const result = parser.parseFormdown(content)
            
            expect(result.datalistDeclarations).toHaveLength(2)
            
            // Explicit datalist
            const explicitDatalist = result.datalistDeclarations!.find(d => d.id === 'explicit-countries')
            expect(explicitDatalist).toBeDefined()
            expect(explicitDatalist!.options).toEqual(['USA', 'Canada', 'UK'])
            
            // Auto-generated datalist
            const autoDatalist = result.datalistDeclarations!.find(d => d.id !== 'explicit-countries')
            expect(autoDatalist).toBeDefined()
            expect(autoDatalist!.options).toEqual(['Korea', 'Japan', 'China'])
        })
    })

    describe('Generator - Datalist HTML Output', () => {
        test('should generate datalist HTML from explicit declaration', () => {
            const content = `
@datalist[id="countries" options="Korea,Japan,China"]
@country: [text datalist="countries"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)
            
            // Should contain datalist element
            expect(html).toContain('<datalist id="countries">')
            expect(html).toContain('<option value="Korea">Korea</option>')
            expect(html).toContain('<option value="Japan">Japan</option>')
            expect(html).toContain('<option value="China">China</option>')
            expect(html).toContain('</datalist>')
            
            // Should contain input with list attribute
            expect(html).toContain('list="countries"')
        })

        test('should generate datalist HTML from shorthand syntax', () => {
            const content = '@country{Korea,Japan,China}: [text]'
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)
            
            // Should contain auto-generated datalist
            expect(html).toMatch(/<datalist id="datalist-\d+">/)
            expect(html).toContain('<option value="Korea">Korea</option>')
            expect(html).toContain('<option value="Japan">Japan</option>')
            expect(html).toContain('<option value="China">China</option>')
            
            // Should contain input with list attribute
            expect(html).toMatch(/list="datalist-\d+"/)
        })

        test('should escape HTML in datalist options', () => {
            const content = '@test{"<script>alert(\\"xss\\")</script>",option2}: [text]'
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)
            
            // Check that script tags are escaped in the HTML output
            expect(html).toContain('&lt;script&gt;')
            expect(html).toContain('&quot;')
            expect(html).not.toContain('<script>alert')
        })

        test('should generate multiple datalist elements', () => {
            const content = `
@datalist[id="countries" options="Korea,Japan,China"]
@datalist[id="cities" options="Seoul,Tokyo,Beijing"]
@country: [text datalist="countries"]
@city: [text datalist="cities"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)
            
            expect(html).toContain('<datalist id="countries">')
            expect(html).toContain('<datalist id="cities">')
            expect(html).toContain('list="countries"')
            expect(html).toContain('list="cities"')
        })
    })

    describe('Integration - Complete Form with Datalist', () => {
        test('should generate complete form with datalist functionality', () => {
            const content = `
# User Registration Form

@form[action="/register" method="POST"]

@datalist[id="countries" options="Korea,Japan,China,USA,Canada,UK"]

@name(Full Name): [text required]
@email(Email Address): [email required]
@country(Country): [text datalist="countries" autocomplete="country"]
@city{Seoul,Tokyo,Beijing,New York}: [text autocomplete="address-level2"]

@[submit "Register"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)
            
            // Should contain hidden form
            expect(html).toContain('<form hidden')
            expect(html).toContain('action="/register"')
            expect(html).toContain('method="POST"')
            
            // Should contain explicit datalist
            expect(html).toContain('<datalist id="countries">')
            expect(html).toContain('<option value="Korea">Korea</option>')
            
            // Should contain auto-generated datalist
            expect(html).toMatch(/<datalist id="datalist-\d+">/)
            expect(html).toContain('<option value="Seoul">Seoul</option>')
            
            // Should contain fields with proper attributes
            expect(html).toContain('name="country"')
            expect(html).toContain('list="countries"')
            expect(html).toContain('autocomplete="country"')
            
            expect(html).toContain('name="city"')
            expect(html).toMatch(/list="datalist-\d+"/)
            expect(html).toContain('autocomplete="address-level2"')
            
            // Should contain submit button
            expect(html).toContain('<button type="submit"')
            expect(html).toContain('>Register</button>')
        })

        test('should handle field with explicit list attribute', () => {
            const content = `
@country: [text list="my-custom-datalist"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)
            
            expect(html).toContain('list="my-custom-datalist"')
        })
    })

    describe('Edge Cases', () => {
        test('should handle empty content in shorthand syntax', () => {
            const content = '@field{}: [text]'
            const result = parser.parseFormdown(content)
            
            // Should not create datalist for empty content
            expect(result.datalistDeclarations).toHaveLength(0)
            
            // Should still create the field, but without list attribute
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0].name).toBe('field')
            expect(result.forms[0].attributes?.list).toBeUndefined()
        })

        test('should handle single option in datalist', () => {
            const content = '@status{Active}: [text]'
            const result = parser.parseFormdown(content)
            
            expect(result.datalistDeclarations).toHaveLength(1)
            expect(result.datalistDeclarations![0].options).toEqual(['Active'])
        })

        test('should handle options with commas in quotes (future enhancement)', () => {
            // This test documents expected behavior for complex options
            // Current implementation treats everything as simple comma-separated values
            const content = '@field{Option1,Option2}: [text]'
            const result = parser.parseFormdown(content)
            
            expect(result.datalistDeclarations![0].options).toEqual(['Option1', 'Option2'])
        })
    })
})