# API Reference

## @formdown/core (Phase 2 Complete)

The core package provides the **Core-First Architecture** foundation with **FormManager** and **4 Core modules** for complete form lifecycle management.

### FormManager Class

The **FormManager** is the central API for all form operations in Formdown. It provides complete form lifecycle management with reactive data binding, Core module coordination, and event-driven architecture.

**Phase 2 Achievement**: 12+ new methods for UI/Editor integration, 100% Core module utilization.

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

#### Core Module APIs (Phase 2 New)

##### `createFieldProcessor(): FieldProcessor`

Creates a FieldProcessor instance for advanced field processing.

**Returns:** `FieldProcessor` - Field processing module

**Example:**
```javascript
const processor = manager.createFieldProcessor();
const fieldType = processor.getFieldType(element);
const value = processor.extractFieldValue(element, fieldType);
```

##### `createDOMBinder(): DOMBinder`

Creates a DOMBinder instance for DOM manipulation and binding.

**Returns:** `DOMBinder` - DOM binding module  

**Example:**
```javascript
const binder = manager.createDOMBinder();
binder.setupElementEventHandlers(container, handler);
binder.syncFormData(formData, container);
```

##### `createValidationManager(): ValidationManager`

Creates a ValidationManager for advanced validation pipelines.

**Returns:** `ValidationManager` - Validation management module

**Example:**
```javascript
const validator = manager.createValidationManager();
const result = await validator.validateAsync(fieldContext, value, formData);
```

##### `createEventOrchestrator(): EventOrchestrator`

Creates an EventOrchestrator for component coordination.

**Returns:** `EventOrchestrator` - Event orchestration module

**Example:**
```javascript
const orchestrator = manager.createEventOrchestrator();
const bridgeId = orchestrator.createCoreUIBridge(coreComponent, uiComponent);
```

#### UI/Editor Integration APIs (Phase 2 New)

##### `renderToTemplate(options?: any): any`

Render form to template format for UI components.

**Returns:** Structured template data for component rendering

##### `createPreviewTemplate(content: string): any`

Create preview template for editor components.

**Parameters:**
- `content` (string): Formdown content for preview

**Returns:** Preview template with HTML, errors, and schema

##### `handleUIEvent(event: Event, domBinder?: DOMBinder): void`

Handle UI events from components through Core modules.

**Parameters:**
- `event` (Event): DOM event from UI component
- `domBinder` (DOMBinder, optional): DOMBinder instance

##### `setupComponentBridge(target: any): string`

Setup component bridge using EventOrchestrator.

**Parameters:**
- `target` (any): Target component for bridge

**Returns:** Bridge ID for coordination

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

interface FieldError {
  field: string
  message: string
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
  defaultValue?: any;
  position?: number;
  validation?: ValidationRules;
  htmlAttributes?: Record<string, any>;
  layout?: 'inline' | 'vertical';
}
```

**Example:**
```javascript
import { getSchema } from '@formdown/core';

