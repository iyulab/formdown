import { FormdownParser } from './parser.js'
import { FormdownGenerator } from './generator.js'
import { getSchema } from './schema.js'
import { validateForm, validateField } from './index.js'
import { FormDataBinding } from './form-data-binding.js'
import { FieldProcessor } from './field-processor.js'
import { DOMBinder } from './dom-binder.js'
import { ValidationManager } from './validation-manager.js'
import { EventOrchestrator } from './event-orchestrator.js'
import type { Field, FormdownContent, FormDeclaration, FormDownSchema, ValidationResult, FieldError } from './types'

export interface FormManagerOptions {
  preserveMarkdown?: boolean
  fieldPrefix?: string
  inlineFieldDelimiter?: string
  autoGenerateFormIds?: boolean
  theme?: Record<string, any>
}

export interface RenderOptions {
  theme?: Record<string, any>
  customAttributes?: Record<string, any>
  outputFormat?: 'html' | 'json'
}

export interface FormManagerEvents {
  'data-change': { field: string; value: any; formData: Record<string, any> }
  'validation-error': { field: string; errors: FieldError[] }
  'form-submit': { formData: Record<string, any> }
  'form-reset': { formData: Record<string, any> }
}

/**
 * Core Form Manager - Provides complete form lifecycle management
 * This is the main entry point for all form operations
 */
export class FormManager {
  private parser: FormdownParser
  private generator: FormdownGenerator
  private content: string = ''
  private parsedContent: FormdownContent | null = null
  private schema: FormDownSchema | null = null
  private dataBinding: FormDataBinding | null = null
  private eventListeners: Map<keyof FormManagerEvents, Set<Function>> = new Map()
  
  // New Core modules
  private fieldProcessor: FieldProcessor | null = null
  private domBinder: DOMBinder | null = null
  private validationManager: ValidationManager | null = null
  private eventOrchestrator: EventOrchestrator | null = null
  
  constructor(private options: FormManagerOptions = {}) {
    this.parser = new FormdownParser(options)
    this.generator = new FormdownGenerator()
    
    // Initialize event listener maps
    Object.keys({} as FormManagerEvents).forEach(event => {
      this.eventListeners.set(event as keyof FormManagerEvents, new Set())
    })
  }

  /**
   * Parse Formdown content and prepare for rendering
   */
  parse(content: string): FormdownContent {
    this.content = content
    this.parsedContent = this.parser.parseFormdown(content)
    this.schema = getSchema(content)
    
    // Initialize reactive data binding
    this.dataBinding = new FormDataBinding(this.schema)
    
    // Setup event forwarding from data binding
    this.setupDataBindingEvents()
    
    return this.parsedContent
  }

  /**
   * Render the form to HTML with optional custom options
   */
  render(options: RenderOptions = {}): string {
    if (!this.parsedContent) {
      throw new Error('No content parsed. Call parse() first.')
    }

    if (options.outputFormat === 'json') {
      return JSON.stringify(this.parsedContent, null, 2)
    }

    return this.generator.generateHTML(this.parsedContent)
  }

  /**
   * Get the current form schema
   */
  getSchema(): FormDownSchema | null {
    return this.schema ? { ...this.schema } : null
  }

  /**
   * Get current form data
   */
  getData(): Record<string, any> {
    if (!this.dataBinding) return {}
    return this.dataBinding.getAll()
  }

  /**
   * Update form data (single field)
   */
  setFieldValue(field: string, value: any): void {
    if (!this.dataBinding) return
    this.dataBinding.set(field, value)
  }

  /**
   * Update multiple form fields at once
   */
  updateData(newData: Record<string, any>): void {
    if (!this.dataBinding) return
    this.dataBinding.updateAll(newData)
  }

  /**
   * Reset form data to schema defaults
   */
  reset(): void {
    if (!this.dataBinding) return
    this.dataBinding.reset()
    this.emit('form-reset', { formData: this.getData() })
  }

  /**
   * Validate current form data
   */
  validate(): ValidationResult {
    if (!this.dataBinding) {
      return { isValid: true, errors: [] }
    }

    return this.dataBinding.validate()
  }

  /**
   * Get default values from schema
   */
  getDefaultValues(): Record<string, any> {
    if (!this.dataBinding) return {}
    return this.dataBinding.getSchemaDefaults()
  }

  /**
   * Check if form has unsaved changes
   */
  isDirty(): boolean {
    if (!this.dataBinding) return false
    return this.dataBinding.isDirty()
  }

  /**
   * Get field definition by name
   */
  getField(fieldName: string): Field | null {
    if (!this.parsedContent) return null
    
    return this.parsedContent.forms.find(field => field.name === fieldName) || null
  }

