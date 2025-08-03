# Extension System

The Formdown Extension System provides a comprehensive plugin architecture that allows developers to extend and customize every aspect of Formdown's functionality. This system is built on a hook-based architecture with type-safe interfaces and robust error handling.

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

- **Field Types**: Custom field type definitions
- **Validators**: Custom validation logic
- **Renderers**: Custom HTML generators
- **Hooks**: Event handlers for various stages
- **Themes**: Visual styling extensions

## Hook System

### Hook Types and Contexts

Each hook type receives and returns specific context data:

#### pre-parse
```typescript
interface PreParseContext {
  content: string
  options: ParseOptions
}
// Transform or validate input before parsing
```

#### post-parse
```typescript
interface PostParseContext {
  fields: Field[]
  forms: FormDeclaration[]
  metadata: any
}
// Modify parsed results
```

#### field-parse
```typescript
interface FieldParseContext {
  match: RegExpMatchArray
  type: string
  fieldName: string
  attributes: Record<string, any>
}
// Custom field parsing logic
```

#### field-validate
```typescript
interface FieldValidateContext {
  field: Field
  value: any
  formData: Record<string, any>
  errors: ValidationError[]
}
// Add custom validation
```

#### pre-generate
```typescript
interface PreGenerateContext {
  fields: Field[]
  options: GenerateOptions
  theme: ThemeConfig
}
// Modify fields before generation
```

#### post-generate
```typescript
interface PostGenerateContext {
  html: string
  fields: Field[]
  scripts: string[]
  styles: string[]
}
// Transform final HTML output
```

### Hook Priority and Execution

Hooks execute in priority order (lower numbers first):

```typescript
const hook = {
  name: 'pre-parse',
  priority: 10,  // Executes before priority 20
  handler: (context) => {
    // Your logic here
    return modifiedContext
  }
}
```

Default priorities:
- System hooks: 0-99
- Plugin hooks: 100-999
- User hooks: 1000+

## Plugin Development

### Plugin Structure

```typescript
interface Plugin {
  metadata: PluginMetadata
  hooks?: Hook[]
  fieldTypes?: FieldTypeExtension[]
  validators?: ValidatorExtension[]
  renderers?: RendererExtension[]
  themes?: ThemeExtension[]
  initialize?: (eventEmitter: EventEmitter) => Promise<void>
  destroy?: () => Promise<void>
}

interface PluginMetadata {
  name: string
  version: string
  description?: string
  author?: string
  dependencies?: string[]
  homepage?: string
  license?: string
}
```

### Creating a Field Type Plugin

```typescript
const phoneFieldPlugin: Plugin = {
  metadata: {
    name: 'phone-field',
    version: '1.0.0',
    description: 'International phone number field'
  },
  
  fieldTypes: [{
    type: 'phone',
    
    parser: (content, context) => {
      const match = content.match(/@(\w+):\s*\[phone\s*(.*?)\]/)
      if (!match) return null
      
      return {
        name: match[1],
        type: 'phone',
        attributes: {
          pattern: '[+]?[0-9\\s\\-()]+',
          placeholder: '+1 (555) 123-4567',
          ...parseAttributes(match[2])
        }
      }
    },
    
    validator: (field, value) => {
      const phoneRegex = /^[+]?[0-9\s\-()]+$/
      if (value && !phoneRegex.test(value)) {
        return [{
          field: field.name,
          message: 'Please enter a valid phone number'
        }]
      }
      return []
    },
    
    generator: (field, options) => {
      return `<input type="tel" 
              name="${field.name}" 
              pattern="${field.attributes.pattern}"
              placeholder="${field.attributes.placeholder}"
              class="formdown-phone">`
    }
  }]
}
```

### Creating a Validator Plugin

```typescript
const asyncValidatorPlugin: Plugin = {
  metadata: {
    name: 'async-validator',
    version: '1.0.0'
  },
  
  validators: [{
    name: 'unique-email',
    
    validate: async (value, field, formData) => {
      if (!value || field.type !== 'email') return true
      
      // Check uniqueness via API
      const response = await fetch(`/api/check-email?email=${value}`)
      const { exists } = await response.json()
      
      return !exists
    },
    
    getMessage: (field) => 'This email is already registered'
  }],
  
  hooks: [{
    name: 'field-validate',
    handler: async (context) => {
      // Add async validation support
      if (context.field.attributes.unique) {
        const isUnique = await this.validators[0].validate(
          context.value,
          context.field,
          context.formData
        )
        
        if (!isUnique) {
          context.errors.push({
            field: context.field.name,
            message: this.validators[0].getMessage(context.field)
          })
        }
      }
      
      return context
    }
  }]
}
```

