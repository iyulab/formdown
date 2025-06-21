import { Field, ParseError, ParseResult } from './types'

export class FormdownParser {
    parse(content: string): ParseResult {
        const lines = content.split('\n')
        const fields: Field[] = []
        const errors: ParseError[] = []

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()
            if (!line || line.startsWith('#')) {
                continue // Skip empty lines and comments
            }

            if (line.startsWith('@')) {
                try {
                    const field = this.parseField(line, i + 1)
                    if (field) {
                        fields.push(field)
                    }
                } catch (error) {
                    errors.push({
                        line: i + 1,
                        message: error instanceof Error ? error.message : 'Parse error'
                    })
                }
            } else {
                errors.push({
                    line: i + 1,
                    message: 'Invalid syntax: lines must start with @ or be comments (#)'
                })
            }
        }

        return { fields, errors }
    }

    private parseField(line: string, lineNumber: number): Field | null {
        // Match pattern: @fieldName: [type attributes] options
        const match = line.match(/^@(\w+):\s*\[([^\]]+)\](.*)$/)

        if (!match) {
            throw new Error('Invalid field syntax')
        }

        const [, name, typeAndAttributes, optionsStr] = match
        const parts = typeAndAttributes.trim().split(/\s+/)
        const type = parts[0]

        if (!type) {
            throw new Error('Field type is required')
        }

        const field: Field = {
            name,
            type,
            label: this.formatLabel(name),
            attributes: {}
        }

        // Parse attributes
        for (let i = 1; i < parts.length; i++) {
            const attr = parts[i]

            if (attr === 'required') {
                field.required = true
            } else if (attr.indexOf('=') !== -1) {
                const equalIndex = attr.indexOf('=')
                const key = attr.substring(0, equalIndex)
                const value = attr.substring(equalIndex + 1).replace(/['"]/g, '')

                if (key === 'placeholder') {
                    field.placeholder = value
                } else {
                    if (!field.attributes) field.attributes = {}
                    field.attributes[key] = this.parseAttributeValue(value)
                }
            } else {
                // Handle attributes without values
                if (!field.attributes) field.attributes = {}
                field.attributes[attr] = true
            }
        }

        // Parse options for radio, checkbox, select
        const hasOptionsTypes = ['radio', 'checkbox', 'select']
        if (optionsStr.trim() && hasOptionsTypes.indexOf(type) !== -1) {
            field.options = optionsStr.trim()
                .split(',')
                .map(opt => opt.trim())
                .filter(opt => opt.length > 0)
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
        // Try to parse as number
        if (/^\d+$/.test(value)) {
            return parseInt(value, 10)
        }

        // Try to parse as boolean
        if (value === 'true') return true
        if (value === 'false') return false

        // Return as string
        return value
    }
}