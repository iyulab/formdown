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
- Hook-based plugin architecture for external extensibility
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
1. User writes markdown with @field syntax
2. Core parser processes syntax into structured data
   - Hook system allows extensions to modify parsing behavior
   - Plugin system provides custom field types and validators
3. Schema extractor provides metadata for validation and tooling
4. UI component renders interactive form elements
   - Extension system enables custom rendering behaviors
5. User interactions update form data reactively
6. Changes propagate back through the component tree

### Build Strategy
- **Development**: Independent package development with live reloading
- **Production**: Optimized bundles for different deployment scenarios
- **Distribution**: NPM packages for modular consumption

## Design Principles

**Universal Compatibility**
Web components ensure framework-agnostic usage across React, Vue, Angular, or vanilla HTML projects.

**Progressive Enhancement**
Forms work with basic HTML functionality and enhance with JavaScript interactions.

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

This architecture enables Formdown to serve both rapid prototyping needs and enterprise-scale applications while maintaining simplicity and performance.
