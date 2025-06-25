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
            return this.processFieldPlaceholders(markdownHTML, content.forms)
        } else {
            // If marked returns a Promise, we need to handle it differently
            // For now, fallback to the old method
            return this.generateLegacyHTML(content)
        }
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
        return `
<form class="formdown-form">
${this.generateFieldHTML(field)}
</form>`
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
        const { name, type, label, required, placeholder, attributes, options } = field

        // Use smart label generation if no label is provided
        const displayLabel = label || this.generateSmartLabel(name)

        const commonAttrs = {
            id: name,
            name,
            ...(required && { required: true }),
            ...(placeholder && { placeholder }),
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

        switch (type) {
            case 'textarea':
                return `
<div class="formdown-field">
    <label for="${name}">${displayLabel}${required ? ' *' : ''}</label>
    <textarea ${attrString}></textarea>
</div>`

            case 'select':
                const optionsHTML = options?.map(opt => `<option value="${opt}">${opt}</option>`).join('\n') || ''
                return `
<div class="formdown-field">
    <label for="${name}">${displayLabel}${required ? ' *' : ''}</label>
    <select ${attrString}>
        ${optionsHTML}
    </select>
</div>`

            case 'radio':
                if (!options || options.length === 0) {
                    // Radio needs options - fallback to text input
                    return `
<div class="formdown-field">
    <label for="${name}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="text" ${attrString}>
</div>`
                }

                const radioInputsHTML = options.map((opt, index) => {
                    const inputId = `${name}_${index}`
                    return `
        <label for="${inputId}" class="formdown-option-label">
            <input type="radio" id="${inputId}" name="${name}" value="${opt}" ${required && index === 0 ? 'required' : ''}>
            <span>${opt}</span>
        </label>`
                }).join('\n')

                const isVertical = attributes?.layout === 'vertical'
                const groupClass = isVertical ? 'radio-group vertical' : 'radio-group inline'

                return `
<div class="formdown-field">
    <fieldset>
        <legend>${displayLabel}${required ? ' *' : ''}</legend>
        <div class="${groupClass}">
${radioInputsHTML}
        </div>
    </fieldset>
</div>`

            case 'checkbox':
                if (!options || options.length === 0) {
                    // Single checkbox
                    return `
<div class="formdown-field">
    <label for="${name}" class="formdown-checkbox-label">
        <input type="checkbox" id="${name}" name="${name}" value="true" ${required ? 'required' : ''} ${attrString}>
        <span>${displayLabel}${required ? ' *' : ''}</span>
    </label>
</div>`
                } else {
                    // Checkbox group
                    const checkboxInputsHTML = options.map((opt, index) => {
                        const inputId = `${name}_${index}`
                        return `
        <label for="${inputId}" class="formdown-option-label">
            <input type="checkbox" id="${inputId}" name="${name}" value="${opt}" ${required && index === 0 ? 'required' : ''}>
            <span>${opt}</span>
        </label>`
                    }).join('\n')

                    const isVertical = attributes?.layout === 'vertical'
                    const groupClass = isVertical ? 'checkbox-group vertical' : 'checkbox-group inline'

                    return `
<div class="formdown-field">
    <fieldset>
        <legend>${displayLabel}${required ? ' *' : ''}</legend>
        <div class="${groupClass}">
${checkboxInputsHTML}
        </div>
    </fieldset>
</div>`
                }

            default:
                return `
<div class="formdown-field">
    <label for="${name}">${displayLabel}${required ? ' *' : ''}</label>
    <input type="${type}" ${attrString}>
</div>`
        }
    }
}
