import { FormdownParser } from '../src/parser'

describe('FormdownParser', () => {
    let parser: FormdownParser

    beforeEach(() => {
        parser = new FormdownParser()
    })

    describe('Block Field Parsing', () => {
        test('should parse basic text field', () => {
            const content = '@name: [text required]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'name',
                type: 'text',
                label: 'Name',
                required: true,
                attributes: {}
            })
        })

        test('should parse field with custom label', () => {
            const content = '@user_name(Full Name): [text required]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'user_name',
                type: 'text',
                label: 'Full Name',
                required: true,
                attributes: {}
            })
        })

        test('should parse field with attributes', () => {
            const content = '@email: [email required placeholder="Enter email"]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'email',
                type: 'email',
                label: 'Email',
                required: true,
                placeholder: 'Enter email',
                attributes: {}
            })
        })

        test('should parse number field with min/max', () => {
            const content = '@age: [number min=18 max=100]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'age',
                type: 'number',
                label: 'Age',
                attributes: {
                    min: 18,
                    max: 100
                }
            })
        })

        test('should parse textarea with rows and cols', () => {
            const content = '@description: [textarea rows=4 cols=50]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'description',
                type: 'textarea',
                label: 'Description',
                attributes: {
                    rows: 4,
                    cols: 50
                }
            })
        })
    })

    describe('Inline Field Parsing', () => {
        test('should parse inline text field', () => {
            const content = 'Hello ___@username[text required]!'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'username',
                type: 'text',
                label: 'Username',
                required: true,
                attributes: {}
            })
            expect(result.markdown).toContain('<formdown-field data-name="username"></formdown-field>')
        })

        test('should parse multiple inline fields', () => {
            const content = 'Welcome ___@name[text required]! Your age is ___@age[number min=18].'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(2)
            expect(result.forms[0].name).toBe('name')
            expect(result.forms[1].name).toBe('age')
        })

        test('should parse inline field with custom label', () => {
            const content = 'Total: $___@amount(Total Amount)[number step=0.01]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'amount',
                type: 'number',
                label: 'Total Amount',
                attributes: {
                    step: 0.01
                }
            })
        })
    })

    describe('Mixed Content Parsing', () => {
        test('should parse markdown with block and inline fields', () => {
            const content = `# User Profile

Please fill out your information:

@name: [text required]
@email: [email required]

Your username is ___@username[text required] and you are ___@age[number min=18] years old.`

            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(4)
            expect(result.markdown).toContain('# User Profile')
            expect(result.markdown).toContain('Please fill out your information:')
            expect(result.markdown).toContain('<formdown-field data-name="username"></formdown-field>')
        })

        test('should preserve markdown structure while extracting fields', () => {
            const content = `# Contact Form

## Personal Information
@name: [text required]

## Contact Details  
@email: [email required]

Thank you for contacting us!`

            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(2)
            expect(result.markdown).toContain('# Contact Form')
            expect(result.markdown).toContain('## Personal Information')
            expect(result.markdown).toContain('## Contact Details')
            expect(result.markdown).toContain('Thank you for contacting us!')
        })
    })

    describe('Legacy Parsing Support', () => {
        test('should support legacy parse method', () => {
            const content = '@name: [text required]\n@email: [email]'
            const result = parser.parse(content)

            expect(result.fields).toHaveLength(2)
            expect(result.errors).toHaveLength(0)
        })
    })

    describe('Error Cases', () => {
        test('should handle invalid field syntax gracefully', () => {
            const content = '@invalid-field-syntax'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(0)
            expect(result.markdown).toContain('@invalid-field-syntax')
        })

        test('should handle empty content', () => {
            const content = ''
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(0)
            expect(result.markdown).toBe('')
        })

        test('should handle content with only markdown', () => {
            const content = '# Title\n\nThis is just markdown content.'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(0)
            expect(result.markdown).toContain('# Title')
            expect(result.markdown).toContain('This is just markdown content.')
        })
    })

    describe('Custom HTML Attributes', () => {
        test('should parse custom data attributes', () => {
            const parser = new FormdownParser()
            const result = parser.parse('@slider: [range min=0 max=100 data-unit="%" class="custom-slider"]')

            expect(result.fields).toHaveLength(1)
            const field = result.fields[0]
            expect(field.name).toBe('slider')
            expect(field.type).toBe('range')
            expect(field.attributes).toEqual({
                min: 0,
                max: 100,
                'data-unit': '%',
                'class': 'custom-slider'
            })
        })

        test('should parse CSS classes and styles', () => {
            const parser = new FormdownParser()
            const result = parser.parse('@input: [text class="form-control" style="border: 2px solid blue"]')

            expect(result.fields).toHaveLength(1)
            const field = result.fields[0]
            expect(field.attributes).toEqual({
                'class': 'form-control', 'style': 'border: 2px solid blue'
            })
        })

        test('should parse accessibility attributes', () => {
            const parser = new FormdownParser()
            const result = parser.parse('@bio: [textarea aria-required="true" aria-describedby="bio-hint"]')

            expect(result.fields).toHaveLength(1)
            const field = result.fields[0]
            expect(field.attributes).toEqual({
                'aria-required': true,
                'aria-describedby': 'bio-hint'
            })
        })

        test('should parse boolean attributes without values', () => {
            const parser = new FormdownParser()
            const result = parser.parse('@field: [text disabled readonly autofocus]')

            expect(result.fields).toHaveLength(1)
            const field = result.fields[0]
            expect(field.attributes).toEqual({
                disabled: true,
                readonly: true,
                autofocus: true
            })
        })

        test('should parse mixed attribute types', () => {
            const parser = new FormdownParser()
            const result = parser.parse('@upload: [file accept="image/*" multiple data-max-size="5MB" required]')

            expect(result.fields).toHaveLength(1)
            const field = result.fields[0]
            expect(field.required).toBe(true)
            expect(field.attributes).toEqual({
                accept: 'image/*',
                multiple: true,
                'data-max-size': '5MB'
            })
        })
    })
})
