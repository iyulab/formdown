// A control the page defines itself — a form-associated custom element a field-type plugin draws —
// is a field like a native one, through the real core and component.
import { registerPlugin } from '@formdown/core'
import '../../src/formdown-ui'

type Ui = HTMLElement & {
  content: string
  data: Record<string, unknown>
  updateComplete: Promise<boolean>
  getFormData(): Record<string, unknown>
  validate(): { isValid: boolean }
  focusField(name?: string): boolean
}

class PickerControl extends HTMLElement {
  static formAssociated = true
  value = ''
  connectedCallback() {
    this.tabIndex = 0
  }
}
customElements.define('x-picker', PickerControl)

class Decoration extends HTMLElement {}
customElements.define('x-decoration', Decoration)

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function mount(content: string, data?: Record<string, unknown>) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  if (data) ui.data = data
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  await ui.updateComplete
  return ui
}

function choose(control: HTMLElement & { value: unknown }, value: string) {
  control.value = value
  control.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
}

beforeAll(async () => {
  await mount('@name: [text]') // initializes the extension system
  const field = (tag: string) => ({
    type: tag.slice(2),
    parser: (line: string) => {
      const match = line.match(new RegExp(`^@(\\w+)(?:\\(([^)]*)\\))?:\\s*\\[${tag.slice(2)}( required)?( lockable)?\\]`))
      if (!match) return null
      // `lockable`: turned off while `lock` is yes — a condition the plugin's parser declares.
      const conditions = match[4] ? { disabledIf: { field: 'lock', operator: '=' as const, value: 'yes' } } : undefined
      return { name: match[1], type: tag.slice(2), label: match[2] ?? match[1], required: !!match[3], conditions }
    },
    generator: (f: { name: string; label: string }) =>
      `<div class="formdown-field" part="field"><label for="${f.name}">${f.label}</label><${tag} id="${f.name}" name="${f.name}"></${tag}></div>`,
  })
  await registerPlugin({
    metadata: { name: 'custom-controls', version: '1.0.0' },
    fieldTypes: [field('x-picker'), field('x-decoration'), field('x-later')],
  })
})

afterEach(() => {
  document.body.innerHTML = ''
})

const picker = (ui: Ui, name = 'day') => ui.shadowRoot!.querySelector(`[name="${name}"]`) as PickerControl

test('its value reaches the data when it changes', async () => {
  const ui = await mount('@day(Day): [picker]\n@note: [text]')
  choose(picker(ui), '2026-10-22')
  await ui.updateComplete
  expect(ui.getFormData()).toEqual({ day: '2026-10-22' })
  expect(ui.data).toMatchObject({ day: '2026-10-22' })
})

test('it shows the value the data gives, at first and when the data changes', async () => {
  const ui = await mount('@day: [picker]', { day: '2026-01-01' })
  expect(picker(ui).value).toBe('2026-01-01')
  ui.data = { day: '2026-03-05' }
  await ui.updateComplete
  await tick()
  expect(picker(ui).value).toBe('2026-03-05')
})

test('a required one is missing while empty and filled once chosen', async () => {
  const ui = await mount('@day(Day): [picker required]')
  expect(ui.validate().isValid).toBe(false)
  expect(picker(ui).getAttribute('aria-invalid')).toBe('true')
  choose(picker(ui), '2026-10-22')
  await ui.updateComplete
  expect(ui.validate().isValid).toBe(true)
  expect(picker(ui).hasAttribute('aria-invalid')).toBe(false)
})

test('the host can put the cursor in it', async () => {
  const ui = await mount('@note: [text]\n@day: [picker]')
  expect(ui.focusField('day')).toBe(true)
  expect(ui.shadowRoot!.activeElement).toBe(picker(ui))
})

test('a condition turns it off and on through its disabled attribute', async () => {
  const ui = await mount('@lock: [radio options="yes,no"]\n@day: [picker lockable]', { lock: 'yes' })
  expect(picker(ui).hasAttribute('disabled')).toBe(true)
  expect(ui.focusField('day')).toBe(false)
  ui.data = { lock: 'no' }
  await ui.updateComplete
  await tick()
  expect(picker(ui).hasAttribute('disabled')).toBe(false)
})

test('a custom element that is not form-associated is not a field', async () => {
  const ui = await mount('@deco: [decoration]')
  const deco = ui.shadowRoot!.querySelector('[name="deco"]') as HTMLElement & { value?: string }
  deco.value = 'shown'
  deco.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
  await ui.updateComplete
  expect(ui.getFormData()).toEqual({})
})

test('one the page defines after the form is drawn becomes a field when it is defined', async () => {
  const ui = await mount('@when: [later]', { when: '2026-12-31' })
  customElements.define('x-later', class extends PickerControl {})
  await tick()
  await ui.updateComplete
  const later = picker(ui, 'when')
  expect(later.value).toBe('2026-12-31')
  choose(later, '2027-01-02')
  await ui.updateComplete
  expect(ui.getFormData()).toEqual({ when: '2027-01-02' })
})
