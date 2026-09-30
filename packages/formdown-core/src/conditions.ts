import type { ConditionalAttributes, FieldCondition } from './types.js'

/** How a field's conditions leave it for the form's current values. */
export interface ConditionState {
    /** `visible-if` holds (or there is none) and `hidden-if` does not. */
    visible: boolean
    /** `enabled-if` holds (or there is none) and `disabled-if` does not. */
    enabled: boolean
    /** `required-if` holds. A field that is hidden or disabled cannot be filled in, and is never required. */
    required: boolean
}

/**
 * Whether a value counts as set: `true` or "true", non-empty text, a non-empty list. `false`, "false",
 * empty text, an empty list and a missing value do not.
 */
function isSet(value: unknown): boolean {
    if (value === undefined || value === null || value === false) return false
    if (Array.isArray(value)) return value.length > 0
    const text = String(value).trim()
    return text !== '' && text.toLowerCase() !== 'false'
}

/**
 * Whether `condition` holds for `data`. `=` compares text exactly — a list (a checkbox group) holds it when
 * one of its values is it; `!=` is its negation; `truthy`/`falsy` ask whether the field is set.
 */
export function conditionHolds(condition: FieldCondition, data: Record<string, unknown>): boolean {
    const value = data[condition.field]
    switch (condition.operator) {
        case '=':
            return Array.isArray(value) ? value.map(String).includes(condition.value ?? '') : isSet(value) && String(value) === condition.value
        case '!=':
            return !conditionHolds({ ...condition, operator: '=' }, data)
        case 'truthy':
            return isSet(value)
        case 'falsy':
            return !isSet(value)
    }
}

/**
 * What a field's conditional attributes make of it for the form's current values. Without conditions a
 * field is visible, enabled and not required by them. A hidden field keeps its value: hiding is not
 * clearing.
 */
export function conditionState(conditions: ConditionalAttributes | undefined, data: Record<string, unknown>): ConditionState {
    const holds = (condition: FieldCondition | undefined, otherwise: boolean) =>
        condition ? conditionHolds(condition, data) : otherwise
    const visible = holds(conditions?.visibleIf, true) && !holds(conditions?.hiddenIf, false)
    const enabled = holds(conditions?.enabledIf, true) && !holds(conditions?.disabledIf, false)
    return { visible, enabled, required: visible && enabled && holds(conditions?.requiredIf, false) }
}
