/**
 * The checks a field's own declaration asks for — required, length, range, format and pattern — and the
 * sentences that say which one a value broke. One table of rules, so every path that validates a value
 * (the form's `validate()`, the advanced ValidationManager, the field processor) gives the same answer
 * in the same words.
 */

import type { ValidationRules } from './types.js'

/** The rules a field can break; each names a sentence in {@link ValidationMessages}. */
export type ValidationRule =
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'min'
    | 'max'
    | 'number'
    | 'email'
    | 'url'
    | 'tel'
    | 'date'
    | 'dateMin'
    | 'dateMax'
    | 'pattern'

/**
 * The sentence for each rule. `{label}` is the field's label (its name when it has none), `{min}` and
 * `{max}` the bound the rule holds the value to.
 */
export type ValidationMessages = Record<ValidationRule, string>

/** The sentences used when a host gives none. */
export const defaultValidationMessages: Readonly<ValidationMessages> = Object.freeze({
    required: '{label} is required',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be at most {max} characters',
    min: 'Value must be at least {min}',
    max: 'Value must be at most {max}',
    number: 'Please enter a valid number',
    email: 'Please enter a valid email address',
    url: 'Please enter a valid URL',
    tel: 'Please enter a valid phone number',
    date: 'Please enter a valid date',
    dateMin: 'Date must be on or after {min}',
    dateMax: 'Date must be on or before {max}',
    pattern: 'Value does not match required format',
})

/** What a field declares about the values it takes — the shape `getSchema()` gives each field. */
export interface ConstraintField {
    name?: string
    type?: string
    label?: string
    required?: boolean
    /** Said instead of the required sentence. */
    errorMessage?: string
    pattern?: string
    /** Said instead of the pattern sentence. */
    patternMessage?: string
    validation?: ValidationRules
}

/** A broken rule: which one, and the sentence that says so. */
export interface ConstraintError {
    rule: ValidationRule
    message: string
}

const emailForm = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const telForm = /^[\d\s\-+()]+$/
const dateForm = /^\d{4}-\d{2}-\d{2}$/

/** Whether a value counts as not given: nothing, blank text, or no choice made. */
export function isEmptyValue(value: unknown): boolean {
    if (value === null || value === undefined || value === false) return true
    if (Array.isArray(value)) return value.length === 0
    return String(value).trim() === ''
}

function say(template: string, field: ConstraintField, bounds: { min?: unknown; max?: unknown } = {}): string {
    return template.replace(/\{(label|min|max)\}/g, (_, key: string) => {
        if (key === 'label') return field.label || field.name || 'Field'
        const bound = bounds[key as 'min' | 'max']
        return bound === undefined ? '' : String(bound)
    })
}

function bound(value: number | string | undefined): number | undefined {
    if (value === undefined || value === '') return undefined
    const number = Number(value)
    return Number.isFinite(number) ? number : undefined
}

/**
 * The rules `value` breaks, in the order a person would fix them: a missing value says only that; a
 * value of the wrong form says that before any bound. `messages` replaces some or all of the default
 * sentences; a field's own `errorMessage` and `patternMessage` still win.
 */
export function constraintErrors(
    value: unknown,
    field: ConstraintField,
    messages: Partial<ValidationMessages> = {},
): ConstraintError[] {
    const table = { ...defaultValidationMessages, ...messages }
    const broke = (rule: ValidationRule, bounds?: { min?: unknown; max?: unknown }): ConstraintError => ({
        rule,
        message: say(table[rule], field, bounds),
    })

    if (isEmptyValue(value)) {
        return field.required ? [{ rule: 'required', message: field.errorMessage || say(table.required, field) }] : []
    }

    const rules = field.validation ?? {}
    const errors: ConstraintError[] = []
    const text = Array.isArray(value) ? '' : String(value)

    switch (field.type) {
        case 'number':
        case 'range': {
            const number = typeof value === 'number' ? value : Number(text.trim())
            if (!Number.isFinite(number)) return [broke('number')]
            const min = bound(rules.min)
            const max = bound(rules.max)
            if (min !== undefined && number < min) errors.push(broke('min', { min }))
            if (max !== undefined && number > max) errors.push(broke('max', { max }))
            break
        }
        case 'email':
            if (!emailForm.test(text)) return [broke('email')]
            break
        case 'url':
            try {
                new URL(text)
            } catch {
                return [broke('url')]
            }
            break
        case 'tel':
            if (!telForm.test(text)) return [broke('tel')]
            break
        case 'date': {
            if (!dateForm.test(text) || Number.isNaN(Date.parse(text))) return [broke('date')]
            // ISO dates order as text.
            const min = typeof rules.min === 'string' && dateForm.test(rules.min) ? rules.min : undefined
            const max = typeof rules.max === 'string' && dateForm.test(rules.max) ? rules.max : undefined
            if (min !== undefined && text < min) errors.push(broke('dateMin', { min }))
            if (max !== undefined && text > max) errors.push(broke('dateMax', { max }))
            break
        }
    }

    if (typeof value === 'string') {
        const length = [...value].length
        if (rules.minlength !== undefined && length < rules.minlength) {
            errors.push(broke('minLength', { min: rules.minlength }))
        }
        if (rules.maxlength !== undefined && length > rules.maxlength) {
            errors.push(broke('maxLength', { max: rules.maxlength }))
        }
        const pattern = field.pattern ?? rules.pattern
        if (pattern && !matchesWhole(pattern, value)) {
            errors.push({ rule: 'pattern', message: field.patternMessage || say(table.pattern, field) })
        }
    }

    return errors
}

/** Whether `value` matches `pattern` as a whole, the way the HTML `pattern` attribute does. */
function matchesWhole(pattern: string, value: string): boolean {
    try {
        return new RegExp(`^(?:${pattern})$`, 'v').test(value)
    } catch {
        try {
            return new RegExp(`^(?:${pattern})$`, 'u').test(value)
        } catch {
            // A pattern that does not compile constrains nothing, as in the browser.
            return true
        }
    }
}
