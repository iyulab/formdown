# API Reference

## @formdown/core

### Core-First Architecture

Formdown features a Core-First architecture where the `@formdown/core` package provides comprehensive form management capabilities through the **FormManager** and **FormDataBinding** classes. The UI and Editor packages are thin presentation layers that delegate to these core APIs.

### FormManager Class

The **FormManager** is the central API for all form operations in Formdown. It provides complete form lifecycle management with reactive data binding and event-driven architecture.

#### Constructor

```typescript
new FormManager(options?: FormManagerOptions)

interface FormManagerOptions {
  preserveMarkdown?: boolean
  fieldPrefix?: string
  inlineFieldDelimiter?: string
  autoGenerateFormIds?: boolean
  theme?: Record<string, any>
}
```

#### Core Methods

##### `parse(content: string): FormdownContent`

Parses Formdown content and initializes the form manager with schema and data binding.

**Parameters:**
- `content` (string): The Formdown source code

**Returns:** `FormdownContent` - Parsed form structure

**Example:**
```javascript
import { FormManager } from '@formdown/core';

const manager = new FormManager();
const result = manager.parse('@name*: [placeholder="Enter name"]');
// Returns parsed content and initializes internal schema
```

##### `render(options?: RenderOptions): string`

Renders the parsed form to HTML with current data values.

**Parameters:**
- `options` (RenderOptions, optional): Rendering options

```typescript
interface RenderOptions {
  theme?: Record<string, any>
  customAttributes?: Record<string, any>
  outputFormat?: 'html' | 'json'
}
```

**Returns:** HTML string or JSON based on output format

**Example:**
```javascript
const manager = new FormManager();
manager.parse('@email*: @[]');
manager.setFieldValue('email', 'user@example.com');
const html = manager.render();
// Returns HTML with email field pre-filled
```

##### `getData(): Record<string, any>`

Gets current form data with proper value priority (`context.data` > `schema value` > `empty`).

**Returns:** Current form data object

**Example:**
```javascript
const data = manager.getData();
console.log(data); // { name: "John", email: "john@example.com" }
```

##### `setFieldValue(field: string, value: any): void`

Sets a single field value and triggers data change events.

**Parameters:**
- `field` (string): Field name
- `value` (any): Value to set

**Example:**
```javascript
manager.setFieldValue('priority', 'High');
// Triggers 'data-change' event automatically
```

##### `updateData(newData: Record<string, any>): void`

Updates multiple form fields at once.

**Parameters:**
- `newData` (Record<string, any>): Object with field values to update

**Example:**
```javascript
manager.updateData({
  name: 'Jane Smith',
  email: 'jane@example.com',
  age: 30
});
```

##### `validate(): ValidationResult`

Validates current form data against the schema.

**Returns:** `ValidationResult`

```typescript
interface ValidationResult {
  isValid: boolean
  errors: FieldError[]
}
```

**Example:**
```javascript
const result = manager.validate();
if (!result.isValid) {
  console.log('Validation errors:', result.errors);
}
```

##### `getSchema(): FormDownSchema | null`

Gets the extracted form schema.

**Returns:** Schema object or null if no form is parsed

##### `reset(): void`

Resets form data to schema defaults and emits reset event.

##### `isDirty(): boolean`

Checks if form has unsaved changes from defaults.

**Returns:** `true` if form data has changed from defaults

#### Event System

FormManager provides an event-driven architecture for reactive form interactions.

##### `on<K extends keyof FormManagerEvents>(event: K, handler: Function): void`

Subscribes to form events.

**Events:**
- `data-change`: Fired when field values change
- `validation-error`: Fired when validation fails
- `form-submit`: Fired on form submission
- `form-reset`: Fired when form is reset

**Example:**
```javascript
manager.on('data-change', ({ field, value, formData }) => {
  console.log(`Field ${field} changed to:`, value);
  console.log('Current form data:', formData);
});

manager.on('validation-error', ({ field, errors }) => {
  console.log(`Validation failed for ${field}:`, errors);
});
```

