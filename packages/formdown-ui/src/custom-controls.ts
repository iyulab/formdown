/**
 * Controls a page defines itself — a date picker a field-type plugin draws, a design system's input.
 * The web platform's contract for such a control is a form-associated custom element
 * (`static formAssociated = true`) with a `name` and a `value`, telling of changes with `input` and
 * `change`. One that keeps it is a field like any native control: its value is read and written
 * through `.value`, and it is disabled, required and marked invalid by its attributes.
 */

export type FieldValue = string | string[] | boolean

/** The custom element tag's class, once the page has defined it. */
function definition(el: Element): { formAssociated?: boolean } | undefined {
  return el.localName.includes('-') ? (customElements.get(el.localName) as { formAssociated?: boolean } | undefined) : undefined
}

/** Whether `el` is a named, form-associated custom element — a control of the page's own. */
export function isCustomControl(el: Element): boolean {
  return el.hasAttribute('name') && definition(el)?.formAssociated === true
}

/** The named custom controls under `container`. */
export function customControlsIn(container: ParentNode): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>('[name]')).filter((el) => isCustomControl(el))
}

/**
 * The tags of named custom elements under `container` the page has not defined yet. Whether one is a
 * control is known only once it is defined, so the form looks again then.
 */
export function undefinedControlTags(container: ParentNode): string[] {
  const tags = Array.from(container.querySelectorAll('[name]'))
    .filter((el) => el.localName.includes('-') && !customElements.get(el.localName))
    .map((el) => el.localName)
  return [...new Set(tags)]
}

/** The value a custom control holds, as a form value: text, a list, or a yes/no. */
export function readCustomControl(el: HTMLElement): FieldValue {
  const value = (el as HTMLElement & { value?: unknown }).value
  if (value === undefined || value === null) return ''
  if (typeof value === 'boolean' || typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(String)
  return String(value)
}

/** Shows `value` in a custom control — an absent value as an empty one. */
export function writeCustomControl(el: HTMLElement, value: unknown): void {
  ;(el as HTMLElement & { value?: unknown }).value = value === undefined || value === null ? '' : value
}

/** Disables and requires a custom control the way its own attributes say so. */
export function setCustomControlState(el: HTMLElement, enabled: boolean, required: boolean): void {
  el.toggleAttribute('disabled', !enabled)
  el.toggleAttribute('required', required)
}