const schema = getSchema('@name: [text required minlength=2]');
// Returns: { name: { type: 'text', required: true, validation: { minlength: 2 } } }
```

### FormdownFieldHelper

**FormdownFieldHelper** provides a predictable and rational API for interacting with Formdown form fields. It automatically handles "other" options across all field types and provides a consistent interface for getting and setting field values.

#### Core Methods

##### `get(fieldName: string, form?: HTMLFormElement): FieldValue`

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

##### `set(fieldName: string, value: string | string[], options?: FieldHelperOptions): boolean`

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

##### `clear(fieldName: string, options?: FieldHelperOptions): boolean`

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

##### `has(fieldName: string, value: string, form?: HTMLFormElement): boolean`

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

#### Checkbox-Specific Methods

##### `add(fieldName: string, value: string, options?: FieldHelperOptions): boolean`

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

##### `remove(fieldName: string, value: string, options?: FieldHelperOptions): boolean`

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

##### `toggle(fieldName: string, value: string, options?: FieldHelperOptions): boolean`

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

#### Utility Methods

##### `getFieldType(fieldName: string, form?: HTMLFormElement): FormFieldType`

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

##### `isOtherValue(fieldName: string, value: string, form?: HTMLFormElement): boolean`

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

#### Options Configuration

##### `FieldHelperOptions`

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

---

## @formdown/ui (Phase 2.1 Complete)

The UI package provides web components for rendering Formdown content as interactive forms with **100% Core module integration**.

**Phase 2.1 Achievement**: 1307 lines → 1186 lines (9.3% optimization), complete FormManager delegation, DOMBinder integration.

### `<formdown-ui>` Web Component

A custom element that renders Formdown source as interactive forms with Core-powered validation and data management.

#### Attributes

- `content` (string): The Formdown source content
- `form-id` (string): ID for the generated form
- `show-submit-button` (boolean): Show/hide submit button
- `submit-text` (string): Text for submit button
- `select-on-focus` (boolean): Select text on focus

#### Properties

- `data` (Record<string, any>): Reactive data property that syncs with internal FormManager

#### Methods

##### `validate(): ValidationResult`

Validates all form fields and returns validation results with visual feedback.

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

Gets current form data.

**Returns:** Current form data object

**Example:**
```javascript
const formdownUI = document.querySelector('formdown-ui');
const data = formdownUI.getFormData();
console.log('Form data:', data);
```

##### `updateData(newData: Record<string, any>): void`

Updates form data.

**Parameters:**
- `newData` (Record<string, any>): Data to update

**Example:**
```javascript
const formdownUI = document.querySelector('formdown-ui');
formdownUI.updateData({ name: 'John Doe', email: 'john@example.com' });
```

##### `updateField(fieldName: string, value: any): void`

Updates a single field.

**Parameters:**
- `fieldName` (string): Field name
- `value` (any): Field value

##### `reset(): void`

Resets the form to schema defaults.

**Example:**
```javascript
const formdownUI = document.querySelector('formdown-ui');
formdownUI.reset();
```

##### `isDirty(): boolean`

Checks if form has unsaved changes.

**Returns:** `true` if form data has changed from defaults

##### `getSchema(): FormDownSchema | null`

Gets the form schema.

**Returns:** Schema object or null

#### Events

- `formdown-change`: Fired when field values change
- `formdown-data-update`: Fired when form data updates
- `validation-error`: Fired when validation fails
- `form-submit`: Fired on form submission

**Example:**
```html
<formdown-ui content="@name: [text required]
@email: [email required]
@age: [number min=18]">
</formdown-ui>

<script>
const form = document.querySelector('formdown-ui');

// Listen for changes
form.addEventListener('formdown-change', (event) => {
  console.log('Field changed:', event.detail);
});

// Validate form
document.getElementById('validate-btn').addEventListener('click', () => {
  const result = form.validate();
  if (result.isValid) {
    console.log('Form is valid!', form.getFormData());
  }
});
</script>
```

### Utility Functions

#### `createFormdownUI(container: HTMLElement, options?: UIOptions): FormdownUI`

Creates and appends a FormdownUI component to a container.

**Parameters:**
- `container` (HTMLElement): Container to append to
- `options` (UIOptions, optional): Configuration options

```typescript
interface UIOptions {
  content?: string
  formId?: string
  showSubmitButton?: boolean
  submitText?: string
}
```

**Example:**
```javascript
import { createFormdownUI } from '@formdown/ui';

const form = createFormdownUI(document.getElementById('form-container'), {
  content: '@name: [text required]',
  showSubmitButton: true,
  submitText: 'Submit Form'
});
```

---

## @formdown/editor (Phase 2.2 Complete)

The editor package provides a live editor component with **100% Core module integration** and real-time Core-powered preview capabilities.

**Phase 2.2 Achievement**: Complete EventOrchestrator integration, legacy code elimination, template consolidation (505 lines + templates.ts removal).

### `<formdown-editor>` Web Component

A live editor with Core-powered real-time preview, FormManager data management, and EventOrchestrator coordination.

#### Attributes

- `content` (string): Initial Formdown content
- `mode` ("edit" | "split" | "view"): Display mode (default: "split")
- `placeholder` (string): Placeholder text for editor
- `header` (boolean): Show header bar
- `toolbar` (boolean): Show toolbar

#### Properties

- `data` (Record<string, any>): Form data that syncs with preview

#### Methods

##### `validate(): ValidationResult`

Validates the form in the preview panel.

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

##### `getFormData(): Record<string, any>`

Gets current form data from the preview panel.

**Returns:** Current form data object

**Example:**
```javascript
const editor = document.querySelector('formdown-editor');
const data = editor.getFormData();
console.log('Current form data:', data);
```

#### Events

- `formdown-change`: Fired when content changes
- `formdown-data-update`: Fired when preview form data changes

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

### Utility Functions

#### `createFormdownEditor(container: HTMLElement, options?: EditorOptions): FormdownEditor`

Creates and appends a FormdownEditor component to a container.

**Parameters:**
- `container` (HTMLElement): Container to append to
- `options` (EditorOptions, optional): Configuration options

```typescript
interface EditorOptions {
  content?: string
  showPreview?: boolean
  showToolbar?: boolean
  placeholder?: string
}
```

**Example:**
```javascript
import { createFormdownEditor } from '@formdown/editor';

