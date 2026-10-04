# @formdown/ui

Web component viewer for rendering Formdown forms.

## Installation

```bash
npm install @formdown/ui
```

## Usage

### HTML

```html
<script type="module">
  import '@formdown/ui'
</script>

<formdown-ui content="@name*: []
@email*: @[]
@submit: [submit label=&quot;Send&quot;]">
</formdown-ui>
```

### JavaScript

```typescript
import '@formdown/ui'

const viewer = document.querySelector('formdown-ui')
viewer.content = '@name*: []'
viewer.data = { name: 'Ada' }

viewer.addEventListener('form-submit', (event) => {
  console.log('Form data:', event.detail.formData)
})
```

## Properties

- `content` (string) - The Formdown content to render
- `data` (object) - Field values by name. Setting it fills the form; it follows what the user types
- `fieldStates` (object, property only) - What the host says about each field, by name: `{ suggestions?: string[], note?: string, decline?: string }`. The first suggestion shows in the empty field in place of its placeholder; every suggestion is listed by the field as a button, beside the note. With `decline`, a button with that label follows the suggestions (styled as the `decline` part). Styled with `--formdown-ghost-color`, `--formdown-note-color`, `--formdown-suggestion-bg` and `--formdown-suggestion-border-color`.
- `choices` (object, property only) - Values the host offers for each field, by name: `[{ value, label? }]` — the same shape as an option the author writes as `value=Label` (`Choice` is core's `FieldOption`) — options read from a server, values already settled elsewhere. A select or a radio or checkbox group lists them after its own options (the author's options stay as written, and a value the author already offers adds nothing); a field one types into lists them as it is typed in, through a `<datalist>`. Each added choice is marked `data-formdown-choice`. A value in the data that neither the author nor the host offers is still shown as an extra choice marked `data-formdown-unlisted`. Fields with an "other" choice and single checkboxes are left alone.

## Methods

- `validate()` - Validates the current values: `{ isValid, errors }`
- `getSchema()` - The parsed field schema, or `null` before content is rendered
- `reset()` - Restores the fields' default values
- `isDirty()` - Whether any value differs from its default

## Events

All events bubble.

- `form-submit` - Fired when the form is submitted
  - `detail.formData` - Field values by name
- `formdown-change` - Fired when a field's value changes
  - `detail.fieldName` - Field name
  - `detail.value` - Field value
  - `detail.formData` - All field values
- `formdown-data-update` - Fired with every change, carrying all values
  - `detail.formData` - All field values
- `validation-error` - Fired when a field fails validation
  - `detail.field` - Field name
  - `detail.errors` - The errors
- `formdown-suggestion-pick` - Fired when an offered value (see `fieldStates`) is picked. The value is not put in the field: set it through `data` if the host takes it
  - `detail.field` - Field name
  - `detail.value` - The value picked
- `formdown-suggestion-decline` - Fired when the offered values are declined (see `fieldStates.decline`). Nothing in the form changes: the host decides what declining means
  - `detail.field` - Field name

## Features

- Real-time form rendering
- Form validation
- Custom styling support
- Responsive design
- Accessibility features

## Documentation

For complete documentation, visit the [Formdown documentation](https://github.com/iyulab/formdown).

## License

MIT
