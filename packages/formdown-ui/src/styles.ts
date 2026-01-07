import { css } from 'lit'

/**
 * Formdown UI Styles
 *
 * This stylesheet uses CSS Custom Properties (CSS Variables) for theming.
 * All variables use the --formdown-* prefix and can be customized externally.
 *
 * @example
 * ```css
 * formdown-ui {
 *   --formdown-accent-color: #8b5cf6;
 *   --formdown-input-border-radius: 12px;
 * }
 * ```
 *
 * For backward compatibility, legacy --theme-* variables are also supported.
 */
export const formdownStyles = css`
  /* ========================================
   * CSS Custom Properties (Design Tokens)
   * ======================================== */
  :host {
    /* Colors - Primary */
    --formdown-bg-primary: var(--theme-bg-primary, #ffffff);
    --formdown-bg-secondary: var(--theme-bg-secondary, #f8fafc);
    --formdown-text-primary: var(--theme-text-primary, #1f2937);
    --formdown-text-secondary: var(--theme-text-secondary, #64748b);
    --formdown-border-color: var(--theme-border, #e2e8f0);
    --formdown-accent-color: var(--theme-accent, #3b82f6);
    --formdown-error-color: var(--theme-error, #ef4444);
    --formdown-success-color: #10b981;
    --formdown-warning-color: #f59e0b;

    /* Typography */
    --formdown-font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --formdown-font-size-base: 1rem;
    --formdown-font-size-sm: 0.875rem;
    --formdown-font-size-xs: 0.75rem;
    --formdown-font-size-lg: 1.125rem;
    --formdown-line-height: 1.5;
    --formdown-font-weight-normal: 400;
    --formdown-font-weight-medium: 500;
    --formdown-font-weight-semibold: 600;
    --formdown-font-weight-bold: 700;

    /* Spacing */
    --formdown-spacing-xs: 0.25rem;
    --formdown-spacing-sm: 0.5rem;
    --formdown-spacing-md: 1rem;
    --formdown-spacing-lg: 1.5rem;
    --formdown-spacing-xl: 2rem;

    /* Transitions */
    --formdown-transition-fast: 0.15s ease-in-out;
    --formdown-transition-normal: 0.2s ease-in-out;

    /* Form Layout */
    --formdown-field-gap: 1.5rem;
    --formdown-label-margin: 0.5rem;

    /* Input Elements */
    --formdown-input-padding: 0.75rem;
    --formdown-input-padding-x: 0.75rem;
    --formdown-input-padding-y: 0.75rem;
    --formdown-input-border-width: 1px;
    --formdown-input-border-radius: 0.5rem;
    --formdown-input-focus-ring-width: 3px;
    --formdown-input-focus-ring-color: rgba(59, 130, 246, 0.1);
    --formdown-input-focus-ring: 0 0 0 var(--formdown-input-focus-ring-width) var(--formdown-input-focus-ring-color);

    /* Buttons */
    --formdown-button-bg: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    --formdown-button-bg-hover: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    --formdown-button-text: #ffffff;
    --formdown-button-border-radius: 0.5rem;
    --formdown-button-padding-x: 1.75rem;
    --formdown-button-padding-y: 0.75rem;
    --formdown-button-font-weight: 600;
    --formdown-button-shadow: 0 2px 4px rgba(59, 130, 246, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
    --formdown-button-shadow-hover: 0 6px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);

    /* Secondary Button */
    --formdown-button-secondary-bg: linear-gradient(135deg, #64748b 0%, #475569 100%);
    --formdown-button-secondary-bg-hover: linear-gradient(135deg, #475569 0%, #334155 100%);

    /* Danger Button */
    --formdown-button-danger-bg: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    --formdown-button-danger-bg-hover: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);

    /* Section/Fieldset */
    --formdown-section-bg: var(--formdown-bg-primary);
    --formdown-section-border-width: 1px;
    --formdown-section-border-color: var(--formdown-border-color);
    --formdown-section-border-radius: 0.5rem;
    --formdown-section-padding: 1.25rem;

    /* Table */
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

    /* Code Blocks */
    --formdown-code-bg: var(--formdown-bg-secondary);
    --formdown-code-font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    --formdown-code-font-size: 0.875em;
    --formdown-code-border-radius: 0.375rem;

    /* Host styles */
    display: block;
    font-family: var(--formdown-font-family);
    line-height: var(--formdown-line-height);
    color: var(--formdown-text-primary);
    background: var(--formdown-bg-primary);
    max-width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
  }

  * {
    box-sizing: border-box;
  }

  /* ========================================
   * Form Container
   * ======================================== */
  .formdown-form {
    max-width: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    display: none; /* Hidden form for form attribute reference */
  }

  /* ========================================
   * Field Layout
   * ======================================== */
  .formdown-field {
    margin-bottom: var(--formdown-field-gap);
    max-width: 100%;
  }

  .formdown-field-container {
    margin-bottom: var(--formdown-spacing-md);
  }

  .formdown-field-container:last-child {
    margin-bottom: 0;
  }

  /* ========================================
   * Labels
   * ======================================== */
  label {
    display: block;
    margin-bottom: var(--formdown-label-margin);
    font-weight: var(--formdown-font-weight-medium);
    color: var(--formdown-text-primary);
    font-size: var(--formdown-font-size-sm);
    line-height: 1.25;
  }

  /* ========================================
   * Input Elements
   * ======================================== */
  input, textarea, select {
    width: 100%;
    max-width: 100%;
    padding: var(--formdown-input-padding-y) var(--formdown-input-padding-x);
    border: var(--formdown-input-border-width) solid var(--formdown-border-color);
    border-radius: var(--formdown-input-border-radius);
    font-size: var(--formdown-font-size-base);
    font-family: inherit;
    line-height: var(--formdown-line-height);
    transition: all var(--formdown-transition-fast);
    background-color: var(--formdown-bg-primary);
    color: var(--formdown-text-primary);
  }

  input::placeholder, textarea::placeholder {
    color: var(--formdown-text-secondary);
    font-style: italic;
    opacity: 0.8;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--formdown-accent-color);
    box-shadow: var(--formdown-input-focus-ring);
    background-color: var(--formdown-bg-primary);
  }

  input:hover, textarea:hover, select:hover {
    border-color: var(--formdown-text-secondary);
  }

  input[type="radio"], input[type="checkbox"] {
    width: auto;
    max-width: none;
    margin-right: var(--formdown-spacing-sm);
    margin-bottom: 0;
  }

  textarea {
    min-height: 6rem;
    resize: vertical;
  }

  select {
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 0.5rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 2.5rem;
  }

  /* ========================================
   * Fieldset/Section
   * ======================================== */
  fieldset {
    border: var(--formdown-section-border-width) solid var(--formdown-section-border-color);
    border-radius: var(--formdown-section-border-radius);
    padding: var(--formdown-section-padding);
    margin: 0 0 var(--formdown-field-gap) 0;
    max-width: 100%;
    background-color: var(--formdown-section-bg);
  }

  legend {
    font-weight: var(--formdown-font-weight-semibold);
    color: var(--formdown-text-primary);
    padding: 0 var(--formdown-spacing-md);
    font-size: var(--formdown-font-size-sm);
  }

  fieldset label {
    display: flex;
    align-items: center;
    margin-bottom: var(--formdown-spacing-md);
    font-weight: var(--formdown-font-weight-normal);
    font-size: var(--formdown-font-size-sm);
  }

  /* ========================================
   * Inline Fields (contentEditable)
   * ======================================== */
  formdown-field,
  [contenteditable="true"]:not(textarea) {
    display: inline-block;
    min-width: 60px;
    max-width: 200px;
    font-style: normal;
    color: inherit;
    font-size: inherit;
    line-height: var(--formdown-line-height);
    font-family: inherit;
    font-weight: inherit;
    cursor: text;
    outline: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    box-decoration-break: clone;
  }

  [contenteditable="true"]:not(textarea):empty::before {
    content: attr(data-placeholder);
    color: var(--formdown-text-secondary);
    font-style: italic;
    font-weight: var(--formdown-font-weight-normal);
    opacity: 0.7;
    pointer-events: none;
    user-select: none;
  }

  [contenteditable="true"]:not(textarea) {
    border: 1px solid rgba(209, 213, 219, 0.6);
    background-color: rgba(248, 250, 252, 0.8);
    border-radius: 0.25rem;
    padding: 0.125rem 0.5rem;
    transition: all var(--formdown-transition-normal);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    position: relative;
    min-height: 1.5em;
  }

  [contenteditable="true"]:not(textarea):hover {
    background-color: rgba(241, 245, 249, 0.9);
    border-color: rgba(156, 163, 175, 0.8);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  [contenteditable="true"]:not(textarea):focus {
    background-color: var(--formdown-bg-primary);
    border-color: var(--formdown-accent-color);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15);
    color: var(--formdown-text-primary);
    transform: translateY(-1px);
  }

  [contenteditable="true"]:not(textarea):not(:empty) {
    background-color: var(--formdown-bg-primary);
    border-color: rgba(156, 163, 175, 0.9);
    font-weight: var(--formdown-font-weight-normal);
  }

  /* ========================================
   * Typography (Markdown Content)
   * ======================================== */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: var(--formdown-spacing-md);
    color: var(--formdown-text-primary);
    font-weight: var(--formdown-font-weight-semibold);
    line-height: 1.25;
  }

  h1 { font-size: 2.25rem; font-weight: var(--formdown-font-weight-bold); }
  h2 { font-size: 1.875rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  h5 { font-size: 1.125rem; }
  h6 { font-size: 1rem; }

  p {
    margin-bottom: var(--formdown-spacing-md);
    line-height: 1.7;
    color: var(--formdown-text-secondary);
  }

  /* ========================================
   * Code Blocks
   * ======================================== */
  pre {
    background-color: var(--formdown-code-bg);
    border: 1px solid var(--formdown-border-color);
    border-radius: var(--formdown-code-border-radius);
    padding: var(--formdown-spacing-md);
    margin: var(--formdown-spacing-md) 0;
    overflow-x: auto;
    font-family: var(--formdown-code-font-family);
    font-size: var(--formdown-font-size-sm);
    line-height: 1.6;
  }

  code {
    font-family: var(--formdown-code-font-family);
    font-size: var(--formdown-code-font-size);
    background-color: rgba(175, 184, 193, 0.2);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    color: var(--formdown-text-primary);
  }

  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: var(--formdown-font-size-sm);
    color: var(--formdown-text-primary);
  }

  .language-javascript, .language-js,
  .language-typescript, .language-ts,
  .language-python, .language-py,
  .language-html, .language-css,
  .language-json, .language-bash {
    display: block;
  }

  /* ========================================
   * Responsive Design
   * ======================================== */
  @media (max-width: 768px) {
    :host {
      font-size: var(--formdown-font-size-sm);
    }

    input, textarea, select {
      padding: 0.625rem;
      font-size: var(--formdown-font-size-sm);
    }

    h1 { font-size: 1.875rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
  }

  /* ========================================
   * Validation States
   * ======================================== */
  .error {
    color: var(--formdown-error-color);
    font-size: var(--formdown-font-size-sm);
    margin-top: var(--formdown-spacing-sm);
    display: block;
  }

  .field-error {
    border-color: var(--formdown-error-color) !important;
    box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.1) !important;
  }

  .field-error:focus {
    border-color: var(--formdown-error-color) !important;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
  }

  .validation-error-message {
    color: var(--formdown-error-color);
    font-size: var(--formdown-font-size-xs);
    margin-top: var(--formdown-spacing-xs);
    display: block;
    font-weight: var(--formdown-font-weight-medium);
  }

  .field-valid {
    border-color: var(--formdown-success-color) !important;
    box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1) !important;
  }

  /* ========================================
   * Buttons - Base Styles
   * ======================================== */
  .submit-button,
  button,
  input[type="submit"],
  input[type="button"],
  input[type="reset"] {
    color: var(--formdown-button-text);
    padding: var(--formdown-button-padding-y) var(--formdown-button-padding-x);
    border: none;
    border-radius: var(--formdown-button-border-radius);
    font-size: var(--formdown-font-size-base);
    font-weight: var(--formdown-button-font-weight);
    cursor: pointer;
    transition: all var(--formdown-transition-normal);
    margin-top: var(--formdown-field-gap);
    width: auto;
    max-width: 100%;
    letter-spacing: 0.025em;
    position: relative;
    overflow: hidden;
    font-family: inherit;
  }

  /* Shine effect */
  .submit-button::before,
  button::before,
  input[type="submit"]::before,
  input[type="button"]::before,
  input[type="reset"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease-in-out;
  }

  .submit-button:hover::before,
  button:hover::before,
  input[type="submit"]:hover::before,
  input[type="button"]:hover::before,
  input[type="reset"]:hover::before {
    left: 100%;
  }

  .submit-button:hover,
  button:hover,
  input[type="submit"]:hover,
  input[type="button"]:hover,
  input[type="reset"]:hover {
    transform: translateY(-2px);
  }

  .submit-button:active,
  button:active,
  input[type="submit"]:active,
  input[type="button"]:active,
  input[type="reset"]:active {
    transform: translateY(0);
  }

  .submit-button:disabled,
  button:disabled,
  input[type="submit"]:disabled,
  input[type="button"]:disabled,
  input[type="reset"]:disabled {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }

  .submit-button:disabled::before,
  button:disabled::before,
  input[type="submit"]:disabled::before,
  input[type="button"]:disabled::before,
  input[type="reset"]:disabled::before {
    display: none;
  }

  /* Primary Button (submit) */
  .submit-button,
  button[type="submit"],
  input[type="submit"],
  button:not([type]) {
    background: var(--formdown-button-bg);
    box-shadow: var(--formdown-button-shadow);
  }

  .submit-button:hover,
  button[type="submit"]:hover,
  input[type="submit"]:hover,
  button:not([type]):hover {
    background: var(--formdown-button-bg-hover);
    box-shadow: var(--formdown-button-shadow-hover);
  }

  .submit-button:active,
  button[type="submit"]:active,
  input[type="submit"]:active,
  button:not([type]):active {
    box-shadow: var(--formdown-button-shadow);
  }

  /* Secondary Button */
  button[type="button"],
  input[type="button"] {
    background: var(--formdown-button-secondary-bg);
    box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button[type="button"]:hover,
  input[type="button"]:hover {
    background: var(--formdown-button-secondary-bg-hover);
    box-shadow: 0 6px 12px rgba(100, 116, 139, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button[type="button"]:active,
  input[type="button"]:active {
    box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Danger Button (reset) */
  button[type="reset"],
  input[type="reset"] {
    background: var(--formdown-button-danger-bg);
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button[type="reset"]:hover,
  input[type="reset"]:hover {
    background: var(--formdown-button-danger-bg-hover);
    box-shadow: 0 6px 12px rgba(239, 68, 68, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button[type="reset"]:active,
  input[type="reset"]:active {
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* ========================================
   * Content Container
   * ======================================== */
  #content-container {
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  /* ========================================
   * Radio and Checkbox Groups
   * ======================================== */
  .radio-group, .checkbox-group {
    display: flex;
    gap: var(--formdown-spacing-md);
    flex-wrap: wrap;
  }

  .radio-group.inline, .checkbox-group.inline {
    flex-direction: row;
    align-items: center;
  }

  .radio-group.vertical, .checkbox-group.vertical {
    flex-direction: column;
    align-items: flex-start;
  }

  .formdown-option-label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    font-weight: var(--formdown-font-weight-normal);
    cursor: pointer;
    font-size: var(--formdown-font-size-sm);
    white-space: nowrap;
  }

  .formdown-option-label input {
    margin-right: var(--formdown-spacing-sm);
    margin-bottom: 0;
  }

  .formdown-option-label span {
    user-select: none;
  }

  .radio-group label, .checkbox-group label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    font-weight: var(--formdown-font-weight-normal);
    cursor: pointer;
  }

  .formdown-form > * + * {
    margin-top: var(--formdown-spacing-md);
  }

  /* ========================================
   * Table Styles (GitHub Flavored Markdown)
   * ======================================== */
  .formdown-table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--formdown-table-margin);
    background-color: var(--formdown-table-bg);
    border: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
    border-radius: var(--formdown-table-border-radius);
    overflow: hidden;
    font-size: var(--formdown-table-font-size);
  }

  .formdown-table thead {
    background-color: var(--formdown-table-header-bg);
    border-bottom: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
  }

  .formdown-table th {
    padding: var(--formdown-table-cell-padding);
    text-align: left;
    font-weight: var(--formdown-table-header-weight);
    font-size: inherit;
    color: var(--formdown-table-header-color);
    border-right: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
  }

  .formdown-table th:last-child {
    border-right: none;
  }

  .formdown-table td {
    padding: var(--formdown-table-cell-padding);
    border-top: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
    border-right: var(--formdown-table-border-width) solid var(--formdown-table-border-color);
    color: var(--formdown-text-secondary);
    line-height: var(--formdown-line-height);
  }

  .formdown-table td:last-child {
    border-right: none;
  }

  .formdown-table tbody tr {
    transition: background-color var(--formdown-transition-fast);
  }

  .formdown-table tbody tr:hover {
    background-color: var(--formdown-table-row-hover-bg);
  }

  .formdown-table tbody tr:last-child td {
    border-bottom: none;
  }

  .formdown-table td [contenteditable="true"] {
    min-width: 80px;
    max-width: 100%;
    display: inline-block;
  }

  @media (max-width: 768px) {
    .formdown-table {
      font-size: 0.8125rem;
      border-radius: 4px;
    }

    .formdown-table th,
    .formdown-table td {
      padding: 0.375rem 0.75rem;
    }
  }
`
