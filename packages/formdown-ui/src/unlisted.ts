/**
 * Values a choice field is given that its options do not offer — written outside the form, saved before an
 * option was renamed, or suggested from a record that holds one. The generator renders those it is given
 * with the source; these are the ones that arrive as data afterwards. Each becomes an option after the
 * offered ones, marked `data-formdown-unlisted` as the generator marks its own, so that the field shows the
 * value instead of an empty choice — and reports it back instead of reporting it cleared.
 *
 * A field with an "other" choice is left alone: it has its own handling of such values.
 * Returns the inputs it added, which the caller binds like the form's own.
 */
export function addUnlistedChoices(container: ParentNode, data: Record<string, unknown>): HTMLInputElement[] {
  const added: HTMLInputElement[] = []
  for (const [name, value] of Object.entries(data)) {
    const values = (Array.isArray(value) ? value : [value])
      .filter((v) => v !== undefined && v !== null && typeof v !== 'boolean')
      .map(String)
      .filter((v) => v !== '')
    if (values.length === 0) continue

    const select = Array.from(container.querySelectorAll('select')).find((s) => s.name === name)
    if (select) {
      if (select.hasAttribute('data-formdown-has-other')) continue
      for (const v of values) {
        if (Array.from(select.options).some((o) => o.value === v)) continue
        const option = select.ownerDocument.createElement('option')
        option.value = v
        option.textContent = v
        option.setAttribute('data-formdown-unlisted', 'true')
        select.append(option)
      }
      continue
    }

    const choices = Array.from(container.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]')).filter(
      (c) => c.name === name,
    )
    // A single checkbox carries "true": its value is a boolean, not one of several.
    if (choices.length === 0 || choices.every((c) => c.type === 'checkbox' && c.value === 'true')) continue
    if (choices.some((c) => c.hasAttribute('data-formdown-other-radio') || c.hasAttribute('data-formdown-other-checkbox'))) continue
    const last = choices[choices.length - 1]
    const lastLabel = last.closest('label')
    let anchor: Element = lastLabel ?? last
    // A radio group holds one value; only the first is shown.
    for (const v of last.type === 'radio' ? values.slice(0, 1) : values) {
      if (choices.some((c) => c.value === v)) continue
      const document = last.ownerDocument
      const input = document.createElement('input')
      input.type = last.type
      input.name = name
      input.value = v
      input.id = `${last.id || name}_unlisted_${added.length}`
      input.setAttribute('data-formdown-unlisted', 'true')
      const text = document.createElement('span')
      text.textContent = v
      const label = document.createElement('label')
      label.className = lastLabel?.className || 'formdown-option-label'
      label.htmlFor = input.id
      label.append(input, text)
      anchor.after(label)
      anchor = label
      choices.push(input)
      added.push(input)
    }
  }
  return added
}
