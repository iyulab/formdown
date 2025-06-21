# Formdown

**Formdown** is an extended syntax based on Markdown that enables easy generation of HTML documents and `<form>` elements.

## Key Features

- **Simple Syntax**: Intuitive Markdown-based syntax for creating complex HTML forms
- **Extensible**: Extends existing Markdown syntax to represent form elements
- **Efficient**: Eliminates the hassle of manually writing HTML and form code
- **Text-based**: Version control-friendly and collaboration-friendly text-based form definition

Like writing documents in regular Markdown, you can define forms, enabling quick and efficient web form generation.

## Architecture

Formdown follows a simple, modular architecture:

- **Core Specification**: Text-based syntax that can be used with any editor
- **formdown-ui**: Pure renderer (formdown syntax → HTML)
- **formdown-editor**: Optional development tool with enhanced editing features

## Project Structure

```
formdown/
├── packages/
│   ├── formdown-ui/              # Pure HTML renderer (Vite + TypeScript + Lit)
│   │   └── package.json
│   └── formdown-editor/          # Development tool editor (Vite + TypeScript + Lit)
│       └── package.json
└── site/                         # Official site and online demo (Next.js)
    └── package.json
```

## Packages

### formdown-ui
A lightweight web component that renders Formdown syntax into HTML forms.

**Features:**
- Pure formdown → HTML form conversion
- Minimal, focused functionality
- Customizable styling
- Form data collection and validation

### formdown-editor
An optional development tool for enhanced Formdown editing experience.

**Features:**
- Three modes: edit, split, view
- Real-time syntax highlighting
- IntelliSense and auto-completion
- Error validation and display
- Live preview integration with formdown-ui

**Note**: formdown-editor is not required for basic usage. Any text editor can be used to write formdown syntax.