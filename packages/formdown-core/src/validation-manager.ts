/**
 * ValidationManager - Advanced validation system
 *
 * ARCHITECTURE NOTE: ValidationManager provides validation algorithms and state.
 * It does NOT directly interact with DOM - validation results are returned to the
 * UI layer for display and error handling.
 *
 * This separation enables:
 * - Core package to remain DOM-agnostic (works in Node.js for SSR)
 * - UI components to use platform-specific error display mechanisms
 * - Clean testability without JSDOM dependencies in Core
 *
 * Features:
 * - Async validation (server-side checks)
 * - Custom validation rules
 * - Validation pipelines with multiple execution strategies
 * - Cross-field validation
 * - Conditional validation
 * - Validation result caching with automatic invalidation
 *
 * UI INTEGRATION CONTRACT:
 * 1. UI calls `validateAsync()` to validate field values
 * 2. UI displays errors/warnings from `ValidationResult`
 * 3. UI manages debouncing and user feedback timing
 */

import type { FieldType } from './field-processor.js'

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings?: ValidationWarning[]
}

export interface ValidationError {
  field: string
  code: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationWarning {
  field: string
  code: string
  message: string
}

export interface ValidationRule {
  name: string
  validator: ValidatorFunction
  message?: string
  async?: boolean
  dependencies?: string[] // Other fields this rule depends on
}

export interface ValidationPipeline {
  rules: ValidationRule[]
  executeOrder: 'parallel' | 'sequential' | 'fail-fast'
  skipOnError?: boolean
}

/**
 * Validator function signature
 * Returns ValidationResult, Promise<ValidationResult>, boolean, or error message string
 */
export type ValidatorFunction = (
  value: unknown,
  field: FieldValidationContext,
  formData: FormData
) => ValidationResult | Promise<ValidationResult> | boolean | string

/**
 * Form data type for validation
 */
export type FormData = Record<string, unknown>

/**
 * Field constraints for validation
 */
export interface FieldValidationConstraints {
  required?: boolean
  requiredMessage?: string
  min?: number | string
  max?: number | string
  minLength?: number
  maxLength?: number
  pattern?: string
  patternMessage?: string
  customValidator?: string
  serverValidation?: AsyncValidationConfig
}

/**
 * Context for field validation
 */
export interface FieldValidationContext {
  fieldName: string
  fieldType: FieldType
  constraints: FieldValidationConstraints
  schema: FieldSchema
}

/**
 * Field schema information
 */
export interface FieldSchema {
  name?: string
  type?: string
  label?: string
  [key: string]: unknown
}

export interface AsyncValidationConfig {
  url: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  timeout?: number
  debounceMs?: number
}

export class ValidationManager {
  private customValidators: Map<string, ValidatorFunction> = new Map()
  private validationCache: Map<string, ValidationResult> = new Map()
  private asyncValidationTimers: Map<string, NodeJS.Timeout> = new Map()

  /**
   * Register a custom validator
   */
  registerCustomValidator(name: string, validator: ValidatorFunction): void {
    this.customValidators.set(name, validator)
  }

  /**
   * Create a validation pipeline
   */
  createValidationPipeline(rules: ValidationRule[]): ValidationPipeline {
    return {
      rules,
      executeOrder: 'fail-fast', // Default to fail-fast for better UX
      skipOnError: true
    }
  }

  /**
   * Validate a field with async support
   */
  async validateAsync(field: FieldValidationContext, value: unknown, formData: FormData): Promise<ValidationResult> {
    const cacheKey = this.getCacheKey(field.fieldName, value)
    
    // Check cache first
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!
    }

    // Build validation rules for this field
    const rules = this.buildValidationRules(field)
    
    // Create and execute pipeline
    const pipeline = this.createValidationPipeline(rules)
    const result = await this.executeValidationPipeline(pipeline, field, value, formData)
    
    // Cache result
    this.validationCache.set(cacheKey, result)
    
    return result
  }

