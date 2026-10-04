import { generateFormHTML, getDefaultExtensionManager, initializeExtensions, parseFormdown } from '../src/index'

// The form components initialize the extension system as they connect, so rendering after
// initialization is what every page using them gets. It must be the core's own rendering.
const source =
    '@name(Full name)*: [text placeholder="Jane"]\n' +
    '@email: [email]\n' +
    '@pick: [select options="<img src=x>,B \\"quoted\\""]\n' +
    '@level: [range min=0 max=10]\n' +
    '@note: [textarea]'

describe('rendering once the extension system is initialized', () => {
    let uninitialized: string
    let parsedBefore: unknown

    beforeAll(() => {
        uninitialized = generateFormHTML(source)
        parsedBefore = parseFormdown(source).forms
    })

    beforeEach(async () => {
        await initializeExtensions({ errorStrategy: 'warn' })
    })

    afterEach(async () => {
        await getDefaultExtensionManager().destroy()
    })

    test('is the same as before it, for the field types the core has', () => {
        expect(generateFormHTML(source)).toBe(uninitialized)
        expect(parseFormdown(source).forms).toEqual(parsedBefore)
    })

    test('keeps option values as text', () => {
        const html = generateFormHTML(source)
        expect(html).not.toMatch(/<img/)
        // `<img src=x>` splits at its `=` into a value and the text shown for it; both stay text.
        expect(html).toContain('value="&lt;img src"')
        expect(html).toContain('x&gt;')
    })

    test('adds the toggle type, with its attributes escaped', () => {
        const html = generateFormHTML('@on: [toggle]')
        expect(html).toContain('role="switch"')
        expect(html).toContain('name="on"')
    })
})
