import { marked } from 'marked'
import { Field, FormdownContent } from './types'

export class FormdownGenerator {
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

    generateHTML(content: FormdownContent): string {
        const markdownHTML = content.markdown ? marked(content.markdown) : ''

        // Handle both sync and async marked results
        if (typeof markdownHTML === 'string') {
            return this.processContent(markdownHTML, content.forms)
        } else {
            // If marked returns a Promise, we need to handle it differently
            // For now, fallback to the old method
            return this.generateLegacyHTML(content)
        }
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

        // Process block fields - group them into a single form
        if (blockFields.length > 0) {
            const formHTML = this.generateSingleFormHTML(blockFields)
            
            // Replace first block field placeholder with complete form
            const firstBlockFieldIndex = fields.findIndex(f => !f.inline)
            if (firstBlockFieldIndex !== -1) {
                const firstPlaceholder = `<!--FORMDOWN_FIELD_${firstBlockFieldIndex}-->`
                result = result.replace(new RegExp(firstPlaceholder, 'g'), formHTML)
                
                // Remove remaining block field placeholders
                blockFields.slice(1).forEach(field => {
                    const fieldIndex = fields.indexOf(field)
                    const placeholder = `<!--FORMDOWN_FIELD_${fieldIndex}-->`
                    result = result.replace(new RegExp(placeholder, 'g'), '')
                })
            } else {
                // No placeholders found, append form at the end
                result += '\n' + formHTML
            }
        }

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
        const formHTML = this.generateFormHTML(content.forms)
        return markdownHTML + formHTML
    }

    generateStandaloneFieldHTML(field: Field): string {
        if (field.inline) {
            return this.generateInlineFieldHTML(field)
        }
        return `
<form class="formdown-form">
${this.generateFieldHTML(field)}
</form>`
    }

    generateSingleFormHTML(fields: Field[]): string {
        if (fields.length === 0) return ''

        const fieldsHTML = fields.map(field => this.generateFieldHTML(field)).join('\n')

        return `
<form class="formdown-form" role="form">
${fieldsHTML}
</form>`
    }

    generateInlineFieldHTML(field: Field): string {
        const { name, type, required, placeholder, attributes } = field
        const displayLabel = field.label || this.generateSmartLabel(name)

        // For inline fields, use contenteditable spans
        const commonAttrs = {
            'data-field-name': name,
            'data-field-type': type,
            'data-placeholder': placeholder || displayLabel,
            'class': 'formdown-inline-field',
            'contenteditable': 'true',
            'role': 'textbox',
            ...(required && { 'data-required': 'true' }),
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

    generateFormHTML(fields: Field[]): string {
        if (fields.length === 0) return ''

        const fieldsHTML = fields.map(field => this.generateFieldHTML(field)).join('\n')

        return `
<form class="formdown-form">
${fieldsHTML}
</form>`
    }

    generateFieldHTML(field: Field): string {
        const { name, type, label, required, placeholder, attributes, options, description, errorMessage, pattern, format } = field

        // Use smart label generation if no label is provided
        const displayLabel = label || this.generateSmartLabel(name)

        // Generate unique IDs for accessibility
        const fieldId = name
        const descriptionId = description ? `${name}-description` : undefined
        const errorId = errorMessage ? `${name}-error` : undefined

        const commonAttrs = {
            id: fieldId,
            name,
            ...(required && { required: true }),
            ...(placeholder && { placeholder }),
            ...(pattern && { pattern }),
            ...(format && { format }),
            ...(description && { 'aria-describedby': descriptionId }),
            ...(errorMessage && { 'aria-describedby': `${descriptionId ? descriptionId + ' ' : ''}${errorId}` }),
            ...attributes
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

        switch (type) {
            case 'textarea':
                return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <textarea ${attrString}></textarea>${generateHelpText()}
</div>`

            case 'select':
                const optionsHTML = options?.map(opt => `<option value="${opt}">${opt}</option>`).join('\n') || ''
                return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <select ${attrString}>
        ${optionsHTML}
    </select>${generateHelpText()}
</div>`

            case 'radio':
                if (!options || options.length === 0) {
                    // Radio needs options - fallback to text input
                    return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="text" ${attrString}>${generateHelpText()}
</div>`
                }

                const radioInputsHTML = options.map((opt, index) => {
                    const inputId = `${name}_${index}`
                    const isRequired = required && index === 0
                    return `
        <label for="${inputId}" class="formdown-option-label">
            <input type="radio" id="${inputId}" name="${name}" value="${opt}" ${isRequired ? 'required' : ''} ${descriptionId ? `aria-describedby="${descriptionId}"` : ''}>
            <span>${opt}</span>
        </label>`
                }).join('\n')

                const isVertical = attributes?.layout === 'vertical'
                const groupClass = isVertical ? 'radio-group vertical' : 'radio-group inline'

                return `
<div class="formdown-field">
    <fieldset ${descriptionId ? `aria-describedby="${descriptionId}"` : ''}>
        <legend>${displayLabel}${required ? ' *' : ''}</legend>
        <div class="${groupClass}" role="radiogroup">
${radioInputsHTML}
        </div>
    </fieldset>${generateHelpText()}
</div>`

            case 'checkbox':
                if (!options || options.length === 0) {
                    // Single checkbox
                    return `
<div class="formdown-field">
    <label for="${fieldId}" class="formdown-checkbox-label">
        <input type="checkbox" id="${fieldId}" name="${name}" value="true" ${required ? 'required' : ''} ${attrString}>
        <span>${displayLabel}${required ? ' *' : ''}</span>
    </label>${generateHelpText()}
</div>`
                } else {
                    // Checkbox group
                    const checkboxInputsHTML = options.map((opt, index) => {
                        const inputId = `${name}_${index}`
                        const isRequired = required && index === 0
                        return `
        <label for="${inputId}" class="formdown-option-label">
            <input type="checkbox" id="${inputId}" name="${name}" value="${opt}" ${isRequired ? 'required' : ''} ${descriptionId ? `aria-describedby="${descriptionId}"` : ''}>
            <span>${opt}</span>
        </label>`
                    }).join('\n')

                    const isVertical = attributes?.layout === 'vertical'
                    const groupClass = isVertical ? 'checkbox-group vertical' : 'checkbox-group inline'

                    return `
<div class="formdown-field">
    <fieldset ${descriptionId ? `aria-describedby="${descriptionId}"` : ''}>
        <legend>${displayLabel}${required ? ' *' : ''}</legend>
        <div class="${groupClass}" role="group">
${checkboxInputsHTML}
        </div>
    </fieldset>${generateHelpText()}
</div>`
                }

            // Extended HTML5 input types
            case 'range':
                const min = attributes?.min || 0
                const max = attributes?.max || 100
                const step = attributes?.step || 1
                const value = attributes?.value || Math.floor((min + max) / 2)
                return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="range" ${attrString} value="${value}">
    <output for="${fieldId}" class="formdown-range-output">${value}</output>${generateHelpText()}
</div>`

            case 'file':
                return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="file" ${attrString}>${generateHelpText()}
</div>`

            case 'color':
                return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="color" ${attrString}>${generateHelpText()}
</div>`

            case 'week':
                return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="week" ${attrString}>${generateHelpText()}
</div>`

            case 'month':
                return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="month" ${attrString}>${generateHelpText()}
</div>`

            default:
                return `
<div class="formdown-field">
    <label for="${fieldId}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="${type}" ${attrString}>${generateHelpText()}
</div>`
        }
    }
}
