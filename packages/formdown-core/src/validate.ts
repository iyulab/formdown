/**
 * Form validation: what each field declares (required, length, range, format, pattern — see
 * `constraints.ts`), the conditions that hide, disable or require it, and each field type's own validator.
 * For async and server-side validation, use ValidationManager.
 */

import { conditionState } from './conditions.js'
import { constraintErrors, type ConstraintField, type ValidationMessages } from './constraints.js'
import { getDefaultExtensionManager } from './extensions/extension-manager.js'
import type { ConditionalAttributes, FieldError, ValidationResult } from './types.js'

export interface BasicFieldSchema extends ConstraintField {
    /** The field type; a type a plugin adds is checked by that plugin's `validator` as well. */
    type?: string
    /** `required-if` makes the field required; a field its conditions hide or disable is not validated. */
    conditions?: ConditionalAttributes
}

export interface ValidateOptions {
    /** Sentences to say instead of the default ones, by rule (`{label}`, `{min}`, `{max}` filled in). */
    messages?: Partial<ValidationMessages>
}

/** The rules one field's value breaks, as errors on that field. */
export function validateField(value: unknown, schema: BasicFieldSchema, options: ValidateOptions = {}): FieldError[] {
    const field = schema.name || 'field'
    return constraintErrors(value, schema, options.messages).map(({ message }) => ({ field, message }))
}

/**
 * Validates every field that can be filled in now: its declared rules (with `required-if`), then its
 * field type's own `validator` when a plugin registered one.
 */
export function validateForm(
    data: Record<string, unknown>,
    schema: Record<string, BasicFieldSchema>,
    options: ValidateOptions = {},
): ValidationResult {
    const errors: FieldError[] = []

    Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
        const state = conditionState(fieldSchema.conditions, data)
        // A field that cannot be filled in right now is not asked for.
        if (!state.visible || !state.enabled) return
        errors.push(...validateField(data[fieldName], {
            ...fieldSchema,
            name: fieldName,
            required: fieldSchema.required || state.required,
        }, options))
        for (const message of getDefaultExtensionManager().getFieldTypeRegistry().validate(data[fieldName], { ...fieldSchema, name: fieldName })) {
            errors.push({ field: fieldName, message })
        }
    })

    return {
        isValid: errors.length === 0,
        errors
    }
}
