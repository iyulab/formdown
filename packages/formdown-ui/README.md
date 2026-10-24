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

A form held as fields rather than text is written with core's `formatFormdown` and given as `content`, so the same form draws, validates and shows suggestions the same way:

```typescript
import { formatFormdown } from '@formdown/core/format'

viewer.content = formatFormdown([{ name: 'title', type: 'text', required: true }, { name: 'public', type: 'checkbox', attributes: { switch: true } }])
```

## Properties

- `content` (string) - The Formdown content to render
- `data` (object) - Field values by name. Setting it fills the form; it follows what the user types
- `body-html` (`bodyHtml`) - What becomes of HTML written in the form's Markdown body: `trust` (default) renders it; `escape` shows it as text and drops the link of a Markdown link to a `javascript:`, `vbscript:` or `data:` address — for a form someone else wrote. The form's fields are drawn either way
- `fieldStates` (object, property only) - What the host says about each field, by name: `{ suggestions?: string[], note?: string, decline?: string, label?: string }`. The first suggestion shows in the empty field in place of its placeholder; every suggestion is listed by the field as a button, beside the note. A button shows the option's name for a value the field's options name (`options="hw=Hardware"` → «Hardware»), and the value otherwise; it is `aria-pressed="true"` while the field holds that value. The buttons are a `role="group"` named «Suggestions for <label>», or `label` in the host's language. With `decline`, a button with that label follows the suggestions (styled as the `decline` part). Styled with `--formdown-ghost-color`, `--formdown-note-color`, `--formdown-suggestion-bg` and `--formdown-suggestion-border-color`.
- `choices` (object, property only) - Values the host offers for each field, by name: `[{ value, label? }]` — the same shape as an option the author writes as `value=Label` (`Choice` is core's `FieldOption`) — options read from a server, values already settled elsewhere. A select or a radio or checkbox group lists them after its own options (the author's options stay as written, and a value the author already offers adds nothing); a field one types into lists them as it is typed in, through a `<datalist>`. Each added choice is marked `data-formdown-choice`. A value in the data that neither the author nor the host offers is still shown as an extra choice marked `data-formdown-unlisted`. Fields with an "other" choice and single checkboxes are left alone.
- `messages` (object, property only) - The sentences validation says, by rule, in place of the English ones: `{ required, minLength, maxLength, min, max, number, email, url, tel, date, dateMin, dateMax, pattern }`, each with `{label}`, `{min}` and `{max}` filled in. A rule left out keeps its default; a field's own `error-message` wins over them all. Korean ones: `import { messages } from '@formdown/core/messages/ko'`
- `filter-select-above` (`filterSelectAbove`, number, default `20`) - A single-choice select with more options than this — the author's or the host's `choices` — becomes a combobox: a text field that narrows the options by their labels as one types (case and accents of composed or decomposed text alike, anywhere in the label), and a list of the matches to choose from with the mouse or ↑ ↓ Enter, Esc to put the chosen label back. The select stays the field: its `name`, value and `input`/`change` events are as before, it keeps its place in the form unseen and out of the tab order (marked `data-formdown-filtered`), and focus that reaches it goes on to the combobox. The combobox has no `name`, so it is never part of the data; text that names no option changes nothing. A select with an "other" choice is left alone. `Infinity` keeps every select as it is. Styled as the select (`part="input select-input"`), the list with the form's colors

## Methods

- `validate()` - Validates the current values against what each field declares (`required`, length, range, format, `pattern` — as core's `validateForm`): `{ isValid, errors }`. Each field that broke a rule shows its sentences under it (`part="field-error"`, styled with `--formdown-error-color`) and is marked `aria-invalid="true"`, pointing at them with `aria-describedby`. From then on that field is checked again as its value changes: once it passes, its error goes. Fields not yet shown an error are not told before the host validates again
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
- `formdown-file-pick` - Fired when files are chosen in a file field (`[file]`). The form keeps no value for them — a browser gives only a made-up path — so the host stores the files and sets the field's value through `data` if it keeps one
  - `detail.field` - Field name
  - `detail.files` - The `File` objects chosen

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
