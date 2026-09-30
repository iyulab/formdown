import { conditionState, type ConditionalAttributes } from '@formdown/core'

/** What a field's schema says about it that conditions act on. */
export interface ConditionalField {
  conditions?: ConditionalAttributes
  required?: boolean
}

/**
 * Shows or hides, enables or disables, and requires each field with conditions, for the form's current
 * values. A field is hidden with its whole block (label and help included); an inline field alone. Values
 * are left as they are: hiding or disabling a field is not clearing it — whoever holds the values decides.
 */
export function applyConditions(
  container: ParentNode,
  schema: Record<string, ConditionalField>,
  data: Record<string, unknown>,
): void {
  for (const [name, field] of Object.entries(schema)) {
    if (!field.conditions) continue
    const state = conditionState(field.conditions, data)
    const elements = Array.from(container.querySelectorAll<HTMLElement>('input, select, textarea, [data-field-name]')).filter(
      (el) => (el.getAttribute('name') ?? el.getAttribute('data-field-name')) === name,
    )
    for (const element of elements) {
      const block = element.closest<HTMLElement>('.formdown-field') ?? element
      block.hidden = !state.visible
      const required = Boolean(field.required) || state.required
      if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
        element.disabled = !state.enabled
        // A radio or checkbox group is required as a whole: the generator marks only its first option.
        if (!(element instanceof HTMLInputElement && (element.type === 'radio' || element.type === 'checkbox'))) element.required = required
      } else {
        element.setAttribute('contenteditable', state.enabled ? 'true' : 'false')
      }
      element.setAttribute('aria-disabled', String(!state.enabled))
      element.setAttribute('aria-required', String(required))
    }
  }
}
