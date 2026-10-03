// Theme properties reach the form's shadow tree by inheritance, which jsdom does not compute.
import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

async function mount(parent: HTMLElement = document.body): Promise<FormdownUI> {
  const ui = document.createElement('formdown-ui') as FormdownUI
  ui.content = '@name(이름): [text]'
  parent.appendChild(ui)
  await ui.updateComplete
  return ui
}

const input = (ui: FormdownUI) => ui.shadowRoot!.querySelector<HTMLInputElement>('input[name="name"]')!

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('style')
})

describe('theme properties', () => {
  it('draw the form with their defaults when nothing sets them', async () => {
    const ui = await mount()
    expect(getComputedStyle(ui).backgroundColor).to.equal('rgb(255, 255, 255)')
    expect(getComputedStyle(input(ui)).borderTopColor).to.equal('rgb(226, 232, 240)')
  })

  it('reach the form from the document root', async () => {
    document.documentElement.style.setProperty('--formdown-bg-primary', 'rgb(17, 24, 39)')
    document.documentElement.style.setProperty('--formdown-border-color', 'rgb(55, 65, 81)')
    const ui = await mount()
    expect(getComputedStyle(ui).backgroundColor).to.equal('rgb(17, 24, 39)')
    // a property derived from another follows it
    expect(getComputedStyle(input(ui)).borderTopColor).to.equal('rgb(55, 65, 81)')
  })

  it('set on the element win over an ancestor', async () => {
    document.documentElement.style.setProperty('--formdown-bg-primary', 'rgb(17, 24, 39)')
    const ui = await mount()
    ui.style.setProperty('--formdown-bg-primary', 'rgb(1, 2, 3)')
    expect(getComputedStyle(ui).backgroundColor).to.equal('rgb(1, 2, 3)')
  })

  it('named --theme-* do not reach the form', async () => {
    document.documentElement.style.setProperty('--theme-bg-primary', 'rgb(17, 24, 39)')
    const ui = await mount()
    expect(getComputedStyle(ui).backgroundColor).to.equal('rgb(255, 255, 255)')
  })
})
