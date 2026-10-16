import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

// A select the host fills past the limit becomes a combobox (select-filter.ts): where it and its list sit.
const shops = Array.from({ length: 40 }, (_, i) => ({ value: `id-${i}`, label: `가게 ${i} — 아주 긴 상호가 붙은 식품 업소 #${1000 + i}` }))

async function mount(width: number): Promise<FormdownUI> {
  const ui = document.createElement('formdown-ui') as FormdownUI
  ui.style.display = 'block'
  ui.style.width = `${width}px`
  ui.content = '@shop(가게): [select]\n\n@memo(메모): [text]'
  ui.choices = { shop: shops }
  document.body.appendChild(ui)
  await ui.updateComplete
  await new Promise((resolve) => setTimeout(resolve, 0))
  return ui
}

const inside = (ui: FormdownUI, selector: string) => ui.shadowRoot!.querySelector<HTMLElement>(selector)!

afterEach(() => {
  document.body.innerHTML = ''
})

describe('a long select narrowed by typing', () => {
  it('takes the place of the select, the select taking none of its own', async () => {
    const ui = await mount(480)
    const input = inside(ui, 'input[role="combobox"]').getBoundingClientRect()
    const select = inside(ui, 'select[name="shop"]').getBoundingClientRect()
    const memo = inside(ui, 'input[name="memo"]').getBoundingClientRect()
    expect(input.height).to.be.above(20)
    // The select lies under the input, no larger: nothing below moves for it.
    expect(select.top).to.be.at.least(input.top - 1)
    expect(select.bottom).to.be.at.most(input.bottom + 1)
    expect(memo.top).to.be.at.least(input.bottom)
  })

  it('opens its list below the input, over what follows, as wide as the input', async () => {
    const ui = await mount(320)
    const input = inside(ui, 'input[role="combobox"]') as HTMLInputElement
    input.focus()
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
    const list = inside(ui, '[role="listbox"]')
    const box = list.getBoundingClientRect()
    const field = input.getBoundingClientRect()
    expect(box.top).to.be.at.least(field.bottom)
    expect(Math.round(box.width)).to.equal(Math.round(field.width))
    // It scrolls rather than running down the page, and long labels wrap rather than widen it.
    expect(box.height).to.be.at.most(16 * 16 + 4)
    expect(list.scrollWidth).to.be.at.most(list.clientWidth + 1)
    // The field after it is under the list: the list is what a click there reaches.
    const memo = inside(ui, 'input[name="memo"]').getBoundingClientRect()
    const hit = ui.shadowRoot!.elementFromPoint(memo.left + 10, Math.min(memo.top + 5, box.bottom - 5))
    expect(list.contains(hit)).to.equal(true)
  })

  it('chooses with a click on an option, keeping focus in the input', async () => {
    const ui = await mount(480)
    const input = inside(ui, 'input[role="combobox"]') as HTMLInputElement
    input.focus()
    input.value = '#1033'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    const option = inside(ui, '[role="option"]')
    const r = option.getBoundingClientRect()
    option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX: r.left + 5, clientY: r.top + 5 }))
    option.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: r.left + 5, clientY: r.top + 5 }))
    await ui.updateComplete
    expect((inside(ui, 'select[name="shop"]') as HTMLSelectElement).value).to.equal('id-33')
    expect(ui.data.shop).to.equal('id-33')
    expect(ui.shadowRoot!.activeElement).to.equal(input)
    expect(inside(ui, '[role="listbox"]').hidden).to.equal(true)
  })
})
