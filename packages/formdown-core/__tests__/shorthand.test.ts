import { FormdownParser } from '../src/parser'

describe('FormdownParser - Shorthand Syntax', () => {
    let parser: FormdownParser

    beforeEach(() => {
        parser = new FormdownParser()
    })

    describe('Required Fields', () => {
        test('should parse required text field', () => {
            const content = '@name*: []'
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

        test('should parse required email field', () => {
            const content = '@email*: @[]'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'email',
                type: 'email',
                label: 'Email',
                required: true,
                attributes: {}
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

        test('should parse tel type marker', () => {
            const content = '@phone: %[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('tel')
        })

        test('should parse url type marker', () => {
            const content = '@website: &[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('url')
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

        test('should parse datetime-local type marker', () => {
            const content = '@appointment: dt[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('datetime-local')
        })

        test('should parse password type marker', () => {
            const content = '@password: ?[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('password')
        })

        test('should parse textarea type marker', () => {
            const content = '@description: T[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('textarea')
        })

        test('should parse radio type marker', () => {
            const content = '@gender: r[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('radio')
        })

        test('should parse select type marker', () => {
            const content = '@country: s[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('select')
        })

        test('should parse checkbox type marker', () => {
            const content = '@newsletter: c[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('checkbox')
        })
    })

    describe('Textarea Rows', () => {
        test('should parse textarea with rows', () => {
            const content = '@notes: T4[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'notes',
                type: 'textarea',
                label: 'Notes',
                attributes: { rows: 4 }
            })
        })

        test('should parse required textarea with rows', () => {
            const content = '@description*: T6[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'description',
                type: 'textarea',
                label: 'Description',
                required: true,
                attributes: { rows: 6 }
            })
        })
    })

    describe('Pattern Validation', () => {
        test('should parse regex pattern', () => {
            const content = '@username{^[a-zA-Z0-9_]{3,20}$}: []'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'username',
                type: 'text',
                label: 'Username',
                pattern: '^[a-zA-Z0-9_]{3,20}$',
                attributes: {}
            })
        })

        test('should parse mask pattern', () => {
            const content = '@phone{(###)###-####}: []'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'phone',
                type: 'text',
                label: 'Phone',
                pattern: '^\\(\\d{3}\\)\\d{3}\\-\\d{4}$',
                attributes: {}
            })
        })

        test('should parse glob pattern', () => {
            const content = '@work_email{*@company.com}: []'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'work_email',
                type: 'text',
                label: 'Work Email',
                pattern: '^.*@company\\.com$',
                attributes: {}
            })
        })

        test('should parse email pattern with type marker', () => {
            const content = '@email{^[^@]+@company\\.com$}: @[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'email',
                type: 'email',
                label: 'Email',
                pattern: '^[^@]+@company\\.com$',
                attributes: {}
            })
        })
    })

    describe('Date/Time Formats', () => {
        test('should parse date format', () => {
            const content = '@birth_date{yyyy-MM-dd}: d[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'birth_date',
                type: 'date',
                label: 'Birth Date',
                format: 'yyyy-MM-dd',
                attributes: {}
            })
        })

        test('should parse time format', () => {
            const content = '@meeting_time{HH:mm:ss}: t[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'meeting_time',
                type: 'time',
                label: 'Meeting Time',
                format: 'HH:mm:ss',
                attributes: {}
            })
        })

        test('should parse datetime format', () => {
            const content = '@appointment{yyyy-MM-dd HH:mm}: dt[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'appointment',
                type: 'datetime-local',
                label: 'Appointment',
                format: 'yyyy-MM-dd HH:mm',
                attributes: {}
            })
        })
    })

    describe('Selection Options', () => {
        test('should parse radio options', () => {
            const content = '@size{S,M,L,XL}: r[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'size',
                type: 'radio',
                label: 'Size',
                options: ['S', 'M', 'L', 'XL'],
                attributes: {}
            })
        })

        test('should parse select options', () => {
            const content = '@country{USA,Canada,UK}: s[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'country',
                type: 'select',
                label: 'Country',
                options: ['USA', 'Canada', 'UK'],
                attributes: {}
            })
        })

        test('should parse checkbox options', () => {
            const content = '@skills{JS,Python,Java}: c[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'skills',
                type: 'checkbox',
                label: 'Skills',
                options: ['JS', 'Python', 'Java'],
                attributes: {}
            })
        })

        test('should parse options with allow-other', () => {
            const content = '@size{S,M,L,XL,*}: r[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'size',
                type: 'radio',
                label: 'Size',
                options: ['S', 'M', 'L', 'XL'],
                allowOther: true,
                attributes: {}
            })
        })

        test('should parse single checkbox', () => {
            const content = '@newsletter: c[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'newsletter',
                type: 'checkbox',
                label: 'Newsletter',
                attributes: {}
            })
        })
    })

    describe('Labels', () => {
        test('should parse custom label', () => {
            const content = '@first_name(Full Name)*: []'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'first_name',
                type: 'text',
                label: 'Full Name',
                required: true,
                attributes: {}
            })
        })

        test('should parse label with type marker', () => {
            const content = '@user_email(Email Address)*: @[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'user_email',
                type: 'email',
                label: 'Email Address',
                required: true,
                attributes: {}
            })
        })
    })

    describe('Complex Combinations', () => {
        test('should parse complex shorthand with all features', () => {
            const content = '@username(Username)*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="Enter username"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'username',
                type: 'text',
                label: 'Username',
                required: true,
                pattern: '^[a-zA-Z0-9_]{3,20}$',
                placeholder: 'Enter username',
                attributes: {}
            })
        })

        test('should parse complex selection with allow-other', () => {
            const content = '@skills(Your Skills)*{Frontend,Backend,Mobile,*}: c[]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'skills',
                type: 'checkbox',
                label: 'Your Skills',
                required: true,
                options: ['Frontend', 'Backend', 'Mobile'],
                allowOther: true,
                attributes: {}
            })
        })

        test('should parse date with format and additional attributes', () => {
            const content = '@birth_date(Birth Date){yyyy-MM-dd}: d[min="1980-01-01" max="2010-12-31"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0]).toEqual({
                name: 'birth_date',
                type: 'date',
                label: 'Birth Date',
                format: 'yyyy-MM-dd',
                attributes: { min: '1980-01-01', max: '2010-12-31' }
            })
        })
    })

    describe('Inline Shorthand Fields', () => {
        test('should parse inline required field', () => {
            const content = 'Hello ___@name*!'
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

        test('should parse inline field with type marker', () => {
            const content = 'Your email: @___@email*'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'email',
                type: 'email',
                label: 'Email',
                required: true,
                attributes: {}
            })
        })

        test('should parse inline field with pattern', () => {
            const content = 'Phone: %___@phone{(###)###-####}'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'phone',
                type: 'tel',
                label: 'Phone',
                pattern: '^\\(\\d{3}\\)\\d{3}\\-\\d{4}$',
                attributes: {}
            })
        })

        test('should parse inline date with format', () => {
            const content = 'Birth date: d___@birth_date{yyyy-MM-dd}'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'birth_date',
                type: 'date',
                label: 'Birth Date',
                format: 'yyyy-MM-dd',
                attributes: {}
            })
        })

        test('should parse multiple inline fields', () => {
            const content = 'Name: ___@name*, Age: #___@age* years old'
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(2)
            expect(result.forms[0]).toEqual({
                name: 'name',
                type: 'text',
                label: 'Name',
                required: true,
                attributes: {}
            })
            expect(result.forms[1]).toEqual({
                name: 'age',
                type: 'number',
                label: 'Age',
                required: true,
                attributes: {}
            })
        })
    })

    describe('Mixed Syntax Support', () => {
        test('should parse mix of shorthand and standard syntax', () => {
            const content = `
@name*: []
@email: [email required]
@age: #[min=18]
@phone{(###)###-####}: []
@skills{JS,Python,*}: c[]
@bio: [textarea rows=4]
            `.trim()
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(6)
            
            // Shorthand required field
            expect(result.forms[0]).toEqual({
                name: 'name',
                type: 'text',
                label: 'Name',
                required: true,
                attributes: {}
            })
            
            // Standard syntax
            expect(result.forms[1]).toEqual({
                name: 'email',
                type: 'email',
                label: 'Email',
                required: true,
                attributes: {}
            })
            
            // Shorthand with type marker and attributes
            expect(result.forms[2]).toEqual({
                name: 'age',
                type: 'number',
                label: 'Age',
                attributes: { min: 18 }
            })
            
            // Shorthand with pattern
            expect(result.forms[3]).toEqual({
                name: 'phone',
                type: 'text',
                label: 'Phone',
                pattern: '^\\(\\d{3}\\)\\d{3}\\-\\d{4}$',
                attributes: {}
            })
            
            // Shorthand with options and allow-other
            expect(result.forms[4]).toEqual({
                name: 'skills',
                type: 'checkbox',
                label: 'Skills',
                options: ['JS', 'Python'],
                allowOther: true,
                attributes: {}
            })
            
            // Standard syntax
            expect(result.forms[5]).toEqual({
                name: 'bio',
                type: 'textarea',
                label: 'Bio',
                attributes: { rows: 4 }
            })
        })
    })

    describe('Error Handling', () => {
        test('should handle invalid field names', () => {
            const content = '@1invalid*: []'
            
            expect(() => {
                parser.parseFormdown(content)
            }).toThrow('Invalid field name')
        })

        test('should fall back to standard syntax for invalid shorthand', () => {
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
    })
})