##### `off<K extends keyof FormManagerEvents>(event: K, handler: Function): void`

Unsubscribes from form events.

#### Utility Methods

##### `getField(fieldName: string): Field | null`

Gets field definition by name.

##### `getFields(): Field[]`

Gets all form fields.

##### `getDefaultValues(): Record<string, any>`

Gets default values from schema.

##### `clone(): FormManager`

Creates a new FormManager instance with same options.

##### `export(): FormManagerExport`

Exports form configuration for serialization.

##### `import(config: FormManagerImport): void`

Imports form configuration.

### FormDataBinding Class

**FormDataBinding** provides reactive data management with schema-driven defaults and validation.

#### Constructor

```typescript
new FormDataBinding(schema?: FormDownSchema, initialData?: Record<string, any>)
```

#### Core Methods

##### `set(field: string, value: any): void`

Sets a field value with change detection.

##### `get(field: string): any`

Gets a field value with priority: `current data` > `schema default` > `undefined`.

##### `getAll(): Record<string, any>`

Gets all form data merging schema defaults with current values.

##### `updateAll(newData: Record<string, any>): void`

Updates multiple fields atomically.

##### `reset(): void`

Resets to schema defaults.

##### `validate(): ValidationResult`

Validates all fields against schema.

##### `isDirty(): boolean`

Checks if data differs from schema defaults.

##### `subscribe(listener: ChangeListener): () => void`

Subscribes to data changes. Returns unsubscribe function.

##### `subscribeToField(listener: FieldChangeListener): () => void`

Subscribes to specific field changes.

### Convenience Functions

#### `createFormManager(content: string, options?: FormManagerOptions): FormManager`

Creates and initializes a FormManager in one call.

**Example:**
```javascript
import { createFormManager } from '@formdown/core';

const manager = createFormManager(`
  @name*: [placeholder="Enter name"]
  @email*: @[]
`);

console.log(manager.getData()); // { name: "", email: "" }
```

#### `renderForm(content: string, data?: Record<string, any>, options?: FormManagerOptions & RenderOptions): string`

One-time form rendering convenience function.

**Example:**
```javascript
import { renderForm } from '@formdown/core';

const html = renderForm(
  '@name*: [placeholder="Enter name"]',
  { name: 'John Doe' }
);
// Returns HTML with name field pre-filled
```

### Migration from Legacy Functions

The Core-First architecture maintains backward compatibility while providing enhanced functionality:

**Legacy approach:**
```javascript
import { parseFormdown, generateFormHTML } from '@formdown/core';

const parsed = parseFormdown(content);
const html = generateFormHTML(parsed);
```

**Modern approach (recommended):**
```javascript
import { FormManager } from '@formdown/core';

const manager = new FormManager();
manager.parse(content);
const html = manager.render();
// Plus: reactive data binding, events, validation, etc.
```

### Core Functions

#### `parseFormdown(input: string): FormdownContent`

Parses Formdown syntax into structured data containing both form fields and markdown content.

**Parameters:**
- `input` (string): The Formdown source code

**Returns:** `FormdownContent`
```typescript
interface FormdownContent {
  markdown: string;  // Processed markdown with field placeholders
  forms: Field[];    // Parsed form fields
}
```

**Example:**
```javascript
import { parseFormdown } from '@formdown/core';

const result = parseFormdown('@name: [text required]\n\n# Contact Form');
// Returns: { markdown: "<!--FORMDOWN_FIELD_0-->\n\n# Contact Form", forms: [...] }
```

#### `generateFormHTML(content: FormdownContent): string`

Generates complete HTML including forms and markdown content.

**Parameters:**
- `content` (FormdownContent): Parsed formdown content

**Returns:** HTML string

**Example:**
```javascript
import { parseFormdown, generateFormHTML } from '@formdown/core';

const parsed = parseFormdown('@name: [text required]');
const html = generateFormHTML(parsed);
// Returns: Complete HTML with form and markdown
```

#### `getSchema(content: string): FormDownSchema`

