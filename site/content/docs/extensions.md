# Extension System

The Formdown extension system provides a powerful plugin architecture that allows developers to customize and extend form parsing, generation, and validation capabilities. Built with TypeScript for full type safety, the extension system offers hooks, plugins, and events for maximum flexibility.

## Overview

The extension system consists of four main components:

- **HookManager**: Manages execution of hooks at various points in the parsing/generation pipeline
- **PluginManager**: Handles plugin registration, lifecycle, and error management
- **EventEmitter**: Provides event-driven communication between plugins
- **ExtensionManager**: Unified interface for managing all extension functionality

## Quick Start

### Basic Plugin Registration

```typescript
import { ExtensionManager } from '@formdown/core'

const extensionManager = new ExtensionManager()

// Register a simple plugin
extensionManager.registerPlugin({
  metadata: {
    name: 'my-theme-plugin',
    version: '1.0.0',
    description: 'Custom styling for forms'
  },
  hooks: [{
    name: 'css-class',
    priority: 10,
    handler: (context) => {
      // Add custom CSS classes
      context.field.attributes = {
        ...context.field.attributes,
        className: `custom-field ${context.field.type}-field`
      }
      return context
    }
  }]
})
```

### Using Extension Manager with Core Functions

```typescript
import { parseForm, generateHTML, ExtensionManager } from '@formdown/core'

const extensionManager = new ExtensionManager()

// Register your plugins here
extensionManager.registerPlugin(myBootstrapPlugin)
extensionManager.registerPlugin(myValidationPlugin)

// Parse with extensions
const source = '@name: [text required]\n@email: [email required]'
const ast = await parseForm(source, { extensionManager })

// Generate with extensions
const html = await generateHTML(ast, { extensionManager })
```

## Hook Types

The extension system provides 14 different hook types for maximum customization:

### Parser Hooks

#### `pre-parse`
Executed before parsing begins. Use to transform or preprocess the source content.

```typescript
{
  name: 'pre-parse',
  handler: (context: { content: string }) => {
    // Transform source before parsing
    context.content = context.content.replace(/old_syntax/g, 'new_syntax')
    return context
  }
}
```

#### `post-parse`
Executed after parsing is complete. Use to modify the parsed result.

```typescript
{
  name: 'post-parse',
  handler: (context: { parseResult: ParseResult }) => {
    // Modify parsed fields
    context.parseResult.fields.forEach(field => {
      if (field.type === 'email') {
        field.attributes.autocomplete = 'email'
      }
    })
    return context
  }
}
```

#### `field-parse`
Executed during individual field parsing. Use for custom field type parsing.

```typescript
{
  name: 'field-parse',
  handler: (context: { field: Field, content: string }) => {
    // Custom field processing
    if (context.field.type === 'credit-card') {
      context.field.attributes.pattern = '[0-9\\s]{13,19}'
      context.field.attributes.inputmode = 'numeric'
    }
    return context
  }
}
```

### Generator Hooks

#### `pre-generate`
Executed before HTML generation begins.

```typescript
{
  name: 'pre-generate',
  handler: (context: { parseResult: ParseResult }) => {
    // Prepare for generation
    return context
  }
}
```

#### `post-generate`
Executed after HTML generation is complete.

```typescript
{
  name: 'post-generate',
  handler: (context: { html: string, parseResult: ParseResult }) => {
    // Post-process generated HTML
    context.html = context.html.replace(/<form/, '<form novalidate')
    return context
  }
}
```

#### `template-render`
Customize field template rendering.

```typescript
{
  name: 'template-render',
  handler: (context: { field: Field, template: string }) => {
    // Custom template logic
    if (context.field.type === 'text') {
      context.template = `<div class="custom-wrapper">${context.template}</div>`
    }
    return context
  }
}
```

### Validation Hooks

#### `field-validate`
Custom field validation logic.

```typescript
{
  name: 'field-validate',
  handler: (context: { field: Field, value: any, isValid: boolean }) => {
    // Custom validation
    if (context.field.name === 'username' && context.value) {
      const isAvailable = await checkUsernameAvailability(context.value)
      context.isValid = context.isValid && isAvailable
    }
    return context
  }
}
```

