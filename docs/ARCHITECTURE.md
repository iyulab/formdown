# Architecture

Formdown is a comprehensive form building solution that transforms markdown-like syntax into interactive web forms. The project is designed with **Core-First Architecture**, modularity, performance, and developer experience in mind.

## Core Philosophy

Formdown bridges the gap between content creation and form functionality by allowing developers to write forms using familiar markdown syntax while maintaining the power and flexibility of modern web components.

**v0.3.0 Achievements**:
- Complete Core-First Architecture with 100% legacy code elimination
- CSP-compliant HTML generation (no inline event handlers)
- XSS protection with comprehensive HTML escaping
- 713+ automated tests across all packages
- TypeScript strict mode compliance

## Project Structure

The Formdown ecosystem consists of three main packages and a documentation site:

### `/packages` - Core Libraries

**formdown-core** ⭐ Core-First Architecture Hub
- **FormManager**: Complete form lifecycle management with 12+ Core module APIs
- **4 Core Modules**: FieldProcessor, DOMBinder, ValidationManager, EventOrchestrator
- Primary role: formdown → html and formdown → get-schema transformations
- Hidden Form Architecture for clean form association
- Value Attribute support for default field values
- Hook-based plugin architecture for external extensibility (14 hook types)
- Contains TypeScript definitions, core utilities, and extension APIs
- **Phase 2 Achievement**: 100% API coverage for all UI/Editor operations

**formdown-ui** 🎨 Rendering & Interaction Layer  
- Web component for form rendering and interaction (1186 lines, 9.3% optimized)
- **Core Integration**: 100% FormManager delegation for DOM operations
- Built with Lit for universal framework compatibility
- **Phase 2.1 Achievement**: Complete DOMBinder integration, processFormHTML elimination
- Handles form validation, data binding, and user interactions via Core modules
- Produces clean, accessible HTML forms from parsed content

**formdown-editor** ✏️ Development Environment
- Interactive editor component with real-time preview (505 lines + template consolidation)  
- **Core Integration**: 100% FormManager delegation for parsing and data management
- Supports multiple viewing modes (edit, split, preview)
- **Phase 2.2 Achievement**: Complete EventOrchestrator integration, legacy code elimination
- Real-time Core-powered parsing with createPreviewTemplate
- Provides developer tools and debugging capabilities

### `/site` - Documentation & Demos

A Next.js-powered website that serves as:
- Comprehensive documentation hub
- Interactive demos and examples
- SEO-optimized landing pages
- Package distribution information

## Technical Architecture

### Core-First Architecture (Phase 2 Complete)
```
FormManager (Central Hub)
├── FieldProcessor (Field logic processing)
├── DOMBinder (DOM manipulation & binding)
├── ValidationManager (Async validation pipelines)
├── EventOrchestrator (Component coordination)
└── FormDataBinding (Reactive data management)

formdown-editor (Development Layer)
├── FormManager Integration (100% Core delegation)
├── EventOrchestrator Bridge (Editor ↔ Core events)
├── createPreviewTemplate (Real-time parsing)
└── formdown-ui (Embedded rendering)

formdown-ui (Rendering Layer)  
├── FormManager Integration (100% Core delegation)
├── DOMBinder Integration (DOM operations)
├── FieldProcessor Integration (Field handling)
└── ValidationManager Integration (Form validation)
```

### Core-First Data Flow (Phase 2 Implementation)
1. **User Input**: Markdown with @form and @field syntax
2. **FormManager.parse()**: Central parsing via Core modules
   - FieldProcessor handles field type processing and validation
   - Conditional logic parsing (Phase 3.1 ready)
   - Hook system allows extensions to modify parsing behavior
3. **FormManager.getSchema()**: Schema extraction for metadata and tooling
4. **FormManager.render()**: HTML generation with hidden form architecture
   - Hidden forms: `<form hidden id="form-id" ...attributes>`
   - Associated fields: `<input form="form-id" ...attributes>`
   - DOMBinder manages DOM operations and event handling
5. **UI Component Rendering**: FormManager.renderToTemplate() for consistent rendering
6. **Reactive Updates**: EventOrchestrator coordinates component-to-component events
7. **Data Management**: FormDataBinding provides unified data flow across UI/Editor
8. **Validation**: ValidationManager handles async validation pipelines

### Build Strategy
- **Development**: Independent package development with live reloading
- **Production**: Optimized bundles for different deployment scenarios
- **Distribution**: NPM packages for modular consumption

## Design Principles

**Universal Compatibility**
Web components ensure framework-agnostic usage across React, Vue, Angular, or vanilla HTML projects.

**Progressive Enhancement**
Forms work with basic HTML functionality and enhance with JavaScript interactions.

