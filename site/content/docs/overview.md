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

- **Inline fields**: Embed form fields directly in markdown text
- **Rich field types**: Support for all HTML5 input types plus custom components
- **Flexible attributes**: Control validation, styling, and behavior
- **Markdown integration**: Mix forms with rich text content
- **Zero dependencies**: Lightweight and fast

## Example

<formdown-editor mode="split">
# User Registration
</formdown-editor>

```formdown
# User Registration

Please fill out all required fields:

First name[text]:First Name* and last name[text]:Last Name*

email[email]:Email Address*{placeholder="Enter your email"}
password[password]:Password*{minlength=8}
confirm[password]:Confirm Password*

Subscribe to newsletter[checkbox]:Yes, send me updates

[submit]:Create Account
```

This generates a complete registration form with validation, proper labels, and semantic HTML structure.
