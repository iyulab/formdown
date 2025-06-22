import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Web Component Integration Issue Tests', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    test('should detect parse vs parseFormdown difference', () => {
        const content = `# Basic FormDown Examples

## Minimal Syntax

Simple fields with minimal syntax (defaults to text input):

@name: []
@email: []
@phone: []`

        // This is what web component currently uses - only gets fields
        const parseResult = parser.parse(content)
        console.log('=== PARSE METHOD (CURRENT) ===')
        console.log('Fields only:', parseResult.fields.length)
        console.log('Parse result:', JSON.stringify(parseResult, null, 2))

        // This is what should be used - gets both markdown and fields
        const parseFormdownResult = parser.parseFormdown(content)
        console.log('\n=== PARSEFORMDOWN METHOD (SHOULD USE) ===')
        console.log('Markdown length:', parseFormdownResult.markdown?.length || 0)
        console.log('Fields count:', parseFormdownResult.forms?.length || 0)
        console.log('ParseFormdown result:', JSON.stringify(parseFormdownResult, null, 2))

        // Generate HTML properly
        const html = generator.generateHTML(parseFormdownResult)
        console.log('\n=== GENERATED HTML ===')
        console.log(html)

        // Demonstrate the issue
        expect(parseResult.fields).toHaveLength(3) // Only fields
        expect(parseFormdownResult.forms).toHaveLength(3) // Fields
        expect(parseFormdownResult.markdown).toContain('# Basic FormDown Examples') // Markdown content
        expect(html).toContain('<h1>Basic FormDown Examples</h1>') // Rendered markdown
        expect(html).toContain('<form class="formdown-form">') // Rendered form
    })

    test('should show formdown-ui component issue simulation', () => {
        const content = `# Contact Form

Fill out this form to contact us:

@name: [text required]
@email: [email required]
@message: [textarea rows=4]`

        // Simulate current formdown-ui behavior (WRONG)
        const wrongResult = parser.parse(content)

        // What it should do (CORRECT)
        const correctResult = parser.parseFormdown(content)
        const correctHTML = generator.generateHTML(correctResult)

        console.log('=== WRONG (CURRENT BEHAVIOR) ===')
        console.log('Only fields, no markdown:', wrongResult)

        console.log('\n=== CORRECT (SHOULD BE) ===')
        console.log('Generated HTML with both markdown and form:')
        console.log(correctHTML)

        // The issue: wrong result has no markdown context
        expect(wrongResult.fields).toHaveLength(3)
        expect(wrongResult).not.toHaveProperty('markdown')

        // Correct result has both
        expect(correctResult.forms).toHaveLength(3)
        expect(correctResult.markdown).toContain('# Contact Form')
        expect(correctHTML).toContain('<h1>Contact Form</h1>')
        expect(correctHTML).toContain('<p>Fill out this form')
        expect(correctHTML).toContain('<form class="formdown-form">')
    })

    test('should provide fix for web component integration', () => {
        const content = `# User Registration

Please complete all required fields:

@username: [text required]
@password: [password required]

Thank you for registering!`

        // Demonstrate the fix needed
        const formdownContent = parser.parseFormdown(content)
        const completeHTML = generator.generateHTML(formdownContent)

        console.log('=== COMPLETE INTEGRATION FIX ===')
        console.log('Full HTML output:')
        console.log(completeHTML)        // Should contain all elements
        expect(completeHTML).toContain('<h1>User Registration</h1>')
        expect(completeHTML).toContain('<p>Please complete all required fields:</p>')
        expect(completeHTML).toContain('<p>Thank you for registering!</p>')
        expect(completeHTML).toContain('<form class="formdown-form">')
        expect(completeHTML).toContain('name="username"')
        expect(completeHTML).toContain('name="password"')
        expect(completeHTML).toContain('required')
    })
})
