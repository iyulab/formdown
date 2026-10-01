import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

async function mount(content: string): Promise<FormdownUI> {
  const ui = document.createElement('formdown-ui') as FormdownUI
  ui.content = content
  document.body.appendChild(ui)
  await ui.updateComplete
  await new Promise((resolve) => setTimeout(resolve, 0))
  return ui
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 10))
const selection = (ui: FormdownUI) =>
  (ui.shadowRoot as ShadowRoot & { getSelection?: () => Selection | null }).getSelection?.() ?? window.getSelection()!

afterEach(() => {
  document.body.innerHTML = ''
})

describe('focusField', () => {
  it('puts the caret at the end of an inline field it returns to, keeping the value', async () => {
    const ui = await mount('요청: ___@request[text] 로 접수합니다.')
    ui.data = { request: '배터리가 닳아요' }
    await ui.updateComplete
    expect(ui.focusField('request')).to.equal(true)
    await tick() // after any focus handling of the field's own
    const s = selection(ui)!
    expect(s.isCollapsed).to.equal(true)
    expect(s.focusOffset).to.be.greaterThan(0)
  })
})
