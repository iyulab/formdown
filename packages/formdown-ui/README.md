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

## Events

- `formSubmit` - Fired when form is submitted
  - `detail.data` - Form data object
- `fieldChange` - Fired when any field changes
  - `detail.field` - Field name
  - `detail.value` - Field value

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
