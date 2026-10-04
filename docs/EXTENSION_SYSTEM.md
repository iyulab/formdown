# Formdown Extension System

Formdown's parser and generator run every document through one extension manager, the **default instance**. You extend Formdown by registering, on that instance:

- **hooks** — functions that transform the source, each parsed field, the parse result, each rendered field, or the final HTML;
- **plugins** — named bundles of hooks and custom field types, with optional `initialize` / `destroy` lifecycle functions.

Everything here is exported from `@formdown/core`. Every example on this page and on [Extension Examples](./EXTENSION_EXAMPLES.md) is run by the package's test suite.

## Quick Start

```typescript
import { initializeExtensions, registerHook, generateFormHTML } from '@formdown/core'

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
// ... <div class="formdown-field field-tel" part="field"> ...
```

## The Default Instance

`parseFormdown()`, `generateFormHTML()` and `getSchema()` always use the instance returned by `getDefaultExtensionManager()`. The convenience functions `initializeExtensions`, `registerPlugin`, `registerHook`, `executeHooks` and `getExtensionStats` act on that same instance.

An `ExtensionManager` you construct yourself works on its own (you can register hooks on it and run them with its `executeHooks`), but parsing and generation never consult it.

### Before initialization

Until `initializeExtensions()` has run, parsing and generation run without any hooks, and `registerPlugin`, `registerHook` and `executeHooks` throw `Extension system must be initialized before use`.

### `initializeExtensions(options?)`

- Registers the built-in `formdown-core` plugin (see *The Built-in Plugin* below) and initializes the default instance. Calling it again, or from two places at once, initializes only once.
- Called **with** an options object, it replaces the default instance with a fresh one configured with those options. Plugins and hooks registered on the earlier instance are not carried over, so pass options before registering anything.

| Option | Default | Effect |
|---|---|---|
| `debug` | `false` | Logs registrations and lifecycle steps with `console.debug`. |
| `errorStrategy` | `'warn'` | `'ignore'`, `'warn'` or `'throw'` for errors in `executeHooks` handlers and in plugin `initialize` / `destroy`. Hooks run by parsing and generation never throw; see *When a hook fails* below. |
| `timeout` | `1000` | Milliseconds each handler may take in `executeHooks`. |

## Hooks

A hook is `{ name, priority, handler }`. Parsing and generation run the hooks of each name synchronously, highest `priority` first (equal priorities in registration order). Each handler is called as `handler(context, value)` and returns a replacement for `value`; returning `undefined` keeps it unchanged. The next handler receives the result.

| Hook | Runs | `value` | `context` |
|---|---|---|---|
| `pre-parse` | before parsing | the source text | `input`: the source |
| `field-parse` | once per parsed field, in source order | the `Field` | `input`: the field's source text; `field` |
| `post-parse` | after parsing | the `FormdownContent` result | `input`: the source after `pre-parse` |
| `pre-generate` | before generating HTML | the `FormdownContent` | empty |
| `field-render` | once per field, block and inline | the field's HTML | `field` |
| `post-generate` | after generating HTML | the whole HTML | empty |

- A handler must return the same kind of value it received (a string for a string, an object for an object) or `undefined`.
- Handlers must be synchronous. One that returns a promise is skipped.
- If `pre-parse` changes the text, field source spans refer to the changed text.
- For an inline field, `field-render` receives its `<span>`; check `context.field?.inline` to tell the two apart.
- `getDefaultExtensionManager().unregisterHook(name, handler)` removes a hook.

`HookName` also lists `field-validate` and `error-handle`. Parsing and generation never call them; they run only when you call `executeHooks` yourself (see *Running hooks yourself* below).

### When a hook fails

A handler that throws, returns a promise, or returns the wrong kind of value is skipped, and the rest of the pipeline runs. During parsing the failure is added to the result's `diagnostics`; during generation it is logged with `console.warn`.

```typescript
registerHook({ name: 'pre-parse', priority: 0, handler: () => 42 })

const { diagnostics } = parseFormdown('@phone: [tel]')
// [{ code: 'hook-error', severity: 'error',
//    message: 'Hook "pre-parse" failed: returned a number where a string was expected' }]
```

### Running hooks yourself

`executeHooks(name, context, ...args)` runs every handler registered under `name` with `(context, ...args)`, awaiting each in turn, and resolves to the list of results that are not `undefined`. It follows the `errorStrategy` and `timeout` options. Use it for checks of your own:

