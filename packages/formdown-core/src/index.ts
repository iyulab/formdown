export * from './types'
export * from './parser'
export * from './generator'

import { FormdownParser } from './parser'
import { FormGenerator } from './generator'

export function parseFormdown(input: string) {
    const parser = new FormdownParser()
    return parser.parse(input)
}

export function generateForm(input: string, formId?: string) {
    const parser = new FormdownParser()
    const generator = new FormGenerator()

    const parseResult = parser.parse(input)

    if (parseResult.errors.length > 0) {
        throw new Error(`Parse errors: ${parseResult.errors.map(e => e.message).join(', ')}`)
    }

    return generator.generateHTML(parseResult.fields, formId)
}