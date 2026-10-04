// A toggle is drawn as a switch: its plugin's styles hide the checkbox and draw the track and knob.
import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

afterEach(() => {
  document.body.replaceChildren()
})

describe('a toggle field', () => {
  it('is drawn as a switch that moves its knob when turned on', async () => {
    const ui = document.createElement('formdown-ui') as FormdownUI
    ui.content = '@notify(알림): [toggle]'
    document.body.appendChild(ui)
    await ui.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 50))

    const root = ui.shadowRoot!
    const input = root.querySelector<HTMLInputElement>('input[name="notify"]')!
    const track = root.querySelector<HTMLElement>('.formdown-toggle-switch')!
    expect(input.getBoundingClientRect().width).to.equal(0)
    expect(track.getBoundingClientRect().width).to.equal(44)

    const knob = () => getComputedStyle(root.querySelector('.formdown-toggle-slider')!, '::before').transform
    const off = knob()
    input.click()
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(input.checked).to.equal(true)
    expect(knob()).to.not.equal(off)
  })
})
