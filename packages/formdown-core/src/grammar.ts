/**
 * Shared lexical grammar for Formdown source.
 *
 * Every pattern that recognises a field name is assembled from NAME so that the
 * inline, block and shorthand forms agree on what a name is. Patterns built here
 * use the `u` flag, which is required for Unicode property escapes.
 */

/** A field name: a Unicode letter or underscore, then letters, digits or underscores. */
export const NAME = String.raw`[\p{L}_][\p{L}\p{N}_]*`

const FULL_NAME = new RegExp(`^${NAME}$`, 'u')

/** True when `name` is a valid field name. */
export function isValidName(name: string): boolean {
    return FULL_NAME.test(name)
}

/**
 * An attribute list in brackets, `[type key="value" key='value' key=value flag]`.
 * Quoted values may contain `]` and escaped quotes (`\"`, `\'`, `\\`).
 * The capture group holds the text between the brackets.
 */
export const ATTRIBUTES = String.raw`\[((?:[^\]"'\\]|\\.|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')*)\]`

export interface AttributeToken {
    key: string
    /** The value with quotes removed and escapes resolved; undefined for a bare key. */
    value?: string
    quoted: boolean
}

/**
 * Split the text inside attribute brackets into tokens. The text must already be
 * known to be well formed (it matched ATTRIBUTES).
 */
export function tokenizeAttributes(text: string): AttributeToken[] {
    const tokens: AttributeToken[] = []
    let i = 0
    while (i < text.length) {
        while (i < text.length && /\s/.test(text[i])) i++
        if (i >= text.length) break

        let key = ''
        while (i < text.length && !/[\s="']/.test(text[i])) key += text[i++]
        if (!key) { i++; continue }

        if (text[i] !== '=') {
            tokens.push({ key, quoted: false })
            continue
        }
        i++ // '='

        const quote = text[i]
        if (quote === '"' || quote === "'") {
            let value = ''
            i++
            while (i < text.length && text[i] !== quote) {
                if (text[i] === '\\' && i + 1 < text.length) {
                    const next = text[i + 1]
                    value += next === quote || next === '\\' ? next : text[i] + next
                    i += 2
                } else {
                    value += text[i++]
                }
            }
            i++ // closing quote
            tokens.push({ key, value, quoted: true })
        } else {
            let value = ''
            while (i < text.length && !/\s/.test(text[i])) value += text[i++]
            tokens.push({ key, value, quoted: false })
        }
    }
    return tokens
}

/** Interpret a token's value: quoted values stay strings; bare ones may be numbers or booleans. */
export function attributeValue(token: AttributeToken): unknown {
    if (token.value === undefined) return true
    if (token.quoted) return token.value
    if (/^-?\d+$/.test(token.value)) return parseInt(token.value, 10)
    if (/^-?\d*\.\d+$/.test(token.value)) return parseFloat(token.value)
    if (token.value === 'true') return true
    if (token.value === 'false') return false
    return token.value
}

/** Write a string as a double-quoted attribute value that tokenizeAttributes reads back unchanged. */
export function quoteAttributeValue(value: string): string {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

/**
 * Scan attribute brackets starting at `open` (the index of `[`). Returns the index
 * just past the closing `]`, or the reason the brackets do not close on this text.
 */
export function scanAttributes(text: string, open: number): { end: number } | { error: 'unterminated-attributes' | 'unterminated-quoted-value' } {
    let quote: string | null = null
    for (let i = open + 1; i < text.length; i++) {
        const c = text[i]
        if (c === '\\') { i++; continue }
        if (quote) {
            if (c === quote) quote = null
        } else if (c === '"' || c === "'") {
            quote = c
        } else if (c === ']') {
            return { end: i + 1 }
        }
    }
    return { error: quote ? 'unterminated-quoted-value' : 'unterminated-attributes' }
}

/** Build a Unicode-aware RegExp from a pattern source that may reference NAME. */
export function pattern(source: string, flags = ''): RegExp {
    return new RegExp(source, flags.includes('u') ? flags : flags + 'u')
}
