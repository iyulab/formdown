export * from './types.js'
export * from './parser.js'
export * from './generator.js'
export * from './schema.js'
export * from './extensions'

import { FormdownParser } from './parser.js'
import { FormdownGenerator } from './generator.js'
import { getSchema as getSchemaFunction } from './schema.js'

export function parseFormdown(input: string) {
    const parser = new FormdownParser()
    return parser.parseFormdown(input)
}

export function generateFormHTML(content: any) {
    const generator = new FormdownGenerator()
    return generator.generateHTML(content)
}

// Legacy support for simple form fields parsing
export function parseFormFields(input: string) {
    const parser = new FormdownParser()
    return parser.parse(input)
}

// Schema extraction
export function getSchema(content: string) {
    return getSchemaFunction(content)
}
