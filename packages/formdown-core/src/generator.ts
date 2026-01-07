import { marked } from 'marked'
import { Field, FormdownContent, FormDeclaration, DatalistDeclaration, GroupDeclaration } from './types'
import { defaultExtensionManager } from './extensions/extension-manager.js'
import type { HookContext } from './extensions/types.js'

export class FormdownGenerator {
    private formCounter = 0
    private fieldCounter = 0
    private usedIds = new Set<string>()
    /**
     * Escape HTML special characters
     * @param text - The text to escape
     * @returns HTML-escaped text
     */
    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
    }

    /**
     * Generate a human-readable label from a field name
     * @param fieldName - The field name to convert
     * @returns A formatted label string
     */
    private generateSmartLabel(fieldName: string): string {
        // Validate field name (must not start with a number)
        if (/^\d/.test(fieldName)) {
            throw new Error(`Invalid field name '${fieldName}': Field names cannot start with a number`)
        }

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
     * Determine the form ID for a field based on explicit form attribute or default assignment
     * @param field - The field to determine form ID for
     * @param defaultFormId - The default form ID to use if no explicit form is specified
     * @returns The form ID to use for this field
     */
    private determineFormId(field: Field, defaultFormId?: string): string | undefined {
        // Priority 1: Explicit form attribute in field attributes
        if (field.attributes?.form) {
            return field.attributes.form as string
        }

        // Priority 2: Default form ID provided (usually from nearest @form declaration)
        if (defaultFormId) {
            return defaultFormId
        }

        // Priority 3: Generate default form ID if no form context is available
        if (!defaultFormId) {
            return this.generateDefaultFormId()
        }

        return undefined
    }

    /**
     * Generate a default form ID using the formdown-form-{counter} pattern
     * @returns A unique default form ID
     */
    private generateDefaultFormId(): string {
        if (this.formCounter === 0) {
            return 'formdown-form-default'
        }
        return `formdown-form-${this.formCounter++}`
    }

    /**
     * Ensure there's at least a default form declaration if fields exist but no forms are declared
     * @param formDeclarations - Existing form declarations
     * @param fields - Fields that need form association
     * @returns Form declarations with default form added if needed
     */
    private ensureDefaultForm(formDeclarations: FormDeclaration[], fields: Field[]): FormDeclaration[] {
        if (fields.length === 0) {
            return formDeclarations
        }

        if (formDeclarations.length === 0) {
            // Create default form if no forms are declared but fields exist
            const defaultForm: FormDeclaration = {
                id: this.generateDefaultFormId(),
                attributes: {}
            }
            return [defaultForm]
        }

        return formDeclarations
    }

    /**
     * Create a mapping between fields and their associated forms
     * @param fields - All fields in the content
     * @param formDeclarations - All form declarations
     * @returns Map of field to form ID associations
     */
    private createFormContext(fields: Field[], formDeclarations: FormDeclaration[]): Map<Field, string> {
        const formContext = new Map<Field, string>()
        
        if (formDeclarations.length === 0) {
            return formContext
        }

        // Sort form declarations by position for nearest form logic
        const sortedForms = [...formDeclarations].sort((a, b) => (a.position || 0) - (b.position || 0))
        const defaultFormId = sortedForms[0].id

        fields.forEach(field => {
            // If field has explicit form attribute, respect it
            if (field.attributes?.form) {
                const explicitFormId = field.attributes.form as string
                // Validate that the form exists
                const formExists = formDeclarations.some(form => form.id === explicitFormId)
                if (formExists) {
                    formContext.set(field, explicitFormId)
                } else {
                    // Fallback to default form if explicit form doesn't exist
                    console.warn(`Form '${explicitFormId}' referenced by field '${field.name}' does not exist. Using default form.`)
                    formContext.set(field, defaultFormId)
                }
            } else {
                // Auto-associate with nearest preceding form based on position
                const nearestForm = this.findNearestForm(field, sortedForms)
                formContext.set(field, nearestForm?.id || defaultFormId)
            }
        })

        return formContext
    }

    /**
     * Find the nearest preceding form declaration for a field
     * @param field - The field to find a form for
     * @param sortedForms - Form declarations sorted by position
     * @returns The nearest form declaration or undefined
     */
    private findNearestForm(field: Field, sortedForms: FormDeclaration[]): FormDeclaration | undefined {
        if (!field.position) {
            return sortedForms[0] // Fallback to first form if no position info
        }

        // Find the last form that appears before this field
        let nearestForm: FormDeclaration | undefined = undefined
        
        for (const form of sortedForms) {
            if (!form.position || form.position <= field.position) {
                nearestForm = form
            } else {
                break // Forms are sorted, so we can stop here
            }
        }

        return nearestForm || sortedForms[0]
    }

    generateHTML(content: FormdownContent): string {
        // Reset ID tracking for each form generation
        this.usedIds.clear()
        this.fieldCounter = 0

        const markdownHTML = content.markdown ? marked(content.markdown) : ''

        // Handle both sync and async marked results
        if (typeof markdownHTML === 'string') {
            // Use Hidden Form Architecture as the default behavior
            return this.processContentWithHiddenForms(
                markdownHTML,
                content.forms,
                content.formDeclarations || [],
                content.datalistDeclarations || [],
                content.groupDeclarations || []
            )
        } else {
            // If marked returns a Promise, we need to handle it differently
            // For now, fallback to the old method
            return this.generateLegacyHTML(content)
        }
    }

    private processContentWithHiddenForms(
        html: string,
        fields: Field[],
        formDeclarations: FormDeclaration[],
        datalistDeclarations: DatalistDeclaration[],
        groupDeclarations: GroupDeclaration[] = []
    ): string {
        if (fields.length === 0 && formDeclarations.length === 0 && datalistDeclarations.length === 0 && groupDeclarations.length === 0) {
            return html
        }

        // Ensure we have at least a default form if fields exist but no forms declared
        const effectiveFormDeclarations = this.ensureDefaultForm(formDeclarations, fields)

        // Generate hidden forms HTML
        const hiddenFormsHTML = this.generateHiddenFormsHTML(effectiveFormDeclarations)

        // Generate datalist elements HTML
        const datalistHTML = this.generateDatalistHTML(datalistDeclarations)

        // Create form context mapping for field-to-form association
        const formContext = this.createFormContext(fields, effectiveFormDeclarations)

        // Create group declarations map for quick lookup
        const groupMap = new Map<string, GroupDeclaration>()
        groupDeclarations.forEach(group => groupMap.set(group.id, group))

        // Separate inline and block fields
        const inlineFields: Field[] = []
        const blockFields: Field[] = []

        fields.forEach(field => {
            if (field.inline) {
                inlineFields.push(field)
            } else {
                blockFields.push(field)
            }
        })

        let result = html

        // Process group start placeholders
        groupDeclarations.forEach(group => {
            const placeholder = `<!--FORMDOWN_GROUP_START_${group.id}-->`
            const groupStartHTML = this.generateGroupStartHTML(group)
            result = result.replace(new RegExp(this.escapeRegex(placeholder), 'g'), groupStartHTML)
        })

        // Process group end placeholders
        groupDeclarations.forEach(group => {
            const placeholder = `<!--FORMDOWN_GROUP_END_${group.id}-->`
            const groupEndHTML = '</fieldset>'
            result = result.replace(new RegExp(this.escapeRegex(placeholder), 'g'), groupEndHTML)
        })

        // Process inline fields first with form context
        inlineFields.forEach((field, index) => {
            const placeholder = `<!--FORMDOWN_FIELD_${fields.indexOf(field)}-->`
            const defaultFormId = formContext.get(field)
            const fieldHTML = this.generateInlineFieldHTML(field, defaultFormId)
            result = result.replace(new RegExp(this.escapeRegex(placeholder), 'g'), fieldHTML)
        })

        // Process block fields with form context
        blockFields.forEach(field => {
            const fieldIndex = fields.indexOf(field)
            const placeholder = `<!--FORMDOWN_FIELD_${fieldIndex}-->`
            const defaultFormId = formContext.get(field)
            const fieldHTML = this.generateStandaloneFieldHTML(field, defaultFormId)
            result = result.replace(new RegExp(this.escapeRegex(placeholder), 'g'), fieldHTML)
        })

        // Prepend hidden forms and datalist elements to the beginning of the HTML
        return hiddenFormsHTML + datalistHTML + result
    }

    /**
     * Generate fieldset opening tag with legend for a group
     * Following WCAG accessibility best practices for fieldset/legend
     */
    private generateGroupStartHTML(group: GroupDeclaration): string {
        const escapedLabel = this.escapeHtml(group.label)
        const attrs: string[] = [
            `class="formdown-group"`,
            `data-group="${this.escapeHtml(group.id)}"`
        ]

        if (group.collapsible) {
            attrs.push('data-collapsible="true"')
        }
        if (group.collapsed) {
            attrs.push('data-collapsed="true"')
        }

        return `<fieldset ${attrs.join(' ')}>\n<legend>${escapedLabel}</legend>`
    }

    /**
     * Escape special regex characters in a string
     */
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    }

    private processContent(html: string, fields: Field[]): string {
        if (fields.length === 0) {
            return html
        }

        // Separate inline and block fields
        const inlineFields: Field[] = []
        const blockFields: Field[] = []

        fields.forEach(field => {
            if (field.inline) {
                inlineFields.push(field)
            } else {
                blockFields.push(field)
            }
        })

        let result = html

        // Process inline fields first
        inlineFields.forEach((field, index) => {
            const placeholder = `<!--FORMDOWN_FIELD_${fields.indexOf(field)}-->`
            const fieldHTML = this.generateInlineFieldHTML(field)
            result = result.replace(new RegExp(placeholder, 'g'), fieldHTML)
        })

        // Process block fields - replace each field at its original position
        blockFields.forEach(field => {
            const fieldIndex = fields.indexOf(field)
            const placeholder = `<!--FORMDOWN_FIELD_${fieldIndex}-->`
            const fieldHTML = this.generateStandaloneFieldHTML(field)
            result = result.replace(new RegExp(placeholder, 'g'), fieldHTML)
        })

        return result
    }

    private processFieldPlaceholders(html: string, fields: Field[]): string {
        let result = html

        // Replace field placeholders with actual form fields
        fields.forEach((field, index) => {
            const placeholder = `<!--FORMDOWN_FIELD_${index}-->`
            const fieldHTML = this.generateStandaloneFieldHTML(field)
            result = result.replace(
                new RegExp(placeholder, 'g'),
                fieldHTML
            )
        })

        return result
    }

    private generateLegacyHTML(content: FormdownContent): string {
        const markdownHTML = content.markdown ? marked(content.markdown) as string : ''
        // Generate fields without wrapper form using Hidden Form Architecture
        if (content.forms.length === 0) return markdownHTML

        const formId = `formdown-legacy-${Math.random().toString(36).substr(2, 9)}`
        const fieldsHTML = content.forms.map(field => this.generateFieldHTML(field, formId)).join('\n')
        const hiddenForm = `<form hidden id="${formId}"></form>`

        return hiddenForm + markdownHTML + fieldsHTML
    }

    generateStandaloneFieldHTML(field: Field, defaultFormId?: string): string {
        if (field.inline) {
            return this.generateInlineFieldHTML(field, defaultFormId)
        }
        
        // Always wrap fields in proper structure for accessibility
        const fieldHTML = this.generateFieldHTML(field, defaultFormId)
        
        // If the field HTML already contains proper form structure, return as is
        if (fieldHTML.includes('<div class="formdown-field"') || fieldHTML.includes('<div class="formdown-field formdown-conditional"')) {
            return `
<div class="formdown-field-container">
${fieldHTML}
</div>`
        }
        
        // Buttons (submit, reset, button) don't need labels - they are self-labeling
        if (['submit', 'reset', 'button'].includes(field.type)) {
            return `
<div class="formdown-field-container">
${fieldHTML}
</div>`
        }
        
        // For input fields, wrap in proper label structure
        const fieldId = this.generateUniqueId(field.name, defaultFormId)
        const displayLabel = field.label || this.generateSmartLabel(field.name)
        const formId = this.determineFormId(field, defaultFormId)
        const requiredMark = field.required ? ' *' : ''
        
        return `
<div class="formdown-field-container">
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${requiredMark}</label>
    ${fieldHTML.replace(/id="[^"]*"/, `id="${fieldId}"`).replace(/form="[^"]*"/, formId ? `form="${formId}"` : '')}
</div>
</div>`
    }

    generateInlineFieldHTML(field: Field, defaultFormId?: string): string {
        const { name, type, required, placeholder, attributes } = field
        const displayLabel = field.label || this.generateSmartLabel(name)

        // Form attribute auto-connection logic
        const formId = this.determineFormId(field, defaultFormId)

        // For inline fields, use contenteditable spans
        const commonAttrs = {
            'data-field-name': name,
            'data-field-type': type,
            'data-placeholder': placeholder || displayLabel,
            'class': 'formdown-inline-field',
            'contenteditable': 'true',
            'role': 'textbox',
            ...(required && { 'data-required': 'true' }),
            ...(formId && { 'data-form': formId }),
            ...(attributes && attributes)
        }

        const attrString = Object.entries(commonAttrs)
            .map(([key, value]) => {
                if (typeof value === 'boolean') {
                    return value ? key : ''
                }
                return `${key}="${value}"`
            })
            .filter(Boolean)
            .join(' ')

        return `<span ${attrString}>${displayLabel}</span>`
    }

    generateFieldHTML(field: Field, defaultFormId?: string): string {
        const { name, type, label, required, placeholder, attributes, options, description, errorMessage, pattern, format, allowOther, content, value } = field

        // Try to generate HTML using registered field type extensions first
        const context: HookContext = {
            field,
            metadata: { formId: defaultFormId }
        }

        const extensionHTML = defaultExtensionManager.getFieldTypeRegistry().generateFieldHTML(field, context)
        if (extensionHTML) {
            return extensionHTML
        }

        // Fall back to built-in field type generation

        // Use smart label generation if no label is provided
        const displayLabel = label || this.generateSmartLabel(name)
        
        // For checkboxes, use content with priority: content > label > smart_label(name)
        const checkboxDisplayText = type === 'checkbox' ? 
            (content || label || this.generateSmartLabel(name)) : 
            displayLabel

        // Generate unique IDs for accessibility
        const fieldId = this.generateUniqueId(name, defaultFormId)
        const descriptionId = description ? `${fieldId}-description` : undefined
        const errorId = errorMessage ? `${fieldId}-error` : undefined

        // Form attribute auto-connection logic
        const formId = this.determineFormId(field, defaultFormId)

        // Add intelligent autocomplete attributes
        const autoCompleteMapping: Record<string, string> = {
            'name': 'name',
            'first_name': 'given-name',
            'last_name': 'family-name', 
            'email': 'email',
            'phone': 'tel',
            'phone_number': 'tel',
            'password': 'current-password',
            'new_password': 'new-password',
            'confirm_password': 'new-password',
            'username': 'username',
            'company': 'organization',
            'address': 'street-address',
            'city': 'address-level2',
            'state': 'address-level1',
            'zip': 'postal-code',
            'country': 'country',
            'birth_date': 'bday',
            'birthday': 'bday'
        }
        
        const suggestedAutocomplete = autoCompleteMapping[name.toLowerCase()] || 
                                     (type === 'email' ? 'email' : 
                                      type === 'tel' ? 'tel' : 
                                      type === 'password' ? 'current-password' : undefined)

        // Filter out layout-specific attributes that shouldn't be on the input element
        const layoutOnlyAttrs = new Set(['width', 'span'])
        const filteredAttributes = attributes ? Object.fromEntries(
            Object.entries(attributes).filter(([key]) =>
                !layoutOnlyAttrs.has(key) && !key.startsWith('--')
            )
        ) : {}

        const commonAttrs = {
            id: fieldId,
            name,
            ...(required && { required: true }),
            ...(placeholder && { placeholder }),
            ...(pattern && { pattern }),
            ...(format && { format }),
            ...(value !== undefined && value !== null && !['textarea', 'select', 'radio', 'checkbox', 'range', 'file'].includes(type) && { value }),
            ...(description && { 'aria-describedby': descriptionId }),
            ...(errorMessage && { 'aria-describedby': `${descriptionId ? descriptionId + ' ' : ''}${errorId}` }),
            ...(formId && { form: formId }),
            ...(suggestedAutocomplete && !attributes?.autocomplete && { autocomplete: suggestedAutocomplete }),
            ...filteredAttributes
        }

        const attrString = Object.entries(commonAttrs)
            .map(([key, value]) => {
                if (typeof value === 'boolean') {
                    return value ? key : ''
                }
                return `${key}="${value}"`
            })
            .filter(Boolean)
            .join(' ')

        // Helper function to generate description and error HTML
        const generateHelpText = () => {
            let helpHTML = ''
            if (description) {
                helpHTML += `\n    <div id="${descriptionId}" class="formdown-field-description">${description}</div>`
            }
            if (errorMessage) {
                helpHTML += `\n    <div id="${errorId}" class="formdown-field-error" role="alert">${errorMessage}</div>`
            }
            return helpHTML
        }

        // Helper function to generate conditional field wrapper attributes
        const generateFieldWrapperAttrs = () => {
            const classes = ['formdown-field']
            const dataAttrs: string[] = []

            if (field.conditions) {
                classes.push('formdown-conditional')

                if (field.conditions.visibleIf) {
                    const cond = field.conditions.visibleIf
                    dataAttrs.push(`data-visible-if-field="${this.escapeHtml(cond.field)}"`)
                    dataAttrs.push(`data-visible-if-operator="${cond.operator}"`)
                    if (cond.value !== undefined) {
                        dataAttrs.push(`data-visible-if-value="${this.escapeHtml(cond.value)}"`)
                    }
                }

                if (field.conditions.hiddenIf) {
                    const cond = field.conditions.hiddenIf
                    dataAttrs.push(`data-hidden-if-field="${this.escapeHtml(cond.field)}"`)
                    dataAttrs.push(`data-hidden-if-operator="${cond.operator}"`)
                    if (cond.value !== undefined) {
                        dataAttrs.push(`data-hidden-if-value="${this.escapeHtml(cond.value)}"`)
                    }
                }

                if (field.conditions.enabledIf) {
                    const cond = field.conditions.enabledIf
                    dataAttrs.push(`data-enabled-if-field="${this.escapeHtml(cond.field)}"`)
                    dataAttrs.push(`data-enabled-if-operator="${cond.operator}"`)
                    if (cond.value !== undefined) {
                        dataAttrs.push(`data-enabled-if-value="${this.escapeHtml(cond.value)}"`)
                    }
                }

                if (field.conditions.disabledIf) {
                    const cond = field.conditions.disabledIf
                    dataAttrs.push(`data-disabled-if-field="${this.escapeHtml(cond.field)}"`)
                    dataAttrs.push(`data-disabled-if-operator="${cond.operator}"`)
                    if (cond.value !== undefined) {
                        dataAttrs.push(`data-disabled-if-value="${this.escapeHtml(cond.value)}"`)
                    }
                }

                if (field.conditions.requiredIf) {
                    const cond = field.conditions.requiredIf
                    dataAttrs.push(`data-required-if-field="${this.escapeHtml(cond.field)}"`)
                    dataAttrs.push(`data-required-if-operator="${cond.operator}"`)
                    if (cond.value !== undefined) {
                        dataAttrs.push(`data-required-if-value="${this.escapeHtml(cond.value)}"`)
                    }
                }
            }

            // Add group attribute if field belongs to a group
            if (field.group) {
                dataAttrs.push(`data-group="${this.escapeHtml(field.group)}"`)
            }

            // Handle field-level layout attributes (width, span, etc.)
            const styleProps: string[] = []
            if (field.attributes) {
                if (field.attributes.width !== undefined) {
                    styleProps.push(`width: ${this.escapeHtml(String(field.attributes.width))}`)
                }
                if (field.attributes.span !== undefined) {
                    styleProps.push(`grid-column: span ${this.escapeHtml(String(field.attributes.span))}`)
                }
                // Support custom CSS properties on fields
                Object.entries(field.attributes).forEach(([key, value]) => {
                    if (key.startsWith('--')) {
                        styleProps.push(`${key}: ${this.escapeHtml(String(value))}`)
                    }
                })
            }

            const classAttr = `class="${classes.join(' ')}"`
            const styleAttr = styleProps.length > 0 ? ` style="${styleProps.join('; ')}"` : ''
            const dataAttrStr = dataAttrs.length > 0 ? ` ${dataAttrs.join(' ')}` : ''
            return `${classAttr}${styleAttr}${dataAttrStr}`
        }

        const fieldWrapperAttrs = generateFieldWrapperAttrs()

        switch (type) {
            case 'textarea':
                const textareaContent = value ? this.escapeHtml(String(value)) : ''
                return `
<div ${fieldWrapperAttrs} part="field">
    <label for="${fieldId}" part="label">${displayLabel}${required ? ' *' : ''}</label>
    <textarea ${attrString} part="input textarea-input">${textareaContent}</textarea>${generateHelpText()}
</div>`

            case 'select':
                const optionsHTML = options?.map(opt => {
                    const isSelected = value && String(value) === opt ? ' selected' : ''
                    const escapedOpt = this.escapeHtml(opt)
                    return `<option value="${escapedOpt}"${isSelected}>${escapedOpt}</option>`
                }).join('\n') || ''
                const otherOptionHTML = allowOther ? `\n        <option value="">${this.escapeHtml(field.otherLabel || 'Other')} (please specify)</option>` : ''
                const otherInputHTML = allowOther ? `\n    <input type="text" id="${fieldId}_other" placeholder="Please specify..." class="formdown-other-input" data-formdown-other-for="${fieldId}">` : ''

                return `
<div ${fieldWrapperAttrs} part="field">
    <label for="${fieldId}" part="label">${displayLabel}${required ? ' *' : ''}</label>
    <select ${attrString} part="input select-input"${allowOther ? ` data-formdown-has-other="true" data-formdown-other-target="${fieldId}_other"` : ''}>
        ${optionsHTML}${otherOptionHTML}
    </select>${otherInputHTML}${generateHelpText()}
</div>`

            case 'radio':
                if (!options || options.length === 0) {
                    // Radio needs options - fallback to text input
                    return `
<div ${fieldWrapperAttrs}>
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="text" ${attrString}>${generateHelpText()}
</div>`
                }

                const radioInputsHTML = options.map((opt, index) => {
                    const inputId = this.generateUniqueId(`${name}_${index}`, defaultFormId)
                    const isRequired = required && index === 0
                    const isChecked = value && String(value) === opt
                    const hideOtherAttr = allowOther ? ' data-formdown-hides-other="true"' : ''
                    const requiredAttr = isRequired ? ' required' : ''
                    const checkedAttr = isChecked ? ' checked' : ''
                    const ariaAttr = descriptionId ? ` aria-describedby="${descriptionId}"` : ''
                    const escapedOpt = this.escapeHtml(opt)
                    return `
        <label for="${inputId}" class="formdown-option-label">
            <input type="radio" id="${inputId}" name="${name}" value="${escapedOpt}"${requiredAttr}${checkedAttr}${ariaAttr}${hideOtherAttr}>
            <span>${escapedOpt}</span>
        </label>`
                }).join('\n')

                const otherRadioId = this.generateUniqueId(`${name}_other_radio`, defaultFormId)
                const otherRadioHTML = allowOther ? `
        <label for="${otherRadioId}" class="formdown-option-label">
            <input type="radio" id="${otherRadioId}" name="${name}" value="" ${descriptionId ? `aria-describedby="${descriptionId}"` : ''} data-formdown-other-radio="true">
            <span>${this.escapeHtml(field.otherLabel || 'Other')}:</span>
            <input type="text" placeholder="Please specify..." class="formdown-other-input" data-formdown-other-for="${name}">
        </label>` : ''

                const isVertical = attributes?.layout === 'vertical'
                const groupClass = isVertical ? 'radio-group vertical' : 'radio-group inline'

                return `
<div ${fieldWrapperAttrs} part="field">
    <fieldset ${descriptionId ? `aria-describedby="${descriptionId}"` : ''} part="fieldset">
        <legend part="legend">${displayLabel}${required ? ' *' : ''}</legend>
        <div class="${groupClass}" role="radiogroup" part="radio-group">
${radioInputsHTML}${otherRadioHTML}
        </div>
    </fieldset>${generateHelpText()}
</div>`

            case 'checkbox':
                if (!options || options.length === 0) {
                    // Single checkbox - use content with priority: content > label > smart_label(name)
                    // Handle boolean value for single checkbox
                    const isChecked = value && (value === true || value === 'true' || String(value).toLowerCase() === 'true')
                    
                    // Create checkbox-specific attributes (excluding duplicates)
                    const checkboxAttrs: any = { ...commonAttrs }
                    delete checkboxAttrs.id  // We'll add manually to avoid duplication
                    delete checkboxAttrs.name  // We'll add manually to avoid duplication
                    delete checkboxAttrs.form  // We'll add manually to avoid duplication
                    
                    const checkboxAttrString = Object.entries(checkboxAttrs)
                        .map(([key, value]) => {
                            if (typeof value === 'boolean') {
                                return value ? key : ''
                            }
                            return `${key}="${value}"`
                        })
                        .filter(Boolean)
                        .join(' ')
                    
                    const requiredAttr = required ? ' required' : ''
                    const checkedAttr = isChecked ? ' checked' : ''
                    const formAttr = formId ? ` form="${formId}"` : ''
                    
                    return `
<div ${fieldWrapperAttrs} part="field">
    <label for="${fieldId}" class="formdown-checkbox-label" part="label checkbox-label">
        <input type="checkbox" id="${fieldId}" name="${name}" value="true"${requiredAttr}${checkedAttr}${formAttr} ${checkboxAttrString} part="input checkbox-input">
        <span>${this.escapeHtml(checkboxDisplayText)}${required ? ' *' : ''}</span>
    </label>${generateHelpText()}
</div>`
                } else {
                    // Checkbox group - handle comma-separated values
                    const selectedValues = value ? String(value).split(',').map(v => v.trim()) : []
                    const checkboxInputsHTML = options.map((opt, index) => {
                        const inputId = this.generateUniqueId(`${name}_${index}`, defaultFormId)
                        const isRequired = required && index === 0
                        const isChecked = selectedValues.includes(opt)
                        const requiredAttr = isRequired ? ' required' : ''
                        const checkedAttr = isChecked ? ' checked' : ''
                        const ariaAttr = descriptionId ? ` aria-describedby="${descriptionId}"` : ''
                        const escapedOpt = this.escapeHtml(opt)
                        return `
        <label for="${inputId}" class="formdown-option-label">
            <input type="checkbox" id="${inputId}" name="${name}" value="${escapedOpt}"${requiredAttr}${checkedAttr}${ariaAttr}>
            <span>${escapedOpt}</span>
        </label>`
                    }).join('\n')
                    
                    const otherCheckboxId = this.generateUniqueId(`${name}_other_checkbox`, defaultFormId)
                    const otherCheckboxHTML = allowOther ? `
        <label for="${otherCheckboxId}" class="formdown-option-label">
            <input type="checkbox" id="${otherCheckboxId}" name="${name}" value="" ${descriptionId ? `aria-describedby="${descriptionId}"` : ''} data-formdown-other-checkbox="true">
            <span>${this.escapeHtml(field.otherLabel || 'Other')}:</span>
            <input type="text" placeholder="Please specify..." class="formdown-other-input" data-formdown-other-for="${name}">
        </label>` : ''

                    const isVertical = attributes?.layout === 'vertical'
                    const groupClass = isVertical ? 'checkbox-group vertical' : 'checkbox-group inline'

                    return `
<div ${fieldWrapperAttrs} part="field">
    <fieldset ${descriptionId ? `aria-describedby="${descriptionId}"` : ''} part="fieldset">
        <legend part="legend">${displayLabel}${required ? ' *' : ''}</legend>
        <div class="${groupClass}" role="group" part="checkbox-group">
${checkboxInputsHTML}${otherCheckboxHTML}
        </div>
    </fieldset>${generateHelpText()}
</div>`
                }

            // Extended HTML5 input types
            case 'range':
                const min = Number(attributes?.min) || 0
                const max = Number(attributes?.max) || 100
                const step = Number(attributes?.step) || 1
                const rangeValue = value !== undefined ? value : (attributes?.value !== undefined ? Number(attributes.value) : Math.floor((min + max) / 2))
                return `
<div ${fieldWrapperAttrs} part="field">
    <label for="${fieldId}" part="label">${displayLabel}${required ? ' *' : ''}</label>
    <input type="range" ${attrString} value="${rangeValue}" part="input range-input">
    <output for="${fieldId}" class="formdown-range-output" part="range-output">${rangeValue}</output>${generateHelpText()}
</div>`

            case 'file':
                return `
<div ${fieldWrapperAttrs} part="field">
    <label for="${fieldId}" part="label">${displayLabel}${required ? ' *' : ''}</label>
    <input type="file" ${attrString} part="input file-input">${generateHelpText()}
</div>`

            case 'color':
                return `
<div ${fieldWrapperAttrs} part="field">
    <label for="${fieldId}" part="label">${displayLabel}${required ? ' *' : ''}</label>
    <input type="color" ${attrString} part="input color-input">${generateHelpText()}
</div>`

            case 'week':
                return `
<div ${fieldWrapperAttrs} part="field">
    <label for="${fieldId}" part="label">${displayLabel}${required ? ' *' : ''}</label>
    <input type="week" ${attrString} part="input week-input">${generateHelpText()}
</div>`

            case 'month':
                return `
<div ${fieldWrapperAttrs} part="field">
    <label for="${fieldId}" part="label">${displayLabel}${required ? ' *' : ''}</label>
    <input type="month" ${attrString} part="input month-input">${generateHelpText()}
</div>`

            case 'submit':
                const submitFormAttr = formId ? ` form="${formId}"` : ''
                const submitButtonAttrs = Object.entries(attributes || {})
                    .filter(([key]) => !['form'].includes(key)) // exclude form attr as it's handled separately
                    .map(([key, value]) => {
                        if (typeof value === 'boolean') {
                            return value ? key : ''
                        }
                        return `${key}="${value}"`
                    })
                    .filter(Boolean)
                    .join(' ')
                const submitAttrString = submitButtonAttrs ? ` ${submitButtonAttrs}` : ''
                return `<button type="submit" id="${fieldId}"${submitFormAttr}${submitAttrString} part="button submit-button">${field.label || 'Submit'}</button>`

            case 'reset':
                const resetFormAttr = formId ? ` form="${formId}"` : ''
                const resetButtonAttrs = Object.entries(attributes || {})
                    .filter(([key]) => !['form'].includes(key))
                    .map(([key, value]) => {
                        if (typeof value === 'boolean') {
                            return value ? key : ''
                        }
                        return `${key}="${value}"`
                    })
                    .filter(Boolean)
                    .join(' ')
                const resetAttrString = resetButtonAttrs ? ` ${resetButtonAttrs}` : ''
                return `<button type="reset" id="${fieldId}"${resetFormAttr}${resetAttrString} part="button reset-button">${field.label || 'Reset'}</button>`

            case 'button':
                // Handle action elements created with @[button "Label"] syntax
                const buttonType = attributes?.type || 'button'
                const buttonFormAttr = formId ? ` form="${formId}"` : ''
                const buttonAttrs = Object.entries(attributes || {})
                    .filter(([key]) => !['form', 'type'].includes(key))
                    .map(([key, value]) => {
                        if (typeof value === 'boolean') {
                            return value ? key : ''
                        }
                        return `${key}="${value}"`
                    })
                    .filter(Boolean)
                    .join(' ')
                const buttonAttrString = buttonAttrs ? ` ${buttonAttrs}` : ''
                return `<button type="${buttonType}" id="${fieldId}"${buttonFormAttr}${buttonAttrString} part="button">${field.label || 'Button'}</button>`

            case 'image':
                // Handle image input type @[image "alt text" src="/path"]
                const imageSrc = attributes?.src || ''
                const imageAlt = attributes?.alt || field.label || 'Submit'
                const imageFormAttr = formId ? ` form="${formId}"` : ''
                const imageAttrs = Object.entries(attributes || {})
                    .filter(([key]) => !['form', 'src', 'alt', 'type'].includes(key))
                    .map(([key, value]) => {
                        if (typeof value === 'boolean') {
                            return value ? key : ''
                        }
                        return `${key}="${value}"`
                    })
                    .filter(Boolean)
                    .join(' ')
                const imageAttrString = imageAttrs ? ` ${imageAttrs}` : ''
                return `<input type="image" id="${fieldId}" src="${imageSrc}" alt="${imageAlt}"${imageFormAttr}${imageAttrString}>`

            default:
                return `
<div ${fieldWrapperAttrs} part="field">
    <label for="${fieldId}" part="label">${displayLabel}${required ? ' *' : ''}</label>
    <input type="${type}" ${attrString} part="input text-input">${generateHelpText()}
</div>`
        }
    }

    private generateHiddenFormsHTML(formDeclarations: FormDeclaration[]): string {
        if (formDeclarations.length === 0) {
            return ''
        }

        return formDeclarations.map(form => this.generateHiddenFormHTML(form)).join('')
    }

    private generateHiddenFormHTML(form: FormDeclaration): string {
        const layoutAttrs: string[] = []
        const styleProps: string[] = []
        const otherAttrs: string[] = []

        // Process form attributes
        Object.entries(form.attributes).forEach(([key, value]) => {
            if (typeof value === 'boolean') {
                if (value) otherAttrs.push(key)
                return
            }

            // Handle layout-specific attributes
            if (key === 'layout') {
                layoutAttrs.push(`data-layout="${this.escapeHtml(String(value))}"`)
            } else if (key === 'label-width') {
                styleProps.push(`--formdown-label-width: ${this.escapeHtml(String(value))}`)
            } else if (key === 'columns') {
                styleProps.push(`--formdown-columns: ${this.escapeHtml(String(value))}`)
            } else if (key === 'gap') {
                styleProps.push(`--formdown-gap: ${this.escapeHtml(String(value))}`)
            } else if (key.startsWith('--')) {
                // Allow custom CSS properties
                styleProps.push(`${key}: ${this.escapeHtml(String(value))}`)
            } else {
                otherAttrs.push(`${key}="${this.escapeHtml(String(value))}"`)
            }
        })

        // Build attribute string
        const allAttrs = [...layoutAttrs, ...otherAttrs]
        if (styleProps.length > 0) {
            allAttrs.push(`style="${styleProps.join('; ')}"`)
        }

        const attrString = allAttrs.filter(Boolean).join(' ')
        return `<form hidden id="${form.id}" ${attrString}></form>\n`
    }

    /**
     * Generate HTML for all datalist elements
     * @param datalistDeclarations - Array of datalist declarations
     * @returns HTML string for all datalist elements
     */
    private generateDatalistHTML(datalistDeclarations: DatalistDeclaration[]): string {
        if (datalistDeclarations.length === 0) {
            return ''
        }

        return datalistDeclarations.map(datalist => this.generateSingleDatalistHTML(datalist)).join('')
    }

    /**
     * Generate HTML for a single datalist element
     * @param datalist - Datalist declaration
     * @returns HTML string for the datalist element
     */
    private generateSingleDatalistHTML(datalist: DatalistDeclaration): string {
        const optionsHTML = datalist.options
            .map(option => `<option value="${this.escapeHtml(option)}">${this.escapeHtml(option)}</option>`)
            .join('')

        return `<datalist id="${datalist.id}">${optionsHTML}</datalist>\n`
    }

    /**
     * Generate unique ID for form fields to prevent duplicates
     */
    private generateUniqueId(baseName: string, formId?: string): string {
        // Try the base name first
        let candidateId = baseName
        
        // If it's already used, add form prefix
        if (this.usedIds.has(candidateId) && formId) {
            const formPrefix = formId.replace(/^formdown-form-/, '').replace(/-/g, '_')
            candidateId = `${formPrefix}_${baseName}`
        }
        
        // If still conflicts, add counter
        if (this.usedIds.has(candidateId)) {
            candidateId = `${baseName}_${++this.fieldCounter}`
        }
        
        // Keep adding counter until unique
        while (this.usedIds.has(candidateId)) {
            candidateId = `${baseName}_${++this.fieldCounter}`
        }
        
        this.usedIds.add(candidateId)
        return candidateId
    }
}
