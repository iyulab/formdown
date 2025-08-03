/**
 * DOMBinder - Core DOM manipulation and binding logic
 * 
 * This class centralizes DOM manipulation logic that was previously scattered
 * in the UI components. It provides a clean interface for:
 * - Binding form data to DOM elements
 * - Setting up event delegation
 * - Managing field registries
 * - Synchronizing data and UI state
 */

import { FieldProcessor, type FieldElement, type ElementContainer } from './field-processor.js'
import type { FormManager } from './form-manager.js'

export interface Binding {
  fieldName: string
  elements: Set<FieldElement>
  unbind: () => void
}

export interface DOMBindingOptions {
  container: ElementContainer
  formManager: FormManager
  selectOnFocus?: boolean
  preventInfiniteLoops?: boolean
}

export interface FieldRegistry {
  [fieldName: string]: Set<FieldElement>
}

export class DOMBinder {
  private fieldProcessor: FieldProcessor
  private fieldRegistry: FieldRegistry = {}
  private eventListeners: Map<FieldElement, Array<{ event: string, handler: EventListener }>> = new Map()
  private isUpdatingUI = false

  constructor() {
    this.fieldProcessor = new FieldProcessor()
  }

  /**
   * Bind a field to its DOM elements
   * Creates a binding that keeps the field and elements in sync
   */
  bindFieldToElement(fieldName: string, element: FieldElement, container: ElementContainer): Binding {
    // Register the field
    if (!this.fieldRegistry[fieldName]) {
      this.fieldRegistry[fieldName] = new Set()
    }
    this.fieldRegistry[fieldName].add(element)

    // Set up event handlers for this element
    this.setupElementEventHandlers(element, fieldName, container)

    return {
      fieldName,
      elements: this.fieldRegistry[fieldName],
      unbind: () => this.unbindElement(fieldName, element)
    }
  }

  /**
   * Synchronize form data with DOM elements
   * Updates DOM elements to match the current form data
   */
  syncFormData(formData: Record<string, any>, container: ElementContainer): void {
    if (this.isUpdatingUI) return // Prevent infinite loops

    this.isUpdatingUI = true

    try {
      // Get all fields to sync (both registered and data fields)
      const registeredFields = Object.keys(this.fieldRegistry)
      const dataFields = Object.keys(formData)
      const fieldsToSync = [...new Set([...registeredFields, ...dataFields])]

      fieldsToSync.forEach(fieldName => {
        const value = formData[fieldName] ?? '' // Use current data or empty string
        const boundElements = this.fieldRegistry[fieldName]

        if (boundElements) {
          boundElements.forEach(element => {
            this.setElementValue(element, value, container)
          })
        }
      })
    } finally {
      this.isUpdatingUI = false
    }
  }

  /**
   * Set up event delegation for a container
   * Handles all form events through delegation for better performance
   */
  setupEventDelegation(container: ElementContainer, formManager: FormManager): void {
    // Note: In a real DOM implementation, this would set up event delegation
    // using container.addEventListener with event delegation logic
    
    // For now, we provide the interface that UI components can implement
    // The actual event delegation would be handled by the UI layer
    // but using the standardized event handling logic from this class
  }

  /**
   * Set up event handlers for a specific element
   */
  private setupElementEventHandlers(element: FieldElement, fieldName: string, container: ElementContainer): void {
    const handleValueChange = () => {
      if (this.isUpdatingUI) return // Prevent infinite loops during UI sync

      let value: any

      // Handle different input types
      if (element.type === 'checkbox') {
        // Use FieldProcessor for complex checkbox logic
        const result = this.fieldProcessor.processCheckboxGroup(fieldName, container)
        if (result.success) {
          value = result.value
        } else {
          console.error('Checkbox processing failed:', result.errors)
          return
        }
      } else if (element.type === 'radio') {
        // Use FieldProcessor for radio button groups
        const result = this.fieldProcessor.processRadioGroup(fieldName, container)
        if (result.success) {
          value = result.value
        } else {
          console.error('Radio processing failed:', result.errors)
          return
        }
      } else {
        // Use FieldProcessor for standard field value extraction
        const fieldType = this.fieldProcessor.getFieldType(element)
        value = this.fieldProcessor.extractFieldValue(element, fieldType)
      }

      // Emit change event (to be handled by FormManager or UI component)
      this.emitFieldChange(fieldName, value, element)
    }

    // Store event listeners for cleanup
    const listeners = [
      { event: 'input', handler: handleValueChange },
      { event: 'change', handler: handleValueChange }
    ]

    this.eventListeners.set(element, listeners)

    // In a real implementation, these would be attached to the actual DOM element
    // element.addEventListener('input', handleValueChange)
    // element.addEventListener('change', handleValueChange)
  }

