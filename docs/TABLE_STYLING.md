# Table Styling Guide

Formdown supports markdown-style tables with inline fields, styled with GitHub Flavored Markdown standards and full customization support through CSS variables.

## Table Syntax

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
|___@field1|___@field2|___@field3|
```

## Default Styling

Tables are styled following **GitHub Flavored Markdown** standards:

- Clean, minimal borders
- Subtle header background
- Row hover effects
- Responsive design
- Rounded corners

## Customization with CSS Variables

Formdown tables use CSS custom properties (variables) for easy customization. You can override these in your CSS:

### Complete Variable Reference

```css
/* Table Structure */
--formdown-table-margin: 1rem 0;
--formdown-table-bg: #ffffff;
--formdown-table-border-width: 1px;
--formdown-table-border-color: #d0d7de;
--formdown-table-border-radius: 6px;
--formdown-table-font-size: 0.875rem;

/* Header Styling */
--formdown-table-header-bg: #f6f8fa;
--formdown-table-header-border-width: 1px;
--formdown-table-header-align: left;
--formdown-table-header-weight: 600;
--formdown-table-header-font-size: inherit;
--formdown-table-header-color: #1f2328;

/* Cell Styling */
--formdown-table-cell-padding: 0.5rem 1rem;
--formdown-table-cell-border-width: 1px;
--formdown-table-cell-color: #656d76;

/* Row Hover */
--formdown-table-row-hover-bg: #f6f8fa;
--formdown-table-transition: 0.1s ease;

/* Inline Fields */
--formdown-table-inline-field-min-width: 80px;

/* Mobile Responsive */
--formdown-table-font-size-mobile: 0.8125rem;
--formdown-table-border-radius-mobile: 4px;
--formdown-table-cell-padding-mobile: 0.375rem 0.75rem;
```

## Style Examples

### Minimal Style (Borderless)

```css
formdown-ui {
  --formdown-table-border-width: 0;
  --formdown-table-cell-border-width: 0;
  --formdown-table-header-border-width: 2px;
  --formdown-table-border-radius: 0;
}
```

### Bold Header Style

```css
formdown-ui {
  --formdown-table-header-bg: #0969da;
  --formdown-table-header-color: #ffffff;
  --formdown-table-header-weight: 700;
  --formdown-table-header-font-size: 0.9375rem;
}
```

### Compact Table

```css
formdown-ui {
  --formdown-table-cell-padding: 0.25rem 0.5rem;
  --formdown-table-font-size: 0.8125rem;
  --formdown-table-margin: 0.5rem 0;
}
```

### Striped Rows

```css
formdown-ui::part(table) tbody tr:nth-child(even) {
  background-color: #f6f8fa;
}

formdown-ui::part(table) tbody tr:hover {
  background-color: #eef2f5;
}
```

### Dark Mode

```css
@media (prefers-color-scheme: dark) {
  formdown-ui {
    --formdown-table-bg: #0d1117;
    --formdown-table-border-color: #30363d;
    --formdown-table-header-bg: #161b22;
    --formdown-table-header-color: #c9d1d9;
    --formdown-table-cell-color: #8b949e;
    --formdown-table-row-hover-bg: #161b22;
  }
}
```

### Notion-Style Table

```css
formdown-ui {
  --formdown-table-border-width: 0;
  --formdown-table-border-radius: 8px;
  --formdown-table-header-bg: transparent;
  --formdown-table-header-border-width: 2px;
  --formdown-table-cell-border-width: 1px;
  --formdown-table-cell-padding: 0.75rem 1rem;
  --formdown-table-row-hover-bg: rgba(0, 0, 0, 0.03);
}
```

## Advanced Customization

### Custom Table Class

You can add custom classes to tables by wrapping them in a div:

```html
<div class="custom-table-wrapper">
  <formdown-ui content="..."></formdown-ui>
</div>
```

```css
.custom-table-wrapper formdown-ui {
  --formdown-table-border-color: #6366f1;
  --formdown-table-header-bg: #6366f1;
  --formdown-table-header-color: #ffffff;
}
```

### Per-Table Styling

```html
<formdown-ui
  content="..."
  style="
    --formdown-table-header-bg: #10b981;
    --formdown-table-header-color: white;
  "
></formdown-ui>
```

## Theme Integration

Formdown tables respect global theme variables:

```css
:root {
  --theme-bg-primary: #ffffff;
  --theme-bg-secondary: #f6f8fa;
  --theme-border: #d0d7de;
  --theme-text-primary: #1f2328;
  --theme-text-secondary: #656d76;
}
```

Tables will automatically use these as fallbacks when specific table variables are not set.

## Accessibility

Table styling maintains accessibility standards:

- Sufficient color contrast (WCAG AA)
- Clear visual hierarchy
- Keyboard navigation support
- Screen reader compatibility

## Browser Support

Table styles use modern CSS features with fallbacks:

- CSS Custom Properties (IE11+)
- Border-radius (all modern browsers)
- Hover effects (all browsers)

## Best Practices

1. **Consistency**: Use the same variable set across your application
2. **Contrast**: Ensure text is readable against backgrounds
3. **Responsiveness**: Test on mobile devices
4. **Performance**: Limit complex selectors and animations
5. **Theme Support**: Provide both light and dark mode styles

## Examples in Demo

Visit the [Table Demo](https://formdown.dev/demo) and select "Table Demo" to see live examples with different styling options.
