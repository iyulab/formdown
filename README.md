# Formdown

**Formdown** transforms markdown-like syntax into interactive HTML forms with **Core-First Architecture**. Write forms as naturally as writing text, powered by advanced Core modules.

**Phase 2 Complete**: Revolutionary FormManager + 4 Core modules architecture with 100% UI/Editor integration.

```formdown
# Contact Form
@name*: []
@email*: @[]
@message: T4[]
@submit: [submit label="Send Message"]
```

**Becomes a fully functional contact form with validation!**

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Core-First Architecture** | FormManager + 4 specialized Core modules |
| **Human Readable** | Forms written like natural text |
| **100% Core Integration** | UI/Editor packages delegate to Core modules |
| **Framework Agnostic** | React, Vue, Angular, vanilla JS |
| **Performance Optimized** | 9.3% code reduction with enhanced functionality |
| **Real-time Processing** | EventOrchestrator coordinates component events |
| **Advanced Validation** | ValidationManager with async pipelines |
| **Smart DOM Handling** | DOMBinder manages all DOM operations |
| **Field Processing** | FieldProcessor handles type processing and validation |

## 🚀 Quick Start

### CDN (Fastest)
```html
<script src="https://unpkg.com/@formdown/ui@latest/dist/standalone.js"></script>
<formdown-ui>
    @name*: []
    @email*: @[]
    @submit: [submit]
</formdown-ui>
```

### NPM
```bash
npm install @formdown/ui
```

```javascript
import '@formdown/ui';

// Use in your HTML/JSX
<formdown-ui>
    @name*: []
    @email*: @[]
    @submit: [submit]
</formdown-ui>
```

### Examples

| Type | Standard Syntax | Shorthand Syntax |
|------|-----------------|------------------|
| **Contact Form** | `@name: [text required]`<br>`@email: [email required]` | `@name*: []`<br>`@email*: @[]` |
| **Phone Number** | `@phone: [tel pattern="\d{3}-\d{3}-\d{4}"]` | `@phone{###-###-####}: %[]` |
| **Inline Fields** | `Name: ___@name[text required]` | `Name: ___@name*` |
| **Selection** | `@size: [radio options="S,M,L,XL"]` | `@size{S,M,L,XL}: r[]` |

## 🏗️ Core-First Architecture

**Phase 2 Complete**: Revolutionary architecture with 100% business logic centralization.

### FormManager + 4 Core Modules
- **FormManager**: Central coordinator with 12+ UI/Editor integration APIs
- **FieldProcessor**: Field type processing, validation, and value extraction  
- **DOMBinder**: DOM manipulation, event handling, and data synchronization
- **ValidationManager**: Async validation pipelines with caching and debouncing
- **EventOrchestrator**: Component-to-component event coordination

### Package Integration
- **@formdown/ui** 🎨: 100% Core delegation (1186 lines, 9.3% optimized)
- **@formdown/editor** ✏️: Complete EventOrchestrator integration (505 lines + template consolidation)
- **@formdown/core** ⭐: Complete form lifecycle engine with specialized modules

## 📦 Packages

| Package | Size | Description | Architecture |
|---------|------|-------------|--------------|
| **@formdown/core** | ~15KB | Complete Core modules | FormManager + 4 Core modules |
| **@formdown/ui** | ~45KB | Optimized web components | 100% Core delegation |
| **@formdown/editor** | ~65KB | Enhanced editor | EventOrchestrator integration |

## 📚 Documentation

| Resource | Description |
|----------|-------------|
| **[📖 Complete Documentation](https://formdown.dev/docs)** | Full syntax guide, examples, and API reference |
| **[🚀 Interactive Demo](https://formdown.dev/demo)** | Try Formdown in your browser |
| **[💡 Examples](https://formdown.dev/docs/examples)** | Real-world form examples |
| **[🔧 JavaScript API](https://formdown.dev/docs/api)** | Programmatic control and validation |

### Quick Links
- [Basic Syntax](https://formdown.dev/docs/basics) - Learn core concepts
- [Shorthand Syntax](https://formdown.dev/docs/shorthand) - Write forms faster
- [Field Reference](https://formdown.dev/docs/reference) - Complete field types
- [Installation](https://formdown.dev/docs/installation) - Framework integration

### Local Documentation

- [Syntax Guide](./docs/SYNTAX.md) - Complete formdown syntax reference
- [Shorthand Syntax](./docs/SHORTHAND_SYNTAX.md) - Faster form creation
- [Architecture](./docs/ARCHITECTURE.md) - Technical architecture

## 🛠️ Framework Integration

### React
```jsx
import '@formdown/ui';

function ContactForm() {
    return (
        <formdown-ui>
            @name*: []
            @email*: @[]
            @submit: [submit]
        </formdown-ui>
    );
}
```

### Vue
```vue
<template>
    <formdown-ui>
        @name*: []
        @email*: @[]
        @submit: [submit]
    </formdown-ui>
</template>

<script>
import '@formdown/ui';
export default { name: 'ContactForm' }
</script>
```

### Angular
```typescript
// main.ts
import '@formdown/ui';
```
```html
<!-- component.html -->
<formdown-ui>
    @name*: []
    @email*: @[]
    @submit: [submit]
</formdown-ui>
```

## 🚀 Features Showcase

### Smart Labels
```formdown
@first_name: []        # Label: "First Name"
@email_address: []     # Label: "Email Address" 
@phone_number: []      # Label: "Phone Number"
```

### Pattern Validation
```formdown
@phone{(###)###-####}: %[]           # Phone format
@ssn{###-##-####}: []                # SSN format
@email{*@company.com}: @[]           # Company email
```

### Inline Forms
```formdown
Hello ___@name*! Your order #___@order_id is ready.
Delivery date: ___@delivery_date: d[]
```

### Other Options with Custom Labels
```formdown
@priority{Low,Medium,High,*(Priority Level)}: r[]
@skills{JavaScript,Python,Java,*(Other Skills)}: c[]
@country{USA,Canada,UK,*(Other Country)}: s[]
```

### Field Helper API
```javascript
import { FormdownFieldHelper } from '@formdown/core';

// Set values (automatically handles other options)
FormdownFieldHelper.set('priority', 'Critical');    // Uses "Priority Level" other
FormdownFieldHelper.set('skills', ['JavaScript', 'Rust']); // Mix of existing and other
FormdownFieldHelper.add('skills', 'Go');            // Add another other option

// Get current values
console.log(FormdownFieldHelper.get('priority'));   // → "Critical"
console.log(FormdownFieldHelper.get('skills'));     // → ["JavaScript", "Rust", "Go"]
```

### JavaScript API
```javascript
const form = document.querySelector('formdown-ui');
const result = form.validate();
if (result.isValid) {
    const data = form.getFormData();
    console.log(data); // { name: "John", email: "john@example.com" }
}
```