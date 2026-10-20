import type { Field } from './types.js'

/** A single checkbox written with `switch`: one value turned on or off. */
export function isSwitch(field: Pick<Field, 'type' | 'attributes' | 'options'>): boolean {
    const value = field.attributes?.switch
    return field.type === 'checkbox' && !field.options?.length && (value === true || value === 'true')
}
