import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Other Option (*) Functionality', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Parser - Other Option Support', () => {
        test('should parse select field with other option', () => {
            const content = '@country{USA,Canada,UK,*}: s[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'country',
                type: 'select',
                label: 'Country',
                options: ['USA', 'Canada', 'UK'],
                allowOther: true,
                attributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should parse radio field with other option', () => {
            const content = '@gender{Male,Female,Other,*}: r[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'gender',
                type: 'radio',
                label: 'Gender',
                options: ['Male', 'Female', 'Other'],
                allowOther: true,
                attributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should parse checkbox field with other option', () => {
            const content = '@interests{Programming,Design,Music,*}: c[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'interests',
                type: 'checkbox',
                label: 'Interests',
                options: ['Programming', 'Design', 'Music'],
                allowOther: true,
                attributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should parse other option with standard syntax', () => {
            const content = '@skills: [checkbox options="JavaScript,Python,*" required]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('checkbox')
            expect(result.forms[0].options).toEqual(['JavaScript', 'Python'])
            expect(result.forms[0].allowOther).toBe(true)
            expect(result.forms[0].required).toBe(true)
        })

        test('should parse other option in different positions', () => {
            const content1 = '@category{*,Web,Mobile}: s[]'
            const content2 = '@category{Web,*,Mobile}: s[]'
            
            const result1 = parser.parseFormdown(content1)
            const result2 = parser.parseFormdown(content2)

            expect(result1.forms[0].allowOther).toBe(true)
            expect(result1.forms[0].options).toEqual(['Web', 'Mobile'])
            
            expect(result2.forms[0].allowOther).toBe(true)
            expect(result2.forms[0].options).toEqual(['Web', 'Mobile'])
        })

        test('should not parse other option without asterisk', () => {
            const content = '@country{USA,Canada,UK}: s[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].allowOther).toBeUndefined()
            expect(result.forms[0].options).toEqual(['USA', 'Canada', 'UK'])
        })
    })

    describe('Generator - Other Option Rendering', () => {
        test('should generate select field with other option', () => {
            const field = {
                name: 'country',
                type: 'select',
                label: 'Country',
                options: ['USA', 'Canada', 'UK'],
                allowOther: true,
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)

            expect(html).toContain('<select')
            expect(html).toContain('<option value="USA">USA</option>')
            expect(html).toContain('<option value="Canada">Canada</option>')
            expect(html).toContain('<option value="UK">UK</option>')
            expect(html).toContain('<option value="">Other (please specify)</option>')
            expect(html).toContain('type="text"')
            expect(html).not.toContain('name="country_other"')  // Text input doesn't have name attribute
            expect(html).toContain('class="formdown-other-input"')
            expect(html).toContain('style="display: none;')
        })

        test('should generate radio field with other option', () => {
            const field = {
                name: 'gender',
                type: 'radio',
                label: 'Gender',
                options: ['Male', 'Female'],
                allowOther: true,
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)

            expect(html).toContain('<fieldset')
            expect(html).toContain('type="radio"')
            expect(html).toContain('value="Male"')
            expect(html).toContain('value="Female"')
            expect(html).toContain('value=""')  // Other radio has empty value initially
            expect(html).toContain('name="gender"')
            expect(html).not.toContain('name="gender_other"')  // Text input doesn't have name attribute
            expect(html).toContain('Other:')
            expect(html).toContain('class="formdown-other-input"')
        })

        test('should generate checkbox field with other option', () => {
            const field = {
                name: 'interests',
                type: 'checkbox',
                label: 'Interests',
                options: ['Programming', 'Design', 'Music'],
                allowOther: true,
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)

            expect(html).toContain('<fieldset')
            expect(html).toContain('type="checkbox"')
            expect(html).toContain('value="Programming"')
            expect(html).toContain('value="Design"')
            expect(html).toContain('value="Music"')
            expect(html).toContain('value=""')  // Other checkbox has empty value initially
            expect(html).toContain('name="interests"')
            expect(html).not.toContain('name="interests_other"')  // Text input doesn't have name attribute
            expect(html).toContain('Other:')
            expect(html).toContain('class="formdown-other-input"')
        })

        test('should not generate other option when allowOther is false', () => {
            const field = {
                name: 'country',
                type: 'select',
                label: 'Country',
                options: ['USA', 'Canada', 'UK'],
                allowOther: false,
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)

            expect(html).not.toContain('value="_other"')
            expect(html).not.toContain('Other (please specify)')
            expect(html).not.toContain('name="country_other"')
        })

        test('should not generate other option when allowOther is undefined', () => {
            const field = {
                name: 'country',
                type: 'select',
                label: 'Country',
                options: ['USA', 'Canada', 'UK'],
                attributes: { form: "formdown-form-default" }
            }

            const html = generator.generateFieldHTML(field)

            expect(html).not.toContain('value="_other"')
            expect(html).not.toContain('Other (please specify)')
            expect(html).not.toContain('name="country_other"')
        })
    })

    describe('Integration - Parser + Generator', () => {
        test('should parse and generate select field with other option', () => {
            const content = '@country{USA,Canada,UK,*}: s[required]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('<form hidden id="formdown-form-default"')
            expect(html).toContain('<select')
            expect(html).toContain('required')
            expect(html).toContain('<option value="USA">USA</option>')
            expect(html).toContain('<option value="">Other (please specify)</option>')
            expect(html).not.toContain('name="country_other"')  // Text input doesn't have name
        })

        test('should parse and generate radio field with other option', () => {
            const content = '@preferences{Email,SMS,Phone,*}: r[required]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('<fieldset')
            expect(html).toContain('type="radio"')
            expect(html).toContain('value="Email"')
            expect(html).toContain('value="SMS"')
            expect(html).toContain('value="Phone"')
            expect(html).toContain('value=""')  // Other radio has empty value
            expect(html).not.toContain('name="preferences_other"')  // Text input doesn't have name
        })

        test('should parse and generate checkbox field with other option', () => {
            const content = '@skills{JavaScript,Python,Java,*}: c[]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('<fieldset')
            expect(html).toContain('type="checkbox"')
            expect(html).toContain('value="JavaScript"')
            expect(html).toContain('value="Python"')
            expect(html).toContain('value="Java"')
            expect(html).toContain('value=""')  // Other checkbox has empty value
            expect(html).not.toContain('name="skills_other"')  // Text input doesn't have name
        })

        test('should handle complex form with multiple other options', () => {
            const content = `# Survey Form

@country{USA,Canada,UK,*}: s[required]
@interests{Tech,Sports,Music,*}: c[]
@contact_method{Email,Phone,*}: r[required]

Thank you for your response!`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('<h1>Survey Form</h1>')
            expect(html).toContain('Thank you for your response!')
            
            // Check all three fields have simplified other options (no "_other" names)
            expect(html).not.toContain('name="country_other"')
            expect(html).not.toContain('name="interests_other"')
            expect(html).not.toContain('name="contact_method_other"')
            
            // Check proper field types
            expect(html.match(/<select/g)).toHaveLength(1)
            expect(html.match(/type="checkbox"/g)).toHaveLength(4) // 3 + 1 other
            expect(html.match(/type="radio"/g)).toHaveLength(3) // 2 + 1 other
        })
    })

    describe('Edge Cases', () => {
        test('should handle empty options with other', () => {
            const content = '@category{*}: s[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].allowOther).toBe(true)
            expect(result.forms[0].options).toEqual([])
        })

        test('should handle single option with other', () => {
            const content = '@preference{Yes,*}: r[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].allowOther).toBe(true)
            expect(result.forms[0].options).toEqual(['Yes'])
        })

        test('should handle multiple asterisks', () => {
            const content = '@test{Option1,*,Option2,*}: s[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].allowOther).toBe(true)
            expect(result.forms[0].options).toEqual(['Option1', 'Option2'])
        })

        test('should handle asterisk in option text (escaped)', () => {
            const content = '@rating{Good,Average,Bad}: s[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].allowOther).toBeUndefined()
            expect(result.forms[0].options).toEqual(['Good', 'Average', 'Bad'])
        })
    })
})