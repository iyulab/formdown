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

#### `<formdown-ui>`

A custom element that renders Formdown source as interactive forms with validation support.

**Attributes:**
- `content` (string): The Formdown source content
- `form-id` (string): ID for the generated form
- `show-submit-button` (boolean): Show/hide submit button
- `submit-text` (string): Text for submit button

**Methods:**

##### `validate()`
Validates all form fields and returns validation results with visual feedback.

**Returns:** `ValidationResult`
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

interface FieldError {
  field: string;
  message: string;
}
```

**Example:**
```javascript
const formdownUI = document.querySelector('formdown-ui');
const validation = formdownUI.validate();

if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
  // Fields with errors will be visually highlighted
}
```

##### `getFormData()`
Gets current form data as an object.

**Returns:** `Record<string, any>`

**Example:**
```javascript
const formdownUI = document.querySelector('formdown-ui');
const data = formdownUI.getFormData();
console.log('Form data:', data);
```

##### `resetForm()`
Resets the form to its initial state and clears validation states.

**Example:**
```javascript
const formdownUI = document.querySelector('formdown-ui');
formdownUI.resetForm();
```

**Events:**
- `formdown-change`: Fired when any field value changes
- `formdown-data-update`: Fired when form data is updated

**Example:**
```html
<formdown-ui content="@name: [text required]
@email: [email required]
@age: [number min=18]">
</formdown-ui>

<script>
const form = document.querySelector('formdown-ui');

// Validate form
document.getElementById('validate-btn').addEventListener('click', () => {
  const result = form.validate();
  if (result.isValid) {
    console.log('Form is valid!', form.getFormData());
  }
});
</script>
```

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

A live editor with syntax highlighting and preview, including validation support.

**Attributes:**
- `mode` ("editor" | "split" | "view"): Display mode
- `auto-save` (boolean): Save changes to localStorage

**Methods:**

##### `validate()`
Validates the form in the preview panel and returns validation results.

**Returns:** `ValidationResult`

**Example:**
```javascript
const editor = document.querySelector('formdown-editor');
const validation = editor.validate();

if (!validation.isValid) {
  console.log('Form validation failed:', validation.errors);
  // Preview panel will show visual validation feedback
}
```

##### `getFormData()`
Gets current form data from the preview panel.

**Returns:** `Record<string, any>`

**Example:**
```javascript
const editor = document.querySelector('formdown-editor');
const data = editor.getFormData();
console.log('Current form data:', data);
```

**Example:**
```html
<formdown-editor mode="split">
  @name: [text required placeholder="Enter your name"]
  @email: [email required]
  @age: [number min=18 max=120]
</formdown-editor>

<script>
const editor = document.querySelector('formdown-editor');

// Validate the form in preview
document.getElementById('validate-btn').addEventListener('click', () => {
  const result = editor.validate();
  console.log('Validation result:', result);
});

// Get form data
document.getElementById('get-data-btn').addEventListener('click', () => {
  const data = editor.getFormData();
  console.log('Form data:', data);
});
</script>
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
