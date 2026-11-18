import type { FieldOption } from '@formdown/core'

/**
 * A value the host offers for a field, and the text shown for it (the value itself when absent) —
 * the shape of an option the author writes (`value=Label`) — and, when the host has one, a sentence that
 * says what the value means. The sentence is shown beside the value among a select's or a group's choices
 * and, for a select, under the field once the value is chosen; it is text, never markup. An author's
 * options carry none: it is what the host knows about the values it offers.
 */
export interface Choice extends FieldOption {
  description?: string
}

/** What the host offers for each field, by name. */
export type Choices = Record<string, Choice[]>

const CHOICE = 'data-formdown-choice'
const UNLISTED = 'data-formdown-unlisted'
/** On an option or a choice input: what the host says the value means. */
export const DESCRIPTION = 'data-formdown-description'
const CHOSEN = 'formdown-chosen-description'

const text = (choice: Choice) => choice.label ?? choice.value

/**
 * Puts the host's choices in the fields they are for, after the field's own options and before any value
 * nobody offers (`data-formdown-unlisted`): a select gets options, a radio or checkbox group gets choices,
 * and a field one types into gets a `<datalist>`. The author's options stay as written — a host choice
 * with the same value adds nothing — and a value nobody offered becomes one the host offers once it does.
 * Choices the host no longer offers are taken away; so is a datalist once its field has none.
 *
 * A field with an "other" choice and a single checkbox are left alone.
 * Returns the inputs it added, which the caller binds like the form's own.
 */
export function applyChoices(container: ParentNode, choices: Choices): HTMLInputElement[] {
  const added: HTMLInputElement[] = []

  for (const select of Array.from(container.querySelectorAll('select'))) {
    if (select.hasAttribute('data-formdown-has-other')) continue
    const offered = choices[select.name] ?? []
    for (const option of Array.from(select.options)) {
      if (option.hasAttribute(CHOICE) && !offered.some((c) => c.value === option.value)) option.remove()
    }
    for (const choice of offered) {
      const existing = Array.from(select.options).find((o) => o.value === choice.value)
      if (existing) {
        if (existing.hasAttribute(UNLISTED) || existing.hasAttribute(CHOICE)) take(existing, choice)
        continue
      }
      const option = select.ownerDocument.createElement('option')
      option.value = choice.value
      take(option, choice)
      const before = Array.from(select.options).find((o) => o.hasAttribute(UNLISTED))
      select.insertBefore(option, before ?? null)
    }
  }

  const groups = new Map<string, HTMLInputElement[]>()
  for (const input of Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]'))) {
    groups.set(input.name, [...(groups.get(input.name) ?? []), input])
  }
  for (const [name, inputs] of groups) {
    // A single checkbox carries "true": its value is a boolean, not one of several.
    if (inputs.every((c) => c.type === 'checkbox' && c.value === 'true')) continue
    if (inputs.some((c) => c.hasAttribute('data-formdown-other-radio') || c.hasAttribute('data-formdown-other-checkbox'))) continue
    const offered = choices[name] ?? []
    // Taken away only after the new ones are in: one of them may be the only place to put those.
    const stale = inputs.filter((c) => c.hasAttribute(CHOICE) && !offered.some((o) => o.value === c.value))
    const present = [...inputs]
    for (const choice of offered) {
      const existing = present.find((c) => c.value === choice.value)
      if (existing) {
        if (existing.hasAttribute(UNLISTED) || existing.hasAttribute(CHOICE)) {
          existing.removeAttribute(UNLISTED)
          existing.setAttribute(CHOICE, 'true')
          const label = existing.closest('label')
          const span = label?.querySelector('span')
          if (span) span.textContent = text(choice)
          if (label) describe(existing, label, choice)
        }
        continue
      }
      // After the last choice anyone offers, before the values nobody does.
      const listed = present.filter((c) => !c.hasAttribute(UNLISTED))
      const last = listed[listed.length - 1] ?? present[present.length - 1]
      const lastLabel = last.closest('label')
      const document = last.ownerDocument
      const input = document.createElement('input')
      input.type = last.type
      input.name = name
      input.value = choice.value
      input.id = `${name}_choice_${added.length}_${present.length}`
      input.setAttribute(CHOICE, 'true')
      const span = document.createElement('span')
      span.textContent = text(choice)
      const label = document.createElement('label')
      label.className = lastLabel?.className || 'formdown-option-label'
      label.setAttribute('part', lastLabel?.getAttribute('part') || 'option-label')
      label.htmlFor = input.id
      label.append(input, span)
      describe(input, label, choice)
      ;(lastLabel ?? last).after(label)
      present.splice(present.indexOf(last) + 1, 0, input)
      added.push(input)
    }
    for (const input of stale) (input.closest('label') ?? input).remove()
  }

  for (const input of Array.from(container.querySelectorAll<HTMLInputElement>('input[name]'))) {
    if (['radio', 'checkbox', 'hidden', 'file', 'range', 'color', 'submit', 'button', 'reset'].includes(input.type)) continue
    const id = `formdown-choices-${input.name}`
    const offered = choices[input.name] ?? []
    const previous = Array.from(container.querySelectorAll('datalist')).find((l) => l.id === id)
    if (offered.length === 0) {
      previous?.remove()
      if (input.getAttribute('list') === id) input.removeAttribute('list')
      continue
    }
    const list = previous ?? input.ownerDocument.createElement('datalist')
    list.id = id
    list.replaceChildren(
      ...offered.map((choice) => {
        const option = input.ownerDocument.createElement('option')
        option.value = choice.value
        option.label = text(choice)
        return option
      }),
    )
    if (!previous) input.after(list)
    input.setAttribute('list', id)
  }

  return added
}

