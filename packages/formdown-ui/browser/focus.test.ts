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

describe('an offered value taken', () => {
  it('gives focus back to its field with the caret after the value, so typing goes on from it', async () => {
    const ui = await mount('@code: [text]')
    ui.addEventListener('formdown-suggestion-pick', (e) => {
      const { field, value } = (e as CustomEvent<{ field: string; value: string }>).detail
      ui.data = { [field]: value }
      ui.fieldStates = {} // taken: nothing is offered any more, and the button is drawn away
    })
    ui.fieldStates = { code: { suggestions: ['32'] } }
    await ui.updateComplete
    const button = ui.shadowRoot!.querySelector<HTMLButtonElement>('.formdown-suggestion')!
    button.focus()
    button.click()
    await ui.updateComplete
    await tick() // after any focus handling of the field's own
    const input = ui.shadowRoot!.querySelector<HTMLInputElement>('input[name="code"]')!
    expect(ui.shadowRoot!.activeElement).to.equal(input)
    expect(input.value).to.equal('32')
    expect([input.selectionStart, input.selectionEnd]).to.deep.equal([2, 2])
  })
})
