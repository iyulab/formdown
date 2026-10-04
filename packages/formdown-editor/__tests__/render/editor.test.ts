// The editor through the real core, ui and Lit: what it draws, not only what it computes.
import '../../src/formdown-editor'

type Editor = HTMLElement & { content: string; mode: string; updateComplete: Promise<boolean> }

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function settle(editor: Editor) {
  for (let i = 0; i < 4; i++) {
    await editor.updateComplete
    await tick()
  }
}

async function mount(content: string, mode = 'split') {
  const editor = document.createElement('formdown-editor') as Editor
  editor.mode = mode
  editor.content = content
  document.body.appendChild(editor)
  await settle(editor)
  return editor
}

const problems = (editor: Editor) =>
  Array.from(editor.shadowRoot!.querySelectorAll('.error-item')).map((item) => item.textContent!.trim())

afterEach(() => {
  document.body.innerHTML = ''
})

test('lists the problems of the content it is given, and follows content set from outside', async () => {
  const editor = await mount('@name: [text]\n@name: [email]', 'edit')
  expect(problems(editor)).toEqual([expect.stringMatching(/^Line 2: .*"name"/)])

  editor.content = '@title: [text]'
  await settle(editor)
  expect(problems(editor)).toEqual([])
})

test('previews a field type the extension system adds as that type', async () => {
  const editor = await mount('@notify(알림): [toggle]')
  const preview = editor.shadowRoot!.querySelector('formdown-ui')!
  await (preview as unknown as Editor).updateComplete
  await tick()
  const input = preview.shadowRoot!.querySelector<HTMLInputElement>('input[name="notify"]')!
  expect(input.type).toBe('checkbox')
  expect(input.getAttribute('role')).toBe('switch')
})
