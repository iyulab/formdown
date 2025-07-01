import { Field, FormdownContent } from './types'

export class FormdownGenerator {
    generateHTML(content: FormdownContent): string {
        // For now, just generate form HTML until marked is installed
        return this.generateFormHTML(content.forms)
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
    <div class="formdown-option">
        <input type="${type}" id="${inputId}" name="${name}" value="${opt}" ${required && index === 0 ? 'required' : ''}>
        <label for="${inputId}">${opt}</label>
    </div>`
                }).join('\n') || ''

                return `
<div class="formdown-field">
    <fieldset>
        <legend>${label}${required ? ' *' : ''}</legend>
        ${inputsHTML}
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
