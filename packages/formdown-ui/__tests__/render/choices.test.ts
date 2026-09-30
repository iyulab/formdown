// Choices the host offers, through the real generator and component.
import '../../src/formdown-ui'
import type { Choices } from '../../src/choices'

type Ui = HTMLElement & { content: string; data: Record<string, unknown>; choices: Choices; updateComplete: Promise<boolean> }

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function mount(content: string, init: Partial<Pick<Ui, 'data' | 'choices'>> = {}) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  Object.assign(ui, init)
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  return ui
}

const select = (ui: Ui, name: string) => ui.shadowRoot!.querySelector<HTMLSelectElement>(`select[name="${name}"]`)!
const values = (el: HTMLSelectElement) => Array.from(el.options).map((o) => o.value).filter(Boolean)

afterEach(() => {
  document.body.innerHTML = ''
})

test('a select lists the host choices after its own', async () => {
  const ui = await mount('@owner(담당): [select options="장비"]', { choices: { owner: [{ value: '인사' }, { value: '재무', label: '재무팀' }] } })
  expect(values(select(ui, 'owner'))).toEqual(['장비', '인사', '재무'])
  expect(Array.from(select(ui, 'owner').options).find((o) => o.value === '재무')!.textContent).toBe('재무팀')
})

test('choices given after the form is drawn show, and picking one reports its value', async () => {
  const ui = await mount('@owner(담당): [select]')
  ui.choices = { owner: [{ value: 'c-17', label: '이유랩' }] }
  await ui.updateComplete
  const field = select(ui, 'owner')
  expect(values(field)).toEqual(['c-17'])
  field.value = 'c-17'
  field.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(ui.data.owner).toBe('c-17')
})

test('a value the host offers is shown as offered, not as one nobody offers', async () => {
  const ui = await mount('@owner(담당): [select options="장비"]', { data: { owner: '인사' }, choices: { owner: [{ value: '인사' }] } })
  const option = Array.from(select(ui, 'owner').options).find((o) => o.value === '인사')!
  expect(option.hasAttribute('data-formdown-unlisted')).toBe(false)
  expect(option.hasAttribute('data-formdown-choice')).toBe(true)
  expect(select(ui, 'owner').value).toBe('인사')
})

test('a value becomes one nobody offers once the host stops offering it', async () => {
  const ui = await mount('@owner(담당): [select options="장비"]', { data: { owner: '인사' }, choices: { owner: [{ value: '인사' }] } })
  ui.choices = {}
  await ui.updateComplete
  const option = Array.from(select(ui, 'owner').options).find((o) => o.value === '인사')!
  expect(option.hasAttribute('data-formdown-unlisted')).toBe(true)
  expect(select(ui, 'owner').value).toBe('인사')
  expect(ui.data.owner).toBe('인사')
})

test('a text field lists the host choices as it is typed in', async () => {
  const ui = await mount('@owner(담당): [text]', { choices: { owner: [{ value: '장비' }, { value: '인사' }] } })
  const input = ui.shadowRoot!.querySelector<HTMLInputElement>('input[name="owner"]')!
  const list = ui.shadowRoot!.getElementById(input.getAttribute('list')!) as HTMLDataListElement
  expect(Array.from(list.options).map((o) => o.value)).toEqual(['장비', '인사'])
})
