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

<formdown-ui 
  content="@name: [text required]
@email: [email required]"
  submit-text="Submit Form">
</formdown-ui>
```

### JavaScript

```typescript
import '@formdown/ui'

const viewer = document.querySelector('formdown-ui')
viewer.content = '@name: [text required]'
viewer.submitText = 'Submit Form'

// Listen for form submissions
viewer.addEventListener('formSubmit', (event) => {
  console.log('Form data:', event.detail.data)
})
```

## Properties

- `content` (string) - The Formdown content to render
- `submitText` (string) - Text for submit button (default: "Submit")
- `showLabels` (boolean) - Whether to show field labels (default: true)
- `fieldStates` (object, property only) - What the host says about each field, by name: `{ suggestions?: string[], note?: string }`. The first suggestion shows in the empty field in place of its placeholder; every suggestion is listed by the field as a button, beside the note. Styled with `--formdown-ghost-color`, `--formdown-note-color`, `--formdown-suggestion-bg` and `--formdown-suggestion-border-color`.

## Events

- `formSubmit` - Fired when form is submitted
  - `detail.data` - Form data object
- `fieldChange` - Fired when any field changes
  - `detail.field` - Field name
  - `detail.value` - Field value
- `formdown-suggestion-pick` - Fired when an offered value (see `fieldStates`) is picked. The value is not put in the field: set it through `data` if the host takes it
  - `detail.field` - Field name
  - `detail.value` - The value picked

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
