/**
 * Basic validation: required fields, conditions, and each field type's own validator.
 * For advanced validation with async support, use ValidationManager.
 */

import { conditionState } from './conditions.js'
import { getDefaultExtensionManager } from './extensions/extension-manager.js'
import type { ConditionalAttributes, FieldError, ValidationResult } from './types.js'

export interface BasicFieldSchema {
    name?: string
    /** The field type; a type a plugin adds is checked by that plugin's `validator` as well. */
    type?: string
    label?: string
    required?: boolean
    errorMessage?: string
    /** `required-if` makes the field required; a field its conditions hide or disable is not validated. */
    conditions?: ConditionalAttributes
}

/**
 * Basic field validation. For advanced validation, use ValidationManager.
 */
export function validateField(value: unknown, schema: BasicFieldSchema): FieldError[] {
    const errors: FieldError[] = []

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
export function validateForm(data: Record<string, unknown>, schema: Record<string, BasicFieldSchema>): ValidationResult {
    const errors: FieldError[] = []

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
