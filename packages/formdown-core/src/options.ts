import type { FieldOption } from './types.js'

/** An option list as written, read into its options and its "other" choice. */
export interface OptionList {
    options: FieldOption[]
    allowOther: boolean
    /** The "other" choice's text when the author named it (`*(Something else)`). */
    otherLabel?: string
}

/**
 * Reads one written option: `value=Label` keeps a value apart from the text shown for it,
 * split at the first `=`. Anything else — no `=`, or nothing on one side of it — is a value
 * shown as written, which is how every option read before labels existed.
 */
export function parseOption(written: string): FieldOption {
    const text = written.trim()
    const at = text.indexOf('=')
    if (at > 0) {
        const value = text.slice(0, at).trim()
        const label = text.slice(at + 1).trim()
        if (value && label) return value === label ? { value } : { value, label }
    }
    return { value: text }
}

/**
 * Reads a comma-separated option list (`options="a,b"`, `{a,b}`, `r[a,b]`): each entry is an
 * option, `*` adds an "other" choice and `*(text)` names it (the first one counts).
 */
export function parseOptionList(written: string): OptionList {
    const list: OptionList = { options: [], allowOther: false }
    for (const entry of written.split(',').map((e) => e.trim()).filter((e) => e.length > 0)) {
        if (entry === '*') {
            list.allowOther = true
        } else if (entry.startsWith('*(') && entry.endsWith(')')) {
            if (!list.allowOther) {
                list.allowOther = true
                const label = entry.slice(2, -1)
                if (label !== 'Other') list.otherLabel = label
            }
        } else {
            list.options.push(parseOption(entry))
        }
    }
    return list
}

/** The text an option shows: its label, or the value itself. */
export function optionLabel(option: FieldOption): string {
    return option.label ?? option.value
}

/** Writes options back in the form `parseOptionList` reads. */
export function formatOptions(options: readonly FieldOption[]): string {
    return options.map((o) => (o.label !== undefined && o.label !== o.value ? `${o.value}=${o.label}` : o.value)).join(',')
}
