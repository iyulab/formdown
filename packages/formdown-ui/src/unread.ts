/**
 * Values a typed input cannot hold — "next week" in a date field, "1,000" in a number field — written outside
 * the form or by another tool. The browser sanitizes such a value away, so the field would look empty while the
 * form's data still holds it (and reports it back unchanged). Each one is shown next to its field instead,
 * marked `data-formdown-unread`, until the field is given a value of its own.
 *
 * Only the input types whose value the browser rewrites are considered: a text field shows what it holds.
 */
const SANITIZED = new Set(['date', 'time', 'datetime-local', 'month', 'week', 'number', 'range', 'color'])

const MARK = 'data-formdown-unread'
const SHOWN = 'formdown-unread'

/** What a field shows when given `value`, compared as the browser writes it (a color is lowercase). */
function holds(input: HTMLInputElement, value: string): boolean {
  return input.type === 'color' ? input.value === value.toLowerCase() : input.value === value
}

function describedBy(input: HTMLInputElement, id: string, add: boolean) {
  const ids = (input.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((v) => v && v !== id)
  if (add) ids.push(id)
  if (ids.length > 0) input.setAttribute('aria-describedby', ids.join(' '))
  else input.removeAttribute('aria-describedby')
}

/**
 * Shows, next to each typed input, the value from `data` it could not take, and takes back what an earlier call
 * showed for a field that now holds its value. Run after the values are applied.
 */
export function markUnreadValues(container: ParentNode, data: Record<string, unknown>): void {
  for (const input of Array.from(container.querySelectorAll<HTMLInputElement>('input'))) {
    if (!SANITIZED.has(input.type)) continue
    const raw = data[input.name]
    const value = typeof raw === 'string' || typeof raw === 'number' ? String(raw) : ''
    const unread = value !== '' && !holds(input, value)

    const id = `${input.id || input.name}_unread`
    const shown = input.nextElementSibling?.classList.contains(SHOWN) ? input.nextElementSibling : null
    if (!unread) {
      if (shown) shown.remove()
      if (input.hasAttribute(MARK)) {
        input.removeAttribute(MARK)
        describedBy(input, id, false)
      }
      continue
    }

    input.setAttribute(MARK, 'true')
    const note = shown ?? input.ownerDocument.createElement('span')
    note.className = SHOWN
    note.id = id
    note.setAttribute('part', 'unread-value')
    note.setAttribute(MARK, input.name)
    note.textContent = value
    if (!shown) input.after(note)
    describedBy(input, id, true)
  }
}