#### `validation-rule`
Add custom validation rules.

```typescript
{
  name: 'validation-rule',
  handler: (context: { field: Field, rules: ValidationRule[] }) => {
    // Add custom rules
    if (context.field.type === 'password') {
      context.rules.push({
        type: 'password-strength',
        message: 'Password must contain uppercase, lowercase, number and symbol'
      })
    }
    return context
  }
}
```

### Styling Hooks

#### `css-class`
Customize CSS class assignment.

```typescript
{
  name: 'css-class',
  handler: (context: { field: Field }) => {
    // Add framework-specific classes
    const baseClasses = 'form-control'
    const typeClasses = {
      'text': 'form-control-text',
      'email': 'form-control-email',
      'select': 'form-select'
    }
    
    context.field.attributes.className = 
      `${baseClasses} ${typeClasses[context.field.type] || ''}`
    
    return context
  }
}
```

#### `attribute-inject`
Inject custom HTML attributes.

```typescript
{
  name: 'attribute-inject',
  handler: (context: { field: Field }) => {
    // Add accessibility attributes
    context.field.attributes = {
      ...context.field.attributes,
      'aria-label': context.field.label,
      'aria-required': context.field.required ? 'true' : 'false'
    }
    return context
  }
}
```

### Utility Hooks

#### `accessibility`
Enhance accessibility features.

#### `performance`
Performance optimizations.

#### `debug`
Debug information injection.

#### `error-format`
Custom error message formatting.

## Plugin Types

### Field Type Plugins

Create custom field types with complete parsing and rendering logic:

```typescript
const creditCardPlugin: Plugin = {
  metadata: {
    name: 'credit-card-plugin',
    version: '1.0.0'
  },
  fieldTypes: [{
    type: 'credit-card',
    parser: (content: string) => {
      const match = content.match(/@(\w+):\s*\[credit-card\](.*)/)
      if (!match) return null
      
      return {
        name: match[1],
        type: 'credit-card',
        label: 'Credit Card Number',
        attributes: {
          pattern: '[0-9\\s]{13,19}',
          inputmode: 'numeric',
          autocomplete: 'cc-number'
        }
      }
    },
    validator: (field: Field, value: string) => {
      return isValidCreditCard(value) ? [] : [{
        type: 'invalid-credit-card',
        message: 'Please enter a valid credit card number'
      }]
    },
    generator: (field: Field) => `
      <div class="credit-card-field">
        <label for="${field.name}">${field.label}</label>
        <input type="text" 
               name="${field.name}" 
               id="${field.name}"
               pattern="${field.attributes?.pattern}"
               inputmode="${field.attributes?.inputmode}"
               autocomplete="${field.attributes?.autocomplete}"
               ${field.required ? 'required' : ''} />
        <div class="card-icons">
          <img src="/icons/visa.svg" alt="Visa" />
          <img src="/icons/mastercard.svg" alt="Mastercard" />
        </div>
      </div>
    `
  }]
}
```

### Validation Plugins

Add custom validation logic:

```typescript
const advancedValidationPlugin: Plugin = {
  metadata: {
    name: 'advanced-validation',
    version: '1.0.0'
  },
  validators: [{
    name: 'async-email-validation',
    validate: async (value: string) => {
      if (!value) return true
      
      // Check disposable email domains
      const domain = value.split('@')[1]
      const isDisposable = await checkDisposableDomain(domain)
      
      return !isDisposable
    },
    getMessage: () => 'Please use a valid, non-disposable email address'
  }]
}
```

### Theme Plugins

Create comprehensive theming systems:

```typescript
const bootstrapThemePlugin: Plugin = {
  metadata: {
    name: 'bootstrap-theme',
    version: '1.0.0'
  },
  hooks: [
    {
      name: 'css-class',
      handler: (context) => {
        context.field.attributes.className = getBootstrapClasses(context.field.type)
        return context
      }
    },
    {
      name: 'template-render',
      handler: (context) => {
        context.template = wrapWithBootstrapStructure(context.template, context.field)
        return context
      }
    }
  ],
  renderers: [{
    template: 'form-group',
    render: (field) => `
      <div class="mb-3">
        <label for="${field.name}" class="form-label">${field.label}</label>
        {field-input}
        <div class="invalid-feedback">{error-message}</div>
      </div>
    `
  }]
}
```

