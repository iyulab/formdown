# @formdown/editor

Web component editor for Formdown: the source in a text area, the form it makes beside it.

## Installation

```bash
npm install @formdown/editor
```

Importing the package registers `<formdown-editor>` and the `<formdown-ui>` its preview draws.

## Usage

### HTML

```html
<script type="module">
  import '@formdown/editor'
</script>

<formdown-editor mode="split" content="@name: [text required]"></formdown-editor>
```

### JavaScript

```typescript
import { createFormdownEditor } from '@formdown/editor'

const editor = createFormdownEditor(document.getElementById('editor'), {
  content: '@name: [text required]',
  mode: 'split',
})

editor.addEventListener('contentChange', (event) => {
  console.log('New source:', event.detail.content)
})
```

## Properties

- `content` (string) — the Formdown source. Text inside the element is used when `content` is not set.
- `mode` (`'edit' | 'split' | 'view'`, default `'split'`) — the source, the source and the form, or the form.
- `placeholder` (string) — shown in the empty source.
- `header` (boolean, default `false`) — a heading over each panel.
- `toolbar` (boolean, default `true`) — buttons that insert a field of each common type.
- `data` (object) — the values of the form's fields.

## Methods

- `validate()` — the preview form's validation result.
- `getFormData()` — the preview form's values.

## Events

- `contentChange` — the source changed; `detail.content` is the new source.
- `formdown-data-update` — a value in the form changed; `detail.formData` holds them all.
- `formdown-change` — one field changed, as `<formdown-ui>` reports it: `detail.fieldName`, `detail.value`, `detail.formData`.

## Writing the source

As you type, a field you have just started is completed, and one undo takes the completion away:

- three underscores after other text on the line get an `@` for the field's name (`Name: ___` → `Name: ___@`);
- a space after `@name:` at the start of a line gets `[]`, with the caret inside for the field's type.

Tab inserts two spaces.

## Documentation

For complete documentation, visit the [Formdown documentation](https://github.com/iyulab/formdown).

## License

MIT
