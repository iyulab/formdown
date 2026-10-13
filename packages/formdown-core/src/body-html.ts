import { Marked, marked, type Tokens } from 'marked'
import { escapeHtml } from './escape.js'

/**
 * What becomes of HTML written in a form's Markdown body. `trust` renders it, as CommonMark does — for a form you or
 * your team wrote. `escape` shows it as text, and leaves out the link of a Markdown link or image to a `javascript:`,
 * `vbscript:` or `data:` address — for a form someone else wrote, read from a shared folder or sent by a user. The
 * form's own fields are generated either way.
 */
export type BodyHtml = 'trust' | 'escape'

/** Where the parser left a field or a group in the Markdown, as a comment the generator replaces. */
const PLACEHOLDER = /<!--FORMDOWN_(?:FIELD|GROUP_START|GROUP_END)_[^>]*?-->/g

const SCRIPTABLE = /^\s*(?:javascript|vbscript|data):/i

/**
 * HTML written in the body, as text: what the parser put there for the fields is kept, so the fields are still
 * generated where they were. Text from a block of HTML is a paragraph of its own.
 */
function escapeWritten({ text, block }: Tokens.HTML | Tokens.Tag): string {
    let shown = ''
    let last = 0
    const written = (part: string) => {
        if (!part.trim()) return part
        return block ? `<p>${escapeHtml(part.trim())}</p>\n` : escapeHtml(part)
    }
    for (const match of text.matchAll(PLACEHOLDER)) {
        shown += written(text.slice(last, match.index)) + match[0]
        last = match.index + match[0].length
    }
    return shown + written(text.slice(last))
}

const escaping = new Marked({
    renderer: {
        html: escapeWritten,
        link(token) {
            if (!SCRIPTABLE.test(token.href)) return false
            return this.parser.parseInline(token.tokens)
        },
        image(token) {
            if (!SCRIPTABLE.test(token.href)) return false
            return escapeHtml(token.text)
        },
    },
})

/** The body's Markdown as HTML, its own HTML handled as `html` says. */
export function bodyHtml(markdown: string, html: BodyHtml = 'trust'): string {
    return (html === 'escape' ? escaping : marked).parse(markdown, { async: false })
}
