import {
    ExtensionManager,
    generateFormHTML,
    getDefaultExtensionManager,
    initializeExtensions,
    parseFormdown,
    registerPlugin,
} from '../src/index'

describe('extension manager lifecycle', () => {
    test('initializes again after destroy, keeping its own error reporting', async () => {
        const manager = new ExtensionManager()
        await manager.initialize()
        await manager.destroy()
        await expect(manager.initialize()).resolves.toBeUndefined()
        expect(manager.getStats().fieldTypes).toEqual(['toggle'])

        const errors = jest.spyOn(console, 'error').mockImplementation(() => {})
        manager.getEventEmitter().emit('extension-system-error', { phase: 'test' })
        expect(errors).toHaveBeenCalled()
        errors.mockRestore()
        await manager.destroy()
    })

    test('leaves nothing of a plugin it rejects', async () => {
        await initializeExtensions({ errorStrategy: 'warn' })
        const handler = (_context: unknown, html: string) => `${html}<!--rejected-->`
        await expect(registerPlugin({
            metadata: { name: 'clashing', version: '1.0.0' },
            hooks: [{ name: 'post-generate', priority: 0, handler }],
            fieldTypes: [{ type: 'toggle' }],
        })).rejects.toThrow("Field type 'toggle' is already registered")

        expect(getDefaultExtensionManager().getStats().plugins.map(p => p.name)).toEqual(['formdown-core'])
        expect(generateFormHTML('@phone: [tel]')).not.toContain('<!--rejected-->')
        await getDefaultExtensionManager().destroy()
    })

    test('rejects a plugin that names one field type twice', async () => {
        await initializeExtensions({ errorStrategy: 'warn' })
        await expect(registerPlugin({
            metadata: { name: 'twice', version: '1.0.0' },
            fieldTypes: [{ type: 'stars' }, { type: 'stars' }],
        })).rejects.toThrow("Field type 'stars' is already registered")
        expect(getDefaultExtensionManager().getFieldTypeRegistry().has('stars')).toBe(false)
        await getDefaultExtensionManager().destroy()
    })
})

describe('a field type that throws', () => {
    beforeEach(async () => {
        await initializeExtensions({ errorStrategy: 'warn' })
        await registerPlugin({
            metadata: { name: 'broken', version: '1.0.0' },
            fieldTypes: [{
                type: 'broken',
                parser: (content: string) => {
                    if (content.includes('[broken explode')) throw new Error('parser bug')
                    const match = content.match(/^@(\w+): \[broken\]$/)
                    return match ? { name: match[1], type: 'broken' } : null
                },
                generator: () => {
                    throw new Error('generator bug')
                },
            }],
        } as any)
    })

    afterEach(async () => {
        await getDefaultExtensionManager().destroy()
    })

    test('is reported as a diagnostic and the core parses the field', () => {
        const result = parseFormdown('@x: [broken explode]\n@name: [text]')
        expect(result.forms.map(field => field.name)).toContain('name')
        expect(result.diagnostics).toContainEqual(expect.objectContaining({ code: 'field-type-error', severity: 'error' }))
    })

    test('is reported as a warning and the core renders the field', () => {
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
        const html = generateFormHTML('@rating: [broken]')
        expect(html).toContain('name="rating"')
        expect(warn).toHaveBeenCalledWith(expect.stringContaining('generator bug'))
        warn.mockRestore()
    })
})

describe('events', () => {
    test('a hook event carries its data once wrapped, like a plugin event', async () => {
        const manager = new ExtensionManager()
        await manager.initialize()
        const received: any[] = []
        manager.getEventEmitter().on('hook-registered', event => { received.push(event) })
        manager.registerHook({ name: 'post-generate', priority: 0, handler: (_c: unknown, html: string) => html })
        expect(received[0].data).toEqual(expect.objectContaining({ hook: 'post-generate' }))
        await manager.destroy()
    })
})

test('an inline field is a span tied to its form by data-form only', () => {
    const span = generateFormHTML('Name: ___@name').match(/<span[^>]*>/)![0]
    expect(span).toContain('data-form="formdown-form-default"')
    expect(span).not.toMatch(/\sform="/)
})
