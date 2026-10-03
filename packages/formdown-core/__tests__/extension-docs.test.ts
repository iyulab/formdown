/**
 * Runs the code shown in the extension documentation (site/content/docs/extensions.md,
 * site/content/docs/extension-examples.md and their copies under docs/, plus the extension
 * snippets in site/content/docs/new-features.md and docs/CORE_ARCHITECTURE.md). Each test body
 * is the documented example, adapted only for imports and test isolation, so a change
 * to the extension API that breaks the documentation breaks a test.
 */
import {
    initializeExtensions,
    registerPlugin,
    registerHook,
    executeHooks,
    getExtensionStats,
    getDefaultExtensionManager,
    ExtensionManager,
    parseFormdown,
    generateFormHTML,
    getSchema,
} from '../src/index'
import type { Plugin, Field, FormdownContent } from '../src/index'

// Passing options starts a fresh default manager, so each test begins with no plugins
// or hooks of its own; the examples' own `await initializeExtensions()` is then a no-op.
beforeEach(async () => {
    await initializeExtensions({ errorStrategy: 'throw' })
})

afterEach(async () => {
    await getDefaultExtensionManager().destroy() // runs each plugin's destroy()
})

// The rating field type from "Custom Field Types", also used by "Testing Plugins"
const ratingPlugin: Plugin = {
    metadata: { name: 'rating-field', version: '1.0.0' },
    fieldTypes: [{
        type: 'rating',
        // Receives each block field line, trimmed. Return null for lines that are not yours.
        parser: (line) => {
            const match = line.match(/^@(\w+)(?:\(([^)]*)\))?:\s*\[rating(?:\s+max=(\d+))?\]/)
            if (!match) return null
            const [, name, label, max] = match
            return { name, type: 'rating', label: label ?? name, attributes: { max: Number(max ?? 5) } }
        },
        // Return the control only; Formdown adds the label and the field container.
        generator: (field, context) =>
            `<input type="number" name="${field.name}" id="${field.name}" min="1" ` +
            `max="${field.attributes?.max}" form="${context.metadata?.formId ?? ''}">`
    }]
}

