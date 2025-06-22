import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { FormdownParser, FormdownGenerator } from '@formdown/core'

@customElement('formdown-ui')
export class FormdownUI extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: #1f2937;
      max-width: 100%;
      box-sizing: border-box;
    }

    * {
      box-sizing: border-box;
    }

    .formdown-form {
      max-width: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
    }

    .formdown-field {
      margin-bottom: 1.5rem;
      max-width: 100%;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
      line-height: 1.25;
    }

    input, textarea, select {
      width: 100%;
      max-width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      line-height: 1.5;
      transition: all 0.15s ease-in-out;
      background-color: #ffffff;
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background-color: #ffffff;
    }

    input:hover, textarea:hover, select:hover {
      border-color: #9ca3af;
    }

    input[type="radio"], input[type="checkbox"] {
      width: auto;
      max-width: none;
      margin-right: 0.5rem;
      margin-bottom: 0;
    }

    textarea {
      min-height: 6rem;
      resize: vertical;
    }

    select {
      cursor: pointer;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
    }

    fieldset {
      border: 1px solid #d1d5db;
      border-radius: 0.5rem;
      padding: 1.25rem;
      margin: 0 0 1.5rem 0;
      max-width: 100%;
    }

    legend {
      font-weight: 600;
      color: #374151;
      padding: 0 0.75rem;
      font-size: 0.875rem;
    }

    fieldset label {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      font-weight: normal;
      font-size: 0.875rem;
    }    /* Enhanced inline formdown-field elements with contentEditable */
    formdown-field,
    [contenteditable="true"]:not(textarea) {
      display: inline;
      min-width: 60px;
      max-width: 200px;
      padding: 0.125rem 0.25rem;
      border: 1px solid transparent;
      background-color: rgba(239, 246, 255, 0.6);
      border-radius: 0.125rem;
      font-style: normal;
      color: inherit;
      font-size: inherit;
      line-height: inherit;
      font-family: inherit;
      font-weight: inherit;
      cursor: text;
      outline: none;
      transition: all 0.15s ease-in-out;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: baseline;
      box-decoration-break: clone;
    }

    [contenteditable="true"]:not(textarea):hover {
      background-color: rgba(219, 234, 254, 0.8);
      border-color: rgba(147, 197, 253, 0.5);
    }

    [contenteditable="true"]:not(textarea):focus {
      background-color: rgba(255, 255, 255, 0.9);
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
      color: #1e40af;
    }

    [contenteditable="true"]:not(textarea):empty::before {
      content: attr(data-placeholder);
      color: #94a3b8;
      font-style: italic;
      opacity: 0.7;
    }

    /* Enhanced typography for markdown content */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #1f2937;
      font-weight: 600;
      line-height: 1.25;
    }

    h1 { 
      font-size: 2.25rem; 
      font-weight: 700;
    }
    h2 { 
      font-size: 1.875rem; 
      font-weight: 600;
    }
    h3 { 
      font-size: 1.5rem; 
      font-weight: 600;
    }
    h4 { 
      font-size: 1.25rem; 
      font-weight: 600;
    }
    h5 { 
      font-size: 1.125rem; 
      font-weight: 600;
    }
    h6 { 
      font-size: 1rem; 
      font-weight: 600;
    }

    p {
      margin-bottom: 1rem;
      line-height: 1.7;
      color: #4b5563;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      :host {
        font-size: 0.875rem;
      }
      
      input, textarea, select {
        padding: 0.625rem;
        font-size: 0.875rem;
      }
      
      h1 { font-size: 1.875rem; }
      h2 { font-size: 1.5rem; }
      h3 { font-size: 1.25rem; }
    }

    .error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: block;
    }

    .submit-button {
      background-color: #3b82f6;
      color: white;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      margin-top: 1.5rem;
      width: auto;
      max-width: 100%;
    }

    .submit-button:hover {
      background-color: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .submit-button:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .submit-button:active {
      transform: translateY(0);
    }

    /* Ensure content doesn't overflow */
    #content-container {
      max-width: 100%;
      overflow-wrap: break-word;
      word-wrap: break-word;
    }

    /* Radio and checkbox groups */
    .radio-group, .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .radio-group label, .checkbox-group label {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      font-weight: normal;
      cursor: pointer;
    }    /* Better spacing for form elements */
    .formdown-form > * + * {
      margin-top: 1rem;
    }
  `
  @property()
  content = ''

  @property({ type: Boolean, attribute: 'select-on-focus' })
  selectOnFocus = true

  @property({ attribute: 'form-id' })
  formId = ''

  @property({ type: Boolean, attribute: 'show-submit-button' })
  showSubmitButton = true

  @property({ attribute: 'submit-text' })
  submitText = 'Submit'
  private parser = new FormdownParser()
  private generator = new FormdownGenerator()
  constructor() {
    super()
  }
  render() {
    if (!this.content || !this.content.trim()) {
      return html`<div class="error">No Formdown content provided</div>`
    }

    try {
      const parseResult = this.parser.parseFormdown(this.content)
      const generatedHTML = this.generator.generateHTML(parseResult)

      if (!generatedHTML || !generatedHTML.trim()) {
        return html`<div class="error">Generated HTML is empty</div>`
      }

      return html`<div id="content-container"></div>`
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return html`<div class="error">Error rendering content: ${errorMessage}</div>`
    }
  }
  // Override firstUpdated to set innerHTML after the initial render
  override firstUpdated() {
    this.updateContent()
  }

  // Override updated to update content when properties change
  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties)
    if (changedProperties.has('content')) {
      this.updateContent()
    }
  }
  private updateContent() {
    if (!this.content || !this.content.trim()) {
      return
    }

    try {
      const container = this.shadowRoot?.querySelector('#content-container')
      if (!container) {
        return
      }

      const parseResult = this.parser.parseFormdown(this.content)
      const generatedHTML = this.generator.generateHTML(parseResult)

      if (!generatedHTML || generatedHTML.trim() === '') {
        container.innerHTML = `<div class="error">Generator returned empty HTML</div>`
        return
      }

      container.innerHTML = generatedHTML

      // Setup keyboard navigation and inline field handlers
      this.setupFieldHandlers(container)
    } catch (error) {
      const container = this.shadowRoot?.querySelector('#content-container')
      if (container) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        container.innerHTML = `<div class="error">Error: ${errorMessage}</div>`
      }
    }
  }
  private setupFieldHandlers(container: Element) {
    // Handle Enter key navigation for all input fields
    const allInputs = container.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), [contenteditable="true"]')

    allInputs.forEach((input, index) => {
      input.addEventListener('keydown', (e) => {
        const keyEvent = e as KeyboardEvent
        if (keyEvent.key === 'Enter') {
          keyEvent.preventDefault()

          // Skip multiline fields (textarea)
          if (input.tagName.toLowerCase() === 'textarea') {
            return
          }

          // Move to next field
          const nextIndex = index + 1
          if (nextIndex < allInputs.length) {
            const nextInput = allInputs[nextIndex] as HTMLElement
            nextInput.focus()
          }
        }
      })
    })

    // Handle contentEditable inline fields
    const inlineFields = container.querySelectorAll('[contenteditable="true"]')
    inlineFields.forEach(field => {
      const htmlField = field as HTMLElement

      // Handle placeholder behavior
      if (htmlField.textContent?.trim() === htmlField.dataset.placeholder) {
        htmlField.textContent = ''
      }      // Focus handler
      htmlField.addEventListener('focus', () => {
        if (htmlField.textContent?.trim() === htmlField.dataset.placeholder) {
          htmlField.textContent = ''
        }

        // Select all text on focus if enabled
        if (this.selectOnFocus) {
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(htmlField)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      })

      // Blur handler
      htmlField.addEventListener('blur', () => {
        if (!htmlField.textContent?.trim()) {
          htmlField.textContent = htmlField.dataset.placeholder || ''
        }
      })

      // Input handler for validation/formatting
      htmlField.addEventListener('input', () => {
        const fieldType = htmlField.dataset.fieldType
        const fieldName = htmlField.dataset.fieldName

        if (fieldType === 'email') {
          // Basic email validation styling
          const email = htmlField.textContent?.trim() || ''
          if (email && !email.includes('@')) {
            htmlField.style.color = '#dc2626'
          } else {
            htmlField.style.color = '#1e40af'
          }
        }

        // Update form data
        if (fieldName) {
          this.updateFormData(fieldName, htmlField.textContent?.trim() || '')
        }
      })
    })
  }

  private updateFormData(fieldName: string, value: string) {
    // Create or update form data for inline fields
    if (!this.formData) {
      this.formData = {}
    }
    this.formData[fieldName] = value

    // Dispatch change event
    this.dispatchEvent(new CustomEvent('formdown-change', {
      detail: { fieldName, value, formData: this.formData }
    }))
  }

  private formData: Record<string, any> = {}
  // Get form data programmatically
  getFormData() {
    const form = this.shadowRoot?.querySelector('form')
    const container = this.shadowRoot?.querySelector('#content-container')
    let formData: Record<string, any> = {}

    // Get traditional form data
    if (form) {
      const fd = new FormData(form)
      formData = Object.fromEntries(fd.entries())
    }

    // Get inline field data
    if (container) {
      const inlineFields = container.querySelectorAll('[contenteditable="true"]')
      inlineFields.forEach(field => {
        const htmlField = field as HTMLElement
        const fieldName = htmlField.dataset.fieldName
        const value = htmlField.textContent?.trim() || ''

        if (fieldName && value !== htmlField.dataset.placeholder) {
          formData[fieldName] = value
        }
      })
    }

    // Merge with internal form data
    return { ...this.formData, ...formData }
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