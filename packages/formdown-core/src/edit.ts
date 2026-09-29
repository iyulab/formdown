/**
 * Lossless editing of Formdown source text.
 *
 * Edits are expressed against the original source, so text outside an edit is kept
 * byte for byte: line endings, spacing, comments and anything Formdown does not
 * understand.
 */

import { Document, parseDocument, isMap } from 'yaml'
import { readFrontMatter } from './source.js'
import { FormdownParser } from './parser.js'
import { quoteAttributeValue, scanAttributes, tokenizeAttributes } from './grammar.js'

/** Replace `source.slice(start, end)` with `text`. */
export interface TextEdit {
    start: number
    end: number
    text: string
}

/**
 * Apply edits to `source`. Offsets refer to the original source; edits may be given
 * in any order but must not overlap.
 */
export function applyEdits(source: string, edits: readonly TextEdit[]): string {
    const sorted = [...edits].sort((a, b) => a.start - b.start || a.end - b.end)
    for (let i = 0; i < sorted.length; i++) {
        const { start, end } = sorted[i]
        if (start < 0 || end < start || end > source.length) {
            throw new RangeError(`Edit [${start}, ${end}) is outside the source (length ${source.length})`)
        }
        if (i > 0 && start < sorted[i - 1].end) {
            throw new RangeError(`Edits [${sorted[i - 1].start}, ${sorted[i - 1].end}) and [${start}, ${end}) overlap`)
        }
    }
    let result = source
    for (let i = sorted.length - 1; i >= 0; i--) {
        const { start, end, text } = sorted[i]
        result = result.slice(0, start) + text + result.slice(end)
    }
    return result
}

/**
 * Set keys in the document's YAML front matter; `undefined` removes a key. Front
 * matter is created when the document has none. Other keys, comments and the
 * document body are left as they are, and strings are quoted where YAML would
 * otherwise read them as another type (`"007"`, `"true"`).
 *
 * Because front matter values override values written in fields, this is how a
 * filled document records its field values.
 *
 * @throws Error when the existing front matter is not a valid YAML mapping
 */
export function updateFrontMatter(source: string, changes: Record<string, unknown>): string {
    const newline = source.includes('\r\n') ? '\r\n' : '\n'
    const existing = readFrontMatter(source)

    if (existing && existing.diagnostics.length > 0) {
        throw new Error(`Cannot update front matter: ${existing.diagnostics[0].message}`)
    }

    const raw = existing?.frontMatter.raw ?? ''
    const document = raw.trim() ? parseDocument(raw) : new Document({})
    if (!isMap(document.contents)) {
        throw new Error('Cannot update front matter: it is not a mapping')
    }
    for (const [key, value] of Object.entries(changes)) {
        if (value === undefined) document.delete(key)
        else document.set(key, value)
    }

    const yaml = document.toString({ lineWidth: 0 }).replace(/\n$/, '').split('\n').join(newline)
    const block = `---${newline}${yaml}${newline}---`

    if (existing) {
        const { span } = existing.frontMatter
        const bom = source.startsWith('﻿') ? '﻿' : ''
        return applyEdits(source, [{ start: span.start, end: span.end, text: bom + block }])
    }
    const bom = source.startsWith('﻿') ? 1 : 0
    return applyEdits(source, [{ start: bom, end: bom, text: block + newline }])
}

/**
 * Set one attribute of a field, found by name: a string is written as `key="value"`, `true`
 * as a bare `key`, and `false` or `undefined` removes the attribute. Only that attribute
 * changes; the rest of the field and of the source is kept byte for byte.
 *
 * A field's `options` may be written in braces after its name (`@priority{Low,High}: r[]`);
 * they are edited there when they are, and in the brackets otherwise. An inline field
 * without brackets (`___@name`) gets them.
 *
 * @throws Error when the source has no field of that name
 */
export function setFieldAttribute(source: string, field: string, key: string, value: string | boolean | undefined): string {
    const target = new FormdownParser().parseFormdown(source).forms.find(f => f.name === field && f.span)
    if (!target?.span) throw new Error(`The source has no field named "${field}"`)
    const { start, end } = target.span
    const text = source.slice(start, end)

    // Past the name: the braces, then the label, come before any brackets.
    let i = text.indexOf(`@${field}`) + field.length + 1
    let braces: { open: number, close: number } | undefined
    for (;;) {
        if (text[i] === '*') { i++; continue }
        if (text[i] === '{' && text.indexOf('}', i) > i) { braces = { open: i, close: text.indexOf('}', i) }; i = braces.close + 1; continue }
        if (text[i] === '(' && text.indexOf(')', i) > i) { i = text.indexOf(')', i) + 1; continue }
        break
    }

    if (key === 'options' && braces) {
        const replacement = typeof value === 'string' ? `{${value}}` : ''
        return applyEdits(source, [{ start: start + braces.open, end: start + braces.close + 1, text: replacement }])
    }

    const written = value === true ? key : typeof value === 'string' ? `${key}=${quoteAttributeValue(value)}` : undefined
    const open = text.indexOf('[', i)
    const scanned = open === -1 ? undefined : scanAttributes(text, open)
    if (!scanned || 'error' in scanned) {
        if (!written) return source
        return applyEdits(source, [{ start: start + i, end: start + i, text: `[${written}]` }])
    }

    const inside = text.slice(open + 1, scanned.end - 1)
    const at = start + open + 1
    const found = tokenizeAttributes(inside).filter(t => t.key === key)
    if (found.length === 0) {
        if (!written) return source
        const gap = inside.length === 0 || /\s$/.test(inside) ? '' : ' '
        return applyEdits(source, [{ start: at + inside.length, end: at + inside.length, text: gap + written }])
    }
    // The first is rewritten in place; any repeats go, each with the space before it.
    const edits = found.map((t, n) => {
        if (n === 0 && written) return { start: at + t.start, end: at + t.end, text: written }
        let from = t.start
        while (from > 0 && /\s/.test(inside[from - 1])) from--
        if (from === 0) { let to = t.end; while (to < inside.length && /\s/.test(inside[to])) to++; return { start: at, end: at + to, text: '' } }
        return { start: at + from, end: at + t.end, text: '' }
    })
    return applyEdits(source, edits)
}
