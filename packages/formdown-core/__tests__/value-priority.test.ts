import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'
import { getSchema } from '../src/schema'

describe('Value Priority System', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Schema Value Parsing and Storage', () => {
        test('should store value attribute in field schema', () => {
            const content = '@name(Full Name)*: [placeholder="Enter your full name" value="hello"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms[0]).toMatchObject({
                name: 'name',
                type: 'text',
                label: 'Full Name',
                required: true,
                placeholder: 'Enter your full name',
                value: 'hello'
            })
        })

        test('should extract schema with default values', () => {
            const content = `
@name: [value="Default Name"]
@email: [email value="default@example.com"]
@age: [number value=25]
@active: [checkbox value=true]
`
            const schema = getSchema(content)
            
            expect(schema.name).toMatchObject({
                type: 'text',
                value: 'Default Name'
            })
            expect(schema.email.value).toBe('default@example.com')
            expect(schema.age.value).toBe(25)
            expect(schema.active.value).toBe(true)
        })
    })

    describe('HTML Generation with Values', () => {
        test('should render value attribute in generated HTML', () => {
            const content = '@name: [value="John Doe"]'
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            expect(html).toContain('value="John Doe"')
            expect(html).toContain('type="text"')
            expect(html).toContain('name="name"')
        })

        test('should handle different field types with values', () => {
            const content = `
@text_field: [value="text value"]
@number_field: [number value=42]
@date_field: [date value="2024-01-15"]
@textarea_field: [textarea value="multi line text"]
@select_field: [select value="option2" options="option1,option2,option3"]
@radio_field: [radio value="B" options="A,B,C"]
@checkbox_single: [checkbox value=true content="Agree to terms"]
@checkbox_group: [checkbox value="opt1,opt3" options="opt1,opt2,opt3,opt4"]
`
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // Text input
            expect(html).toContain('name="text_field"')
            expect(html).toContain('value="text value"')
            
            // Number input
            expect(html).toContain('name="number_field"')
            expect(html).toContain('value="42"')
            
            // Date input
            expect(html).toContain('name="date_field"')
            expect(html).toContain('value="2024-01-15"')
            
            // Textarea (value in content)
            expect(html).toContain('textarea_field')
            expect(html).toContain('>multi line text</textarea>')
            
            // Select (selected option)
            expect(html).toContain('<option value="option2" selected>option2</option>')
            
            // Radio (checked option)
            expect(html).toContain('value="B" checked')
            
            // Single checkbox (checked)
            expect(html).toContain('name="checkbox_single"')
            expect(html).toContain('checked')
            
            // Checkbox group (multiple checked)
            expect(html).toContain('value="opt1" checked')
            expect(html).toContain('value="opt3" checked')
            expect(html).not.toContain('value="opt2" checked')
            expect(html).not.toContain('value="opt4" checked')
        })
    })

    describe('Priority System Documentation', () => {
        test('should demonstrate value priority: context.data > schema value', () => {
            // This test documents the expected behavior
            const content = '@name: [value="Schema Default"]'
            const schema = getSchema(content)
            
            // Schema contains the default value
            expect(schema.name.value).toBe('Schema Default')
            
            // In UI component:
            // 1. If context.data.name exists, it takes precedence
            // 2. If not, schema.name.value is used as default
            // 3. HTML value attribute is already rendered by generator
            
            // Example priority flow:
            const contextData = { name: 'User Input' }
            const finalValue = contextData.name !== undefined 
                ? contextData.name 
                : schema.name.value
            
            expect(finalValue).toBe('User Input') // context.data wins
        })

        test('should use schema value when context.data is empty', () => {
            const content = '@email: [email value="default@example.com"]'
            const schema = getSchema(content)
            
            const contextData: Record<string, any> = {} // No user data
            const finalValue = contextData.email !== undefined 
                ? contextData.email 
                : schema.email.value
            
            expect(finalValue).toBe('default@example.com') // schema value used
        })
    })

    describe('Edge Cases', () => {
        test('should handle empty string values', () => {
            const content = '@field: [value=""]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms[0].value).toBe('')
            
            const html = generator.generateFieldHTML(result.forms[0])
            expect(html).toContain('value=""')
        })

        test('should handle null/undefined gracefully', () => {
            const field = {
                name: 'test',
                type: 'text',
                label: 'Test',
                value: undefined,
                attributes: { form: "formdown-form-default" }
            }
            
            const html = generator.generateFieldHTML(field)
            expect(html).not.toContain('value=')
        })

        test('should handle boolean false for checkboxes', () => {
            const content = '@active: [checkbox value=false]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms[0].value).toBe(false)
            
            const html = generator.generateFieldHTML(result.forms[0])
            expect(html).not.toContain('checked')
        })

        test('should handle numeric zero', () => {
            const content = '@count: [number value=0]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms[0].value).toBe(0)
            
            const html = generator.generateFieldHTML(result.forms[0])
            expect(html).toContain('value="0"')
        })
    })

    describe('Complex Scenarios', () => {
        test('should handle form with mixed value sources', () => {
            const content = `
# User Profile Form

@form[id="profile" action="/api/profile" method="POST"]

## Personal Information
@first_name: [value="John" placeholder="First name" required]
@last_name: [value="Doe" placeholder="Last name" required]
@email: [email value="john.doe@example.com" required]

## Preferences
@theme: [select value="dark" options="light,dark,auto"]
@notifications: [checkbox value="email,push" options="email,sms,push,in-app"]
@newsletter: [checkbox value=true content="Subscribe to newsletter"]

## Bio
@bio: [textarea value="Software developer interested in web technologies." rows=4]
`
            const parsed = parser.parseFormdown(content)
            const schema = getSchema(content)
            const html = generator.generateHTML(parsed)
            
            // Verify schema extraction
            expect(schema.first_name.value).toBe('John')
            expect(schema.last_name.value).toBe('Doe')
            expect(schema.email.value).toBe('john.doe@example.com')
            expect(schema.theme.value).toBe('dark')
            expect(schema.notifications.value).toBe('email,push')
            expect(schema.newsletter.value).toBe(true)
            expect(schema.bio.value).toBe('Software developer interested in web technologies.')
            
            // Verify HTML generation
            expect(html).toContain('value="John"')
            expect(html).toContain('value="Doe"')
            expect(html).toContain('value="john.doe@example.com"')
            expect(html).toContain('<option value="dark" selected>dark</option>')
            expect(html).toContain('value="email" checked')
            expect(html).toContain('value="push" checked')
            expect(html).toContain('newsletter')
            expect(html).toContain('checked')
            expect(html).toContain('>Software developer interested in web technologies.</textarea>')
        })

        test('should handle dynamic value updates scenario', () => {
            // Initial form definition with defaults
            const initialContent = '@username: [value="guest"]'
            const initialSchema = getSchema(initialContent)
            expect(initialSchema.username.value).toBe('guest')
            
            // User updates the formdown content
            const updatedContent = '@username: [value="admin"]'
            const updatedSchema = getSchema(updatedContent)
            expect(updatedSchema.username.value).toBe('admin')
            
            // Simulate priority handling
            const userContext = { username: 'actual_user' }
            const displayValue = userContext.username || updatedSchema.username.value
            expect(displayValue).toBe('actual_user')
        })
    })
})