import { marked } from 'marked'
import { Field, FormdownContent } from './types'

export class FormdownGenerator {
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
    <label for="${name}">${label}${required ? ' *' : ''}</label>
    <textarea ${attrString}></textarea>
</div>`

            case 'select':
                const optionsHTML = options?.map(opt => `<option value="${opt}">${opt}</option>`).join('\n') || ''
                return `
<div class="formdown-field">
    <label for="${name}">${label}${required ? ' *' : ''}</label>
    <select ${attrString}>
        ${optionsHTML}
    </select>
</div>`

            case 'radio':
            case 'checkbox':
                const inputsHTML = options?.map((opt, index) => {
                    const inputId = `${name}_${index}`
                    return `
        <label for="${inputId}" class="formdown-option-label">
            <input type="${type}" id="${inputId}" name="${name}" value="${opt}" ${required && index === 0 ? 'required' : ''}>
            <span>${opt}</span>
        </label>`
                }).join('\n') || ''

                // Check if vertical layout is requested
                const isVertical = attributes?.layout === 'vertical'
                const groupClass = isVertical ? `${type}-group vertical` : `${type}-group inline`

                return `
<div class="formdown-field">
    <fieldset>
        <legend>${label}${required ? ' *' : ''}</legend>
        <div class="${groupClass}">
${inputsHTML}
        </div>
    </fieldset>
</div>`

            default:
                return `
<div class="formdown-field">
    <label for="${name}">${label}${required ? ' *' : ''}</label>
    <input type="${type}" ${attrString}>
</div>`
        }
    }
}
