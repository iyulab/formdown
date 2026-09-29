/**
 * What the host says about a field, drawn by the field: values it offers and a short note.
 *
 * The component only shows them. Picking an offered value is reported (`onPick`); putting it into
 * the field is the host's decision, so the host stays the one place a value comes from.
 */
export interface FieldState {
  /**
   * Values offered for the field, most likely first. The first shows in the empty field in place of
   * its placeholder; each is listed by the field as a button that picks it.
   */
  suggestions?: string[]
  /** A short note shown by the field — where the suggestion comes from, or why there is none. */
  note?: string
}

export type FieldStates = Record<string, FieldState>

const NOTE = 'data-formdown-note'
const SAVED_PLACEHOLDER = 'data-formdown-placeholder'
const GHOST = 'formdown-ghost'
const SUGGESTED = 'formdown-suggested'

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

/** An input one types into, or a textarea — the fields a placeholder shows in. */
function takesPlaceholder(el: HTMLElement): boolean {
  if (el instanceof HTMLTextAreaElement) return true
  return el instanceof HTMLInputElement && !['radio', 'checkbox', 'hidden', 'file', 'range', 'color', 'submit', 'button', 'reset'].includes(el.type)
}

function unmark(el: Element, className: string) {
  el.classList.remove(className)
  if (el.classList.length === 0) el.removeAttribute('class')
}

/** Shows `value` in the empty field in place of its placeholder, keeping the placeholder to restore. */
function showGhost(el: HTMLElement, value: string) {
  const attribute = isInline(el) ? 'data-placeholder' : takesPlaceholder(el) ? 'placeholder' : null
  if (!attribute) return // a select or a choice group has no placeholder: the listed values say it
  if (!el.hasAttribute(SAVED_PLACEHOLDER)) el.setAttribute(SAVED_PLACEHOLDER, el.getAttribute(attribute) ?? '')
  el.setAttribute(attribute, value)
  el.classList.add(GHOST)
}

function noteElement(doc: Document, name: string, state: FieldState, inline: boolean, onPick: (field: string, value: string) => void) {
  const suggestions = state.suggestions ?? []
  if (!state.note && suggestions.length === 0) return undefined
  const note = doc.createElement(inline ? 'span' : 'div')
  note.className = 'formdown-field-note'
  note.setAttribute('part', 'field-note')
  note.setAttribute(NOTE, name)
  if (state.note) {
    const text = doc.createElement('span')
    text.className = 'formdown-field-note-text'
    text.textContent = state.note
    note.append(text)
  }
  for (const value of suggestions) {
    const button = doc.createElement('button')
    button.type = 'button'
    button.className = 'formdown-suggestion'
    button.setAttribute('part', 'suggestion')
    button.textContent = value
    button.addEventListener('click', () => onPick(name, value))
    note.append(button)
  }
  return note
}

/** Takes away everything `applyFieldStates` drew, and puts the placeholders back. */
export function clearFieldStates(container: ParentNode) {
  for (const note of Array.from(container.querySelectorAll(`[${NOTE}]`))) note.remove()
  for (const el of Array.from(container.querySelectorAll<HTMLElement>(`[${SAVED_PLACEHOLDER}]`))) {
    const attribute = isInline(el) ? 'data-placeholder' : 'placeholder'
    const saved = el.getAttribute(SAVED_PLACEHOLDER) ?? ''
    if (saved) el.setAttribute(attribute, saved)
    else el.removeAttribute(attribute)
    el.removeAttribute(SAVED_PLACEHOLDER)
    unmark(el, GHOST)
  }
  for (const el of Array.from(container.querySelectorAll(`.${SUGGESTED}`))) unmark(el, SUGGESTED)
}

/**
 * Draws each field's state: the first suggestion in the empty field, the note and the offered values
 * by it, and the offered options of a choice group marked. What was drawn before is taken away first,
 * so the states given are the whole of what shows.
 */
export function applyFieldStates(container: ParentNode, states: FieldStates, onPick: (field: string, value: string) => void) {
  clearFieldStates(container)
  const doc = (container as Node).ownerDocument ?? (container as unknown as Document)
  for (const [name, state] of Object.entries(states)) {
    const elements = fieldElements(container, name)
    if (elements.length === 0) continue
    const [first] = elements
    const suggestions = state.suggestions ?? []
    if (suggestions.length > 0) showGhost(first, suggestions[0])
    for (const el of elements) {
      if (el instanceof HTMLInputElement && (el.type === 'radio' || el.type === 'checkbox') && suggestions.includes(el.value))
        el.closest('label')?.classList.add(SUGGESTED)
    }
    const inline = isInline(first)
    const note = noteElement(doc, name, state, inline, onPick)
    if (!note) continue
    if (inline) first.after(note)
    else (first.closest('.formdown-field') ?? first.parentElement ?? first).append(note)
  }
}
