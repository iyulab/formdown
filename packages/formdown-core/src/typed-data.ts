import type { FormDownSchema } from './types.js'

/**
 * The form's values with each number field's value as a number. A field holds what was typed — `"1."`
 * and `"0.50"` stay as written while a person types — so a host that stores or computes reads the values
 * through this. Text that is not a number, and an empty field, are left as they are: validation says so.
 */
export function typedData(data: Record<string, unknown>, schema: FormDownSchema): Record<string, unknown> {
    const typed: Record<string, unknown> = { ...data }
    for (const [name, field] of Object.entries(schema)) {
        if (field.type !== 'number' && field.type !== 'range') continue
        const value = data[name]
        if (typeof value !== 'string' || value.trim() === '') continue
        const number = Number(value.trim())
        if (Number.isFinite(number)) typed[name] = number
    }
    return typed
}
