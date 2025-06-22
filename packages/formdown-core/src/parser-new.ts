import { marked } from 'marked'
import { Field, ParseError, ParseResult, FormdownContent, FormdownOptions } from './types'

export class FormdownParser {
    private options: FormdownOptions

    constructor(options: FormdownOptions = {}) {
        this.options = {
            preserveMarkdown: true,
            fieldPrefix: '@',
            inlineFieldDelimiter: '___',
            ...options
        }
    }

    parseFormdown(content: string): FormdownContent {
        const { fields, cleanedMarkdown } = this.extractFields(content)

        return {
            markdown: this.options.preserveMarkdown ? cleanedMarkdown : '',
            forms: fields
        }
    }

    parse(content: string): ParseResult {
        const { fields } = this.extractFields(content)
        return { fields, errors: [] }
    }

    private extractFields(content: string): { fields: Field[], cleanedMarkdown: string } {
        const fields: Field[] = []
        const lines = content.split('\n')
        const cleanedLines: string[] = []

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i]

            // Extract block fields
            const blockField = this.parseBlockField(line)
            if (blockField) {
                fields.push(blockField)
                if (this.options.preserveMarkdown) {
                    cleanedLines.push('') // Preserve line structure
                }
                continue
            }

            // Extract inline fields
            const { cleanedLine, inlineFields } = this.parseInlineFields(line)
            fields.push(...inlineFields)
            cleanedLines.push(cleanedLine)
        }

        return {
            fields,
            cleanedMarkdown: cleanedLines.join('\n')
        }
    }

    private parseBlockField(line: string): Field | null {
        // Match pattern: @fieldName: [type attributes] options or @fieldName(Label): [type attributes] options
        const match = line.match(/^@(\w+)(?:\(([^)]+)\))?\s*:\s*\[([^\]]+)\](.*)$/)

        if (!match) return null

        const [, name, customLabel, typeAndAttributes, optionsStr] = match
        const field = this.createField(name, customLabel, typeAndAttributes)

        if (field && optionsStr.trim()) {
            // Handle options for radio, checkbox, select
            if (['radio', 'checkbox', 'select'].includes(field.type)) {
                field.options = optionsStr.trim().split(',').map((opt: string) => opt.trim()).filter((opt: string) => opt.length > 0)
            }
        }

        return field
    }

    private parseInlineFields(line: string): { cleanedLine: string, inlineFields: Field[] } {
        const inlineFields: Field[] = []
        const delimiter = this.options.inlineFieldDelimiter!

        // Match pattern: ___@fieldName[type attributes] optional_options
        const pattern = new RegExp(`${delimiter}@(\\w+)(?:\\(([^)]+)\\))?\\[([^\\]]+)\\]\\s*([^${delimiter}]*)`, 'g')

        const cleanedLine = line.replace(pattern, (match, name, customLabel, typeAndAttributes, optionsStr) => {
            const field = this.createField(name, customLabel, typeAndAttributes)
            if (field) {
                // Handle options for radio, checkbox, select
                if (optionsStr.trim() && ['radio', 'checkbox', 'select'].includes(field.type)) {
                    field.options = optionsStr.trim().split(',').map((opt: string) => opt.trim()).filter((opt: string) => opt.length > 0)
                }
                inlineFields.push(field)
            }
            return `<formdown-field data-name="${name}"></formdown-field>`
        })

        return { cleanedLine, inlineFields }
    }

    private createField(name: string, customLabel: string | undefined, typeAndAttributes: string): Field | null {
        // Parse attributes more carefully using regex to handle quoted values
        const attributePattern = /(\w+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g
        const matches = Array.from(typeAndAttributes.matchAll(attributePattern))

        if (matches.length === 0) return null

        const type = matches[0][1]
        if (!type) return null

        const field: Field = {
            name,
            type,
            label: customLabel || this.formatLabel(name),
            attributes: {}
        }

        // Process attributes starting from the second match
        for (let i = 1; i < matches.length; i++) {
            const [, key, quotedValue1, quotedValue2, unquotedValue] = matches[i]

            if (key === 'required') {
                field.required = true
            } else if (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined) {
                const value = quotedValue1 || quotedValue2 || unquotedValue

                if (key === 'placeholder') {
                    field.placeholder = value
                } else {
                    field.attributes![key] = this.parseAttributeValue(value)
                }
            } else {
                field.attributes![key] = true
            }
        }

        return field
    }

    private formatLabel(name: string): string {
        return name
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim()
    }

    private parseAttributeValue(value: string): any {
        // Try to parse as integer
        if (/^\d+$/.test(value)) {
            return parseInt(value, 10)
        }

        // Try to parse as float
        if (/^\d*\.\d+$/.test(value)) {
            return parseFloat(value)
        }

        // Try to parse as boolean
        if (value === 'true') return true
        if (value === 'false') return false

        // Return as string
        return value
    }
}