describe('Extension System', () => {
    it('Quick start', async () => {
        // 1. Initialize the default extension manager once, before registering anything.
        await initializeExtensions()

        // 2. Register a hook: every rendered field gets a class naming its type.
        registerHook({
            name: 'field-render',
            priority: 10,
            handler: (context, html: string) =>
                html.replace('class="formdown-field"', `class="formdown-field field-${context.field?.type}"`)
        })

        // 3. Parse and generate as usual; the hook now applies.
        const html = generateFormHTML('@phone: [tel]')

        expect(html).toContain('class="formdown-field field-tel"')
    })

    it('Before initialization', () => {
        // A manager that has not been initialized, as the default one is before initializeExtensions()
        const manager = new ExtensionManager()
        expect(() => manager.registerHook({ name: 'pre-parse', priority: 0, handler: () => undefined }))
            .toThrow('Extension system must be initialized before use')
        expect(manager.transformSync('pre-parse', {}, 'source')).toBe('source')
    })

    it('When a hook fails', async () => {
        await initializeExtensions()

        registerHook({ name: 'pre-parse', priority: 0, handler: () => 42 })

        const { diagnostics } = parseFormdown('@phone: [tel]')
        // [{ code: 'hook-error', severity: 'error',
        //    message: 'Hook "pre-parse" failed: returned a number where a string was expected' }]

        expect(diagnostics).toEqual([{
            code: 'hook-error',
            severity: 'error',
            message: 'Hook "pre-parse" failed: returned a number where a string was expected'
        }])
    })

    it('Running hooks yourself', async () => {
        await initializeExtensions()

        registerHook({
            name: 'field-validate',
            priority: 10,
            handler: (context, value: string) =>
                context.field?.required && !value ? `${context.field.label} is required` : undefined
        })

        const [field] = parseFormdown('@phone*: [tel]').forms
        const messages = await executeHooks<string>('field-validate', { field }, '')
        // ['Phone is required']

        expect(messages).toEqual(['Phone is required'])
    })

    it('Plugins', async () => {
        const calls: string[] = []

        const auditPlugin: Plugin = {
            metadata: {
                name: 'audit',
                version: '1.0.0',
                description: 'Records every parsed form',
                dependencies: ['formdown-core'] // must already be registered
            },
            hooks: [{
                name: 'post-parse',
                priority: 0,
                handler: (_context, content: FormdownContent) => {
                    calls.push(`parsed ${content.forms.length} fields`)
                    // returning undefined keeps the result unchanged
                }
            }],
            initialize: () => { calls.push('initialize') },
            destroy: () => { calls.push('destroy') }
        }

        await initializeExtensions()
        await registerPlugin(auditPlugin)               // runs initialize()
        parseFormdown('@phone: [tel]\n@notes: [textarea]')
        await getDefaultExtensionManager().unregisterPlugin('audit') // runs destroy()

        // calls: ['initialize', 'parsed 2 fields', 'destroy']

        expect(calls).toEqual(['initialize', 'parsed 2 fields', 'destroy'])
    })

    it('Custom field types', async () => {
        await initializeExtensions()
        await registerPlugin(ratingPlugin)

        const source = '@service(Service): [rating max=10]'

        const [field] = parseFormdown(source).forms
        // field.type === 'rating', field.label === 'Service', field.attributes.max === 10

        const html = generateFormHTML(source)
        // <label for="service">Service</label>
        // <input type="number" name="service" id="service" min="1" max="10" form="formdown-form-default">

        const schema = getSchema(source)
        // schema.service.type === 'rating'

        expect(field.type).toBe('rating')
        expect(field.label).toBe('Service')
        expect(field.attributes?.max).toBe(10)
        expect(html).toContain('<label for="service">Service</label>')
        expect(html).toContain('<input type="number" name="service" id="service" min="1" max="10" form="formdown-form-default">')
        expect(schema.service.type).toBe('rating')
    })

    it('Events', async () => {
        await initializeExtensions()

        const log: string[] = []
        const events = getDefaultExtensionManager().getEventEmitter()
        events.on('plugin-registered', event => log.push(`registered ${event.data.plugin}`))
        events.on('plugin-unregistered', event => log.push(`unregistered ${event.data.plugin}`))

        await registerPlugin({ metadata: { name: 'my-plugin', version: '1.0.0' } })
        await getDefaultExtensionManager().unregisterPlugin('my-plugin')

        // log: ['registered my-plugin', 'unregistered my-plugin']

        expect(log).toEqual(['registered my-plugin', 'unregistered my-plugin'])
    })

    it('Inspecting the extension system', async () => {
        await initializeExtensions()

        const stats = getExtensionStats()
        // {
        //   initialized: true,
        //   plugins: [{ name: 'formdown-core', version: '1.0.0' }],
        //   hookCount: 0,
        //   registeredHooks: [],
        //   fieldTypes: ['toggle'],
        //   validators: ['required', 'pattern', 'minlength'],
        //   renderers: [],
        //   themes: []
        // }

        expect(stats).toEqual({
            initialized: true,
            plugins: [{ name: 'formdown-core', version: '1.0.0' }],
            hookCount: 0,
            registeredHooks: [],
            fieldTypes: ['toggle'],
            validators: ['required', 'pattern', 'minlength'],
            renderers: [],
            themes: []
        })
    })

    it('The built-in plugin', async () => {
        const before = generateFormHTML('@name: [text]')
        await initializeExtensions()
        expect(generateFormHTML('@name: [text]')).toBe(before)
        expect(generateFormHTML('@notify: [toggle]')).toContain('<input type="checkbox" role="switch" id="notify" name="notify"')
        await expect(registerPlugin({ metadata: { name: 'needs-core', version: '1.0.0', dependencies: ['formdown-core'] } }))
            .resolves.toBeUndefined()
    })

    it('Current limitations', async () => {
        // Pins the behavior the page describes; when it changes, update the page.
        await initializeExtensions()

        const manager = getDefaultExtensionManager()
        await manager.destroy()
        await expect(manager.initialize()).resolves.toBeUndefined()

        const handler = (_context: unknown, html: string) => html + '<!--late-->'
        await expect(registerPlugin({
            metadata: { name: 'duplicate-toggle', version: '1.0.0' },
            hooks: [{ name: 'post-generate', priority: 0, handler }],
            fieldTypes: [{ type: 'toggle' }]
        })).rejects.toThrow("Field type 'toggle' is already registered")
        expect(generateFormHTML('@phone: [tel]').endsWith('<!--late-->')).toBe(false)
    })

    it('Testing plugins', async () => {
        await registerPlugin(ratingPlugin)
        expect(parseFormdown('@service: [rating]').forms[0].type).toBe('rating')
    })
})

