// A switch (c[switch]) is drawn as a track and knob in every browser, whether or not it draws the HTML switch.
import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

afterEach(() => {
  document.body.replaceChildren()
})

describe('a switch', () => {
  it('is drawn wider than tall, moves its knob when turned on, and gives a boolean', async () => {
    const ui = document.createElement('formdown-ui') as FormdownUI
    ui.content = '@notify(알림): c[switch]'
    document.body.appendChild(ui)
    await ui.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 50))

    const root = ui.shadowRoot!
    const input = root.querySelector<HTMLInputElement>('input[name="notify"]')!
    expect(input.getAttribute('role')).to.equal('switch')
    const box = input.getBoundingClientRect()
    expect(box.width).to.be.greaterThan(box.height)

    const knob = () => getComputedStyle(input, '::before').transform
    const off = knob()
    input.click()
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(input.checked).to.equal(true)
    expect(knob()).to.not.equal(off)
    expect(root.querySelector('label')!.textContent).to.contain('알림')
  })
})
