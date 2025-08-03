# Overview

Formdown is a simple, human-readable format for creating web forms. It combines the simplicity of Markdown with powerful form capabilities, allowing you to create complex forms with minimal syntax.

## Core Philosophy

- **Human-readable**: Forms should be readable and writable by humans
- **Simple syntax**: Minimal learning curve with intuitive field definitions
- **Web standards**: Generates clean, semantic HTML forms
- **Framework agnostic**: Works with any web framework or vanilla JavaScript

## Core-First Architecture (Phase 2 Complete)

Formdown features a revolutionary **Core-First architecture** with **FormManager + 4 Core modules** providing complete form lifecycle management:

### @formdown/core ⭐ - The Complete Foundation
**Phase 2 Achievement**: 100% business logic centralization through specialized Core modules

#### FormManager + 4 Core Modules
- **FormManager**: Central coordinator with 12+ integration APIs
- **FieldProcessor**: Field type processing, validation, and value extraction
- **DOMBinder**: DOM manipulation, event handling, and data synchronization  
- **ValidationManager**: Async validation pipelines with caching and debouncing
- **EventOrchestrator**: Component-to-component event coordination and bridging

#### Enhanced Capabilities
- **Complete Form Lifecycle**: Parse → Process → Render → Validate → Coordinate
- **Modular Architecture**: Specialized modules for different concerns
- **100% Code Coverage**: All UI/Editor operations handled by Core
- **Framework Agnostic**: Works with React, Vue, Angular, vanilla JS

### @formdown/ui 🎨 - Optimized Rendering Layer  
**Phase 2.1 Complete**: 1307 lines → 1186 lines (9.3% optimization)
- **100% Core Integration**: All DOM operations delegated to DOMBinder
- **FormManager Coordination**: Complete FormManager lifecycle integration
- **Legacy Elimination**: processFormHTML removed, renderToTemplate adopted
- **Performance Optimized**: Streamlined event handling via Core modules

### @formdown/editor ✏️ - Enhanced Development Environment
**Phase 2.2 Complete**: Core-First architecture fully implemented
- **100% Core Integration**: EventOrchestrator bridges Editor ↔ Core events
- **Real-time Core Power**: createPreviewTemplate for instant parsing
- **Template Consolidation**: templates.ts eliminated, inline rendering
- **Legacy-Free**: All parsing/rendering operations via FormManager

### Key Architectural Benefits

1. **Framework Independence**: Core can be used with any UI framework
2. **Enhanced Testability**: Business logic separated from presentation
3. **Single Source of Truth**: All form behavior centralized in Core
4. **Event-Driven Reactivity**: Subscribe to data changes, validation, submission
5. **Better Maintainability**: Clean separation of concerns
6. **Backward Compatibility**: Existing code continues to work unchanged

## Key Features

- **Hidden Form Architecture**: Revolutionary form system with no layout interference
- **Value Attribute System**: Comprehensive default values for all field types (`value="text"`)
- **Shorthand syntax**: Write forms faster with intuitive shortcuts (`@name*: []`, `@email: @[]`)
- **Smart label generation**: Automatic conversion of field names to readable labels
- **Multiple Forms**: Support multiple forms in one document with automatic association
- **Inline fields**: Embed form fields directly in markdown text
- **Rich field types**: Support for all HTML5 input types plus custom components via plugins
- **Extension System**: Hook-based plugins for custom field types, validators, and renderers (14 hook types)
- **Schema Extraction**: Get structured metadata for validation, documentation, and tooling
- **Flexible attributes**: Control validation, styling, and behavior
- **Markdown integration**: Mix forms with rich text content
- **Progressive complexity**: Start simple, add complexity as needed with extensions
- **Type-safe extensibility**: Full TypeScript support for plugin development
- **Lightweight**: Minimal core with optional extension loading

## Example

### Standard Syntax Example
```formdown
### Registration Form
Please fill out the form below to register.

@name: [text required placeholder="Enter your name"]
@email: [email required]
@age: [number min=18 max=100]
@bio: [textarea rows=4 placeholder="Tell us about yourself"]
@gender: [radio options="Male, Female, Other"]
@interests: [checkbox options="Programming, Design, Music, Sports"]
@newsletter(Subscribe to our newsletter): [checkbox]
```

### Shorthand Syntax (Same Result!)
```formdown
### Registration Form
Please fill out the form below to register.

@name*: [placeholder="Enter your name"]
@email*: @[]
@age: #[min=18 max=100]
@bio: T4[placeholder="Tell us about yourself"]
@gender{Male,Female,Other}: r[]
@interests{Programming,Design,Music,Sports}: c[]
@newsletter(Subscribe to our newsletter): c[]
```

**Both create identical forms** - choose the style that fits your needs!

This generates a complete registration form with validation, proper labels, and semantic HTML structure.
