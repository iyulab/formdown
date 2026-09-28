/**
 * Lossless editing of Formdown source text.
 *
 * Edits are expressed against the original source, so text outside an edit is kept
 * byte for byte: line endings, spacing, comments and anything Formdown does not
 * understand.
 */

import { Document, parseDocument, isMap } from 'yaml'
import { readFrontMatter } from './source.js'

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