### Creating a Theme Plugin

```typescript
const bootstrapThemePlugin: Plugin = {
  metadata: {
    name: 'bootstrap-theme',
    version: '1.0.0',
    description: 'Bootstrap 5 theme for Formdown'
  },
  
  themes: [{
    name: 'bootstrap',
    
    styles: `
      .formdown-field {
        margin-bottom: 1rem;
      }
      
      .formdown-field label {
        @apply form-label;
      }
      
      .formdown-field input,
      .formdown-field select,
      .formdown-field textarea {
        @apply form-control;
      }
      
      .formdown-field input[type="checkbox"],
      .formdown-field input[type="radio"] {
        @apply form-check-input;
      }
      
      .formdown-error {
        @apply invalid-feedback d-block;
      }
    `,
    
    fieldWrapper: (field, content) => `
      <div class="mb-3">
        ${content}
      </div>
    `,
    
    errorTemplate: (error) => `
      <div class="invalid-feedback d-block">
        ${error.message}
      </div>
    `
  }],
  
  hooks: [{
    name: 'field-render',
    handler: (context) => {
      // Add Bootstrap classes
      context.field.attributes.className = 
        (context.field.attributes.className || '') + ' form-control'
      
      return context
    }
  }]
}
```

## Built-in Extensions

### Core Extensions

Formdown includes several built-in extensions:

#### Smart Label Extension
Automatically generates human-readable labels from field names:
```typescript
@first_name → "First Name"
@emailAddress → "Email Address"
```

#### Pattern Validation Extension
Supports regex patterns in field names:
```typescript
@username{^[a-z0-9_]{3,20}$}: []
```

#### Other Option Extension
Handles "other" options for selection fields:
```typescript
@color: [radio options="Red,Blue,Green,*"]
```

### Loading Built-in Extensions

```typescript
import { ExtensionManager, loadBuiltinExtensions } from '@formdown/core'

const extensionManager = new ExtensionManager()
await extensionManager.initialize()

// Load all built-in extensions
await loadBuiltinExtensions(extensionManager)

// Or load specific ones
await extensionManager.loadBuiltin(['smart-labels', 'pattern-validation'])
```

## Event System

### Event Types

The extension system emits various events:

```typescript
type ExtensionEvent = 
  | 'plugin:registered'
  | 'plugin:unregistered'
  | 'plugin:error'
  | 'hook:registered'
  | 'hook:executing'
  | 'hook:executed'
  | 'hook:error'
```

### Subscribing to Events

```typescript
const extensionManager = new ExtensionManager()

// Subscribe to plugin events
extensionManager.on('plugin:registered', (plugin) => {
  console.log(`Plugin ${plugin.metadata.name} registered`)
})

// Subscribe to hook execution
extensionManager.on('hook:executing', ({ hook, context }) => {
  console.log(`Executing hook ${hook.name}`)
})

// Subscribe to errors
extensionManager.on('plugin:error', ({ plugin, error }) => {
  console.error(`Plugin ${plugin.metadata.name} error:`, error)
})
```

## API Reference

### ExtensionManager

```typescript
class ExtensionManager {
  // Initialize the extension system
  initialize(): Promise<void>
  
  // Plugin management
  registerPlugin(plugin: Plugin, options?: PluginOptions): Promise<void>
  unregisterPlugin(pluginName: string): Promise<void>
  getPlugin(pluginName: string): Plugin | null
  listPlugins(): PluginInfo[]
  
  // Hook management
  registerHook(hook: Hook): void
  executeHooks(hookName: HookName, context: any): Promise<any>
  
  // Built-in extensions
  loadBuiltin(names?: string[]): Promise<void>
  
  // Event system
  on(event: ExtensionEvent, handler: Function): void
  off(event: ExtensionEvent, handler: Function): void
  emit(event: ExtensionEvent, data: any): void
  
  // Configuration
  configure(options: ExtensionOptions): void
}
```

### Plugin Lifecycle

```typescript
interface Plugin {
  // Called when plugin is registered
  initialize?(eventEmitter: EventEmitter): Promise<void>
  
  // Called when plugin is unregistered
  destroy?(): Promise<void>
  
  // Plugin can listen to events
  on?(event: string, handler: Function): void
  
  // Plugin can emit events
  emit?(event: string, data: any): void
}
```

## Performance Considerations

### Hook Performance

- Hooks should execute quickly (< 50ms)
- Use async hooks only when necessary
- Consider debouncing for frequently called hooks

### Memory Management

- Clean up event listeners in destroy()
- Avoid storing large objects in plugin state
- Use WeakMap for object associations

