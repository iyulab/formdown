# FormDown Style Customization Guide

FormDown UI (`formdown-ui`) is built with Lit Element and uses Shadow DOM for encapsulation. This guide explains how to customize the appearance of rendered forms using the official styling APIs.

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

FormDown supports two complementary styling methods:

| Method | Best For | Complexity |
|--------|----------|------------|
| **CSS Custom Properties** | Global theming, design tokens | Low |
| **CSS Shadow Parts (::part)** | Fine-grained element control | Medium |

---

## CSS Custom Properties

CSS Custom Properties (CSS Variables) pass through the Shadow DOM boundary, making them ideal for theming. All FormDown variables use the `--formdown-*` prefix.

### Colors

```css
formdown-ui {
  /* Primary Colors */
  --formdown-bg-primary: #ffffff;        /* Main background */
  --formdown-bg-secondary: #f8fafc;      /* Secondary/muted background */
  --formdown-text-primary: #1f2937;      /* Primary text color */
  --formdown-text-secondary: #64748b;    /* Secondary/muted text */
  --formdown-border-color: #e2e8f0;      /* Border color */
  --formdown-accent-color: #3b82f6;      /* Accent/brand color */

  /* Semantic Colors */
  --formdown-error-color: #ef4444;       /* Error states */
  --formdown-success-color: #10b981;     /* Success states */
  --formdown-warning-color: #f59e0b;     /* Warning states */
}
```

### Typography

```css
formdown-ui {
  /* Font Family */
  --formdown-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  /* Font Sizes */
  --formdown-font-size-xs: 0.75rem;      /* 12px */
  --formdown-font-size-sm: 0.875rem;     /* 14px */
  --formdown-font-size-base: 1rem;       /* 16px */
  --formdown-font-size-lg: 1.125rem;     /* 18px */

  /* Font Weights */
  --formdown-font-weight-normal: 400;
  --formdown-font-weight-medium: 500;
  --formdown-font-weight-semibold: 600;
  --formdown-font-weight-bold: 700;

  /* Line Height */
  --formdown-line-height: 1.5;
}
```

### Spacing

```css
formdown-ui {
  --formdown-spacing-xs: 0.25rem;        /* 4px */
  --formdown-spacing-sm: 0.5rem;         /* 8px */
  --formdown-spacing-md: 1rem;           /* 16px */
  --formdown-spacing-lg: 1.5rem;         /* 24px */
  --formdown-spacing-xl: 2rem;           /* 32px */

  /* Form-specific spacing */
  --formdown-field-gap: 1.5rem;          /* Gap between fields */
  --formdown-label-margin: 0.5rem;       /* Label bottom margin */
}
```

### Input Elements

