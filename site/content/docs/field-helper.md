# Field Helper API

The **FormdownFieldHelper** provides a predictable and rational API for programmatically interacting with Formdown form fields. It automatically handles "other" options across all field types and provides a consistent interface for getting and setting field values.

## Quick Start

```javascript
import { FormdownFieldHelper } from '@formdown/core';

// Get current field value
const priority = FormdownFieldHelper.get('priority');

// Set field value (automatically uses "other" option if needed)
FormdownFieldHelper.set('priority', 'Urgent');

// Add checkbox value
FormdownFieldHelper.add('skills', 'Rust');

// Check if field has value
const hasJS = FormdownFieldHelper.has('skills', 'JavaScript');
```

## Core Principles

### 🎯 Predictable
- Consistent method signatures across all field types
- Boolean return values for operations (success/failure)
- Null/empty values for missing data

### 🧠 Rational  
- Single-value fields (radio, select) use string values
- Multi-value fields (checkbox) use arrays
- Automatic "other" option detection and handling

### ✨ Automatic Other Options
- Values not in predefined options automatically use "other" option
- Clean data structure without `_other` field suffixes
- Custom other labels are preserved

## API Reference

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

```javascript
// Single-value fields
FormdownFieldHelper.get('priority')  // → "Medium" | null
FormdownFieldHelper.get('country')   // → "USA" | null
FormdownFieldHelper.get('name')      // → "John Doe" | null

// Multi-value fields (checkboxes)
FormdownFieldHelper.get('skills')    // → ["JavaScript", "Rust"] | []
```

#### `set(fieldName, value, options?): boolean`

Sets field value(s). Automatically uses "other" option for values not in predefined options.

**Parameters:**
- `fieldName` (string): Name of the field
- `value` (string | string[]): Value to set
- `options` (FieldHelperOptions, optional): Configuration options

**Returns:** `boolean` - Success status

```javascript
// Set existing option
FormdownFieldHelper.set('priority', 'High')     // → true

// Set other option (automatically detected)
FormdownFieldHelper.set('priority', 'Urgent')   // → true

// Set multiple checkbox values
FormdownFieldHelper.set('skills', ['JavaScript', 'CustomSkill'])  // → true

// Set text field
FormdownFieldHelper.set('name', 'John Doe')     // → true
```

#### `clear(fieldName, options?): boolean`

Clears all values from a field.

```javascript
FormdownFieldHelper.clear('priority')  // → true (deselects radio)
FormdownFieldHelper.clear('skills')    // → true (unchecks all boxes)
FormdownFieldHelper.clear('name')      // → true (clears text)
```

#### `has(fieldName, value, form?): boolean`

Checks if a field has a specific value.

```javascript
FormdownFieldHelper.has('priority', 'High')     // → true/false
FormdownFieldHelper.has('skills', 'JavaScript') // → true/false (searches array)
```

### Checkbox-Specific Methods

#### `add(fieldName, value, options?): boolean`

Adds a value to a checkbox field while preserving existing selections.

```javascript
// Add to existing selections
FormdownFieldHelper.add('skills', 'Python')     // Add existing option
FormdownFieldHelper.add('skills', 'CustomSkill') // Add as other option
```

#### `remove(fieldName, value, options?): boolean`

Removes a specific value from a checkbox field.

```javascript
FormdownFieldHelper.remove('skills', 'JavaScript')  // Remove specific value
```

#### `toggle(fieldName, value, options?): boolean`

Toggles a value in a checkbox field (add if not present, remove if present).

```javascript
FormdownFieldHelper.toggle('skills', 'Python')  // Add or remove
```

### Utility Methods

#### `getFieldType(fieldName, form?): FormFieldType`

Gets the type of a field.

```javascript
FormdownFieldHelper.getFieldType('priority')  // → 'radio'
FormdownFieldHelper.getFieldType('skills')    // → 'checkbox'
FormdownFieldHelper.getFieldType('country')   // → 'select'
FormdownFieldHelper.getFieldType('name')      // → 'text'
```

#### `isOtherValue(fieldName, value, form?): boolean`

Checks if a value would be treated as an "other" option.

