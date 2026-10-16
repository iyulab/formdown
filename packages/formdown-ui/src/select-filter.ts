/**
 * A select with many options becomes a combobox one types into to narrow the list — the WAI-ARIA
 * "combobox with listbox popup" pattern: an input (`role="combobox"`) whose text filters the options by
 * their labels, and a list (`role="listbox"`) of the ones that match.
 *
 * The select stays where it was and stays the field: its `name`, its value, its `input` and `change`
 * events, what conditions and field states do to it. Choosing in the list sets the select's value and
 * fires those events, as choosing in the select would. The input has no `name`, so it is never part of
 * the form's data, and it never holds a value of its own: text that names no option is put back to the
 * chosen option's label when the input is left.
 */

import { hostFocused } from './field-states'

const FILTERED = 'data-formdown-filtered'

interface Combobox {
  select: HTMLSelectElement
  wrapper: HTMLSpanElement
  input: HTMLInputElement
  list: HTMLUListElement
  /** The options shown now, in the order shown. */
  shown: HTMLOptionElement[]
  /** The index in `shown` of the option the arrow keys are on, or -1. */
  active: number
}

const comboboxes = new WeakMap<HTMLSelectElement, Combobox>()
let count = 0

/** The input that stands for `select` when it is filtered, if it is. */
export function comboboxOf(select: Element): HTMLInputElement | undefined {
  return select instanceof HTMLSelectElement ? comboboxes.get(select)?.input : undefined
}

/**
 * Gives every single-choice select with more than `above` options a combobox, and takes it away from one
 * that no longer has that many. Run after values, choices and conditions are applied: the input shows the
 * chosen option's label and follows the select's disabled and required state.
 */
export function applySelectFilters(container: ParentNode, above: number): void {
  for (const select of Array.from(container.querySelectorAll('select'))) {
    const existing = comboboxes.get(select)
    // A select with an "other" choice reveals a text field from its own change handling; it is left alone.
    const wanted = !select.multiple && !select.hasAttribute('data-formdown-has-other') && choosable(select).length > above
    if (!wanted) {
      if (existing) remove(existing)
      continue
    }
    const box = existing ?? create(select)
    sync(box)
  }
}

function choosable(select: HTMLSelectElement): HTMLOptionElement[] {
  return Array.from(select.options).filter((o) => !o.disabled && !o.hidden)
}

const labelOf = (option: HTMLOptionElement) => option.label || option.textContent || option.value
const fold = (text: string) => text.normalize('NFC').toLocaleLowerCase()

function create(select: HTMLSelectElement): Combobox {
  const doc = select.ownerDocument
  const n = ++count
  const wrapper = doc.createElement('span')
  wrapper.className = 'formdown-select-filter'
  const input = doc.createElement('input')
  input.type = 'text'
  input.className = 'formdown-select-filter-input'
  input.id = `formdown-filter-${n}`
  input.setAttribute('role', 'combobox')
  input.setAttribute('aria-autocomplete', 'list')
  input.setAttribute('aria-expanded', 'false')
  input.autocomplete = 'off'
  input.spellcheck = false
  const part = select.getAttribute('part')
  if (part) input.setAttribute('part', part)
  const list = doc.createElement('ul')
  list.id = `formdown-filter-list-${n}`
  list.className = 'formdown-select-filter-list'
  list.setAttribute('role', 'listbox')
  list.hidden = true
  input.setAttribute('aria-controls', list.id)

  // The select's label names the input. The select itself is kept out of the tab order and out of
  // the accessibility tree; focus that reaches it (its label clicked, a host focusing it) goes on to the input.
  // Compared as attributes, not built into a selector: an id can hold any character.
  const label = select.id ? Array.from((select.getRootNode() as ParentNode).querySelectorAll('label')).find((l) => l.htmlFor === select.id) : undefined
  if (label) {
    if (!label.id) label.id = `formdown-filter-label-${n}`
    input.setAttribute('aria-labelledby', label.id)
  }
  select.setAttribute(FILTERED, 'true')
  select.tabIndex = -1
  select.setAttribute('aria-hidden', 'true')

  select.before(wrapper)
  wrapper.append(input, list, select)

  const box: Combobox = { select, wrapper, input, list, shown: [], active: -1 }
  comboboxes.set(select, box)

  const onSelectFocus = () => input.focus()
  select.addEventListener('focus', onSelectFocus)
  ;(box as Combobox & { off?: () => void }).off = () => select.removeEventListener('focus', onSelectFocus)

  // A person moving in gets the label selected, so typing starts a new filter; the host putting the
  // cursor back (`focusField`) leaves it as it is.
  input.addEventListener('focus', () => {
    if (!hostFocused.delete(input)) setTimeout(() => input.select(), 0)
  })
  input.addEventListener('click', () => (list.hidden ? open(box, '') : close(box)))
  input.addEventListener('input', () => open(box, input.value))
  input.addEventListener('blur', () => {
    close(box)
    input.value = chosenLabel(select)
  })
  input.addEventListener('keydown', (e) => keydown(box, e))
  // A press on an option would blur the input before the click lands.
  list.addEventListener('mousedown', (e) => e.preventDefault())
  list.addEventListener('click', (e) => {
    const item = (e.target as Element).closest('[role="option"]')
    if (!item) return
    choose(box, box.shown[Number(item.getAttribute('data-index'))])
  })
  return box
}

