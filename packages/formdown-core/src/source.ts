/**
 * Source regions that are not field syntax: leading front matter and code.
 */

import type { SourceSpan } from './types.js'

const FRONT_MATTER = /^\uFEFF?---[ \t]*\r?\n(?:([\s\S]*?)\r?\n)?(?:---|\.\.\.)[ \t]*(?=\r?\n|$)/

/** A front matter block found at the start of a source, before its YAML is read. */
export interface FrontMatterBlock {
    /** The YAML text between the opening and closing lines, unchanged. */
    raw: string
    /** The whole block, opening and closing lines included. */
    span: SourceSpan
    /** Number of source lines the block occupies, closing line included. */
    lineCount: number
}

/**
 * Find YAML front matter at the very start of `source`, as static site generators
 * do: an opening `---` line and a closing `---` or `...` line. Only finds the block;
 * reading its YAML is a front matter reader's job (see `yamlFrontMatter`).
 * `null` when the source does not start with front matter.
 */
export function findFrontMatter(source: string): FrontMatterBlock | null {
    const match = source.match(FRONT_MATTER)
    if (!match) return null
    return {
        raw: match[1] ?? '',
        span: { start: 0, end: match[0].length, line: 1, column: 1 },
        lineCount: match[0].split('\n').length
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
