# Formdown

**Formdown** is an extended syntax based on Markdown that enables easy generation of HTML documents and `<form>` elements.

## Key Features

- **Simple Syntax**: Intuitive Markdown-based syntax for creating complex HTML forms
- **Extensible**: Extends existing Markdown syntax to represent form elements
- **Efficient**: Eliminates the hassle of manually writing HTML and form code
- **Text-based**: Version control-friendly and collaboration-friendly text-based form definition

Like writing documents in regular Markdown, you can define forms, enabling quick and efficient web form generation.

## Architecture

Formdown follows a simple, modular architecture:

- **Core Specification**: Text-based syntax that can be used with any editor
- **formdown-ui**: Pure renderer (formdown syntax → HTML)
- **formdown-editor**: Optional development tool with enhanced editing features

## Installation

Install the packages you need for your project:

```bash
# Core functionality
npm install @formdown/core

# Web component renderer  
npm install @formdown/ui

# Optional: Development editor
npm install @formdown/editor
```

## Quick Start

### Basic Usage with HTML

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@formdown/ui/dist/index.es.js"></script>
</head>
<body>
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
</body>
</html>
```

### Usage with JavaScript

```javascript
import { parse, generate } from '@formdown/core';
import '@formdown/ui';

// Parse formdown syntax
const ast = parse('**Name**: ___@name');

// Generate HTML
const html = generate(ast);

// Or use the web component
const formElement = document.createElement('formdown-ui');
formElement.textContent = '**Name**: ___@name';
document.body.appendChild(formElement);
```

## Documentation

- [Syntax Guide](./docs/SYNTAX.md) - Complete formdown syntax reference
- [Publishing Guide](./docs/PUBLISHING.md) - How to publish packages to npm
- [Tasks & Roadmap](./docs/TASKS.md) - Current development status

## Project Structure

```
formdown/
├── packages/
│   ├── formdown-ui/              # Pure HTML renderer (Vite + TypeScript + Lit)
│   │   └── package.json
│   └── formdown-editor/          # Development tool editor (Vite + TypeScript + Lit)
│       └── package.json
└── site/                         # Official site and online demo (Next.js)
    └── package.json
```

## Packages

### @formdown/core
Core parsing and generation engine for Formdown syntax.

### @formdown/ui
A lightweight web component that renders Formdown syntax into HTML forms.

**Features:**
- Pure formdown → HTML form conversion
- Minimal, focused functionality
- Customizable styling
- Form data collection and validation

### @formdown/editor
An optional development tool for enhanced Formdown editing experience.

**Features:**
- Three modes: edit, split, view
- Real-time syntax highlighting
- IntelliSense and auto-completion
- Error validation and display
- Live preview integration with formdown-ui

**Note**: @formdown/editor is not required for basic usage. Any text editor can be used to write formdown syntax.

## Contributing

1. Clone the repository
2. Install dependencies: `npm install`
3. Build packages: `npm run build:packages`
4. Run tests: `npm test`
5. Start development: `npm run dev`

For publishing packages, see the [Publishing Guide](./docs/PUBLISHING.md).

## License

MIT License - see [LICENSE](./LICENSE) file for details.