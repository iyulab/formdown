/**
 * Conformance corpus: realistic documents that mix every feature a filled-in form
 * relies on. Each fixture is checked under LF, CRLF and CRLF + byte order mark, for
 * the parsed fields, a clean diagnostic list, and lossless editing.
 */
import { readFileSync } from 'fs'
import { join } from 'path'
import { parseFormdown, applyEdits, updateFrontMatter } from '../src/index'

interface Expectation {
    fields: Record<string, unknown>
    /** A front matter change to apply, and the field value it should produce */
    edit: { key: string, value: unknown }
}

const expectations: Record<string, Expectation> = {
    'bug-report-filled.md': {
        fields: {
            title: 'Editor freezes when saving a large file',
            severity: 'high',
            steps: '1. Open a file larger than 10 MB.\n2. Press Ctrl+S.\n3. The window stops responding for about 30 seconds.\n',
            expected: 'The file saves within a second.',
            build: '2024.10.0',
            regression: 'true'
        },
        edit: { key: 'severity', value: 'critical' }
    },
    'bug-report-unicode-names.md': {
        fields: {
            증상: '저장할 때 화면이 멈춘다',
            심각도: '높음',
            재현_단계: '큰 파일을 연다.\n저장한다.\n',
            담당: undefined
        },
        edit: { key: '담당', value: '편집기 팀' }
    },
    'bug-report-quoting.md': {
        fields: {
            message: 'Could not save "notes.md": access denied',
            path: undefined,
            component: undefined,
            ticket: undefined,
            attachments: undefined
        },
        edit: { key: 'message', value: 'He said "it broke"\nand left' }
    },
    'bug-report-environment-table.md': {
        fields: { os: undefined, os_version: undefined, memory: undefined, notes: undefined },
        edit: { key: 'os_version', value: '14.2' }
    },
    'bug-report-template.md': {
        fields: { title: undefined, severity: undefined, steps: undefined, expected: undefined },
        edit: { key: 'title', value: '007' }
    }
}

const read = (name: string) => readFileSync(join(__dirname, 'fixtures', 'conformance', name), 'utf8').replace(/\r\n/g, '\n')

const variants: Record<string, (text: string) => string> = {
    LF: text => text,
    CRLF: text => text.replace(/\n/g, '\r\n'),
    'CRLF + BOM': text => '﻿' + text.replace(/\n/g, '\r\n')
}

/** The document after its front matter block (span ends before the closing line break). */
const body = (source: string) => {
    const frontMatter = parseFormdown(source).frontMatter
    return frontMatter ? source.slice(frontMatter.span.end).replace(/^\r?\n/, '') : source.replace(/^﻿/, '')
}

describe.each(Object.keys(expectations))('%s', name => {
    const expected = expectations[name]

    describe.each(Object.keys(variants))('%s', variant => {
        const source = variants[variant](read(name))
        const parsed = parseFormdown(source)

        it('parses the expected fields in source order with their values', () => {
            expect(parsed.forms.map(f => f.name)).toEqual(Object.keys(expected.fields))
            expect(Object.fromEntries(parsed.forms.map(f => [f.name, f.value]))).toEqual(expected.fields)
        })

        it('reports no diagnostics', () => {
            expect(parsed.diagnostics).toEqual([])
        })

        it('gives every field a span that covers its syntax', () => {
            for (const field of parsed.forms) {
                const text = source.slice(field.span!.start, field.span!.end)
                expect(text).toMatch(/___@|^@/)
                expect(text).toContain(field.name)
            }
        })

        it('does not treat code as fields', () => {
            expect(parsed.forms.map(f => f.name)).not.toEqual(expect.arrayContaining(['lock', 'retry']))
        })

        it('reproduces the source exactly when nothing is edited', () => {
            expect(applyEdits(source, [])).toBe(source)
        })

        it('records a value in front matter without touching the body', () => {
            const edited = updateFrontMatter(source, { [expected.edit.key]: expected.edit.value })
            expect(body(edited)).toBe(body(source))
            const field = parseFormdown(edited).forms.find(f => f.name === expected.edit.key)
            expect(field!.value).toEqual(expected.edit.value)
            expect(parseFormdown(edited).diagnostics).toEqual([])
            if (variant !== 'LF') expect(edited.replace(/\r\n/g, '')).not.toContain('\n')
            if (variant === 'CRLF + BOM') expect(edited.startsWith('﻿---')).toBe(true)
        })
    })
})
