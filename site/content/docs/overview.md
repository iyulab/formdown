# Overview

Formdown is a simple, human-readable format for creating web forms. It combines the simplicity of Markdown with powerful form capabilities, allowing you to create complex forms with minimal syntax.

## Core Philosophy

- **Human-readable**: Forms should be readable and writable by humans
- **Simple syntax**: Minimal learning curve with intuitive field definitions
- **Web standards**: Generates clean, semantic HTML forms
- **Framework agnostic**: Works with any web framework or vanilla JavaScript

## Architecture

Formdown consists of three main packages:

### @formdown/core
The parsing engine that converts Formdown syntax into structured data.

### @formdown/ui
Web components and utilities for rendering forms in the browser. This is the main package most users will need.

### @formdown/editor
Development tools including a live editor with syntax highlighting and real-time preview.

## Key Features

- **Shorthand syntax**: Write forms faster with intuitive shortcuts (`@name*: []`, `@email: @[]`)
- **Smart label generation**: Automatic conversion of field names to readable labels
- **Inline fields**: Embed form fields directly in markdown text
- **Rich field types**: Support for all HTML5 input types plus custom components
- **Flexible attributes**: Control validation, styling, and behavior
- **Markdown integration**: Mix forms with rich text content
- **Progressive complexity**: Start simple, add complexity as needed
- **Zero dependencies**: Lightweight and fast

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
