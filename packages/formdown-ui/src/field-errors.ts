import type { FieldError } from '@formdown/core'

/**
 * What a validation found, drawn by the fields it found it in: the sentences under the field, the
 * field marked invalid and pointing at them (`aria-invalid`, `aria-describedby`), so a screen reader
 * says why as the person reaches it.
 */

const ERROR_FOR = 'data-formdown-error-for'
const DESCRIBED = 'data-formdown-described-by'
const INVALID = 'field-error'

/** The elements that make up a field: one control, or every option of a radio or checkbox group. */
function fieldElements(container: ParentNode, name: string): HTMLElement[] {
  // Compared as attributes, not built into a selector: a field name can hold any character.
  const named = Array.from(container.querySelectorAll<HTMLElement>('[name]')).filter((el) => el.getAttribute('name') === name)
  if (named.length > 0) return named
  const inline = Array.from(container.querySelectorAll<HTMLElement>('[data-field-name]')).find((el) => el.dataset.fieldName === name)
  return inline ? [inline] : []
}

function isInline(el: HTMLElement): boolean {
  return el.isContentEditable || el.getAttribute('contenteditable') === 'true'
}

/** Groups errors by field, keeping each field's sentences in the order found. */
export function errorsByField(errors: FieldError[]): Map<string, string[]> {
  const byField = new Map<string, string[]>()
  for (const { field, message } of errors) {
    const said = byField.get(field) ?? []
    if (!said.includes(message)) said.push(message)
    byField.set(field, said)
  }
  return byField
}

/** Takes away what {@link showFieldError} drew for `name`, or for every field when no name is given. */
export function clearFieldErrors(container: ParentNode, name?: string) {
  for (const message of Array.from(container.querySelectorAll<HTMLElement>(`[${ERROR_FOR}]`))) {
    if (name === undefined || message.getAttribute(ERROR_FOR) === name) message.remove()
  }
  const marked = Array.from(container.querySelectorAll<HTMLElement>(`[${DESCRIBED}]`))
  for (const el of marked) {
    if (name !== undefined && (el.getAttribute('name') ?? el.dataset.fieldName) !== name) continue
    const before = el.getAttribute(DESCRIBED)!
    if (before) el.setAttribute('aria-describedby', before)
    else el.removeAttribute('aria-describedby')
    el.removeAttribute(DESCRIBED)
    el.removeAttribute('aria-invalid')
    el.classList.remove(INVALID)
    if (el.classList.length === 0) el.removeAttribute('class')
  }
}

/** Draws `messages` for the field `name`, in place of what was drawn for it before. */
export function showFieldError(container: ParentNode, name: string, messages: string[]) {
  clearFieldErrors(container, name)
  const elements = fieldElements(container, name)
  const first = elements[0]
  if (!first || messages.length === 0) return

  const inline = isInline(first)
  const message = first.ownerDocument.createElement(inline ? 'span' : 'div')
  message.className = 'validation-error-message'
  message.setAttribute('part', 'field-error')
  message.setAttribute(ERROR_FOR, name)
  message.id = `${first.id || `formdown-${name}`}-validation`
  message.textContent = messages.join('\n')

  for (const el of elements) {
    el.setAttribute(DESCRIBED, el.getAttribute('aria-describedby') ?? '')
    el.setAttribute('aria-describedby', [el.getAttribute('aria-describedby'), message.id].filter(Boolean).join(' '))
    el.setAttribute('aria-invalid', 'true')
    el.classList.add(INVALID)
  }

  if (inline) first.after(message)
  else (first.closest('.formdown-field') ?? first.parentElement ?? first).append(message)
}

/** Draws every field's errors, taking away what was drawn for fields that no longer have any. */
export function showFieldErrors(container: ParentNode, errors: Map<string, string[]>) {
  clearFieldErrors(container)
  for (const [name, messages] of errors) showFieldError(container, name, messages)
}
