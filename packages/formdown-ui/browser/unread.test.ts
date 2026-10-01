// A value a typed input cannot hold. The browser's value sanitization is what empties the field, so this runs in
// a real browser rather than jsdom.
import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

async function mount(content: string, data: Record<string, unknown>): Promise<FormdownUI> {
  const ui = document.createElement('formdown-ui') as FormdownUI
  ui.content = content
  ui.data = data
  document.body.appendChild(ui)
  await ui.updateComplete
  await new Promise((resolve) => setTimeout(resolve, 0))
  return ui
}

const field = (ui: FormdownUI, name: string) => ui.shadowRoot!.querySelector<HTMLInputElement>(`input[name="${name}"]`)!
const shown = (ui: FormdownUI, name: string) =>
  Array.from(ui.shadowRoot!.querySelectorAll<HTMLElement>('.formdown-unread')).find((el) => el.dataset.formdownUnread === name)

function type(input: HTMLInputElement, value: string) {
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('a value a typed input cannot hold', () => {
  it('is shown beside the empty field and kept in the data, through edits of other fields', async () => {
    const ui = await mount('@visit(방문일): [date]\n@memo(메모): [text]', { visit: '다음 주쯤', memo: '' })
    const visit = field(ui, 'visit')
    expect(visit.value).to.equal('')
    expect(visit.getAttribute('data-formdown-unread')).to.equal('true')
    const note = shown(ui, 'visit')!
    expect(note.textContent).to.equal('다음 주쯤')
    expect(visit.getAttribute('aria-describedby')).to.contain(note.id)
    expect(visit.nextElementSibling).to.equal(note)

    type(field(ui, 'memo'), '전화 먼저')
    await ui.updateComplete
    expect(ui.getFormData().visit).to.equal('다음 주쯤')
    expect(shown(ui, 'visit')!.textContent).to.equal('다음 주쯤')
  })

  it('gives way once the field is given a value of its own', async () => {
    const ui = await mount('@visit(방문일): [date]', { visit: '다음 주쯤' })
    type(field(ui, 'visit'), '2026-10-08')
    await ui.updateComplete
    expect(ui.getFormData().visit).to.equal('2026-10-08')
    expect(shown(ui, 'visit')).to.equal(undefined)
    expect(field(ui, 'visit').hasAttribute('data-formdown-unread')).to.equal(false)
    expect(field(ui, 'visit').hasAttribute('aria-describedby')).to.equal(false)
  })

  it('covers a number, and shows nothing for values the field holds', async () => {
    const ui = await mount('@count(수량): [number]\n@due(마감): [date]\n@price(값): [number]', {
      count: '1,000',
      due: '2026-10-08',
      price: 12.5,
    })
    expect(shown(ui, 'count')!.textContent).to.equal('1,000')
    expect(shown(ui, 'due')).to.equal(undefined)
    expect(shown(ui, 'price')).to.equal(undefined)
  })

  it('follows data the host replaces', async () => {
    const ui = await mount('@visit(방문일): [date]', { visit: '2026-10-08' })
    expect(shown(ui, 'visit')).to.equal(undefined)
    ui.data = { visit: '미정' }
    await ui.updateComplete
    expect(shown(ui, 'visit')!.textContent).to.equal('미정')
    ui.data = { visit: '' }
    await ui.updateComplete
    expect(shown(ui, 'visit')).to.equal(undefined)
  })

  it('leaves a text field alone', async () => {
    const ui = await mount('@visit(방문일): [text]', { visit: '다음 주쯤' })
    expect(field(ui, 'visit').value).to.equal('다음 주쯤')
    expect(shown(ui, 'visit')).to.equal(undefined)
  })
})
