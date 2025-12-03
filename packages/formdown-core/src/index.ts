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
  type ValueSetting,
  type FieldConstraints,
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
  type FieldValidationConstraints,
  type FieldSchema,
  type FormData as ValidationFormData,
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

export function generateFormHTML(content: string | import('./types.js').ParseResult | import('./types.js').FormdownContent) {
    const generator = new FormdownGenerator()

    // If input is a string, parse it first
    if (typeof content === 'string') {
        const parser = new FormdownParser()
        const parsedContent = parser.parseFormdown(content)
        return generator.generateHTML(parsedContent)
    }

    // If input is already parsed content (ParseResult or FormdownContent), use it directly
    return generator.generateHTML(content as import('./types.js').FormdownContent)
}

/**
 * @deprecated Use parseFormdown() instead. This is kept for backward compatibility.
 */
export function parseFormFields(input: string) {
    const parser = new FormdownParser()
    return parser.parse(input)
}

// Schema extraction
export function getSchema(content: string) {
    return getSchemaFunction(content)
}

// Validation utilities
interface BasicFieldSchema {
    name?: string
    label?: string
    required?: boolean
    errorMessage?: string
}

/**
 * Basic field validation. For advanced validation, use ValidationManager.
 */
export function validateField(value: unknown, schema: BasicFieldSchema): import('./types.js').FieldError[] {
    const errors: import('./types.js').FieldError[] = []

    if (schema.required && (!value || String(value).trim() === '')) {
        errors.push({
            field: schema.name || 'field',
            message: schema.errorMessage || `${schema.label || 'Field'} is required`
        })
    }

    return errors
}

/**
 * Basic form validation. For advanced validation with async support, use ValidationManager.
 */
export function validateForm(data: Record<string, unknown>, schema: Record<string, BasicFieldSchema>): import('./types.js').ValidationResult {
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
