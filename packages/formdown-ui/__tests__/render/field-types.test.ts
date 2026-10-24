// A switch and a field type a plugin adds, through the real core and component.
import { registerPlugin } from '@formdown/core'
import '../../src/formdown-ui'

type Ui = HTMLElement & { content: string; data: Record<string, unknown>; updateComplete: Promise<boolean>; validate(): { isValid: boolean } }

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function mount(content: string) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  await ui.updateComplete
  return ui
}

afterEach(() => {
  document.body.innerHTML = ''
})

test('a switch renders as a checkbox with the switch role on the first connection', async () => {
  const ui = await mount('@notify(알림): c[switch]')
  const input = ui.shadowRoot!.querySelector<HTMLInputElement>('input[name="notify"]')!
  expect(input.type).toBe('checkbox')
  expect(input.getAttribute('role')).toBe('switch')
})

test('a switch reports a boolean, like a single checkbox, and its state is the checkbox itself', async () => {
  const ui = await mount('@notify(알림): c[switch required]')
  const input = ui.shadowRoot!.querySelector<HTMLInputElement>('input[name="notify"]')!
  expect(ui.validate().isValid).toBe(false)
  input.checked = true
  input.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(ui.data).toEqual({ notify: true })
  expect(ui.validate().isValid).toBe(true)
  expect(input.hasAttribute('aria-checked')).toBe(false)
  input.checked = false
  input.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(ui.data).toEqual({ notify: false })
})

test('a switch shows the value it is given', async () => {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = '@notify: c[switch]'
  ui.data = { notify: true }
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  expect(ui.shadowRoot!.querySelector<HTMLInputElement>('input[name="notify"]')!.checked).toBe(true)
})

const appliedCss = (ui: Ui) => {
  const root = ui.shadowRoot!
  const adopted = (root.adoptedStyleSheets ?? []).map((sheet) => Array.from(sheet.cssRules).map((r) => r.cssText).join(' '))
  const elements = Array.from(root.querySelectorAll('style')).map((s) => s.textContent ?? '')
  return [...adopted, ...elements].join(' ')
}

test('the styles of a plugin field type apply to a form that holds one, and only then', async () => {
  await mount('@name: [text]') // initializes the extension system
  await registerPlugin({
    metadata: { name: 'stars', version: '1.0.0' },
    fieldTypes: [{
      type: 'stars',
      parser: (line: string) => {
        const match = line.match(/^@(\w+):\s*\[stars\]/)
        return match ? { name: match[1], type: 'stars', label: 'Rate us' } : null
      },
      generator: (field: { name: string }) => `<div class="formdown-stars-field"><input name="${field.name}" class="stars-input"></div>`,
      styles: '.stars-input { letter-spacing: 2px; }'
    }]
  })
  const ui = await mount('@rating: [stars]')
  expect(appliedCss(ui)).toContain('.stars-input')
  ui.content = '@name: [text]'
  await ui.updateComplete
  expect(appliedCss(ui)).not.toContain('.stars-input')
})

test('suggest: attributes never reach the rendered control — role= there would be its ARIA role', async () => {
  const ui = await mount('@handler: [select options="kim,lee" suggest:role=judged suggest:policy=confirm]\n@note: [text suggest:evidence=false]')
  for (const name of ['handler', 'note']) {
    const control = ui.shadowRoot!.querySelector(`[name="${name}"]`)!
    expect(control.getAttributeNames().filter((n) => n.startsWith('suggest:') || n === 'role')).toEqual([])
  }
})

test('a file field keeps no made-up path in the data and hands the chosen files to the host', async () => {
  const ui = await mount('@attachment(첨부): [file]')
  const input = ui.shadowRoot!.querySelector<HTMLInputElement>('input[name="attachment"]')!
  expect(input.type).toBe('file')
  let picked: { field: string; files: File[] } | undefined
  ui.addEventListener('formdown-file-pick', (e) => (picked = (e as CustomEvent<{ field: string; files: File[] }>).detail))
  const file = new File(['x'], 'report.pdf')
  // What a browser gives for a chosen file: the file, and a made-up path as the input's value.
  Object.defineProperty(input, 'files', { value: [file] })
  Object.defineProperty(input, 'value', { value: 'C:\fakepath\report.pdf' })
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(ui.data.attachment ?? '').toBe('')
  expect(picked).toEqual({ field: 'attachment', files: [file] })
})
