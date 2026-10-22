import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {
  FormManager,
  DOMBinder,
  initializeExtensions,
  type BodyHtml,
  validateForm,
  type FormDownSchema,
  type ValidationMessages,
  type ValidationResult
} from '@formdown/core'
import { applyFieldValue, isCheckedValue } from './field-value'
import { customControlsIn, isCustomControl, readCustomControl, undefinedControlTags } from './custom-controls'
import { addUnlistedChoices } from './unlisted'
import { markUnreadValues } from './unread'
import { applyChoices, type Choices } from './choices'
import { applySelectFilters } from './select-filter'
import { applyConditions, type ConditionalField } from './conditions'
import { computations, computedValues } from './computed'
import { applyFieldStates, focusFieldOf, hostFocused, type FieldStates } from './field-states'
import { formdownStyles } from './styles'
import { fieldTypeStyles, ShadowStyleSheet } from './field-type-styles'
import { clearFieldErrors, errorsByField, showFieldErrors } from './field-errors'

@customElement('formdown-ui')
export class FormdownUI extends LitElement {
  static styles = formdownStyles
  @property()
  content = ''

  /**
   * What becomes of HTML written in the form's Markdown body: `trust` renders it, `escape` shows it as text and
   * drops the link of a Markdown link to a script or data address — for a form someone else wrote. The form's own
   * fields are drawn either way.
   */
  @property({ attribute: 'body-html' })
  bodyHtml: BodyHtml = 'trust'

  /**
   * What the host says about each field, by name: values it offers and a short note (see
   * `FieldState`). Picking an offered value fires `formdown-suggestion-pick` with `{ field, value }`;
   * putting the value in is the host's to do, through `data`. Declining them fires
   * `formdown-suggestion-decline` with `{ field }`.
   */
  @property({ attribute: false })
  fieldStates: FieldStates = {}

  /**
   * Values the host offers for each field, by name, as `{ value, label? }` — options read from a server,
   * values already settled elsewhere. A select or a radio or checkbox group lists them after its own
   * options; a field one types into lists them as it is typed in (a `<datalist>`). The author's options
   * stay as written. Each added choice is marked `data-formdown-choice`.
   */
  @property({ attribute: false })
  choices: Choices = {}

  /**
   * A select with more options than this becomes a field one types into to narrow its options by their
   * labels (a combobox), for lists too long to scroll — the host's `choices` can make them so. The select stays
   * the field: its name, value and events are as before. `Infinity` keeps every select as it is.
   */
  @property({ attribute: 'filter-select-above', type: Number })
  filterSelectAbove = 20

  /**
   * The sentences validation says, by rule, in place of the English ones — `required`, `minLength`,
   * `maxLength`, `min`, `max`, `number`, `email`, `url`, `tel`, `date`, `dateMin`, `dateMax`, `pattern`;
   * `{label}`, `{min}` and `{max}` are filled in. A rule left out keeps its default sentence, and a
   * field's own `error-message` still wins for `required`. `@formdown/core/messages/ko` holds Korean ones.
   */
  @property({ attribute: false })
  messages: Partial<ValidationMessages> = {}

  /** The fields whose errors are drawn now: each is checked again as values change, and cleared once it passes. */
  private shownErrors = new Set<string>()

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

  /**
   * Focuses the field named `fieldName` — for a choice group, its chosen option or its first — or with
   * no name the first field a person can reach (not hidden or turned off by a condition). A host calls
   * it when a new form opens, or to keep the field being worked on after it draws the form again.
   * Answers whether a field took focus.
   */
  focusField(fieldName?: string): boolean {
    const container = this.shadowRoot?.querySelector('#content-container')
    return container ? focusFieldOf(container, fieldName) : false
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
  /** Settles once the extension system's plugins are registered; the form is not drawn before. */
  private extensionsReady?: Promise<void>
  /** The styles of the plugin field types in the form drawn now. */
  private fieldTypeSheet?: ShadowStyleSheet

  // Parsing consults the field types plugins add, so drawing before they are registered would draw
  // their fields as something else — and nothing would draw them again once they are.
  protected override async scheduleUpdate(): Promise<void> {
    await this.extensionsReady
    super.scheduleUpdate()
  }

  // Core modules for delegated functionality
  private domBinder: DOMBinder
  
  private fieldRegistry: Map<string, Set<HTMLElement>> = new Map()
  private _isUpdatingUI = false  // Prevent infinite loops
  private _schema: FormDownSchema | null = null
  /** The fields worked out from others' values, kept as the schema is read. */
  private computed: ReturnType<typeof computations> = new Map()

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
    const result = this.formManager.validate({ messages: this.messages })
    const byField = errorsByField(result.errors)
    const container = this.shadowRoot?.querySelector('#content-container')
    if (container) showFieldErrors(container, byField)
    this.shownErrors = new Set(byField.keys())
    return result
  }