## Plugin Events

Plugins can listen to and emit events through the built-in event system:

```typescript
const analyticsPlugin: Plugin = {
  metadata: {
    name: 'google-analytics',
    version: '1.0.0'
  },
  hooks: [{
    name: 'post-generate',
    handler: (context) => {
      // Track form render
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_render', {
          form_fields: context.parseResult.fields.length,
          field_types: context.parseResult.fields.map(f => f.type)
        })
      }
      return context
    }
  }],
  initialize: (eventEmitter) => {
    // Listen to validation events
    eventEmitter.on('field-validation-failed', (data) => {
      gtag('event', 'form_validation_error', {
        field_name: data.fieldName,
        error_type: data.errorType
      })
    })
  }
}
```

## Advanced Features

### Error Handling

The extension system provides robust error handling with configurable error policies:

```typescript
const extensionManager = new ExtensionManager({
  errorHandling: {
    onPluginError: 'warn', // 'ignore' | 'warn' | 'throw'
    onHookError: 'warn',
    continueOnError: true
  }
})
```

### Performance Management

Control execution timeouts and performance optimization:

```typescript
// Hook with custom timeout
{
  name: 'async-validation',
  handler: async (context) => {
    const result = await expensiveValidation(context.field.value)
    return context
  },
  timeout: 5000 // 5 second timeout
}

// Performance monitoring
extensionManager.on('hook-performance', (data) => {
  if (data.executionTime > 1000) {
    console.warn(`Slow hook detected: ${data.hookName} took ${data.executionTime}ms`)
  }
})
```

### Plugin Dependencies

Manage plugin dependencies and load order:

```typescript
const dependentPlugin: Plugin = {
  metadata: {
    name: 'dependent-plugin',
    version: '1.0.0',
    dependencies: ['bootstrap-theme@^1.0.0']
  },
  // Plugin implementation
}

// The extension manager will ensure dependencies are loaded first
extensionManager.registerPlugin(dependentPlugin)
```

## Real-World Examples

### Complete Bootstrap Integration

```typescript
import { ExtensionManager } from '@formdown/core'

const bootstrapTheme = {
  metadata: {
    name: 'bootstrap-theme',
    version: '1.0.0',
    description: 'Complete Bootstrap 5 integration'
  },
  hooks: [
    {
      name: 'css-class',
      priority: 10,
      handler: (context) => {
        const typeClasses = {
          'text': 'form-control',
          'email': 'form-control',
          'password': 'form-control',
          'textarea': 'form-control',
          'select': 'form-select',
          'checkbox': 'form-check-input',
          'radio': 'form-check-input'
        }
        
        context.field.attributes.className = typeClasses[context.field.type] || 'form-control'
        return context
      }
    },
    {
      name: 'template-render',
      priority: 10,
      handler: (context) => {
        if (context.field.type === 'checkbox' || context.field.type === 'radio') {
          context.template = `
            <div class="form-check">
              ${context.template}
              <label class="form-check-label" for="${context.field.name}">
                ${context.field.label}
              </label>
            </div>
          `
        } else {
          context.template = `
            <div class="mb-3">
              <label for="${context.field.name}" class="form-label">${context.field.label}</label>
              ${context.template}
              <div class="invalid-feedback"></div>
            </div>
          `
        }
        return context
      }
    }
  ]
}

// Usage
const extensionManager = new ExtensionManager()
extensionManager.registerPlugin(bootstrapTheme)
```

### Internationalization Plugin

```typescript
const i18nPlugin = {
  metadata: {
    name: 'i18n-plugin',
    version: '1.0.0'
  },
  hooks: [{
    name: 'post-parse',
    handler: (context) => {
      const locale = getCurrentLocale()
      
      context.parseResult.fields.forEach(field => {
        field.label = translate(field.label, locale)
        if (field.placeholder) {
          field.placeholder = translate(field.placeholder, locale)
        }
      })
      
      return context
    }
  }]
}
```

### File Upload with Preview Plugin