```typescript
registerHook({
  name: 'field-validate',
  priority: 10,
  handler: (context, value: string) =>
    context.field?.required && !value ? `${context.field.label} is required` : undefined
})

const [field] = parseFormdown('@phone*: [tel]').forms
const messages = await executeHooks<string>('field-validate', { field }, '')
// ['Phone is required']
```

## Plugins

```typescript
import { initializeExtensions, registerPlugin, getDefaultExtensionManager, parseFormdown } from '@formdown/core'
import type { Plugin, FormdownContent } from '@formdown/core'

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
```

- `metadata.name` must be unique; registering a second plugin with the same name rejects.
- Every name in `metadata.dependencies` must already be registered, or `registerPlugin` rejects.
- `initialize` runs when the plugin is registered. `destroy` runs when it is unregistered and when the manager is destroyed (`getDefaultExtensionManager().destroy()`).
- `hooks` and `fieldTypes` take effect as described on this page.

## Custom Field Types

A plugin's `fieldTypes` add new block-field types:

```typescript
import { initializeExtensions, registerPlugin, parseFormdown, generateFormHTML, getSchema } from '@formdown/core'
import type { Plugin } from '@formdown/core'

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
```

**`parser(line, context)`** is offered every block field line (`@name: [...]`), trimmed, before Formdown's own parser. Registered field types are asked in registration order, the built-in ones first; the first non-null result is used. Return a `Field` (`name`, `type` and `label` are required). Formdown then adds the source span and form association as for any field, and merges the field type's `defaultAttributes` under the returned `attributes`. Inline fields (`___@name`) are not offered to field-type parsers.

**`generator(field, context)`** renders every field whose `type` matches. `context.metadata.formId` is the id of the default form. Formdown places the returned markup in the field container under a `<label>` (with ` *` when the field is required), gives the first `id="…"` a unique id, and sets an existing `form="…"` attribute to the field's form. Markup without a `form` attribute is not associated with the generated form, which is why the example writes one. If the markup contains a `<div class="formdown-field">` (that class alone), Formdown adds only the container and no label.

The field then passes through the `field-parse` and `field-render` hooks like any other. An error thrown by a field type's `parser` is reported as a `field-type-error` diagnostic of `parseFormdown()`, one thrown by its `generator` as a console warning; Formdown then handles the field itself.

**`validator(value, field)`** checks a value of the type. `validateForm()` — and so `<formdown-ui>`'s `validate()` — calls it for every field of the type that can be filled in right now, after its own required check, with the field's schema entry (`getSchema()`) and its `name`. Each message it returns is one error of that field. Required is checked by Formdown already; check only what is particular to the type:

```typescript
validator: (value) =>
  value === undefined || value === '' || Number.isInteger(Number(value)) ? [] : ['A rating is a whole number']

validateForm({ service: '7.5' }, getSchema(source))
// { isValid: false, errors: [{ field: 'service', message: 'A rating is a whole number' }] }
```

**`styles`** is the CSS the `generator`'s markup is drawn with. `<formdown-ui>` applies the styles of the field types its form holds; with `generateFormHTML()` you place them yourself — `getDefaultExtensionManager().getFieldTypeRegistry().getStylesForTypes(['rating'])`.

**`defaultAttributes`** are merged under the `attributes` the `parser` returns.

A field type's value is what its control reports, read like the core field it is built from: a single checkbox that carries `value="true"` reports a boolean, a group of checkboxes a list, any other control its text.

## Events

The default instance's event emitter reports plugin activity:

```typescript
const log: string[] = []
const events = getDefaultExtensionManager().getEventEmitter()
events.on('plugin-registered', event => log.push(`registered ${event.data.plugin}`))
events.on('plugin-unregistered', event => log.push(`unregistered ${event.data.plugin}`))

await registerPlugin({ metadata: { name: 'my-plugin', version: '1.0.0' } })
await getDefaultExtensionManager().unregisterPlugin('my-plugin')

// log: ['registered my-plugin', 'unregistered my-plugin']
```

A listener receives `{ type, data, timestamp }`.

| Event | `data` |
|---|---|
| `plugin-registered` | `{ plugin, version }` |
| `plugin-initialized` | `{ plugin }` — after a registered plugin's `initialize` ran |
| `plugin-unregistered` | `{ plugin }` |
| `plugin-destroyed` | `{ plugin }` — after an unregistered plugin's `destroy` ran |
| `plugin-error` | `{ plugin, operation, error }` — `initialize` or `destroy` threw |

