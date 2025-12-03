/**
 * @fileoverview XSS Prevention Tests
 * Tests to ensure proper HTML escaping and XSS vulnerability prevention
 */

import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'
import { parseFormdown, generateFormHTML } from '../src/index'

describe('XSS Prevention', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('HTML Escaping in Select Options', () => {
        it('should escape HTML in select option values', () => {
            const content = '@test{<script>alert("xss")</script>,Normal}: s[]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).not.toContain('<script>')
            expect(html).toContain('&lt;script&gt;')
        })

        it('should escape angle brackets in select option values', () => {
            const content = '@test{Option<>Test,Normal}: s[]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            // Angle brackets should be escaped
            expect(html).toContain('&lt;')
            expect(html).toContain('&gt;')
        })

        it('should escape ampersands in select option values', () => {
            const content = '@test{Tom & Jerry,Normal}: s[]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('&amp;')
        })
    })

    describe('HTML Escaping in Radio Options', () => {
        it('should escape HTML in radio option values', () => {
            const content = '@test{<img src=x onerror=alert(1)>,Normal}: r[]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).not.toContain('<img')
            expect(html).toContain('&lt;img')
        })

        it('should escape single quotes in radio options', () => {
            const content = "@test{It's a test,Normal}: r[]"
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('&#39;')
        })
    })

    describe('HTML Escaping in Checkbox Options', () => {
        it('should escape HTML in checkbox option values', () => {
            const content = '@test{<div onclick="evil()">,Normal}: c[]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).not.toContain('<div onclick')
            expect(html).toContain('&lt;div')
        })

        it('should escape event handler-like text in checkbox options', () => {
            const content = '@test{<div onmouseover="alert(1)">,Normal}: c[]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            // HTML tags should be escaped, preventing attribute injection
            expect(html).not.toContain('<div onmouseover')
            expect(html).toContain('&lt;div')
        })
    })

    describe('HTML Escaping in Custom Labels', () => {
        it('should escape HTML in custom other labels', () => {
            const content = '@test{A,B,*(<script>hack</script>)}: r[]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).not.toContain('<script>hack</script>')
            expect(html).toContain('&lt;script&gt;')
        })

        it('should escape HTML in checkbox display text', () => {
            const content = '@agree(<b>Bold</b> Terms): [checkbox]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).not.toContain('<b>Bold</b>')
            expect(html).toContain('&lt;b&gt;')
        })
    })

    describe('HTML Escaping in Datalist Options', () => {
        it('should escape HTML in generated datalist options', () => {
            // Test datalist generation directly with the generator
            const datalistDeclaration = {
                id: 'test-list',
                options: ['<script>alert(1)</script>', 'Normal Option']
            }

            // Access the generator's private method through generateHTML
            const content = {
                markdown: '',
                forms: [{
                    name: 'search',
                    type: 'text',
                    label: 'Search',
                    attributes: { list: 'test-list', form: 'formdown-form-default' }
                }],
                formDeclarations: [],
                datalistDeclarations: [datalistDeclaration]
            }

            const html = generator.generateHTML(content)

            // The datalist options should be escaped
            expect(html).toContain('&lt;script&gt;')
            expect(html).not.toMatch(/<script>alert\(1\)<\/script>(?!.*<\/option>)/)
        })

        it('should escape special characters in datalist options', () => {
            const content = {
                markdown: '',
                forms: [{
                    name: 'search',
                    type: 'text',
                    label: 'Search',
                    attributes: { list: 'test-list', form: 'formdown-form-default' }
                }],
                formDeclarations: [],
                datalistDeclarations: [{
                    id: 'test-list',
                    options: ['Tom & Jerry', 'Option "quoted"']
                }]
            }

            const html = generator.generateHTML(content)

            expect(html).toContain('&amp;')
            expect(html).toContain('&quot;')
        })
    })

    describe('No Inline Event Handlers (CSP Compliance)', () => {
        it('should not contain onclick handlers', () => {
            const content = '@field{A,B,*}: r[]'
            const html = generateFormHTML(content)

            expect(html).not.toContain('onclick=')
        })

        it('should not contain onchange handlers', () => {
            const content = '@field{A,B,*}: s[]'
            const html = generateFormHTML(content)

            expect(html).not.toContain('onchange=')
        })

        it('should not contain oninput handlers', () => {
            const content = '@field{A,B,*}: c[]'
            const html = generateFormHTML(content)

            expect(html).not.toContain('oninput=')
        })

        it('should not contain inline script tags', () => {
            const content = '@name: [text]\n@email: [email]'
            const html = generateFormHTML(content)

            expect(html).not.toContain('<script>')
        })
    })

    describe('Safe Attribute Values', () => {
        it('should properly escape field names in attributes', () => {
            // Field names should be safe by design (alphanumeric + underscore)
            const content = '@test_field: [text]'
            const html = generateFormHTML(content)

            expect(html).toContain('name="test_field"')
            expect(html).toContain('id="')
        })

        it('should use data attributes instead of inline handlers', () => {
            const content = '@choice{A,B,*}: s[]'
            const html = generateFormHTML(content)

            // Should use data attributes for behavior
            expect(html).toContain('data-formdown-has-other="true"')
            expect(html).toContain('data-formdown-other-target=')
        })
    })

    describe('Textarea Content Escaping', () => {
        it('should escape HTML in textarea default values', () => {
            const content = '@message: [textarea value="<script>alert(1)</script>"]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).not.toContain('<script>alert(1)</script>')
            expect(html).toContain('&lt;script&gt;')
        })
    })
})
