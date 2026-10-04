/**
 * A condition that cannot be read, or that names a field the form does not have, is reported where its field is:
 * otherwise the field is simply always shown (or never), with nothing to say why.
 */

import { describe, it, expect } from '@jest/globals'
import { parseFormdown } from '../src/index'

const diagnostics = (source: string) =>
    parseFormdown(source).diagnostics?.map(({ code, severity, field, span }) => ({ code, severity, field, line: span?.line })) ?? []

describe('condition diagnostics', () => {
    it('reports a condition that cannot be read, and keeps the field', () => {
        const result = parseFormdown('@a: [text]\n@x: [text visible-if="a == 1"]')
        expect(result.forms.map((f) => f.name)).toEqual(['a', 'x'])
        expect(result.forms[1].conditions).toBeUndefined()
        expect(diagnostics('@a: [text]\n@x: [text visible-if="a == 1"]')).toEqual([
            { code: 'invalid-condition', severity: 'warning', field: 'x', line: 2 },
        ])
        expect(result.diagnostics![0].message).toContain('visible-if="a == 1"')
    })

    it('reports a condition naming a field the form does not have', () => {
        expect(diagnostics('@x: [text required-if="nope=1"]')).toEqual([
            { code: 'condition-unknown-field', severity: 'warning', field: 'x', line: 1 },
        ])
        expect(parseFormdown('@x: [text hidden-if="!nope"]').diagnostics![0].message).toContain('"nope"')
    })

    it('reports a missing name once per field, however many of its conditions name it', () => {
        const result = parseFormdown('@x: [text visible-if="kind=corp" required-if="kind=corp"]')
        expect(result.diagnostics!.map((d) => d.code)).toEqual(['condition-unknown-field'])
        expect(result.diagnostics![0].message).toBe('visible-if and required-if name "kind", which is not a field of this form')
    })

    it('says nothing of conditions on fields the form has, in any of the five', () => {
        const source = [
            '@a: [checkbox]',
            '@b: [text visible-if="a"]',
            '@c: [text hidden-if="!a"]',
            '@d: [text enabled-if="b=yes"]',
            '@e: [text disabled-if="b!=yes"]',
            '@f: [text required-if="a"]',
        ].join('\n')
        expect(diagnostics(source)).toEqual([])
    })

    it('counts an inline field as a field a condition can name', () => {
        expect(diagnostics('Agree? ___@agree[checkbox]\n@why: [text visible-if="agree"]')).toEqual([])
    })
})
