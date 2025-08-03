# Core Architecture Guide

This document describes the core architecture of @formdown/core and how it fulfills its role as the foundational parsing and generation engine.

## Overview

@formdown/core serves as the central parsing and generation engine for the Formdown ecosystem. It provides three primary functions:

1. **formdown → html**: Parse Formdown syntax and generate HTML forms
2. **formdown → get-schema**: Extract structured schema from Formdown content  
3. **Extension system**: Provide hooks and plugins for external customization

## Core Components

### 1. Parser (`FormdownParser`)

The parser is responsible for converting Formdown syntax into structured data.

```typescript
import { FormdownParser } from '@formdown/core'

const parser = new FormdownParser()
const result = parser.parseFormdown('@name: [text required]')
// Returns: { markdown: string, forms: Field[] }
```

**Key Features:**
- Standard syntax support: `@field_name: [type attributes]`
- Shorthand syntax support: `@field_name*: @[]` 
- Inline field support: `___@field_name[type]`
- Smart label generation from field names
- Comprehensive attribute parsing

### 2. Generator (`FormdownGenerator`)

The generator converts parsed Formdown content into HTML forms.

```typescript
import { FormdownGenerator } from '@formdown/core'

const generator = new FormdownGenerator()
const html = generator.generateHTML(parsedContent)
// Returns: Complete HTML with forms and markdown content
```

**Key Features:**
- Semantic HTML5 form generation
- Accessibility features (ARIA labels, roles)
- Support for all HTML5 input types
- Complex field types (select, radio, checkbox with options)
- Inline field rendering
- Markdown content preservation

### 3. Schema Extractor (`SchemaExtractor`)

The schema extractor provides structured metadata about form fields.

```typescript
import { getSchema } from '@formdown/core'

const schema = getSchema('@name: [text required minlength=2]')
// Returns: { name: { type: 'text', required: true, validation: { minlength: 2 } } }
```

**Key Features:**
- Field type and properties extraction
- Validation rules extraction
- Position and layout information
- HTML attributes separation

## Extension System

The extension system allows external packages and users to customize parsing, generation, and validation behavior.

### Hook System

The core provides 8 hook types for extension:

- `pre-parse`: Before parsing begins
- `post-parse`: After parsing completes
- `field-parse`: For each field during parsing
- `field-validate`: For field validation
- `pre-generate`: Before HTML generation
- `post-generate`: After HTML generation
- `field-render`: For custom field rendering
- `error-handle`: For error handling

```typescript
import { registerHook } from '@formdown/core'

registerHook({
  name: 'field-parse',
  priority: 1,
  handler: (context) => {
    // Custom field processing logic
    return enhancedField
  }
})
```

### Plugin System

Plugins provide a structured way to extend functionality:

```typescript
import { registerPlugin } from '@formdown/core'

const customPlugin = {
  metadata: {
    name: 'custom-plugin',
    version: '1.0.0'
  },
  fieldTypes: [{
    type: 'phone',
    parser: (content, context) => ({ /* custom parsing */ }),
    generator: (field, context) => '/* custom HTML */'
  }],
  validators: [{
    name: 'phone-format',
    validate: (value) => /^\d{3}-\d{3}-\d{4}$/.test(value)
  }]
}

await registerPlugin(customPlugin)
```

## API Design

### Functional API (Recommended)

```typescript
import { parseFormdown, generateFormHTML, getSchema } from '@formdown/core'

// Parse formdown to structured data
const parsed = parseFormdown(formdownContent)

// Generate HTML from parsed content  
const html = generateFormHTML(parsed)

// Extract schema for metadata
const schema = getSchema(formdownContent)
```

### Class-based API (Advanced)

```typescript
import { FormdownParser, FormdownGenerator, SchemaExtractor } from '@formdown/core'

const parser = new FormdownParser({ preserveMarkdown: true })
const generator = new FormdownGenerator()
const extractor = new SchemaExtractor()
```

## Architecture Principles

### 1. Separation of Concerns

Each component has a single, well-defined responsibility:
- **Parser**: Syntax analysis and structure extraction
- **Generator**: HTML rendering and formatting
- **Schema Extractor**: Metadata extraction and validation rules
- **Extension Manager**: Plugin coordination and hook execution

### 2. Extensibility

The core is designed to be extended without modification:
- Hook system for behavior customization
- Plugin system for feature additions
- Type-safe APIs for third-party development
- Event system for inter-plugin communication

### 3. Performance

Optimized for real-world usage:
- Efficient parsing for large forms (100+ fields in <1 second)
- Lazy loading of extensions
- Minimal memory footprint
- Streaming-friendly architecture

### 4. Type Safety

Full TypeScript support throughout:
- Comprehensive type definitions
- Generic interfaces for extensions
- Runtime type validation
- IntelliSense support for plugin development

## Usage Patterns

### Basic Form Processing

```typescript
// 1. Parse formdown content
const content = `
# Contact Form
@name: [text required]
@email: [email required]
@message: [textarea rows=5]
`

// 2. Generate HTML
const parsed = parseFormdown(content)
const html = generateFormHTML(parsed)

// 3. Extract schema for validation
const schema = getSchema(content)
```

### Extension Development

```typescript
// 1. Create plugin
const myPlugin = {
  metadata: { name: 'my-plugin', version: '1.0.0' },
  fieldTypes: [/* custom field types */],
  validators: [/* custom validators */],
  hooks: [/* custom hooks */]
}

// 2. Register plugin
await registerPlugin(myPlugin)

// 3. Use enhanced functionality
const result = parseFormdown('@custom_field: [my-type]')
```

### Integration with UI Frameworks

```typescript
// For React, Vue, etc.
function FormRenderer({ formdownContent }) {
  const parsed = parseFormdown(formdownContent)
  const schema = getSchema(formdownContent)
  
  // Use schema for client-side validation
  // Use parsed.forms for custom rendering
  // Use generateFormHTML for fallback
}
```

## Testing Strategy

The core includes comprehensive test coverage:

- **Unit Tests**: Individual component testing
- **Integration Tests**: Extension system testing  
- **Performance Tests**: Large form processing
- **Architecture Tests**: Core API compliance
- **Error Handling Tests**: Edge case coverage

Current test coverage: 213 tests (100% passing)

## Best Practices

### For Core Users

1. Use the functional API for simplicity
2. Extract schema for client-side validation
3. Leverage the extension system for customization
4. Follow semantic HTML practices

### For Extension Developers

1. Use TypeScript for type safety
2. Implement proper error handling
3. Follow hook priority conventions
4. Provide comprehensive metadata
5. Test plugin lifecycle thoroughly

## Migration Guide

### From v0.1.x to v0.2.x

The extension system is now fully integrated. Existing code continues to work, but new projects should leverage the extension capabilities:

```typescript
// Old approach (still supported)
const parsed = parseFormdown(content)

// New approach (recommended)
await extensionManager.initialize()
const parsed = parseFormdown(content) // Now with extension support
```

## Future Roadmap

Planned improvements for the core architecture:

1. **Streaming Parser**: Support for large documents
2. **Worker Support**: Background processing capabilities  
3. **WASM Integration**: Performance optimizations
4. **Schema Validation**: Runtime schema validation
5. **Incremental Parsing**: Real-time editor support

---

For more detailed examples and API reference, see:
- [Extension System Guide](./EXTENSION_SYSTEM.md)
- [Extension Examples](./EXTENSION_EXAMPLES.md)
- [API Reference](./api.md)