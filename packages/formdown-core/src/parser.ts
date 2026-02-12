import { Field, ParseResult, FormdownContent, FormdownOptions, FormDeclaration, DatalistDeclaration, GroupDeclaration, FieldCondition, ConditionalAttributes } from './types'
import { defaultExtensionManager } from './extensions/extension-manager.js'
import type { HookContext } from './extensions/types.js'

export class FormdownParser {
    private options: FormdownOptions
    private formDeclarations: FormDeclaration[] = []
    private datalistDeclarations: DatalistDeclaration[] = []
    private groupDeclarations: GroupDeclaration[] = []
    private currentFormId: string | null = null
    private currentGroupId: string | null = null
    private formCounter = 1
    private defaultFormCreated = false

    constructor(options: FormdownOptions = {}) {
        this.options = {
            preserveMarkdown: true,
            fieldPrefix: '@',
            inlineFieldDelimiter: '___',
            autoGenerateFormIds: true,
            ...options
        }
    }

    parseFormdown(content: string): FormdownContent {
        // Reset state for each parse
        this.formDeclarations = []
        this.datalistDeclarations = []
        this.groupDeclarations = []
        this.currentFormId = null
        this.currentGroupId = null
        this.formCounter = 1
        this.defaultFormCreated = false

        const { fields, cleanedMarkdown } = this.extractFields(content)

        return {
            markdown: this.options.preserveMarkdown ? cleanedMarkdown : '',
            forms: fields,
            formDeclarations: this.formDeclarations,
            datalistDeclarations: this.datalistDeclarations,
            groupDeclarations: this.groupDeclarations
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

            // Check for @form declaration first
            const formDeclaration = this.parseFormDeclaration(line)
            if (formDeclaration) {
                this.formDeclarations.push(formDeclaration)
                this.currentFormId = formDeclaration.id
                // Remove @form declaration from markdown
                cleanedLines.push('')
                continue
            }

            // Check for @datalist declaration
            const datalistDeclaration = this.parseDatalistDeclaration(line)
            if (datalistDeclaration) {
                this.datalistDeclarations.push(datalistDeclaration)
                // Remove @datalist declaration from markdown
                cleanedLines.push('')
                continue
            }

            // Check for shorthand datalist declaration: @#id: options
            const shorthandDatalist = this.parseShorthandDatalist(line)
            if (shorthandDatalist) {
                this.datalistDeclarations.push(shorthandDatalist)
                // Remove shorthand datalist declaration from markdown
                cleanedLines.push('')
                continue
            }

            // Check for group declaration: ## [Group Label] or ## [Group Label collapsible] or ## [Group Label collapsed]
            const groupDeclaration = this.parseGroupDeclaration(line, i)
            if (groupDeclaration) {
                // Close previous group if exists before starting new one
                if (this.currentGroupId) {
                    cleanedLines.push(`<!--FORMDOWN_GROUP_END_${this.currentGroupId}-->`)
                }
                this.groupDeclarations.push(groupDeclaration)
                this.currentGroupId = groupDeclaration.id
                // Insert placeholder for group start
                cleanedLines.push(`<!--FORMDOWN_GROUP_START_${groupDeclaration.id}-->`)
                continue
            }

            // Check if we're exiting a group (when encountering a non-group ## heading)
            if (this.currentGroupId && /^##\s+[^\[]/.test(line)) {
                // Regular ## heading ends the current group
                cleanedLines.push(`<!--FORMDOWN_GROUP_END_${this.currentGroupId}-->`)
                this.currentGroupId = null
            }

            // Check for table block (markdown table with inline fields)
            if (line.trim().startsWith('|')) {
                const tableResult = this.parseTableBlock(lines, i)
                if (tableResult) {
                    // Associate table fields with current form
                    tableResult.fields.forEach(field => this.associateFieldWithForm(field))
                    fields.push(...tableResult.fields)
                    // Add table HTML or placeholder
                    cleanedLines.push(tableResult.tableHtml)
                    // Skip processed lines
                    i = tableResult.endIndex
                    continue
                }
            }

            // Extract block fields
            const blockField = this.parseBlockField(line)
            if (blockField) {
                // Associate field with current form
                this.associateFieldWithForm(blockField)
                fields.push(blockField)
                // Insert placeholder for field position (using a format that won't be interpreted as markdown)
                cleanedLines.push(`<!--FORMDOWN_FIELD_${fields.length - 1}-->`)
                continue
            }

            // Extract inline fields
            const { cleanedLine, inlineFields } = this.parseInlineFields(line)
            // Associate inline fields with current form
            inlineFields.forEach(field => this.associateFieldWithForm(field))
            fields.push(...inlineFields)
            cleanedLines.push(cleanedLine)
        }

        // Close any remaining open group at the end of content
        if (this.currentGroupId) {
            cleanedLines.push(`<!--FORMDOWN_GROUP_END_${this.currentGroupId}-->`)
        }

        return {
            fields,
            cleanedMarkdown: cleanedLines.join('\n')
        }
    }

