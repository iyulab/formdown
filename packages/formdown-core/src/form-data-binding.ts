import type { FormDownSchema, FieldError } from './types.js'
import { validateField, validateForm } from './index.js'

type ChangeListener = (data: Record<string, any>) => void
type FieldChangeListener = (field: string, value: any, data: Record<string, any>) => void
type ValidationListener = (field: string, errors: FieldError[]) => void

/**
 * Reactive form data binding system
 * Handles data management with schema-driven defaults and validation
 */
export class FormDataBinding {
  private data: Record<string, any> = {}
  private changeListeners: Set<ChangeListener> = new Set()
  private fieldChangeListeners: Set<FieldChangeListener> = new Set()
  private validationListeners: Set<ValidationListener> = new Set()
  private isUpdating = false // Prevent infinite loops

  constructor(
    private schema: FormDownSchema | null = null,
    initialData: Record<string, any> = {}
  ) {
    // Initialize with schema defaults first, then apply initial data
    this.initializeFromSchema()
    this.updateInternal(initialData, false) // Don't emit events during initialization
  }

  /**
   * Set a single field value
   */
  set(field: string, value: any): void {
    if (this.isUpdating) return

    const oldValue = this.data[field]
    if (oldValue === value) return // No change

    this.data[field] = value
    this.notifyFieldChange(field, value)
    this.notifyChange()
    this.validateField(field, value)
  }

  /**
   * Get a single field value
   */
  get(field: string): any {
    // Priority: current data > schema default > undefined
    if (field in this.data) {
      return this.data[field]
    }

    // Check schema for default value
    if (this.schema && this.schema[field] && this.schema[field].value !== undefined) {
      return this.schema[field].value
    }

    return undefined
  }

  /**
   * Get all form data
   */
  getAll(): Record<string, any> {
    // Merge schema defaults with current data (current data takes priority)
    const schemaDefaults = this.getSchemaDefaults()
    return { ...schemaDefaults, ...this.data }
  }

  /**
   * Update multiple fields at once
   */
  updateAll(newData: Record<string, any>): void {
    this.updateInternal(newData, true)
  }

  /**
   * Reset to schema defaults
   */
  reset(): void {
    const defaults = this.getSchemaDefaults()
    this.data = {}
    this.updateInternal(defaults, true)
  }

  /**
   * Check if data has changed from defaults
   */
  isDirty(): boolean {
    const current = this.getAll()
    const defaults = this.getSchemaDefaults()
    return JSON.stringify(current) !== JSON.stringify(defaults)
  }

  /**
   * Validate a single field
   */
  validateField(field: string, value?: any): FieldError[] {
    if (!this.schema || !this.schema[field]) {
      return []
    }

    const fieldValue = value !== undefined ? value : this.get(field)
    const fieldSchema = { ...this.schema[field], name: field }
    const errors = validateField(fieldValue, fieldSchema)

    this.notifyValidation(field, errors)
    return errors
  }

  /**
   * Validate all fields
   */
  validate(): { isValid: boolean; errors: FieldError[] } {
    if (!this.schema) {
      return { isValid: true, errors: [] }
    }

    const result = validateForm(this.getAll(), this.schema)

    // Notify validation listeners for each field with errors
    const errorsByField = new Map<string, FieldError[]>()
    result.errors.forEach(error => {
      if (!errorsByField.has(error.field)) {
        errorsByField.set(error.field, [])
      }
      errorsByField.get(error.field)!.push(error)
    })

    errorsByField.forEach((errors, field) => {
      this.notifyValidation(field, errors)
    })

    return result
  }

  /**
   * Subscribe to all data changes
   */
  subscribe(listener: ChangeListener): () => void {
    this.changeListeners.add(listener)
    return () => this.changeListeners.delete(listener)
  }

