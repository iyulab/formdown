/**
 * The website's extension pages are the documents in docs/ (docs/README.md: "same content"), kept by hand.
 * They may differ only in their title and in how they link to each other — a document links to ./NAME.md,
 * the website to /docs/<page> — so an edit to one that misses the other fails here.
 */

import { describe, it, expect } from '@jest/globals'
import { readFileSync } from 'fs'
import { join } from 'path'

const root = join(__dirname, '..', '..', '..')

/** Each document in docs/ with its website page, for the links between them. */
const PAGES: Record<string, string> = {
    'EXTENSION_SYSTEM.md': 'extensions',
    'EXTENSION_EXAMPLES.md': 'extension-examples',
    'SYNTAX.md': 'syntax',
    'SHORTHAND_SYNTAX.md': 'shorthand',
    'STYLING.md': 'styling',
    'ARCHITECTURE.md': 'architecture',
}

/** The pages that are the same document in both places. */
const MIRRORED = ['EXTENSION_SYSTEM.md', 'EXTENSION_EXAMPLES.md']

const read = (path: string) => readFileSync(join(root, path), 'utf8').replace(/\r\n/g, '\n')
/** The text after the title line. */
const body = (text: string) => text.slice(text.indexOf('\n') + 1)

describe('website pages that mirror docs/', () => {
    it.each(MIRRORED)('%s matches its website page but for the title and the links', (document) => {
        const asWebsite = body(read(`docs/${document}`)).replace(/\]\(\.\/([A-Z_]+\.md)\)/g, (link, name: string) =>
            PAGES[name] ? `](/docs/${PAGES[name]})` : link)
        expect(body(read(`site/content/docs/${PAGES[document]}.md`))).toBe(asWebsite)
    })
})
