/**
 * Source regions that are not field syntax: leading front matter and code.
 */

import { parseDocument, isMap } from 'yaml'
import type { Diagnostic, FrontMatter } from './types.js'

const FRONT_MATTER = /^﻿?---[ \t]*\r?\n(?:([\s\S]*?)\r?\n)?(?:---|\.\.\.)[ \t]*(?=\r?\n|$)/

export interface FrontMatterResult {
    frontMatter: FrontMatter
    /** Number of source lines the front matter occupies, closing line included. */
    lineCount: number
    diagnostics: Diagnostic[]
}

/**
 * Read YAML front matter from the very start of `source`, as static site generators
 * do: an opening `---` line and a closing `---` or `...` line.
 */
export function readFrontMatter(source: string): FrontMatterResult | null {
    const match = source.match(FRONT_MATTER)
    if (!match) return null

    const raw = match[1] ?? ''
    const span = { start: 0, end: match[0].length, line: 1, column: 1 }
    const diagnostics: Diagnostic[] = []
    let data: Record<string, unknown> = {}

    const document = parseDocument(raw)
    if (document.errors.length > 0) {
        diagnostics.push({
            code: 'front-matter-invalid-yaml',
            message: `Front matter is not valid YAML: ${document.errors[0].message.split('\n')[0]}`,
            severity: 'error',
            span
        })
    } else if (document.contents !== null && !isMap(document.contents)) {
        diagnostics.push({
            code: 'front-matter-not-mapping',
            message: 'Front matter must be a mapping of keys to values',
            severity: 'error',
            span
        })
    } else {
        data = (document.toJS() as Record<string, unknown> | null) ?? {}
    }

    return {
        frontMatter: { data, raw, span },
        lineCount: match[0].split('\n').length,
        diagnostics
    }
}

const FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})/

/**
 * Tracks fenced code blocks line by line. A fence closes on a line of the same
 * character that is at least as long as the opening run; an unclosed fence runs to
 * the end of the document.
 */
export class FenceTracker {
    private fence: string | null = null

    /** Feed the next line. Returns true when the line belongs to a fenced code block. */
    next(line: string): boolean {
        const run = line.match(FENCE_OPEN)?.[1]
        if (this.fence === null) {
            if (run && !(run[0] === '`' && line.slice(line.indexOf(run) + run.length).includes('`'))) {
                this.fence = run
                return true
            }
            return false
        }
        if (run && run[0] === this.fence[0] && run.length >= this.fence.length && line.trim() === run) {
            this.fence = null
        }
        return true
    }
}

const CODE_SPAN = /(`+)(?!`)([\s\S]*?[^`])\1(?!`)/g

// Private-use characters that fill masked code spans; consecutive spans alternate
const MASK = ['', '']
const MASKED_RUN = /+|+/g

/**
 * Blank out inline code spans so field patterns cannot match inside them. The mask
 * has the same length as the input, so offsets into it are offsets into the line.
 * `restore` puts the code spans back into text derived from the mask.
 */
export function maskCodeSpans(line: string): { masked: string, restore: (text: string) => string } {
    const spans: string[] = []
    const masked = line.replace(CODE_SPAN, span => {
        spans.push(span)
        return MASK[(spans.length - 1) % 2].repeat(span.length)
    })
    let next = 0
    return {
        masked,
        restore: text => spans.length === 0 ? text : text.replace(MASKED_RUN, () => spans[next++])
    }
}
