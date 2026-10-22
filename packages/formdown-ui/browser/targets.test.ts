// What a person presses to tick or pick is at least 24 by 24 px (WCAG 2.2 SC 2.5.8) — the label row, with the
// checkbox and radio glyphs left at the browser's size.
import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

afterEach(() => {
  document.body.replaceChildren()
})

describe('pointer targets', () => {
  it('give every option, checkbox and switch label at least 24 px, and leave the inputs their own size', async () => {
    const ui = document.createElement('formdown-ui') as FormdownUI
    ui.content = [
      '@size(Size): [radio options="s=Small,l=Large"]',
      '@days(Days): [checkbox options="Mon,Tue" layout="vertical"]',
      '@terms: [checkbox content="I agree"]',
      '@notify(알림): c[switch]',
    ].join('\n')
    document.body.appendChild(ui)
    await ui.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 50))

    const root = ui.shadowRoot!
    const labels = Array.from(root.querySelectorAll<HTMLElement>('.formdown-option-label, .formdown-checkbox-label'))
    expect(labels.length).to.equal(6)
    for (const label of labels) {
      const box = label.getBoundingClientRect()
      expect(box.height, label.textContent!.trim()).to.be.at.least(24)
      expect(box.width, label.textContent!.trim()).to.be.at.least(24)
    }
    for (const input of Array.from(root.querySelectorAll<HTMLInputElement>('input[type="radio"], input[type="checkbox"]:not([role="switch"])'))) {
      expect(input.getBoundingClientRect().height, input.name).to.be.below(20)
    }
    expect(Array.from(root.querySelectorAll('.formdown-option-label')).every((l) => l.getAttribute('part') === 'option-label')).to.equal(true)
  })
})