```javascript
FormdownFieldHelper.isOtherValue('priority', 'High')    // → false (existing option)
FormdownFieldHelper.isOtherValue('priority', 'Urgent')  // → true (other option)
```

## Other Option Handling

### Formdown Syntax

Use the `*` syntax to enable other options with custom labels:

```formdown
@priority{Low,Medium,High,*(Priority Level)}: r[]
@skills{JavaScript,Python,Java,*(Other Skills)}: c[]
@country{USA,Canada,UK,*(Other Country)}: s[]
```

### Automatic Detection

The FieldHelper automatically detects when to use other options:

```javascript
// Form with: @priority{Low,Medium,High,*(Priority Level)}: r[]

// Existing option - selects "High" radio button
FormdownFieldHelper.set('priority', 'High')

// Other option - selects "Priority Level" other option with "Urgent" text
FormdownFieldHelper.set('priority', 'Urgent')
```

### Clean Data Structure

Form data maintains a clean structure without special `_other` fields:

```javascript
// Traditional "other" handling (what we DON'T do):
{
  "priority": "_other",
  "priority_other": "Urgent"
}

// Formdown FieldHelper (clean structure):
{
  "priority": "Urgent"
}
```

## Field Type Behaviors

### Radio Fields
- **Selection**: Single value only
- **Other option**: Automatically used for non-existing values
- **Clear**: Deselects all options

### Checkbox Fields  
- **Selection**: Multiple values supported
- **Other option**: Can be used alongside existing options
- **Management**: Granular add/remove/toggle operations

### Select Fields
- **Selection**: Single value only  
- **Other option**: Shows text input when selected
- **Clear**: Resets to empty selection

### Text/Textarea Fields
- **Value**: Direct string assignment
- **Other option**: Not applicable

## Configuration Options

### FieldHelperOptions

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
    dispatchEvents: false   // Don't trigger DOM events
});
```

## Complete Example

```javascript
import { FormdownFieldHelper } from '@formdown/core';

// Form with other options
const formContent = `
@priority{Low,Medium,High,*(Priority Level)}: r[required]
@skills{JavaScript,Python,Java,*(Other Skills)}: c[]
@country{USA,Canada,UK,*(Other Country)}: s[]
@name: [text required]
`;

// Set values (mix of existing and other options)
FormdownFieldHelper.set('priority', 'Critical');     // Other option
FormdownFieldHelper.set('skills', ['JavaScript', 'Rust']); // Mix
FormdownFieldHelper.set('country', 'Korea');         // Other option
FormdownFieldHelper.set('name', 'John Doe');         // Text field

// Add more checkbox values
FormdownFieldHelper.add('skills', 'Go');             // Another other option
FormdownFieldHelper.add('skills', 'Python');         // Existing option

// Check current state
console.log('Priority:', FormdownFieldHelper.get('priority'));    // → "Critical"
console.log('Skills:', FormdownFieldHelper.get('skills'));        // → ["JavaScript", "Rust", "Go", "Python"]
console.log('Country:', FormdownFieldHelper.get('country'));      // → "Korea"

// Field information
console.log('Priority type:', FormdownFieldHelper.getFieldType('priority')); // → 'radio'
console.log('Is Critical other?', FormdownFieldHelper.isOtherValue('priority', 'Critical')); // → true
console.log('Has Rust skill?', FormdownFieldHelper.has('skills', 'Rust')); // → true

// Clear specific fields
FormdownFieldHelper.remove('skills', 'Go');          // Remove specific skill
FormdownFieldHelper.clear('priority');               // Clear priority selection
```

## Live Demo

Try the [Field Helper API Demo](/samples/field-helper-api) to see the API in action with an interactive form.

## Browser Console Testing

If you have a Formdown form on your page, you can test the API directly in your browser's developer console:

```javascript
// Get current form values
FormdownFieldHelper.get('priority');
FormdownFieldHelper.get('skills');

// Set some values
FormdownFieldHelper.set('priority', 'Custom Priority');
FormdownFieldHelper.add('skills', 'Rust');

// Check field information
FormdownFieldHelper.getFieldType('priority');
FormdownFieldHelper.isOtherValue('skills', 'Rust');
```

The FieldHelper API makes programmatic form interaction intuitive and powerful while automatically handling the complexity of "other" options behind the scenes.