// Test inline field parsing regex
const line = 'Hello ___@username[text required]!'
const delimiter = '___'

// Simple pattern first
const simplePattern = new RegExp(`${delimiter}@(\\w+)(?:\\(([^)]+)\\))?\\[([^\\]]+)\\]`, 'g')
console.log('Simple pattern:', simplePattern)
console.log('Test line:', line)

const simpleMatches = Array.from(line.matchAll(simplePattern))
console.log('Simple matches:', simpleMatches)

// Test with options
const lineWithOptions = 'Would you recommend us? ___@recommend[radio] Yes, No'
console.log('\nTesting with options:')
console.log('Line:', lineWithOptions)

const optionsPattern = new RegExp(`${delimiter}@(\\w+)(?:\\(([^)]+)\\))?\\[([^\\]]+)\\]\\s*(.*)`, 'g')
console.log('Options pattern:', optionsPattern)

const optionsMatches = Array.from(lineWithOptions.matchAll(optionsPattern))
console.log('Options matches:', optionsMatches)
