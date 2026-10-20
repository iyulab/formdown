/**
 * Reading YAML front matter. Kept apart from the parser so that parsing a form
 * without front matter does not carry a YAML implementation.
 */

import { parseDocument, isMap } from 'yaml'
import { findFrontMatter } from './source.js'
import type { Diagnostic, FrontMatter, FrontMatterReader } from './types.js'

/** The standard front matter reader: YAML 1.2, a mapping of keys to values. */
export const yamlFrontMatter: FrontMatterReader = (raw, span) => {
    const diagnostics: Diagnostic[] = []
    const document = parseDocument(raw)
    if (document.errors.length > 0) {
        diagnostics.push({
            code: 'front-matter-invalid-yaml',
            message: `Front matter is not valid YAML: ${document.errors[0].message.split('\n')[0]}`,
            severity: 'error',
            span
        })
        return { data: {}, diagnostics }
    }
    if (document.contents !== null && !isMap(document.contents)) {
        diagnostics.push({
            code: 'front-matter-not-mapping',
            message: 'Front matter must be a mapping of keys to values',
            severity: 'error',
            span
        })
        return { data: {}, diagnostics }
    }
    return { data: (document.toJS() as Record<string, unknown> | null) ?? {}, diagnostics }
}

export interface FrontMatterResult {
    frontMatter: FrontMatter
    /** Number of source lines the front matter occupies, closing line included. */
    lineCount: number
    diagnostics: Diagnostic[]
}

/**
 * Read YAML front matter from the very start of `source`.
 *
 * This is the front matter `parseFormdown` reports, without parsing the fields: use it
 * where only a document's front matter is needed, such as reading many documents' values.
 * `null` when the source does not start with front matter.
 */
export function readFrontMatter(source: string): FrontMatterResult | null {
    const block = findFrontMatter(source)
    if (!block) return null
    const { data, diagnostics } = yamlFrontMatter(block.raw, block.span)
    return {
        frontMatter: { data, raw: block.raw, span: block.span },
        lineCount: block.lineCount,
        diagnostics
    }
}
