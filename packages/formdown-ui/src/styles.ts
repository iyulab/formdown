import { css } from 'lit'

export const formdownStyles = css`
  :host {
    display: block;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    color: var(--theme-text-primary, #1f2937);
    background: var(--theme-bg-primary, #ffffff);
    max-width: 100%;
    box-sizing: border-box;
    overflow-y: auto;
  }

  * {
    box-sizing: border-box;
  }

  .formdown-form {
    max-width: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    display: none; /* Hidden form for form attribute reference */
  }

  .formdown-field {
    margin-bottom: 1.5rem;
    max-width: 100%;
  }

  /* Add spacing between consecutive field containers */
  .formdown-field-container {
    margin-bottom: 0.75rem;
  }

  .formdown-field-container:last-child {
    margin-bottom: 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--theme-text-primary, #374151);
    font-size: 0.875rem;
    line-height: 1.25;
  }

  input, textarea, select {
    width: 100%;
    max-width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--theme-border, #d1d5db);
    border-radius: 0.5rem;
    font-size: 1rem;
    font-family: inherit;
    line-height: 1.5;
    transition: all 0.15s ease-in-out;
    background-color: var(--theme-bg-primary, #ffffff);
    color: var(--theme-text-primary, #1f2937);
  }

  /* Placeholder styling for all input types */
  input::placeholder, textarea::placeholder {
    color: var(--theme-text-secondary, #94a3b8);
    font-style: italic;
    opacity: 0.8;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--theme-accent, #3b82f6);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background-color: var(--theme-bg-primary, #ffffff);
  }

  input:hover, textarea:hover, select:hover {
    border-color: var(--theme-text-secondary, #9ca3af);
  }

  input[type="radio"], input[type="checkbox"] {
    width: auto;
    max-width: none;
    margin-right: 0.5rem;
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

  fieldset {
    border: 1px solid var(--theme-border, #d1d5db);
    border-radius: 0.5rem;
    padding: 1.25rem;
    margin: 0 0 1.5rem 0;
    max-width: 100%;
    background-color: var(--theme-bg-primary, #ffffff);
  }

  legend {
    font-weight: 600;
    color: var(--theme-text-primary, #374151);
    padding: 0 0.75rem;
    font-size: 0.875rem;
  }

  fieldset label {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    font-weight: normal;
    font-size: 0.875rem;
  }

  /* Enhanced inline formdown-field elements with contentEditable */
  formdown-field,
  [contenteditable="true"]:not(textarea) {
    display: inline-block;
    min-width: 60px;
    max-width: 200px;
    font-style: normal;
    color: inherit;
    font-size: inherit;
    line-height: 1.5;
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

  /* Placeholder for inline contenteditable fields */
  [contenteditable="true"]:not(textarea):empty::before {
    content: attr(data-placeholder);
    color: var(--theme-text-secondary, #94a3b8);
    font-style: italic;
    font-weight: normal;
    opacity: 0.7;
    pointer-events: none;
    user-select: none;
  }

  /* Enhanced visual styling for inline fields */
  [contenteditable="true"]:not(textarea) {
    border: 1px solid var(--theme-border, rgba(209, 213, 219, 0.6));
    background-color: var(--theme-bg-secondary, rgba(248, 250, 252, 0.8));
    border-radius: 0.25rem;
    padding: 0.125rem 0.5rem;
    transition: all 0.2s ease-in-out;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    position: relative;
    min-height: 1.5em;
  }

  [contenteditable="true"]:not(textarea):hover {
    background-color: var(--theme-bg-secondary, rgba(241, 245, 249, 0.9));
    border-color: var(--theme-border, rgba(156, 163, 175, 0.8));
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }

  [contenteditable="true"]:not(textarea):focus {
    background-color: var(--theme-bg-primary, #ffffff);
    border-color: var(--theme-accent, #3b82f6);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2), 0 2px 8px rgba(0, 0, 0, 0.15);
    color: var(--theme-text-primary, #1f2937);
    transform: translateY(-1px);
  }

  /* Better visual distinction when field has content */
  [contenteditable="true"]:not(textarea):not(:empty) {
    background-color: var(--theme-bg-primary, #ffffff);
    border-color: var(--theme-border, rgba(156, 163, 175, 0.9));
    font-weight: normal;
  }

  /* Enhanced typography for markdown content */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--theme-text-primary, #1f2937);
    font-weight: 600;
    line-height: 1.25;
  }

  h1 {
    font-size: 2.25rem;
    font-weight: 700;
  }
  h2 {
    font-size: 1.875rem;
    font-weight: 600;
  }
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
  }
  h4 {
    font-size: 1.25rem;
    font-weight: 600;
  }
  h5 {
    font-size: 1.125rem;
    font-weight: 600;
  }
  h6 {
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.7;
    color: var(--theme-text-secondary, #4b5563);
  }

  /* Code blocks */
  pre {
    background-color: var(--theme-bg-secondary, #f6f8fa);
    border: 1px solid var(--theme-border, #d0d7de);
    border-radius: 0.375rem;
    padding: 1rem;
    margin: 1rem 0;
    overflow-x: auto;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  code {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875em;
    background-color: var(--theme-bg-secondary, rgba(175, 184, 193, 0.2));
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    color: var(--theme-text-primary, #1f2937);
  }

  pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: 0.875rem;
    color: var(--theme-text-primary, #24292f);
  }

  /* Syntax highlighting support (basic) */
  .language-javascript, .language-js,
  .language-typescript, .language-ts,
  .language-python, .language-py,
  .language-html, .language-css,
  .language-json, .language-bash {
    display: block;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    :host {
      font-size: 0.875rem;
    }

    input, textarea, select {
      padding: 0.625rem;
      font-size: 0.875rem;
    }

    h1 { font-size: 1.875rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
  }

  .error {
    color: var(--theme-error, #dc2626);
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: block;
  }

  /* Field validation styles */
  .field-error {
    border-color: var(--theme-error, #dc2626) !important;
    box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.1) !important;
  }

  .field-error:focus {
    border-color: var(--theme-error, #dc2626) !important;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
  }

  .validation-error-message {
    color: var(--theme-error, #dc2626);
    font-size: 0.75rem;
    margin-top: 0.25rem;
    display: block;
    font-weight: 500;
  }

  /* Success state */
  .field-valid {
    border-color: #10b981 !important;
    box-shadow: 0 0 0 1px rgba(16, 185, 129, 0.1) !important;
  }

  /* Base button styles - all buttons */
  .submit-button,
  button,
  input[type="submit"],
  input[type="button"],
  input[type="reset"] {
    color: white;
    padding: 0.75rem 1.75rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    margin-top: 1.5rem;
    width: auto;
    max-width: 100%;
    letter-spacing: 0.025em;
    position: relative;
    overflow: hidden;
    font-family: inherit;
  }

  /* Shine effect for all buttons */
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

  /* Hover shine effect */
  .submit-button:hover::before,
  button:hover::before,
  input[type="submit"]:hover::before,
  input[type="button"]:hover::before,
  input[type="reset"]:hover::before {
    left: 100%;
  }

  /* Common hover state */
  .submit-button:hover,
  button:hover,
  input[type="submit"]:hover,
  input[type="button"]:hover,
  input[type="reset"]:hover {
    transform: translateY(-2px);
  }

  /* Common active state */
  .submit-button:active,
  button:active,
  input[type="submit"]:active,
  input[type="button"]:active,
  input[type="reset"]:active {
    transform: translateY(0);
  }

  /* Common disabled state */
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

  /* Primary button (submit) - Blue */
  .submit-button,
  button[type="submit"],
  input[type="submit"],
  button:not([type]) {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .submit-button:hover,
  button[type="submit"]:hover,
  input[type="submit"]:hover,
  button:not([type]):hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .submit-button:active,
  button[type="submit"]:active,
  input[type="submit"]:active,
  button:not([type]):active {
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Secondary button - Slate */
  button[type="button"],
  input[type="button"] {
    background: linear-gradient(135deg, #64748b 0%, #475569 100%);
    box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button[type="button"]:hover,
  input[type="button"]:hover {
    background: linear-gradient(135deg, #475569 0%, #334155 100%);
    box-shadow: 0 6px 12px rgba(100, 116, 139, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button[type="button"]:active,
  input[type="button"]:active {
    box-shadow: 0 2px 4px rgba(100, 116, 139, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Danger button (reset) - Red */
  button[type="reset"],
  input[type="reset"] {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  button[type="reset"]:hover,
  input[type="reset"]:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    box-shadow: 0 6px 12px rgba(239, 68, 68, 0.3), 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button[type="reset"]:active,
  input[type="reset"]:active {
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* Ensure content doesn't overflow */
  #content-container {
    max-width: 100%;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  /* Radio and checkbox groups */
  .radio-group, .checkbox-group {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  /* Inline layout (default) */
  .radio-group.inline, .checkbox-group.inline {
    flex-direction: row;
    align-items: center;
  }

  /* Vertical layout */
  .radio-group.vertical, .checkbox-group.vertical {
    flex-direction: column;
    align-items: flex-start;
  }

  .formdown-option-label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    font-weight: normal;
    cursor: pointer;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .formdown-option-label input {
    margin-right: 0.5rem;
    margin-bottom: 0;
  }

  .formdown-option-label span {
    user-select: none;
  }

  /* Legacy support for old structure */
  .radio-group label, .checkbox-group label {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    font-weight: normal;
    cursor: pointer;
  }

  /* Better spacing for form elements */
  .formdown-form > * + * {
    margin-top: 1rem;
  }

  /* Table styles - GitHub Flavored Markdown standard */
  .formdown-table {
    width: 100%;
    border-collapse: collapse;
    margin: var(--formdown-table-margin, 1rem 0);
    background-color: var(--formdown-table-bg, var(--theme-bg-primary, #ffffff));
    border: var(--formdown-table-border-width, 1px) solid var(--formdown-table-border-color, var(--theme-border, #d0d7de));
    border-radius: var(--formdown-table-border-radius, 6px);
    overflow: hidden;
    font-size: var(--formdown-table-font-size, 0.875rem);
  }

  .formdown-table thead {
    background-color: var(--formdown-table-header-bg, var(--theme-bg-secondary, #f6f8fa));
    border-bottom: var(--formdown-table-header-border-width, 1px) solid var(--formdown-table-border-color, var(--theme-border, #d0d7de));
  }

  .formdown-table th {
    padding: var(--formdown-table-cell-padding, 0.5rem 1rem);
    text-align: var(--formdown-table-header-align, left);
    font-weight: var(--formdown-table-header-weight, 600);
    font-size: var(--formdown-table-header-font-size, inherit);
    color: var(--formdown-table-header-color, var(--theme-text-primary, #1f2328));
    border-right: var(--formdown-table-cell-border-width, 1px) solid var(--formdown-table-border-color, var(--theme-border, #d0d7de));
  }

  .formdown-table th:last-child {
    border-right: none;
  }

  .formdown-table td {
    padding: var(--formdown-table-cell-padding, 0.5rem 1rem);
    border-top: var(--formdown-table-cell-border-width, 1px) solid var(--formdown-table-border-color, var(--theme-border, #d0d7de));
    border-right: var(--formdown-table-cell-border-width, 1px) solid var(--formdown-table-border-color, var(--theme-border, #d0d7de));
    color: var(--formdown-table-cell-color, var(--theme-text-secondary, #656d76));
    line-height: 1.5;
  }

  .formdown-table td:last-child {
    border-right: none;
  }

  .formdown-table tbody tr {
    transition: background-color var(--formdown-table-transition, 0.1s ease);
  }

  .formdown-table tbody tr:hover {
    background-color: var(--formdown-table-row-hover-bg, var(--theme-bg-secondary, #f6f8fa));
  }

  .formdown-table tbody tr:last-child td {
    border-bottom: none;
  }

  /* Inline fields within table cells */
  .formdown-table td [contenteditable="true"] {
    min-width: var(--formdown-table-inline-field-min-width, 80px);
    max-width: 100%;
    display: inline-block;
  }

  /* Responsive table on mobile */
  @media (max-width: 768px) {
    .formdown-table {
      font-size: var(--formdown-table-font-size-mobile, 0.8125rem);
      border-radius: var(--formdown-table-border-radius-mobile, 4px);
    }

    .formdown-table th,
    .formdown-table td {
      padding: var(--formdown-table-cell-padding-mobile, 0.375rem 0.75rem);
    }
  }
`