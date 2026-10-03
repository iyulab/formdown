import { css } from 'lit'

/**
 * Formdown UI Styles
 *
 * Theming is through CSS custom properties named --formdown-*. Each one is read where it is
 * used, with its default beside it, so it can be set on the element or on any ancestor:
 *
 * @example
 * ```css
 * :root {
 *   --formdown-accent-color: #8b5cf6;
 *   --formdown-input-border-radius: 12px;
 * }
 * ```
 */
export const formdownStyles = css`
  :host {
    display: block;
    font-family: var(--formdown-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    line-height: var(--formdown-line-height, 1.5);
    color: var(--formdown-text-primary, #1f2937);
    background: var(--formdown-bg-primary, #ffffff);
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
    margin-bottom: var(--formdown-field-gap, 1.5rem);
    max-width: 100%;
  }

  .formdown-field-container {
    margin-bottom: var(--formdown-spacing-md, 1rem);
  }

  .formdown-field-container:last-child {
    margin-bottom: 0;
  }

  /* ========================================
   * Labels
   * ======================================== */
  label {
    display: block;
    margin-bottom: var(--formdown-label-margin, 0.5rem);
    font-weight: var(--formdown-font-weight-medium, 500);
    color: var(--formdown-text-primary, #1f2937);
    font-size: var(--formdown-font-size-sm, 0.875rem);
    line-height: 1.25;
  }

  /* ========================================
   * Input Elements
   * ======================================== */
  input, textarea, select {
    width: 100%;
    max-width: 100%;
    padding: var(--formdown-input-padding-y, 0.75rem) var(--formdown-input-padding-x, 0.75rem);
    border: var(--formdown-input-border-width, 1px) solid var(--formdown-border-color, #e2e8f0);
    border-radius: var(--formdown-input-border-radius, 0.5rem);
    font-size: var(--formdown-font-size-base, 1rem);
    font-family: inherit;
    line-height: var(--formdown-line-height, 1.5);
    transition: all var(--formdown-transition-fast, 0.15s ease-in-out);
    background-color: var(--formdown-bg-primary, #ffffff);
    color: var(--formdown-text-primary, #1f2937);
  }

  input::placeholder, textarea::placeholder {
    color: var(--formdown-text-secondary, #64748b);
    font-style: italic;
    opacity: 0.8;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--formdown-accent-color, #3b82f6);
    box-shadow: var(--formdown-input-focus-ring, 0 0 0 var(--formdown-input-focus-ring-width, 3px) var(--formdown-input-focus-ring-color, rgba(59, 130, 246, 0.1)));
    background-color: var(--formdown-bg-primary, #ffffff);
  }

  input:hover, textarea:hover, select:hover {
    border-color: var(--formdown-text-secondary, #64748b);
  }

  input[type="radio"], input[type="checkbox"] {
    accent-color: var(--formdown-accent-color, #3b82f6);
    width: auto;
    max-width: none;
    margin-right: var(--formdown-spacing-sm, 0.5rem);
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
    border: var(--formdown-section-border-width, 1px) solid var(--formdown-section-border-color, var(--formdown-border-color, #e2e8f0));
    border-radius: var(--formdown-section-border-radius, 0.5rem);
    padding: var(--formdown-section-padding, 1.25rem);
    margin: 0 0 var(--formdown-field-gap, 1.5rem) 0;
    max-width: 100%;
    background-color: var(--formdown-section-bg, var(--formdown-bg-primary, #ffffff));
  }

  legend {
    font-weight: var(--formdown-font-weight-semibold, 600);
    color: var(--formdown-text-primary, #1f2937);
    padding: 0 var(--formdown-spacing-md, 1rem);
    font-size: var(--formdown-font-size-sm, 0.875rem);
  }

  fieldset label {
    display: flex;
    align-items: center;
    margin-bottom: var(--formdown-spacing-md, 1rem);
    font-weight: var(--formdown-font-weight-normal, 400);
    font-size: var(--formdown-font-size-sm, 0.875rem);
  }

  /* ========================================
   * Inline Fields (contentEditable)
   * ======================================== */
  formdown-field,
  [contenteditable="true"]:not(textarea) {
    display: inline-block;
    box-sizing: border-box;
    min-width: 60px;
    /* Grow with the value; only a value wider than the line is cut short. */
    max-width: 100%;
    font-style: normal;
    color: inherit;
    font-size: inherit;
    line-height: var(--formdown-line-height, 1.5);
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
    color: var(--formdown-text-secondary, #64748b);
    font-style: italic;
    font-weight: var(--formdown-font-weight-normal, 400);
    opacity: 0.7;
    pointer-events: none;
    user-select: none;
  }

  [contenteditable="true"]:not(textarea) {
    border: 1px solid var(--formdown-border-color, #e2e8f0);
    background-color: var(--formdown-bg-secondary, #f8fafc);
    border-radius: 0.25rem;
    padding: 0.125rem 0.5rem;
    transition: all var(--formdown-transition-normal, 0.2s ease-in-out);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    position: relative;
    min-height: 1.5em;
  }

  [contenteditable="true"]:not(textarea):hover {
    background-color: var(--formdown-bg-secondary, #f8fafc);
    border-color: var(--formdown-text-secondary, #64748b);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  [contenteditable="true"]:not(textarea):focus {
    background-color: var(--formdown-bg-primary, #ffffff);
    border-color: var(--formdown-accent-color, #3b82f6);
    box-shadow: var(--formdown-input-focus-ring, 0 0 0 var(--formdown-input-focus-ring-width, 3px) var(--formdown-input-focus-ring-color, rgba(59, 130, 246, 0.1)));
    color: var(--formdown-text-primary, #1f2937);
    transform: translateY(-1px);
  }

  [contenteditable="true"]:not(textarea):not(:empty) {
    background-color: var(--formdown-bg-primary, #ffffff);
    border-color: var(--formdown-border-color, #e2e8f0);
    font-weight: var(--formdown-font-weight-normal, 400);
  }

  /* ========================================
   * Field states (fieldStates): offered values and notes
   * ======================================== */
  .formdown-ghost::placeholder,
  [contenteditable="true"].formdown-ghost:empty::before {
    color: var(--formdown-ghost-color, var(--formdown-text-secondary, #64748b));
    font-style: normal;
  }

  .formdown-field-note {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--formdown-spacing-xs, 0.25rem);
    margin-top: var(--formdown-spacing-xs, 0.25rem);
    font-size: var(--formdown-font-size-sm, 0.875rem);
    color: var(--formdown-note-color, var(--formdown-text-secondary, #64748b));
  }

  span.formdown-field-note {
    display: inline-flex;
    margin: 0 0 0 var(--formdown-spacing-sm, 0.5rem);
    vertical-align: middle;
  }

  /* Plain chips, clear of the form's button styling. */
  .formdown-field-note button.formdown-suggestion {
    margin: 0;
    padding: 0 var(--formdown-spacing-sm, 0.5rem);
    border: 1px dashed var(--formdown-suggestion-border-color, var(--formdown-accent-color, #3b82f6));
    border-radius: var(--formdown-input-border-radius, 0.5rem);
    background: var(--formdown-suggestion-bg, transparent);
    box-shadow: none;
    color: var(--formdown-text-primary, #1f2937);
    font-size: inherit;
    font-weight: var(--formdown-font-weight-normal, 400);
    letter-spacing: normal;
    line-height: var(--formdown-line-height, 1.5);
    transform: none;
  }

  .formdown-field-note button.formdown-suggestion::before {
    display: none;
  }

  .formdown-field-note button.formdown-suggestion:hover {
    background: var(--formdown-bg-secondary, #f8fafc);
    transform: none;
  }

  .formdown-field-note button.formdown-suggestion:focus-visible {
    outline: 2px solid var(--formdown-accent-color, #3b82f6);
    outline-offset: 1px;
  }

  /* A quiet text button: declining is not the offered action. */
  .formdown-field-note button.formdown-decline {
    margin: 0;
    padding: 0 var(--formdown-spacing-xs, 0.25rem);
    border: none;
    background: transparent;
    box-shadow: none;
    color: var(--formdown-note-color, var(--formdown-text-secondary, #64748b));
    font-size: inherit;
    font-weight: var(--formdown-font-weight-normal, 400);
    letter-spacing: normal;
    line-height: var(--formdown-line-height, 1.5);
    text-decoration: underline;
    transform: none;
  }

  .formdown-field-note button.formdown-decline::before {
    display: none;
  }

  .formdown-field-note button.formdown-decline:hover {
    color: var(--formdown-text-primary, #1f2937);
    background: transparent;
    transform: none;
  }

  .formdown-field-note button.formdown-decline:focus-visible {
    outline: 2px solid var(--formdown-accent-color, #3b82f6);
    outline-offset: 1px;
  }

  label.formdown-suggested {
    outline: 1px dashed var(--formdown-suggestion-border-color, var(--formdown-accent-color, #3b82f6));
    outline-offset: 2px;
    border-radius: var(--formdown-input-border-radius, 0.5rem);
  }

  /* ========================================
   * Typography (Markdown Content)
   * ======================================== */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: var(--formdown-spacing-md, 1rem);
    color: var(--formdown-text-primary, #1f2937);
    font-weight: var(--formdown-font-weight-semibold, 600);
    line-height: 1.25;
  }

  h1 { font-size: 2.25rem; font-weight: var(--formdown-font-weight-bold, 700); }
  h2 { font-size: 1.875rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  h5 { font-size: 1.125rem; }
  h6 { font-size: 1rem; }

  p {
    margin-bottom: var(--formdown-spacing-md, 1rem);
    line-height: 1.7;
    color: var(--formdown-text-secondary, #64748b);
  }

  /* ========================================
   * Code Blocks
   * ======================================== */
  pre {
    background-color: var(--formdown-code-bg, var(--formdown-bg-secondary, #f8fafc));
    border: 1px solid var(--formdown-border-color, #e2e8f0);
    border-radius: var(--formdown-code-border-radius, 0.375rem);
    padding: var(--formdown-spacing-md, 1rem);
    margin: var(--formdown-spacing-md, 1rem) 0;
    overflow-x: auto;
    font-family: var(--formdown-code-font-family, 'Monaco', 'Menlo', 'Ubuntu Mono', monospace);
    font-size: var(--formdown-font-size-sm, 0.875rem);
    line-height: 1.6;
  }

  code {
    font-family: var(--formdown-code-font-family, 'Monaco', 'Menlo', 'Ubuntu Mono', monospace);
    font-size: var(--formdown-code-font-size, 0.875em);
    background-color: rgba(175, 184, 193, 0.2);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    color: var(--formdown-text-primary, #1f2937);
  }

  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: var(--formdown-font-size-sm, 0.875rem);
    color: var(--formdown-text-primary, #1f2937);
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
      font-size: var(--formdown-font-size-sm, 0.875rem);
    }

    input, textarea, select {
      padding: 0.625rem;
      font-size: var(--formdown-font-size-sm, 0.875rem);
    }

    h1 { font-size: 1.875rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
  }

  /* ========================================
   * Validation States
   * ======================================== */
  .error {
    color: var(--formdown-error-color, #ef4444);
    font-size: var(--formdown-font-size-sm, 0.875rem);
    margin-top: var(--formdown-spacing-sm, 0.5rem);
    display: block;
  }

  .field-error {
    border-color: var(--formdown-error-color, #ef4444) !important;
    box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.1) !important;
  }

  .field-error:focus {
    border-color: var(--formdown-error-color, #ef4444) !important;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
  }

  .validation-error-message {
    color: var(--formdown-error-color, #ef4444);
    font-size: var(--formdown-font-size-xs, 0.75rem);
    margin-top: var(--formdown-spacing-xs, 0.25rem);
    display: block;
    font-weight: var(--formdown-font-weight-medium, 500);
  }

  .field-valid {
    border-color: var(--formdown-success-color, #10b981) !important;
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
    color: var(--formdown-button-text, #ffffff);
    padding: var(--formdown-button-padding-y, 0.75rem) var(--formdown-button-padding-x, 1.75rem);
    border: none;
    border-radius: var(--formdown-button-border-radius, 0.5rem);
    font-size: var(--formdown-font-size-base, 1rem);
    font-weight: var(--formdown-button-font-weight, 600);
    cursor: pointer;
    transition: all var(--formdown-transition-normal, 0.2s ease-in-out);
    margin-top: var(--formdown-field-gap, 1.5rem);
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
    background: var(--formdown-button-bg, linear-gradient(135deg, #3b82f6 0%, #2563eb 100%));
    box-shadow: var(--formdown-button-shadow, 0 2px 4px rgba(59, 130, 246, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05));
  }

  .submit-button:hover,
  button[type="submit"]:hover,
  input[type="submit"]:hover,
  button:not([type]):hover {
    background: var(--formdown-button-bg-hover, linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%));
    box-shadow: var(--formdown-button-shadow-hover, 0 6px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1));
  }

  .submit-button:active,
  button[type="submit"]:active,
  input[type="submit"]:active,
  button:not([type]):active {
    box-shadow: var(--formdown-button-shadow, 0 2px 4px rgba(59, 130, 246, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05));
  }

  /* Secondary Button */
  button[type="button"],
  input[type="button"] {
    background: var(--formdown-button-secondary-bg, linear-gradient(135deg, #64748b 0%, #475569 100%));
    box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button[type="button"]:hover,
  input[type="button"]:hover {
    background: var(--formdown-button-secondary-bg-hover, linear-gradient(135deg, #475569 0%, #334155 100%));
    box-shadow: 0 6px 12px rgba(100, 116, 139, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button[type="button"]:active,
  input[type="button"]:active {
    box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Danger Button (reset) */
  button[type="reset"],
  input[type="reset"] {
    background: var(--formdown-button-danger-bg, linear-gradient(135deg, #ef4444 0%, #dc2626 100%));
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button[type="reset"]:hover,
  input[type="reset"]:hover {
    background: var(--formdown-button-danger-bg-hover, linear-gradient(135deg, #dc2626 0%, #b91c1c 100%));
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
    gap: var(--formdown-spacing-md, 1rem);
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
    font-weight: var(--formdown-font-weight-normal, 400);
    cursor: pointer;
    font-size: var(--formdown-font-size-sm, 0.875rem);
    white-space: nowrap;
  }

  .formdown-option-label input {
    margin-right: var(--formdown-spacing-sm, 0.5rem);
    margin-bottom: 0;
  }

  .formdown-option-label span {
    user-select: none;
  }

  /* A value from the data the field could not take (unread.ts): shown as written, beside the empty field. */
  .formdown-unread {
    margin-left: var(--formdown-spacing-sm, 0.5rem);
    color: var(--formdown-text-primary, #1f2937);
    text-decoration: underline dashed var(--formdown-warning-color, #f59e0b);
    text-underline-offset: 0.2em;
    font-size: var(--formdown-font-size-sm, 0.875rem);
    white-space: pre-wrap;
  }

  .radio-group label, .checkbox-group label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    font-weight: var(--formdown-font-weight-normal, 400);
    cursor: pointer;
  }

  .formdown-form > * + * {
    margin-top: var(--formdown-spacing-md, 1rem);
  }

  /* ========================================
   * Table Styles (GitHub Flavored Markdown)
   * ======================================== */
  .formdown-table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--formdown-table-margin, 1rem 0);
    background-color: var(--formdown-table-bg, var(--formdown-bg-primary, #ffffff));
    border: var(--formdown-table-border-width, 1px) solid var(--formdown-table-border-color, var(--formdown-border-color, #e2e8f0));
    border-radius: var(--formdown-table-border-radius, 6px);
    overflow: hidden;
    font-size: var(--formdown-table-font-size, 0.875rem);
  }

  .formdown-table thead {
    background-color: var(--formdown-table-header-bg, var(--formdown-bg-secondary, #f8fafc));
    border-bottom: var(--formdown-table-border-width, 1px) solid var(--formdown-table-border-color, var(--formdown-border-color, #e2e8f0));
  }

  .formdown-table th {
    padding: var(--formdown-table-cell-padding, 0.5rem 1rem);
    text-align: left;
    font-weight: var(--formdown-table-header-weight, 600);
    font-size: inherit;
    color: var(--formdown-table-header-color, var(--formdown-text-primary, #1f2937));
    border-right: var(--formdown-table-border-width, 1px) solid var(--formdown-table-border-color, var(--formdown-border-color, #e2e8f0));
  }

  .formdown-table th:last-child {
    border-right: none;
  }

  .formdown-table td {
    padding: var(--formdown-table-cell-padding, 0.5rem 1rem);
    border-top: var(--formdown-table-border-width, 1px) solid var(--formdown-table-border-color, var(--formdown-border-color, #e2e8f0));
    border-right: var(--formdown-table-border-width, 1px) solid var(--formdown-table-border-color, var(--formdown-border-color, #e2e8f0));
    color: var(--formdown-text-secondary, #64748b);
    line-height: var(--formdown-line-height, 1.5);
  }

  .formdown-table td:last-child {
    border-right: none;
  }

  .formdown-table tbody tr {
    transition: background-color var(--formdown-transition-fast, 0.15s ease-in-out);
  }

  .formdown-table tbody tr:hover {
    background-color: var(--formdown-table-row-hover-bg, var(--formdown-bg-secondary, #f8fafc));
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