    private parseBlockField(line: string): Field | null {
        const trimmedLine = line.trim()
        
        // Try to parse using registered field type extensions first
        const context: HookContext = {
            input: trimmedLine
        }
        
        const extensionField = defaultExtensionManager.getFieldTypeRegistry().parseField(trimmedLine, context)
        if (extensionField) {
            return extensionField
        }
        
        // Check for new action element syntax: @[action "label" attributes]
        const actionField = this.parseActionElement(trimmedLine)
        if (actionField) {
            return actionField
        }
        
        // Check if this could be shorthand syntax (has shorthand-specific features)
        // Standard syntax: @name(Label): [type attributes] should NOT be treated as shorthand
        // Shorthand syntax: @name*: [], @name{pattern}: [], @name: @[], etc.
        const hasShorthandMarker = /^@\w+\*/.test(trimmedLine) ||                          // Required marker
                                   /^@\w+\{[^}]*\}/.test(trimmedLine) ||                    // Content
                                   /^@\w+\s*:\s*(dt|d|[#@%&t?TrscRFCMW$])\d*\[/.test(trimmedLine) || // Type marker
                                   /^@\w+\([^)]+\)\*/.test(trimmedLine) ||                  // Label + required
                                   /^@\w+\([^)]+\)\{[^}]*\}/.test(trimmedLine) ||           // Label + content
                                   /^@\w+\([^)]+\)\s*:\s*(dt|d|[#@%&t?TrscRFCMW$])\d*\[/.test(trimmedLine) // Label + type marker
        
        
        if (hasShorthandMarker) {
                const shorthandField = this.parseShorthandBlockField(trimmedLine)
            if (shorthandField) return shorthandField
        }
        
        // Fall back to standard syntax
        // Use a more sophisticated regex that handles quoted content with brackets
        const match = trimmedLine.match(/^@(\w+)(?:\(([^)]+)\))?\s*:\s*\[((?:[^\]"']|"[^"]*"|'[^']*')*)\].*$/)
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
        // Fixed pattern with nested brace support
        let shorthandMatch = line.match(/^@(\w+)(\*)?(?:\{(.*?)\})?(?:\(([^)]+)\))?\s*:\s*(?:(dt|d|[#@%&t?TrscRFCMW$])(\d*)?)?\[([^\]]*)\].*$/)
        
        // Try alternative order: @name(label)*{content}
        if (!shorthandMatch) {
            shorthandMatch = line.match(/^@(\w+)(?:\(([^)]+)\))?(\*)?(?:\{(.*?)\})?\s*:\s*(?:(dt|d|[#@%&t?TrscRFCMW$])(\d*)?)?\[([^\]]*)\].*$/)
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
        
        // Only process as shorthand if it has shorthand features (required marker, content defined, custom label, type marker, or rows)
        // Note: content === '' (empty string) is different from content === undefined (no braces)
        if (!requiredMarker && content === undefined && !customLabel && !typeMarker && !rowsOrModifier) {
            return null // Let standard parser handle this
        }
        
        // Convert shorthand to standard field
        const field = this.convertShorthandToField(name, requiredMarker, content, customLabel, typeMarker || '', rowsOrModifier, attributes)
        
        return field
    }

    private parseInlineFields(line: string): { cleanedLine: string, inlineFields: Field[] } {
        const inlineFields: Field[] = []
        const delimiter = this.options.inlineFieldDelimiter!

        // Support shorthand inline fields: typeMarker___@fieldName*{content}(label)[attributes] or typeMarker___@fieldName*{content}: type[attributes]
        // Examples: @___@email*, #___@age, d___@birth_date{yyyy-MM-dd}: [attributes], ___@service{options}: s[]
        // Note: need to handle single 'd' separately from 'dt'
        const shorthandPattern = new RegExp(`(dt|d|[#@%&t?TrscRFCMW$]?)${delimiter}@(\\w+)(\\*)?(?:\\{([^}]*)\\})?(?:\\(([^)]+)\\))?(?:\\[([^\\]]*)\\]|\\:\\s*([^\\s]*?)\\[([^\\]]*)\\])?`, 'g')
        
        let cleanedLine = line.replace(shorthandPattern, (match, typeMarker, name, requiredMarker, content, customLabel, attributes, colonType, colonAttributes) => {
            // Only process as shorthand if it has actual shorthand features
            // Custom labels are also standard features, so only process if we have
            // type markers, required markers, content, or attributes
            if (!typeMarker && !requiredMarker && !content && !attributes && !colonType && !colonAttributes) {
                return match // Let standard parser handle this
            }

            // If attributes start with a valid input type (like "text required"),
            // let the standard parser handle it instead of shorthand parser
            if (!typeMarker && attributes) {
                const validTypes = ['text', 'email', 'password', 'number', 'tel', 'url', 'search',
                                   'date', 'time', 'datetime-local', 'month', 'week', 'color',
                                   'file', 'range', 'radio', 'checkbox', 'select', 'textarea',
                                   'submit', 'reset', 'button', 'hidden']
                const firstWord = attributes.split(/\s/)[0]
                if (validTypes.includes(firstWord)) {
                    return match // Let standard parser handle this
                }
            }

            const finalTypeMarker = typeMarker || colonType || ''
            const finalAttributes = attributes || colonAttributes || ''
            const field = this.convertShorthandToField(name, requiredMarker, content, customLabel, finalTypeMarker, '', finalAttributes)
            if (field) {
                field.inline = true
                inlineFields.push(field)
                const requiredAttr = field.required ? ' data-required="true"' : ''
                return `<span contenteditable="true" data-field-name="${name}" data-field-type="${field.type}" data-placeholder="${field.label || name}" class="formdown-inline-field" role="textbox"${requiredAttr}>${field.label || name}</span>`
            }
            return match
        })

        // Fallback to standard inline pattern for non-shorthand syntax
        // Support both: ___@name[attributes] and ___@name{options}: type[]
        const standardPattern = new RegExp(`${delimiter}@(\\w+)(?:\\{([^}]*)\\})?(?:\\(([^)]+)\\))?(?:\\:\\s*([^\\s]*?)\\[([^\\]]*)\\]|\\[([^\\]]*)\\])?`, 'g')
        cleanedLine = cleanedLine.replace(standardPattern, (match, name, options, customLabel, colonType, colonAttributes, directAttributes) => {
            // Skip if already processed by shorthand pattern
            if (inlineFields.some(field => field.name === name)) return match

            // Determine type and attributes
            let finalTypeAndAttributes = 'text'
            if (colonType && colonAttributes !== undefined) {
                // Pattern: ___@name{options}: type[attributes]
                finalTypeAndAttributes = colonAttributes.trim() ? `${colonType} ${colonAttributes}` : colonType
            } else if (directAttributes !== undefined) {
                // Pattern: ___@name[attributes]
                finalTypeAndAttributes = directAttributes
            }

            // Create field
            const field = this.createField(name, customLabel, finalTypeAndAttributes)

            // Handle options if present
            if (field && options) {
                // Process options from {options} part
                const optionsArray = options.split(',').map((opt: string) => opt.trim()).filter((opt: string) => opt.length > 0)
                if (optionsArray.length > 0) {
                    // If field type supports options (select, radio, checkbox), set them
                    if (['select', 'radio', 'checkbox'].includes(field.type)) {
                        field.options = optionsArray
                    } else {
                        // For other types, create datalist
                        const datalistId = `datalist-${Math.floor(Math.random() * 1000000000)}`
                        field.attributes = field.attributes || {}
                        field.attributes.list = datalistId
                    }
                }
            }
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
            'W': 'week',
            '$': 'number'  // Money input - will add currency formatting
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
        
        // Add money-specific attributes
        if (typeMarker === '$') {
            fieldAttributes.inputmode = 'decimal'
            fieldAttributes.step = '0.01'
            if (!fieldAttributes.placeholder) {
                fieldAttributes.placeholder = '0.00'
            }
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
            const options = content.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0)
            let hasOther = false
            let otherLabel = 'Other'
            
            const cleanedOptions = options.filter(opt => {
                if (opt === '*') {
                    hasOther = true
                    return false
                } else if (opt.startsWith('*(') && opt.endsWith(')')) {
                    if (!hasOther) { // Only set label for the first *(label) encountered
                        hasOther = true
                        otherLabel = opt.slice(2, -1)
                    }
                    return false
                }
                return true
            })
            
            const result: Record<string, any> = { options: cleanedOptions.join(',') || '' }
            if (hasOther) {
                result['allow-other'] = true
                if (otherLabel !== 'Other') {
                    result['other-label'] = otherLabel
                }
            }
            return result
        }
        
        // Date/time types: format attribute
        if (['d', 't', 'dt'].includes(typeMarker)) {
            return { format: content }
        }
        
        // Check if content looks like a regex pattern or mask before treating as datalist
        // Prioritize comma-separated lists as datalist unless it's clearly a regex
        const hasComma = content.includes(',')
        const isRegexPattern = content.match(/^\^.*\$$/) ||              // Full regex pattern: ^pattern$
                              (content.includes('[') && content.includes(']') && !hasComma) || // Character class without comma
                              content.includes('\\')                     // Escape sequences: \d, \w
        const isMaskPattern = content.includes('#') ||                   // Mask pattern: ###-##-####
                             (!hasComma && content.includes('*'))        // Glob without comma: prefix*
        
        const isPattern = isRegexPattern || isMaskPattern
        
        // If it looks like a pattern, treat as pattern validation
        if (isPattern) {
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
        
        // Datalist shorthand: automatically create datalist and set list attribute
        // Example: @country{Korea,Japan,China}: [text autocomplete] or @status{Active}: [text]
        // Create datalist for content that's not used by selection types or date/time types
        if (content && !['r', 's', 'c', 'd', 't', 'dt'].includes(typeMarker)) {
            // For non-selection/non-datetime types, check if content should be datalist or pattern
            if (hasComma || (!isRegexPattern && content.length > 0)) {
                // Parse options from content (split by comma, or single option)
                const options = content.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0)

                if (options.length > 0) { // Create datalist for any valid options
                    // Generate datalist ID from content hash
                    const datalistId = this.generateDatalistId(content)

                    // Create datalist declaration automatically
                    const datalistDeclaration: DatalistDeclaration = {
                        id: datalistId,
                        options
                    }

                    // Check if this datalist already exists
                    const existingDatalist = this.datalistDeclarations.find(d => d.id === datalistId)
                    if (!existingDatalist) {
                        this.datalistDeclarations.push(datalistDeclaration)
                    }

                    // Return list attribute to connect field to datalist
                    return { list: datalistId }
                }
            }
        }
        
        // Default: treat as pattern for single values or unrecognized formats
        return { pattern: content }
    }

    private parseAttributes(attributeString: string): Record<string, any> {
        const attributes: Record<string, any> = {}
        const attributePattern = /([\w-]+)(?:=(?:"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|([^\s]+)))?/g
        const matches = Array.from(attributeString.matchAll(attributePattern))
        
        for (const match of matches) {
            const [, key, quotedValue1, quotedValue2, unquotedValue] = match
            
            if (key === 'required') {
                attributes.required = true
            } else if (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined) {
                const value = quotedValue1 !== undefined ? quotedValue1 : 
                             quotedValue2 !== undefined ? quotedValue2 : unquotedValue
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

        // Find the type (first match without a value, or 'text' as default)
        let type = 'text'
        let typeIndex = -1
        
        for (let i = 0; i < matches.length; i++) {
            const [, key, quotedValue1, quotedValue2, unquotedValue] = matches[i]
            // If this key has no value and is a valid field type, use it as the type
            if (!quotedValue1 && !quotedValue2 && !unquotedValue) {
                // Map shorthand types to full types
                const shorthandTypeMap: Record<string, string> = {
                    's': 'select',
                    'r': 'radio',
                    'c': 'checkbox',
                    'T': 'textarea',
                    '@': 'email',
                    '#': 'number',
                    '%': 'tel',
                    '$': 'number', // price
                    '?': 'password',
                    't': 'time',
                    'd': 'date',
                    'dt': 'datetime-local'
                }

                const fullType = shorthandTypeMap[key] || key

                // Check if it's a valid HTML input type or special form type
                const validTypes = ['text', 'email', 'password', 'number', 'tel', 'url', 'search',
                                   'date', 'time', 'datetime-local', 'month', 'week', 'color',
                                   'file', 'range', 'radio', 'checkbox', 'select', 'textarea',
                                   'submit', 'reset', 'button', 'hidden']
                if (validTypes.includes(fullType)) {
                    type = fullType
                    typeIndex = i
                    break
                }
            }
        }

        const field: Field = {
            name,
            type,
            label: customLabel || this.formatLabel(name),
            attributes: {}
        }

        // Process all attributes, skipping the one we used as type
        for (let i = 0; i < matches.length; i++) {
            if (i === typeIndex) continue // Skip the type match
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
                    if (optionsValue) {
                        const options = optionsValue.split(',').map((opt: string) => opt.trim()).filter((opt: string) => opt.length > 0)
                        let hasOther = false
                        let otherLabel = 'Other'
                        
                        const cleanedOptions = options.filter(opt => {
                            if (opt === '*') {
                                hasOther = true
                                return false
                            } else if (opt.startsWith('*(') && opt.endsWith(')')) {
                                if (!hasOther) { // Only set label for the first *(label) encountered
                                    hasOther = true
                                    otherLabel = opt.slice(2, -1)
                                }
                                return false
                            }
                            return true
                        })
                        
                        field.options = cleanedOptions
                        if (hasOther) {
                            field.allowOther = true
                            if (otherLabel !== 'Other') {
                                field.otherLabel = otherLabel
                            }
                        }
                    } else {
                        field.options = []
                    }
                }
            } else if (key === 'allow-other') {
                field.allowOther = true
            } else if (key === 'other-label' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                field.otherLabel = quotedValue1 || quotedValue2 || unquotedValue
            } else if (key === 'format' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                field.format = quotedValue1 || quotedValue2 || unquotedValue
            } else if (key === 'pattern' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                field.pattern = quotedValue1 || quotedValue2 || unquotedValue
            } else if (key === 'content' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                field.content = quotedValue1 || quotedValue2 || unquotedValue
            } else if (key === 'value') {
                if (quotedValue1 !== undefined || quotedValue2 !== undefined) {
                    // For quoted values, preserve as string (don't parse as boolean/number)
                    field.value = quotedValue1 !== undefined ? quotedValue1 : quotedValue2
                } else if (unquotedValue !== undefined) {
                    // For unquoted values, parse them (can become boolean/number)
                    field.value = this.parseAttributeValue(unquotedValue)
                } else {
                    // value attribute with no value defaults to empty string
                    field.value = ''
                }
            } else if (key === 'datalist' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                // Handle datalist attribute
                const datalistValue = quotedValue1 || quotedValue2 || unquotedValue

                if (datalistValue.startsWith('#')) {
                    // Reference to a declared datalist: datalist="#id"
                    field.attributes!['list'] = datalistValue.slice(1)
                } else {
                    // Inline options: datalist="option1,option2,option3"
                    const options = datalistValue.split(',').map((opt: string) => opt.trim()).filter((opt: string) => opt.length > 0)
                    if (options.length > 0) {
                        const datalistId = this.generateDatalistId(datalistValue)
                        field.attributes!['list'] = datalistId
                        // Create datalist declaration if it doesn't exist
                        const existingDatalist = this.datalistDeclarations.find(d => d.id === datalistId)
                        if (!existingDatalist) {
                            this.datalistDeclarations.push({
                                id: datalistId,
                                options
                            })
                        }
                    }
                }
            } else if (key === 'visible-if' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                // Handle conditional visibility
                const conditionValue = quotedValue1 || quotedValue2 || unquotedValue
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.visibleIf = condition
                }
            } else if (key === 'hidden-if' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                // Handle conditional hiding
                const conditionValue = quotedValue1 || quotedValue2 || unquotedValue
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.hiddenIf = condition
                }
            } else if (key === 'enabled-if' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                // Handle conditional enabling
                const conditionValue = quotedValue1 || quotedValue2 || unquotedValue
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.enabledIf = condition
                }
            } else if (key === 'disabled-if' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                // Handle conditional disabling
                const conditionValue = quotedValue1 || quotedValue2 || unquotedValue
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.disabledIf = condition
                }
            } else if (key === 'required-if' && (quotedValue1 !== undefined || quotedValue2 !== undefined || unquotedValue !== undefined)) {
                // Handle conditional requirement
                const conditionValue = quotedValue1 || quotedValue2 || unquotedValue
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.requiredIf = condition
                }
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

    /**
     * Parse a condition string into a FieldCondition object
     * Supports: "field=value", "field!=value", "field", "!field"
     * @param conditionStr - The condition string to parse
     * @returns A FieldCondition object or null if invalid
     */
    private parseCondition(conditionStr: string): FieldCondition | null {
        if (!conditionStr || !conditionStr.trim()) return null

        const trimmed = conditionStr.trim()

        // Check for equality: field=value
        const equalMatch = trimmed.match(/^([\w_]+)=(.+)$/)
        if (equalMatch) {
            return {
                field: equalMatch[1],
                operator: '=',
                value: equalMatch[2]
            }
        }

        // Check for inequality: field!=value
        const notEqualMatch = trimmed.match(/^([\w_]+)!=(.+)$/)
        if (notEqualMatch) {
            return {
                field: notEqualMatch[1],
                operator: '!=',
                value: notEqualMatch[2]
            }
        }

        // Check for negation: !field (falsy check)
        if (trimmed.startsWith('!')) {
            const fieldName = trimmed.slice(1).trim()
            if (fieldName && /^[\w_]+$/.test(fieldName)) {
                return {
                    field: fieldName,
                    operator: 'falsy'
                }
            }
        }

        // Simple field name: field (truthy check)
        if (/^[\w_]+$/.test(trimmed)) {
            return {
                field: trimmed,
                operator: 'truthy'
            }
        }

        return null
    }

    /**
     * Parse action element syntax: @[action "label" attributes]
     * Examples: @[submit "Send Message"], @[button "Calculate" onclick="calc()"]
     * @param line - The line to parse
     * @returns A Field object representing the action element, or null if not matched
     */
    private parseActionElement(line: string): Field | null {
        // Pattern: @[action "label" attributes]
        // Examples: @[submit "Send Message"], @[reset "Clear"], @[button "Calculate" onclick="calc()"]
        const actionPattern = /^@\[(\w+)\s+"([^"]+)"([^\]]*)\]$/
        const match = line.match(actionPattern)
        
        if (!match) return null
        
        const [, action, label, attributesStr] = match
        
        // Validate action type
        const validActions = ['submit', 'reset', 'button', 'image']
        if (!validActions.includes(action)) {
            return null
        }
        
        // Generate a unique field name for the action
        const fieldName = `${action}_${Math.random().toString(36).substr(2, 9)}`
        
        // Parse additional attributes
        const attributes: Record<string, any> = {}
        if (attributesStr.trim()) {
            const attributePairs = this.parseAttributes(attributesStr.trim())
            Object.assign(attributes, attributePairs)
        }
        
        // Create field object
        const field: Field = {
            name: fieldName,
            type: action === 'image' ? 'image' : 'button',
            label: label,
            attributes: {
                type: action,
                ...attributes
            }
        }
        
        // Special handling for image type
        if (action === 'image' && !attributes.src) {
            // Image button needs src attribute
            console.warn(`Image action element missing src attribute: ${line}`)
        }
        
        return field
    }

    private parseAttributeValue(value: string): any {
        // Handle empty string explicitly
        if (value === '') {
            return ''
        }

        // Unescape common escape sequences
        const unescapedValue = value.replace(/\\(.)/g, '$1')

        // Try to parse as integer (including negative)
        if (/^-?\d+$/.test(unescapedValue)) {
            return parseInt(unescapedValue, 10)
        }

        // Try to parse as float (including negative)
        if (/^-?\d*\.\d+$/.test(unescapedValue)) {
            return parseFloat(unescapedValue)
        }

        // Try to parse as boolean
        if (unescapedValue === 'true') return true
        if (unescapedValue === 'false') return false

        // Return as unescaped string
        return unescapedValue
    }

    private parseFormDeclaration(line: string): FormDeclaration | null {
        const trimmedLine = line.trim()
        
        // Match @form[attributes] pattern
        const match = trimmedLine.match(/^@form\[([^\]]*)\]\s*$/)
        if (!match) return null

        const attributesString = match[1]
        const attributes = this.parseAttributes(attributesString)
        
        // Generate or extract form ID
        const id = attributes.id || this.generateFormId()
        
        // Remove id from attributes if it was specified, as it's handled separately
        if (attributes.id) {
            delete attributes.id
        }
        
        return {
            id,
            attributes
        }
    }

    private generateFormId(): string {
        return `formdown-form-${this.formCounter++}`
    }

    /**
     * Generate a datalist ID from content for automatic datalist creation
     * @param content - The content string (comma-separated options)
     * @returns A unique datalist ID
     */
    private generateDatalistId(content: string): string {
        // Create a simple hash from content to ensure uniqueness
        const normalized = content.toLowerCase().replace(/\s+/g, '').replace(/,/g, '-')
        const hash = normalized.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0)
            return a & a
        }, 0)
        return `datalist-${Math.abs(hash)}`
    }

    /**
     * Parse shorthand datalist declaration
     * Examples: @#countries: Korea,Japan,China,USA
     * @param line - The line to parse
     * @returns DatalistDeclaration object or null if not matched
     */
    private parseShorthandDatalist(line: string): DatalistDeclaration | null {
        const trimmedLine = line.trim()

        // Match @#id: options pattern
        const match = trimmedLine.match(/^@#([a-zA-Z_][a-zA-Z0-9_-]*)\s*:\s*(.+)$/)
        if (!match) return null

        const id = match[1]
        const optionsStr = match[2]

        // Parse options from comma-separated string
        const options = optionsStr.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0)

        if (options.length === 0) {
            console.warn('Shorthand datalist declaration has empty options:', line)
            return null
        }

        return {
            id,
            options
        }
    }

    /**
     * Parse @datalist declaration
     * Examples: @datalist[id="countries" options="Korea,Japan,China,USA"]
     * @param line - The line to parse
     * @returns DatalistDeclaration object or null if not matched
     */
    private parseDatalistDeclaration(line: string): DatalistDeclaration | null {
        const trimmedLine = line.trim()
        
        // Match @datalist[attributes] pattern
        const match = trimmedLine.match(/^@datalist\[([^\]]*)\]\s*$/)
        if (!match) return null

        const attributesString = match[1]
        const attributes = this.parseAttributes(attributesString)
        
        // ID is required for datalist
        if (!attributes.id) {
            console.warn('Datalist declaration missing required id attribute:', line)
            return null
        }
        
        // Options are required for datalist
        if (attributes.options === undefined) {
            console.warn('Datalist declaration missing required options attribute:', line)
            return null
        }
        
        // Parse options from comma-separated string
        const options = typeof attributes.options === 'string' 
            ? attributes.options.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0)
            : []
        
        if (options.length === 0) {
            console.warn('Datalist declaration has empty options:', line)
            return null
        }
        
        return {
            id: attributes.id,
            options
        }
    }

    /**
     * Parse group declaration: ## [Group Label] or ## [Group Label collapsible] or ## [Group Label collapsed]
     * Generates a unique group ID from the label
     */
    private parseGroupDeclaration(line: string, position: number): GroupDeclaration | null {
        const trimmedLine = line.trim()

        // Match ## [Label] or ## [Label collapsible] or ## [Label collapsed]
        // Note: This is distinct from regular ## headings which don't have brackets
        const match = trimmedLine.match(/^##\s*\[([^\]]+)\]\s*$/)
        if (!match) return null

        const content = match[1].trim()

        // Check for collapsible/collapsed modifiers
        let label = content
        let collapsible = false
        let collapsed = false

        if (content.endsWith(' collapsed')) {
            label = content.slice(0, -' collapsed'.length).trim()
            collapsible = true
            collapsed = true
        } else if (content.endsWith(' collapsible')) {
            label = content.slice(0, -' collapsible'.length).trim()
            collapsible = true
        }

        // Generate unique ID from label (slugified)
        const id = 'formdown-group-' + label
            .toLowerCase()
            .replace(/[^a-z0-9가-힣]+/gi, '-')
            .replace(/^-+|-+$/g, '')

        return {
            id,
            label,
            position,
            collapsible: collapsible || undefined,
            collapsed: collapsed || undefined
        }
    }

    private getDefaultFormId(): string {
        if (!this.defaultFormCreated) {
            this.defaultFormCreated = true
            this.formDeclarations.push({
                id: 'formdown-form-default',
                attributes: { action: '.', method: 'GET' }
            })
            return 'formdown-form-default'
        }
        return 'formdown-form-default'
    }

    private associateFieldWithForm(field: Field): void {
        // If field already has explicit form attribute, validate it exists
        if (field.attributes?.form) {
            const formExists = this.formDeclarations.some(f => f.id === field.attributes!.form)
            if (!formExists) {
                console.warn(`FormDown: Referenced form "${field.attributes.form}" does not exist. Using current or default form.`)
                field.attributes.form = this.currentFormId || this.getDefaultFormId()
            }
        } else {
            // Auto-associate with current form or create default
            if (this.currentFormId) {
                if (!field.attributes) field.attributes = {}
                field.attributes.form = this.currentFormId
            } else {
                if (!field.attributes) field.attributes = {}
                field.attributes.form = this.getDefaultFormId()
            }
        }

        // Associate with current group if one is active
        if (this.currentGroupId) {
            field.group = this.currentGroupId
        }
    }

    private parseTableBlock(lines: string[], startIndex: number): { fields: Field[], tableHtml: string, endIndex: number } | null {
        const tableLines: string[] = []
        let currentIndex = startIndex

        // Collect all consecutive table lines
        while (currentIndex < lines.length && lines[currentIndex].trim().startsWith('|')) {
            tableLines.push(lines[currentIndex])
            currentIndex++
        }

        // Need at least 3 lines for a valid table (header | separator | data)
        if (tableLines.length < 3) {
            return null
        }

        // Validate table structure
        const headerLine = tableLines[0]
        const separatorLine = tableLines[1]

        // Check if second line is separator (contains only |, -, and spaces)
        if (!/^\|[\s\-|:]+\|$/.test(separatorLine.trim())) {
            return null
        }

        // Parse table structure
        const fields: Field[] = []
        const headers = this.parseTableRow(headerLine)
        const dataRows: string[][] = []

        // Parse data rows and extract inline fields
        for (let i = 2; i < tableLines.length; i++) {
            const row = this.parseTableRow(tableLines[i])
            const processedRow: string[] = []

            for (const cell of row) {
                const { cleanedLine, inlineFields } = this.parseInlineFields(cell)
                fields.push(...inlineFields)
                processedRow.push(cleanedLine)
            }

            dataRows.push(processedRow)
        }

        // Generate table HTML
        const tableHtml = this.generateTableHtml(headers, dataRows)

        return {
            fields,
            tableHtml,
            endIndex: currentIndex - 1
        }
    }

    private parseTableRow(line: string): string[] {
        // Remove leading/trailing pipes and split by pipe
        const trimmed = line.trim().replace(/^\||\|$/g, '')
        return trimmed.split('|').map(cell => cell.trim())
    }

    private generateTableHtml(headers: string[], dataRows: string[][]): string {
        const headerCells = headers.map(h => `<th>${this.escapeHtml(h)}</th>`).join('')
        const bodyRows = dataRows.map(row => {
            const cells = row.map(cell => `<td>${cell}</td>`).join('')
            return `<tr>${cells}</tr>`
        }).join('\n')

        return `<table class="formdown-table">
<thead>
<tr>${headerCells}</tr>
</thead>
<tbody>
${bodyRows}
</tbody>
</table>`
    }

    private escapeHtml(text: string): string {
        const escapeMap: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }
        return text.replace(/[&<>"']/g, char => escapeMap[char] || char)
    }
}