Extracts structured schema metadata from Formdown content.

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
  position: number;
  validation?: ValidationRules;
  htmlAttributes?: Record<string, any>;
  layout: 'inline' | 'vertical';
}
```

**Example:**
```javascript
import { getSchema } from '@formdown/core';

const schema = getSchema('@name: [text required minlength=2]');
// Returns: { name: { type: 'text', required: true, validation: { minlength: 2 } } }
```

### Extension System

#### `registerPlugin(plugin: Plugin): Promise<void>`

Registers a plugin with the extension system.

**Example:**
```javascript
import { registerPlugin } from '@formdown/core';

const myPlugin = {
  metadata: { name: 'my-plugin', version: '1.0.0' },
  fieldTypes: [{
    type: 'phone',
    parser: (content, context) => ({ /* custom parsing */ }),
    generator: (field, context) => '/* custom HTML */'
  }]
};

await registerPlugin(myPlugin);
```

#### `registerHook(hook: Hook): void`

Registers a custom hook for extending core functionality.

**Example:**
```javascript
import { registerHook } from '@formdown/core';

registerHook({
  name: 'field-parse',
  priority: 1,
  handler: (context) => {
    // Custom field processing
    return enhancedField;
  }
});
```

---

## FormdownFieldHelper

**FormdownFieldHelper** provides a predictable and rational API for interacting with Formdown form fields. It automatically handles "other" options across all field types and provides a consistent interface for getting and setting field values.

### Core Methods

#### `get(fieldName, form?): FieldValue`

Gets the current value(s) of a field.

**Parameters:**
- `fieldName` (string): Name of the field
- `form` (HTMLFormElement, optional): Form element to search in

**Returns:** 
- String for single-value fields (radio, select, text)
- String array for checkbox fields
- `null` if field not found

**Example:**
```javascript
import { FormdownFieldHelper } from '@formdown/core';

// Radio/Select: single value
FormdownFieldHelper.get('priority')  // → "Medium" | null

// Checkbox: array of values
FormdownFieldHelper.get('skills')    // → ["JavaScript", "Rust"] | []

// Text: string value
FormdownFieldHelper.get('name')      // → "John Doe" | null
```

#### `set(fieldName, value, options?): boolean`

Sets field value(s). Automatically uses "other" option for values not in predefined options.

**Parameters:**
- `fieldName` (string): Name of the field
- `value` (string | string[]): Value to set
- `options` (FieldHelperOptions, optional): Configuration options

**Returns:** `boolean` - Success status

**Example:**
```javascript
// Set existing option
FormdownFieldHelper.set('priority', 'High')     // → true

// Set other option (automatically detected)
FormdownFieldHelper.set('priority', 'Urgent')   // → true (uses other option)

// Set checkbox values
FormdownFieldHelper.set('skills', ['JavaScript', 'CustomSkill'])  // → true

