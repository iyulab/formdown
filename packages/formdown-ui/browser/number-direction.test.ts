import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

async function mount(content: string): Promise<FormdownUI> {
  const ui = document.createElement('formdown-ui') as FormdownUI
  ui.style.display = 'block'
  ui.style.width = '480px'
  ui.content = content
  document.body.appendChild(ui)
  await ui.updateComplete
  await new Promise((resolve) => setTimeout(resolve, 0))
  return ui
}

const number = (ui: FormdownUI) => ui.shadowRoot!.querySelector<HTMLInputElement>('input[type="number"]')!
const text = (ui: FormdownUI) => ui.shadowRoot!.querySelector<HTMLInputElement>('input[type="text"]')!

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('dir')
})

describe('a number field in a right-to-left page', () => {
  it('is read left to right, so the sign of a negative number stays in front', async () => {
    document.documentElement.setAttribute('dir', 'rtl')
    const ui = await mount('@amount: [number]\n@note: [text]')
    const style = getComputedStyle(number(ui))
    expect(style.direction).to.equal('ltr')
    // the digits keep the page's start edge, which is the right
    expect(style.textAlign).to.equal('end')
  })

  it('leaves a text field right to left', async () => {
    document.documentElement.setAttribute('dir', 'rtl')
    const ui = await mount('@amount: [number]\n@note: [text]')
    expect(getComputedStyle(text(ui)).direction).to.equal('rtl')
  })

  it('can be told apart from the other text inputs by its own part', async () => {
    const ui = await mount('@amount: [number]\n@note: [text]')
    expect(number(ui).getAttribute('part')).to.contain('number-input')
    expect(text(ui).getAttribute('part')).to.not.contain('number-input')
  })
})

describe('a number field in a left-to-right page', () => {
  it('is drawn as before', async () => {
    const ui = await mount('@amount: [number]')
    const style = getComputedStyle(number(ui))
    expect(style.direction).to.equal('ltr')
    expect(style.textAlign).to.not.equal('end')
  })
})
