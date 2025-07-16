# Overview

Formdown is a simple, human-readable format for creating web forms. It combines the simplicity of Markdown with powerful form capabilities, allowing you to create complex forms with minimal syntax.

## Core Philosophy

- **Human-readable**: Forms should be readable and writable by humans
- **Simple syntax**: Minimal learning curve with intuitive field definitions
- **Web standards**: Generates clean, semantic HTML forms
- **Framework agnostic**: Works with any web framework or vanilla JavaScript

## Architecture

Formdown consists of three main packages with a powerful extension system:

### @formdown/core
The foundational parsing engine with comprehensive extension capabilities:
- **formdown → html**: Parse syntax and generate semantic HTML forms
- **formdown → get-schema**: Extract structured metadata for validation and tooling
- **Extension System**: Hook-based plugin architecture for unlimited customization
- **Type Safety**: Full TypeScript support for third-party plugin development

### @formdown/ui
Web components that leverage the core extension system for enhanced functionality:
- Uses @formdown/core extension hooks for custom behaviors
- Plugin-based rendering and validation
- Framework-agnostic web components

### @formdown/editor
Development tools with plugin support for enhanced editing experiences:
- Live editor with syntax highlighting and real-time preview
- Leverages @formdown/core plugins for advanced features
- Extensible development environment

## Key Features

- **Shorthand syntax**: Write forms faster with intuitive shortcuts (`@name*: []`, `@email: @[]`)
- **Smart label generation**: Automatic conversion of field names to readable labels
- **Inline fields**: Embed form fields directly in markdown text
- **Rich field types**: Support for all HTML5 input types plus custom components via plugins
- **Extension System**: Hook-based plugins for custom field types, validators, and renderers
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
