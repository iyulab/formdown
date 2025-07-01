import { FormdownParser } from './dist/index.js'

// Simple test to debug field parsing
const parser = new FormdownParser()

const testContent = `# Test

@contact_email: [email required]

Another test: @name(Full Name): [text required]`

console.log('Testing simple FormDown parsing...')

const result = parser.parseFormdown(testContent)

console.log('Markdown content:')
console.log(result.markdown)
console.log('\nForm fields:')
console.log(result.forms)

console.log('\nTesting parse method:')
const parseResult = parser.parse(testContent)
console.log(parseResult.fields)