// Set text field
FormdownFieldHelper.set('name', 'John Doe')     // → true
```

#### `clear(fieldName, options?): boolean`

Clears all values from a field.

**Parameters:**
- `fieldName` (string): Name of the field
- `options` (FieldHelperOptions, optional): Configuration options

**Returns:** `boolean` - Success status

**Example:**
```javascript
FormdownFieldHelper.clear('priority')  // → true
FormdownFieldHelper.clear('skills')    // → true (clears all checkboxes)
```

#### `has(fieldName, value, form?): boolean`

Checks if a field has a specific value.

**Parameters:**
- `fieldName` (string): Name of the field
- `value` (string): Value to check for
- `form` (HTMLFormElement, optional): Form element to search in

**Returns:** `boolean` - Whether the field has the value

**Example:**
```javascript
FormdownFieldHelper.has('priority', 'High')     // → true/false
FormdownFieldHelper.has('skills', 'JavaScript') // → true/false (searches in array)
```

### Checkbox-Specific Methods

#### `add(fieldName, value, options?): boolean`

Adds a value to a checkbox field while preserving existing selections.

**Parameters:**
- `fieldName` (string): Name of the checkbox field
- `value` (string): Value to add
- `options` (FieldHelperOptions, optional): Configuration options

**Returns:** `boolean` - Success status

**Example:**
```javascript
FormdownFieldHelper.add('skills', 'Python')     // Add to existing selections
FormdownFieldHelper.add('skills', 'CustomSkill') // Add as other option
```

#### `remove(fieldName, value, options?): boolean`

Removes a specific value from a checkbox field.

**Parameters:**
- `fieldName` (string): Name of the checkbox field
- `value` (string): Value to remove
- `options` (FieldHelperOptions, optional): Configuration options

**Returns:** `boolean` - Success status

**Example:**
```javascript
FormdownFieldHelper.remove('skills', 'JavaScript')  // Remove specific value
```

#### `toggle(fieldName, value, options?): boolean`

Toggles a value in a checkbox field (add if not present, remove if present).

**Parameters:**
- `fieldName` (string): Name of the checkbox field
- `value` (string): Value to toggle
- `options` (FieldHelperOptions, optional): Configuration options

**Returns:** `boolean` - Success status

**Example:**
```javascript
FormdownFieldHelper.toggle('skills', 'Python')  // Add or remove based on current state
```

### Utility Methods

#### `getFieldType(fieldName, form?): FormFieldType`

Gets the type of a field.

**Parameters:**
- `fieldName` (string): Name of the field
- `form` (HTMLFormElement, optional): Form element to search in

**Returns:** `FormFieldType` - Field type ('radio' | 'checkbox' | 'select' | 'text' | 'textarea' | 'unknown')

**Example:**
```javascript
FormdownFieldHelper.getFieldType('priority')  // → 'radio'
FormdownFieldHelper.getFieldType('skills')    // → 'checkbox'
```

#### `isOtherValue(fieldName, value, form?): boolean`

Checks if a value would be treated as an "other" option.

**Parameters:**
- `fieldName` (string): Name of the field
- `value` (string): Value to check
- `form` (HTMLFormElement, optional): Form element to search in

**Returns:** `boolean` - Whether the value would use the "other" option

**Example:**
```javascript
FormdownFieldHelper.isOtherValue('priority', 'High')    // → false (existing option)
FormdownFieldHelper.isOtherValue('priority', 'Urgent')  // → true (other option)
```

### Options Configuration

#### `FieldHelperOptions`

```typescript
interface FieldHelperOptions {
    silent?: boolean;        // Suppress console warnings (default: false)
    dispatchEvents?: boolean; // Dispatch change/input events (default: true)
}
```

**Example:**
```javascript
FormdownFieldHelper.set('priority', 'Urgent', { 
    silent: true,           // No warning messages
    dispatchEvents: false   // Don't trigger events
});
```

### Other Option Handling

The FormdownFieldHelper automatically handles "other" options for all field types:

**Formdown Syntax:**
```formdown
@priority{Low,Medium,High,*(Priority Level)}: r[]
@skills{JavaScript,Python,Java,*(Other Skills)}: c[]
@country{USA,Canada,UK,*(Other Country)}: s[]
```

**Automatic Detection:**
```javascript
// These automatically use "other" option since values don't exist in predefined options
FormdownFieldHelper.set('priority', 'Urgent')   // Uses "Priority Level" other option
FormdownFieldHelper.add('skills', 'Rust')       // Uses "Other Skills" other option
FormdownFieldHelper.set('country', 'Korea')     // Uses "Other Country" other option
```

**Data Structure:**
The resulting form data maintains clean structure:
```javascript
// Clean data structure (no _other suffixes)
{
  "priority": "Urgent",
  "skills": ["JavaScript", "Rust"],
  "country": "Korea"
}
```

### Field Type Behaviors

#### Radio Fields
- **Single selection**: Only one value can be selected
- **Other option**: Automatically used for values not in predefined options
- **Clear**: Deselects all options

#### Checkbox Fields
- **Multiple selection**: Multiple values can be selected simultaneously
- **Other option**: Can be used alongside predefined options
- **Add/Remove**: Supports granular value management

#### Select Fields
- **Single selection**: Only one value can be selected
- **Other option**: Shows text input when selected
- **Clear**: Resets to empty selection

#### Text/Textarea Fields
- **Direct value**: Set and get text values directly
- **No other option**: Not applicable to text fields

### Complete Example

```javascript
import { FormdownFieldHelper } from '@formdown/core';

