/**
 * FieldProcessor - Core field processing algorithms
 *
 * ARCHITECTURE NOTE: FieldProcessor provides pure algorithms for field value processing.
 * It does NOT directly manipulate the DOM - that responsibility belongs to the UI layer.
 *
 * This separation enables:
 * - Core package to remain DOM-agnostic (works in Node.js for SSR)
 * - UI components to use platform-specific DOM APIs
 * - Clean testability without JSDOM dependencies in Core
 *
 * This class handles:
 * - Checkbox group processing (single/multiple values)
 * - Radio button "other" option handling
 * - Field value extraction algorithms
 * - Type-specific value processing and conversion
 * - Field validation logic
 */

export interface ProcessResult<T = unknown> {
  success: boolean
  value: T
  errors?: string[]
}

export interface OtherResult {
  hasOtherValue: boolean
  otherValue?: string
  regularValues: string[]
}

/**
 * Value setting result for UI layer to apply
 * UI applies this to actual DOM elements
 */
export interface ValueSetting {
  success: boolean
  elementId: string
  settingType: 'value' | 'checked' | 'textContent'
  value: string | boolean
  error?: string
}

/**
 * Field validation constraints
 */
export interface FieldConstraints {
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string
  patternMessage?: string
}

export type FieldType = 
  | 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' 
  | 'date' | 'time' | 'datetime-local' | 'month' | 'week'
  | 'textarea' | 'select' | 'radio' | 'checkbox' 
  | 'file' | 'color' | 'range' | 'search' | 'hidden'
  | 'button' | 'submit' | 'reset'

export interface FieldElement {
  id: string
  name: string
  value: string
  checked?: boolean
  type: string
  hasAttribute: (name: string) => boolean
  getAttribute: (name: string) => string | null
  textContent?: string | null
}

export interface ElementContainer {
  querySelector: (selector: string) => FieldElement | null
  querySelectorAll: (selector: string) => FieldElement[]
}

export class FieldProcessor {
  /**
   * Process checkbox group values
   * Handles both single checkbox (boolean) and checkbox groups (string[])
   */
  processCheckboxGroup(fieldName: string, container: ElementContainer): ProcessResult {
    try {
      const allCheckboxes = container.querySelectorAll(`input[type="checkbox"][name="${fieldName}"]`)
      
      if (allCheckboxes.length === 0) {
        return { success: false, value: null, errors: ['No checkboxes found'] }
      }

      // Check if this is a single checkbox (value="true") or checkbox group
      const isSingleCheckbox = allCheckboxes.length === 1 && allCheckboxes[0].value === 'true'

      if (isSingleCheckbox) {
        // Single checkbox returns boolean
        return {
          success: true,
          value: allCheckboxes[0].checked || false
        }
      } else {
        // Multiple checkboxes return string array
        const checkedValues: string[] = []
        
        allCheckboxes.forEach(checkbox => {
          if (checkbox.checked) {
            // Handle "other" option checkboxes with empty values
            if (checkbox.value === '' && checkbox.id.includes('_other_checkbox')) {
              const otherInput = container.querySelector(`#${checkbox.id.replace('_checkbox', '_input')}`)
              if (otherInput && otherInput.value.trim()) {
                checkedValues.push(otherInput.value.trim())
              }
            } else if (checkbox.value !== '') {
              checkedValues.push(checkbox.value)
            }
          }
        })
        
        return {
          success: true,
          value: checkedValues
        }
      }
    } catch (error) {
      return {
        success: false,
        value: null,
        errors: [`Checkbox processing error: ${error}`]
      }
    }
  }

