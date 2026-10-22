/**
 * Writing fields as Formdown text: the inverse of parsing a block field. A host that holds a
 * form as data — fields a tool or a model produced — writes it with these instead of knowing
 * the syntax itself, and parsing the text gives the same fields back.
 */

import { LABEL, CONDITIONAL_ATTRIBUTES, TARGET, defaultLabel, isValidName, pattern, quoteAttributeValue } from './grammar.js'
import { formatOptions } from './options.js'
import { suggestAttributes } from './suggest.js'
import type { Field, FieldCondition } from './types.js'

/** What a field is written from: the parts of a parsed `Field` that the syntax carries. */
export type FieldInput = Pick<Field, 'name' | 'type'> & Partial<Pick<Field,
    | 'label' | 'required' | 'placeholder' | 'description' | 'errorMessage' | 'options' | 'allowOther' | 'otherLabel'
    | 'format' | 'pattern' | 'content' | 'value' | 'conditions' | 'compute' | 'relation' | 'suggest' | 'attributes'
>>

const PARENTHESIZED_LABEL = pattern(String.raw`^${LABEL}$`)
const FULL_TARGET = pattern(String.raw`^${TARGET}$`)
const ATTRIBUTE_KEY = /^[^\s="'\]]+$/
const TYPE = /^[\w-]+$/
/** Attributes the parser keeps on the field itself, so they are written from there. */
const FIELD_PROPERTIES = new Set(['required', 'label', 'placeholder', 'description', 'error-message', 'compute', 'options', 'allow-other',
    'other-label', 'format', 'pattern', 'content', 'value', 'datalist', ...Object.keys(CONDITIONAL_ATTRIBUTES)])
/** The ids the parser gives forms it declares itself; it records them on each field it places in one. */
const GENERATED_FORM = /^formdown-form-(?:default|\d+)$/

/**
 * Write one field as a block field line, `@name(Label): [type attributes]`. Parsing the line
 * gives back the same field.
 *
 * @throws Error when the field cannot be written: a name that is not a valid name, a type that is
 * not one word, an action element (`@[submit "Send"]` — a button, not a field), an attribute name
 * the syntax cannot hold, or a value that is not text, a number or a boolean (put such values in
 * front matter instead)
 */
export function formatField(field: FieldInput): string {
    if (!isValidName(field.name)) throw new Error(`"${field.name}" is not a valid field name`)
    if (!TYPE.test(field.type)) throw new Error(`Field "${field.name}" has a type that is not one word: "${field.type}"`)
    if (field.attributes?.type !== undefined) throw new Error(`"${field.name}" is an action element (@[${String(field.attributes.type)} "…"]), not a field this writes`)

    let head = `@${field.name}`
    const parts: string[] = [field.type]
    const label = field.label
    if (label !== undefined && label !== defaultLabel(field.name)) {
        if (!label.includes('\n') && PARENTHESIZED_LABEL.test(`(${label})`)) head += `(${label})`
        else parts.push(`label=${quoteAttributeValue(label)}`)
    }
    if (field.relation) {
        if (!FULL_TARGET.test(field.relation.target)) throw new Error(`Field "${field.name}" names a record that is not an identifier: "${field.relation.target}"`)
        head += ` ${field.relation.type === 'many-to-many' ? '<->' : '->'} ${field.relation.target}`
    }

    if (field.required) parts.push('required')
    const text = (key: string, value: string | undefined) => { if (value !== undefined) parts.push(`${key}=${quoteAttributeValue(value)}`) }
    text('placeholder', field.placeholder)
    text('description', field.description)
    text('error-message', field.errorMessage)
    if (field.options) parts.push(`options=${quoteAttributeValue(formatOptions(field.options))}`)
    if (field.allowOther) parts.push('allow-other')
    text('other-label', field.otherLabel)
    text('format', field.format)
    text('pattern', field.pattern)
    text('content', field.content)
    if (field.value !== undefined) parts.push(field.value === '' ? 'value' : `value=${attribute(field.name, 'value', field.value)}`)
    for (const [attributeName, property] of Object.entries(CONDITIONAL_ATTRIBUTES)) {
        const condition = field.conditions?.[property]
        if (condition) parts.push(`${attributeName}=${quoteAttributeValue(formatCondition(condition))}`)
    }
    text('compute', field.compute)
    for (const [key, value] of suggestAttributes(field.suggest)) parts.push(`${key}=${attribute(field.name, key, value)}`)

    for (const [key, value] of Object.entries(field.attributes ?? {})) {
        if (value === undefined || FIELD_PROPERTIES.has(key)) continue
        if (key === 'form' && typeof value === 'string' && GENERATED_FORM.test(value)) continue
        if (!ATTRIBUTE_KEY.test(key)) throw new Error(`Field "${field.name}" has an attribute name the syntax cannot hold: "${key}"`)
        parts.push(value === true ? key : `${key}=${attribute(field.name, key, value)}`)
    }

    return `${head}: [${parts.join(' ')}]`
}

/**
 * Write fields as Formdown text, one block field per line. Only the fields are written: form,
 * datalist and group declarations, and the Markdown around the fields, are not.
 */
export function formatFormdown(fields: readonly FieldInput[]): string {
    return fields.map(formatField).join('\n')
}

/** A condition as written in a conditional attribute: `kind=bug`, `kind!=bug`, `agreed`, `!agreed`. */
export function formatCondition(condition: FieldCondition): string {
    switch (condition.operator) {
        case '=': return `${condition.field}=${condition.value ?? ''}`
        case '!=': return `${condition.field}!=${condition.value ?? ''}`
        case 'falsy': return `!${condition.field}`
        default: return condition.field
    }
}

/**
 * An attribute value written so that it reads back as the same value: text quoted, a number or a
 * boolean bare (the parser reads bare `3` and `true` as a number and a boolean).
 */
function attribute(field: string, key: string, value: unknown): string {
    if (typeof value === 'string') return quoteAttributeValue(value)
    if (typeof value === 'boolean') return String(value)
    if (typeof value === 'number' && Number.isFinite(value) && /^-?(\d+|\d*\.\d+)$/.test(String(value))) return String(value)
    throw new Error(`The ${key} of field "${field}" cannot be written as an attribute (${JSON.stringify(value)}): only text, numbers and booleans can; put other values in front matter`)
}
