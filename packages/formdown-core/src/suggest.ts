/**
 * `suggest:*` attributes: what a form says about suggesting a value for a field. The parser moves them from a
 * field's attributes into `field.suggest`, checked, so they reach a host that suggests values and never the page.
 */

import type { Diagnostic, Field, FieldSuggest } from './types.js'

const PREFIX = 'suggest:'
const ROLES = ['judged', 'observed'] as const
const POLICIES = ['offer', 'confirm', 'off'] as const

/** The attribute names, in the order they are written. */
const NAMES = ['role', 'policy', 'evidence', 'parent', 'coarse', 'must-catch'] as const

type Report = (diagnostic: Omit<Diagnostic, 'severity'>) => void

/**
 * Moves each field's `suggest:*` attributes into `field.suggest`. A name that is not one of them, or a value
 * that cannot be read, is reported (a warning) and left out; the field is otherwise unaffected.
 */
export function liftSuggestions(fields: Field[], report: Report): void {
    const names = new Set(fields.map(field => field.name))
    for (const field of fields) {
        const suggest = readField(field, names, report)
        if (suggest) field.suggest = suggest
    }
}

function readField(field: Field, names: ReadonlySet<string>, report: Report): FieldSuggest | undefined {
    const attributes = field.attributes
    if (!attributes) return undefined
    const suggest: FieldSuggest = {}
    const where = { field: field.name, ...(field.span && { span: field.span }) }
    const invalid = (attribute: string, value: unknown, expected: string) => report({
        code: 'suggest-invalid',
        message: `"${field.name}" has ${PREFIX}${attribute}=${JSON.stringify(value)}, which is not ${expected}: it is ignored`,
        ...where
    })

    for (const [key, value] of Object.entries(attributes)) {
        if (!key.startsWith(PREFIX)) continue
        delete attributes[key]
        const name = key.slice(PREFIX.length)
        switch (name) {
            case 'role':
                if (isOneOf(value, ROLES)) suggest.role = value
                else invalid(name, value, 'judged or observed')
                break
            case 'policy':
                if (isOneOf(value, POLICIES)) suggest.policy = value
                else invalid(name, value, 'offer, confirm or off')
                break
            case 'evidence': {
                const flag = value === true || value === 'true' ? true : value === false || value === 'false' ? false : undefined
                if (flag === undefined) invalid(name, value, 'true or false')
                else suggest.evidence = flag
                break
            }
            case 'parent':
                if (typeof value !== 'string' || value === '' || value === field.name) invalid(name, value, 'the name of another field')
                else if (!names.has(value)) report({
                    code: 'suggest-parent-unknown',
                    message: `"${field.name}" depends on "${value}" (${PREFIX}parent), which is not a field of this form: it is ignored`,
                    related: value,
                    ...where
                })
                else suggest.parent = value
                break
            case 'coarse': {
                const count = typeof value === 'number' ? value : typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : NaN
                if (Number.isInteger(count) && count >= 1) suggest.coarse = count
                else invalid(name, value, 'a whole number of characters from 1')
                break
            }
            case 'must-catch': {
                const values = typeof value === 'string' || typeof value === 'number'
                    ? String(value).split(',').map(text => text.trim()).filter(text => text !== '')
                    : []
                if (values.length === 0) { invalid(name, value, 'a list of values'); break }
                const listed = field.options?.length ? new Set(field.options.map(option => option.value)) : undefined
                const kept = listed ? values.filter(text => listed.has(text)) : values
                for (const text of values.filter(text => !kept.includes(text))) report({
                    code: 'suggest-must-catch-unlisted',
                    message: `"${field.name}" names "${text}" as a value not to miss (${PREFIX}must-catch), but it is not one of its options: it is ignored`,
                    related: text,
                    ...where
                })
                if (kept.length) suggest.mustCatch = kept
                break
            }
            default:
                report({
                    code: 'suggest-unknown',
                    message: `"${field.name}" has ${key}, which formdown does not know (${NAMES.map(n => PREFIX + n).join(', ')}): it is ignored`,
                    ...where
                })
        }
    }

    if (suggest.role === 'observed' && (suggest.policy === 'offer' || suggest.policy === 'confirm')) {
        report({
            code: 'suggest-policy-on-observed',
            message: `"${field.name}" is observed, so ${PREFIX}policy=${suggest.policy} has nothing to suggest: it is ignored`,
            ...where
        })
        delete suggest.policy
    }
    return Object.keys(suggest).length ? suggest : undefined
}

function isOneOf<T extends string>(value: unknown, allowed: readonly T[]): value is T {
    return typeof value === 'string' && (allowed as readonly string[]).includes(value)
}

/** The `suggest:*` attributes that write `suggest` back, as name and value, in a fixed order. */
export function suggestAttributes(suggest: FieldSuggest | undefined): Array<[string, string | number | boolean]> {
    if (!suggest) return []
    const values: Record<(typeof NAMES)[number], string | number | boolean | undefined> = {
        role: suggest.role,
        policy: suggest.policy,
        evidence: suggest.evidence,
        parent: suggest.parent,
        coarse: suggest.coarse,
        'must-catch': suggest.mustCatch?.join(', ')
    }
    return NAMES.flatMap(name => values[name] === undefined ? [] : [[PREFIX + name, values[name]!] as [string, string | number | boolean]])
}
