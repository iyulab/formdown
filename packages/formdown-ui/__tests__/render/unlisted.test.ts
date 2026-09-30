// A value a choice field does not offer, through the real generator and component.
import '../../src/formdown-ui'

type Ui = HTMLElement & { content: string; data: Record<string, unknown>; updateComplete: Promise<boolean> }

async function mount(content: string, data: Record<string, unknown>) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  ui.data = data
  document.body.appendChild(ui)
  await ui.updateComplete
  await new Promise((resolve) => setTimeout(resolve, 0))
  return ui
}

afterEach(() => {
  document.body.innerHTML = ''
})

test('a select shows a value it does not offer as a chosen extra option', async () => {
  const ui = await mount('@status(상태): [select options="접수,처리중,완료"]', { status: '보류' })
  const select = ui.shadowRoot!.querySelector<HTMLSelectElement>('select[name="status"]')!
  expect(Array.from(select.options).map((o) => o.value)).toEqual(expect.arrayContaining(['접수', '처리중', '완료', '보류']))
  const extra = Array.from(select.options).find((o) => o.value === '보류')!
  expect(extra.hasAttribute('data-formdown-unlisted')).toBe(true)
  expect(select.value).toBe('보류')
  expect(ui.data.status).toBe('보류')
})

test('a radio group shows a value it does not offer as a checked extra choice', async () => {
  const ui = await mount('@channel(채널): [radio options="전화,채팅"]', { channel: '방문' })
  const radios = Array.from(ui.shadowRoot!.querySelectorAll<HTMLInputElement>('input[name="channel"]'))
  const extra = radios.find((r) => r.value === '방문')
  expect(extra).toBeDefined()
  expect(extra!.checked).toBe(true)
  expect(extra!.closest('[data-formdown-unlisted]') ?? extra!.hasAttribute('data-formdown-unlisted')).toBeTruthy()
})

test('an offered value gets no extra choice', async () => {
  const ui = await mount('@status(상태): [select options="접수,처리중,완료"]', { status: '완료' })
  const select = ui.shadowRoot!.querySelector<HTMLSelectElement>('select[name="status"]')!
  expect(select.options).toHaveLength(3)
  expect(select.value).toBe('완료')
})
