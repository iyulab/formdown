# Formdown

**Formdown** is a Markdown-based syntax for creating HTML forms with simple, intuitive text formatting.

## Key Features

- **Markdown-based**: Extends familiar Markdown syntax for form elements
- **Text-first**: Version control friendly, editor agnostic
- **Modular**: Use only what you need - core parser, UI renderer, or development tools

## Quick Start

The easiest way to get started is with the `@formdown/ui` web component:

```bash
npm install @formdown/ui
```

### HTML Usage

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@formdown/ui/dist/index.es.js"></script>

<formdown-ui>
    # Contact Form
    
    **Name**: ___@name
    **Email**: ___@email[type=email]
    **Message**: 
    ```
    @message
    ```
    
    [Submit](@submit)
</formdown-ui>
```

### JavaScript Usage

```javascript
import '@formdown/ui';

const formElement = document.createElement('formdown-ui');
formElement.textContent = '**Name**: ___@name';
document.body.appendChild(formElement);
```

## Packages

- **[@formdown/ui](https://www.npmjs.com/package/@formdown/ui)** - Web component renderer (recommended)
- **[@formdown/core](https://www.npmjs.com/package/@formdown/core)** - Parser and generator engine
- **[@formdown/editor](https://www.npmjs.com/package/@formdown/editor)** - Development editor with live preview

## Documentation

- **[Complete Documentation](https://formdown.dev/docs)** - Full syntax guide, examples, and API reference
- **[Quick Start Guide](https://formdown.dev/docs/quick-start)** - Get up and running in minutes
- **[Interactive Demo](https://formdown.dev/demo)** - Try Formdown in your browser

### Local Documentation

- [Syntax Guide](./docs/SYNTAX.md) - Complete formdown syntax reference
- [Editor Guide](./docs/EDITOR.md) - Development environment and modes
- [Tasks & Development](./docs/TASKS.md) - Current development status

## Contributing

```bash
git clone <repository>
npm install
npm run build
npm test
```

## License

MIT License - see [LICENSE](./LICENSE) file for details.