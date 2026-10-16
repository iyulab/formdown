// A select with many options, narrowed by typing — through the real generator and component.
import '../../src/formdown-ui'
import type { Choices } from '../../src/choices'

type Ui = HTMLElement & {
  content: string
  data: Record<string, unknown>
  choices: Choices
  filterSelectAbove: number
  focusField(name?: string): boolean
  updateComplete: Promise<boolean>
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function mount(content: string, init: Partial<Pick<Ui, 'data' | 'choices' | 'filterSelectAbove'>> = {}) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  Object.assign(ui, init)
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  return ui
}

/** Shops by id, shown by name — the values a host gives a field that names other records. */
const shops: Choices = {
  shop: Array.from({ length: 30 }, (_, i) => ({ value: `id-${i + 1}`, label: `가게 ${i + 1} #${1000 + i}` })).concat([
    { value: 'id-cafe', label: 'Blue Bottle Café #2001' },
  ]),
}

const select = (ui: Ui) => ui.shadowRoot!.querySelector<HTMLSelectElement>('select[name="shop"]')!
const combobox = (ui: Ui) => ui.shadowRoot!.querySelector<HTMLInputElement>('input[role="combobox"]')
const listed = (ui: Ui) => Array.from(ui.shadowRoot!.querySelectorAll('[role="listbox"] [role="option"]')).map((o) => o.textContent)
function type(input: HTMLInputElement, text: string) {
  input.value = text
  input.dispatchEvent(new Event('input', { bubbles: true }))
}
const key = (input: HTMLInputElement, k: string) => input.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))

afterEach(() => {
  document.body.innerHTML = ''
})

test('a select with few options stays a select', async () => {
  const ui = await mount('@shop(가게): [select options="가,나,다"]')
  expect(combobox(ui)).toBeNull()
  expect(select(ui).hasAttribute('data-formdown-filtered')).toBe(false)
})

test('a select the host fills past the limit gets a combobox showing the chosen label, not the value', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops, data: { shop: 'id-3' } })
  const input = combobox(ui)!
  expect(input).not.toBeNull()
  expect(input.name).toBe('')
  expect(input.value).toBe('가게 3 #1002')
  expect(select(ui).value).toBe('id-3')
  expect(select(ui).getAttribute('aria-hidden')).toBe('true')
  // The label still names the field.
  const label = ui.shadowRoot!.querySelector(`label[for="${select(ui).id}"]`)
  expect(label && input.getAttribute('aria-labelledby')).toBe(label?.id)
})

test('typing narrows the options by their labels, and Enter chooses one: the field takes its value', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops })
  const input = combobox(ui)!
  type(input, '#1012')
  expect(listed(ui)).toEqual(['가게 13 #1012'])
  expect(input.getAttribute('aria-expanded')).toBe('true')
  key(input, 'Enter')
  await ui.updateComplete
  expect(select(ui).value).toBe('id-13')
  expect(ui.data.shop).toBe('id-13')
  expect(input.value).toBe('가게 13 #1012')
  expect(input.getAttribute('aria-expanded')).toBe('false')
})

test('the filter ignores case and matches anywhere in the label', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops })
  type(combobox(ui)!, 'bottle café'.normalize('NFD'))
  expect(listed(ui)).toEqual(['Blue Bottle Café #2001'])
})

test('the arrow keys move through the list, the active option named for assistive technology', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops })
  const input = combobox(ui)!
  type(input, '가게 2')
  const shown = listed(ui)
  expect(shown[0]).toBe('가게 2 #1001')
  key(input, 'ArrowDown')
  const active = input.getAttribute('aria-activedescendant')!
  expect(ui.shadowRoot!.getElementById(active)!.textContent).toBe(shown[1])
  key(input, 'Enter')
  await ui.updateComplete
  expect(input.value).toBe(shown[1])
  expect(select(ui).selectedOptions[0].textContent).toBe(shown[1])
})

test('Escape and leaving put back the chosen label; text naming no option changes nothing', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops, data: { shop: 'id-1' } })
  const input = combobox(ui)!
  type(input, '없는 가게')
  expect(listed(ui)).toEqual([])
  expect(input.getAttribute('aria-expanded')).toBe('false')
  expect(ui.shadowRoot!.querySelector<HTMLElement>('[role="listbox"]')!.hidden).toBe(true)
  key(input, 'Enter')
  key(input, 'Escape')
  expect(input.value).toBe('가게 1 #1000')
  type(input, '가게 7')
  input.dispatchEvent(new Event('blur'))
  expect(input.value).toBe('가게 1 #1000')
  expect(select(ui).value).toBe('id-1')
  expect(ui.data.shop).toBe('id-1')
})

test('a value nobody offers is still listed and still shown', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops, data: { shop: 'id-gone' } })
  expect(combobox(ui)!.value).toBe('id-gone')
  key(combobox(ui)!, 'ArrowDown')
  expect(listed(ui)).toContain('id-gone')
})

test('a value the host puts in shows in the combobox', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops })
  ui.data = { shop: 'id-cafe' }
  await ui.updateComplete
  await tick()
  expect(combobox(ui)!.value).toBe('Blue Bottle Café #2001')
})

test('the combobox goes when the options fall to the limit, and the select is the field again', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops, data: { shop: 'id-2' } })
  ui.choices = { shop: shops.shop.slice(0, 5) }
  await ui.updateComplete
  await tick()
  expect(combobox(ui)).toBeNull()
  expect(select(ui).hasAttribute('data-formdown-filtered')).toBe(false)
  expect(select(ui).hasAttribute('aria-hidden')).toBe(false)
  expect(select(ui).value).toBe('id-2')
})

test('the limit is the host’s: Infinity keeps every select as it is', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops, filterSelectAbove: Infinity })
  expect(combobox(ui)).toBeNull()
  ui.filterSelectAbove = 3
  await ui.updateComplete
  expect(combobox(ui)).not.toBeNull()
})

test('focusing the field by name reaches the combobox', async () => {
  const ui = await mount('@shop(가게): [select]', { choices: shops })
  expect(ui.focusField('shop')).toBe(true)
  expect(ui.shadowRoot!.activeElement).toBe(combobox(ui))
})

test('a select with an "other" choice is left alone', async () => {
  const many = Array.from({ length: 25 }, (_, i) => `v${i}`).join(',')
  const ui = await mount(`@shop(가게): [select options="${many},*"]`)
  expect(combobox(ui)).toBeNull()
})
