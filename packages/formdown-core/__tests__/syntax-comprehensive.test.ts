/**
 * @fileoverview Comprehensive Syntax Tests
 * Tests all documented features from SYNTAX.md to ensure 100% feature coverage
 */

import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'
import { parseFormdown, generateFormHTML } from '../src/index'

describe('SYNTAX.md Comprehensive Feature Coverage', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Form Declaration and Hidden Form Architecture', () => {
        test('should parse basic form declaration', () => {
            const content = `
@form[action="/submit" method="POST"]

@name: [text required]
@email: [email required]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(2)
            expect(result.forms[0].name).toBe('name')
            expect(result.forms[0].attributes?.form).toBe('formdown-form-1')
            expect(result.forms[1].name).toBe('email')
            expect(result.forms[1].attributes?.form).toBe('formdown-form-1')
        })

        test('should parse form with custom ID', () => {
            const content = `
@form[id="contact-form" action="/contact" method="POST"]

@name: [text required]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(1)
            expect(result.forms[0].attributes?.form).toBe('contact-form')
        })

        test('should handle multiple forms in one document', () => {
            const content = `
@form[id="login" action="/login" method="POST"]
@form[id="register" action="/register" method="POST"]

@username: [text required form="login"]
@password: [password required form="login"]
@reg_email: [email required form="register"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(3)
            expect(result.forms[0].attributes?.form).toBe('login')
            expect(result.forms[1].attributes?.form).toBe('login')
            expect(result.forms[2].attributes?.form).toBe('register')
        })

        test('should generate hidden form elements in HTML', () => {
            const content = `
@form[action="/submit" method="POST"]

@name: [text required]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('<form hidden id="formdown-form-1" action="/submit" method="POST"></form>')
            expect(html).toContain('form="formdown-form-1"')
        })

        test('should handle field-form explicit association', () => {
            const content = `
@form[action="/submit" method="POST"]
@form[id="other-form-id" action="/other" method="GET"]

@name: [text required]
@special_field: [text form="other-form-id"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].attributes?.form).toBe('other-form-id')
            expect(result.forms[1].attributes?.form).toBe('other-form-id')
        })
    })

    describe('Smart Label Generation', () => {
        test('should convert snake_case to Title Case', () => {
            const testCases = [
                { input: 'first_name', expected: 'First Name' },
                { input: 'email_address', expected: 'Email Address' },
                { input: 'phone_number', expected: 'Phone Number' },
                { input: 'user_bio_text', expected: 'User Bio Text' }
            ]

            testCases.forEach(({ input, expected }) => {
                const content = `@${input}: []`
                const result = parser.parseFormdown(content)

                expect(result.forms[0].label).toBe(expected)
            })
        })

        test('should convert camelCase to Title Case', () => {
            const testCases = [
                { input: 'firstName', expected: 'First Name' },
                { input: 'emailAddress', expected: 'Email Address' },
                { input: 'userPhoneNumber', expected: 'User Phone Number' },
                { input: 'currentUserProfile', expected: 'Current User Profile' }
            ]

            testCases.forEach(({ input, expected }) => {
                const content = `@${input}: []`
                const result = parser.parseFormdown(content)

                expect(result.forms[0].label).toBe(expected)
            })
        })

        test('should capitalize single words', () => {
            const testCases = [
                { input: 'name', expected: 'Name' },
                { input: 'email', expected: 'Email' },
                { input: 'age', expected: 'Age' },
                { input: 'bio', expected: 'Bio' }
            ]

            testCases.forEach(({ input, expected }) => {
                const content = `@${input}: []`
                const result = parser.parseFormdown(content)

                expect(result.forms[0].label).toBe(expected)
            })
        })

        test('should handle field naming rules', () => {
            // Valid field names
            const validNames = ['name', 'user_name', 'email123', 'field_1_test']

            validNames.forEach(name => {
                const content = `@${name}: []`
                const result = parser.parseFormdown(content)

                expect(result.forms).toHaveLength(1)
                expect(result.forms[0].name).toBe(name)
            })
        })
    })

    describe('Label Definition Methods', () => {
        test('should support parentheses syntax for custom labels', () => {
            const content = `
@user_name(Full Name): [text required]
@email_address(Email Address): [email required]
@phone_number(Phone): [tel]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].label).toBe('Full Name')
            expect(result.forms[1].label).toBe('Email Address')
            expect(result.forms[2].label).toBe('Phone')
        })

        test('should support label attribute for custom labels', () => {
            const content = `
@user_name: [text required label="Full Name"]
@email_address: [email required label="Email Address"]
@phone_number: [tel label="Phone"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].label).toBe('Full Name')
            expect(result.forms[1].label).toBe('Email Address')
            expect(result.forms[2].label).toBe('Phone')
        })

        test('should allow mixed usage of label definition methods', () => {
            const content = `
@name(Full Name): [text required]
@description: [textarea label="Tell us about yourself" rows=4]
@submit_btn: [submit label="Send Application"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].label).toBe('Full Name')
            expect(result.forms[1].label).toBe('Tell us about yourself')
            expect(result.forms[2].label).toBe('Send Application')
        })

        test('should prioritize label attribute over parentheses when both present', () => {
            const content = `@field(Parentheses Label): [text label="Attribute Label"]`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].label).toBe('Attribute Label')
        })
    })

    describe('Minimal Syntax', () => {
        test('should handle empty brackets defaulting to text input', () => {
            const content = `
@name: []
@email: []
@phone: []
`
            const result = parser.parseFormdown(content)

            result.forms.forEach(field => {
                expect(field.type).toBe('text')
            })
        })

        test('should support minimal inline syntax without brackets', () => {
            const content = `
Hello ___@name!
Your age is ___@age.
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(2)
            expect(result.forms[0].name).toBe('name')
            expect(result.forms[0].type).toBe('text')
            expect(result.forms[0].inline).toBe(true)
            expect(result.forms[1].name).toBe('age')
            expect(result.forms[1].type).toBe('text')
            expect(result.forms[1].inline).toBe(true)
        })

        test('should be equivalent to full text syntax', () => {
            const minimal = '@name: []'
            const full = '@name: [text]'

            const minimalResult = parser.parseFormdown(minimal)
            const fullResult = parser.parseFormdown(full)

            expect(minimalResult.forms[0].type).toBe(fullResult.forms[0].type)
            expect(minimalResult.forms[0].label).toBe(fullResult.forms[0].label)
        })
    })

    describe('Field Types Coverage', () => {
        test('should support all text input types', () => {
            const content = `
@name: [text required]
@email: [email required]
@password: [password minlength=8]
@phone: [tel]
@website: [url]
@age: [number min=18 max=100]
@birth_date: [date]
@appointment_time: [time]
@birth_month: [month]
@work_week: [week]
@theme_color: [color]
@avatar: [file accept="image/*"]
@volume: [range min=0 max=100]
`
            const result = parser.parseFormdown(content)

            const expectedTypes = [
                'text', 'email', 'password', 'tel', 'url', 'number',
                'date', 'time', 'month', 'week', 'color', 'file', 'range'
            ]

            result.forms.forEach((field, index) => {
                expect(field.type).toBe(expectedTypes[index])
            })
        })

        test('should support textarea with attributes', () => {
            const content = `
@description: [textarea rows=4]
@comments: [textarea required placeholder="Your thoughts..."]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('textarea')
            expect(result.forms[0].attributes?.rows).toBe(4)
            expect(result.forms[1].type).toBe('textarea')
            expect(result.forms[1].required).toBe(true)
            expect(result.forms[1].placeholder).toBe('Your thoughts...')
        })

        test('should support selection fields', () => {
            const content = `
@gender: [radio options="Male,Female,Other"]
@newsletter: [checkbox]
@interests: [checkbox options="Web,Mobile,AI,Design"]
@country: [select options="USA,Canada,UK,Other"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('radio')
            expect(result.forms[0].options).toEqual(['Male', 'Female', 'Other'])

            expect(result.forms[1].type).toBe('checkbox')
            expect(result.forms[1].options).toBeUndefined()

            expect(result.forms[2].type).toBe('checkbox')
            expect(result.forms[2].options).toEqual(['Web', 'Mobile', 'AI', 'Design'])

            expect(result.forms[3].type).toBe('select')
            expect(result.forms[3].options).toEqual(['USA', 'Canada', 'UK', 'Other'])
        })
    })

    describe('New Action Syntax', () => {
        test('should parse @[submit "label"] syntax', () => {
            const content = '@[submit "Send Message"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('button')
            expect(result.forms[0].attributes?.type).toBe('submit')
            expect(result.forms[0].label).toBe('Send Message')
        })

        test('should parse @[reset "label"] syntax', () => {
            const content = '@[reset "Clear Form"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('button')
            expect(result.forms[0].attributes?.type).toBe('reset')
            expect(result.forms[0].label).toBe('Clear Form')
        })

        test('should parse @[button "label"] syntax', () => {
            const content = '@[button "Calculate" onclick="calculate()"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('button')
            expect(result.forms[0].label).toBe('Calculate')
            expect(result.forms[0].attributes?.onclick).toBe('calculate()')
        })

        test('should parse @[image] syntax', () => {
            const content = '@[image "/submit.png" alt="Submit" src="/btn.png"]'
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('image')
            expect(result.forms[0].attributes?.alt).toBe('Submit')
            expect(result.forms[0].attributes?.src).toBe('/btn.png')
        })

        test('should support legacy action syntax', () => {
            const content = `
@submit_btn: [submit label="Submit Form"]
@reset_btn: [reset label="Clear Form"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('submit')
            expect(result.forms[0].label).toBe('Submit Form')
            expect(result.forms[1].type).toBe('reset')
            expect(result.forms[1].label).toBe('Clear Form')
        })

        test('should support action elements with custom attributes', () => {
            const content = `
@[button "Advanced Search" class="btn-primary" data-toggle="modal"]
@[submit "Complete Registration" class="btn-success btn-lg"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].attributes?.class).toBe('btn-primary')
            expect(result.forms[0].attributes?.['data-toggle']).toBe('modal')
            expect(result.forms[1].attributes?.class).toBe('btn-success btn-lg')
        })
    })

    describe('Inline Fields', () => {
        test('should parse inline fields with ___@ prefix', () => {
            const content = `
Welcome back, ___@user_name[text required]!

Your order details:
- Quantity: ___@quantity[number min=1 max=100] items
- Delivery date: ___@delivery_date[date required]
- Total amount: $___@amount[number min=0 step=0.01]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(4)

            result.forms.forEach(field => {
                expect(field.inline).toBe(true)
            })

            expect(result.forms[0].name).toBe('user_name')
            expect(result.forms[0].type).toBe('text')
            expect(result.forms[0].required).toBe(true)

            expect(result.forms[1].name).toBe('quantity')
            expect(result.forms[1].type).toBe('number')
            expect(result.forms[1].attributes?.min).toBe(1)
            expect(result.forms[1].attributes?.max).toBe(100)
        })

        test('should support minimal inline syntax', () => {
            const content = `
Welcome ___@user_name!
Please enter ___@age and ___@email.
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(3)
            result.forms.forEach(field => {
                expect(field.inline).toBe(true)
                expect(field.type).toBe('text')
            })
        })

        test('should support complex inline fields', () => {
            const content = `
Special instructions: ___@notes[textarea rows=2 placeholder="Optional notes"]
Contact preference: ___@contact_method[radio options="Email,Phone,SMS"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].type).toBe('textarea')
            expect(result.forms[0].attributes?.rows).toBe(2)
            expect(result.forms[0].placeholder).toBe('Optional notes')

            expect(result.forms[1].type).toBe('radio')
            expect(result.forms[1].options).toEqual(['Email', 'Phone', 'SMS'])
        })
    })

    describe('HTML Extensibility', () => {
        test('should support all HTML attributes', () => {
            const content = `
@email: [email required autocomplete="email" spellcheck="false"]
@phone: [tel maxlength=15 inputmode="tel"]
@search: [text autocomplete="off" aria-label="Search products"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].attributes?.autocomplete).toBe('email')
            expect(result.forms[0].attributes?.spellcheck).toBe(false)

            expect(result.forms[1].attributes?.maxlength).toBe(15)
            expect(result.forms[1].attributes?.inputmode).toBe('tel')

            expect(result.forms[2].attributes?.autocomplete).toBe('off')
            expect(result.forms[2].attributes?.['aria-label']).toBe('Search products')
        })

        test('should support CSS classes and styling', () => {
            const content = `
@username: [text class="form-control" style="border: 2px solid blue"]
@password: [password data-strength="true" aria-describedby="pwd-help"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].attributes?.class).toBe('form-control')
            expect(result.forms[0].attributes?.style).toBe('border: 2px solid blue')
            expect(result.forms[1].attributes?.['data-strength']).toBe(true)
            expect(result.forms[1].attributes?.['aria-describedby']).toBe('pwd-help')
        })

        test('should support custom data attributes', () => {
            const content = `
@slider: [range min=0 max=100 step=5 data-unit="%" data-live-update="true"]
@upload: [file accept="image/*" data-max-size="5MB" data-preview="true"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].attributes?.['data-unit']).toBe('%')
            expect(result.forms[0].attributes?.['data-live-update']).toBe(true)
            expect(result.forms[1].attributes?.['data-max-size']).toBe('5MB')
            expect(result.forms[1].attributes?.['data-preview']).toBe(true)
        })

        test('should support accessibility attributes', () => {
            const content = `
@bio: [textarea rows=4 aria-required="true" aria-describedby="bio-hint"]
@name: [text aria-label="Full Name" aria-invalid="false"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].attributes?.['aria-required']).toBe(true)
            expect(result.forms[0].attributes?.['aria-describedby']).toBe('bio-hint')
            expect(result.forms[1].attributes?.['aria-label']).toBe('Full Name')
            expect(result.forms[1].attributes?.['aria-invalid']).toBe(false)
        })
    })

    describe('Default Values with Value Attribute', () => {
        test('should support text field default values', () => {
            const content = `
@name: [text value="John Doe" placeholder="Enter your full name"]
@email: [email value="user@example.com" required]
@phone: [tel value="+1-555-0123"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].value).toBe('John Doe')
            expect(result.forms[1].value).toBe('user@example.com')
            expect(result.forms[2].value).toBe('+1-555-0123')
        })

        test('should support number and date default values', () => {
            const content = `
@age: [number value=25 min=18 max=100]
@quantity: [number value=1 min=1 max=10]
@meeting_date: [date value="2024-12-25"]
@appointment_time: [time value="14:30"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].value).toBe(25)
            expect(result.forms[1].value).toBe(1)
            expect(result.forms[2].value).toBe('2024-12-25')
            expect(result.forms[3].value).toBe('14:30')
        })

        test('should support textarea default content', () => {
            const content = `@message: [textarea value="Please enter your message here..." rows=4]`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].value).toBe('Please enter your message here...')
        })

        test('should support selection field defaults', () => {
            const content = `
@country: [select value="USA" options="USA,Canada,UK,Australia"]
@priority: [radio value="Medium" options="Low,Medium,High"]
@features: [checkbox value="Email,SMS" options="Email,SMS,Push,Phone"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].value).toBe('USA')
            expect(result.forms[1].value).toBe('Medium')
            expect(result.forms[2].value).toBe('Email,SMS')
        })

        test('should support single checkbox boolean values', () => {
            const content = `
@newsletter: [checkbox value=true content="Subscribe to newsletter"]
@terms: [checkbox value=false content="I agree to terms"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].value).toBe(true)
            expect(result.forms[1].value).toBe(false)
        })

        test('should support range default values', () => {
            const content = `@satisfaction: [range value=8 min=1 max=10]`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].value).toBe(8)
        })
    })

    describe('Universal Attributes', () => {
        test('should support all universal attributes', () => {
            const content = `
@email: [email label="Email Address" value="user@example.com" required placeholder="Enter email" disabled]
@description: [textarea content="Textarea content" maxlength=500]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].label).toBe('Email Address')
            expect(result.forms[0].value).toBe('user@example.com')
            expect(result.forms[0].required).toBe(true)
            expect(result.forms[0].placeholder).toBe('Enter email')
            expect(result.forms[0].attributes?.disabled).toBe(true)

            expect(result.forms[1].content).toBe('Textarea content')
            expect(result.forms[1].attributes?.maxlength).toBe(500)
        })

        test('should support validation attributes', () => {
            const content = `
@username: [text required minlength=3 maxlength=20 pattern="[a-zA-Z0-9_]+"]
@age: [number min=13 max=120]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].required).toBe(true)
            expect(result.forms[0].attributes?.minlength).toBe(3)
            expect(result.forms[0].attributes?.maxlength).toBe(20)
            expect(result.forms[0].pattern).toBe('[a-zA-Z0-9_]+')

            expect(result.forms[1].attributes?.min).toBe(13)
            expect(result.forms[1].attributes?.max).toBe(120)
        })

        test('should support checkbox content attribute priority', () => {
            const content = `
@terms: [checkbox required content="I agree to the terms and conditions"]
@newsletter(Newsletter): [checkbox content="Subscribe to our weekly newsletter"]
@marketing: [checkbox]
`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].content).toBe('I agree to the terms and conditions')
            expect(result.forms[1].content).toBe('Subscribe to our weekly newsletter')
            expect(result.forms[2].label).toBe('Marketing') // Uses smart label
        })
    })

    describe('Complete Examples Integration', () => {
        test('should parse complete contact form with new action syntax', () => {
            const content = `
# Contact Us

@name(Full Name): [text required]
@email(Email Address): [email required]
@subject: [text required maxlength=100]
@message: [textarea required rows=5 placeholder="Your message..."]

@priority: [radio options="Low,Medium,High"]
@newsletter: [checkbox content="Subscribe to our weekly newsletter"]
@terms: [checkbox required content="I agree to the terms and conditions"]

@[submit "Send Message"]
@[reset "Clear Form"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(9)

            // Verify field structure
            expect(result.forms[0].label).toBe('Full Name')
            expect(result.forms[1].label).toBe('Email Address')
            expect(result.forms[2].attributes?.maxlength).toBe(100)
            expect(result.forms[3].attributes?.rows).toBe(5)
            expect(result.forms[4].options).toEqual(['Low', 'Medium', 'High'])
            expect(result.forms[5].content).toBe('Subscribe to our weekly newsletter')
            expect(result.forms[6].required).toBe(true)
        })

        test('should parse order form with inline fields', () => {
            const content = `
# Order Confirmation

Dear ___@customer_name[text required],

Please confirm your order:
- Product: ___@product[select options="Laptop,Phone,Tablet"]
- Quantity: ___@quantity[number min=1 max=10] units
- Delivery by: ___@delivery_date[date required]

Payment method: ___@payment[radio options="Credit Card,PayPal,Bank Transfer"]

@[submit "Confirm Order"]
@[button "Calculate Total" onclick="calculateTotal()"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(7)

            // Check inline fields
            expect(result.forms[0].inline).toBe(true)
            expect(result.forms[1].inline).toBe(true)
            expect(result.forms[2].inline).toBe(true)
            expect(result.forms[3].inline).toBe(true)
            expect(result.forms[4].inline).toBe(true)

            // Check actions are not inline
            expect(result.forms[5].inline).toBeUndefined()
        })

        test('should parse advanced form with custom attributes', () => {
            const content = `
@avatar(Profile Picture): [file accept="image/*" class="file-upload"]
@username: [text required minlength=3 autocomplete="username" spellcheck="false"]
@email(Email Address): [email required autocomplete="email" class="form-control"]
@birth_date(Date of Birth): [date max="2010-12-31"]
@bio: [textarea rows=4 maxlength=500 placeholder="Tell us about yourself..."]

@theme(Theme Preference): [radio options="Light,Dark,Auto" value="Auto"]
@notifications(Notification Settings): [checkbox options="Email,SMS,Push" class="notification-options"]

@privacy_level(Privacy Level): [range min=1 max=5 step=1 value=3 style="width: 200px"]

@[submit "Save Changes" class="btn btn-primary"]
@[button "Preview Profile" class="btn btn-secondary" onclick="previewProfile()"]
`
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(10)

            // Verify custom attributes
            expect(result.forms[0].attributes?.accept).toBe('image/*')
            expect(result.forms[0].attributes?.class).toBe('file-upload')
            expect(result.forms[1].attributes?.autocomplete).toBe('username')
            expect(result.forms[1].attributes?.spellcheck).toBe(false)
            expect(result.forms[5].value).toBe('Auto')
            expect(result.forms[7].attributes?.style).toBe('width: 200px')
        })
    })

    describe('Edge Cases and Error Handling', () => {
        test('should handle fields with special characters in attributes', () => {
            const content = `@field: [text placeholder="Don't forget your name!" pattern="^[a-zA-Z ]+$"]`
            const result = parser.parseFormdown(content)

            expect(result.forms[0].placeholder).toBe("Don't forget your name!")
            expect(result.forms[0].pattern).toBe('^[a-zA-Z ]+$')
        })

        test('should handle empty form content', () => {
            const content = ''
            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(0)
            expect(result.markdown).toBe('')
        })

        test('should handle malformed field definitions gracefully', () => {
            const content = `
@: [invalid]
@valid_field: [text]
@another@invalid: []
`
            const result = parser.parseFormdown(content)

            // Should only parse valid field
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0].name).toBe('valid_field')
        })

        test('should preserve markdown content while parsing fields', () => {
            const content = `
# Contact Form

This is **important** information about our contact form.

@name: [text required]
@email: [email required]

Please note: All fields marked with * are required.
`
            const result = parser.parseFormdown(content)

            expect(result.markdown).toContain('# Contact Form')
            expect(result.markdown).toContain('This is **important** information')
            expect(result.markdown).toContain('Please note: All fields marked')
            expect(result.forms).toHaveLength(2)
        })
    })
})