// Form with other options
const formContent = `
@priority{Low,Medium,High,*(Priority Level)}: r[]
@skills{JavaScript,Python,Java,*(Other Skills)}: c[]
@country{USA,Canada,UK,*(Other Country)}: s[]
@name: [text required]
`;

// Set values (mix of existing and other options)
FormdownFieldHelper.set('priority', 'Critical');     // Other option
FormdownFieldHelper.set('skills', ['JavaScript', 'Rust']); // Mix of existing and other
FormdownFieldHelper.set('country', 'Korea');         // Other option
FormdownFieldHelper.set('name', 'John Doe');         // Text field

// Add more values
FormdownFieldHelper.add('skills', 'Go');             // Add another other option

// Check values
console.log(FormdownFieldHelper.get('priority'));    // → "Critical"
console.log(FormdownFieldHelper.get('skills'));      // → ["JavaScript", "Rust", "Go"]
console.log(FormdownFieldHelper.has('skills', 'Rust')); // → true

// Get field types
console.log(FormdownFieldHelper.getFieldType('priority')); // → 'radio'
console.log(FormdownFieldHelper.isOtherValue('priority', 'Critical')); // → true
```

---

## @formdown/ui

The UI package provides thin presentation layer components that delegate core functionality to the FormManager from `@formdown/core`.

### Web Components

#### `<formdown-ui>`

A custom element that renders Formdown source as interactive forms with validation support. Internally uses FormManager for all business logic.

**Attributes:**
- `content` (string): The Formdown source content
- `form-id` (string): ID for the generated form
- `show-submit-button` (boolean): Show/hide submit button
- `submit-text` (string): Text for submit button
- `select-on-focus` (boolean): Select text on focus

**Methods:**

##### `validate(): ValidationResult`
Validates all form fields using the internal FormManager and returns validation results with visual feedback.

**Returns:** `ValidationResult`
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: FieldError[];
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

##### `getFormData(): Record<string, any>`
Gets current form data via the internal FormManager.

**Returns:** Current form data object

**Example:**
```javascript
const formdownUI = document.querySelector('formdown-ui');
const data = formdownUI.getFormData();
console.log('Form data:', data);
```

##### `updateData(newData: Record<string, any>): void`
Updates form data using the internal FormManager.

**Parameters:**
- `newData` (Record<string, any>): Data to update

**Example:**
```javascript
const formdownUI = document.querySelector('formdown-ui');
formdownUI.updateData({ name: 'John Doe', email: 'john@example.com' });
```

##### `updateField(fieldName: string, value: any): void`
Updates a single field using the internal FormManager.

**Parameters:**
- `fieldName` (string): Field name
- `value` (any): Field value

##### `reset(): void`
Resets the form to schema defaults using the internal FormManager.

**Example:**
```javascript
const formdownUI = document.querySelector('formdown-ui');
formdownUI.reset();
```

##### `isDirty(): boolean`
Checks if form has unsaved changes using the internal FormManager.

**Returns:** `true` if form data has changed from defaults

##### `getSchema(): FormDownSchema | null`
Gets the form schema from the internal FormManager.

**Returns:** Schema object or null

**Properties:**
- `data` (Record<string, any>): Reactive data property that syncs with FormManager

**Events:**
- `validation-error`: Fired when validation fails (forwarded from FormManager)
- `form-submit`: Fired on form submission (forwarded from FormManager)

**Internal Architecture:**
The `<formdown-ui>` component maintains an internal FormManager instance and forwards all business logic to it:

```javascript
// Internal implementation concept
class FormdownUI extends LitElement {
  private formManager: FormManager;
  
