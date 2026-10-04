import type { FieldOption } from './types.js'

/** An option list as written, read into its options and its "other" choice. */
export interface OptionList {
    options: FieldOption[]
    allowOther: boolean
    /** The "other" choice's text when the author named it (`*(Something else)`). */
    otherLabel?: string
}

/**
 * Splits written text at each `separator` that is not escaped with a backslash. The pieces keep
 * their escapes; `unescape` removes them.
 */
function splitUnescaped(text: string, separator: string, limit = Infinity): string[] {
    const pieces: string[] = []
    let piece = ''
    for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (c === '\\' && i + 1 < text.length) {
            piece += c + text[++i]
        } else if (c === separator && pieces.length < limit - 1) {
            pieces.push(piece)
            piece = ''
        } else {
            piece += c
        }
    }
    pieces.push(piece)
    return pieces
}

/** `\,` → `,`, `\=` → `=`, `\\` → `\`; any other backslash stays as written. */
function unescape(text: string): string {
    return text.replace(/\\([\\,=])/g, '$1')
}

/**
 * Reads one written option: `value=Label` keeps a value apart from the text shown for it,
 * split at the first `=` that is not escaped (`\=`). Anything else — no `=`, or nothing on one
 * side of it — is a value shown as written, which is how every option read before labels existed.
 */
export function parseOption(written: string): FieldOption {
    const text = written.trim()
    const [left, right] = splitUnescaped(text, '=', 2)
    if (right !== undefined) {
        const value = unescape(left.trim())
        const label = unescape(right.trim())
        if (value && label) return value === label ? { value } : { value, label }
    }
    return { value: unescape(text) }
}

/**
 * Reads a comma-separated option list (`options="a,b"`, `{a,b}`, `r[a,b]`): each entry is an
 * option, `*` adds an "other" choice and `*(text)` names it (the first one counts). A comma
 * escaped as `\,` belongs to the option.
 */
export function parseOptionList(written: string): OptionList {
    const list: OptionList = { options: [], allowOther: false }
    for (const entry of splitUnescaped(written, ',').map((e) => e.trim()).filter((e) => e.length > 0)) {
        if (entry === '*') {
            list.allowOther = true
        } else if (entry.startsWith('*(') && entry.endsWith(')')) {
            if (!list.allowOther) {
                list.allowOther = true
                const label = unescape(entry.slice(2, -1))
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

/** Writes options back in the form `parseOptionList` reads, escaping what would split them. */
export function formatOptions(options: readonly FieldOption[]): string {
    const value = (v: string) => v.replace(/[\\,=]/g, '\\$&')
    const label = (l: string) => l.replace(/[\\,]/g, '\\$&')
    return options
        .map((o) => (o.label !== undefined && o.label !== o.value ? `${value(o.value)}=${label(o.label)}` : value(o.value)))
        .join(',')
}
