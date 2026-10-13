// HTML written in a form's body, through the real generator and component.
import '../../src/formdown-ui'

type Ui = HTMLElement & { content: string; bodyHtml: 'trust' | 'escape'; updateComplete: Promise<boolean> }

const content = 'Read <a href="https://example.com/" target="_blank">the policy</a>.\n\n<img src="x" onerror="alert(1)">\n\n요청: ___@요청\n'

async function mount(set: (ui: Ui) => void) {
  const ui = document.createElement('formdown-ui') as Ui
  set(ui)
  document.body.appendChild(ui)
  await ui.updateComplete
  await new Promise((resolve) => setTimeout(resolve, 0))
  return ui
}

afterEach(() => {
  document.body.innerHTML = ''
})

test('is drawn as written by default', async () => {
  const ui = await mount((u) => (u.content = content))
  expect(ui.shadowRoot!.querySelector('a[target="_blank"]')).not.toBeNull()
  expect(ui.shadowRoot!.querySelector('img')).not.toBeNull()
})

test('is shown as text when the host asks to escape it, with the form still drawn', async () => {
  const ui = await mount((u) => {
    u.setAttribute('body-html', 'escape')
    u.content = content
  })
  const root = ui.shadowRoot!
  expect(root.querySelector('a, img')).toBeNull()
  expect(root.textContent).toContain('<a href="https://example.com/" target="_blank">the policy</a>')
  expect(root.textContent).toContain('<img src="x" onerror="alert(1)">')
  expect(root.querySelector('[data-field-name="요청"]')).not.toBeNull()
})

test('is drawn again when the host changes its mind', async () => {
  const ui = await mount((u) => (u.content = content))
  ui.bodyHtml = 'escape'
  await ui.updateComplete
  expect(ui.shadowRoot!.querySelector('a, img')).toBeNull()
  expect(ui.shadowRoot!.querySelector('[data-field-name="요청"]')).not.toBeNull()
})
