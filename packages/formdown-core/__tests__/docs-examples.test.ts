/**
 * Every field line in the documentation's formdown examples (docs/, the site's docs and its sample
 * files) is one the parser reads. A line shaped like a field that it does not read is reported as
 * `unrecognized-field` — the documentation would be teaching a syntax that leaves a form without
 * the field. Example annotations (`// …`, `→ …`, ` # …` after two spaces) are not part of the line.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { parseFormdown } from '../src/index'

const repo = join(__dirname, '..', '..', '..')
const roots = [join(repo, 'docs'), join(repo, 'site', 'content'), join(repo, 'site', 'public', 'samples')]

function files(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name)
        if (statSync(path).isDirectory()) return files(path)
        return /\.(md|fd)$/.test(name) ? [path] : []
    })
}

function exampleLines(path: string): string[] {
    const text = readFileSync(path, 'utf8').replace(/\r\n/g, '\n')
    const blocks = path.endsWith('.fd') ? [text] : [...text.matchAll(/```formdown\n([\s\S]*?)```/g)].map((m) => m[1])
    return blocks
        .flatMap((block) => block.split('\n'))
        .map((line) => line.replace(/\s*(\/\/|→).*$/, '').replace(/\s{2,}#.*$/, '').trim())
        .filter((line) => line.startsWith('@'))
}

test('the documentation shows only field lines the parser reads', () => {
    const unread: string[] = []
    let lines = 0
    for (const path of roots.flatMap(files)) {
        for (const line of exampleLines(path)) {
            lines++
            if (parseFormdown(line).diagnostics!.some((d) => d.code === 'unrecognized-field')) {
                unread.push(`${path.slice(repo.length + 1)}: ${line}`)
            }
        }
    }
    expect(lines).toBeGreaterThan(1000) // the examples were found at all
    expect(unread).toEqual([])
})