const editor = createFormdownEditor(document.getElementById('editor-container'), {
  content: '@name: [text required]',
  showPreview: true,
  showToolbar: true
});
```

---

## Type Definitions

### Core Types

```typescript
interface Field {
  name: string
  type: FieldType
  label?: string
  required?: boolean
  placeholder?: string
  attributes?: Record<string, any>
  validation?: ValidationRules
  options?: string[]
  allowOther?: boolean
}

type FieldType = 
  | 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'
  | 'date' | 'time' | 'datetime-local' | 'month' | 'week'
  | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file'
  | 'color' | 'range' | 'search' | 'hidden' | 'button'
  | 'submit' | 'reset'

interface ValidationRules {
  min?: number | string
  max?: number | string
  minlength?: number
  maxlength?: number
  step?: number
  pattern?: string
  accept?: string
}

interface FieldError {
  field: string
  message: string
}

interface ValidationResult {
  isValid: boolean
  errors: FieldError[]
}

interface FormDownSchema {
  [fieldName: string]: FieldSchema
}

interface FieldSchema {
  type: FieldType
  label?: string
  required?: boolean
  defaultValue?: any
  position?: number
  validation?: ValidationRules
  htmlAttributes?: Record<string, any>
  layout?: 'inline' | 'vertical'
}
```

---

## Migration Guide

### From Legacy Functions to FormManager

The new FormManager API provides enhanced functionality while maintaining backward compatibility:

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

### Benefits of FormManager

1. **Reactive Data Binding**: Automatic synchronization between form data and UI
2. **Event-Driven Architecture**: Subscribe to form events for real-time updates
3. **Built-in Validation**: Schema-based validation with error handling
4. **State Management**: Track dirty state, reset to defaults, export/import configuration
5. **Type Safety**: Full TypeScript support with comprehensive type definitions

---

## Best Practices

### 1. Use FormManager for Interactive Forms

For forms that require user interaction, validation, or data management:

```javascript
import { FormManager } from '@formdown/core';

const manager = new FormManager();
manager.parse(formContent);

// Set up event listeners
manager.on('data-change', ({ field, value }) => {
  console.log(`Field ${field} changed to:`, value);
});

// Render with current data
const html = manager.render();
```

### 2. Use FormdownFieldHelper for DOM Manipulation

When working with rendered forms in the browser:

```javascript
import { FormdownFieldHelper } from '@formdown/core';

// Get values
const priority = FormdownFieldHelper.get('priority');

// Set values (handles "other" options automatically)
FormdownFieldHelper.set('skills', ['JavaScript', 'Custom Skill']);

// Check specific values
if (FormdownFieldHelper.has('skills', 'Python')) {
  // Python is selected
}
```

### 3. Validate Before Submission

Always validate form data before processing:

```javascript
const validation = manager.validate();
if (!validation.isValid) {
  validation.errors.forEach(error => {
    console.error(`${error.field}: ${error.message}`);
  });
  return;
}

const data = manager.getData();
// Process valid data...
```

### 4. Handle "Other" Options Consistently

The FormdownFieldHelper automatically handles "other" options:

```javascript
// Formdown syntax with other option
const content = '@priority{Low,Medium,High,*(Custom Priority)}: r[]';

// Setting a custom value automatically uses the other option
FormdownFieldHelper.set('priority', 'Urgent'); // Uses "Custom Priority" option
```

### 5. Use Web Components for Quick Integration

For rapid prototyping or simple integrations:

```html
<!-- Include the UI component -->
<script type="module" src="@formdown/ui"></script>

<!-- Use directly in HTML -->
<formdown-ui content="@name: [text required]
@email: [email required]">
</formdown-ui>
```