### Error Handling

```typescript
const extensionManager = new ExtensionManager({
  errorHandling: {
    onPluginError: 'warn',     // 'ignore' | 'warn' | 'throw'
    onHookError: 'warn',
    continueOnError: true      // Continue despite errors
  }
})
```

## Security Best Practices

### Input Sanitization

Always sanitize user input in plugins:

```typescript
const sanitizePlugin: Plugin = {
  hooks: [{
    name: 'pre-parse',
    handler: (context) => {
      context.content = DOMPurify.sanitize(context.content)
      return context
    }
  }]
}
```

### Content Security Policy

Ensure plugins work with CSP:

```typescript
// Bad: Inline event handlers
generator: () => '<button onclick="handleClick()">Click</button>'

// Good: Use data attributes
generator: () => '<button data-action="click">Click</button>'
```

### Validation

Always validate plugin inputs:

```typescript
validator: (field, value) => {
  // Validate type
  if (typeof value !== 'string') {
    return [{ field: field.name, message: 'Value must be a string' }]
  }
  
  // Validate format
  if (!isValidFormat(value)) {
    return [{ field: field.name, message: 'Invalid format' }]
  }
  
  return []
}
```

## Testing Plugins

### Unit Testing

```typescript
import { ExtensionManager } from '@formdown/core'
import { myPlugin } from './my-plugin'

describe('MyPlugin', () => {
  let extensionManager: ExtensionManager
  
  beforeEach(async () => {
    extensionManager = new ExtensionManager()
    await extensionManager.initialize()
    await extensionManager.registerPlugin(myPlugin)
  })
  
  test('should parse custom field type', async () => {
    const context = {
      content: '@rating: [rating max=5]',
      options: {}
    }
    
    const result = await extensionManager.executeHooks('pre-parse', context)
    expect(result.fields).toContainEqual(
      expect.objectContaining({
        type: 'rating',
        attributes: { max: 5 }
      })
    )
  })
})
```

### Integration Testing

```typescript
import { parseFormdown } from '@formdown/core'
import { setupExtensions } from './setup'

test('plugin integrates with parser', async () => {
  const extensionManager = await setupExtensions()
  
  const result = parseFormdown(
    '@email: [email unique]',
    { extensionManager }
  )
  
  expect(result.fields[0].validators).toContain('unique-email')
})
```

## Migration Guide

### From Custom Parser to Plugin

Before (custom parser):
```typescript
function parseCustomField(content: string) {
  // Custom parsing logic
}
```

After (plugin):
```typescript
const customFieldPlugin: Plugin = {
  metadata: { name: 'custom-field', version: '1.0.0' },
  fieldTypes: [{
    type: 'custom',
    parser: (content) => {
      // Same parsing logic
    }
  }]
}
```

### From Inline Hooks to Plugin

Before (inline hooks):
```typescript
parser.beforeParse = (content) => {
  // Transform content
}
```

After (plugin hooks):
```typescript
const transformPlugin: Plugin = {
  metadata: { name: 'transform', version: '1.0.0' },
  hooks: [{
    name: 'pre-parse',
    handler: (context) => {
      // Transform context.content
      return context
    }
  }]
}
```

## Troubleshooting

### Common Issues

#### Plugin Not Loading
```typescript
// Check plugin registration
const info = extensionManager.getPlugin('my-plugin')
console.log('Plugin loaded:', info)

// Check for errors
extensionManager.on('plugin:error', (error) => {
  console.error('Plugin error:', error)
})
```

#### Hook Not Executing
```typescript
// Enable debug logging
const extensionManager = new ExtensionManager({
  debug: true
})

// Log hook execution
extensionManager.on('hook:executing', ({ hook }) => {
  console.log('Executing hook:', hook.name)
})
```

#### Performance Issues
```typescript
// Profile hook execution
extensionManager.on('hook:executed', ({ hook, duration }) => {
  if (duration > 50) {
    console.warn(`Slow hook ${hook.name}: ${duration}ms`)
  }
})
```

## Contributing

### Creating Community Plugins

1. Use the plugin template:
```bash
npx create-formdown-plugin my-plugin
```

2. Follow naming conventions:
- Package: `formdown-plugin-{name}`
- Plugin name: `{name}-plugin`

3. Include metadata:
```typescript
metadata: {
  name: 'my-plugin',
  version: '1.0.0',
  author: 'Your Name',
  homepage: 'https://github.com/...',
  license: 'MIT'
}
```

4. Document your plugin:
- README with examples
- API documentation
- Migration guide if replacing existing functionality

5. Publish to npm:
```bash
npm publish --tag formdown-plugin
```