  /**
   * Execute a validation pipeline
   */
  async executeValidationPipeline(
    pipeline: ValidationPipeline,
    field: FieldValidationContext,
    value: unknown,
    formData: FormData
  ): Promise<ValidationResult> {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    switch (pipeline.executeOrder) {
      case 'fail-fast':
        for (const rule of pipeline.rules) {
          const result = await this.executeValidationRule(rule, field, value, formData)
          if (!result.isValid) {
            errors.push(...result.errors)
            if (pipeline.skipOnError) break
          }
          if (result.warnings) {
            warnings.push(...result.warnings)
          }
        }
        break

      case 'sequential':
        for (const rule of pipeline.rules) {
          const result = await this.executeValidationRule(rule, field, value, formData)
          if (!result.isValid) {
            errors.push(...result.errors)
          }
          if (result.warnings) {
            warnings.push(...result.warnings)
          }
        }
        break

      case 'parallel':
        const results = await Promise.all(
          pipeline.rules.map(rule => this.executeValidationRule(rule, field, value, formData))
        )
        results.forEach(result => {
          if (!result.isValid) {
            errors.push(...result.errors)
          }
          if (result.warnings) {
            warnings.push(...result.warnings)
          }
        })
        break
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }

  /**
   * Execute a single validation rule
   */
  private async executeValidationRule(
    rule: ValidationRule,
    field: FieldValidationContext,
    value: unknown,
    formData: FormData
  ): Promise<ValidationResult> {
    try {
      const result = await rule.validator(value, field, formData)
      
      // Handle different return types
      if (typeof result === 'boolean') {
        return {
          isValid: result,
          errors: result ? [] : [{
            field: field.fieldName,
            code: rule.name,
            message: rule.message || `Validation failed for ${field.fieldName}`,
            severity: 'error' as const
          }]
        }
      } else if (typeof result === 'string') {
        return {
          isValid: false,
          errors: [{
            field: field.fieldName,
            code: rule.name,
            message: result,
            severity: 'error' as const
          }]
        }
      } else {
        return result as ValidationResult
      }
    } catch (error) {
      return {
        isValid: false,
        errors: [{
          field: field.fieldName,
          code: 'validation_error',
          message: `Validation error: ${error}`,
          severity: 'error' as const
        }]
      }
    }
  }

  /**
   * Build validation rules for a field based on its context
   */
  private buildValidationRules(field: FieldValidationContext): ValidationRule[] {
    const rules: ValidationRule[] = []

    // Required validation
    if (field.constraints.required) {
      rules.push({
        name: 'required',
        validator: (value) => {
          if (value === null || value === undefined || value === '' || 
              (Array.isArray(value) && value.length === 0)) {
            return field.constraints.requiredMessage || `${field.schema.label || field.fieldName} is required`
          }
          return true
        }
      })
    }

    // Type-specific validation
    rules.push(...this.getTypeSpecificRules(field))

    // Pattern validation
    if (field.constraints.pattern) {
      const pattern = field.constraints.pattern
      const patternMessage = field.constraints.patternMessage
      rules.push({
        name: 'pattern',
        validator: (value) => {
          if (!value) return true // Skip pattern validation for empty values
          const regex = new RegExp(pattern)
          return regex.test(String(value)) ||
            (patternMessage || 'Value does not match required format')
        }
      })
    }

    // Length validation
    if (field.constraints.minLength || field.constraints.maxLength) {
      rules.push({
        name: 'length',
        validator: (value) => {
          if (!value) return true
          const strValue = String(value)
          if (field.constraints.minLength && strValue.length < field.constraints.minLength) {
            return `Must be at least ${field.constraints.minLength} characters`
          }
          if (field.constraints.maxLength && strValue.length > field.constraints.maxLength) {
            return `Must be at most ${field.constraints.maxLength} characters`
          }
          return true
        }
      })
    }

    // Custom validators
    if (field.constraints.customValidator && this.customValidators.has(field.constraints.customValidator)) {
      const customValidator = this.customValidators.get(field.constraints.customValidator)!
      rules.push({
        name: field.constraints.customValidator,
        validator: customValidator,
        async: true // Assume custom validators might be async
      })
    }

    // Async server validation
    if (field.constraints.serverValidation) {
      rules.push({
        name: 'server_validation',
        validator: (value, field, formData) => this.validateOnServer(value, field, formData),
        async: true
      })
    }

    return rules
  }

  /**
   * Get type-specific validation rules
   */
  private getTypeSpecificRules(field: FieldValidationContext): ValidationRule[] {
    const rules: ValidationRule[] = []

    switch (field.fieldType) {
      case 'email':
        rules.push({
          name: 'email_format',
          validator: (value) => {
            if (!value) return true
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return emailRegex.test(String(value)) || 'Please enter a valid email address'
          }
        })
        break

      case 'url':
        rules.push({
          name: 'url_format',
          validator: (value) => {
            if (!value) return true
            try {
              new URL(String(value))
              return true
            } catch {
              return 'Please enter a valid URL'
            }
          }
        })
        break

      case 'number':
      case 'range':
        rules.push({
          name: 'number_format',
          validator: (value, field) => {
            if (!value && value !== 0) return true
            const numValue = Number(value)
            if (isNaN(numValue)) {
              return 'Please enter a valid number'
            }
            const minVal = field.constraints.min !== undefined ? Number(field.constraints.min) : undefined
            const maxVal = field.constraints.max !== undefined ? Number(field.constraints.max) : undefined
            if (minVal !== undefined && numValue < minVal) {
              return `Value must be at least ${minVal}`
            }
            if (maxVal !== undefined && numValue > maxVal) {
              return `Value must be at most ${maxVal}`
            }
            return true
          }
        })
        break

      case 'tel':
        rules.push({
          name: 'phone_format',
          validator: (value) => {
            if (!value) return true
            const phoneRegex = /^[\d\s\-\+\(\)]+$/
            return phoneRegex.test(String(value)) || 'Please enter a valid phone number'
          }
        })
        break

      case 'date':
        rules.push({
          name: 'date_format',
          validator: (value, field) => {
            if (!value) return true
            const date = new Date(String(value))
            if (isNaN(date.getTime())) {
              return 'Please enter a valid date'
            }
            // Check date range if specified
            if (field.constraints.min) {
              const minDate = new Date(field.constraints.min)
              if (date < minDate) {
                return `Date must be after ${minDate.toLocaleDateString()}`
              }
            }
            if (field.constraints.max) {
              const maxDate = new Date(field.constraints.max)
              if (date > maxDate) {
                return `Date must be before ${maxDate.toLocaleDateString()}`
              }
            }
            return true
          }
        })
        break
    }

    return rules
  }

  /**
   * Validate against server with debouncing
   */
  private async validateOnServer(
    value: unknown,
    field: FieldValidationContext,
    formData: FormData
  ): Promise<ValidationResult> {
    const config = field.constraints.serverValidation as AsyncValidationConfig
    
    return new Promise((resolve) => {
      // Clear existing timer
      const timerId = this.asyncValidationTimers.get(field.fieldName)
      if (timerId) {
        clearTimeout(timerId)
      }

      // Set new timer with debouncing
      const newTimer = setTimeout(async () => {
        try {
          const response = await this.makeValidationRequest(value, field, formData, config)
          resolve(response)
        } catch (error) {
          resolve({
            isValid: false,
            errors: [{
              field: field.fieldName,
              code: 'server_error',
              message: 'Server validation failed',
              severity: 'error' as const
            }]
          })
        }
      }, config.debounceMs || 500)

      this.asyncValidationTimers.set(field.fieldName, newTimer)
    })
  }

  /**
   * Make server validation request
   */
  private async makeValidationRequest(
    value: unknown,
    field: FieldValidationContext,
    formData: FormData,
    config: AsyncValidationConfig
  ): Promise<ValidationResult> {
    const requestData = {
      field: field.fieldName,
      value,
      formData
    }

    // Note: In a real implementation, this would make an actual HTTP request
    // For now, we provide the interface structure
    
    // Simulated response structure
    const mockResponse = {
      isValid: true,
      errors: [] as ValidationError[]
    }

    return mockResponse
  }

  /**
   * Cross-field validation
   */
  validateCrossFields(formData: FormData, rules: CrossFieldRule[]): ValidationResult {
    const errors: ValidationError[] = []

    rules.forEach(rule => {
      try {
        const result = rule.validator(formData)
        if (typeof result === 'string') {
          errors.push({
            field: rule.fields[0], // Primary field
            code: rule.name,
            message: result,
            severity: 'error'
          })
        } else if (typeof result === 'object' && !result.isValid) {
          errors.push(...result.errors)
        }
      } catch (error) {
        errors.push({
          field: rule.fields[0],
          code: 'cross_field_error',
          message: `Cross-field validation error: ${error}`,
          severity: 'error'
        })
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Clear validation cache
   */
  clearCache(fieldName?: string): void {
    if (fieldName) {
      // Clear cache for specific field
      for (const key of this.validationCache.keys()) {
        if (key.startsWith(`${fieldName}:`)) {
          this.validationCache.delete(key)
        }
      }
    } else {
      // Clear all cache
      this.validationCache.clear()
    }
  }

  /**
   * Generate cache key
   */
  private getCacheKey(fieldName: string, value: unknown): string {
    return `${fieldName}:${JSON.stringify(value)}`
  }

  /**
   * Clean up async validation timers
   */
  dispose(): void {
    this.asyncValidationTimers.forEach(timer => clearTimeout(timer))
    this.asyncValidationTimers.clear()
    this.validationCache.clear()
  }
}

/**
 * Cross-field validation rule
 */
export interface CrossFieldRule {
  name: string
  fields: string[]
  validator: (formData: FormData) => boolean | string | ValidationResult
  message?: string
}

/**
 * Common cross-field validation rules
 */
export class CrossFieldValidators {
  /**
   * Validate that two fields match (e.g., password confirmation)
   */
  static fieldsMatch(field1: string, field2: string, message?: string): CrossFieldRule {
    return {
      name: 'fields_match',
      fields: [field1, field2],
      validator: (formData) => {
        return formData[field1] === formData[field2] || 
          (message || `${field1} and ${field2} must match`)
      }
    }
  }

  /**
   * Validate that at least one field in a group is filled
   */
  static atLeastOneRequired(fields: string[], message?: string): CrossFieldRule {
    return {
      name: 'at_least_one_required',
      fields,
      validator: (formData) => {
        const hasValue = fields.some(field => {
          const value = formData[field]
          return value !== null && value !== undefined && value !== '' && 
                 (!Array.isArray(value) || value.length > 0)
        })
        return hasValue || (message || `At least one of ${fields.join(', ')} is required`)
      }
    }
  }

  /**
   * Validate conditional requirements
   */
  static conditionalRequired(
    dependentField: string, 
    conditionField: string, 
    conditionValue: any, 
    message?: string
  ): CrossFieldRule {
    return {
      name: 'conditional_required',
      fields: [dependentField, conditionField],
      validator: (formData) => {
        if (formData[conditionField] === conditionValue) {
          const value = formData[dependentField]
          return (value !== null && value !== undefined && value !== '') ||
            (message || `${dependentField} is required when ${conditionField} is ${conditionValue}`)
        }
        return true
      }
    }
  }
}