  /**
   * Process radio button group values
   * Handles "other" option with text input
   */
  processRadioGroup(fieldName: string, container: ElementContainer): ProcessResult {
    try {
      const allRadios = container.querySelectorAll(`input[type="radio"][name="${fieldName}"]`)
      
      if (allRadios.length === 0) {
        return { success: false, value: '', errors: ['No radio buttons found'] }
      }

      let selectedValue = ''
      
      allRadios.forEach(radio => {
        if (radio.checked) {
          // Handle "other" option radios with empty values
          if (radio.value === '' && radio.id.includes('_other_radio')) {
            const otherInput = container.querySelector(`#${radio.id.replace('_radio', '_input')}`)
            if (otherInput && otherInput.value.trim()) {
              selectedValue = otherInput.value.trim()
            }
          } else {
            selectedValue = radio.value
          }
        }
      })
      
      return {
        success: true,
        value: selectedValue
      }
    } catch (error) {
      return {
        success: false,
        value: '',
        errors: [`Radio processing error: ${error}`]
      }
    }
  }

  /**
   * Process "other" option for radio/checkbox groups
   * Determines if a value is an "other" option and extracts regular values
   */
  processOtherOption(value: string, allowedOptions: string[]): OtherResult {
    const hasOtherValue = !allowedOptions.includes(value) && value.trim() !== ''
    
    return {
      hasOtherValue,
      otherValue: hasOtherValue ? value : undefined,
      regularValues: allowedOptions
    }
  }

  /**
   * Extract field value from any HTML element
   * Universal value extractor that handles all field types
   */
  extractFieldValue(element: FieldElement, type: FieldType): string | number | boolean {
    // Handle contenteditable elements
    if (element.hasAttribute('contenteditable')) {
      return element.textContent?.trim() || ''
    }

    // Handle standard form elements
    switch (type) {
      case 'checkbox':
        // Single checkbox handling - caller should use processCheckboxGroup for groups
        return element.checked || false
        
      case 'radio':
        // Single radio handling - caller should use processRadioGroup for groups
        return element.checked ? element.value : ''
        
      case 'number':
      case 'range':
        const numValue = parseFloat(element.value)
        return isNaN(numValue) ? 0 : numValue
        
      case 'date':
      case 'time':
      case 'datetime-local':
      case 'month':
      case 'week':
        return element.value || ''
        
      case 'file':
        // File handling would need FileList - return filename for now
        return element.value ? element.value.split('\\').pop() || '' : ''
        
      default:
        return element.value || ''
    }
  }

  /**
   * Compute the value to set for a field element
   * Returns a ValueSetting that UI layer should apply to the DOM
   *
   * ARCHITECTURE NOTE: This method computes what value should be set,
   * but does NOT perform actual DOM manipulation. UI layer is responsible
   * for applying the returned ValueSetting to the actual DOM element.
   */
  computeValueSetting(element: FieldElement, value: unknown, type: FieldType): ValueSetting {
    try {
      // Handle contenteditable elements
      if (element.hasAttribute('contenteditable')) {
        const stringValue = Array.isArray(value) ? value.join(', ') : String(value ?? '')
        return {
          success: true,
          elementId: element.id,
          settingType: 'textContent',
          value: stringValue
        }
      }

      switch (type) {
        case 'checkbox':
          if (Array.isArray(value)) {
            // Checkbox group - check if this element's value is in the array
            const isChecked = value.includes(element.value)
            return {
              success: true,
              elementId: element.id,
              settingType: 'checked',
              value: isChecked
            }
          } else if (typeof value === 'boolean') {
            // Single checkbox - use boolean value directly
            return {
              success: true,
              elementId: element.id,
              settingType: 'checked',
              value: value
            }
          } else {
            // Fallback for string values
            return {
              success: true,
              elementId: element.id,
              settingType: 'checked',
              value: Boolean(value)
            }
          }

        case 'radio':
          const stringValue = String(value ?? '')
          const isChecked = element.value === stringValue
          return {
            success: true,
            elementId: element.id,
            settingType: 'checked',
            value: isChecked
          }

        case 'select':
          const selectValue = Array.isArray(value) ? value.join(', ') : String(value ?? '')
          return {
            success: true,
            elementId: element.id,
            settingType: 'value',
            value: selectValue
          }

        case 'number':
        case 'range':
          const numVal = typeof value === 'number' ? value : parseFloat(String(value))
          if (!isNaN(numVal)) {
            return {
              success: true,
              elementId: element.id,
              settingType: 'value',
              value: String(numVal)
            }
          }
          return {
            success: false,
            elementId: element.id,
            settingType: 'value',
            value: '',
            error: 'Invalid number value'
          }

        default:
          const defaultValue = Array.isArray(value) ? value.join(', ') : String(value ?? '')
          return {
            success: true,
            elementId: element.id,
            settingType: 'value',
            value: defaultValue
          }
      }
    } catch (error) {
      return {
        success: false,
        elementId: element.id,
        settingType: 'value',
        value: '',
        error: `Value computation error: ${error}`
      }
    }
  }

