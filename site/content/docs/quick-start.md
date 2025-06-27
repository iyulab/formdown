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

@name(Name): [text required]
@email(Email Address): [email required]
@message(Message): [textarea]
```

### Rendering with Web Components

```html
<script type="module" src="https://unpkg.com/@formdown/ui"></script>
<formdown-form>
@name(Name): [text required]
@email(Email Address): [email required]
@message(Message): [textarea]
</formdown-form>
```

### Rendering with JavaScript

```javascript
import { renderForm } from '@formdown/ui';

const formdownSource = `
@name(Name): [text required]
@email(Email Address): [email required]
@message(Message): [textarea]
`;

const formElement = renderForm(formdownSource);
document.body.appendChild(formElement);
```

## Next Steps

- Check out the [Syntax Guide](./syntax) for complete field types and attributes
- Explore the [Editor Documentation](./editor) for development tools
- Browse [sample forms](https://github.com/iyulab/formdown/tree/main/site/public/samples) for more examples

## Live Demo

Try the [interactive demo](../demo) to experiment with Formdown syntax in real-time.
