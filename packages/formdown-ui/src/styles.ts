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
    display: inline;
    min-width: 60px;
    max-width: 200px;
    padding: 0.125rem 0.25rem;
    border: 1px solid transparent;
    background-color: var(--theme-bg-secondary, rgba(239, 246, 255, 0.6));
    border-radius: 0.125rem;
    font-style: normal;
    color: inherit;
    font-size: inherit;
    line-height: inherit;
    font-family: inherit;
    font-weight: inherit;
    cursor: text;
    outline: none;
    transition: all 0.15s ease-in-out;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: baseline;
    box-decoration-break: clone;
  }

  [contenteditable="true"]:not(textarea):hover {
    background-color: var(--theme-bg-secondary, rgba(219, 234, 254, 0.8));
    border-color: var(--theme-border, rgba(147, 197, 253, 0.5));
  }

  [contenteditable="true"]:not(textarea):focus {
    background-color: var(--theme-bg-primary, rgba(255, 255, 255, 0.9));
    border-color: var(--theme-accent, #3b82f6);
    box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
    color: var(--theme-accent, #1e40af);
  }

  [contenteditable="true"]:not(textarea):empty::before {
    content: attr(data-placeholder);
    color: var(--theme-text-secondary, #94a3b8);
    font-style: italic;
    opacity: 0.7;
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

  .submit-button {
    background-color: #3b82f6;
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease-in-out;
    margin-top: 1.5rem;
    width: auto;
    max-width: 100%;
  }

  .submit-button:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .submit-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .submit-button:active {
    transform: translateY(0);
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
`