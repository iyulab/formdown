# API Reference

## @formdown/ui

### `renderForm(source, options?)`

Renders a Formdown source string into an HTML form element.

**Parameters:**
- `source` (string): The Formdown source code
- `options` (object, optional): Rendering options

**Returns:** HTMLFormElement

**Example:**
```javascript
import { renderForm } from '@formdown/ui';

const form = renderForm('name[text]:Name*');
document.body.appendChild(form);
```

---

### Web Components

#### `<formdown-form>`

A custom element that renders Formdown source as a form.

**Attributes:**
- `src` (string): URL to fetch Formdown source from
- `auto-submit` (boolean): Automatically submit form on enter

**Example:**
```html
<formdown-form src="/forms/contact.fd"></formdown-form>
```

**Content:**
```html
<formdown-form>
  name[text]:Name*
  email[email]:Email*
</formdown-form>
```

#### `<formdown-editor>`

A live editor with syntax highlighting and preview.

**Attributes:**
- `mode` ("editor" | "split" | "view"): Display mode
- `auto-save` (boolean): Save changes to localStorage

**Example:**
```html
<formdown-editor mode="split">
  name[text]:Name*
</formdown-editor>
```

## @formdown/core

### parseForm(source)

Parses Formdown source into an abstract syntax tree.

**Parameters:**
- `source` (string): The Formdown source code

**Returns:** FormAST

### generateHTML(ast, options?)

Generates HTML from a parsed form AST.

**Parameters:**
- `ast` (FormAST): Parsed form structure
- `options` (object, optional): Generation options

**Returns:** string

## Events

### Form Events

All forms emit standard HTML events:
- `submit`: Form submission
- `change`: Field value changes
- `input`: Real-time input changes

### Custom Events

#### `formdown:ready`
Fired when a form is fully rendered and ready for interaction.

#### `formdown:validate`
Fired during form validation with validation results.

**Example:**
```javascript
form.addEventListener('formdown:validate', (event) => {
  console.log('Validation results:', event.detail);
});
```
