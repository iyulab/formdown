# @formdown/editor

Web component editor for Formdown syntax.

## Installation

```bash
npm install @formdown/editor
```

## Usage

### HTML

```html
<script type="module">
  import '@formdown/editor'
</script>

<formdown-editor 
  content="@name: [text required]"
  show-preview="true">
</formdown-editor>
```

### JavaScript

```typescript
import '@formdown/editor'

const editor = document.querySelector('formdown-editor')
editor.content = '@name: [text required]'
editor.showPreview = true

// Listen for content changes
editor.addEventListener('contentChange', (event) => {
  console.log('New content:', event.detail.content)
})
```

## Properties

- `content` (string) - The Formdown content to edit
- `showPreview` (boolean) - Whether to show live preview
- `readonly` (boolean) - Make editor read-only

## Events

- `contentChange` - Fired when content changes
  - `detail.content` - Updated content

## Features

- Syntax highlighting
- Live preview
- Error detection
- Auto-completion hints
- Responsive design

## Documentation

For complete documentation, visit the [Formdown documentation](https://github.com/iyulab/formdown).

## License

MIT
