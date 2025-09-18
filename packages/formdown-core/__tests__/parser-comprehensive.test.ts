import { FormdownParser } from '../src/parser'

describe('FormdownParser - Comprehensive', () => {
    let parser: FormdownParser

    beforeEach(() => {
        parser = new FormdownParser()
    })

    describe('Standard Syntax', () => {
        describe('Basic Fields', () => {
            test('should parse basic text field', () => {
                const content = '@name: [text required]'
                const result = parser.parseFormdown(content)

                expect(result.forms).toHaveLength(1)
                expect(result.forms[0]).toEqual({
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                    required: true,
                    attributes: {
                        form: "formdown-form-default"
                    }
                })
            })

            test('should parse field with custom label', () => {
                const content = '@user_name(Full Name): [text required]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0]).toEqual({
                    name: 'user_name',
                    type: 'text',
                    label: 'Full Name',
                    required: true,
                    attributes: {
                        form: "formdown-form-default"
                    }
                })
            })

            test('should parse field with attributes', () => {
                const content = '@email: [email required placeholder="Enter email"]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0]).toEqual({
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    required: true,
                    placeholder: 'Enter email',
                    attributes: {
                        form: "formdown-form-default"
                    }
                })
            })
        })

        describe('Field Types', () => {
            test('should parse number field with validation', () => {
                const content = '@age: [number min=18 max=100]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0]).toEqual({
                    name: 'age',
                    type: 'number',
                    label: 'Age',
                    attributes: { min: 18, max: 100, form: "formdown-form-default" }
                })
            })

            test('should parse textarea with attributes', () => {
                const content = '@description: [textarea rows=4 cols=50]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0]).toEqual({
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    attributes: { rows: 4, cols: 50, form: "formdown-form-default" }
                })
            })

            test('should parse select field with options', () => {
                const content = '@country: [select required options="USA,Canada,UK"]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0].type).toBe('select')
                expect(result.forms[0].required).toBe(true)
            })
        })

        describe('HTML Attributes', () => {
            test('should parse custom data attributes', () => {
                const result = parser.parse('@slider: [range min=0 max=100 data-unit="%" class="custom-slider"]')

                expect(result.fields[0].attributes).toEqual({
                    min: 0,
                    max: 100,
                    'data-unit': '%',
                    'class': 'custom-slider',
                    form: "formdown-form-default"
                })
            })

            test('should parse boolean attributes', () => {
                const result = parser.parse('@field: [text disabled readonly autofocus]')

                expect(result.fields[0].attributes).toEqual({
                    disabled: true,
                    readonly: true,
                    autofocus: true,
                    form: "formdown-form-default"
                })
            })

            test('should parse accessibility attributes', () => {
                const result = parser.parse('@bio: [textarea aria-required="true" aria-describedby="bio-hint"]')

                expect(result.fields[0].attributes).toEqual({
                    'aria-required': true,
                    'aria-describedby': 'bio-hint',
                    form: "formdown-form-default"
                })
            })
        })
    })

    describe('Shorthand Syntax', () => {
        describe('Required Fields', () => {
            test('should parse required text field', () => {
                const content = '@name*: []'
                const result = parser.parseFormdown(content)

                expect(result.forms[0]).toEqual({
                    name: 'name',
                    type: 'text',
                    label: 'Name',
                    required: true,
                    attributes: {
                        form: "formdown-form-default"
                    }
                })
            })

            test('should parse required field with custom label', () => {
                const content = '@user_name(Full Name)*: []'
                const result = parser.parseFormdown(content)

                expect(result.forms[0]).toEqual({
                    name: 'user_name',
                    type: 'text',
                    label: 'Full Name',
                    required: true,
                    attributes: {
                        form: "formdown-form-default"
                    }
                })
            })
        })

        describe('Type Markers', () => {
            test('should parse email type marker', () => {
                const content = '@email: @[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('email')
            })

            test('should parse number type marker', () => {
                const content = '@age: #[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('number')
            })

            test('should parse telephone type marker', () => {
                const content = '@phone: %[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('tel')
            })

            test('should parse URL type marker', () => {
                const content = '@website: &[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('url')
            })

            test('should parse password type marker', () => {
                const content = '@password: ?[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('password')
            })

            test('should parse date type marker', () => {
                const content = '@birth_date: d[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('date')
            })

            test('should parse time type marker', () => {
                const content = '@meeting_time: t[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('time')
            })

            test('should parse datetime type marker', () => {
                const content = '@appointment: dt[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('datetime-local')
            })

            test('should parse textarea type marker', () => {
                const content = '@description: T[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('textarea')
            })

            test('should parse textarea with rows', () => {
                const content = '@description: T4[]'
                const result = parser.parseFormdown(content)
                expect(result.forms[0].type).toBe('textarea')
                expect(result.forms[0].attributes?.rows).toBe(4)
            })
        })

        describe('Selection Fields', () => {
            test('should parse radio field with options', () => {
                const content = '@gender{Male,Female,Other}: r[]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0].type).toBe('radio')
                expect(result.forms[0].options).toEqual(['Male', 'Female', 'Other'])
            })

            test('should parse select field with options', () => {
                const content = '@country{USA,Canada,UK}: s[]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0].type).toBe('select')
                expect(result.forms[0].options).toEqual(['USA', 'Canada', 'UK'])
            })

            test('should parse checkbox field with options', () => {
                const content = '@interests{Web,Mobile,AI}: c[]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0].type).toBe('checkbox')
                expect(result.forms[0].options).toEqual(['Web', 'Mobile', 'AI'])
            })

            test('should parse selection field with allowOther', () => {
                const content = '@skills{JavaScript,Python,*}: c[]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0].allowOther).toBe(true)
                expect(result.forms[0].options).toEqual(['JavaScript', 'Python'])
            })
        })

        describe('Pattern and Content', () => {
            test('should parse pattern validation', () => {
                const content = '@username{^[a-zA-Z0-9_]{3,20}$}: []'
                const result = parser.parseFormdown(content)

                expect(result.forms).toHaveLength(1)
                expect(result.forms[0].pattern).toBe('^[a-zA-Z0-9_]{3,20}$')
            })

            test('should parse mask pattern and convert to regex', () => {
                const content = '@phone{(###) ###-####}: %[]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0].pattern).toBe('^\\(\\d{3}\\) \\d{3}\\-\\d{4}$')
            })

            test('should parse date format', () => {
                const content = '@birth_date{yyyy-MM-dd}: d[]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0].format).toBe('yyyy-MM-dd')
            })
        })

        describe('Combined Features', () => {
            test('should parse required field with pattern and label', () => {
                const content = '@username(Username)*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="Enter username"]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0]).toEqual({
                    name: 'username',
                    type: 'text',
                    label: 'Username',
                    required: true,
                    pattern: '^[a-zA-Z0-9_]{3,20}$',
                    placeholder: 'Enter username',
                    attributes: {
                        form: "formdown-form-default"
                    }
                })
            })

            test('should parse multiple shorthand features', () => {
                const content = '@email(Email Address)*: @[placeholder="your@email.com" required]'
                const result = parser.parseFormdown(content)

                expect(result.forms[0]).toEqual({
                    name: 'email',
                    type: 'email',
                    label: 'Email Address',
                    required: true,
                    placeholder: 'your@email.com',
                    attributes: {
                        form: "formdown-form-default"
                    }
                })
            })
        })
    })

    describe('Inline Fields', () => {
        test('should parse inline text field', () => {
            const content = 'Hello ___@username[text required]!'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'username',
                type: 'text',
                label: 'Username',
                required: true,
                inline: true,
                attributes: { form: "formdown-form-default" }
            })
        })

        test('should parse inline shorthand field', () => {
            const content = 'Your email: @___@email*'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'email',
                type: 'email',
                label: 'Email',
                required: true,
                inline: true,
                attributes: { form: "formdown-form-default" }
            })
        })

        test('should parse multiple inline fields', () => {
            const content = 'Welcome ___@name[text required]! You are ___@age[number min=18] years old.'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(2)
            expect(result.forms[0].name).toBe('name')
            expect(result.forms[1].name).toBe('age')
            expect(result.forms[0].inline).toBe(true)
            expect(result.forms[1].inline).toBe(true)
        })
    })

    describe('Mixed Content', () => {
        test('should parse markdown with block and inline fields', () => {
            const content = `# User Profile

@name: [text required]
@email: [email required]

Your username is ___@username[text required] and you are ___@age[number min=18] years old.`

            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(4)
            expect(result.markdown).toContain('# User Profile')
            expect(result.forms.filter(f => f.inline)).toHaveLength(2)
        })

        test('should preserve markdown structure', () => {
            const content = `# Contact Form

## Personal Information
@name: [text required]

## Contact Details  
@email: [email required]

Thank you!`

            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(2)
            expect(result.markdown).toContain('# Contact Form')
            expect(result.markdown).toContain('## Personal Information')
            expect(result.markdown).toContain('Thank you!')
        })
    })

    describe('Error Handling', () => {
        test('should handle invalid field syntax gracefully', () => {
            const content = '@invalid-field-syntax'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(0)
            expect(result.markdown).toContain('@invalid-field-syntax')
        })

        test('should handle empty content', () => {
            const result = parser.parseFormdown('')
            expect(result.forms).toHaveLength(0)
            expect(result.markdown).toBe('')
        })

        test('should handle markdown-only content', () => {
            const content = '# Title\n\nThis is just markdown.'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(0)
            expect(result.markdown).toContain('# Title')
        })

        test('should skip invalid field names', () => {
            const content = '@123invalid: [text]\n@valid: [text]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0].name).toBe('valid')
        })
    })

    describe('Legacy Support', () => {
        test('should support legacy parse method', () => {
            const content = '@name: [text required]\n@email: [email]'
            const result = parser.parse(content)

            expect(result.fields).toHaveLength(2)
            expect(result.errors).toHaveLength(0)
        })
    })
})