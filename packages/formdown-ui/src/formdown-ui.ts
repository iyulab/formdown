import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {
  FormManager,
  DOMBinder,
  type FormDownSchema,
  type ValidationResult
} from '@formdown/core'
import { uiExtensionSupport } from './extension-support'

@customElement('formdown-ui')
export class FormdownUI extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      color: var(--theme-text-primary, #1f2937);
      background: var(--theme-bg-primary, #ffffff);
      max-width: 100%;
      box-sizing: border-box;
      overflow-y: auto;
    }

    * {
      box-sizing: border-box;
    }

    .formdown-form {
      max-width: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      display: none; /* Hidden form for form attribute reference */
    }

    .formdown-field {
      margin-bottom: 1.5rem;
      max-width: 100%;
    }

    /* Add spacing between consecutive field containers */
    .formdown-field-container {
      margin-bottom: 0.75rem;
    }
    
    .formdown-field-container:last-child {
      margin-bottom: 0;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: var(--theme-text-primary, #374151);
      font-size: 0.875rem;
      line-height: 1.25;
    }

    input, textarea, select {
      width: 100%;
      max-width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--theme-border, #d1d5db);
      border-radius: 0.5rem;
      font-size: 1rem;
      font-family: inherit;
      line-height: 1.5;
      transition: all 0.15s ease-in-out;
      background-color: var(--theme-bg-primary, #ffffff);
      color: var(--theme-text-primary, #1f2937);
    }

    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: var(--theme-accent, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background-color: var(--theme-bg-primary, #ffffff);
    }

    input:hover, textarea:hover, select:hover {
      border-color: var(--theme-text-secondary, #9ca3af);
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
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 0.5rem center;
      background-repeat: no-repeat;
      background-size: 1.5em 1.5em;
      padding-right: 2.5rem;
    }

    fieldset {
      border: 1px solid var(--theme-border, #d1d5db);
      border-radius: 0.5rem;
      padding: 1.25rem;
      margin: 0 0 1.5rem 0;
      max-width: 100%;
      background-color: var(--theme-bg-primary, #ffffff);
    }

    legend {
      font-weight: 600;
      color: var(--theme-text-primary, #374151);
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
      background-color: var(--theme-bg-secondary, rgba(239, 246, 255, 0.6));
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
      background-color: var(--theme-bg-secondary, rgba(219, 234, 254, 0.8));
      border-color: var(--theme-border, rgba(147, 197, 253, 0.5));
    }

    [contenteditable="true"]:not(textarea):focus {
      background-color: var(--theme-bg-primary, rgba(255, 255, 255, 0.9));
      border-color: var(--theme-accent, #3b82f6);
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
      color: var(--theme-accent, #1e40af);
    }

    [contenteditable="true"]:not(textarea):empty::before {
      content: attr(data-placeholder);
      color: var(--theme-text-secondary, #94a3b8);
      font-style: italic;
      opacity: 0.7;
    }

    /* Enhanced typography for markdown content */
    h1, h2, h3, h4, h5, h6 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: var(--theme-text-primary, #1f2937);
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
      color: var(--theme-text-secondary, #4b5563);
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
      color: var(--theme-error, #dc2626);
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: block;
    }

    /* Field validation styles */
    .field-error {
      border-color: var(--theme-error, #dc2626) !important;
      box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.1) !important;
    }

    .field-error:focus {
      border-color: var(--theme-error, #dc2626) !important;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
    }

    .validation-error-message {
      color: var(--theme-error, #dc2626);
      font-size: 0.75rem;
      margin-top: 0.25rem;
      display: block;
      font-weight: 500;
    }

    /* Success state */
    .field-valid {
      border-color: #10b981 !important;
      box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1) !important;
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
    }    /* Radio and checkbox groups */
    .radio-group, .checkbox-group {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    /* Inline layout (default) */
    .radio-group.inline, .checkbox-group.inline {
      flex-direction: row;
      align-items: center;
    }

    /* Vertical layout */
    .radio-group.vertical, .checkbox-group.vertical {
      flex-direction: column;
      align-items: flex-start;
    }

    .formdown-option-label {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      font-weight: normal;
      cursor: pointer;
      font-size: 0.875rem;
      white-space: nowrap;
    }

    .formdown-option-label input {
      margin-right: 0.5rem;
      margin-bottom: 0;
    }

    .formdown-option-label span {
      user-select: none;
    }

    /* Legacy support for old structure */
    .radio-group label, .checkbox-group label {
      display: flex;
      align-items: center;
      margin-bottom: 0;
      font-weight: normal;
      cursor: pointer;
    }/* Better spacing for form elements */
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

  // Form ID generation removed - delegated to FormManager

  // Method removed - HTML processing now handled by Core template system

  // Reactive data source - this is the single source of truth
  private _data: Record<string, any> = {}

  @property({ type: Object })
  get data() {
    return this._data
  }

  set data(newData: Record<string, any>) {
    if (this._isUpdatingUI) return // Prevent infinite loops
    
    const oldData = this._data
    // Handle null, undefined, or empty object cases properly
    this._data = (newData !== null && newData !== undefined && typeof newData === 'object')
      ? { ...newData }
      : {}
    this.requestUpdate('data', oldData)
    
    // Sync with FormManager
    if (this.formManager && this._schema && !this._isUpdatingUI) {
      this.formManager.updateData(this._data)
    }
  }

  // Public method to update data programmatically
  updateData(newData: Record<string, any>) {
    this.data = newData
    // Sync with FormManager
    if (this.formManager && this._schema) {
      this.formManager.updateData(newData)
    }
  }

  // Public method to update single field
  updateField(fieldName: string, value: any) {
    this.data = { ...this.data, [fieldName]: value }
    // Sync with FormManager
    if (this.formManager && this._schema) {
      this.formManager.setFieldValue(fieldName, value)
    }
  }
  private formManager: FormManager
  
  // Core modules for delegated functionality
  private domBinder: DOMBinder
  
  private fieldRegistry: Map<string, Set<HTMLElement>> = new Map()
  private _isUpdatingUI = false  // Prevent infinite loops
  private _schema: FormDownSchema | null = null

  constructor() {
    super()
    // Form ID generation delegated to FormManager
    
    // Initialize FormManager
    this.formManager = new FormManager()
    
    // Initialize Core modules through FormManager
    this.domBinder = this.formManager.createDOMBinder()
    
    // Set up component bridge for Core-UI integration
    this.setupCoreUIBridge()
    
    // Set up event forwarding from FormManager to UI
    this.setupFormManagerEvents()
  }

  /**
   * Simplified Core-UI bridge using EventOrchestrator
   */
  private setupCoreUIBridge() {
    this.formManager.setupComponentBridge({
      id: 'formdown-ui',
      type: 'ui' as const,
      emit: (event: string, data?: any) => this.dispatchEvent(new CustomEvent(event, { detail: data, bubbles: true })),
      on: (_event: string, _handler: any) => () => {}
    })
  }

  /**
   * Streamlined event forwarding from FormManager to UI
   */
  private setupFormManagerEvents() {
    // Forward data changes from FormManager to UI data property
    this.formManager.on('data-change', ({ formData }) => {
      if (!this._isUpdatingUI) {
        this._isUpdatingUI = true
        this.data = formData
        this._isUpdatingUI = false
      }
    })

    // Handle validation errors and form submission
    this.formManager.on('validation-error', ({ field, errors }) => {
      this.dispatchEvent(new CustomEvent('validation-error', {
        detail: { field, errors }, bubbles: true
      }))
    })

    this.formManager.on('form-submit', ({ formData }) => {
      this.dispatchEvent(new CustomEvent('form-submit', {
        detail: { formData }, bubbles: true
      }))
    })
  }

  /**
   * Public API methods to expose FormManager functionality
   */
  
  /**
   * Validate the current form data
   */
  validate(): ValidationResult {
    if (!this.formManager || !this._schema) {
      return { isValid: true, errors: [] }
    }
    return this.formManager.validate()
  }

  /**
   * Get form schema
   */
  getSchema(): FormDownSchema | null {
    return this._schema
  }

  /**
   * Reset form to default values
   */
  reset(): void {
    if (this.formManager && this._schema) {
      this.formManager.reset()
      this.data = this.formManager.getData()
    }
  }

  /**
   * Check if form has unsaved changes
   */
  isDirty(): boolean {
    if (!this.formManager || !this._schema) {
      return false
    }
    return this.formManager.isDirty()
  }

  async connectedCallback() {
    super.connectedCallback()

    // Initialize extension system and UI support
    try {
      await uiExtensionSupport.initialize()
    } catch (error) {
      // Extension system might already be initialized
      console.debug('Extension system initialization:', error)
    }

    // Use inner text as content if content property is empty
    if (!this.content && this.textContent?.trim()) {
      this.content = this.textContent.trim()
      // Clear the text content to avoid duplication
      this.textContent = ''
    }
  }

  render() {
    if (!this.content || !this.content.trim()) {
      return html`<div class="error">No Formdown content provided</div>`
    }

    try {
      // Parse content using FormManager
      this.formManager.parse(this.content)
      this._schema = this.formManager.getSchema()
      
      // Sync data with FormManager
      if (this.data && Object.keys(this.data).length > 0) {
        this.formManager.updateData(this.data)
      }
      
      // Use new Core template rendering system
      const template = this.formManager.renderToTemplate({
        container: this
      })

      if (!template.html || !template.html.trim()) {
        return html`<div class="error">Generated HTML is empty</div>`
      }

      return html`<div id="content-container"></div>`
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return html`<div class="error">Error rendering content: ${errorMessage}</div>`
    }
  }  // Override firstUpdated to set innerHTML after the initial render
  override firstUpdated() {
    this.updateContent()
    // Always sync UI (includes both existing data and schema defaults)
    // Use setTimeout to ensure DOM is fully ready
    setTimeout(() => {
      this.syncUIFromData()
    }, 0)
  }
  // Override updated to update content when properties change
  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties)

    if (changedProperties.has('content')) {
      this.updateContent()
      // After updating content and schema, sync UI with new default values
      // Use setTimeout to ensure DOM is fully updated
      setTimeout(() => {
        this.syncUIFromData()
      }, 0)
    }

    // React to data changes - sync UI when data property changes
    if (changedProperties.has('data')) {
      this.syncUIFromData()
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

      // Use Core template rendering system - much simpler!
      this.formManager.parse(this.content)
      this._schema = this.formManager.getSchema()
      
      // Sync existing data with FormManager
      if (this.data && Object.keys(this.data).length > 0) {
        this.formManager.updateData(this.data)
      }
      
      const template = this.formManager.renderToTemplate({
        container: this
      })

      if (!template.html || template.html.trim() === '') {
        container.innerHTML = `<div class="error">FormManager returned empty HTML</div>`
        return
      }

      container.innerHTML = template.html

      // Inject extension styles and scripts
      this.injectExtensionAssets(container)

      // Setup keyboard navigation and field handlers - now delegated to Core
      this.setupFieldHandlers(container)
    } catch (error) {
      const container = this.shadowRoot?.querySelector('#content-container')
      if (container) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        container.innerHTML = `<div class="error">Error: ${errorMessage}</div>`
      }
    }
  }

  /**
   * Simplified extension asset injection
   */
  private injectExtensionAssets(container: Element) {
    try {
      // Get field types used in this form
      const fieldTypes = new Set<string>()
      const fieldsWithType = container.querySelectorAll('[data-field-type]')
      fieldsWithType.forEach(field => {
        const type = field.getAttribute('data-field-type')
        if (type) fieldTypes.add(type)
      })

      // Basic extension support - delegate complex logic to Core later
      if (fieldTypes.size > 0) {
        console.debug('Extension types detected:', Array.from(fieldTypes))
      }
    } catch (error) {
      console.debug('Extension asset injection failed:', error)
    }
  }

  private setupFieldHandlers(container: Element) {
    this.fieldRegistry.clear()

    // Find all form fields
    const allFields = container.querySelectorAll('input, textarea, select, [contenteditable="true"]')
    allFields.forEach(element => {
      const htmlElement = element as HTMLElement
      const fieldName = this.getFieldName(htmlElement)

      if (fieldName) {
        this.registerField(fieldName, htmlElement)
        this.setupFieldEventHandlers(htmlElement, fieldName)
      }
    })

    // Setup keyboard navigation
    const allInputs = container.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), [contenteditable="true"]')
    this.setupBasicKeyboardNavigation(allInputs)
  }

  private setupBasicKeyboardNavigation(inputs: NodeListOf<Element>) {
    inputs.forEach((input, index) => {
      input.addEventListener('keydown', (e) => {
        const keyEvent = e as KeyboardEvent
        if (keyEvent.key === 'Enter' && input.tagName.toLowerCase() !== 'textarea') {
          keyEvent.preventDefault()
          const nextIndex = index + 1
          if (nextIndex < inputs.length) {
            (inputs[nextIndex] as HTMLElement).focus()
          }
        }
      })
    })
  }

  private setupFieldEventHandlers(element: HTMLElement, fieldName: string) {
    const container = {
      querySelector: (selector: string) => this.shadowRoot?.querySelector(selector) as any,
      querySelectorAll: (selector: string) => Array.from(this.shadowRoot?.querySelectorAll(selector) || []) as any[]
    }

    // Delegate all event handling to DOMBinder
    this.domBinder.bindFieldToElement(fieldName, element as any, container)

    // Simple UI event handler for real-time updates
    const handleChange = (event: Event) => {
      this.formManager.handleUIEvent(event, this.domBinder)
      const value = this.getFieldValueFromElement(element)
      this.updateDataReactively(fieldName, value)
    }

    // Attach minimal UI event listeners
    element.addEventListener('input', handleChange)
    element.addEventListener('change', handleChange)
    if (element.hasAttribute('contenteditable')) {
      element.addEventListener('blur', handleChange)
    }
  }

  // Field-specific behaviors delegated to DOMBinder in setupFieldHandlers

  // Simplified reactive data management
  private updateDataReactively(fieldName: string, value: string | string[] | boolean) {
    if (this._isUpdatingUI) return

    // Delegate to FormManager
    this.formManager.setFieldValue(fieldName, value)
    this.data = { ...this.data, [fieldName]: value }
    this.emitFieldEvents(fieldName, value)
  }


  private syncUIFromData() {
    if (this._isUpdatingUI) return

    this._isUpdatingUI = true
    try {
      const container = {
        querySelector: (selector: string) => this.shadowRoot?.querySelector(selector) as any,
        querySelectorAll: (selector: string) => Array.from(this.shadowRoot?.querySelectorAll(selector) || []) as any[]
      }

      // Delegate to DOMBinder
      this.domBinder.syncFormData(this.data, container)
    } finally {
      this._isUpdatingUI = false
    }
  }
  // Element value setting delegated to FieldProcessor via DOMBinder

  // Universal field name extractor
  private getFieldName(element: HTMLElement): string | null {
    // Priority: name > data-field-name > id
    if (element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLSelectElement) {
      return element.name || element.id || null
    }
    return element.dataset.fieldName || element.id || null
  }

  // Simplified field value extraction
  private getFieldValueFromElement(element: HTMLElement): string | string[] | boolean {
    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox') {
        return element.checked
      } else if (element.type === 'radio') {
        return element.value
      }
      return element.value
    } else if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      return element.value
    } else if (element.hasAttribute('contenteditable')) {
      return element.textContent?.trim() || ''
    }
    return ''
  }

  // Test compatibility methods - minimal implementations
  // @ts-ignore - Test compatibility method
  private getElementInitialValue(element: HTMLElement): string | boolean | string[] | null {
    // Simplified version for test compatibility
    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox') {
        return element.hasAttribute('checked') ? true : null
      }
      if (element.type === 'radio') {
        return element.hasAttribute('checked') ? element.value : null
      }
      // Check for value attribute
      const value = element.getAttribute('value')
      return value !== null ? value : null
    } else if (element instanceof HTMLTextAreaElement) {
      const text = element.textContent?.trim()
      return text ? text : null
    } else if (element instanceof HTMLSelectElement) {
      const selected = element.querySelector('option[selected]') as HTMLOptionElement
      return selected ? selected.value : null
    }
    return null
  }

  // Test compatibility method for field value extraction
  // @ts-ignore - Test compatibility method
  private getFieldValue(element: HTMLElement): string | string[] | boolean {
    return this.getFieldValueFromElement(element)
  }

  // Test compatibility method for element value setting
  // @ts-ignore - Test compatibility method
  private setElementValue(element: HTMLElement, value: any): void {
    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox') {
        element.checked = Boolean(value)
      } else {
        element.value = String(value)
      }
    } else if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
      element.value = String(value)
    } else if (element.hasAttribute('contenteditable')) {
      element.textContent = String(value)
    }
  }

  // Register field in the universal registry
  private registerField(fieldName: string, element: HTMLElement) {
    if (!this.fieldRegistry.has(fieldName)) {
      this.fieldRegistry.set(fieldName, new Set())
    }
    this.fieldRegistry.get(fieldName)!.add(element)
  }

  // Emit standardized events
  private emitFieldEvents(fieldName: string, value: string | string[] | boolean) {
    const currentFormData = this.getFormData()

    this.dispatchEvent(new CustomEvent('formdown-change', {
      detail: { fieldName, value, formData: currentFormData },
      bubbles: true
    }))

    this.dispatchEvent(new CustomEvent('formdown-data-update', {
      detail: { formData: currentFormData },
      bubbles: true
    }))
  }

  // Field synchronization - delegated to FormManager
  syncFieldValue(fieldName: string, value: string | string[] | boolean) {
    this.formManager.setFieldValue(fieldName, value)
    this.data = this.formManager.getData()
    this.emitFieldEvents(fieldName, value)
  }

  // Form data methods - delegated to FormManager
  updateFormData(fieldName: string, value: string | string[] | boolean) {
    this.formManager.setFieldValue(fieldName, value)
    this.data = this.formManager.getData()
    this.emitFieldEvents(fieldName, value)
  }

  getFormData() {
    return this.formManager.getData()
  }

  getDefaultValues() {
    return this.formManager.getDefaultValues()
  }

  // Schema default value getter removed - functionality delegated to FormManager




  private clearValidationStates() {
    const container = this.shadowRoot?.querySelector('#content-container')
    if (!container) return

    // Remove validation classes and messages
    container.querySelectorAll('.field-error, .field-valid').forEach(el => {
      el.classList.remove('field-error', 'field-valid')
    })
    container.querySelectorAll('.validation-error-message').forEach(el => el.remove())
  }



  // Reset form method - delegated to FormManager
  resetForm() {
    this.formManager.reset()
    this.data = this.formManager.getData()
    this.clearValidationStates()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'formdown-ui': FormdownUI
  }
}