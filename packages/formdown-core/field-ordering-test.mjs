import { FormdownParser } from './dist/parser.js'
import { FormdownGenerator } from './dist/generator.js'

// Test field ordering behavior
const parser = new FormdownParser()
const generator = new FormdownGenerator()

console.log('=== Field Ordering Investigation ===\n')

const testContent = `# Registration Form

Welcome to our service!

## Personal Details
@name: [text required]
@email: [email required]

We value your privacy.

## Account Settings  
@username: [text required]
@password: [password required]

Please review our terms.

## Preferences
@newsletter: [checkbox]
@contact_method: [radio options="Email,Phone,SMS"]

Thank you for signing up!`

console.log('Input content:')
console.log(testContent)
console.log('\n' + '='.repeat(50))

const parseResult = parser.parseFormdown(testContent)

console.log('\nParsed markdown:')
console.log(parseResult.markdown)
console.log('\n' + '='.repeat(50))

console.log('\nParsed fields:')
parseResult.forms.forEach((field, index) => {
    console.log(`${index + 1}. ${field.name} (${field.type})${field.inline ? ' [inline]' : ''}`)
})
console.log('\n' + '='.repeat(50))

console.log('\nGenerated HTML:')
const html = generator.generateHTML(parseResult)
console.log(html)
console.log('\n' + '='.repeat(50))

// Test with inline fields mixed with regular content
console.log('\n=== Inline Field Ordering Test ===\n')

const inlineTestContent = `# Survey

Please rate our service: ___@rating[number min=1 max=5] out of 5.

@overall_experience: [radio options="Excellent,Good,Fair,Poor"]

Your name: ___@reviewer_name[text] 

@additional_comments: [textarea rows=3]

Email for follow-up: ___@followup_email[email]`

console.log('Inline test content:')
console.log(inlineTestContent)
console.log('\n' + '-'.repeat(50))

const inlineParseResult = parser.parseFormdown(inlineTestContent)

console.log('Inline parsed markdown:')
console.log(inlineParseResult.markdown)
console.log('\n' + '-'.repeat(50))

console.log('Inline parsed fields:')
inlineParseResult.forms.forEach((field, index) => {
    console.log(`${index + 1}. ${field.name} (${field.type})${field.inline ? ' [inline]' : ''}`)
})
console.log('\n' + '-'.repeat(50))

console.log('Inline generated HTML:')
const inlineHtml = generator.generateHTML(inlineParseResult)
console.log(inlineHtml)