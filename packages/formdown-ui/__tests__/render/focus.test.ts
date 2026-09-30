// Focusing a field from the host, through the real generator and component.
import '../../src/formdown-ui'

type Ui = HTMLElement & { content: string; data: Record<string, unknown>; updateComplete: Promise<boolean>; focusField(name?: string): boolean }

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function mount(content: string, data: Record<string, unknown> = {}) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  ui.data = data
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  return ui
}

const focused = (ui: Ui) => {
  const el = ui.shadowRoot!.activeElement as HTMLElement | null
  return el?.getAttribute('name') ?? el?.dataset.fieldName ?? null
}

afterEach(() => {
  document.body.innerHTML = ''
})

test('with no name, the first field of the form takes focus — an inline one included', async () => {
  const ui = await mount('# 접수\n\n요청: ___@요청\n\n@부서: [select options="영업,개발"]\n')
  expect(ui.focusField()).toBe(true)
  expect(focused(ui)).toBe('요청')
})

test('a named field takes focus; for a choice group, its chosen option', async () => {
  const ui = await mount('@요청: [text]\n\n@급함: [radio options="보통,급함"]\n', { 급함: '급함' })
  expect(ui.focusField('급함')).toBe(true)
  const active = ui.shadowRoot!.activeElement as HTMLInputElement
  expect(active.name).toBe('급함')
  expect(active.value).toBe('급함')
})

test('a field its condition hides is passed over, and naming it focuses nothing', async () => {
  const ui = await mount('@종류: [select options="일반,긴급"]\n\n@사유: [text visible-if="종류=긴급"]\n', {})
  expect(ui.focusField('사유')).toBe(false)
  expect(ui.focusField()).toBe(true)
  expect(focused(ui)).toBe('종류')
})

test('a name the form does not have focuses nothing', async () => {
  const ui = await mount('@요청: [text]\n')
  expect(ui.focusField('없는칸')).toBe(false)
})
