// Renders <formdown-ui> with the real @formdown/core and the real Lit, in jsdom: the unit tests stand both
// in with mocks, so what the generator writes and what the component does with it are only seen together here.
import '../../src/formdown-ui'

type Ui = HTMLElement & { content: string; data: Record<string, unknown>; updateComplete: Promise<boolean> }

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function mount(content: string, data?: Record<string, unknown>) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  if (data) ui.data = data
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick() // the component applies values after a tick
  return ui
}

async function set(ui: Ui, data: Record<string, unknown>) {
  ui.data = data
  await ui.updateComplete
}

const all = (ui: HTMLElement, name: string) =>
  Array.from(ui.shadowRoot!.querySelectorAll<HTMLInputElement>(`[name="${name}"]`))
const one = (ui: HTMLElement, name: string) => all(ui, name)[0]
const block = (el: HTMLElement) => el.closest<HTMLElement>('.formdown-field') ?? el

afterEach(() => {
  document.body.innerHTML = ''
})

const order = `@type(구분): [radio options="개인,법인"]
@회사명: [text visible-if="type=법인" required-if="type=법인"]
@사유: [textarea disabled-if="type=개인"]`

test('renders fields from the real generator', async () => {
  const ui = await mount('@name(이름): [text required]')
  expect(one(ui, 'name').required).toBe(true)
})

test('a field shows and is required as its condition holds, from data', async () => {
  const ui = await mount(order)
  expect(block(one(ui, '회사명')).hidden).toBe(true)
  expect(one(ui, '회사명').required).toBe(false)

  await set(ui, { type: '법인' })
  expect(block(one(ui, '회사명')).hidden).toBe(false)
  expect(one(ui, '회사명').required).toBe(true)
  expect(one(ui, '사유').disabled).toBe(false)

  await set(ui, { type: '개인' })
  expect(block(one(ui, '회사명')).hidden).toBe(true)
  expect(one(ui, '사유').disabled).toBe(true)
})

test('a field shows as the person picks the choice its condition names', async () => {
  const ui = await mount(order)
  const corporate = all(ui, 'type').find((r) => r.value === '법인')!
  corporate.checked = true
  corporate.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(ui.data.type).toBe('법인')
  expect(block(one(ui, '회사명')).hidden).toBe(false)
})

test('hiding a field keeps its value', async () => {
  const ui = await mount(order, { type: '법인', 회사명: '이유랩' })
  expect(one(ui, '회사명').value).toBe('이유랩')
  await set(ui, { ...ui.data, type: '개인' })
  expect(block(one(ui, '회사명')).hidden).toBe(true)
  expect(one(ui, '회사명').value).toBe('이유랩')
  expect(ui.data['회사명']).toBe('이유랩')
})
