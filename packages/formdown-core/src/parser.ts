import { Field, FieldRelation, ParseResult, FormdownContent, FormdownOptions, FormDeclaration, DatalistDeclaration, GroupDeclaration, FieldCondition, ConditionalAttributes, Diagnostic, FrontMatter, SourceSpan } from './types'
import { NAME, ATTRIBUTES, isValidName, pattern, tokenizeAttributes, attributeValue, quoteAttributeValue, scanAttributes } from './grammar.js'
import { readFrontMatter, FenceTracker, maskCodeSpans } from './source.js'

const TYPE_MARKER = String.raw`(?:dt|d|[#@%&t?TrscRFCMW$])`
const RELATION = String.raw`(?:(<->|->)\s*(${NAME})\s*)?`

/** Features that make a block line shorthand rather than standard syntax. */
const SHORTHAND_MARKERS = [
    pattern(String.raw`^@${NAME}\*`),                                           // Required marker
    pattern(String.raw`^@${NAME}\{[^}]*\}`),                                    // Content
    pattern(String.raw`^@${NAME}\s*:\s*${TYPE_MARKER}\d*\[`),                   // Type marker
    pattern(String.raw`^@${NAME}\([^)]+\)\*`),                                  // Label + required
    pattern(String.raw`^@${NAME}\([^)]+\)\{[^}]*\}`),                           // Label + content
    pattern(String.raw`^@${NAME}\([^)]+\)\s*:\s*${TYPE_MARKER}\d*\[`),          // Label + type marker
    pattern(String.raw`^@${NAME}[^:]*(?:<->|->)\s*${NAME}\s*:\s*${TYPE_MARKER}\d*\[`) // FK relation + type marker
]

/** Standard block syntax: @name(Label) [-> Target]: [type attributes] */
const BLOCK_FIELD = pattern(String.raw`^@(${NAME})(?:\(([^)]+)\))?\s*${RELATION}:\s*${ATTRIBUTES}.*$`)

/** Shorthand block syntax: @name*{content}(Label) [-> Target]: marker[attributes] */
const SHORTHAND_BLOCK_FIELD = pattern(String.raw`^@(${NAME})(\*)?(?:\{(.*?)\})?(?:\(([^)]+)\))?\s*${RELATION}:\s*(?:(dt|d|[#@%&t?TrscRFCMW$])(\d*)?)?${ATTRIBUTES}.*$`)

/** Shorthand block syntax with the label first: @name(Label)*{content} [-> Target]: marker[attributes] */
const SHORTHAND_BLOCK_FIELD_LABEL_FIRST = pattern(String.raw`^@(${NAME})(?:\(([^)]+)\))?(\*)?(?:\{(.*?)\})?\s*${RELATION}:\s*(?:(dt|d|[#@%&t?TrscRFCMW$])(\d*)?)?${ATTRIBUTES}.*$`)

/** The types a field can be given by name in its brackets, `[select …]`. */
const INPUT_TYPES = ['text', 'email', 'password', 'number', 'tel', 'url', 'search',
    'date', 'time', 'datetime-local', 'month', 'week', 'color',
    'file', 'range', 'radio', 'checkbox', 'select', 'textarea',
    'submit', 'reset', 'button', 'hidden']

