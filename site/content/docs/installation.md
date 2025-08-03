# Installation

## Quick Start

Choose your preferred method to get started with Formdown:

| Method | Installation Command | Use Case |
|--------|---------------------|----------|
| **Core Package (Recommended)** | `npm install @formdown/core` | Framework-agnostic, maximum flexibility |
| **UI Components** | `npm install @formdown/ui` | Ready-to-use web components |
| **CDN** | `<script src="https://unpkg.com/@formdown/ui@latest/dist/standalone.js"></script>` | Quick prototyping, static sites |
| **Editor Tools** | `npm install @formdown/editor` | Development environment |

## Installation Methods

### Core Package (Recommended)

For maximum flexibility and framework-agnostic usage:

```bash
npm install @formdown/core
```

**JavaScript usage:**
```javascript
import { FormManager, createFormManager, renderForm } from '@formdown/core';

// Full control with FormManager
const manager = new FormManager();
manager.parse('@name*: [] @email*: @[]');

// Set up reactive events
manager.on('data-change', ({ field, value }) => {
  console.log(`${field} changed to ${value}`);
});

// Render HTML
const html = manager.render();
document.getElementById('container').innerHTML = html;

// Or use convenience functions
const quickHTML = renderForm('@name*: []', { name: 'John Doe' });
```

**Framework Integration:**
- ✅ React, Vue, Angular, Svelte
- ✅ Vanilla JavaScript
- ✅ Node.js server-side rendering
- ✅ Complete programmatic control
- ✅ Event-driven architecture

### CDN (Browser)

For quick setup and prototyping:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Formdown UI Components -->
    <script src="https://unpkg.com/@formdown/ui@latest/dist/standalone.js"></script>
</head>
<body>
    <!-- Your Formdown content -->
    <formdown-ui>
        @name: [text required]
        @email: [email required]
        @submit: [submit label="Send"]
    </formdown-ui>
</body>
</html>
```

**Features:**
- ✅ Zero build setup
- ✅ Works in any HTML page
- ✅ Automatic form rendering
- ✅ Built-in validation

### NPM Package

For projects using modern build tools:

```bash
npm install @formdown/ui
```

```javascript
// Import the component
import '@formdown/ui';

// Use in your HTML/JSX
<formdown-ui>
    @name*: []
    @email*: @[]
    @submit: [submit label="Send"]
</formdown-ui>
```

**Build Tool Support:**
- ✅ Webpack, Vite, Rollup
- ✅ TypeScript definitions included
- ✅ Tree-shaking compatible
- ✅ ES modules + CommonJS

### Editor Tools (Development)

For enhanced development experience:

```bash
npm install @formdown/editor
```

```html
<formdown-editor>
    @name*: []
    @email*: @[]
    @submit: [submit label="Send"]
</formdown-editor>
```

**Editor Features:**
- 🎨 Live preview
- 💡 Syntax highlighting
- 🔍 Error detection
- 📝 Auto-completion

## Framework Integration

### React

```bash
npm install @formdown/ui
```

```jsx
// App.jsx
import '@formdown/ui';

function ContactForm() {
    return (
        <formdown-ui>
            {`
            @name*: []
            @email*: @[]
            @message: T4[]
            @submit: [submit label="Send Message"]
            `}
        </formdown-ui>
    );
}
```

### Vue

```bash
npm install @formdown/ui
```

```vue
<!-- App.vue -->
<template>
    <formdown-ui>
        @name*: []
        @email*: @[]
        @submit: [submit label="Send"]
    </formdown-ui>
</template>

<script>
import '@formdown/ui';
export default {
    name: 'ContactForm'
}
</script>
```

### Angular

```bash
npm install @formdown/ui
```

```typescript
// main.ts
import '@formdown/ui';
```

```html
<!-- app.component.html -->
<formdown-ui>
    @name*: []
    @email*: @[]
    @submit: [submit label="Send"]
</formdown-ui>
```

Add to `angular.json`:
```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "allowedCommonJsDependencies": ["@formdown/ui"]
          }
        }
      }
    }
  }
}
```

### Svelte

```bash
npm install @formdown/ui
```

```svelte
<!-- App.svelte -->
<script>
    import '@formdown/ui';
</script>

<formdown-ui>
    @name*: []
    @email*: @[]
    @submit: [submit label="Send"]
</formdown-ui>
```

## Package Overview

| Package | Size | Description | Install |
|---------|------|-------------|---------|
| `@formdown/core` | ~15KB | Parser engine only | `npm install @formdown/core` |
| `@formdown/ui` | ~45KB | Web components + parser | `npm install @formdown/ui` |
| `@formdown/editor` | ~65KB | Editor + UI + parser | `npm install @formdown/editor` |

## Next Steps

1. **[Basic Syntax](./basics)** - Learn core Formdown syntax
2. **[Shorthand Syntax](./shorthand)** - Faster form creation
3. **[Examples](./examples)** - See real-world forms
4. **[JavaScript API](./api)** - Programmatic control

## Troubleshooting

### Common Issues

**TypeScript errors:**
```bash
# Install type definitions if missing
npm install --save-dev @types/node
```

**Web component not recognized:**
```javascript
// Ensure import is called before using component
import '@formdown/ui';
```

**Bundler issues:**
```javascript
// For Webpack < 5, add to webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      "fs": false,
      "path": false
    }
  }
};
```