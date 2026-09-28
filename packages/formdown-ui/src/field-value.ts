/**
 * Whether a value checks a single checkbox. Front matter and form data carry it as a boolean,
 * and text sources as "true"/"false" — the same reading the core generator uses when it renders.
 */
export function isCheckedValue(value: unknown): boolean {
  return value === true || (typeof value === 'string' && value.toLowerCase() === 'true')
}

/** Shows `value` in one field element. A radio or checkbox-group option checks itself when the value names it. */
export function applyFieldValue(element: HTMLElement, value: unknown, fieldType: string): void {
  if (element instanceof HTMLInputElement) {
    if (fieldType === 'checkbox' || element.type === 'checkbox') {
      // A single checkbox carries value "true"; a group option carries its option text.
      if (Array.isArray(value)) element.checked = value.map(String).includes(element.value)
      else if (element.value === 'true') element.checked = isCheckedValue(value)
      else element.checked = value !== undefined && value !== null && String(value) === element.value
    } else if (fieldType === 'radio' || element.type === 'radio') {
      element.checked = value !== undefined && value !== null && element.value === String(value)
    } else {
      element.value = String(value ?? '')
    }
  } else if (element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    element.value = String(value ?? '')
  } else if (element.hasAttribute('contenteditable')) {
    element.textContent = String(value ?? '')
  }
}
