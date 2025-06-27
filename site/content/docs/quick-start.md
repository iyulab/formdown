# Quick Start

This guide will get you up and running with Formdown in minutes.

## Installation

Install the core package for form rendering:

```bash
npm install @formdown/ui
```

For development with the editor:

```bash
npm install @formdown/editor
```

## Basic Usage

### Creating Your First Form

Create a `.fd` file with simple form fields:

```formdown
# Contact Form

@name*: []
@email*: @[]
@message: [textarea]
```

**That's it!** FormDown automatically:
- Generates labels ("Name", "Email", "Message")
- Makes fields required with `*`
- Sets appropriate input types (`@` = email)

### Alternative: Standard Syntax

You can also use the full syntax for more control:

```formdown
# Contact Form

@name(Name): [text required]
@email(Email Address): [email required]
@message(Message): [textarea]
```

### Rendering with Web Components

```html
<script type="module" src="https://unpkg.com/@formdown/ui"></script>
<formdown-form>
@name*: []
@email*: @[]
@message: [textarea]
</formdown-form>
```

### Rendering with JavaScript

```javascript
import { renderForm } from '@formdown/ui';

const formdownSource = `
@name*: []
@email*: @[]
@message: [textarea]
`;

const formElement = renderForm(formdownSource);
document.body.appendChild(formElement);
```

## Shorthand vs Standard Syntax

FormDown offers two ways to write forms:

### Shorthand (Recommended for Beginners)
```formdown
# Quick Registration

@username*: []
@email*: @[]
@password*: ?[]
@age: #[min=13]
@country{USA,Canada,UK}: s[]
@interests{Web,Mobile,AI}: c[]
@terms*: c[]
```

**Benefits:**
- ✅ **Concise** - Less typing, faster development
- ✅ **Intuitive** - Common patterns use familiar symbols
- ✅ **Smart** - Automatic label generation

### Standard (Full Control)
```formdown
# Detailed Registration

@username: [text required minlength=4 placeholder="Username"]
@email: [email required]
@password: [password required minlength=8]
@age: [number min=13 max=120]
@country: [select options="USA,Canada,UK"]
@interests: [checkbox options="Web,Mobile,AI"]
@terms: [checkbox required label="I agree to terms"]
```

**Benefits:**
- 🔧 **Flexible** - Custom attributes and validation
- 🎨 **Styling** - CSS classes and data attributes
- 📋 **Complex** - Advanced form logic

### Mixed Usage (Best Practice)
```formdown
# Registration Form

// Simple fields - use shorthand
@name*: []
@email*: @[]
@phone{(###)###-####}: []

// Complex fields - use standard
@bio: [textarea rows=4 maxlength=500 placeholder="Tell us about yourself..."]
@profile_pic: [file accept="image/*" class="upload-field"]
```

## Next Steps

- Check out the [Syntax Guide](./syntax) for complete field types and attributes
- Explore the [Editor Documentation](./editor) for development tools
- Browse [sample forms](https://github.com/iyulab/formdown/tree/main/site/public/samples) for more examples

## Live Demo

Try the [interactive demo](../demo) to experiment with Formdown syntax in real-time.
