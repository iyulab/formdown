// The values a host offers, drawn by the real component: named as the options are, and pressed while held.
import '../../src/formdown-ui'

type Ui = HTMLElement & {
  content: string
  data: Record<string, unknown>
  fieldStates: Record<string, { suggestions?: string[] }>
  updateComplete: Promise<boolean>
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

afterEach(() => {
  document.body.innerHTML = ''
})

test('an offered option shows its name, and is pressed once the field holds it — by the data or by the person', async () => {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = '@k(Kind): [select options="hw=Hardware,sw=Software"]'
  ui.fieldStates = { k: { suggestions: ['hw'] } }
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  const button = () => ui.shadowRoot!.querySelector<HTMLButtonElement>('[part="suggestion"]')!
  expect([button().textContent, button().getAttribute('aria-pressed')]).toEqual(['Hardware', 'false'])
  expect(button().closest('[role="group"]')!.getAttribute('aria-label')).toBe('Suggestions for Kind')

  ui.data = { k: 'hw' }
  await ui.updateComplete
  expect(button().getAttribute('aria-pressed')).toBe('true')

  const select = ui.shadowRoot!.querySelector<HTMLSelectElement>('[name="k"]')!
  select.value = 'sw'
  select.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(button().getAttribute('aria-pressed')).toBe('false')
})
