import { FormdownParser, FormdownGenerator } from '../src/index'

describe('Real-world Markdown Integration', () => {
    test('should handle markdown with formdown fields correctly', () => {
        const parser = new FormdownParser()
        const generator = new FormdownGenerator()

        const content = `# Demo: Markdown + FormDown Integration

This file demonstrates that **FormDown is a true superset of Markdown**.

## Text Formatting

You can use all standard Markdown features:

- **Bold text**
- *Italic text*  
- ~~Strikethrough~~
- \`Inline code\`

Welcome ___@visitor_name[text]! Please tell us about yourself.

### Contact Information

@full_name(Full Name): [text required]
@email(Email Address): [email required]
@message(Message): [textarea rows=4]`

        // Parse using parseFormdown method
        const result = parser.parseFormdown(content)

        // Verify markdown is preserved
        expect(result.markdown).toContain('# Demo: Markdown + FormDown Integration')
        expect(result.markdown).toContain('## Text Formatting')
        expect(result.markdown).toContain('**Bold text**')
        expect(result.markdown).toContain('*Italic text*')
        expect(result.markdown).toContain('### Contact Information')

        // Verify forms are extracted (note: forms not fields)
        expect(result.forms.length).toBeGreaterThan(0)

        // Check specific fields
        const nameField = result.forms.find(f => f.name === 'full_name')
        expect(nameField).toBeDefined()
        expect(nameField?.label).toBe('Full Name')
        expect(nameField?.required).toBe(true)

        const emailField = result.forms.find(f => f.name === 'email')
        expect(emailField).toBeDefined()
        expect(emailField?.type).toBe('email')

        // Generate HTML
        const html = generator.generateHTML(result)

        // Verify HTML contains markdown elements
        expect(html).toContain('<h1>Demo: Markdown + FormDown Integration</h1>')
        expect(html).toContain('<h2>Text Formatting</h2>')
        expect(html).toContain('<strong>Bold text</strong>')
        expect(html).toContain('<em>Italic text</em>')
        expect(html).toContain('<del>Strikethrough</del>')
        expect(html).toContain('<code>Inline code</code>')

        // Verify HTML contains hidden form elements
        expect(html).toContain('<form hidden id="formdown-form-default"')
        expect(html).toContain('<input type="text"')
        expect(html).toContain('<input type="email"')
        expect(html).toContain('<textarea')

        // Verify inline fields are handled
        expect(html).toContain('<span contenteditable="true" data-field-name="visitor_name"')
    })

    test('should handle edge cases with @ symbols and brackets', () => {
        const parser = new FormdownParser()
        const content = `# Contact Info

Email us at support@example.com or follow @ourcompany.

Check out [this link](https://example.com) and ![image](test.jpg).

@contact_email: [email required]`

        const result = parser.parseFormdown(content)
        // Should preserve email addresses and social handles
        expect(result.markdown).toContain('support@example.com')
        expect(result.markdown).toContain('@ourcompany')
        expect(result.markdown).toContain('[this link](https://example.com)')
        expect(result.markdown).toContain('![image](test.jpg)')

        // Should extract actual form fields (using forms not fields)
        expect(result.forms).toHaveLength(1)
        expect(result.forms[0].name).toBe('contact_email')
    })
})
