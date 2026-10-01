import { expect } from '@open-wc/testing'
import '../src/formdown-ui.ts'
import type { FormdownUI } from '../src/formdown-ui.ts'

const long = '공기청정기 전원이 갑자기 꺼지고 다시 켜지지 않아 서비스 방문을 요청드립니다'

async function mount(content: string, width = 480): Promise<FormdownUI> {
  const ui = document.createElement('formdown-ui') as FormdownUI
  ui.style.display = 'block'
  ui.style.width = `${width}px`
  ui.content = content
  document.body.appendChild(ui)
  await ui.updateComplete
  await new Promise((resolve) => setTimeout(resolve, 0))
  return ui
}

const inside = (ui: FormdownUI, selector: string) => ui.shadowRoot!.querySelector<HTMLElement>(selector)!

function overlaps(a: DOMRect, b: DOMRect) {
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('an inline field', () => {
  it('shows the start of a long value once it loses focus', async () => {
    const ui = await mount('문의: ___@inquiry[text] 로 접수합니다.')
    const field = inside(ui, '[data-field-name="inquiry"]')
    field.focus()
    field.textContent = long
    field.dispatchEvent(new Event('input', { bubbles: true }))
    field.scrollLeft = field.scrollWidth // typing leaves the end in view
    field.blur()
    expect(field.scrollLeft).to.equal(0)
  })

  it('shows the whole of a value that fits on the line', async () => {
    const ui = await mount('요청: ___@request[text] 로 접수합니다.', 1024)
    ui.data = { request: '노트북 배터리가 금방 닳아요' }
    await ui.updateComplete
    const field = inside(ui, '[data-field-name="request"]')
    expect(field.scrollWidth).to.be.at.most(field.clientWidth)
  })

  it('stays within the form however long its value', async () => {
    const ui = await mount('문의: ___@inquiry[text] 로 접수합니다.', 360)
    ui.data = { inquiry: long.repeat(3) }
    await ui.updateComplete
    const field = inside(ui, '[data-field-name="inquiry"]').getBoundingClientRect()
    const form = ui.getBoundingClientRect()
    expect(field.right).to.be.at.most(form.right + 0.5)
    expect(field.left).to.be.at.least(form.left - 0.5)
  })
})

describe('offered values', () => {
  it('are listed beside the field without covering it', async () => {
    const ui = await mount('@owner(담당): [text]')
    ui.fieldStates = { owner: { suggestions: ['장비', '인사'], note: '비슷한 문서', decline: '아님' } }
    await ui.updateComplete
    const input = inside(ui, 'input[name="owner"]')
    const buttons = Array.from(ui.shadowRoot!.querySelectorAll<HTMLElement>('button'))
    expect(buttons.length).to.be.at.least(2)
    for (const button of buttons) {
      expect(overlaps(button.getBoundingClientRect(), input.getBoundingClientRect()), button.textContent ?? '').to.equal(false)
      expect(button.getBoundingClientRect().width).to.be.above(0)
    }
  })

  it('show the first one in the empty field in place of its placeholder', async () => {
    const ui = await mount('@owner(담당): [text placeholder="담당 부서"]')
    ui.fieldStates = { owner: { suggestions: ['장비'] } }
    await ui.updateComplete
    expect(inside(ui, 'input[name="owner"]').getAttribute('placeholder')).to.equal('장비')
  })
})
