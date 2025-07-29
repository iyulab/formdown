# Overview

Formdown is a simple, human-readable format for creating web forms. It combines the simplicity of Markdown with powerful form capabilities, allowing you to create complex forms with minimal syntax.

## Core Philosophy

- **Human-readable**: Forms should be readable and writable by humans
- **Simple syntax**: Minimal learning curve with intuitive field definitions
- **Web standards**: Generates clean, semantic HTML forms
- **Framework agnostic**: Works with any web framework or vanilla JavaScript

## Architecture

Formdown features a **Core-First architecture** where all business logic resides in the Core package, making it framework-agnostic and highly reusable:

### @formdown/core - The Foundation
The Core package provides comprehensive form management through centralized classes:

#### FormManager Class
- **Complete Form Lifecycle**: Parse → Render → Data Management → Validation
- **Event-Driven System**: Reactive updates through publishers/subscribers
- **Schema Integration**: Automatic field discovery and validation rules
- **Framework Agnostic**: Works with React, Vue, Angular, vanilla JS

#### FormDataBinding Class  
- **Reactive Data Management**: Schema-driven defaults with change detection
- **Value Priority System**: `context.data` > `schema value` > `empty`
- **Validation Integration**: Field-level and form-level validation
- **State Management**: Dirty checking, snapshots, reset functionality

#### Extension System
- **Hook-based Architecture**: 14 different hook types for maximum customization
- **Plugin System**: Complete plugin lifecycle management with error handling
- **Type Safety**: Full TypeScript support with compile-time validation

### @formdown/ui - Thin Presentation Layer
Web components that delegate all business logic to Core:
- **FormManager Integration**: Internal FormManager instance handles all logic
- **Event Forwarding**: UI events forwarded from Core FormManager
- **Reactive Properties**: Data binding synchronized with Core state
- **Backward Compatibility**: Existing APIs preserved while using Core internally

### @formdown/editor - Development Tools
Development environment enhanced by Core architecture:
- **FormManager-Based**: Uses Core APIs for form processing and validation
- **Real-time Preview**: Live updates through Core event system
- **Enhanced Testing**: Business logic testable independently of UI

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