function take(option: HTMLOptionElement, choice: Choice) {
  option.removeAttribute(UNLISTED)
  option.setAttribute(CHOICE, 'true')
  option.textContent = text(choice)
  if (choice.description) {
    option.setAttribute(DESCRIPTION, choice.description)
    option.title = choice.description
  } else {
    option.removeAttribute(DESCRIPTION)
    option.removeAttribute('title')
  }
}

/** Shows a choice's description in its label, after its text — or takes it away when it has none now. */
function describe(input: HTMLInputElement, label: HTMLLabelElement, choice: Choice) {
  let note = label.querySelector<HTMLElement>('.formdown-choice-description')
  if (!choice.description) {
    input.removeAttribute(DESCRIPTION)
    note?.remove()
    return
  }
  input.setAttribute(DESCRIPTION, choice.description)
  if (!note) {
    note = label.ownerDocument.createElement('span')
    note.className = 'formdown-choice-description'
    note.setAttribute('part', 'choice-description')
    label.append(note)
  }
  note.textContent = choice.description
}

const described = new WeakSet<HTMLSelectElement>()

/**
 * Under each select whose choices say what they mean, what the chosen one means: a line after the field
 * (after its combobox when it has one), named by the field's `aria-describedby`, empty and hidden while the
 * chosen value has nothing to say. It follows the select as it changes. A select whose choices say nothing
 * has no such line.
 */
export function applyChosenDescriptions(container: ParentNode): void {
  for (const select of Array.from(container.querySelectorAll('select'))) {
    if (select.multiple) continue
    const id = `${CHOSEN}-${select.name}`
    const root = select.getRootNode() as ParentNode
    const existing = Array.from(root.querySelectorAll<HTMLElement>(`.${CHOSEN}`)).find((el) => el.id === id)
    const any = Array.from(select.options).some((o) => o.hasAttribute(DESCRIPTION))
    const tokens = (select.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean)
    if (!any) {
      existing?.remove()
      const rest = tokens.filter((t) => t !== id)
      if (rest.length) select.setAttribute('aria-describedby', rest.join(' '))
      else select.removeAttribute('aria-describedby')
      continue
    }
    const line = existing ?? select.ownerDocument.createElement('div')
    if (!existing) {
      line.id = id
      line.className = CHOSEN
      line.setAttribute('part', 'chosen-description')
      ;(select.closest('.formdown-select-filter') ?? select).after(line)
    }
    if (!tokens.includes(id)) select.setAttribute('aria-describedby', [...tokens, id].join(' '))
    showChosen(select, line)
    if (!described.has(select)) {
      described.add(select)
      select.addEventListener('change', () => {
        const now = Array.from((select.getRootNode() as ParentNode).querySelectorAll<HTMLElement>(`.${CHOSEN}`)).find((el) => el.id === id)
        if (now) showChosen(select, now)
      })
    }
  }
}

function showChosen(select: HTMLSelectElement, line: HTMLElement) {
  const option = select.selectedIndex >= 0 ? select.options[select.selectedIndex] : undefined
  const description = option?.getAttribute(DESCRIPTION) ?? ''
  line.textContent = description
  line.hidden = !description
}
