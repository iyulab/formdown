# Extension Examples

Small, complete extensions built on the hooks and plugins described in [Extension System](/docs/extensions). Each example assumes these imports and runs as shown; the package's test suite runs every one of them.

```typescript
import {
  initializeExtensions,
  registerHook,
  registerPlugin,
  executeHooks,
  getDefaultExtensionManager,
  parseFormdown,
  generateFormHTML
} from '@formdown/core'
import type { Plugin, Field, FormdownContent } from '@formdown/core'
```

Initializing also registers the built-in `formdown-core` plugin, which adds the `toggle` field type and leaves the rendering of Formdown's own field types as it is.

## Template Variables

Replace `{{name}}` placeholders in the source before it is parsed, with a `pre-parse` hook:

```typescript
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
```

Field source spans then refer to the replaced text.

## Default Placeholders

Give every field without a placeholder one derived from its label, with a `field-parse` hook. Returning `undefined` leaves a field as it is:

```typescript
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
```

## Bootstrap Classes

Add Bootstrap 5 classes to each rendered block field with a `field-render` hook. The hook receives the field's HTML and returns the changed HTML:

```typescript
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
```

For colors, spacing and the rest of the look, see [Styling](/docs/styling); extension hooks are only needed to change the markup.

## Translating Labels

Translate labels after parsing with a `post-parse` hook, which receives the whole parse result:

```typescript
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
```

## Wrapping the Generated HTML

Wrap the whole output with a `post-generate` hook:

```typescript
await initializeExtensions()

registerHook({
  name: 'post-generate',
  priority: 10,
  handler: (_context, html: string) => `<section class="signup-form">\n${html}\n</section>`
})

const html = generateFormHTML('@phone: [tel]')
// '<section class="signup-form">\n<form hidden id="formdown-form-default" ...'
```

## Usage Analytics Plugin

A plugin bundles hooks with `initialize` and `destroy`. This one records which field types each parsed form uses; a `post-parse` hook that returns nothing observes without changing the result:

```typescript
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
```

## Password Strength Check

Parsing and generation never run `field-validate` hooks, but you can register checks under that name and run them yourself with `executeHooks`, which resolves to every result that is not `undefined`:

```typescript
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
```

## A Custom Field Type

A complete field type, with parser and generator, is shown under *Custom Field Types* in [Extension System](/docs/extensions).