describe('Extension Examples', () => {
    it('Template variables', async () => {
        await initializeExtensions()

        const variables: Record<string, string> = { company: 'Acme' }

        registerHook({
            name: 'pre-parse',
            priority: 10,
            handler: (_context, source: string) =>
                source.replace(/\{\{(\w+)\}\}/g, (match, key: string) => variables[key] ?? match)
        })

        const { markdown } = parseFormdown('# Join {{company}}\n@phone: [tel]')
        // markdown starts with '# Join Acme'

        expect(markdown.startsWith('# Join Acme')).toBe(true)
    })

    it('Default placeholders', async () => {
        await initializeExtensions()

        registerHook({
            name: 'field-parse',
            priority: 10,
            handler: (_context, field: Field) =>
                field.placeholder ? undefined : { ...field, placeholder: `Enter ${field.label.toLowerCase()}` }
        })

        const { forms } = parseFormdown('@phone: [tel]\n@notes: [textarea placeholder="Anything else?"]')
        // forms[0].placeholder === 'Enter phone'
        // forms[1].placeholder === 'Anything else?'

        expect(forms[0].placeholder).toBe('Enter phone')
        expect(forms[1].placeholder).toBe('Anything else?')
    })

    it('Bootstrap classes', async () => {
        await initializeExtensions()

        registerHook({
            name: 'field-render',
            priority: 10,
            handler: (context, html: string) => {
                if (context.field?.inline) return undefined // leave inline fields as they are
                return html
                    .replace('class="formdown-field"', 'class="formdown-field mb-3"')
                    .replace('<label ', '<label class="form-label" ')
                    .replace(/<(input|textarea|select) /, '<$1 class="form-control" ')
            }
        })

        const html = generateFormHTML('@phone: [tel]\n@notes: [textarea]')
        // <div class="formdown-field mb-3" part="field">
        //     <label class="form-label" for="phone" part="label">Phone</label>
        //     <input class="form-control" type="tel" id="phone" ...>

        expect(html).toContain('<div class="formdown-field mb-3" part="field">')
        expect(html).toContain('<label class="form-label" for="phone" part="label">Phone</label>')
        expect(html).toContain('<input class="form-control" type="tel" id="phone"')
        expect(html).toContain('<textarea class="form-control" id="notes"')
    })

    it('Translating labels', async () => {
        await initializeExtensions()

        const french: Record<string, string> = { Phone: 'Téléphone', Birthday: 'Date de naissance' }

        registerHook({
            name: 'post-parse',
            priority: 10,
            handler: (_context, content: FormdownContent) => ({
                ...content,
                forms: content.forms.map(field => ({ ...field, label: french[field.label] ?? field.label }))
            })
        })

        const html = generateFormHTML('@phone: [tel]\n@birthday: [date]')
        // <label for="phone" part="label">Téléphone</label> ... Date de naissance

        expect(html).toContain('<label for="phone" part="label">Téléphone</label>')
        expect(html).toContain('Date de naissance')
    })

    it('Wrapping the generated HTML', async () => {
        await initializeExtensions()

        registerHook({
            name: 'post-generate',
            priority: 10,
            handler: (_context, html: string) => `<section class="signup-form">\n${html}\n</section>`
        })

        const html = generateFormHTML('@phone: [tel]')
        // '<section class="signup-form">\n<form hidden id="formdown-form-default" ...'

        expect(html.startsWith('<section class="signup-form">\n<form hidden id="formdown-form-default"')).toBe(true)
        expect(html.endsWith('</section>')).toBe(true)
    })

    it('Usage analytics plugin', async () => {
        const events: Array<{ name: string, fields?: string[] }> = [] // send these to your analytics service

        const analyticsPlugin: Plugin = {
            metadata: { name: 'analytics', version: '1.0.0' },
            initialize: () => { events.push({ name: 'analytics-ready' }) },
            destroy: () => { events.push({ name: 'analytics-stopped' }) },
            hooks: [{
                name: 'post-parse',
                priority: 0,
                handler: (_context, content: FormdownContent) => {
                    events.push({ name: 'form-parsed', fields: content.forms.map(field => field.type) })
                }
            }]
        }

        await initializeExtensions()
        await registerPlugin(analyticsPlugin)

        parseFormdown('@phone: [tel]\n@birthday: [date]')

        await getDefaultExtensionManager().unregisterPlugin('analytics')
        // events:
        // [{ name: 'analytics-ready' },
        //  { name: 'form-parsed', fields: ['tel', 'date'] },
        //  { name: 'analytics-stopped' }]

        expect(events).toEqual([
            { name: 'analytics-ready' },
            { name: 'form-parsed', fields: ['tel', 'date'] },
            { name: 'analytics-stopped' }
        ])
    })

    it('Password strength check', async () => {
        await initializeExtensions()

        registerHook({
            name: 'field-validate',
            priority: 10,
            handler: (context, value: string) => {
                if (context.field?.type !== 'password') return undefined
                return value.length >= 12 ? undefined : `${context.field.label} needs at least 12 characters`
            }
        })

        const [field] = parseFormdown('@password: [password]').forms
        const messages = await executeHooks<string>('field-validate', { field }, 'hunter2')
        // ['Password needs at least 12 characters']

        expect(messages).toEqual(['Password needs at least 12 characters'])
        expect(await executeHooks<string>('field-validate', { field }, 'correct horse battery')).toEqual([])
    })
})

describe('Other pages', () => {
    it('New features: Extension System quick example', async () => {
        await initializeExtensions()

        registerHook({
            name: 'field-render',
            priority: 10,
            handler: (_context, html: string) =>
                html.replace(/<(input|textarea|select) /, '<$1 class="form-control" ')
        })

        const html = generateFormHTML('@phone: [tel]')
        // ... <input class="form-control" type="tel" id="phone" ...>

        expect(html).toContain('<input class="form-control" type="tel" id="phone"')
    })

    it('Core architecture: hook system', async () => {
        await initializeExtensions()

        registerHook({
            name: 'field-parse',
            priority: 1,
            handler: (context, field) => ({ ...field, placeholder: field.placeholder ?? field.label })
        })

        expect(parseFormdown('@phone: [tel]').forms[0].placeholder).toBe('Phone')
    })
})