  validate() {
    return this.formManager.validate(); // Delegates to FormManager
  }
  
  getFormData() {
    return this.formManager.getData(); // Delegates to FormManager
  }
}

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

### Extension System

#### `ExtensionManager`

Central manager for the extension system that orchestrates plugins, hooks, and events.

**Constructor:**
```typescript
new ExtensionManager(options?: ExtensionOptions)

interface ExtensionOptions {
  errorHandling?: {
    onPluginError?: 'ignore' | 'warn' | 'throw'
    onHookError?: 'ignore' | 'warn' | 'throw'
    continueOnError?: boolean
  }
  performance?: {
    defaultTimeout?: number
    enableProfiling?: boolean
  }
}
```

**Methods:**

##### `registerPlugin(plugin, options?)`
Registers a new plugin with the extension system.

**Parameters:**
- `plugin` (Plugin): The plugin to register
- `options` (PluginOptions, optional): Registration options

```typescript
interface Plugin {
  metadata: PluginMetadata
  hooks?: Hook[]
  fieldTypes?: FieldTypePlugin[]
  validators?: ValidatorPlugin[]
  renderers?: RendererPlugin[]
  initialize?: (eventEmitter: EventEmitter) => void
  destroy?: () => void
}

interface PluginMetadata {
  name: string
  version: string
  description?: string
  author?: string
  dependencies?: string[]
}
```

**Example:**
```typescript
const extensionManager = new ExtensionManager()

extensionManager.registerPlugin({
  metadata: {
    name: 'bootstrap-theme',
    version: '1.0.0',
    description: 'Bootstrap 5 theme integration'
  },
  hooks: [{
    name: 'css-class',
    handler: (context) => {
      context.field.attributes.className = 'form-control'
      return context
    }
  }]
})
```

##### `unregisterPlugin(pluginName)`
Removes a plugin from the extension system.

**Parameters:**
- `pluginName` (string): Name of the plugin to remove

**Returns:** `boolean` - True if plugin was found and removed

##### `executeHooks(hookType, context)`
Executes all registered hooks of a specific type.

**Parameters:**
- `hookType` (HookType): The type of hook to execute
- `context` (HookContext): Context object for the hook

**Returns:** `Promise<HookContext>` - Modified context after hook execution

```typescript
type HookType = 
  | 'pre-parse' | 'post-parse' | 'field-parse' | 'field-validate'
  | 'pre-generate' | 'post-generate' | 'template-render'
  | 'css-class' | 'attribute-inject' | 'validation-rule'
  | 'error-format' | 'accessibility' | 'performance' | 'debug'
```

##### `getPluginInfo(pluginName)`
Gets information about a registered plugin.

**Parameters:**
- `pluginName` (string): Name of the plugin

**Returns:** `PluginInfo | null`

```typescript
interface PluginInfo {
  metadata: PluginMetadata
  status: 'active' | 'error' | 'disabled'
  hooks: number
  fieldTypes: number
  validators: number
}
```

##### `listPlugins()`
Gets a list of all registered plugins.

**Returns:** `PluginInfo[]`

**Example:**
```typescript
const extensionManager = new ExtensionManager()

// Register plugins
extensionManager.registerPlugin(bootstrapPlugin)
extensionManager.registerPlugin(validationPlugin)

// List all plugins
const plugins = extensionManager.listPlugins()
console.log('Registered plugins:', plugins.map(p => p.metadata.name))

// Get specific plugin info
const bootstrapInfo = extensionManager.getPluginInfo('bootstrap-theme')
if (bootstrapInfo) {
  console.log('Bootstrap plugin status:', bootstrapInfo.status)
}

// Execute hooks
const context = { field: { name: 'email', type: 'email' } }
const result = await extensionManager.executeHooks('css-class', context)
```

#### Hook System

Hooks allow you to execute custom code at specific points in the parsing and generation pipeline.

