// A field worked out from others' values (`compute="…"`), rendered with the real @formdown/core and Lit in jsdom: the
// value follows what the person types, goes out with the form's data, and is never typed into.
import '../../src/formdown-ui'

type Ui = HTMLElement & { content: string; data: Record<string, unknown>; updateComplete: Promise<boolean> }

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function mount(content: string, data?: Record<string, unknown>) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  if (data) ui.data = data
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  return ui
}

const one = (ui: HTMLElement, name: string) => ui.shadowRoot!.querySelector<HTMLInputElement>(`[name="${name}"]`)!

async function type(ui: Ui, name: string, value: string) {
  const input = one(ui, name)
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await ui.updateComplete
  await tick()
}

afterEach(() => {
  document.body.innerHTML = ''
})

const requisition = `@청구량: [number]
@단가: [number]
@금액: [number compute="청구량 * 단가"]`

test('is read-only, and follows the fields it is worked out from as they are typed', async () => {
  const ui = await mount(requisition)
  expect(one(ui, '금액').readOnly).toBe(true)

  await type(ui, '청구량', '3')
  expect(one(ui, '금액').value).toBe('')
  await type(ui, '단가', '1500')
  expect(one(ui, '금액').value).toBe('4500')
  expect(ui.data['금액']).toBe('4500')

  await type(ui, '청구량', '')
  expect(one(ui, '금액').value).toBe('')
})

test('goes out with the change that moved it', async () => {
  const ui = await mount(requisition, { 청구량: '2' })
  let sent: Record<string, unknown> | undefined
  ui.addEventListener('formdown-change', (e) => (sent = (e as CustomEvent<{ formData: Record<string, unknown> }>).detail.formData))
  await type(ui, '단가', '700')
  expect(sent?.['금액']).toBe('1400')
})

test('keeps the value it was given until a field it reads changes', async () => {
  const ui = await mount(requisition, { 청구량: '2', 단가: '700', 금액: '1300' })
  expect(one(ui, '금액').value).toBe('1300')
  await type(ui, '청구량', '3')
  expect(one(ui, '금액').value).toBe('2100')
})
