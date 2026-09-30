/** A value the host offers for a field, and the text shown for it (the value itself when absent). */
export interface Choice {
  value: string
  label?: string
}

/** What the host offers for each field, by name. */
export type Choices = Record<string, Choice[]>

const CHOICE = 'data-formdown-choice'
const UNLISTED = 'data-formdown-unlisted'

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
          const span = existing.closest('label')?.querySelector('span')
          if (span) span.textContent = text(choice)
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
      label.htmlFor = input.id
      label.append(input, span)
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
}