```typescript
const fileUploadPlugin = {
  metadata: {
    name: 'file-upload-plugin',
    version: '1.0.0'
  },
  fieldTypes: [{
    type: 'file-upload',
    parser: (content) => {
      const match = content.match(/@(\w+):\s*\[file-upload\](.*)/)
      if (!match) return null
      
      return {
        name: match[1],
        type: 'file-upload',
        label: 'Upload Files',
        attributes: {
          multiple: true,
          accept: '*/*'
        }
      }
    },
    generator: (field) => `
      <div class="file-upload-field" data-field="${field.name}">
        <label>${field.label}</label>
        <div class="upload-area" 
             ondrop="handleDrop(event, '${field.name}')"
             ondragover="handleDragOver(event)">
          <input type="file" 
                 name="${field.name}" 
                 id="${field.name}"
                 ${field.attributes?.multiple ? 'multiple' : ''}
                 accept="${field.attributes?.accept}"
                 style="display: none;" />
          <div class="upload-prompt">
            <i class="upload-icon"></i>
            <p>Drag files here or <button type="button" onclick="document.getElementById('${field.name}').click()">browse</button></p>
          </div>
        </div>
        <div class="file-previews"></div>
      </div>
    `
  }]
}
```

## Testing Extensions

The extension system includes comprehensive testing utilities:

```typescript
import { ExtensionManager, createTestContext } from '@formdown/core'

describe('My Plugin', () => {
  let extensionManager: ExtensionManager

  beforeEach(() => {
    extensionManager = new ExtensionManager()
    extensionManager.registerPlugin(myPlugin)
  })

  test('should add custom CSS classes', async () => {
    const context = createTestContext('css-class', {
      field: { name: 'test', type: 'text', label: 'Test' }
    })

    const result = await extensionManager.executeHooks('css-class', context)
    
    expect(result.field.attributes.className).toContain('custom-field')
  })

  test('should handle validation correctly', async () => {
    const context = createTestContext('field-validate', {
      field: { name: 'email', type: 'email' },
      value: 'invalid-email',
      isValid: false
    })

    const result = await extensionManager.executeHooks('field-validate', context)
    
    expect(result.isValid).toBe(false)
  })
})
```

## Best Practices

### Plugin Development

1. **Use TypeScript**: Take advantage of full type safety
2. **Handle Errors Gracefully**: Always wrap potentially failing code in try-catch
3. **Document Your Plugins**: Provide clear metadata and documentation
4. **Test Thoroughly**: Use the provided testing utilities
5. **Follow Naming Conventions**: Use descriptive, consistent naming

### Performance

1. **Minimize Hook Execution Time**: Keep hooks fast and efficient
2. **Use Async Sparingly**: Only use async when necessary
3. **Cache When Possible**: Cache expensive computations
4. **Set Appropriate Timeouts**: Configure timeouts for long-running operations

### Security

1. **Validate Input**: Always validate and sanitize user input
2. **Escape HTML**: Properly escape generated HTML content
3. **Avoid eval()**: Never use eval() or similar unsafe functions
4. **Sanitize Attributes**: Clean HTML attributes before injection

## Migration Guide

### From Manual Customization

If you're currently using manual form customization, here's how to migrate to the extension system:

**Before:**
```javascript
// Manual customization
const html = generateHTML(ast)
const modifiedHTML = html.replace(/<input type="text"/g, '<input type="text" class="form-control"')
```

**After:**
```javascript
// Extension-based approach
const extensionManager = new ExtensionManager()
extensionManager.registerPlugin(bootstrapTheme)

const html = generateHTML(ast, { extensionManager })
```

### Plugin API Changes

The extension system is designed to be stable, but future versions may include additional hook types and enhanced functionality. All changes will be backward compatible with proper deprecation notices.

## Resources

- [Extension Examples Repository](https://github.com/iyulab/formdown-extensions)
- [Plugin Development Guide](./plugin-development.md)
- [API Reference](./api.md#extensions)
- [Community Plugins](https://formdown.dev/plugins)

The extension system transforms Formdown from a simple form generator into a powerful, customizable platform for building sophisticated form experiences. Whether you need custom validation, theme integration, or specialized field types, the extension system provides the flexibility and power you need.