  /**
   * Get all fields
   */
  getFields(): Field[] {
    return this.parsedContent?.forms || []
  }

  /**
   * Get form declarations
   */
  getFormDeclarations(): FormDeclaration[] {
    return this.parsedContent?.formDeclarations || []
  }

  /**
   * Event system
   */
  on<K extends keyof FormManagerEvents>(event: K, handler: (data: FormManagerEvents[K]) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set())
    }
    this.eventListeners.get(event)!.add(handler)
  }

  off<K extends keyof FormManagerEvents>(event: K, handler: (data: FormManagerEvents[K]) => void): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.delete(handler)
    }
  }

  private emit<K extends keyof FormManagerEvents>(event: K, data: FormManagerEvents[K]): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(handler => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in FormManager event handler for '${event}':`, error)
        }
      })
    }
  }

  /**
   * Setup event forwarding from data binding to form manager events
   */
  private setupDataBindingEvents(): void {
    if (!this.dataBinding) return

    // Forward field changes
    this.dataBinding.subscribeToField((field, value, formData) => {
      this.emit('data-change', { field, value, formData })
    })

    // Forward validation errors
    this.dataBinding.subscribeToValidation((field, errors) => {
      if (errors.length > 0) {
        this.emit('validation-error', { field, errors })
      }
    })
  }

  /**
   * Create a new instance with the same options
   */
  clone(): FormManager {
    return new FormManager(this.options)
  }

  /**
   * Export form configuration for serialization
   */
  export(): {
    content: string
    data: Record<string, any>
    schema: FormDownSchema | null
    options: FormManagerOptions
  } {
    return {
      content: this.content,
      data: this.getData(),
      schema: this.getSchema(),
      options: { ...this.options }
    }
  }

  /**
   * Import form configuration
   */
  import(config: {
    content: string
    data?: Record<string, any>
    options?: FormManagerOptions
  }): void {
    if (config.options) {
      Object.assign(this.options, config.options)
      this.parser = new FormdownParser(this.options)
    }

    this.parse(config.content)
    
    if (config.data) {
      this.updateData(config.data)
    }
  }

  // =========================================================================
  // NEW CORE MODULE INTEGRATION APIs (Phase 1 Enhancement)
  // =========================================================================

  /**
   * Create a FieldProcessor instance for advanced field processing
   */
  createFieldProcessor(): FieldProcessor {
    if (!this.fieldProcessor) {
      this.fieldProcessor = new FieldProcessor()
    }
    return this.fieldProcessor
  }

  /**
   * Create a DOMBinder instance for DOM manipulation and binding
   */
  createDOMBinder(): DOMBinder {
    if (!this.domBinder) {
      this.domBinder = new DOMBinder()
    }
    return this.domBinder
  }

  /**
   * Create a ValidationManager instance for advanced validation
   */
  createValidationManager(): ValidationManager {
    if (!this.validationManager) {
      this.validationManager = new ValidationManager()
    }
    return this.validationManager
  }

  /**
   * Create an EventOrchestrator instance for component coordination
   */
  createEventOrchestrator(): EventOrchestrator {
    if (!this.eventOrchestrator) {
      this.eventOrchestrator = new EventOrchestrator()
    }
    return this.eventOrchestrator
  }

  /**
   * Process field value using FieldProcessor
   */
  processFieldValue(fieldName: string, value: any): any {
    const processor = this.createFieldProcessor()
    const field = this.getField(fieldName)
    
    if (!field) {
      console.warn(`Field ${fieldName} not found in schema`)
      return value
    }

    const fieldType = processor.getFieldType({
      id: fieldName,
      name: fieldName,
      value: String(value),
      type: field.type || 'text',
      hasAttribute: () => false,
      getAttribute: () => null
    })

    return processor.extractFieldValue({
      id: fieldName,
      name: fieldName,
      value: String(value),
      type: field.type || 'text',
      hasAttribute: () => false,
      getAttribute: () => null
    }, fieldType)
  }

  /**
   * Validate field with advanced ValidationManager
   */
  async validateFieldWithPipeline(fieldName: string, value: any): Promise<any> {
    const validationManager = this.createValidationManager()
    const field = this.getField(fieldName)
    const processor = this.createFieldProcessor()
    
    if (!field) {
      return { isValid: false, errors: [`Field ${fieldName} not found`] }
    }

    const fieldType = processor.getFieldType({
      id: fieldName,
      name: fieldName,
      value: String(value),
      type: field.type || 'text',
      hasAttribute: () => false,
      getAttribute: () => null
    })

    const fieldContext = {
      fieldName,
      fieldType,
      constraints: (field.attributes || {}) as import('./validation-manager.js').FieldValidationConstraints,
      schema: field as import('./validation-manager.js').FieldSchema
    }

    return await validationManager.validateAsync(fieldContext, value, this.getData() as import('./validation-manager.js').FormData)
  }

  /**
   * Setup component bridge using EventOrchestrator
   */
  setupComponentBridge(target: any): string {
    const orchestrator = this.createEventOrchestrator()
    
    const coreComponent = {
      id: 'formdown-core',
      type: 'core' as const,
      emit: (event: string, data?: any) => {
        // Integrate with FormManager's event system
        if (event === 'formdown:data:change') {
          this.emit('data-change', data)
        } else if (event === 'formdown:validation:error') {
          this.emit('validation-error', data)
        }
      },
      on: (event: string, handler: any) => {
        // Map to FormManager events
        if (event === 'formdown:field:change') {
          this.on('data-change', handler)
        }
        return () => {} // Return unsubscribe function
      }
    }

    if (target.type === 'ui') {
      return orchestrator.createCoreUIBridge(coreComponent, target)
    } else if (target.type === 'editor') {
      return orchestrator.createCoreEditorBridge(coreComponent, target)
    } else {
      // Generic bridge
      return orchestrator.bridgeComponentEvents(coreComponent, target, [])
    }
  }

  /**
   * Render form to template format (for UI components)
   */
  renderToTemplate(options: { theme?: any, container?: any } = {}): any {
    if (!this.parsedContent) {
      throw new Error('No content parsed. Call parse() first.')
    }

    // This would be used by UI components to get structured data
    // instead of raw HTML for more flexible rendering
    return {
      fields: this.getFields(),
      formDeclarations: this.getFormDeclarations(),
      schema: this.getSchema(),
      data: this.getData(),
      html: this.render(),
      options
    }
  }

  /**
   * Handle UI events from components
   */
  handleUIEvent(event: Event, domBinder?: DOMBinder): void {
    if (!domBinder) {
      domBinder = this.createDOMBinder()
    }

    // This would be implemented by UI components to delegate
    // event handling back to Core through the DOMBinder
    const target = event.target as any
    const fieldName = target?.name || target?.id
    
    if (fieldName && event.type === 'change') {
      const processor = this.createFieldProcessor()
      const fieldType = processor.getFieldType(target)
      const value = processor.extractFieldValue(target, fieldType)
      
      this.setFieldValue(fieldName, value)
    }
  }

  /**
   * Create preview template (for Editor components)
   */
  createPreviewTemplate(content: string): any {
    try {
      const previewManager = new FormManager(this.options)
      previewManager.parse(content)
      
      return {
        html: previewManager.render(),
        errors: [], // Parsing errors will be implemented when parser error collection is enhanced
        schema: previewManager.getSchema(),
        fields: previewManager.getFields()
      }
    } catch (error) {
      return {
        html: '',
        errors: [String(error)],
        schema: null,
        fields: []
      }
    }
  }

  /**
   * Get all Core module instances (for advanced usage)
   */
  getCoreModules(): {
    fieldProcessor: FieldProcessor | null
    domBinder: DOMBinder | null
    validationManager: ValidationManager | null
    eventOrchestrator: EventOrchestrator | null
  } {
    return {
      fieldProcessor: this.fieldProcessor,
      domBinder: this.domBinder,
      validationManager: this.validationManager,
      eventOrchestrator: this.eventOrchestrator
    }
  }

  /**
   * Dispose of all Core modules and clean up resources
   */
  dispose(): void {
    if (this.validationManager) {
      this.validationManager.dispose()
      this.validationManager = null
    }

    if (this.domBinder) {
      this.domBinder.clearAllBindings()
      this.domBinder = null
    }

    if (this.eventOrchestrator) {
      this.eventOrchestrator.dispose()
      this.eventOrchestrator = null
    }

    this.fieldProcessor = null
    
    // Clear existing event listeners
    this.eventListeners.clear()
    
    // Reset data binding
    if (this.dataBinding) {
      this.dataBinding = null
    }
  }
}

/**
 * Convenience function to create a FormManager instance
 */
export function createFormManager(content: string, options?: FormManagerOptions): FormManager {
  const manager = new FormManager(options)
  manager.parse(content)
  return manager
}

/**
 * Convenience function for one-time form rendering
 */
export function renderForm(content: string, data?: Record<string, any>, options?: FormManagerOptions & RenderOptions): string {
  const manager = createFormManager(content, options)
  
  if (data) {
    manager.updateData(data)
  }
  
  return manager.render(options)
}