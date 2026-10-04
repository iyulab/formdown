// The form initializes the extension system when it connects; what it draws after that must still
// treat the source's text as text.
import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

afterEach(() => {
  document.body.replaceChildren()
})

describe('a form drawn after it connected', () => {
  it('shows markup in options and placeholders as text, and keeps its fields in its form', async () => {
    const ui = document.createElement('formdown-ui') as FormdownUI
    ui.content = '@c: [select options="v=<img src=x id=probe-a>,B"]\n@t: [text placeholder="<img src=x id=probe-b>"]'
    document.body.appendChild(ui)
    await ui.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 50))
    ui.content = `${ui.content}\n`
    await ui.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 50))

    const root = ui.shadowRoot!
    expect(root.querySelectorAll('img').length).to.equal(0)
    // The markup is the text shown for value "v" (a label may hold "="; the value is split off at the first one).
    expect(root.querySelector('select option')!.textContent).to.equal('<img src=x id=probe-a>')
    expect((root.querySelector('select option') as HTMLOptionElement).value).to.equal('v')
    expect(root.querySelector('select')!.getAttribute('form')).to.be.a('string')
    expect(root.querySelector('input[name="t"]')!.getAttribute('form')).to.be.a('string')
  })
})