/** Something shaped like a block field whose name is not a valid name, e.g. `@1st: [text]`. */
const BLOCK_FIELD_CANDIDATE = /^@([^\s:([{*\-<>@\]]+)[^:]*:\s*\S*\[/u
import { defaultExtensionManager } from './extensions/extension-manager.js'
import type { HookContext } from './extensions/types.js'

// Private-use characters delimit inline field markers; they cannot collide with
// anything markdown or HTML gives meaning to
const INLINE_MARKER_OPEN = '\uE000'
const INLINE_MARKER_CLOSE = '\uE001'
const INLINE_MARKER = /\uE000(\d+)\uE001/g

export class FormdownParser {
    private options: FormdownOptions
    private formDeclarations: FormDeclaration[] = []
    private datalistDeclarations: DatalistDeclaration[] = []
    private groupDeclarations: GroupDeclaration[] = []
    private currentFormId: string | null = null
    private currentGroupId: string | null = null
    private formCounter = 1
    private defaultFormCreated = false
    private diagnostics: Diagnostic[] = []
    private lineStarts: number[] = []
    private currentLine = 0
    private markedInlineFields: Field[] = []

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
        this.diagnostics = []
        this.markedInlineFields = []

        // Extension hooks: a failing hook is reported, never fatal
        const onHookError = (message: string) => {
            this.diagnostics.push({ code: 'hook-error', message, severity: 'error' })
        }
        const source = defaultExtensionManager.transformSync('pre-parse', { input: content }, content, onHookError)

        const extracted = this.extractFields(source)
        const fields = extracted.fields.map(field => defaultExtensionManager.transformSync(
            'field-parse',
            { input: field.span ? source.slice(field.span.start, field.span.end) : undefined, field },
            field,
            onHookError
        ))
        this.reportDuplicateNames(fields)

        const result: FormdownContent = {
            markdown: this.options.preserveMarkdown ? extracted.cleanedMarkdown : '',
            forms: fields,
            ...(extracted.frontMatter && { frontMatter: extracted.frontMatter }),
            diagnostics: this.diagnostics,
            formDeclarations: this.formDeclarations,
            datalistDeclarations: this.datalistDeclarations,
            groupDeclarations: this.groupDeclarations
        }
        return defaultExtensionManager.transformSync('post-parse', { input: source }, result, onHookError)
    }

    /**
     * @deprecated Use parseFormdown() instead, which returns richer FormdownContent
     * including formDeclarations, datalistDeclarations, and groupDeclarations.
     */
    parse(content: string): ParseResult {
        const { fields } = this.extractFields(content)
        return { fields, errors: [] }
    }

    private extractFields(content: string): { fields: Field[], cleanedMarkdown: string, frontMatter?: FrontMatter } {
        const fields: Field[] = []
        const lines = content.split('\n')
        const cleanedLines: string[] = []

        this.lineStarts = []
        let offset = 0
        for (const line of lines) {
            this.lineStarts.push(offset)
            offset += line.length + 1
        }

        const frontMatterResult = readFrontMatter(content)
        if (frontMatterResult) this.diagnostics.push(...frontMatterResult.diagnostics)
        const firstBodyLine = frontMatterResult?.lineCount ?? 0
        const fences = new FenceTracker()

        for (let i = firstBodyLine; i < lines.length; i++) {
            const line = lines[i]
            this.currentLine = i

            // Code is not Formdown: fenced blocks pass through unchanged
            if (fences.next(line)) {
                cleanedLines.push(line)
                continue
            }

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
                const trimmed = line.trim()
                blockField.span = this.spanAt(line.indexOf(trimmed), trimmed.length)
                // Associate field with current form
                this.associateFieldWithForm(blockField)
                fields.push(blockField)
                // Insert placeholder for field position (using a format that won't be interpreted as markdown)
                cleanedLines.push(`<!--FORMDOWN_FIELD_${fields.length - 1}-->`)
                continue
            }

            this.checkBlockFieldSyntax(line)

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

        // Values in front matter belong to the document and take precedence over
        // defaults written in the fields themselves
        const data = frontMatterResult?.frontMatter.data
        if (data) {
            for (const field of fields) {
                if (Object.prototype.hasOwnProperty.call(data, field.name)) {
                    field.value = data[field.name]
                }
            }
        }

        return {
            fields,
            cleanedMarkdown: this.placeInlineFields(cleanedLines.join('\n'), fields),
            frontMatter: frontMatterResult?.frontMatter
        }
    }

    /**
     * A stand-in for an inline field while its line is parsed. The field's index among
     * all fields is only known once the whole document is parsed; `placeInlineFields`
     * then swaps the marker for the generator's field placeholder, so inline fields are
     * rendered like block fields — from the final field, with its bound value and the
     * render hooks.
     */
    private inlineMarker(field: Field): string {
        this.markedInlineFields.push(field)
        return `${INLINE_MARKER_OPEN}${this.markedInlineFields.length - 1}${INLINE_MARKER_CLOSE}`
    }

    private placeInlineFields(markdown: string, fields: Field[]): string {
        const marked = this.markedInlineFields
        this.markedInlineFields = []
        return markdown.replace(INLINE_MARKER, (_, k: string) => `<!--FORMDOWN_FIELD_${fields.indexOf(marked[Number(k)])}-->`)
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
        // FK relation syntax with type marker: @name -> Target: s[], @name* -> Target: c[]
        const hasShorthandMarker = SHORTHAND_MARKERS.some(marker => marker.test(trimmedLine))
        
        if (hasShorthandMarker) {
                const shorthandField = this.parseShorthandBlockField(trimmedLine)
            if (shorthandField) return shorthandField
        }
        
        // Fall back to standard syntax
        // Use a more sophisticated regex that handles quoted content with brackets
        // Also supports FK relation syntax: @name -> Target: [...] or @name <-> Target: [...]
        const match = trimmedLine.match(BLOCK_FIELD)
        if (!match) return null

        const [, name, customLabel, arrow, relationTarget, typeAndAttributes] = match
        const field = this.createField(name, customLabel, typeAndAttributes)

        // Attach relation metadata if FK syntax was used
        if (field && relationTarget) {
            field.relation = {
                target: relationTarget,
                type: arrow === '<->' ? 'many-to-many' : 'fk'
            }
        }

        return field
    }

    private parseShorthandBlockField(line: string): Field | null {
        // Pattern: @fieldName*{content}(label) [-> Target]: typeMarker[attributes] OR @fieldName(label)*{content} [-> Target]: typeMarker[attributes]
        // Examples: @email*: @[], @name(Full Name)*{^[A-Z][a-z]+$}: [], @size{S,M,L}: r[]
        // FK relation: @customer_id* -> Customers: s[], @tags <-> Tags: c[]
        // Handle 'dt' as a special case (two-character type marker)
        // Make type marker optional to handle cases like @name*: []
        // Handle both orders: @name*{content}(label) and @name(label)*{content}
        // Fixed pattern with nested brace support
        let shorthandMatch = line.match(SHORTHAND_BLOCK_FIELD)

        // Try alternative order: @name(label)*{content}
        if (!shorthandMatch) {
            shorthandMatch = line.match(SHORTHAND_BLOCK_FIELD_LABEL_FIRST)
            if (shorthandMatch) {
                // Reorder to match expected destructuring: [, name, requiredMarker, content, customLabel, arrow, relationTarget, typeMarker, rowsOrModifier, attributes]
                const [, name, customLabel, requiredMarker, content, arrow, relationTarget, typeMarker, rowsOrModifier, attributes] = shorthandMatch
                shorthandMatch = [shorthandMatch[0], name, requiredMarker, content, customLabel, arrow, relationTarget, typeMarker, rowsOrModifier, attributes]
            }
        }

        if (!shorthandMatch) {
            return null
        }

        const [, name, requiredMarker, content, customLabel, arrow, relationTarget, typeMarker, rowsOrModifier, attributes] = shorthandMatch

        // Only process as shorthand if it has shorthand features (required marker, content defined, custom label, type marker, rows, or relation)
        // Note: content === '' (empty string) is different from content === undefined (no braces)
        if (!requiredMarker && content === undefined && !customLabel && !typeMarker && !rowsOrModifier && !relationTarget) {
            return null // Let standard parser handle this
        }

        // Convert shorthand to standard field
        const field = this.convertShorthandToField(name, requiredMarker, content, customLabel, typeMarker || '', rowsOrModifier, attributes)

        // Attach relation metadata if FK syntax was used
        if (field && relationTarget) {
            field.relation = {
                target: relationTarget,
                type: arrow === '<->' ? 'many-to-many' : 'fk'
            }
        }

        return field
    }

    /**
     * Parse inline fields in `source`, which starts at `column` (0-based) of the current line.
     */
    /**
     * Finds the inline fields of one line. Each field is replaced by a marker (see
     * `inlineMarker`) instead of finished markup.
     */
    private parseInlineFields(source: string, column = 0): { cleanedLine: string, inlineFields: Field[] } {
        const inlineFields: Field[] = []
        // Inline code is not Formdown: blank out code spans (offsets are unchanged)
        const { masked: line, restore } = maskCodeSpans(source)
        // Shorthand replacements change the length of the line; the standard pass maps
        // its offsets back to the source through these
        const replacements: { at: number, delta: number }[] = []
        const delimiter = this.options.inlineFieldDelimiter!

        // Support shorthand inline fields: typeMarker___@fieldName*{content}(label)[attributes] or typeMarker___@fieldName*{content}: type[attributes]
        // Examples: @___@email*, #___@age, d___@birth_date{yyyy-MM-dd}: [attributes], ___@service{options}: s[]
        // Note: need to handle single 'd' separately from 'dt'
        this.checkInlineFieldSyntax(line, delimiter, column)

        const shorthandPattern = pattern(String.raw`(dt|d|[#@%&t?TrscRFCMW$]?)${delimiter}@(${NAME})(\*)?(?:\{([^}]*)\})?(?:\(([^)]+)\))?(?:${ATTRIBUTES}|:\s*([^\s]*?)${ATTRIBUTES})?`, 'g')
        
        let cleanedLine = line.replace(shorthandPattern, (match, typeMarker, name, requiredMarker, content, customLabel, attributes, colonType, colonAttributes, offset: number) => {
            // Only process as shorthand if it has actual shorthand features
            // Custom labels are also standard features, so only process if we have
            // type markers, required markers, content, or attributes
            if (!typeMarker && !requiredMarker && !content && !attributes && !colonType && !colonAttributes) {
                return match // Let standard parser handle this
            }

            // If attributes start with a valid input type (like "text required"),
            // let the standard parser handle it instead of shorthand parser
            if (!typeMarker && attributes) {
                const firstWord = attributes.split(/\s/)[0]
                if (INPUT_TYPES.includes(firstWord)) {
                    return match // Let standard parser handle this
                }
            }

            const finalTypeMarker = typeMarker || colonType || ''
            const finalAttributes = attributes || colonAttributes || ''
            const field = this.convertShorthandToField(name, requiredMarker, content, customLabel, finalTypeMarker, '', finalAttributes)
            if (field) {
                field.inline = true
                field.span = this.spanAt(column + offset, match.length)
                inlineFields.push(field)
                const markup = this.inlineMarker(field)
                replacements.push({ at: offset, delta: markup.length - match.length })
                return markup
            }
            return match
        })

        // Fallback to standard inline pattern for non-shorthand syntax
        // Support both: ___@name[attributes] and ___@name{options}: type[]
        // Occurrences the shorthand pass handled were already replaced with markup, so
        // everything this pass matches is still unprocessed source. (Comparing names here
        // used to drop a second field that happened to share a name.)
        const standardPattern = pattern(String.raw`${delimiter}@(${NAME})(?:\{([^}]*)\})?(?:\(([^)]+)\))?(?::\s*([^\s]*?)${ATTRIBUTES}|${ATTRIBUTES})?`, 'g')
        cleanedLine = cleanedLine.replace(standardPattern, (match, name, options, customLabel, colonType, colonAttributes, directAttributes, offset: number) => {
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
                // Replacements are in source order; each one's position in this pass's text
                // is its source position plus the growth of the replacements before it
                let shift = 0
                for (const { at, delta } of replacements) {
                    if (at + shift >= offset) break
                    shift += delta
                }
                field.span = this.spanAt(column + offset - shift, match.length)
                inlineFields.push(field)
                return this.inlineMarker(field)
            }
            return match
        })

        // The two passes find fields out of order; report them in source order
        inlineFields.sort((a, b) => a.span!.start - b.span!.start)
        return { cleanedLine: restore(cleanedLine), inlineFields }
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
        
        // Without a marker the brackets may name the type, as in standard syntax: `@status*: [select …]`
        const namedType = typeMarker ? undefined : tokenizeAttributes(attributes ?? '').find(t => t.value === undefined && INPUT_TYPES.includes(t.key))?.key
        const type = typeMap[typeMarker] || namedType || 'text'
        
        // Create base field attributes
        let fieldAttributes = attributes ? this.parseAttributes(attributes) : {}
        if (namedType) delete fieldAttributes[namedType]
        
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
            const choiceMarker: Record<string, string> = { select: 's', radio: 'r', checkbox: 'c' }
            const contentInterpreted = this.interpretContent(content, typeMarker || choiceMarker[type] || '')
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
        for (const token of tokenizeAttributes(attributeString)) {
            attributes[token.key] = token.key === 'required' ? true : attributeValue(token)
        }
        return attributes
    }

    private buildTypeAndAttributesString(type: string, attributes: Record<string, any>): string {
        const parts = [type]
        
        for (const [key, value] of Object.entries(attributes)) {
            if (value === true) {
                parts.push(key)
            } else if (typeof value === 'string') {
                parts.push(`${key}=${quoteAttributeValue(value)}`)
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
        const matches = tokenizeAttributes(typeAndAttributes)

        if (matches.length === 0) return null

        // Find the type (first match without a value, or 'text' as default)
        let type = 'text'
        let typeIndex = -1
        
        for (let i = 0; i < matches.length; i++) {
            const token = matches[i]
            const key = token.key
            const hasValue = token.value !== undefined
            const text = token.value ?? ''
            // If this key has no value and is a valid field type, use it as the type
            if (!hasValue) {
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
                if (INPUT_TYPES.includes(fullType)) {
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
            const token = matches[i]
            const key = token.key
            const hasValue = token.value !== undefined
            const text = token.value ?? ''

            if (key === 'required') {
                field.required = true
            } else if (key === 'label' && hasValue) {
                field.label = text
            } else if (key === 'placeholder' && hasValue) {
                field.placeholder = text
            } else if (key === 'options' && hasValue) {
                const optionsValue = text
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
            } else if (key === 'other-label' && hasValue) {
                field.otherLabel = text
            } else if (key === 'format' && hasValue) {
                field.format = text
            } else if (key === 'pattern' && hasValue) {
                field.pattern = text
            } else if (key === 'content' && hasValue) {
                field.content = text
            } else if (key === 'value') {
                // Quoted values stay strings; bare ones may be numbers or booleans; no value is ''
                field.value = hasValue ? attributeValue(token) : ''
            } else if (key === 'datalist' && hasValue) {
                // Handle datalist attribute
                const datalistValue = text

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
            } else if (key === 'visible-if' && hasValue) {
                // Handle conditional visibility
                const conditionValue = text
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.visibleIf = condition
                }
            } else if (key === 'hidden-if' && hasValue) {
                // Handle conditional hiding
                const conditionValue = text
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.hiddenIf = condition
                }
            } else if (key === 'enabled-if' && hasValue) {
                // Handle conditional enabling
                const conditionValue = text
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.enabledIf = condition
                }
            } else if (key === 'disabled-if' && hasValue) {
                // Handle conditional disabling
                const conditionValue = text
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.disabledIf = condition
                }
            } else if (key === 'required-if' && hasValue) {
                // Handle conditional requirement
                const conditionValue = text
                const condition = this.parseCondition(conditionValue)
                if (condition) {
                    if (!field.conditions) field.conditions = {}
                    field.conditions.requiredIf = condition
                }
            } else if (hasValue) {
                field.attributes![key] = attributeValue(token)
            } else {
                field.attributes![key] = true
            }
        }

        return field
    }

    /** A span of `length` characters at `column` (0-based) of the line being parsed. */
    private spanAt(column: number, length: number): SourceSpan {
        const start = (this.lineStarts[this.currentLine] ?? 0) + column
        return { start, end: start + length, line: this.currentLine + 1, column: column + 1 }
    }

    /** Record a diagnostic located at `column` (0-based) of the line being parsed. */
    private report(code: string, message: string, column: number, length: number, severity: Diagnostic['severity'] = 'error'): void {
        const start = (this.lineStarts[this.currentLine] ?? 0) + column
        this.diagnostics.push({
            code,
            message,
            severity,
            span: { start, end: start + length, line: this.currentLine + 1, column: column + 1 }
        })
    }

    /** Report attribute brackets starting at `open` that do not close on this line. */
    private checkAttributeBrackets(line: string, open: number, from: number, base = 0): void {
        const scan = scanAttributes(line, open)
        if (!('error' in scan)) return
        this.report(scan.error,
            scan.error === 'unterminated-quoted-value'
                ? 'A quoted attribute value is never closed; attribute values cannot span lines'
                : 'Field attributes are opened with "[" but never closed with "]"',
            base + from, line.length - from)
    }

    /** A line shaped like a block field that did not parse: an invalid name or unclosed brackets. */
    private checkBlockFieldSyntax(line: string): void {
        const trimmed = line.trim()
        const candidate = trimmed.match(BLOCK_FIELD_CANDIDATE)
        if (!candidate) return
        const column = line.indexOf(trimmed)
        if (!isValidName(candidate[1])) {
            this.report('invalid-field-name',
                `"${candidate[1]}" is not a valid field name: names start with a letter or underscore`,
                column, candidate[0].length)
            return
        }
        this.checkAttributeBrackets(line, column + candidate[0].length - 1, column)
    }

    /** Inline field markers that cannot become fields. */
    private checkInlineFieldSyntax(line: string, delimiter: string, base = 0): void {
        const invalidName = pattern(String.raw`${delimiter}@(\p{N}[\p{L}\p{N}_]*)`, 'g')
        for (const match of line.matchAll(invalidName)) {
            this.report('invalid-field-name',
                `"${match[1]}" is not a valid field name: names start with a letter or underscore`,
                base + match.index!, match[0].length)
        }

        const opening = pattern(String.raw`${delimiter}@${NAME}(?:\{[^}]*\})?(?:\([^)]*\))?(?::\s*[^\s\[]*)?\[`, 'g')
        for (const match of line.matchAll(opening)) {
            this.checkAttributeBrackets(line, match.index! + match[0].length - 1, match.index!, base)
        }
    }

    /** Field names must be unique within a document; later occurrences are reported. */
    private reportDuplicateNames(fields: Field[]): void {
        const seen = new Set<string>()
        for (const field of fields) {
            if (seen.has(field.name)) {
                this.diagnostics.push({
                    code: 'duplicate-field-name',
                    message: `Field name "${field.name}" is used more than once`,
                    severity: 'warning'
                })
            }
            seen.add(field.name)
        }
    }

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

        // A condition names a field the way a field is named — in any script, like the field itself.
        // Check for equality: field=value
        const equalMatch = trimmed.match(pattern(String.raw`^(${NAME})=(.+)$`))
        if (equalMatch) {
            return {
                field: equalMatch[1],
                operator: '=',
                value: equalMatch[2]
            }
        }

        // Check for inequality: field!=value
        const notEqualMatch = trimmed.match(pattern(String.raw`^(${NAME})!=(.+)$`))
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
            if (fieldName && isValidName(fieldName)) {
                return {
                    field: fieldName,
                    operator: 'falsy'
                }
            }
        }

        // Simple field name: field (truthy check)
        if (isValidName(trimmed)) {
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
        const tableLine = this.currentLine
        for (let i = 2; i < tableLines.length; i++) {
            this.currentLine = startIndex + i
            const row = this.parseTableRow(tableLines[i])
            const columns = this.tableCellColumns(tableLines[i])
            const processedRow: string[] = []

            row.forEach((cell, c) => {
                const { cleanedLine, inlineFields } = this.parseInlineFields(cell, columns[c] ?? 0)
                fields.push(...inlineFields)
                processedRow.push(cleanedLine)
            })

            dataRows.push(processedRow)
        }
        this.currentLine = tableLine

        // Generate table HTML
        const tableHtml = this.generateTableHtml(headers, dataRows)

        return {
            fields,
            tableHtml,
            endIndex: currentIndex - 1
        }
    }

    /** Column (0-based) where each trimmed cell of a table row starts. */
    private tableCellColumns(line: string): number[] {
        const columns: number[] = []
        const pipes: number[] = []
        for (let i = 0; i < line.length; i++) if (line[i] === '|') pipes.push(i)
        for (let k = 0; k + 1 < pipes.length; k++) {
            const raw = line.slice(pipes[k] + 1, pipes[k + 1])
            columns.push(pipes[k] + 1 + (raw.length - raw.trimStart().length))
        }
        // A row may omit the closing pipe
        const rest = line.slice(pipes[pipes.length - 1] + 1)
        if (pipes.length > 0 && rest.trim()) columns.push(pipes[pipes.length - 1] + 1 + (rest.length - rest.trimStart().length))
        return columns
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