  /**
   * @deprecated Use computeValueSetting instead. This method will be removed in v0.4.0.
   * Set field value to any HTML element - kept for backward compatibility
   */
  setFieldValue(element: FieldElement, value: unknown, type: FieldType, _container?: ElementContainer): boolean {
    const setting = this.computeValueSetting(element, value, type)
    return setting.success
  }

  /**
   * Validate field value based on type and constraints
   */
  validateFieldValue(value: unknown, type: FieldType, constraints?: FieldConstraints): ProcessResult<unknown> {
    const errors: string[] = []

    // Required validation
    if (constraints?.required) {
      if (value === null || value === undefined || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        errors.push('This field is required')
      }
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            errors.push('Please enter a valid email address')
          }
        }
        break

      case 'url':
        if (value && typeof value === 'string') {
          try {
            new URL(value)
          } catch {
            errors.push('Please enter a valid URL')
          }
        }
        break

      case 'number':
      case 'range':
        if (value !== '' && value !== null && value !== undefined) {
          const numValue = Number(value)
          if (isNaN(numValue)) {
            errors.push('Please enter a valid number')
          } else {
            if (constraints?.min !== undefined && numValue < constraints.min) {
              errors.push(`Value must be at least ${constraints.min}`)
            }
            if (constraints?.max !== undefined && numValue > constraints.max) {
              errors.push(`Value must be at most ${constraints.max}`)
            }
          }
        }
        break

      case 'tel':
        if (value && typeof value === 'string') {
          // Basic phone number validation
          const phoneRegex = /^[\d\s\-\+\(\)]+$/
          if (!phoneRegex.test(value)) {
            errors.push('Please enter a valid phone number')
          }
        }
        break
    }

    // Pattern validation
    if (constraints?.pattern && value && typeof value === 'string') {
      const regex = new RegExp(constraints.pattern)
      if (!regex.test(value)) {
        errors.push(constraints.patternMessage || 'Value does not match required format')
      }
    }

    // Length validation
    if (typeof value === 'string') {
      if (constraints?.minLength && value.length < constraints.minLength) {
        errors.push(`Must be at least ${constraints.minLength} characters`)
      }
      if (constraints?.maxLength && value.length > constraints.maxLength) {
        errors.push(`Must be at most ${constraints.maxLength} characters`)
      }
    }

    return {
      success: errors.length === 0,
      value: value,
      errors: errors.length > 0 ? errors : undefined
    }
  }

  /**
   * Get field type from element or field definition
   */
  getFieldType(element: FieldElement): FieldType {
    const inputType = element.type?.toLowerCase()
    
    // Map HTML input types to our FieldType
    switch (inputType) {
      case 'email': return 'email'
      case 'password': return 'password'
      case 'tel': return 'tel'
      case 'url': return 'url'
      case 'number': return 'number'
      case 'date': return 'date'
      case 'time': return 'time'
      case 'datetime-local': return 'datetime-local'
      case 'month': return 'month'
      case 'week': return 'week'
      case 'radio': return 'radio'
      case 'checkbox': return 'checkbox'
      case 'file': return 'file'
      case 'color': return 'color'
      case 'range': return 'range'
      case 'search': return 'search'
      case 'hidden': return 'hidden'
      case 'button': return 'button'
      case 'submit': return 'submit'
      case 'reset': return 'reset'
      case 'textarea': return 'textarea'
      case 'select': return 'select'
      default: return 'text'
    }
  }
}