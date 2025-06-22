import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Actual Preview Content Tests', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    test('should render accessibility sample exactly as shown in preview', () => {
        const content = `# Accessibility and Custom Attributes

## Accessibility Best Practices

FormDown supports all ARIA and accessibility attributes:

### Screen Reader Support
@full_name: [text required aria-label="Enter your full legal name" aria-describedby="name-help"]
@email: [email required aria-label="Email address for account login" aria-describedby="email-help"]
@password: [password required aria-label="Create a secure password" aria-describedby="password-help"]`

        const parsed = parser.parseFormdown(content)
        const html = generator.generateHTML(parsed)

        console.log('=== ACCESSIBILITY SAMPLE TEST ===')
        console.log('Parsed markdown length:', parsed.markdown?.length || 0)
        console.log('Forms count:', parsed.forms?.length || 0)
        console.log('\nParsed content:')
        console.log(JSON.stringify(parsed, null, 2))
        console.log('\nGenerated HTML:')
        console.log(html)
        console.log('=== END TEST ===')

        // Should contain all markdown headers and content
        expect(html).toContain('<h1>')
        expect(html).toContain('Accessibility and Custom Attributes')
        expect(html).toContain('<h2>')
        expect(html).toContain('Accessibility Best Practices')
        expect(html).toContain('<h3>')
        expect(html).toContain('Screen Reader Support')
        expect(html).toContain('<p>')
        expect(html).toContain('FormDown supports all ARIA')

        // Should contain form fields
        expect(html).toContain('<form class="formdown-form">')
        expect(html).toContain('name="full_name"')
        expect(html).toContain('name="email"')
        expect(html).toContain('name="password"')
        expect(html).toContain('aria-label=')
    })

    test('should render basic examples sample', () => {
        const content = `# Basic FormDown Examples

## Minimal Syntax

Simple fields with minimal syntax (defaults to text input):

@name: []
@email: []
@phone: []

## Label Definition Methods

Choose between two ways to define labels:

### Method 1: Parentheses (Recommended)
@user_name(Full Name): [text required]
@email_address(Email Address): [email required]
@phone_number(Phone): [tel]

### Method 2: Label Attribute
@username: [text required label="Full Name"]
@email: [email required label="Email Address"]
@phone: [tel label="Phone"]

## Basic Input Types

@age: [number min=18 max=100]
@website: [url placeholder="https://example.com"]
@birth_date: [date]
@appointment_time: [time]`

        const parsed = parser.parseFormdown(content)
        const html = generator.generateHTML(parsed)

        console.log('=== BASIC EXAMPLES SAMPLE TEST ===')
        console.log('Parsed markdown length:', parsed.markdown?.length || 0)
        console.log('Forms count:', parsed.forms?.length || 0)
        console.log('\nParsed content:')
        console.log(JSON.stringify(parsed, null, 2))
        console.log('\nGenerated HTML:')
        console.log(html)
        console.log('=== END TEST ===')

        // Should contain all markdown content
        expect(html).toContain('<h1>')
        expect(html).toContain('Basic FormDown Examples')
        expect(html).toContain('<h2>')
        expect(html).toContain('Minimal Syntax')
        expect(html).toContain('<p>')
        expect(html).toContain('Simple fields with minimal syntax')

        // Should contain form with all fields
        expect(html).toContain('<form class="formdown-form">')
        expect(html).toContain('name="name"')
        expect(html).toContain('name="email"')
        expect(html).toContain('name="phone"')
        expect(html).toContain('name="age"')
        expect(html).toContain('name="website"')
    })
})
