# Formdown Extension System

The Formdown Extension System provides a comprehensive plugin architecture that allows developers to extend and customize every aspect of Formdown's functionality. This system is built on a hook-based architecture with type-safe interfaces and robust error handling.

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Hook System](#hook-system)
- [Plugin Development](#plugin-development)
- [Built-in Extensions](#built-in-extensions)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Quick Start

### Basic Plugin Registration

```typescript
import { ExtensionManager } from '@formdown/core'

// Create and initialize extension manager
const extensionManager = new ExtensionManager()
await extensionManager.initialize()

// Register a simple plugin
const plugin = {
  metadata: {
    name: 'my-plugin',
    version: '1.0.0',
    description: 'A custom field type plugin'
  },
  fieldTypes: [{
    type: 'rating',
    parser: (content) => {
      // Custom parsing logic
      return parsedField
    },
    generator: (field) => {
      // Custom HTML generation
      return '<div class="rating">...</div>'
    }
  }]
}

await extensionManager.registerPlugin(plugin)
```

### Using Hooks

```typescript
import { ExtensionManager } from '@formdown/core'

const extensionManager = new ExtensionManager()
await extensionManager.initialize()

// Register a custom hook
const hook = {
  name: 'pre-parse' as const,
  priority: 10,
  handler: (context: any) => {
    // Transform input before parsing
    return transformedInput
  }
}

extensionManager.registerHook(hook)
```

## Core Concepts

### Extension Manager

The `ExtensionManager` is the central coordinator that manages:

- **Plugin Registration**: Loading and initializing plugins
- **Hook Execution**: Coordinating hook-based extensions
- **Event System**: Publishing and subscribing to extension events
- **Lifecycle Management**: Plugin initialization and cleanup

### Hooks

Hooks are execution points where plugins can inject custom behavior:

```typescript
type HookName = 
  | 'pre-parse'      // Before parsing input
  | 'post-parse'     // After parsing fields
  | 'field-parse'    // When parsing individual fields
  | 'field-validate' // When validating field values
  | 'pre-generate'   // Before HTML generation
  | 'post-generate'  // After HTML generation
  | 'field-render'   // When rendering individual fields
  | 'error-handle'   // When handling errors
```

### Plugins

Plugins are collections of extensions that can include:

- **Field Types**: Custom form field implementations
- **Validators**: Custom validation rules
- **Renderers**: Custom HTML templates
- **Themes**: Custom styling systems
- **Hooks**: Custom behavior injection

## Hook System

### Hook Registration

```typescript
import { registerHook } from '@formdown/core'

registerHook({
  name: 'field-parse',
  priority: 100, // Higher priority executes first
  handler: (context, ...args) => {
    // Hook implementation
    console.log('Processing field:', context.field?.name)
    return processedResult
  }
})
```

### Hook Context

Every hook receives a context object:

```typescript
interface HookContext {
  input?: string           // Original input being processed
  field?: Field           // Current field being processed
  parseResult?: ParseResult // Current parsing results
  metadata?: Record<string, any> // Additional data
}
```

### Async Hook Execution

```typescript
// Hooks can be asynchronous
registerHook({
  name: 'field-validate',
  priority: 10,
  handler: async (context) => {
    const result = await validateWithExternalAPI(context.field)
    return result
  }
})
```

## Plugin Development

### Complete Plugin Example

```typescript
import type { Plugin, FieldTypePlugin, ValidationPlugin } from '@formdown/core'

// Custom field type for star ratings
const ratingFieldType: FieldTypePlugin = {
  type: 'rating',
  parser: (content: string) => {
    const match = content.match(/@(\w+):\s*\[rating\](.*)/)
    if (!match) return null
    
    const [, name, rest] = match
    const maxMatch = rest.match(/max=(\d+)/)
    const max = maxMatch ? parseInt(maxMatch[1]) : 5
    
    return {
      name,
      type: 'rating',
      label: name,
      attributes: { max }
    }
  },
  validator: (field, value) => {
    const rules = []
    const max = field.attributes?.max || 5
    
    if (value && (value < 1 || value > max)) {
      rules.push({
        type: 'custom',
        message: `Rating must be between 1 and ${max}`
      })
    }
    
    return rules
  },
  generator: (field) => {
    const max = field.attributes?.max || 5
    const stars = Array.from({ length: max }, (_, i) => 
      `<span class="star" data-value="${i + 1}">☆</span>`
    ).join('')
    
    return `
      <div class="rating-field" data-name="${field.name}">
        <label for="${field.name}">${field.label}</label>
        <div class="stars">${stars}</div>
        <input type="hidden" name="${field.name}" id="${field.name}" />
      </div>
    `
  }
}

// Custom validation rule
const phoneValidator: ValidationPlugin = {
  name: 'phone',
  validate: async (value) => {
    if (!value) return true
    
    // Can use external APIs for validation
    const isValid = await validatePhoneNumber(value)
    return isValid
  },
  getMessage: () => 'Please enter a valid phone number'
}

// Complete plugin
const customPlugin: Plugin = {
  metadata: {
    name: 'custom-field-plugin',
    version: '1.0.0',
    description: 'Adds rating fields and phone validation',
    author: 'Your Name',
    dependencies: ['formdown-core'] // Optional dependencies
  },
  
  // Plugin initialization
  initialize: async () => {
    console.log('Custom plugin initialized')
    // Setup code here
  },
  
  // Plugin cleanup
  destroy: async () => {
    console.log('Custom plugin destroyed')
    // Cleanup code here
  },
  
  // Register field types
  fieldTypes: [ratingFieldType],
  
  // Register validators
  validators: [phoneValidator],
  
  // Register hooks
  hooks: [{
    name: 'post-parse',
    priority: 10,
    handler: (context) => {
      // Add custom CSS classes to all fields
      if (context.parseResult?.fields) {
        context.parseResult.fields.forEach(field => {
          field.attributes = {
            ...field.attributes,
            className: `form-field form-field--${field.type}`
          }
        })
      }
    }
  }]
}

// Register the plugin
await registerPlugin(customPlugin)
```

### Theme Plugin Example

```typescript
const darkThemePlugin: Plugin = {
  metadata: {
    name: 'dark-theme',
    version: '1.0.0'
  },
  themes: [{
    name: 'dark',
    cssProperties: {
      '--form-bg': '#1a1a1a',
      '--form-text': '#ffffff',
      '--form-border': '#333333',
      '--form-focus': '#4a9eff'
    },
    classOverrides: {
      'form-field': 'form-field form-field--dark',
      'form-button': 'form-button form-button--dark'
    }
  }]
}
```

## Built-in Extensions

### Core Field Types

The extension system includes built-in support for:

- `text` - Text input fields
- `email` - Email input with validation
- `select` - Dropdown selection fields
- `checkbox` - Checkbox inputs
- `radio` - Radio button groups
- `textarea` - Multi-line text areas
- `range` - Range slider inputs with live value display

### Range Field Example

The range field demonstrates a complete field type implementation:

```markdown
# Basic range field
@volume: [range]

# Range with custom attributes
@temperature: [range min=0 max=40 step=0.5 unit="°C"]

# Range with custom label
@brightness(Display Brightness): [range max=255]

# Required range with hidden value display
@opacity: [range hideValue] required
```

The range field plugin includes:
- Comprehensive parsing for multiple syntax variations
- Full validation with min/max/step checking
- HTML generation with live value display
- Data processing for input/output operations
- JSON schema generation
- CSS styles and client-side JavaScript

### Core Validators

- `required` - Required field validation
- `pattern` - Regular expression validation
- `minlength` - Minimum length validation
- `maxlength` - Maximum length validation
- `min` - Minimum value validation
- `max` - Maximum value validation

## API Reference

### ExtensionManager

```typescript
class ExtensionManager {
  // Initialize the extension system
  async initialize(): Promise<void>
  
  // Destroy the extension system
  async destroy(): Promise<void>
  
  // Register a plugin
  async registerPlugin(plugin: Plugin): Promise<void>
  
  // Unregister a plugin
  async unregisterPlugin(pluginName: string): Promise<void>
  
  // Register a hook
  registerHook(hook: Hook): void
  
  // Execute hooks
  async executeHooks<T>(hookName: HookName, context: HookContext, ...args: any[]): Promise<T[]>
  
  // Get field type registry
  getFieldTypeRegistry(): FieldTypeRegistry
  
  // Get system statistics
  getStats(): ExtensionStats
  
  // Enable debug mode
  enableDebug(): void
}
```

### FieldTypeRegistry

The Field Type Registry provides specialized methods for custom field types:

```typescript
class FieldTypeRegistry {
  // Register a field type plugin
  register(plugin: FieldTypePlugin): void
  
  // Unregister a field type
  unregister(type: string): void
  
  // Get a field type plugin
  get(type: string): FieldTypePlugin | undefined
  
  // Check if a field type is registered
  has(type: string): boolean
  
  // Parse field content using registered parsers
  parseField(content: string, context: HookContext): Field | null
  
  // Generate HTML using registered generators
  generateFieldHTML(field: Field, context: HookContext): string | null
  
  // Validate field using registered validators
  validateField(field: Field, value: any): ValidationRule[]
  
  // Process field data with registered processors
  processFieldData(field: Field, value: any, operation: 'input' | 'output' | 'serialize' | 'deserialize'): any
  
  // Validate field data format
  validateFieldData(field: Field, value: any): { valid: boolean; error?: string }
  
  // Generate JSON schema for a field
  generateFieldSchema(field: Field): object | null
  
  // Get CSS styles for specific field types
  getStylesForTypes(types: string[]): string
  
  // Get JavaScript for specific field types
  getScriptsForTypes(types: string[]): string
  
  // Get registry statistics
  getStats(): RegistryStats
}
```

### Convenience Functions

```typescript
// Initialize with default options
await initializeExtensions()

// Register a plugin
await registerPlugin(plugin)

// Register a hook
registerHook(hook)

// Execute hooks
const results = await executeHooks('field-parse', context)

// Get statistics
const stats = getExtensionStats()

// Access field type registry
import { defaultExtensionManager } from '@formdown/core'
const registry = defaultExtensionManager.getFieldTypeRegistry()

// Parse content with custom field types
const field = registry.parseField('@volume: [range]', context)

// Generate HTML with custom field types
const html = registry.generateFieldHTML(field, context)

// Get styles for used field types
const styles = registry.getStylesForTypes(['range', 'rating'])

// Process form data
const processedValue = registry.processFieldData(field, rawValue, 'input')
```

### Event System

```typescript
// Listen to extension events
extensionManager.getEventEmitter().on('plugin-registered', (event) => {
  console.log('Plugin registered:', event.data.plugin)
})

// Available events:
// - plugin-registered
// - plugin-unregistered
// - plugin-initialized
// - plugin-error
// - hook-registered
// - hook-executed
// - hook-error
```

## Examples

### Adding Custom Field Types

```typescript
// Add a color picker field
const colorFieldPlugin: Plugin = {
  metadata: { name: 'color-field', version: '1.0.0' },
  fieldTypes: [{
    type: 'color',
    parser: (content) => {
      const match = content.match(/@(\w+):\s*\[color\](.*)/)
      if (!match) return null
      
      return {
        name: match[1],
        type: 'color',
        label: match[1],
        defaultValue: '#ffffff'
      }
    },
    generator: (field) => `
      <label for="${field.name}">${field.label}</label>
      <input type="color" name="${field.name}" id="${field.name}" 
             value="${field.defaultValue || '#ffffff'}" />
    `
  }]
}
```

### Custom Validation Rules

```typescript
// Add password strength validation
const passwordStrengthPlugin: Plugin = {
  metadata: { name: 'password-strength', version: '1.0.0' },
  validators: [{
    name: 'strong-password',
    validate: (value) => {
      if (!value) return true
      
      const hasUpper = /[A-Z]/.test(value)
      const hasLower = /[a-z]/.test(value)
      const hasNumber = /\d/.test(value)
      const hasSpecial = /[!@#$%^&*]/.test(value)
      const isLongEnough = value.length >= 8
      
      return hasUpper && hasLower && hasNumber && hasSpecial && isLongEnough
    },
    getMessage: () => 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  }]
}
```

### Form Processing Hooks

```typescript
// Add analytics tracking
const analyticsPlugin: Plugin = {
  metadata: { name: 'analytics', version: '1.0.0' },
  hooks: [{
    name: 'post-generate',
    priority: 1,
    handler: (context) => {
      // Track form generation
      analytics.track('form_generated', {
        fieldCount: context.parseResult?.fields.length,
        fieldTypes: context.parseResult?.fields.map(f => f.type)
      })
    }
  }]
}
```

## Best Practices

### Plugin Development

1. **Naming Convention**: Use descriptive names with your organization prefix
2. **Version Management**: Follow semantic versioning
3. **Dependencies**: Clearly specify plugin dependencies
4. **Error Handling**: Always handle errors gracefully
5. **Testing**: Write comprehensive tests for your plugins

### Performance

1. **Hook Priority**: Use appropriate priorities to control execution order
2. **Async Operations**: Use async hooks for I/O operations
3. **Memory Management**: Clean up resources in destroy methods
4. **Caching**: Cache expensive computations

### Security

1. **Input Validation**: Always validate user inputs
2. **Sanitization**: Sanitize HTML output
3. **Dependencies**: Keep dependencies up to date
4. **Permissions**: Follow principle of least privilege

### Example Test

```typescript
describe('Custom Plugin', () => {
  let extensionManager: ExtensionManager

  beforeEach(async () => {
    extensionManager = new ExtensionManager()
    await extensionManager.initialize()
  })

  afterEach(async () => {
    await extensionManager.destroy()
  })

  it('should register custom field type', async () => {
    await extensionManager.registerPlugin(customPlugin)
    
    const stats = extensionManager.getStats()
    expect(stats.fieldTypes).toContain('rating')
    expect(stats.validators).toContain('phone')
  })
})
```

---

For more examples and advanced usage, see the [Extension Examples](./extension-examples.md) documentation.