  /**
   * Subscribe to specific field changes
   */
  subscribeToField(listener: FieldChangeListener): () => void {
    this.fieldChangeListeners.add(listener)
    return () => this.fieldChangeListeners.delete(listener)
  }

  /**
   * Subscribe to validation events
   */
  subscribeToValidation(listener: ValidationListener): () => void {
    this.validationListeners.add(listener)
    return () => this.validationListeners.delete(listener)
  }

  /**
   * Update schema (useful for dynamic forms)
   */
  updateSchema(newSchema: FormDownSchema | null): void {
    this.schema = newSchema
    this.initializeFromSchema()
    this.notifyChange()
  }

  /**
   * Get only the default values from schema
   */
  getSchemaDefaults(): Record<string, any> {
    if (!this.schema) return {}

    const defaults: Record<string, any> = {}
    Object.entries(this.schema).forEach(([fieldName, fieldSchema]) => {
      if (fieldSchema.value !== undefined) {
        defaults[fieldName] = fieldSchema.value
      }
    })
    return defaults
  }

  /**
   * Get field names that have been explicitly set (not just defaults)
   */
  getModifiedFields(): string[] {
    return Object.keys(this.data)
  }

  /**
   * Clear a specific field (removes it from data, falling back to schema default)
   */
  clear(field: string): void {
    if (field in this.data) {
      delete this.data[field]
      const newValue = this.get(field) // This will get schema default or undefined
      this.notifyFieldChange(field, newValue)
      this.notifyChange()
    }
  }

  /**
   * Check if a field has been explicitly set (vs just having a schema default)
   */
  hasExplicitValue(field: string): boolean {
    return field in this.data
  }

  /**
   * Create a snapshot of current state for undo/redo functionality
   */
  createSnapshot(): Record<string, any> {
    return { ...this.data }
  }

  /**
   * Restore from a snapshot
   */
  restoreSnapshot(snapshot: Record<string, any>): void {
    this.data = { ...snapshot }
    this.notifyChange()
  }

  private updateInternal(newData: Record<string, any>, emitEvents: boolean): void {
    if (this.isUpdating) return

    this.isUpdating = true
    try {
      const changedFields: Array<{ field: string; value: any }> = []

      Object.entries(newData).forEach(([field, value]) => {
        const oldValue = this.data[field]
        if (oldValue !== value) {
          this.data[field] = value
          changedFields.push({ field, value })
        }
      })

      if (emitEvents && changedFields.length > 0) {
        // Notify field changes
        changedFields.forEach(({ field, value }) => {
          this.notifyFieldChange(field, value)
          this.validateField(field, value)
        })

        // Notify overall change
        this.notifyChange()
      }
    } finally {
      this.isUpdating = false
    }
  }

  private initializeFromSchema(): void {
    if (!this.schema) return

    // Only initialize fields that don't already have values
    Object.entries(this.schema).forEach(([fieldName, fieldSchema]) => {
      if (fieldSchema.value !== undefined && !(fieldName in this.data)) {
        // Don't use set() here to avoid events during initialization
        this.data[fieldName] = fieldSchema.value
      }
    })
  }

  private notifyChange(): void {
    if (this.isUpdating) return

    const currentData = this.getAll()
    this.changeListeners.forEach(listener => {
      try {
        listener(currentData)
      } catch (error) {
        console.error('Error in FormDataBinding change listener:', error)
      }
    })
  }

  private notifyFieldChange(field: string, value: any): void {
    if (this.isUpdating) return

    const currentData = this.getAll()
    this.fieldChangeListeners.forEach(listener => {
      try {
        listener(field, value, currentData)
      } catch (error) {
        console.error('Error in FormDataBinding field change listener:', error)
      }
    })
  }

  private notifyValidation(field: string, errors: FieldError[]): void {
    this.validationListeners.forEach(listener => {
      try {
        listener(field, errors)
      } catch (error) {
        console.error('Error in FormDataBinding validation listener:', error)
      }
    })
  }
}