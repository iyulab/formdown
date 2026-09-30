/**
 * What the host says about a field, drawn by the field: values it offers and a short note.
 *
 * The component only shows them. Picking an offered value, or declining them, is reported
 * (`FieldStateResponses`); putting a value into the field is the host's decision, so the host stays
 * the one place a value comes from.
 */
export interface FieldState {
  /**
   * Values offered for the field, most likely first. The first shows in the empty field in place of
   * its placeholder; each is listed by the field as a button that picks it.
   */
  suggestions?: string[]
  /** A short note shown by the field — where the suggestion comes from, or why there is none. */
  note?: string
  /**
   * The label of a button, after the offered values, that says none of them is wanted — "Not this",
   * in the host's language. Drawn only while there are suggestions.
   */
  decline?: string
}

export type FieldStates = Record<string, FieldState>

/** What the person does with a field's offered values. */
export interface FieldStateResponses {
  /** A value was picked. */
  onPick: (field: string, value: string) => void
  /** The offered values were declined. */
  onDecline: (field: string) => void
}

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

function noteElement(doc: Document, name: string, state: FieldState, inline: boolean, respond: FieldStateResponses) {
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
    button.addEventListener('click', () => respond.onPick(name, value))
    note.append(button)
  }
  if (state.decline && suggestions.length > 0) {
    const button = doc.createElement('button')
    button.type = 'button'
    button.className = 'formdown-decline'
    button.setAttribute('part', 'decline')
    button.textContent = state.decline
    button.addEventListener('click', () => respond.onDecline(name))
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
export function applyFieldStates(container: ParentNode, states: FieldStates, respond: FieldStateResponses) {
  const returning = fieldOfFocusedNote(container)
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
    const note = noteElement(doc, name, state, inline, respond)
    if (!note) continue
    if (inline) first.after(note)
    else (first.closest('.formdown-field') ?? first.parentElement ?? first).append(note)
  }
  if (returning !== null) focusField(container, returning)
}

/** The root that knows what has focus inside `container`: its document, or the shadow root it sits in. */
function focusRoot(container: ParentNode): Document | ShadowRoot | null {
  const root = (container as Node).getRootNode?.()
  return root && 'activeElement' in root ? (root as Document | ShadowRoot) : null
}

/**
 * The field whose note holds focus — an offered value or the decline just used. Redrawing takes that
 * button away, and focus would drop to the page, where the keyboard no longer reaches the form.
 */
function fieldOfFocusedNote(container: ParentNode): string | null {
  const active = focusRoot(container)?.activeElement
  if (!active || !(container as Node).contains(active)) return null
  return active.closest(`[${NOTE}]`)?.getAttribute(NOTE) ?? null
}

/** Focuses a field's control — for a choice group, its chosen option, or its first. */
function focusField(container: ParentNode, name: string) {
  const active = focusRoot(container)?.activeElement
  if (active && (container as Node).contains(active)) return // the drawing kept focus somewhere in the form
  const elements = fieldElements(container, name)
  const chosen = elements.find((el) => el instanceof HTMLInputElement && el.checked) ?? elements[0]
  chosen?.focus()
}
