import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FormdownParser } from '@formdown/core'

@customElement('formdown-ui')
export class FormdownUI extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
    }

    form {
      max-width: 600px;
      margin: 0 auto;
    }

    .field {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 500;
      color: #374151;
    }

    input, textarea, select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 1rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    input[type="radio"], input[type="checkbox"] {
      width: auto;
      margin-right: 0.5rem;
    }

    fieldset {
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      padding: 1rem;
      margin: 0;
    }

    legend {
      font-weight: 500;
      color: #374151;
      padding: 0 0.5rem;
    }

    fieldset label {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      font-weight: normal;
    }

    .error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .submit-button {
      background-color: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;
      margin-top: 1rem;
    }

    .submit-button:hover {
      background-color: #2563eb;
    }

    .submit-button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  `

  @property()
  content = ''

  @property({ attribute: 'form-id' })
  formId = ''

  @property({ type: Boolean, attribute: 'show-submit-button' })
  showSubmitButton = true

  @property({ attribute: 'submit-text' })
  submitText = 'Submit'

  private parser = new FormdownParser()

  private toPascalCase(str: string): string {
    return str
      .split(/[\s_-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  render() {
    console.log('FormdownUI render called with content:', this.content)

    if (!this.content.trim()) {
      console.log('No content provided to FormdownUI')
      return html`<div class="error">No Formdown content provided</div>`
    }

    const parseResult = this.parser.parse(this.content)
    console.log('Parse result:', parseResult)

    if (parseResult.errors.length > 0) {
      console.log('Parse errors:', parseResult.errors)
      return html`
        <div class="error">
          <h3>Parsing Errors:</h3>
          <ul>
            ${parseResult.errors.map((error: any) =>
        html`<li>Line ${error.line}: ${error.message}</li>`
      )}
          </ul>
        </div>
      `
    }

    // Render form fields properly
    return html`
      <form @submit=${this.handleSubmit} @change=${this.handleChange} id="${this.formId}">
        ${parseResult.fields.map((field: any) => this.renderField(field))}
        ${this.showSubmitButton ? html`
          <button type="submit" class="submit-button">${this.submitText}</button>
        ` : ''}
      </form>
    `
  }

  private renderField(field: any) {
    const value = field.defaultValue || ''

    // If label is explicitly provided, use it as-is
    // If no label is provided, convert field name to Pascal Case
    const displayLabel = field.label || this.toPascalCase(field.name)
    const placeholder = field.placeholder || field.description || `Enter ${displayLabel}`

    return html`
      <div class="field">
        <label for="${field.name}">${displayLabel}</label>
        ${this.renderInput(field, value, placeholder)}
      </div>
    `
  }

  private renderInput(field: any, value: string, placeholder: string) {
    const displayLabel = field.label || this.toPascalCase(field.name)

    switch (field.type) {
      case 'textarea':
        return html`
          <textarea
            id="${field.name}"
            name="${field.name}"
            placeholder="${placeholder}"
            ?required=${field.required}
            .value=${value}
          ></textarea>
        `
      case 'select':
        return html`
          <select
            id="${field.name}"
            name="${field.name}"
            ?required=${field.required}
          >
            ${field.options?.map((option: any) => html`
              <option value="${option.value}" ?selected=${option.value === value}>
                ${option.label}
              </option>
            `)}
          </select>
        `
      case 'radio':
        return html`
          <fieldset>
            <legend>${displayLabel}</legend>
            ${field.options?.map((option: any) => html`
              <label>
                <input
                  type="radio"
                  name="${field.name}"
                  value="${option.value}"
                  ?checked=${option.value === value}
                  ?required=${field.required}
                />
                ${option.label}
              </label>
            `)}
          </fieldset>
        `
      case 'checkbox':
        if (field.options) {
          // Multiple checkboxes
          return html`
            <fieldset>
              <legend>${displayLabel}</legend>
              ${field.options.map((option: any) => html`
                <label>
                  <input
                    type="checkbox"
                    name="${field.name}[]"
                    value="${option.value}"
                    ?checked=${Array.isArray(value) ? value.includes(option.value) : false}
                  />
                  ${option.label}
                </label>
              `)}
            </fieldset>
          `
        } else {
          // Single checkbox
          return html`
            <label>
              <input
                type="checkbox"
                id="${field.name}"
                name="${field.name}"
                value="1"
                ?checked=${value === '1' || value === 'true'}
              />
              ${displayLabel}
            </label>
          `
        }
      default:
        return html`
          <input
            type="${field.type || 'text'}"
            id="${field.name}"
            name="${field.name}"
            placeholder="${placeholder}"
            ?required=${field.required}
            .value=${value}
          />
        `
    }
  }

  private handleSubmit(event: Event) {
    event.preventDefault()
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)
    const data: Record<string, any> = Object.fromEntries(formData.entries())

    // Handle checkbox arrays
    const checkboxes = form.querySelectorAll('input[type="checkbox"]')
    checkboxes.forEach(checkbox => {
      const input = checkbox as HTMLInputElement
      if (input.name.endsWith('[]')) {
        const name = input.name.slice(0, -2) // Remove '[]'
        if (!data[name]) {
          data[name] = []
        }
        if (input.checked) {
          if (Array.isArray(data[name])) {
            (data[name] as string[]).push(input.value)
          } else {
            data[name] = [data[name], input.value]
          }
        }
      }
    })

    this.dispatchEvent(new CustomEvent('formSubmit', {
      detail: { data, formData },
      bubbles: true
    }))
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLInputElement
    this.dispatchEvent(new CustomEvent('fieldChange', {
      detail: {
        name: target.name,
        value: target.value,
        type: target.type
      }, bubbles: true
    }))

    // Dispatch formDataChanged event with current form data
    const formData = this.getFormData()
    this.dispatchEvent(new CustomEvent('formDataChanged', {
      detail: formData,
      bubbles: true
    }))
  }

  // Get form data programmatically
  getFormData() {
    const form = this.shadowRoot?.querySelector('form')
    if (!form) return null

    const formData = new FormData(form)
    return Object.fromEntries(formData.entries())
  }

  // Reset form method
  resetForm() {
    const form = this.shadowRoot?.querySelector('form')
    if (form) {
      form.reset()
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'formdown-ui': FormdownUI
  }
}