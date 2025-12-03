/**
 * DOMBinder - DOM binding algorithms and field registry management
 *
 * ARCHITECTURE NOTE: DOMBinder provides algorithms and state management for DOM bindings.
 * It does NOT directly manipulate the DOM - that responsibility belongs to the UI layer.
 *
 * This separation enables:
 * - Core package to remain DOM-agnostic (works in Node.js for SSR)
 * - UI components to use platform-specific DOM APIs
 * - Clean testability without JSDOM dependencies in Core
 *
 * UI INTEGRATION CONTRACT:
 * 1. UI calls `bindFieldToElement()` to register field-element relationships
 * 2. UI calls `getValueAssignments()` to compute what values to set, then applies them
 * 3. UI implements actual event listeners, calling `extractFieldValue()` for value extraction
 * 4. UI passes extracted values to FormManager for state updates
 *
 * @example
 * // In UI component:
 * const binding = domBinder.bindFieldToElement(fieldName, element, container)
 * element.addEventListener('input', () => {
 *   const value = domBinder.extractFieldValue(element, fieldName, container)
 *   formManager.setFieldValue(fieldName, value)
 * })
 */

import { FieldProcessor, type FieldElement, type ElementContainer } from './field-processor.js'

export interface Binding {
  fieldName: string
  elements: Set<FieldElement>
  unbind: () => void
}

export interface FieldRegistry {
  [fieldName: string]: Set<FieldElement>
}

/**
 * Field change event structure for UI-to-Core communication
 */
export interface FieldChangeEvent {
  type: 'field-change'
  detail: {
    fieldName: string
    value: unknown
    sourceElement: FieldElement
  }
}

/**
 * Value assignment for UI to apply to DOM
 */
export interface ValueAssignment {
  fieldName: string
  element: FieldElement
  value: unknown
  fieldType: string
}

export class DOMBinder {
  private fieldProcessor: FieldProcessor
  private fieldRegistry: FieldRegistry = {}
  private syncLock = false

  constructor() {
    this.fieldProcessor = new FieldProcessor()
  }

  /**
   * Register a field-element binding
   * UI should call this when setting up form field listeners
   */
  bindFieldToElement(fieldName: string, element: FieldElement): Binding {
    if (!this.fieldRegistry[fieldName]) {
      this.fieldRegistry[fieldName] = new Set()
    }
    this.fieldRegistry[fieldName].add(element)

    return {
      fieldName,
      elements: this.fieldRegistry[fieldName],
      unbind: () => this.unbindElement(fieldName, element)
    }
  }

  /**
   * Extract field value from an element
   * UI should call this in event handlers to get the current value
   */
  extractFieldValue(element: FieldElement, fieldName: string, container: ElementContainer): unknown {
    const fieldType = this.fieldProcessor.getFieldType(element)

    // Handle checkbox and radio groups specially
    if (element.type === 'checkbox') {
      const result = this.fieldProcessor.processCheckboxGroup(fieldName, container)
      return result.success ? result.value : null
    }

    if (element.type === 'radio') {
      const result = this.fieldProcessor.processRadioGroup(fieldName, container)
      return result.success ? result.value : ''
    }

    // Standard field value extraction
    return this.fieldProcessor.extractFieldValue(element, fieldType)
  }

  /**
   * Compute value assignments for syncing form data to DOM
   * UI should iterate over results and apply values to elements
   *
   * @param formData - Current form data to sync
   * @returns Array of value assignments for UI to apply
   */
  getValueAssignments(formData: Record<string, unknown>): ValueAssignment[] {
    const assignments: ValueAssignment[] = []

    const registeredFields = Object.keys(this.fieldRegistry)
    const dataFields = Object.keys(formData)
    const fieldsToSync = [...new Set([...registeredFields, ...dataFields])]

    fieldsToSync.forEach(fieldName => {
      const value = formData[fieldName] ?? ''
      const boundElements = this.fieldRegistry[fieldName]

      if (boundElements) {
        boundElements.forEach(element => {
          assignments.push({
            fieldName,
            element,
            value,
            fieldType: this.fieldProcessor.getFieldType(element)
          })
        })
      }
    })

    return assignments
  }

  /**
   * Check and set sync lock to prevent infinite update loops
   * UI should check this before applying value changes
   */
  acquireSyncLock(): boolean {
    if (this.syncLock) return false
    this.syncLock = true
    return true
  }

  /**
   * Release sync lock after UI has applied value changes
   */
  releaseSyncLock(): void {
    this.syncLock = false
  }

  /**
   * Check if sync is currently in progress
   */
  isSyncing(): boolean {
    return this.syncLock
  }

  /**
   * Create a field change event structure
   * UI can use this for consistent event formatting
   */
  createFieldChangeEvent(fieldName: string, value: unknown, sourceElement: FieldElement): FieldChangeEvent {
    return {
      type: 'field-change',
      detail: {
        fieldName,
        value,
        sourceElement
      }
    }
  }

  /**
   * Get the FieldProcessor instance for direct access to processing utilities
   */
  getFieldProcessor(): FieldProcessor {
    return this.fieldProcessor
  }

  /**
   * Unbind a specific element from a field
   */
  private unbindElement(fieldName: string, element: FieldElement): void {
    if (this.fieldRegistry[fieldName]) {
      this.fieldRegistry[fieldName].delete(element)

      if (this.fieldRegistry[fieldName].size === 0) {
        delete this.fieldRegistry[fieldName]
      }
    }
  }

  /**
   * Get all registered field names
   */
  getRegisteredFields(): string[] {
    return Object.keys(this.fieldRegistry)
  }

  /**
   * Get all elements bound to a field
   */
  getFieldElements(fieldName: string): Set<FieldElement> | undefined {
    return this.fieldRegistry[fieldName]
  }

  /**
   * Clear all bindings
   * UI should call this on component disconnection
   */
  clearAllBindings(): void {
    this.fieldRegistry = {}
    this.syncLock = false
  }

  /**
   * Validate all bound fields using FieldProcessor
   */
  validateAllFields(formData: Record<string, unknown>, schema?: Record<string, unknown>): Record<string, unknown> {
    const validationResults: Record<string, unknown> = {}

    Object.keys(this.fieldRegistry).forEach(fieldName => {
      const value = formData[fieldName]
      const fieldSchema = schema?.[fieldName] as Record<string, unknown> | undefined

      if (fieldSchema) {
        const fieldType = this.fieldProcessor.getFieldType(fieldSchema as unknown as FieldElement)
        const result = this.fieldProcessor.validateFieldValue(value, fieldType, fieldSchema)
        validationResults[fieldName] = result
      }
    })

    return validationResults
  }
}
