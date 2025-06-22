export * from './types'
export * from './parser'
export * from './generator'

import { FormdownParser } from './parser'
import { FormdownGenerator } from './generator'

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
