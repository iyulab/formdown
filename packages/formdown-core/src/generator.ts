import { Field } from './types'

export class FormGenerator {
    generateHTML(fields: Field[], formId?: string): string {
        if (!fields.length) {
            return '<p>No fields to display</p>'
        }

        const formAttrs = formId ? ` id="${formId}"` : ''
        const fieldsHTML = fields.map(field => this.generateFieldHTML(field)).join('\n')

        return `<form${formAttrs}>\n${fieldsHTML}\n</form>`
    }

    private generateFieldHTML(field: Field): string {
        const { name, type, label, required, placeholder, options, attributes } = field
        const requiredAttr = required ? ' required' : ''
        const placeholderAttr = placeholder ? ` placeholder="${this.escapeHtml(placeholder)}"` : ''

        let attrs = ''
        if (attributes) {
            for (const [key, value] of Object.entries(attributes)) {
                attrs += ` ${key}="${this.escapeHtml(String(value))}"`
            }
        }

        switch (type) {
            case 'textarea':
                return `  <div class="field">
    <label for="${name}">${this.escapeHtml(label)}</label>
    <textarea id="${name}" name="${name}"${requiredAttr}${placeholderAttr}${attrs}></textarea>
  </div>`

            case 'radio':
                if (!options?.length) {
                    return `  <div class="field error">Radio field "${name}" requires options</div>`
                }

                const radioOptions = options.map((option: string, index: number) =>
                    `      <label>
        <input type="radio" id="${name}_${index}" name="${name}" value="${this.escapeHtml(option)}"${requiredAttr}${attrs}>
        ${this.escapeHtml(option)}
      </label>`
                ).join('\n')

                return `  <fieldset class="field">
    <legend>${this.escapeHtml(label)}</legend>
${radioOptions}
  </fieldset>`

            case 'checkbox':
                if (!options?.length) {
                    return `  <div class="field error">Checkbox field "${name}" requires options</div>`
                } const checkboxOptions = options.map((option: string, index: number) =>
                    `      <label>
        <input type="checkbox" id="${name}_${index}" name="${name}[]" value="${this.escapeHtml(option)}"${attrs}>
        ${this.escapeHtml(option)}
      </label>`
                ).join('\n')

                return `  <fieldset class="field">
    <legend>${this.escapeHtml(label)}</legend>
${checkboxOptions}
  </fieldset>`

            case 'select':
                if (!options?.length) {
                    return `  <div class="field error">Select field "${name}" requires options</div>`
                } const selectOptions = options.map((option: string) =>
                    `      <option value="${this.escapeHtml(option)}">${this.escapeHtml(option)}</option>`
                ).join('\n')

                return `  <div class="field">
    <label for="${name}">${this.escapeHtml(label)}</label>
    <select id="${name}" name="${name}"${requiredAttr}${attrs}>
      <option value="">Choose an option</option>
${selectOptions}
    </select>
  </div>`

            default:
                // Default to input field
                const allowedTypes = ['email', 'password', 'number', 'date', 'time', 'url', 'tel']
                const inputType = allowedTypes.indexOf(type) !== -1 ? type : 'text'

                return `  <div class="field">
    <label for="${name}">${this.escapeHtml(label)}</label>
    <input type="${inputType}" id="${name}" name="${name}"${requiredAttr}${placeholderAttr}${attrs}>
  </div>`
        }
    }

    private escapeHtml(text: string): string {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
    }
}