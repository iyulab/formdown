import { conditionState } from './conditions.js'
export * from './types.js'
export * from './parser.js'
export * from './generator.js'
export * from './schema.js'
export { conditionHolds, conditionState, type ConditionState } from './conditions.js'
export { applyEdits, updateFrontMatter, setFieldAttribute, authoringCompletion, type TextEdit, type Completion } from './edit.js'
export { readFrontMatter, type FrontMatterResult } from './source.js'
export * from './extensions/index.js'
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
import { getDefaultExtensionManager } from './extensions/extension-manager.js'

export function parseFormdown(input: string) {
    const parser = new FormdownParser()
    return parser.parseFormdown(input)
}

export function generateFormHTML(content: string | import('./types.js').FormdownContent) {
    const generator = new FormdownGenerator()

    // If input is a string, parse it first
    if (typeof content === 'string') {
        const parser = new FormdownParser()
        const parsedContent = parser.parseFormdown(content)
        return generator.generateHTML(parsedContent)
    }

    // Already parsed content is generated as is
    return generator.generateHTML(content)
}

// Schema extraction
export function getSchema(content: string) {
    return getSchemaFunction(content)
}

// Validation utilities
interface BasicFieldSchema {
    name?: string
    /** The field type; a type a plugin adds is checked by that plugin's `validator` as well. */
    type?: string
    label?: string
    required?: boolean
    errorMessage?: string
    /** `required-if` makes the field required; a field its conditions hide or disable is not validated. */
    conditions?: import('./types.js').ConditionalAttributes
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
 * Basic form validation: required (and `required-if`), then each field type's own `validator` when a
 * plugin registered one. For advanced validation with async support, use ValidationManager.
 */
export function validateForm(data: Record<string, unknown>, schema: Record<string, BasicFieldSchema>): import('./types.js').ValidationResult {
    const errors: import('./types.js').FieldError[] = []

    Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
        const state = conditionState(fieldSchema.conditions, data)
        // A field that cannot be filled in right now is not asked for.
        if (!state.visible || !state.enabled) return
        const fieldErrors = validateField(data[fieldName], {
            ...fieldSchema,
            name: fieldName,
            required: fieldSchema.required || state.required,
        })
        errors.push(...fieldErrors)
        for (const message of getDefaultExtensionManager().getFieldTypeRegistry().validate(data[fieldName], { ...fieldSchema, name: fieldName })) {
            errors.push({ field: fieldName, message })
        }
    })

    return {
        isValid: errors.length === 0,
        errors
    }
}