**Hook Interface:**
```typescript
interface Hook {
  name: HookType
  priority?: number
  handler: HookHandler
  timeout?: number
}

type HookHandler<T extends HookType> = (
  context: HookContext[T]
) => HookContext[T] | Promise<HookContext[T]>
```

**Hook Contexts:**
```typescript
interface HookContext {
  'pre-parse': { content: string }
  'post-parse': { parseResult: ParseResult }
  'field-parse': { field: Field, content: string }
  'field-validate': { field: Field, value: any, isValid: boolean }
  'pre-generate': { parseResult: ParseResult }
  'post-generate': { html: string, parseResult: ParseResult }
  'template-render': { field: Field, template: string }
  'css-class': { field: Field }
  'attribute-inject': { field: Field }
  'validation-rule': { field: Field, rules: ValidationRule[] }
  'error-format': { error: FieldError, message: string }
  'accessibility': { field: Field, attributes: Record<string, any> }
  'performance': { operation: string, startTime: number }
  'debug': { field: Field, debug: any }
}
```

#### Plugin Types

##### Field Type Plugins

Create custom field types with complete parsing and rendering logic:

```typescript
interface FieldTypePlugin {
  type: string
  parser: (content: string) => Field | null
  validator?: (field: Field, value: any) => ValidationRule[]
  generator?: (field: Field) => string
}
```

**Example:**
```typescript
const creditCardPlugin: FieldTypePlugin = {
  type: 'credit-card',
  parser: (content) => {
    const match = content.match(/@(\w+):\s*\[credit-card\](.*)/)
    if (!match) return null
    
    return {
      name: match[1],
      type: 'credit-card',
      label: 'Credit Card Number',
      attributes: {
        pattern: '[0-9\\s]{13,19}',
        inputmode: 'numeric'
      }
    }
  },
  validator: (field, value) => {
    if (value && !isValidCreditCard(value)) {
      return [{
        type: 'invalid-credit-card',
        message: 'Please enter a valid credit card number'
      }]
    }
    return []
  },
  generator: (field) => `
    <input type="text" 
           name="${field.name}" 
           pattern="${field.attributes?.pattern}"
           inputmode="${field.attributes?.inputmode}" />
  `
}
```

##### Validator Plugins

Add custom validation logic:

```typescript
interface ValidatorPlugin {
  name: string
  validate: (value: any, field?: Field) => boolean | Promise<boolean>
  getMessage: (field?: Field) => string
}
```

**Example:**
```typescript
const uniqueEmailValidator: ValidatorPlugin = {
  name: 'unique-email',
  validate: async (value) => {
    if (!value) return true
    const exists = await checkEmailExists(value)
    return !exists
  },
  getMessage: () => 'This email address is already registered'
}
```

### Core Functions with Extensions

#### `parseForm(source, options?)`

Enhanced parseForm function with extension support.

**Parameters:**
- `source` (string): The Formdown source code
- `options` (object, optional): Parse options with extension support

```typescript
interface ParseOptions {
  extensionManager?: ExtensionManager
  validate?: boolean
  strictMode?: boolean
}
```

**Example:**
```typescript
import { parseForm, ExtensionManager } from '@formdown/core'

const extensionManager = new ExtensionManager()
extensionManager.registerPlugin(myCustomPlugin)

const ast = await parseForm(source, { 
  extensionManager,
  validate: true 
})
```

#### `generateHTML(ast, options?)`

Enhanced generateHTML function with extension support.

**Parameters:**
- `ast` (FormAST): Parsed form structure
- `options` (object, optional): Generation options with extension support

```typescript
interface GenerateOptions {
  extensionManager?: ExtensionManager
  theme?: string
  format?: 'html' | 'react' | 'vue'
  minify?: boolean
}
```

**Example:**
```typescript
import { generateHTML, ExtensionManager } from '@formdown/core'

const extensionManager = new ExtensionManager()
extensionManager.registerPlugin(reactThemePlugin)

const html = await generateHTML(ast, { 
  extensionManager,
  format: 'react'
})
```

---

### getSchema(content)

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