  /**
   * Set up special handlers for "other" option inputs
   */
  setupOtherInputHandlers(element: FieldElement, fieldName: string, container: ElementContainer): void {
    const handleOtherInputChange = () => {
      if (this.isUpdatingUI) return

      // Find associated radio or checkbox
      const otherRadio = container.querySelector(`#${fieldName}_other_radio`)
      const otherCheckbox = container.querySelector(`#${fieldName}_other_checkbox`)
      
      const inputValue = element.value.trim()
      
      if (otherRadio && inputValue) {
        // For radio buttons, check the "other" radio and trigger field update
        // Note: In real implementation, would set otherRadio.checked = true
        this.emitFieldChange(fieldName, inputValue, element)
      } else if (otherCheckbox && inputValue) {
        // For checkboxes, check the "other" checkbox and trigger group update
        // Note: In real implementation, would set otherCheckbox.checked = true
        const result = this.fieldProcessor.processCheckboxGroup(fieldName, container)
        if (result.success) {
          this.emitFieldChange(fieldName, result.value, element)
        }
      }
    }

    const listeners = [
      { event: 'input', handler: handleOtherInputChange },
      { event: 'change', handler: handleOtherInputChange }
    ]

    this.eventListeners.set(element, listeners)
  }

  /**
   * Set up contenteditable specific behaviors
   */
  setupContentEditableBehaviors(element: FieldElement, options: { placeholder?: string, selectOnFocus?: boolean }): void {
    const { placeholder, selectOnFocus } = options

    const handleFocus = () => {
      if (element.textContent?.trim() === placeholder) {
        // Note: In real implementation, would clear textContent
      }

      if (selectOnFocus) {
        // Note: In real implementation, would select all text
        // const selection = window.getSelection()
        // const range = document.createRange()
        // range.selectNodeContents(element)
        // selection?.removeAllRanges()
        // selection?.addRange(range)
      }
    }

    const handleBlur = () => {
      if (!element.textContent?.trim()) {
        // Note: In real implementation, would set placeholder text
        // element.textContent = placeholder || ''
      }
    }

    const listeners = [
      { event: 'focus', handler: handleFocus },
      { event: 'blur', handler: handleBlur }
    ]

    this.eventListeners.set(element, listeners)
  }

  /**
   * Set element value using FieldProcessor
   */
  private setElementValue(element: FieldElement, value: any, container: ElementContainer): void {
    const fieldType = this.fieldProcessor.getFieldType(element)
    this.fieldProcessor.setFieldValue(element, value, fieldType, container)
  }

  /**
   * Emit field change event
   * This would be connected to FormManager or UI component event system
   */
  private emitFieldChange(fieldName: string, value: any, sourceElement: FieldElement): void {
    // Note: In a real implementation, this would emit events that
    // the FormManager or UI component would listen to
    
    // For now, we provide the interface that can be used by UI components
    const event = {
      type: 'field-change',
      detail: {
        fieldName,
        value,
        sourceElement
      }
    }

    // UI components would implement their own event emission logic
    // but use this standardized event format
  }

  /**
   * Unbind a specific element from a field
   */
  private unbindElement(fieldName: string, element: FieldElement): void {
    // Remove from field registry
    if (this.fieldRegistry[fieldName]) {
      this.fieldRegistry[fieldName].delete(element)
      
      // Clean up empty field registry entries
      if (this.fieldRegistry[fieldName].size === 0) {
        delete this.fieldRegistry[fieldName]
      }
    }

    // Clean up event listeners
    const listeners = this.eventListeners.get(element)
    if (listeners) {
      // Note: In real implementation, would remove event listeners
      // listeners.forEach(({ event, handler }) => {
      //   element.removeEventListener(event, handler)
      // })
      this.eventListeners.delete(element)
    }
  }

  /**
   * Get all registered fields
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
   */
  clearAllBindings(): void {
    // Clear field registry
    Object.keys(this.fieldRegistry).forEach(fieldName => {
      const elements = this.fieldRegistry[fieldName]
      elements.forEach(element => {
        this.unbindElement(fieldName, element)
      })
    })

    this.fieldRegistry = {}
    this.eventListeners.clear()
  }

  /**
   * Validate all bound fields
   */
  validateAllFields(formData: Record<string, any>, schema?: Record<string, any>): Record<string, any> {
    const validationResults: Record<string, any> = {}

    Object.keys(this.fieldRegistry).forEach(fieldName => {
      const value = formData[fieldName]
      const fieldSchema = schema?.[fieldName]
      
      if (fieldSchema) {
        const fieldType = this.fieldProcessor.getFieldType(fieldSchema)
        const result = this.fieldProcessor.validateFieldValue(value, fieldType, fieldSchema)
        validationResults[fieldName] = result
      }
    })

    return validationResults
  }
}