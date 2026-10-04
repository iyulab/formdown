/**
 * A field type's own validator, reached through validateForm — the check `<formdown-ui>`'s validate() runs.
 */

import { describe, it, expect, beforeEach } from '@jest/globals'
import { initializeExtensions, registerPlugin } from '../src/extensions'
import { getSchema, validateForm } from '../src/index'
import type { Field } from '../src/types'

const handlePlugin = {
    metadata: { name: 'handle-field', version: '1.0.0' },
    fieldTypes: [{
        type: 'handle',
        parser: (content: string): Field | null => {
            const match = content.match(/^@(\w+):\s*\[handle(\s+required)?\]/)
            return match ? { name: match[1], type: 'handle', label: match[1], required: !!match[2] } : null
        },
        validator: (value: unknown, field: { name: string; label?: string }) =>
            value && !String(value).startsWith('@') ? [`${field.label} starts with @`] : [],
    }],
}

beforeEach(async () => {
    // A fresh default instance: what an earlier test registered does not carry over.
    await initializeExtensions({})
    await registerPlugin(handlePlugin)
})

describe('validateForm and field type validators', () => {
    it('reports what the field type’s validator finds, as errors of that field', () => {
        const schema = getSchema('@owner: [handle]')
        expect(schema.owner.type).toBe('handle')
        expect(validateForm({ owner: 'iyulab' }, schema)).toEqual({ isValid: false, errors: [{ field: 'owner', message: 'owner starts with @' }] })
        expect(validateForm({ owner: '@iyulab' }, schema)).toEqual({ isValid: true, errors: [] })
    })

    it('checks required itself; the validator only adds what is particular to the type', () => {
        const schema = getSchema('@owner: [handle required]')
        expect(validateForm({}, schema).errors).toEqual([{ field: 'owner', message: 'owner is required' }])
    })

    it('leaves fields of the core types to the core checks', () => {
        const schema = getSchema('@name: [text]')
        expect(validateForm({ name: 'iyulab' }, schema)).toEqual({ isValid: true, errors: [] })
    })
})