function remove(box: Combobox) {
  const { select, wrapper } = box
  ;(box as Combobox & { off?: () => void }).off?.()
  select.removeAttribute(FILTERED)
  select.removeAttribute('tabindex')
  select.removeAttribute('aria-hidden')
  wrapper.before(select)
  wrapper.remove()
  comboboxes.delete(select)
}

function sync(box: Combobox) {
  const { select, input } = box
  input.disabled = select.disabled
  input.required = select.required
  for (const name of ['aria-required', 'aria-disabled', 'aria-invalid', 'aria-describedby']) {
    const value = select.getAttribute(name)
    if (value === null) input.removeAttribute(name)
    else input.setAttribute(name, value)
  }
  // What the person is typing is theirs until they leave the input.
  if (select.ownerDocument && (input.getRootNode() as Document | ShadowRoot).activeElement !== input) input.value = chosenLabel(select)
  if (!box.list.hidden) open(box, input.value === chosenLabel(select) ? '' : input.value)
}

function chosenLabel(select: HTMLSelectElement): string {
  const option = select.selectedIndex >= 0 ? select.options[select.selectedIndex] : undefined
  return option ? labelOf(option) : ''
}

function open(box: Combobox, filter: string) {
  const { select, input, list } = box
  const wanted = fold(filter.trim())
  box.shown = choosable(select).filter((o) => !wanted || fold(labelOf(o)).includes(wanted))
  const doc = select.ownerDocument
  list.replaceChildren(
    ...box.shown.map((option, i) => {
      const item = doc.createElement('li')
      item.id = `${list.id}-${i}`
      item.setAttribute('role', 'option')
      item.setAttribute('data-index', String(i))
      item.setAttribute('aria-selected', String(option.selected))
      item.textContent = labelOf(option)
      return item
    }),
  )
  // Nothing matches: no empty box — the list closes until the text names something again.
  list.hidden = box.shown.length === 0
  input.setAttribute('aria-expanded', String(!list.hidden))
  // With nothing typed the chosen option is where the arrows start; with a filter, the first match.
  const chosen = box.shown.findIndex((o) => o.selected)
  activate(box, wanted ? (box.shown.length ? 0 : -1) : chosen)
}

function close(box: Combobox) {
  box.list.hidden = true
  box.list.replaceChildren()
  box.shown = []
  box.active = -1
  box.input.setAttribute('aria-expanded', 'false')
  box.input.removeAttribute('aria-activedescendant')
}

function activate(box: Combobox, index: number) {
  const items = box.list.children
  if (box.active >= 0) items[box.active]?.classList.remove('active')
  box.active = index
  if (index < 0) {
    box.input.removeAttribute('aria-activedescendant')
    return
  }
  const item = items[index] as HTMLElement | undefined
  if (!item) return
  item.classList.add('active')
  box.input.setAttribute('aria-activedescendant', item.id)
  item.scrollIntoView?.({ block: 'nearest' })
}

function choose(box: Combobox, option: HTMLOptionElement | undefined) {
  const { select, input } = box
  if (!option) return
  const changed = select.value !== option.value
  select.value = option.value
  input.value = labelOf(option)
  close(box)
  if (changed) {
    select.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
    select.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

function keydown(box: Combobox, e: KeyboardEvent) {
  if (e.isComposing) return
  const isOpen = !box.list.hidden
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      if (!isOpen) open(box, '')
      else if (box.shown.length) activate(box, Math.min(box.active + 1, box.shown.length - 1))
      break
    case 'ArrowUp':
      e.preventDefault()
      if (!isOpen) open(box, '')
      else if (box.shown.length) activate(box, Math.max(box.active - 1, 0))
      break
    case 'Enter':
      if (isOpen) {
        // Enter chooses; it does not also move on to the next field or submit.
        e.preventDefault()
        e.stopImmediatePropagation()
        if (box.active >= 0) choose(box, box.shown[box.active])
        else close(box)
      }
      break
    case 'Escape':
      if (isOpen) {
        e.preventDefault()
        e.stopPropagation()
        close(box)
      }
      box.input.value = chosenLabel(box.select)
      box.input.select()
      break
    case 'Tab':
      if (isOpen) close(box)
      break
  }
}
