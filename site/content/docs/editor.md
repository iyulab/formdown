# Formdown Editor

The **@formdown/editor** package provides an advanced development environment for creating and editing Formdown syntax with real-time preview capabilities.

## Overview

The Formdown Editor is a web component that enhances the development experience when working with Formdown syntax. It offers three distinct modes to accommodate different workflow preferences and development stages.

## Installation

```bash
npm install @formdown/editor
```

### Basic Usage

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@formdown/editor/dist/index.es.js"></script>

<formdown-editor
    content="@name(Full Name): [text required]"
    mode="split">
</formdown-editor>
```

### JavaScript Integration

```javascript
import '@formdown/editor';

const editor = document.createElement('formdown-editor');
editor.content = '@name(Full Name): [text required]';
editor.mode = 'split';
document.body.appendChild(editor);
```

## Editor Modes

The Formdown Editor supports three distinct modes to match your development workflow:

### Editor Mode (`mode="editor"`)

**Pure editing experience** - Focus entirely on writing Formdown syntax without distractions.

**Features:**
- Syntax highlighting for Formdown syntax
- Auto-completion for field types and attributes
- Error detection and validation
- Line numbers and bracket matching
- Full-screen editing experience

**Best for:**
- Writing new forms from scratch
- Focused editing sessions
- When you know the syntax well
- Mobile or small screen devices

**Example:**
```html
<formdown-editor 
    content="@name: [text required]" 
    mode="editor">
</formdown-editor>
```

### Split Mode (`mode="split"`) - **Recommended**

**Side-by-side editing and preview** - See your Formdown syntax and the resulting form simultaneously.

**Features:**
- Live editor on the left side
- Real-time form preview on the right side
- Instant feedback as you type
- Synchronized scrolling (optional)
- Resizable panels
- Full syntax highlighting and validation

**Best for:**
- Learning Formdown syntax
- Iterative form development
- Visual feedback while editing
- Desktop development environments
- Form styling and layout testing

**Example:**
```html
<formdown-editor 
    content="@name: [text required]" 
    mode="split">
</formdown-editor>
```

### View Mode (`mode="view"`)

**Preview-only display** - Show the rendered form without editing capabilities.

**Features:**
- Clean form rendering
- No editing interface
- Optimized for presentation
- Interactive form elements
- Data collection capabilities

**Best for:**
- Demonstrations and presentations
- Embedded forms in documentation
- Final form display
- User-facing implementations

**Example:**
```html
<formdown-editor 
    content="@name: [text required]" 
    mode="view">
</formdown-editor>
```

## Advanced Configuration

### Customization Options

```html
<formdown-editor
    content="@name: [text required]"
    mode="split"
    theme="dark"
    show-line-numbers="true"
    auto-save="true"
    validate-on-type="true">
</formdown-editor>
```

### Available Attributes

- **`content`** - Initial Formdown syntax content
- **`mode`** - Editor mode: `"editor"`, `"split"`, or `"view"`
- **`theme`** - Color theme: `"light"` or `"dark"`
- **`show-line-numbers`** - Display line numbers in editor
- **`auto-save`** - Automatically save changes to localStorage
- **`validate-on-type`** - Real-time syntax validation
- **`readonly`** - Make editor read-only

### Event Handling

```javascript
const editor = document.querySelector('formdown-editor');

// Listen for content changes
editor.addEventListener('content-change', (event) => {
    console.log('New content:', event.detail.content);
});

// Listen for validation errors
editor.addEventListener('validation-error', (event) => {
    console.log('Validation errors:', event.detail.errors);
});

// Listen for mode changes
editor.addEventListener('mode-change', (event) => {
    console.log('New mode:', event.detail.mode);
});
```

## Integration Examples

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import '@formdown/editor';

function FormdownEditor({ initialContent, onContentChange }) {
    const editorRef = useRef(null);

    useEffect(() => {
        const editor = editorRef.current;
        
        const handleContentChange = (event) => {
            onContentChange(event.detail.content);
        };

        editor.addEventListener('content-change', handleContentChange);
        
        return () => {
            editor.removeEventListener('content-change', handleContentChange);
        };
    }, [onContentChange]);

    return (
        <formdown-editor
            ref={editorRef}
            content={initialContent}
            mode="split">
        </formdown-editor>
    );
}
```

### Vue Integration

```vue
<template>
    <formdown-editor
        :content="formContent"
        mode="split"
        @content-change="handleContentChange">
    </formdown-editor>
</template>

<script>
import '@formdown/editor';

export default {
    data() {
        return {
            formContent: '@name: [text required]'
        };
    },
    methods: {
        handleContentChange(event) {
            this.formContent = event.detail.content;
        }
    }
};
</script>
```

## Development Workflow

### Recommended Approach

1. **Start with Split Mode** - Begin development using `mode="split"` to see immediate visual feedback
2. **Iterate Quickly** - Make changes and see results instantly
3. **Switch to Editor Mode** - Use `mode="editor"` for focused editing sessions
4. **Test with View Mode** - Preview final form using `mode="view"`
5. **Validate and Deploy** - Ensure syntax is correct before production use

### Best Practices

- **Use Split Mode for Learning** - Visual feedback helps understand syntax
- **Leverage Auto-completion** - Speed up development with built-in suggestions
- **Enable Validation** - Catch syntax errors early in development
- **Test Different Devices** - Switch modes based on screen size
- **Save Frequently** - Enable auto-save for longer editing sessions

## Comparison with @formdown/ui

| Feature | @formdown/editor | @formdown/ui |
|---------|------------------|--------------|
| **Purpose** | Development tool | Production renderer |
| **Editing** | ✅ Full editor | ❌ Display only |
| **Multiple Modes** | ✅ Editor/Split/View | ❌ View only |
| **Syntax Highlighting** | ✅ Yes | ❌ Not needed |
| **Live Preview** | ✅ Yes | ❌ Not applicable |
| **Bundle Size** | Larger (dev features) | Smaller (production) |
| **Use Case** | Development & Demo | Production forms |

## Use Cases

### Development Environment
```html
<!-- Perfect for development -->
<formdown-editor 
    content="@name: [text required]" 
    mode="split"
    auto-save="true">
</formdown-editor>
```

### Documentation Sites
```html
<!-- Great for tutorials -->
<formdown-editor 
    content="@example: [text]" 
    mode="split"
    readonly="true">
</formdown-editor>
```

### Interactive Demos
```html
<!-- Allow users to experiment -->
<formdown-editor 
    content="@playground: [text]" 
    mode="split">
</formdown-editor>
```

## Related Documentation

- [Formdown Syntax](./syntax) - Complete syntax reference
- [API Documentation](./api) - JavaScript API reference
- [Validation Guide](./validation) - Form validation features

## Support

For issues, feature requests, or contributions, visit the [GitHub repository](https://github.com/iyulab/formdown).
