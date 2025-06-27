# Formdown

**Formdown** transforms markdown-like syntax into interactive HTML forms. Write forms as naturally as writing text.

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
| **Human Readable** | Forms written like natural text |
| **Type Safe** | Built-in validation and type checking |
| **Zero Dependencies** | Works anywhere HTML works |
| **Framework Agnostic** | React, Vue, Angular, vanilla JS |
| **Shorthand Syntax** | Write forms 50% faster |
| **Smart Labels** | Automatic label generation |
| **Inline Fields** | Embed forms in text content |

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

## 📦 Packages

| Package | Size | Description | Install |
|---------|------|-------------|----------|
| **@formdown/ui** | ~45KB | Web components + parser | `npm install @formdown/ui` |
| **@formdown/core** | ~15KB | Parser engine only | `npm install @formdown/core` |
| **@formdown/editor** | ~65KB | Editor + UI + parser | `npm install @formdown/editor` |

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

### JavaScript API
```javascript
const form = document.querySelector('formdown-ui');
const result = form.validate();
if (result.isValid) {
    const data = form.getFormData();
    console.log(data); // { name: "John", email: "john@example.com" }
}
```

## 🤝 Contributing

```bash
git clone https://github.com/iyulab/formdown.git
cd formdown
npm install
npm run build
npm test
```

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

**[📖 Full Documentation](https://formdown.dev/docs)** • **[🚀 Try Demo](https://formdown.dev/demo)** • **[💬 Discussions](https://github.com/iyulab/formdown/discussions)**