/**
 * Datalist Enhancement Tests (#6)
 * Tests for shorthand datalist syntax and datalist reference features
 */

import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Datalist Enhancement', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Shorthand Datalist Declaration @#id: options', () => {
        it('should parse shorthand datalist declaration', () => {
            const content = `@#countries: Korea,Japan,China,USA`
            const result = parser.parseFormdown(content)

            expect(result.datalistDeclarations).toHaveLength(1)
            expect(result.datalistDeclarations![0].id).toBe('countries')
            expect(result.datalistDeclarations![0].options).toEqual(['Korea', 'Japan', 'China', 'USA'])
        })

        it('should parse multiple shorthand datalist declarations', () => {
            const content = `
@#countries: Korea,Japan,China
@#cities: Seoul,Tokyo,Beijing
`
            const result = parser.parseFormdown(content)

            expect(result.datalistDeclarations).toHaveLength(2)
            expect(result.datalistDeclarations![0].id).toBe('countries')
            expect(result.datalistDeclarations![1].id).toBe('cities')
        })

        it('should trim whitespace in shorthand options', () => {
            const content = `@#test: Option 1 , Option 2 , Option 3 `
            const result = parser.parseFormdown(content)

            expect(result.datalistDeclarations![0].options).toEqual(['Option 1', 'Option 2', 'Option 3'])
        })

        it('should support underscores and hyphens in datalist id', () => {
            const content = `@#my_data_list: A,B,C`
            const result = parser.parseFormdown(content)

            expect(result.datalistDeclarations![0].id).toBe('my_data_list')
        })

        it('should warn and ignore shorthand datalist with only whitespace options', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()
            // Note: `@#empty: ` with just space doesn't match regex (requires content after colon)
            // So test with comma-separated whitespace
            const content = `@#empty: , , `
            const result = parser.parseFormdown(content)

            // Should have 0 datalists since all options are empty after trimming
            expect(result.datalistDeclarations).toHaveLength(0)
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('empty options'),
                expect.any(String)
            )
            consoleSpy.mockRestore()
        })

        it('should not match shorthand without content after colon', () => {
            // `@#empty: ` doesn't match because regex requires content after colon
            const content = `@#empty: `
            const result = parser.parseFormdown(content)
            // Regex doesn't match, so it's not parsed as datalist (becomes markdown)
            expect(result.datalistDeclarations).toHaveLength(0)
        })

        it('should not match invalid shorthand patterns', () => {
            // These should NOT be parsed as shorthand datalists
            const content1 = `@#: NoId`  // Missing id (invalid identifier)
            const content3 = `#countries: Korea`  // Missing @ prefix

            const result1 = parser.parseFormdown(content1)
            expect(result1.datalistDeclarations).toHaveLength(0)

            const result3 = parser.parseFormdown(content3)
            expect(result3.datalistDeclarations).toHaveLength(0)
        })
    })

    describe('Datalist Reference Syntax datalist="#id"', () => {
        it('should link field to declared datalist with # reference', () => {
            const content = `
@#countries: Korea,Japan,China,USA
@country: [text datalist="#countries"]
`
            const result = parser.parseFormdown(content)

            expect(result.datalistDeclarations).toHaveLength(1)
            expect(result.forms).toHaveLength(1)

            const field = result.forms[0]
            expect(field.attributes?.list).toBe('countries')
        })

        it('should generate proper HTML with datalist reference', () => {
            const content = `
@#countries: Korea,Japan,China,USA
@country: [text datalist="#countries"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            // Should have input with list attribute
            expect(html).toContain('list="countries"')
            // Should have datalist element
            expect(html).toContain('<datalist id="countries">')
            expect(html).toContain('<option value="Korea">')
            expect(html).toContain('<option value="Japan">')
            expect(html).toContain('<option value="China">')
            expect(html).toContain('<option value="USA">')
        })

        it('should support inline datalist options (without #)', () => {
            const content = `@city: [text datalist="Seoul,Tokyo,Beijing"]`
            const result = parser.parseFormdown(content)

            expect(result.datalistDeclarations).toHaveLength(1)
            const field = result.forms[0]
            expect(field.attributes?.list).toBeDefined()
        })

        it('should generate HTML for inline datalist', () => {
            const content = `@city: [text datalist="Seoul,Tokyo,Beijing"]`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('<datalist')
            expect(html).toContain('<option value="Seoul">')
            expect(html).toContain('<option value="Tokyo">')
            expect(html).toContain('<option value="Beijing">')
        })
    })

    describe('Combining Shorthand Declaration with References', () => {
        it('should support multiple fields referencing same datalist', () => {
            const content = `
@#cities: Seoul,Tokyo,Beijing,Shanghai
@origin: [text datalist="#cities"]
@destination: [text datalist="#cities"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            // Should only have one datalist declaration
            expect(result.datalistDeclarations).toHaveLength(1)

            // Both fields should reference it
            expect(result.forms[0].attributes?.list).toBe('cities')
            expect(result.forms[1].attributes?.list).toBe('cities')

            // HTML should have only one datalist
            const datalistCount = (html.match(/<datalist/g) || []).length
            expect(datalistCount).toBe(1)
        })

        it('should work with explicit @datalist and shorthand together', () => {
            const content = `
@datalist[id="countries" options="Korea,Japan,China"]
@#cities: Seoul,Tokyo,Beijing

@country: [text datalist="#countries"]
@city: [text datalist="#cities"]
`
            const result = parser.parseFormdown(content)

            expect(result.datalistDeclarations).toHaveLength(2)
            expect(result.datalistDeclarations!.find(d => d.id === 'countries')).toBeDefined()
            expect(result.datalistDeclarations!.find(d => d.id === 'cities')).toBeDefined()
        })
    })

    describe('Real-World Scenarios', () => {
        it('should handle address form with multiple datalists', () => {
            const content = `
# Address Form

@#countries: USA,Canada,Mexico,UK,Germany,France
@#provinces: Ontario,Quebec,British Columbia,Alberta

@name*: []
@address: []
@city: []
@province: [text datalist="#provinces"]
@country*: [text datalist="#countries"]
@postal_code: []
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(result.datalistDeclarations).toHaveLength(2)
            expect(result.forms).toHaveLength(6)

            // Check datalist references
            const province = result.forms.find(f => f.name === 'province')
            const country = result.forms.find(f => f.name === 'country')
            expect(province?.attributes?.list).toBe('provinces')
            expect(country?.attributes?.list).toBe('countries')

            // Check HTML
            expect(html).toContain('<datalist id="countries">')
            expect(html).toContain('<datalist id="provinces">')
        })

        it('should combine datalist with conditional fields', () => {
            const content = `
@#categories: Electronics,Books,Clothing,Other

@has_product: c[]
@category: [text datalist="#categories" visible-if="has_product"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            const category = result.forms.find(f => f.name === 'category')
            expect(category?.attributes?.list).toBe('categories')
            expect(category?.conditions?.visibleIf).toEqual({
                field: 'has_product',
                operator: 'truthy'
            })

            expect(html).toContain('data-visible-if-field="has_product"')
            expect(html).toContain('list="categories"')
        })

        it('should escape HTML in datalist options', () => {
            const content = `@#test: Safe,<script>alert(1)</script>,Normal`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).not.toContain('<script>alert(1)</script>')
            expect(html).toContain('&lt;script&gt;')
        })
    })
})
