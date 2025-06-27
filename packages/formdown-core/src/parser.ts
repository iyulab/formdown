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
    }

    private parseBlockField(line: string): Field | null {
        const trimmedLine = line.trim()
        
        // Check if this could be shorthand syntax (has shorthand-specific features)
        // Standard syntax: @name(Label): [type attributes] should NOT be treated as shorthand
        // Shorthand syntax: @name*: [], @name{pattern}: [], @name: @[], etc.
        const hasShorthandMarker = /^@\w+\*/.test(trimmedLine) ||                          // Required marker
                                   /^@\w+\{.*?\}/.test(trimmedLine) ||                      // Content
                                   /^@\w+\s*:\s*(dt|d|[#@%&t?TrscRFCMW])\d*\[/.test(trimmedLine) || // Type marker 
                                   /^@\w+\([^)]+\)\*/.test(trimmedLine) ||                  // Label + required
                                   /^@\w+\([^)]+\)\{.*?\}/.test(trimmedLine) ||             // Label + content
                                   /^@\w+\([^)]+\)\s*:\s*(dt|d|[#@%&t?TrscRFCMW])\d*\[/.test(trimmedLine) // Label + type marker
        
        
        if (hasShorthandMarker) {
            const shorthandField = this.parseShorthandBlockField(trimmedLine)
            if (shorthandField) return shorthandField
        }
        
        // Fall back to standard syntax
        const match = trimmedLine.match(/^@(\w+)(?:\(([^)]+)\))?\s*:\s*\[([^\]]*)\].*$/)
        if (!match) return null

        const [, name, customLabel, typeAndAttributes] = match
        const field = this.createField(name, customLabel, typeAndAttributes)

        return field
    }

    private parseShorthandBlockField(line: string): Field | null {
        // Pattern: @fieldName*{content}(label): typeMarker[attributes] OR @fieldName(label)*{content}: typeMarker[attributes]
        // Examples: @email*: @[], @name(Full Name)*{^[A-Z][a-z]+$}: [], @size{S,M,L}: r[]
        // Handle 'dt' as a special case (two-character type marker)
        // Make type marker optional to handle cases like @name*: []
        // Handle both orders: @name*{content}(label) and @name(label)*{content}
        let shorthandMatch = line.match(/^@(\w+)(\*)?(?:\{(.*?)\})?(?:\(([^)]+)\))?\s*:\s*(dt|d|[#@%&t?TrscRFCMW])?(\d*)\[([^\]]*)\].*$/)
        
        // Try alternative order: @name(label)*{content}
        if (!shorthandMatch) {
            shorthandMatch = line.match(/^@(\w+)(?:\(([^)]+)\))?(\*)?(?:\{(.*?)\})?\s*:\s*(dt|d|[#@%&t?TrscRFCMW])?(\d*)\[([^\]]*)\].*$/)
            if (shorthandMatch) {
                // Reorder to match expected destructuring: [, name, requiredMarker, content, customLabel, typeMarker, rowsOrModifier, attributes]
                const [, name, customLabel, requiredMarker, content, typeMarker, rowsOrModifier, attributes] = shorthandMatch
                shorthandMatch = [shorthandMatch[0], name, requiredMarker, content, customLabel, typeMarker, rowsOrModifier, attributes]
            }
        }
        
        if (!shorthandMatch) {
            return null
        }

        const [, name, requiredMarker, content, customLabel, typeMarker, rowsOrModifier, attributes] = shorthandMatch
        
        // Only process as shorthand if it has shorthand features (required marker, content, custom label, type marker, or rows)
        if (!requiredMarker && !content && !customLabel && !typeMarker && !rowsOrModifier) {
            return null // Let standard parser handle this
        }
        
        // Convert shorthand to standard field
        const field = this.convertShorthandToField(name, requiredMarker, content, customLabel, typeMarker || '', rowsOrModifier, attributes)
        
        return field
    }

    private parseInlineFields(line: string): { cleanedLine: string, inlineFields: Field[] } {
        const inlineFields: Field[] = []
        const delimiter = this.options.inlineFieldDelimiter!

        // Support shorthand inline fields: typeMarker___@fieldName*{content}(label)[attributes]
        // Examples: @___@email*, #___@age, d___@birth_date{yyyy-MM-dd}
        // Note: need to handle single 'd' separately from 'dt'
        const shorthandPattern = new RegExp(`(dt|d|[#@%&t?TrscRFCMW]?)${delimiter}@(\\w+)(\\*)?(?:\\{(.*?)\\})?(?:\\(([^)]+)\\))?(?:\\[([^\\]]*)\\])?`, 'g')
        
        let cleanedLine = line.replace(shorthandPattern, (match, typeMarker, name, requiredMarker, content, customLabel, attributes) => {
            // Only process as shorthand if it has actual shorthand features
            // Custom labels are also standard features, so only process if we have
            // type markers, required markers, or content
            if (!typeMarker && !requiredMarker && !content) {
                return match // Let standard parser handle this
            }
            
            const field = this.convertShorthandToField(name, requiredMarker, content, customLabel, typeMarker, '', attributes || '')
            if (field) {
                field.inline = true
                inlineFields.push(field)
                const requiredAttr = field.required ? ' data-required="true"' : ''
                return `<span contenteditable="true" data-field-name="${name}" data-field-type="${field.type}" data-placeholder="${field.label || name}" class="formdown-inline-field" role="textbox"${requiredAttr}>${field.label || name}</span>`
            }
            return match
        })

        // Fallback to standard inline pattern for non-shorthand syntax
        const standardPattern = new RegExp(`${delimiter}@(\\w+)(?:\\(([^)]+)\\))?(?:\\[([^\\]]*)\\])?`, 'g')
        cleanedLine = cleanedLine.replace(standardPattern, (match, name, customLabel, typeAndAttributes) => {
            // Skip if already processed by shorthand pattern
            if (inlineFields.some(field => field.name === name)) return match
            
            const finalTypeAndAttributes = typeAndAttributes !== undefined ? typeAndAttributes : 'text'
            const field = this.createField(name, customLabel, finalTypeAndAttributes)
            if (field) {
                field.inline = true
                inlineFields.push(field)
                const requiredAttr = field.required ? ' data-required="true"' : ''
                return `<span contenteditable="true" data-field-name="${name}" data-field-type="${field.type}" data-placeholder="${field.label || name}" class="formdown-inline-field" role="textbox"${requiredAttr}>${field.label || name}</span>`
            }
            return match
        })

        return { cleanedLine, inlineFields }
    }

    private convertShorthandToField(
        name: string, 
        requiredMarker: string | undefined, 
        content: string | undefined, 
        customLabel: string | undefined, 
        typeMarker: string, 
        rowsOrModifier: string, 
        attributes: string
    ): Field | null {
        // Determine type from type marker
        const typeMap: Record<string, string> = {
            '@': 'email',
            '#': 'number',
            '%': 'tel',
            '&': 'url',
            'd': 'date',
            't': 'time',
            'dt': 'datetime-local',
            '?': 'password',
            'T': 'textarea',
            'r': 'radio',
            's': 'select',
            'c': 'checkbox',
            'R': 'range',
            'F': 'file',
            'C': 'color',
            'M': 'month',
            'W': 'week'
        }
        
        const type = typeMap[typeMarker] || 'text'
        
        // Create base field attributes
        let fieldAttributes = attributes ? this.parseAttributes(attributes) : {}
        
        // Add required if marked
        if (requiredMarker === '*') {
            fieldAttributes.required = true
        }
        
        // Add rows for textarea
        if (type === 'textarea' && rowsOrModifier) {
            fieldAttributes.rows = parseInt(rowsOrModifier, 10)
        }
        
        // Interpret content based on type
        if (content) {
            const contentInterpreted = this.interpretContent(content, typeMarker)
            fieldAttributes = { ...fieldAttributes, ...contentInterpreted }
        }
        
        // Build the type and attributes string for createField
        const typeAndAttributes = this.buildTypeAndAttributesString(type, fieldAttributes)
        
        return this.createField(name, customLabel, typeAndAttributes)
    }

    private interpretContent(content: string, typeMarker: string): Record<string, any> {
        // Selection types: options attribute
        if (['r', 's', 'c'].includes(typeMarker)) {
            const hasOther = content.includes(',*')
            const options = content.replace(',*', '')
            const result: Record<string, any> = { options }
            if (hasOther) {
                result['allow-other'] = true
            }
            return result
        }
        
        // Date/time types: format attribute
        if (['d', 't', 'dt'].includes(typeMarker)) {
            return { format: content }
        }
        
        // Text types: pattern attribute (with mask/glob conversion)
        let pattern = content
        
        // Check if it's a mask pattern (contains # or simple *)
        if (content.includes('#') || (content.includes('*') && !content.match(/^\^.*\$$/))) {
            pattern = '^' + content
                .replace(/[().\/]/g, '\\$&')    // Escape special characters except dash
                .replace(/-/g, '\\-')           // Escape dash separately 
                .replace(/#{1,}/g, (match) => `\\d{${match.length}}`)  // ### → \d{3}
                .replace(/\*/g, '.*')           // * → .*
                .replace(/\?/g, '.')            // ? → .
                + '$'
        }
        
        return { pattern }
    }

    private parseAttributes(attributeString: string): Record<string, any> {
        const attributes: Record<string, any> = {}
        const attributePattern = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g
        const matches = Array.from(attributeString.matchAll(attributePattern))
        
        for (const match of matches) {
            const [, key, quotedValue1, quotedValue2, unquotedValue] = match
            
            if (key === 'required') {
                attributes.required = true
            } else if (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined) {
                const value = quotedValue1 || quotedValue2 || unquotedValue
                attributes[key] = this.parseAttributeValue(value)
            } else {
                attributes[key] = true
            }
        }
        
        return attributes
    }

    private buildTypeAndAttributesString(type: string, attributes: Record<string, any>): string {
        const parts = [type]
        
        for (const [key, value] of Object.entries(attributes)) {
            if (value === true) {
                parts.push(key)
            } else if (typeof value === 'string') {
                parts.push(`${key}="${value}"`)
            } else {
                parts.push(`${key}=${value}`)
            }
        }
        
        return parts.join(' ')
    }

    private createField(name: string, customLabel: string | undefined, typeAndAttributes: string): Field | null {
        // Validate field name (must not start with a number)
        if (/^\d/.test(name) || !name.trim()) {
            return null // Skip invalid field names instead of throwing
        }

        // Handle empty brackets - default to text input
        if (!typeAndAttributes.trim()) {
            return {
                name,
                type: 'text',
                label: customLabel || this.formatLabel(name),
                attributes: {}
            }
        }

        // Parse type and attributes more carefully using regex
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
        }

        // Process attributes starting from the second match
        for (let i = 1; i < matches.length; i++) {
            const [, key, quotedValue1, quotedValue2, unquotedValue] = matches[i]

            if (key === 'required') {
                field.required = true
            } else if (key === 'label' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                field.label = quotedValue1 || quotedValue2 || unquotedValue
            } else if (key === 'placeholder' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                field.placeholder = quotedValue1 || quotedValue2 || unquotedValue
            } else if (key === 'options' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                const optionsValue = quotedValue1 || quotedValue2 || unquotedValue
                if (['radio', 'checkbox', 'select'].includes(type)) {
                    field.options = optionsValue.split(',').map((opt: string) => opt.trim()).filter((opt: string) => opt.length > 0)
                }
            } else if (key === 'allow-other') {
                field.allowOther = true
            } else if (key === 'format' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                field.format = quotedValue1 || quotedValue2 || unquotedValue
            } else if (key === 'pattern' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                field.pattern = quotedValue1 || quotedValue2 || unquotedValue
            } else if (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined) {
                const value = quotedValue1 || quotedValue2 || unquotedValue
                field.attributes![key] = this.parseAttributeValue(value)
            } else {
                field.attributes![key] = true
            }
        }

        return field
    }

    /**
     * Generate a human-readable label from a field name
     * @param fieldName - The field name to convert
     * @returns A formatted label string
     */
    private formatLabel(fieldName: string): string {
        // Handle snake_case: convert underscores to spaces and capitalize
        if (fieldName.includes('_')) {
            return fieldName
                .split('_')
                .map(word => this.capitalizeWord(word))
                .join(' ')
        }

        // Handle camelCase: insert spaces before uppercase letters and capitalize
        if (/[a-z][A-Z]/.test(fieldName)) {
            return fieldName
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .split(' ')
                .map(word => this.capitalizeWord(word))
                .join(' ')
        }

        // Handle single word: just capitalize first letter
        return this.capitalizeWord(fieldName)
    }

    /**
     * Capitalize the first letter of a word
     * @param word - The word to capitalize
     * @returns The capitalized word
     */
    private capitalizeWord(word: string): string {
        if (!word) return word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
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