  /**
   * Checks again the fields whose errors are drawn, against the values now: a field fixed loses its
   * error, one still wrong says what is wrong now. Fields not yet shown an error are left alone — they
   * are told only when the host validates.
   */
  private recheckShownErrors() {
    if (this.shownErrors.size === 0 || !this._schema) return
    const container = this.shadowRoot?.querySelector('#content-container')
    if (!container) return
    const now = errorsByField(validateForm(this.formManager.getData(), this._schema, { messages: this.messages }).errors)
    const still = new Map([...now].filter(([field]) => this.shownErrors.has(field)))
    showFieldErrors(container, still)
    this.shownErrors = new Set(still.keys())
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

  connectedCallback() {
    // Parsing and rendering run through the extension system; plugins registered on it apply to this form.
    // A failed plugin is reported by the extension system and leaves the core field types to draw the form.
    this.extensionsReady ??= initializeExtensions().catch(() => undefined)
    super.connectedCallback()

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
      this.computed = computations(this._schema as Record<string, { compute?: string }>)
      
      // Sync data with FormManager
      if (this.data && Object.keys(this.data).length > 0) {
        this.formManager.updateData(this.data)
      }
      
      // Use new Core template rendering system
      const template = this.formManager.renderToTemplate({
        container: this,
        html: this.bodyHtml,
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
    this.drawFieldStates()
    // Always sync UI (includes both existing data and schema defaults)
    // Use setTimeout to ensure DOM is fully ready
    setTimeout(() => {
      this.syncUIFromData()
    }, 0)
  }
  // Override updated to update content when properties change
  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties)

    if (changedProperties.has('content') || changedProperties.has('bodyHtml')) {
      this.updateContent()
      this.drawFieldStates() // the new content was drawn without them
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

    if ((changedProperties.has('data') || changedProperties.has('messages')) && !changedProperties.has('content')) {
      this.recheckShownErrors()
    }

    if (changedProperties.has('fieldStates') && !changedProperties.has('content')) {
      this.drawFieldStates()
    }

    if (changedProperties.has('choices') && !changedProperties.has('content') && !changedProperties.has('data')) {
      this.syncUIFromData()
    }

    if (changedProperties.has('filterSelectAbove') && !changedProperties.has('content')) {
      const container = this.shadowRoot?.querySelector('#content-container')
      if (container) applySelectFilters(container, this.filterSelectAbove)
    }
  }

  private drawFieldStates() {
    const container = this.shadowRoot?.querySelector('#content-container')
    if (!container) return
    applyFieldStates(container, this.fieldStates ?? {}, {
      onPick: (field, value) =>
        this.dispatchEvent(new CustomEvent('formdown-suggestion-pick', { detail: { field, value }, bubbles: true, composed: true })),
      onDecline: (field) =>
        this.dispatchEvent(new CustomEvent('formdown-suggestion-decline', { detail: { field }, bubbles: true, composed: true })),
    })
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
      this.computed = computations(this._schema as Record<string, { compute?: string }>)
      this.fieldTypeSheet ??= new ShadowStyleSheet(this.shadowRoot!)
      this.fieldTypeSheet.set(fieldTypeStyles(this._schema))
      
      // Sync existing data with FormManager
      if (this.data && Object.keys(this.data).length > 0) {
        this.formManager.updateData(this.data)
      }
      
      const template = this.formManager.renderToTemplate({
        container: this,
        html: this.bodyHtml,
      })

      if (!template.html || template.html.trim() === '') {
        container.innerHTML = `<div class="error">FormManager returned empty HTML</div>`
        return
      }

      container.innerHTML = template.html
      this.shownErrors.clear() // drawn with the fields they were on

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
      // Field types are collected for future extension processing
    } catch {
      // Extension asset injection is non-critical, silently continue
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
    this.setupCustomControls(container)

    // A control the page defines after the form is drawn becomes a field when it is defined.
    for (const tag of undefinedControlTags(container)) {
      customElements.whenDefined(tag).then(() => {
        if (!container.isConnected) return
        this.setupCustomControls(container)
        this.syncUIFromData()
      })
    }

    // Setup keyboard navigation
    const allInputs = container.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), [contenteditable="true"]')
    this.setupBasicKeyboardNavigation(allInputs)
  }

  /** Binds the page's own controls (form-associated custom elements) not bound yet, as fields. */
  private setupCustomControls(container: Element) {
    for (const control of customControlsIn(container)) {
      const fieldName = control.getAttribute('name')!
      if (this.fieldRegistry.get(fieldName)?.has(control)) continue
      this.registerField(fieldName, control)
      this.setupFieldEventHandlers(control, fieldName)
    }
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
    // Register field-element binding with DOMBinder
    this.domBinder.bindFieldToElement(fieldName, element as any)

    // Simple UI event handler for real-time updates
    const handleChange = (event: Event) => {
      const held = this.data[fieldName]
      this.formManager.handleUIEvent(event, this.domBinder)
      const value = this.getFieldValueFromElement(element)
      // A field that leaves as it was — a blur, or the change event after the input that already
      // reported the value — is not an edit, and is not reported as one.
      if (sameFieldValue(held, value)) return
      this.updateDataReactively(fieldName, value)
    }

    // Focus event handler for select all functionality
    const handleFocus = (event: Event) => {
      const target = event.target as HTMLElement
      // Put back by the host (focusField): the value stays as it is, the caret at its end.
      if (hostFocused.delete(target)) return

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
      // Typing scrolls a one-line field's view to where the caret is. Leaving it shows the value from
      // its start again, as an input does — otherwise its first characters stay cut off.
      element.addEventListener('blur', () => {
        element.scrollLeft = 0
      })
    }
  }

  // Field-specific behaviors delegated to DOMBinder in setupFieldHandlers

  // Simplified reactive data management with test compatibility
  private updateDataReactively(fieldName: string, value: string | string[] | boolean, _sourceElement?: HTMLElement) {
    if (this._isUpdatingUI) return

    // Delegate to FormManager
    this.formManager.setFieldValue(fieldName, value)
    this.data = { ...this.data, [fieldName]: value, ...this.followComputed() }
    this.emitFieldEvents(fieldName, value)
  }

  /** Sets the fields worked out from others to what the values now make them, and answers those that moved. */
  private followComputed(): Record<string, string> {
    const worked = computedValues(this.computed, this.formManager.getData())
    for (const [name, value] of Object.entries(worked)) this.formManager.setFieldValue(name, value)
    return worked
  }


  private syncUIFromData() {
    if (this._isUpdatingUI) return

    this._isUpdatingUI = true
    try {
      // Get the currently focused element to avoid disrupting user input
      const activeElement = this.shadowRoot?.activeElement as HTMLElement | null

      // What the host offers, then a choice of its own for a value nobody offers, before values are applied.
      const container = this.shadowRoot?.querySelector('#content-container')
      if (container) {
        for (const input of [...applyChoices(container, this.choices ?? {}), ...addUnlistedChoices(container, this.data)]) {
          this.registerField(input.name, input)
          this.setupFieldEventHandlers(input, input.name)
        }
      }

      // Get value assignments from DOMBinder and apply them
      const assignments = this.domBinder.getValueAssignments(this.data)
      assignments.forEach(({ element, value, fieldType }) => {
        const htmlElement = element as unknown as HTMLElement

        // Skip the currently focused element to preserve cursor position
        if (htmlElement === activeElement) {
          return
        }

        applyFieldValue(htmlElement, value, fieldType)
      })

      // A value a typed input could not take is shown beside it rather than as an empty field.
      if (container) markUnreadValues(container, this.data)

      // What the values now show, enable and require.
      if (container && this._schema) applyConditions(container, this._schema as Record<string, ConditionalField>, this.data)

      // Last: a long select's combobox shows the value and follows the state just applied.
      if (container) applySelectFilters(container, this.filterSelectAbove)
    } finally {
      this._isUpdatingUI = false
      this.domBinder.releaseSyncLock()
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

  // Simplified field value extraction
  private getFieldValueFromElement(element: HTMLElement): string | string[] | boolean {
    if (isCustomControl(element)) {
      return readCustomControl(element)
    } else if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox') {
        // For checkbox groups, use FieldProcessor to get all selected values
        const fieldName = element.name
        const container = {
          querySelector: (selector: string) => this.shadowRoot?.querySelector(selector) as any,
          querySelectorAll: (selector: string) => Array.from(this.shadowRoot?.querySelectorAll(selector) || []) as any[]
        }
        const processor = this.formManager.createFieldProcessor()
        const result = processor.processCheckboxGroup(fieldName, container)
        return result.success ? (result.value as string[] | boolean) : element.checked
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
    // A field worked out from this one follows it, in the same change.
    this.followComputed()
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

    clearFieldErrors(container)
    this.shownErrors.clear()
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
    if (!this.formManager) {
      return
    }

    const container = this.shadowRoot?.querySelector('#content-container')
    if (!container) {
      return
    }

    Object.entries(newData).forEach(([fieldName, value]) => {
      // A radio or checkbox group is several elements under one name; each shows its own part.
      let fields = Array.from(container.querySelectorAll(`[name="${CSS.escape(fieldName)}"]`)) as HTMLElement[]
      if (fields.length === 0) {
        const field =
          container.querySelector(`[data-field-name="${CSS.escape(fieldName)}"]`) ??
          container.querySelector(`#${CSS.escape(fieldName)}`)
        fields = field ? [field as HTMLElement] : []
      }

      for (const field of fields) {
        const type = field instanceof HTMLInputElement ? field.type : field.dataset.fieldType ?? 'text'
        applyFieldValue(field, value, type)
        // Trigger input event to update internal state
        field.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    // Update internal data
    this.data = { ...newData }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'formdown-ui': FormdownUI
  }
}

/**
 * Whether a field's value is the one the form already holds. A field the data does not name holds
 * its empty value: an untouched text field, an unchecked box, a group with nothing picked.
 */
function sameFieldValue(held: unknown, value: string | string[] | boolean): boolean {
  if (Array.isArray(value)) {
    const before = Array.isArray(held) ? held.map(String) : held === undefined || held === null ? [] : [String(held)]
    return before.length === value.length && before.every((v, i) => v === value[i])
  }
  if (held === undefined || held === null) return value === '' || value === false
  return typeof value === 'boolean' ? isCheckedValue(held) === value : String(held) === value
}
