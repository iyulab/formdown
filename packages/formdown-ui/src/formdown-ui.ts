import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { 
  extensionManager as defaultExtensionManager,
  FormManager,
  FieldProcessor,
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

  // Generate unique form ID
  private _uniqueFormId: string

  // Get the form ID (user-provided or auto-generated)
  private getFormId(): string {
    return this.formId || this._uniqueFormId
  }

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
  private fieldProcessor: FieldProcessor
  private domBinder: DOMBinder
  
  private fieldRegistry: Map<string, Set<HTMLElement>> = new Map()
  private _isUpdatingUI = false  // Prevent infinite loops
  private _schema: FormDownSchema | null = null

  constructor() {
    super()
    // Generate unique form ID if not provided
    this._uniqueFormId = this.formId || `formdown-${Math.random().toString(36).substring(2, 15)}`
    
    // Initialize FormManager
    this.formManager = new FormManager()
    
    // Initialize Core modules through FormManager
    this.fieldProcessor = this.formManager.createFieldProcessor()
    this.domBinder = this.formManager.createDOMBinder()
    
    // Set up component bridge for Core-UI integration
    this.setupCoreUIBridge()
    
    // Set up event forwarding from FormManager to UI
    this.setupFormManagerEvents()
  }

  /**
   * Set up Core-UI component bridge using EventOrchestrator
   */
  private setupCoreUIBridge() {
    const uiComponent = {
      id: 'formdown-ui',
      type: 'ui' as const,
      emit: (event: string, data?: any) => {
        // UI component event emission (for debugging or extension hooks)
        this.dispatchEvent(new CustomEvent(event, { detail: data, bubbles: true }))
      },
      on: (_event: string, _handler: any) => {
        // Set up UI event listeners if needed
        return () => {} // Return unsubscribe function
      }
    }
    
    this.formManager.setupComponentBridge(uiComponent)
  }

  /**
   * Set up event forwarding from FormManager to UI
   */
  private setupFormManagerEvents() {
    // Forward data changes from FormManager to UI data property
    this.formManager.on('data-change', ({ formData }) => {
      // Update UI data without triggering infinite loops
      if (!this._isUpdatingUI) {
        this._isUpdatingUI = true
        this.data = formData
        this._isUpdatingUI = false
      }
    })

    // Handle validation errors
    this.formManager.on('validation-error', ({ field, errors }) => {
      // Dispatch validation error event for external listeners
      this.dispatchEvent(new CustomEvent('validation-error', {
        detail: { field, errors },
        bubbles: true
      }))
    })

    // Handle form submission
    this.formManager.on('form-submit', ({ formData }) => {
      this.dispatchEvent(new CustomEvent('form-submit', {
        detail: { formData },
        bubbles: true
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
   * Inject extension styles and scripts into the component
   */
  private injectExtensionAssets(container: Element) {
    try {
      // Get field types used in this form
      const fieldTypes = this.getUsedFieldTypes(container)
      
      // Inject styles for the used field types
      const extensionStyles = defaultExtensionManager.getFieldTypeRegistry().getStylesForTypes(fieldTypes)
      if (extensionStyles) {
        this.injectStyles(extensionStyles)
      }
      
      // Inject scripts for the used field types
      const extensionScripts = defaultExtensionManager.getFieldTypeRegistry().getScriptsForTypes(fieldTypes)
      if (extensionScripts) {
        this.injectScripts(extensionScripts)
      }
    } catch (error) {
      console.debug('Extension asset injection failed:', error)
    }
  }

  /**
   * Get list of field types used in the rendered form
   */
  private getUsedFieldTypes(container: Element): string[] {
    const fieldTypes = new Set<string>()
    
    // Look for data-field-type attributes on elements
    const fieldsWithType = container.querySelectorAll('[data-field-type]')
    fieldsWithType.forEach(field => {
      const type = field.getAttribute('data-field-type')
      if (type) fieldTypes.add(type)
    })
    
    // Look for class names that might indicate field types
    const specialFields = container.querySelectorAll('[class*="formdown-"][class*="-field"]')
    specialFields.forEach(field => {
      const classes = field.className
      const rangeMatch = classes.match(/formdown-(\w+)-field/)
      if (rangeMatch) fieldTypes.add(rangeMatch[1])
    })
    
    return Array.from(fieldTypes)
  }

  /**
   * Inject CSS styles into the shadow DOM
   */
  private injectStyles(css: string) {
    if (!css.trim()) return
    
    // Check if styles are already injected
    const existingStyle = this.shadowRoot?.querySelector('#extension-styles')
    if (existingStyle) {
      existingStyle.textContent = css
    } else {
      const style = document.createElement('style')
      style.id = 'extension-styles'
      style.textContent = css
      this.shadowRoot?.appendChild(style)
    }
  }

  /**
   * Inject JavaScript into the document (global scope for form interactions)
   */
  private injectScripts(js: string) {
    if (!js.trim()) return
    
    // Check if script is already injected
    const scriptId = 'formdown-extension-scripts'
    if (document.getElementById(scriptId)) {
      return // Script already loaded
    }
    
    const script = document.createElement('script')
    script.id = scriptId
    script.textContent = js
    document.head.appendChild(script)
  }

  private setupFieldHandlers(container: Element) {
    // Clear previous registry
    this.fieldRegistry.clear()

    // Handle Enter key navigation for all input fields
    const allInputs = container.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), [contenteditable="true"]')
    this.setupKeyboardNavigation(allInputs)    // Universal field discovery and setup
    const allFields = container.querySelectorAll('input, textarea, select, [contenteditable="true"]')

    allFields.forEach(element => {
      const htmlElement = element as HTMLElement
      const fieldName = this.getFieldName(htmlElement)

      if (fieldName) {
        // Register field in universal registry
        this.registerField(fieldName, htmlElement)

        // Initialize field with three-level priority system
        // Priority: context.data > schema default value > empty
        const existingValue = this.data[fieldName]
        if (existingValue !== undefined) {
          // User data (context.data) takes highest precedence
          this.setElementValue(htmlElement, existingValue)
        } else {
          // Check for schema default value from parsed field.value
          const schemaDefaultValue = this.getSchemaDefaultValue(fieldName)
          if (schemaDefaultValue !== undefined) {
            // Schema value attribute provides the default
            this.updateDataReactively(fieldName, schemaDefaultValue, htmlElement)
          }
          // Note: HTML value attribute is already handled by the generator
          // and rendered into the HTML, no need to extract it again
        }

        // Setup universal event handlers
        this.setupFieldEventHandlers(htmlElement, fieldName)

        // Setup field-specific behaviors
        this.setupFieldSpecificBehaviors(htmlElement)
      } else if (htmlElement.id && htmlElement.id.includes('_other_input')) {
        // Handle "other" text inputs that don't have field names but need special handling
        this.setupOtherInputHandlers(htmlElement)
      }
    })
  }

  private setupKeyboardNavigation(inputs: NodeListOf<Element>) {
    inputs.forEach((input, index) => {
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
          if (nextIndex < inputs.length) {
            const nextInput = inputs[nextIndex] as HTMLElement
            nextInput.focus()
          }
        }
      })
    })
  }

  private setupFieldEventHandlers(element: HTMLElement, fieldName: string) {
    // Delegate event handling to Core through FormManager
    const handleValueChange = (event: Event) => {
      this.formManager.handleUIEvent(event, this.domBinder)
    }

    // Create DOM container adapter for FieldProcessor
    const container = {
      querySelector: (selector: string) => this.shadowRoot?.querySelector(selector) as any,
      querySelectorAll: (selector: string) => Array.from(this.shadowRoot?.querySelectorAll(selector) || []) as any[]
    }

    // Bind field to DOM using DOMBinder
    this.domBinder.bindFieldToElement(fieldName, element as any, container)

    // Set up simplified event listeners
    if (element.hasAttribute('contenteditable')) {
      element.addEventListener('input', handleValueChange)
    } else {
      element.addEventListener('input', handleValueChange)
      element.addEventListener('change', handleValueChange)
    }
  }

  private setupFieldSpecificBehaviors(element: HTMLElement) {
    // Handle contentEditable specific behaviors
    if (element.hasAttribute('contenteditable')) {
      this.setupContentEditableBehaviors(element)
    }
  }

  private setupOtherInputHandlers(element: HTMLElement) {
    // Extract field name from the input id (remove _other_input suffix)
    const fieldName = element.id.replace('_other_input', '')
    
    const handleOtherInputChange = () => {
      // Find associated radio or checkbox
      const otherRadio = this.shadowRoot?.querySelector(`#${fieldName}_other_radio`) as HTMLInputElement
      const otherCheckbox = this.shadowRoot?.querySelector(`#${fieldName}_other_checkbox`) as HTMLInputElement
      
      if (otherRadio) {
        // For radio buttons, check the "other" radio and trigger field update
        otherRadio.checked = true
        this.updateDataReactively(fieldName, (element as HTMLInputElement).value.trim(), element)
      } else if (otherCheckbox) {
        // For checkboxes, check the "other" checkbox and trigger field update
        otherCheckbox.checked = true
        // Trigger the checkbox group update by calling the handleValueChange for the checkbox
        const allCheckboxes = this.shadowRoot?.querySelectorAll(`input[type="checkbox"][name="${fieldName}"]`) as NodeListOf<HTMLInputElement>
        const checkedValues: string[] = []
        allCheckboxes.forEach(cb => {
          if (cb.checked) {
            if (cb.value === '' && cb.id.includes('_other_checkbox')) {
              const inputValue = (element as HTMLInputElement).value.trim()
              if (inputValue) {
                checkedValues.push(inputValue)
              }
            } else if (cb.value !== '') {
              checkedValues.push(cb.value)
            }
          }
        })
        this.updateDataReactively(fieldName, checkedValues, element)
      }
    }
    
    element.addEventListener('input', handleOtherInputChange)
    element.addEventListener('change', handleOtherInputChange)
  }

  private setupContentEditableBehaviors(element: HTMLElement) {
    const placeholder = element.dataset.placeholder

    // Handle placeholder behavior
    if (element.textContent?.trim() === placeholder) {
      element.textContent = ''
    }

    // Focus handler
    element.addEventListener('focus', () => {
      if (element.textContent?.trim() === placeholder) {
        element.textContent = ''
      }

      // Select all text on focus if enabled
      if (this.selectOnFocus) {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(element)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    })

    // Blur handler
    element.addEventListener('blur', () => {
      if (!element.textContent?.trim()) {
        element.textContent = placeholder || ''
      }
    })

    // Field-specific validation/formatting
    const fieldType = element.dataset.fieldType
    if (fieldType === 'email') {
      element.addEventListener('input', () => {
        const value = element.textContent?.trim() || ''
        if (value && !value.includes('@')) {
          element.style.color = '#dc2626'
        } else {
          element.style.color = '#1e40af'
        }
      })
    }
  }

  // Reactive data management - delegated to FormManager
  private updateDataReactively(fieldName: string, value: string | string[] | boolean, sourceElement?: HTMLElement) {
    if (this._isUpdatingUI) return // Prevent infinite loops

    // Delegate to FormManager for centralized data management
    this.formManager.setFieldValue(fieldName, value)
    
    // Update local reactive data (FormManager events will sync back)
    this.data = { ...this.data, [fieldName]: value }

    // Sync UI elements based on data
    this.syncUIFromData(fieldName, sourceElement)

    // Emit legacy events for backward compatibility
    this.emitFieldEvents(fieldName, value)
  }


  private syncUIFromData(fieldName?: string, sourceElement?: HTMLElement) {
    if (this._isUpdatingUI) return // Prevent infinite loops
    
    this._isUpdatingUI = true

    try {
      // Create DOM container adapter
      const container = {
        querySelector: (selector: string) => this.shadowRoot?.querySelector(selector) as any,
        querySelectorAll: (selector: string) => Array.from(this.shadowRoot?.querySelectorAll(selector) || []) as any[]
      }

      // Delegate to DOMBinder for efficient data synchronization
      this.domBinder.syncFormData(this.data, container)
      
      // Fallback for UI-specific elements not handled by DOMBinder
      if (fieldName) {
        const value = this.data[fieldName] ?? ''
        const boundElements = this.fieldRegistry.get(fieldName)
        
        boundElements?.forEach(element => {
          if (element !== sourceElement) {
            this.setElementValue(element, value)
          }
        })
      }
    } finally {
      this._isUpdatingUI = false
    }
  }
  // Universal element value setter - delegated to Core FieldProcessor
  private setElementValue(element: HTMLElement, value: string | string[] | boolean) {
    // Create DOM container adapter
    const container = {
      querySelector: (selector: string) => this.shadowRoot?.querySelector(selector) as any,
      querySelectorAll: (selector: string) => Array.from(this.shadowRoot?.querySelectorAll(selector) || []) as any[]
    }

    // Get field type from element
    const fieldType = this.fieldProcessor.getFieldType(element as any)
    
    // Delegate to Core FieldProcessor
    const success = this.fieldProcessor.setFieldValue(element as any, value, fieldType, container)
    
    if (!success && element instanceof HTMLElement) {
      // Fallback for simple cases where Core delegation might not handle UI-specific logic
      if (element.hasAttribute('contenteditable')) {
        const stringValue = Array.isArray(value) ? value.join(', ') : String(value)
        if (element.textContent !== stringValue) {
          element.textContent = stringValue
        }
      } else if (element instanceof HTMLInputElement) {
        if (element.type === 'checkbox' && typeof value === 'boolean') {
          element.checked = value
        } else if (element.type !== 'checkbox' && element.type !== 'radio') {
          const stringValue = Array.isArray(value) ? value.join(', ') : String(value)
          if (element.value !== stringValue) {
            element.value = stringValue
          }
        }
      } else if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
        const stringValue = Array.isArray(value) ? value.join(', ') : String(value)
        if (element.value !== stringValue) {
          element.value = stringValue
        }
      }
    }
  }

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

  // Universal field value extractor - delegated to FieldProcessor
  // These methods were removed - functionality delegated to Core modules

  // Extract initial value from HTML attributes (for HTML-standard value initialization)
  // Note: This method is preserved for compatibility but not actively used
  // since we now rely on schema values instead of HTML attributes
  // @ts-ignore - preserved for test compatibility
  private getElementInitialValue(element: HTMLElement): string | boolean | string[] | null {
    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox') {
        // For checkboxes, return true if checked attribute is present
        if (element.hasAttribute('checked')) {
          return element.value === 'true' ? true : element.value
        }
        return null
      } else if (element.type === 'radio') {
        // For radio buttons, return value if checked attribute is present
        if (element.hasAttribute('checked')) {
          return element.value
        }
        return null
      } else {
        // For other input types, return value attribute
        if (element.hasAttribute('value') && element.getAttribute('value')) {
          return element.getAttribute('value') || ''
        }
        return null
      }
    } else if (element instanceof HTMLTextAreaElement) {
      // For textarea, return text content if it has initial value
      const textContent = element.textContent?.trim()
      if (textContent) {
        return textContent
      }
      return null
    } else if (element instanceof HTMLSelectElement) {
      // For select, check if any option has selected attribute
      const selectedOption = element.querySelector('option[selected]') as HTMLOptionElement
      if (selectedOption) {
        return selectedOption.value
      }
      return null
    } else if (element.hasAttribute('contenteditable')) {
      // For contenteditable, check data-value attribute or text content
      const dataValue = element.getAttribute('data-value')
      if (dataValue) {
        return dataValue
      }
      const textContent = element.textContent?.trim()
      if (textContent && textContent !== element.dataset.placeholder) {
        return textContent
      }
      return null
    }
    return null
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

  // Universal field synchronization method - expected by tests
  syncFieldValue(fieldName: string, value: string | string[] | boolean) {
    // Update internal data
    this.data = { ...this.data, [fieldName]: value }

    // Emit events
    this.emitFieldEvents(fieldName, value)
  }

  // Update form data method - expected by tests
  updateFormData(fieldName: string, value: string | string[] | boolean) {
    // Update internal data
    this.data = { ...this.data, [fieldName]: value }

    // Emit events
    this.emitFieldEvents(fieldName, value)
  }  // Get form data programmatically - use reactive data as source of truth
  getFormData() {
    return { ...this.data }
  }

  // Get default values from schema (keeping for backward compatibility)
  getDefaultValues() {
    if (!this._schema) return {}
    
    const defaults: Record<string, any> = {}
    Object.entries(this._schema).forEach(([fieldName, fieldSchema]) => {
      if (fieldSchema.value !== undefined) {
        defaults[fieldName] = fieldSchema.value
      }
    })
    return defaults
  }

  // Get schema default value for a specific field
  private getSchemaDefaultValue(fieldName: string): any {
    if (!this._schema || !this._schema[fieldName]) {
      return undefined
    }
    return this._schema[fieldName].value
  }




  private clearValidationStates() {
    const container = this.shadowRoot?.querySelector('#content-container')
    if (!container) return

    // Remove error classes and error messages
    container.querySelectorAll('.field-error, .field-valid').forEach(el => {
      el.classList.remove('field-error', 'field-valid')
    })

    container.querySelectorAll('.validation-error-message').forEach(el => {
      el.remove()
    })
  }



  // Reset form method
  resetForm() {
    const formId = this.getFormId()
    const form = this.shadowRoot?.querySelector(`#${formId}`) as HTMLFormElement
    if (form) {
      form.reset()
    }

    // Clear data
    this.data = {}

    // Clear validation states
    this.clearValidationStates()
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'formdown-ui': FormdownUI
  }
}