```css
formdown-ui {
  /* Padding */
  --formdown-input-padding: 0.75rem;
  --formdown-input-padding-x: 0.75rem;
  --formdown-input-padding-y: 0.75rem;

  /* Border */
  --formdown-input-border-width: 1px;
  --formdown-input-border-radius: 0.5rem;

  /* Focus State */
  --formdown-input-focus-ring-width: 3px;
  --formdown-input-focus-ring-color: rgba(59, 130, 246, 0.1);
  --formdown-input-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

### Buttons

```css
formdown-ui {
  /* Primary Button */
  --formdown-button-bg: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  --formdown-button-bg-hover: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  --formdown-button-text: #ffffff;
  --formdown-button-border-radius: 0.5rem;
  --formdown-button-padding-x: 1.75rem;
  --formdown-button-padding-y: 0.75rem;
  --formdown-button-font-weight: 600;
  --formdown-button-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  --formdown-button-shadow-hover: 0 6px 12px rgba(59, 130, 246, 0.3);

  /* Secondary Button */
  --formdown-button-secondary-bg: linear-gradient(135deg, #64748b 0%, #475569 100%);
  --formdown-button-secondary-bg-hover: linear-gradient(135deg, #475569 0%, #334155 100%);

  /* Danger Button */
  --formdown-button-danger-bg: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  --formdown-button-danger-bg-hover: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
}
```

### Sections & Fieldsets

```css
formdown-ui {
  --formdown-section-bg: var(--formdown-bg-primary);
  --formdown-section-border-width: 1px;
  --formdown-section-border-color: var(--formdown-border-color);
  --formdown-section-border-radius: 0.5rem;
  --formdown-section-padding: 1.25rem;
}
```

### Tables

```css
formdown-ui {
  --formdown-table-bg: var(--formdown-bg-primary);
  --formdown-table-border-color: var(--formdown-border-color);
  --formdown-table-border-width: 1px;
  --formdown-table-border-radius: 6px;
  --formdown-table-cell-padding: 0.5rem 1rem;
  --formdown-table-header-bg: var(--formdown-bg-secondary);
  --formdown-table-header-color: var(--formdown-text-primary);
  --formdown-table-header-weight: 600;
  --formdown-table-row-hover-bg: var(--formdown-bg-secondary);
  --formdown-table-margin: 1rem 0;
  --formdown-table-font-size: 0.875rem;
}
```

### Code Blocks

```css
formdown-ui {
  --formdown-code-bg: var(--formdown-bg-secondary);
  --formdown-code-font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  --formdown-code-font-size: 0.875em;
  --formdown-code-border-radius: 0.375rem;
}
```

### Transitions

```css
formdown-ui {
  --formdown-transition-fast: 0.15s ease-in-out;
  --formdown-transition-normal: 0.2s ease-in-out;
}
```

---

## CSS Shadow Parts (::part)

The `::part()` pseudo-element allows direct styling of internal elements. FormDown exposes the following parts:

### Available Parts

| Part Name | Element | Description |
|-----------|---------|-------------|
| `field` | `<div>` | Field wrapper container |
| `label` | `<label>` | Field labels |
| `input` | `<input>` | All input elements |
| `text-input` | `<input type="text">` | Text inputs |
| `textarea-input` | `<textarea>` | Textarea elements |
| `select-input` | `<select>` | Select dropdowns |
| `checkbox-input` | `<input type="checkbox">` | Checkboxes |
| `range-input` | `<input type="range">` | Range sliders |
| `file-input` | `<input type="file">` | File inputs |
| `color-input` | `<input type="color">` | Color pickers |
| `week-input` | `<input type="week">` | Week inputs |
| `month-input` | `<input type="month">` | Month inputs |
| `fieldset` | `<fieldset>` | Fieldset containers |
| `legend` | `<legend>` | Fieldset legends |
| `radio-group` | `<div>` | Radio button groups |
| `checkbox-group` | `<div>` | Checkbox groups |
| `button` | `<button>` | All buttons |
| `submit-button` | `<button type="submit">` | Submit buttons |
| `reset-button` | `<button type="reset">` | Reset buttons |

### Usage Examples

```css
/* Style all input elements */
formdown-ui::part(input) {
  border-radius: 12px;
  padding: 12px 16px;
}

/* Style submit button specifically */
formdown-ui::part(submit-button) {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Style section headers */
formdown-ui::part(legend) {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

/* Style labels */
formdown-ui::part(label) {
  font-weight: 600;
  color: #1e293b;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

/* Style textarea */
formdown-ui::part(textarea-input) {
  min-height: 120px;
  resize: vertical;
}

/* Style select dropdown */
formdown-ui::part(select-input) {
  appearance: none;
  background-image: url("data:image/svg+xml,...");
  background-repeat: no-repeat;
  background-position: right 12px center;
}
```

### Combining Parts

Elements can have multiple parts, allowing both generic and specific styling:

```css
/* All inputs get rounded corners */
formdown-ui::part(input) {
  border-radius: 8px;
}

/* Text inputs get additional padding */
formdown-ui::part(text-input) {
  padding: 12px 16px;
}

/* Checkboxes get custom styling */
formdown-ui::part(checkbox-input) {
  width: 20px;
  height: 20px;
}
```

---

## Theme Examples

### Dark Mode Theme

```css
formdown-ui.dark {
  --formdown-bg-primary: #1e293b;
  --formdown-bg-secondary: #334155;
  --formdown-text-primary: #f1f5f9;
  --formdown-text-secondary: #94a3b8;
  --formdown-border-color: #475569;
  --formdown-accent-color: #60a5fa;
  --formdown-input-focus-ring-color: rgba(96, 165, 250, 0.2);
}
```

### Purple/Violet Theme

```css
formdown-ui.purple {
  --formdown-accent-color: #8b5cf6;
  --formdown-button-bg: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  --formdown-button-bg-hover: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  --formdown-input-focus-ring-color: rgba(139, 92, 246, 0.15);
  --formdown-button-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
}
```

### Minimal/Flat Theme

```css
formdown-ui.minimal {
  --formdown-input-border-radius: 0;
  --formdown-button-border-radius: 0;
  --formdown-section-border-radius: 0;
  --formdown-button-bg: #3b82f6;
  --formdown-button-bg-hover: #2563eb;
  --formdown-button-shadow: none;
  --formdown-button-shadow-hover: none;
  --formdown-input-focus-ring: 0 0 0 2px #3b82f6;
}
```

### Large Touch-Friendly Theme

```css
formdown-ui.touch {
  --formdown-font-size-base: 1.125rem;
  --formdown-input-padding: 1rem;
  --formdown-input-border-radius: 12px;
  --formdown-button-padding-x: 2rem;
  --formdown-button-padding-y: 1rem;
  --formdown-spacing-md: 1.5rem;
  --formdown-field-gap: 2rem;
}
```

---

## Best Practices

### 1. Use CSS Custom Properties for Theming

CSS Custom Properties are the recommended approach for global theming:

```css
/* Good: Theme-level customization */
formdown-ui {
  --formdown-accent-color: #8b5cf6;
  --formdown-input-border-radius: 8px;
}
```

### 2. Use ::part for Specific Element Styling

Use `::part()` when you need fine-grained control over specific elements:

```css
/* Good: Element-specific customization */
formdown-ui::part(submit-button) {
  text-transform: uppercase;
}
```

### 3. Combine Both Approaches

For maximum flexibility, combine both methods:

```css
/* Theme variables for consistency */
formdown-ui {
  --formdown-accent-color: #8b5cf6;
  --formdown-button-bg: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

/* ::part for specific overrides */
formdown-ui::part(submit-button) {
  font-weight: 700;
  letter-spacing: 0.5px;
}
```

### 4. Scope Styles Per Instance

Different form instances can have different styles:

```css
/* Contact form */
#contact-form formdown-ui {
  --formdown-accent-color: #10b981;
}

/* Login form */
#login-form formdown-ui {
  --formdown-accent-color: #3b82f6;
}
```

---

## Legacy Support

For backward compatibility, FormDown also supports the legacy `--theme-*` variable prefix:

```css
/* Legacy variables (still supported) */
formdown-ui {
  --theme-accent: #8b5cf6;
  --theme-bg-primary: #ffffff;
  --theme-text-primary: #1f2937;
}
```

The new `--formdown-*` variables automatically fall back to `--theme-*` if defined:

```css
/* Internal mapping */
--formdown-accent-color: var(--theme-accent, #3b82f6);
```

---

## Browser Support

- **CSS Custom Properties**: All modern browsers (Chrome 49+, Firefox 31+, Safari 9.1+, Edge 15+)
- **CSS Shadow Parts (::part)**: All modern browsers (Chrome 73+, Firefox 72+, Safari 13.1+, Edge 79+)

For older browsers, FormDown gracefully falls back to default styles.

---

## Related Resources

- [Lit Element Styling](https://lit.dev/docs/components/styles/)
- [CSS Shadow Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [FormDown Syntax Reference](./SYNTAX.md)