Remove a listener with `events.off(name, listener)`. Destroying the manager removes all of its listeners.

## Inspecting the Extension System

```typescript
const stats = getExtensionStats()
// {
//   initialized: true,
//   plugins: [{ name: 'formdown-core', version: '1.0.0' }],
//   hookCount: 0,
//   registeredHooks: [],
//   fieldTypes: ['toggle']
// }
```

## The Built-in Plugin

Initialization registers the `formdown-core` plugin. It adds the `toggle` field type — `@notify: [toggle]` renders a switch (a checkbox with `role="switch"`, drawn by the plugin's `styles`), whose value is a boolean like a single checkbox's; without the plugin, `[toggle]` renders as a text input. `<formdown-ui>` draws its form once the plugin is registered. It does not change how the field types Formdown itself knows are parsed or rendered:

```typescript
const before = generateFormHTML('@name: [text]')
await initializeExtensions()
generateFormHTML('@name: [text]') === before // true
generateFormHTML('@notify: [toggle]')        // <input type="checkbox" role="switch" id="notify" name="notify" ...>
```

A plugin can name `formdown-core` in `dependencies` to require it.

## Current Limitations

These parts of the extension types exist but are not used by parsing, generation, `getSchema()` or the validation functions today:

- **Hook names `field-validate` and `error-handle`** — run only through `executeHooks`. `@formdown/editor` runs `field-validate` with the source text and lists the `message` of every result that has `valid: false`.

Other behavior to be aware of:

- `destroy()` removes every plugin, hook and listener added from outside; the manager can be initialized again afterwards.
- `registerPlugin` checks the plugin's field types before registering anything: a plugin whose field type is already registered is rejected and leaves no hooks or field types behind.
- A field type whose `parser` throws is reported as a `field-type-error` diagnostic of `parseFormdown()`, and one whose `generator` throws as a console warning; Formdown then handles the field itself.

## API Reference

### Functions

| Function | Description |
|---|---|
| `initializeExtensions(options?)` | Initialize the default instance; with options, replace it with a fresh one first. |
| `registerPlugin(plugin)` | Register a plugin on the default instance and run its `initialize`. |
| `registerHook(hook)` | Register a hook on the default instance. |
| `executeHooks(name, context, ...args)` | Run the hooks registered under `name`; resolves to their non-`undefined` results. |
| `getExtensionStats()` | Plugins, hooks and registered field types of the default instance. |
| `getDefaultExtensionManager()` | The instance parsing and generation use. |

### `ExtensionManager`

| Method | Description |
|---|---|
| `initialize()` / `destroy()` | Start the manager; destroy every plugin, hook and listener. |
| `registerPlugin(plugin)` / `unregisterPlugin(name)` | Add or remove a plugin, running its `initialize` / `destroy`. |
| `registerHook(hook)` / `unregisterHook(name, handler)` | Add or remove a single hook. |
| `executeHooks(name, context, ...args)` | Run hooks asynchronously, collecting results. |
| `executeHooksSync(name, context, ...args)` | Run hooks synchronously, collecting results. |
| `transformSync(name, context, value)` | Pass `value` through the hooks as parsing and generation do. |
| `getEventEmitter()` | The emitter for the events listed under *Events*. |
| `getFieldTypeRegistry()` | The registry holding the field types of all registered plugins. |
| `getStats()` | Same as `getExtensionStats()` for this instance. |
| `enableDebug()` / `disableDebug()` | Toggle the `debug` option. |

## Testing Plugins

Pass options to `initializeExtensions` before each test so every test starts from a fresh default instance, and destroy it afterwards so plugins' `destroy` functions run:

```typescript
import { initializeExtensions, getDefaultExtensionManager, registerPlugin, parseFormdown } from '@formdown/core'

beforeEach(async () => {
  await initializeExtensions({ errorStrategy: 'throw' })
})

afterEach(async () => {
  await getDefaultExtensionManager().destroy()
})

test('rating fields parse', async () => {
  await registerPlugin(ratingPlugin)
  expect(parseFormdown('@service: [rating]').forms[0].type).toBe('rating')
})
```

See [Extension Examples](./EXTENSION_EXAMPLES.md) for more complete plugins.
