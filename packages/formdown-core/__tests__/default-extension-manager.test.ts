import { getDefaultExtensionManager, initializeExtensions, registerHook, parseFormdown } from '../src/index'

describe('default extension manager', () => {
    test('initializeExtensions with options configures the instance parsing runs through', async () => {
        const before = getDefaultExtensionManager()
        await initializeExtensions({ errorStrategy: 'ignore' })
        const configured = getDefaultExtensionManager()

        expect(configured).not.toBe(before)
        expect(configured.getStats().initialized).toBe(true)

        registerHook({
            name: 'pre-parse',
            priority: 0,
            handler: (_context: unknown, value: unknown) => `${value}\n@added: [text]`,
        } as any)
        expect(parseFormdown('@name: [text]').forms.map(field => field.name)).toEqual(['name', 'added'])

        await configured.destroy()
    })

    test('is one instance across calls', () => {
        expect(getDefaultExtensionManager()).toBe(getDefaultExtensionManager())
    })
})
