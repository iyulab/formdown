export * from './types.js'
export * from './parser.js'
export * from './generator.js'
export * from './schema.js'
export * from './extensions/index.js'
export * from './component-utils.js'
export * from './form-manager.js'
export * from './form-data-binding.js'
export * from './dom-binder.js'
export * from './event-orchestrator.js'

// Export field-processor with renamed conflicting types
export { 
  FieldProcessor, 
  type ProcessResult,
  type OtherResult,
  type FieldType as ProcessorFieldType,
  type FieldElement,
  type ElementContainer 
} from './field-processor.js'

// Export validation-manager with renamed conflicting types
export {
  ValidationManager,
  type ValidationResult as AdvancedValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ValidationRule as AdvancedValidationRule,
  type ValidationPipeline,
  type ValidatorFunction,
  type FieldValidationContext,
  type AsyncValidationConfig,
  CrossFieldValidators,
  type CrossFieldRule
} from './validation-manager.js'
export { FormdownFieldHelper, type FieldHelperOptions, type FieldValue, type FormFieldType } from './field-helper.js'

import { FormdownParser } from './parser.js'
import { FormdownGenerator } from './generator.js'
import { getSchema as getSchemaFunction } from './schema.js'

export function parseFormdown(input: string) {
    const parser = new FormdownParser()
    return parser.parseFormdown(input)
}

export function generateFormHTML(content: string | any) {
    const generator = new FormdownGenerator()
    
    // If input is a string, parse it first
    if (typeof content === 'string') {
        const parser = new FormdownParser()
        const parsedContent = parser.parseFormdown(content)
        return generator.generateHTML(parsedContent)
    }
    
    // If input is already parsed content, use it directly
    return generator.generateHTML(content)
}

// Legacy support for simple form fields parsing
export function parseFormFields(input: string) {
    const parser = new FormdownParser()
    return parser.parse(input)
}

// Schema extraction
export function getSchema(content: string) {
    return getSchemaFunction(content)
}

// Component creation utilities are now in component-utils.js

// Validation utilities
export function validateField(value: any, schema: any): import('./types.js').FieldError[] {
    const errors: import('./types.js').FieldError[] = []
    
    if (schema.required && (!value || value.toString().trim() === '')) {
        errors.push({
            field: schema.name || 'field',
            message: schema.errorMessage || `${schema.label || 'Field'} is required`
        })
    }
    
    return errors
}

export function validateForm(data: Record<string, any>, schema: Record<string, any>): import('./types.js').ValidationResult {
    const errors: import('./types.js').FieldError[] = []
    
    Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
        const fieldErrors = validateField(data[fieldName], { ...fieldSchema, name: fieldName })
        errors.push(...fieldErrors)
    })
    
    return {
        isValid: errors.length === 0,
        errors
    }
}
