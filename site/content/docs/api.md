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

### `getSchema(content)`

Extracts a structured schema from Formdown content for use in form validation, UI components, and development tools.

**Parameters:**
- `content` (string): The Formdown source code

**Returns:** `FormDownSchema`

```typescript
interface FormDownSchema {
  [fieldName: string]: FieldSchema;
}

interface FieldSchema {
  type: FieldType;
  label?: string;
  required?: boolean;
  defaultValue?: any;
  
  // Validation rules
  validation?: ValidationRules;
  
  // Selection fields
  options?: string[];
  allowOther?: boolean;
  
  // Layout and presentation
  layout?: 'inline' | 'vertical';
  placeholder?: string;
  
  // HTML attributes
  htmlAttributes?: Record<string, any>;
  
  // Metadata
  position?: number;
  isInline?: boolean;
  format?: string;
  pattern?: string;
  description?: string;
  errorMessage?: string;
}

type FieldType = 
  | 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'
  | 'date' | 'time' | 'datetime-local' | 'month' | 'week'
  | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file'
  | 'color' | 'range' | 'submit' | 'reset';

interface ValidationRules {
  min?: number | string;
  max?: number | string;
  minlength?: number;
  maxlength?: number;
  step?: number;
  pattern?: string;
  accept?: string;
}
```

**Example:**
```javascript
import { getSchema } from '@formdown/core';

const formContent = `
# User Registration

@username*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="Enter username"]
@email*: @[]
@age: #[min=13 max=120]
@bio: T4[maxlength=500]
@gender{Male,Female,Other}: r[]
@interests{Web,Mobile,AI,*}: c[]
@submit: [submit label="Create Account"]
`;

const schema = getSchema(formContent);

console.log('Fields:', Object.keys(schema));
// → ['username', 'email', 'age', 'bio', 'gender', 'interests', 'submit']

console.log('Username validation:', schema.username.validation);
// → { pattern: '^[a-zA-Z0-9_]{3,20}$' }

console.log('Gender options:', schema.gender.options);
// → ['Male', 'Female', 'Other']

console.log('Interests allow other:', schema.interests.allowOther);
// → true
```

**Use Cases:**

1. **Form Validation**: Use schema to validate user input on frontend or backend
2. **Dynamic UI Generation**: Build form interfaces programmatically from schema
3. **Development Tools**: Create form builders, editors, and debugging tools
4. **API Documentation**: Generate API specs from form schemas
5. **Testing**: Automate form testing with schema-driven data generation

**Advanced Example:**
```javascript
// Backend validation with schema
import { getSchema } from '@formdown/core';

function validateFormData(formContent, userData) {
  const schema = getSchema(formContent);
  const errors = [];

  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const value = userData[fieldName];
    
    // Required field validation
    if (fieldSchema.required && (!value || value.trim() === '')) {
      errors.push({ field: fieldName, message: `${fieldSchema.label} is required` });
      continue;
    }
    
    // Type-specific validation
    if (value && fieldSchema.validation) {
      const rules = fieldSchema.validation;
      
      if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
        errors.push({ field: fieldName, message: `${fieldSchema.label} format is invalid` });
      }
      
      if (rules.min !== undefined && value < rules.min) {
        errors.push({ field: fieldName, message: `${fieldSchema.label} must be at least ${rules.min}` });
      }
      
      if (rules.maxlength !== undefined && value.length > rules.maxlength) {
        errors.push({ field: fieldName, message: `${fieldSchema.label} must be no more than ${rules.maxlength} characters` });
      }
    }
  }
  
  return { isValid: errors.length === 0, errors };
}
```

---

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