**Hidden Form Architecture**
Separates form definition from field definition using HTML5 `form` attribute for clean styling and flexible layout:
- Hidden form elements don't interfere with CSS styling
- Fields can be positioned anywhere in the document
- Multiple forms supported in a single document
- Standards-compliant HTML form association

**Developer Experience**
Intuitive syntax, comprehensive TypeScript support, and clear documentation lower the learning curve.

**Performance Focus**
Efficient parsing, minimal runtime overhead, and optimized bundle sizes for production use.

## Integration Patterns

Formdown can be integrated in multiple ways:

- **CDN Usage**: Direct script inclusion for quick prototyping
- **NPM Installation**: Modular imports for build-optimized applications
- **Framework Integration**: First-class support in modern JavaScript frameworks
- **Static Sites**: Pre-rendered forms for JAMstack architectures

## Hidden Form Architecture

Formdown uses a revolutionary **Hidden Form Architecture** that separates form definition from field definition for optimal styling flexibility and modern web standards compliance.

### Core Concept

Traditional form builders wrap fields in visible `<form>` elements, which can interfere with CSS layouts and styling. Formdown solves this by:

1. **Hidden Form Elements**: Forms are generated as `<form hidden>` elements that don't affect layout
2. **Form Attribute Association**: Fields use HTML5 `form="form-id"` attribute to associate with forms
3. **Flexible Positioning**: Fields can be positioned anywhere in the document while maintaining form association

### Implementation

```formdown
@form[action="/submit" method="POST"]

@name: [text required]
@email: [email required]
```

Generates:
```html
<!-- Hidden form - no layout impact -->
<form hidden id="formdown-form-1" action="/submit" method="POST"></form>

<!-- Fields with form association -->
<div class="formdown-field">
    <label for="name">Name *</label>
    <input type="text" id="name" name="name" required form="formdown-form-1">
</div>
<div class="formdown-field">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required form="formdown-form-1">
</div>
```

### Benefits

- ✅ **Clean styling**: No form wrapper interfering with CSS layout
- ✅ **Flexible positioning**: Fields can be placed anywhere in the document
- ✅ **Multiple forms**: Support multiple forms in one document
- ✅ **HTML standards**: Uses native HTML `form` attribute for proper association
- ✅ **Accessibility**: Maintains proper form semantics and screen reader support

## Value Attribute System

Formdown supports comprehensive default value setting through the `value` attribute for all field types:

### Text and Input Fields
```formdown
@name: [text value="John Doe"]
@age: [number value=25]
@birth_date: [date value="1995-05-15"]
```

### Selection Fields
```formdown
@country: [select value="USA" options="USA,Canada,UK"]
@priority: [radio value="Medium" options="Low,Medium,High"]
@features: [checkbox value="Email,SMS" options="Email,SMS,Push,Phone"]
```

### Advanced Value Processing
- **Boolean values**: `value=true/false` for single checkboxes
- **Multiple values**: `value="A,B,C"` for checkbox groups
- **Type-aware parsing**: Automatic type conversion for numbers, booleans, dates
- **HTML generation**: Proper `selected`, `checked`, and `value` attribute generation

This architecture enables Formdown to serve both rapid prototyping needs and enterprise-scale applications while maintaining simplicity and performance.

## Security Architecture

Formdown implements comprehensive security measures for production deployment:

### Content Security Policy (CSP) Compliance

All generated HTML is CSP-compliant with no inline event handlers:
- **No inline scripts**: No `onclick`, `onchange`, `oninput` attributes
- **Data attributes**: Behavior is controlled via `data-formdown-*` attributes
- **External handlers**: Event handling is attached programmatically by formdown-ui

```html
<!-- CSP-compliant output -->
<input type="radio" data-formdown-other-radio="true" data-formdown-other-for="fieldname">
<select data-formdown-has-other="true" data-formdown-other-target="fieldname_other">
```

### XSS Prevention

All user-provided content is HTML-escaped before insertion:
- **Option values**: Select, radio, and checkbox options are escaped
- **Labels**: Custom labels and display text are escaped
- **Datalist options**: All datalist entries are escaped
- **Special characters**: `<`, `>`, `&`, `"`, `'` are properly escaped

```typescript
// Internal escaping function
private escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}
```

### Safe Field Names

Field names are validated to prevent injection attacks:
- Alphanumeric characters and underscores only
- No special characters that could break HTML attributes
- Automatic sanitization of user-provided names

## Testing Architecture

Formdown maintains comprehensive test coverage:

### Test Distribution
- **formdown-core**: 634 tests (parsing, generation, validation, security)
- **formdown-ui**: 29 tests (rendering, data binding, events)
- **formdown-editor**: 50 tests (editor logic, integration)
- **Cross-package**: 50 integration tests

### Test Categories
- **Unit tests**: Individual function and class testing
- **Integration tests**: Cross-module interaction testing
- **Security tests**: XSS prevention and CSP compliance
- **Performance tests**: Large form handling benchmarks
