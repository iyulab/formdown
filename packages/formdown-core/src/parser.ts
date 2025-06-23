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
            const line = lines[i]            // Extract block fields
            const blockField = this.parseBlockField(line)
            if (blockField) {
                fields.push(blockField)
                // Insert placeholder for field position (using a format that won't be interpreted as markdown)
                cleanedLines.push(`<!--FORMDOWN_FIELD_${fields.length - 1}-->`)
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
    } private parseBlockField(line: string): Field | null {
        // Match pattern: @fieldName: [type attributes] or @fieldName(Label): [type attributes]
        // Allow empty brackets: @name: []
        // Handle Windows line endings by trimming the line
        const trimmedLine = line.trim()
        const match = trimmedLine.match(/^@(\w+)(?:\(([^)]+)\))?\s*:\s*\[([^\]]*)\].*$/)

        if (!match) return null

        const [, name, customLabel, typeAndAttributes] = match
        const field = this.createField(name, customLabel, typeAndAttributes)

        return field
    } private parseInlineFields(line: string): { cleanedLine: string, inlineFields: Field[] } {
        const inlineFields: Field[] = []
        const delimiter = this.options.inlineFieldDelimiter!

        // Updated pattern to make brackets optional:
        // ___@fieldName[type attributes] (with brackets)
        // ___@fieldName (without brackets - defaults to text)
        // Allow empty brackets: ___@name[]
        const pattern = new RegExp(`${delimiter}@(\\w+)(?:\\(([^)]+)\\))?(?:\\[([^\\]]*)\\])?`, 'g')

        const cleanedLine = line.replace(pattern, (match, name, customLabel, typeAndAttributes) => {
            // If no brackets provided, default to text type
            const finalTypeAndAttributes = typeAndAttributes !== undefined ? typeAndAttributes : 'text'

            const field = this.createField(name, customLabel, finalTypeAndAttributes)
            if (field) {
                inlineFields.push(field)
                return `<span contenteditable="true" data-field-name="${name}" data-field-type="${field.type}" data-placeholder="${field.label || name}" class="formdown-inline-field">${field.label || name}</span>`
            }
            return match // Return original match if field creation failed
        })

        return { cleanedLine, inlineFields }
    }

    private createField(name: string, customLabel: string | undefined, typeAndAttributes: string): Field | null {
        // Handle empty brackets - default to text input
        if (!typeAndAttributes.trim()) {
            return {
                name,
                type: 'text',
                label: customLabel || this.formatLabel(name),
                attributes: {}
            }
        }

        // Parse attributes more carefully using regex to handle quoted values and hyphenated attributes
        const attributePattern = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g
        const matches = Array.from(typeAndAttributes.matchAll(attributePattern))

        if (matches.length === 0) return null

        const type = matches[0][1]
        if (!type) return null

        const field: Field = {
            name,
            type,
            label: customLabel || this.formatLabel(name),
            attributes: {}
        }        // Process attributes starting from the second match
        for (let i = 1; i < matches.length; i++) {
            const [, key, quotedValue1, quotedValue2, unquotedValue] = matches[i]

            if (key === 'required') {
                field.required = true
            } else if (key === 'options' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                // Handle options attribute for radio, checkbox, select
                const optionsValue = quotedValue1 || quotedValue2 || unquotedValue
                if (['radio', 'checkbox', 'select'].includes(type)) {
                    field.options = optionsValue.split(',').map((opt: string) => opt.trim()).filter((opt: string) => opt.length > 0)
                }
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
