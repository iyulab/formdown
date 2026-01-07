# Style Customization

FormDown UI (`formdown-ui`) uses Shadow DOM for style encapsulation. This guide explains how to customize the appearance using official styling APIs.

## Quick Start

```css
/* Simple theming with CSS Custom Properties */
formdown-ui {
  --formdown-accent-color: #8b5cf6;
  --formdown-input-border-radius: 12px;
  --formdown-button-bg: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

/* Fine-grained control with ::part */
formdown-ui::part(submit-button) {
  font-weight: 700;
  text-transform: uppercase;
}
```

## Styling Approaches

| Method | Best For | Complexity |
|--------|----------|------------|
| **CSS Custom Properties** | Global theming, design tokens | Low |
| **CSS Shadow Parts (::part)** | Fine-grained element control | Medium |

## CSS Custom Properties

CSS variables pass through Shadow DOM, making them ideal for theming. All variables use the `--formdown-*` prefix.

### Colors

```css
formdown-ui {
  /* Primary Colors */
  --formdown-bg-primary: #ffffff;
  --formdown-bg-secondary: #f8fafc;
  --formdown-text-primary: #1f2937;
  --formdown-text-secondary: #64748b;
  --formdown-border-color: #e2e8f0;
  --formdown-accent-color: #3b82f6;

  /* Semantic Colors */
  --formdown-error-color: #ef4444;
  --formdown-success-color: #10b981;
  --formdown-warning-color: #f59e0b;
}
```

### Typography

```css
formdown-ui {
  --formdown-font-family: system-ui, sans-serif;
  --formdown-font-size-base: 1rem;
  --formdown-font-size-sm: 0.875rem;
  --formdown-font-size-lg: 1.125rem;
  --formdown-line-height: 1.5;
  --formdown-font-weight-medium: 500;
  --formdown-font-weight-bold: 700;
}
```

### Spacing

```css
formdown-ui {
  --formdown-spacing-xs: 0.25rem;
  --formdown-spacing-sm: 0.5rem;
  --formdown-spacing-md: 1rem;
  --formdown-spacing-lg: 1.5rem;
  --formdown-spacing-xl: 2rem;
  --formdown-field-gap: 1.5rem;
}
```

### Input Elements

```css
formdown-ui {
  --formdown-input-padding: 0.75rem;
  --formdown-input-border-width: 1px;
  --formdown-input-border-radius: 0.5rem;
  --formdown-input-focus-ring-width: 3px;
  --formdown-input-focus-ring-color: rgba(59, 130, 246, 0.1);
}
```

### Buttons

```css
formdown-ui {
  --formdown-button-bg: linear-gradient(135deg, #3b82f6, #2563eb);
  --formdown-button-bg-hover: linear-gradient(135deg, #2563eb, #1d4ed8);
  --formdown-button-text: #ffffff;
  --formdown-button-border-radius: 0.5rem;
  --formdown-button-padding-x: 1.75rem;
  --formdown-button-padding-y: 0.75rem;
  --formdown-button-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}
```

### Sections & Tables

```css
formdown-ui {
  /* Sections */
  --formdown-section-bg: var(--formdown-bg-primary);
  --formdown-section-border-radius: 0.5rem;
  --formdown-section-padding: 1.25rem;

  /* Tables */
  --formdown-table-border-radius: 6px;
  --formdown-table-cell-padding: 0.5rem 1rem;
  --formdown-table-header-bg: var(--formdown-bg-secondary);
}
```

## CSS Shadow Parts (::part)

The `::part()` pseudo-element enables direct styling of internal elements.

### Available Parts

| Part | Element | Description |
|------|---------|-------------|
| `field` | `<div>` | Field wrapper |
| `label` | `<label>` | Field labels |
| `input` | `<input>` | All inputs |
| `text-input` | `<input type="text">` | Text inputs |
| `textarea-input` | `<textarea>` | Textareas |
| `select-input` | `<select>` | Dropdowns |
| `checkbox-input` | `<input type="checkbox">` | Checkboxes |
| `range-input` | `<input type="range">` | Range sliders |
| `file-input` | `<input type="file">` | File inputs |
| `fieldset` | `<fieldset>` | Fieldsets |
| `legend` | `<legend>` | Legends |
| `radio-group` | `<div>` | Radio groups |
| `checkbox-group` | `<div>` | Checkbox groups |
| `button` | `<button>` | All buttons |
| `submit-button` | `<button type="submit">` | Submit buttons |
| `reset-button` | `<button type="reset">` | Reset buttons |

### Usage Examples

```css
/* Style all inputs */
formdown-ui::part(input) {
  border-radius: 12px;
  padding: 12px 16px;
}

/* Style submit button */
formdown-ui::part(submit-button) {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  font-weight: 700;
  text-transform: uppercase;
}

/* Style section headers */
formdown-ui::part(legend) {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  padding: 0.75rem 1rem;
  border-left: 4px solid #3b82f6;
}

/* Style labels */
formdown-ui::part(label) {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
}
```

## Theme Examples

### Dark Mode

```css
formdown-ui.dark {
  --formdown-bg-primary: #1e293b;
  --formdown-bg-secondary: #334155;
  --formdown-text-primary: #f1f5f9;
  --formdown-text-secondary: #94a3b8;
  --formdown-border-color: #475569;
  --formdown-accent-color: #60a5fa;
}
```

### Purple Theme

```css
formdown-ui.purple {
  --formdown-accent-color: #8b5cf6;
  --formdown-button-bg: linear-gradient(135deg, #8b5cf6, #7c3aed);
  --formdown-input-focus-ring-color: rgba(139, 92, 246, 0.15);
}
```

### Minimal/Flat Theme

```css
formdown-ui.minimal {
  --formdown-input-border-radius: 0;
  --formdown-button-border-radius: 0;
  --formdown-button-bg: #3b82f6;
  --formdown-button-shadow: none;
  --formdown-input-focus-ring: 0 0 0 2px #3b82f6;
}
```

### Touch-Friendly Theme

```css
formdown-ui.touch {
  --formdown-font-size-base: 1.125rem;
  --formdown-input-padding: 1rem;
  --formdown-input-border-radius: 12px;
  --formdown-button-padding-x: 2rem;
  --formdown-button-padding-y: 1rem;
}
```

## Per-Instance Styling

Different form instances can have different styles:

```css
#contact-form formdown-ui {
  --formdown-accent-color: #10b981;
}

#login-form formdown-ui {
  --formdown-accent-color: #3b82f6;
}
```

## Legacy Support

For backward compatibility, legacy `--theme-*` variables are still supported:

```css
formdown-ui {
  --theme-accent: #8b5cf6;  /* Still works */
}
```

## Browser Support

- **CSS Custom Properties**: Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+
- **CSS Shadow Parts**: Chrome 73+, Firefox 72+, Safari 13.1+, Edge 79+

For complete documentation, see [STYLING.md](https://github.com/niceplugin/formdown/blob/main/docs/STYLING.md).
