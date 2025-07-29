# Architecture

Formdown is a comprehensive form building solution that transforms markdown-like syntax into interactive web forms. The project is designed with modularity, performance, and developer experience in mind.

## Core Philosophy

Formdown bridges the gap between content creation and form functionality by allowing developers to write forms using familiar markdown syntax while maintaining the power and flexibility of modern web components.

## Project Structure

The Formdown ecosystem consists of three main packages and a documentation site:

### `/packages` - Core Libraries

**formdown-core**
- The foundational parsing and generation engine with extension system
- Primary role: formdown → html and formdown → get-schema transformations
- Hidden Form Architecture for clean form association
- Value Attribute support for default field values
- Hook-based plugin architecture for external extensibility (14 hook types)
- Contains TypeScript definitions, core utilities, and extension APIs
- Provides the essential building blocks for other packages

**formdown-ui**
- Web component for form rendering and interaction
- Built with Lit for universal framework compatibility
- Uses @formdown/core extension system for custom behaviors
- Handles form validation, data binding, and user interactions
- Produces clean, accessible HTML forms from parsed content

**formdown-editor**
- Interactive editor component with real-time preview
- Supports multiple viewing modes (edit, split, preview)
- Leverages @formdown/core plugins for enhanced editing capabilities
- Integrates both core parsing and UI rendering
- Provides developer tools and debugging capabilities

### `/site` - Documentation & Demos

A Next.js-powered website that serves as:
- Comprehensive documentation hub
- Interactive demos and examples
- SEO-optimized landing pages
- Package distribution information

## Technical Architecture

### Component Hierarchy
```
formdown-editor (top-level)
├── Editor Panel (markdown input)
├── Preview Panel (live rendering)
└── formdown-ui (form component)
    ├── Form Fields (various input types)
    ├── Validation Logic
    └── Data Binding
```

### Data Flow
1. User writes markdown with @form and @field syntax
2. Core parser processes form declarations and field definitions
   - @form declarations create hidden form elements with specified attributes
   - @field definitions automatically associate with the nearest form or explicit form ID
   - Hook system allows extensions to modify parsing behavior
   - Plugin system provides custom field types and validators
3. Schema extractor provides metadata for validation and tooling
4. HTML generator creates hidden form structure with field associations
   - Hidden forms: `<form hidden id="form-id" ...attributes>`
   - Associated fields: `<input form="form-id" ...attributes>`
   - Extension system enables custom rendering behaviors
5. UI component renders interactive form elements with proper form associations
6. User interactions update form data reactively
7. Changes propagate back through the component tree

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
