/**
 * A field type that draws its own field container — a `<div>` whose classes include `formdown-field` —
 * gets no second label from Formdown.
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { initializeExtensions, registerPlugin } from '../src/extensions'
import { generateFormHTML } from '../src/index'
import type { Field } from '../src/types'

const count = (text: string, part: string) => text.split(part).length - 1

beforeEach(async () => {
    await initializeExtensions({})
})

describe('a field type with its own container', () => {
    it('labels the built-in toggle once: by its switch', () => {
        const html = generateFormHTML('@notify(알림): [toggle]')
        expect(count(html, '알림')).toBe(1)
        expect(html).not.toContain('<label for="notify"')
    })

    it('takes a container with classes of its own as its own', async () => {
        await registerPlugin({
            metadata: { name: 'stars', version: '1.0.0' },
            fieldTypes: [{
                type: 'stars',
                parser: (line: string): Field | null => {
                    const match = line.match(/^@(\w+):\s*\[stars\]/)
                    return match ? { name: match[1], type: 'stars', label: 'Rate us' } : null
                },
                generator: (field: Field) =>
                    `<div class="formdown-field stars-field"><span>${field.label}</span><input name="${field.name}"></div>`,
            }],
        })
        const html = generateFormHTML('@rating: [stars]')
        expect(count(html, 'Rate us')).toBe(1)
    })

    it('still labels a field type whose markup is the control only', async () => {
        await registerPlugin({
            metadata: { name: 'code', version: '1.0.0' },
            fieldTypes: [{
                type: 'code',
                parser: (line: string): Field | null => {
                    const match = line.match(/^@(\w+):\s*\[code\]/)
                    return match ? { name: match[1], type: 'code', label: 'Code' } : null
                },
                generator: (field: Field) => `<input name="${field.name}" id="${field.name}" class="formdown-field-code">`,
            }],
        })
        expect(generateFormHTML('@zip: [code]')).toContain('<label for="zip">Code</label>')
    })
})
