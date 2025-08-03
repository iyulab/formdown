# Getting Started

Formdown transforms markdown-like syntax into interactive HTML forms. Write forms as naturally as writing text.

## What is Formdown?

```formdown
# Contact Form
@name*: []
@email*: @[]
@message: T4[]
@submit: [submit label="Send Message"]
```

**Becomes a fully functional contact form with validation!**

## Core Features

| Feature | Description | Example |
|---------|-------------|----------|
| **Human Readable** | Forms written like natural text | `@name*: []` |
| **Type Safe** | Built-in validation and type checking | `@email*: @[]` |
| **Zero Dependencies** | Works anywhere HTML works | `<formdown-ui>...</formdown-ui>` |
| **Framework Agnostic** | React, Vue, Angular, vanilla JS | Import and use immediately |

## Quick Examples

### Basic Form
```formdown
@name*: []
@email*: @[]
@submit: [submit]
```

### Advanced Form
```formdown
@username*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="3-20 characters"]
@email*: @[]
@age: #[min=18 max=100]
@interests{Web,Mobile,AI}: c[]
@submit: [submit label="Register"]
```

### Inline Fields
```formdown
Hello ___@name*! Your order #___@order_id is ready.
Delivery date: ___@delivery_date[date required]
```

## Quick Start

### 1. Add to HTML (CDN)
```html
<script src="https://unpkg.com/@formdown/ui@latest/dist/standalone.js"></script>
<formdown-ui>
    @name*: []
    @email*: @[]
    @submit: [submit]
</formdown-ui>
```

### 2. Install Package (NPM)
```bash
npm install @formdown/ui
```

```javascript
import '@formdown/ui';
// Use <formdown-ui> in your HTML/JSX
```

## Documentation

### Getting Started
- [Installation](./installation) - Setup and framework integration
- [Basic Syntax](./basics) - Core concepts and field types
- [Shorthand Syntax](./shorthand) - Faster form creation

### Reference
- [Field Reference](./reference) - Complete field type reference
- [Validation](./validation) - Form validation rules
- [JavaScript API](./api) - Programmatic control

### Tools & Examples
- [Editor Tools](./editor) - Development environment
- [Examples](./examples) - Real-world form examples

## Live Demo

- 🚀 [Interactive Demo](../demo) - Try Formdown in your browser
- 📁 [Sample Forms](https://github.com/iyulab/formdown/tree/main/site/public/samples) - Browse .fd files

## Community

- 📦 [NPM Package](https://www.npmjs.com/package/@formdown/ui)
- 🐙 [GitHub Repository](https://github.com/iyulab/formdown)
- 🐛 [Report Issues](https://github.com/iyulab/formdown/issues)
- 💬 [Discussions](https://github.com/iyulab/formdown/discussions)
