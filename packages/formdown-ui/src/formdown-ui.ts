import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {
  FormManager,
  DOMBinder,
  type FormDownSchema,
  type ValidationResult
} from '@formdown/core'
import { uiExtensionSupport } from './extension-support'
import { formdownStyles } from './styles'

@customElement('formdown-ui')
export class FormdownUI extends LitElement {
  static styles = formdownStyles
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

    // Focus event handler for select all functionality
    const handleFocus = (event: Event) => {
      const target = event.target as HTMLElement

      // For contenteditable elements (inline fields)
      if (target.hasAttribute('contenteditable')) {
        // Select all text content on focus
        setTimeout(() => {
          const range = document.createRange()
          const selection = window.getSelection()
          if (selection && target.textContent) {
            range.selectNodeContents(target)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        }, 0)
      }

      // For regular input elements (not multiline)
      if (target instanceof HTMLInputElement && target.type !== 'file' && target.type !== 'checkbox' && target.type !== 'radio') {
        setTimeout(() => {
          target.select()
        }, 0)
      }
    }

    // Attach minimal UI event listeners
    element.addEventListener('input', handleChange)
    element.addEventListener('change', handleChange)
    element.addEventListener('focus', handleFocus)
    if (element.hasAttribute('contenteditable')) {
      element.addEventListener('blur', handleChange)
    }
  }

  // Field-specific behaviors delegated to DOMBinder in setupFieldHandlers

  // Simplified reactive data management with test compatibility
  private updateDataReactively(fieldName: string, value: string | string[] | boolean, _sourceElement?: HTMLElement) {
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
    // Test compatibility version - handles both real DOM and mocked elements
    const el = element as any // Allow access to mocked properties

    if (el.tagName === 'INPUT' || element instanceof HTMLInputElement) {
      if (el.type === 'checkbox') {
        return (el.hasAttribute && el.hasAttribute('checked')) || el.checked ? true : null
      }
      if (el.type === 'radio') {
        const hasChecked = (el.hasAttribute && el.hasAttribute('checked')) || el.checked
        return hasChecked ? el.value : null
      }
      // Check for value attribute - handle both getAttribute and direct property
      if (el.hasAttribute && el.hasAttribute('value')) {
        return el.getAttribute('value')
      }
      if (el.value !== undefined && el.value !== '') {
        return el.value
      }
      return null
    } else if (el.tagName === 'TEXTAREA' || element instanceof HTMLTextAreaElement) {
      const text = el.textContent?.trim() || el.value?.trim()
      return text ? text : null
    } else if (el.tagName === 'SELECT' || element instanceof HTMLSelectElement) {
      if (el.querySelector) {
        const selected = el.querySelector('option[selected]') as HTMLOptionElement
        return selected ? selected.value : null
      }
      return null
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

  /**
   * Update entire form data from external source (for two-way binding)
   */
  setFormData(newData: Record<string, unknown>) {
    console.log('=== setFormData called ===')
    console.log('newData:', newData)
    console.log('formManager available:', !!this.formManager)

    if (!this.formManager) {
      console.error('FormManager not available')
      return
    }

    try {
      // Update form fields with new data
      const container = this.shadowRoot?.querySelector('#content-container')
      console.log('Container found:', !!container)
      if (!container) {
        console.error('Content container not found')
        return
      }

      console.log('Processing', Object.keys(newData).length, 'fields')
      // First, let's see what fields are actually available in the container
      console.log('Available fields in container:')
      const allFields = container.querySelectorAll('input, textarea, select, [contenteditable]')
      allFields.forEach((field, index) => {
        const el = field as HTMLElement
        console.log(`Field ${index}:`, {
          tagName: el.tagName,
          name: el.getAttribute('name'),
          dataFieldName: el.getAttribute('data-field-name'),
          id: el.id,
          type: (el as any).type || 'N/A',
          contenteditable: el.getAttribute('contenteditable')
        })
      })

      Object.entries(newData).forEach(([fieldName, value]) => {
        console.log(`Processing field: ${fieldName} = ${value}`)

        // Try multiple selectors to find the field
        let field = container.querySelector(`[name="${fieldName}"]`) as HTMLElement
        if (!field) {
          field = container.querySelector(`[data-field-name="${fieldName}"]`) as HTMLElement
        }
        if (!field) {
          field = container.querySelector(`#${fieldName}`) as HTMLElement
        }

        console.log(`Field ${fieldName} found:`, !!field, field?.tagName, (field as any)?.type || 'N/A')

        if (field) {
          if (field.hasAttribute('contenteditable')) {
            // Inline contenteditable field
            field.textContent = String(value || '')
          } else if (field instanceof HTMLInputElement) {
            if (field.type === 'checkbox' || field.type === 'radio') {
              field.checked = Boolean(value)
            } else {
              field.value = String(value || '')
            }
          } else if (field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
            field.value = String(value || '')
          }

          // Trigger input event to update internal state
          field.dispatchEvent(new Event('input', { bubbles: true }))
        }
      })

      // Update internal data
      this.data = { ...newData }
    } catch (error) {
      console.error('Error updating form data:', error)
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'formdown-ui': FormdownUI
  }
}