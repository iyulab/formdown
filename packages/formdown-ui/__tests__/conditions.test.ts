// The ui tests stand @formdown/core in with a mock; conditions are core's own, so this one uses them.
jest.mock('@formdown/core', () => jest.requireActual('../../formdown-core/src/conditions'))

import { applyConditions } from '../src/conditions'

// The shapes the generator gives fields with conditions.
function form() {
  const container = document.createElement('div')
  container.innerHTML = `
    <div class="formdown-field"><fieldset><div class="radio-group">
      <label><input type="radio" name="type" value="개인"><span>개인</span></label>
      <label><input type="radio" name="type" value="법인"><span>법인</span></label>
    </div></fieldset></div>
    <div class="formdown-field formdown-conditional"><label for="company">회사명</label><input type="text" id="company" name="company" value="이미 쓴 값"></div>
    <div class="formdown-field formdown-conditional"><label for="reason">사유</label><textarea id="reason" name="reason"></textarea></div>
    <p>메모: <span contenteditable="true" data-field-name="memo" class="formdown-inline-field"></span></p>`
  return container
}

const schema = {
  company: {
    conditions: {
      visibleIf: { field: 'type', operator: '=' as const, value: '법인' },
      requiredIf: { field: 'type', operator: '=' as const, value: '법인' },
    },
  },
  reason: { conditions: { disabledIf: { field: 'type', operator: '=' as const, value: '개인' } }, required: true },
  memo: { conditions: { hiddenIf: { field: 'type', operator: 'falsy' as const } } },
}

describe('applyConditions', () => {
  it('hides a field with its block while its condition does not hold, keeping its value', () => {
    const container = form()
    applyConditions(container, schema, { type: '개인' })
    const company = container.querySelector<HTMLInputElement>('[name="company"]')!
    expect(company.closest<HTMLElement>('.formdown-field')!.hidden).toBe(true)
    expect(company.value).toBe('이미 쓴 값')
    expect(company.required).toBe(false)

    applyConditions(container, schema, { type: '법인' })
    expect(company.closest<HTMLElement>('.formdown-field')!.hidden).toBe(false)
    expect(company.required).toBe(true)
    expect(company.getAttribute('aria-required')).toBe('true')
  })

  it('disables a field, and keeps one the schema requires required', () => {
    const container = form()
    const reason = container.querySelector<HTMLTextAreaElement>('[name="reason"]')!
    applyConditions(container, schema, { type: '개인' })
    expect([reason.disabled, reason.getAttribute('aria-disabled')]).toEqual([true, 'true'])
    applyConditions(container, schema, { type: '법인' })
    expect([reason.disabled, reason.required]).toEqual([false, true])
  })

  it('hides an inline field alone', () => {
    const container = form()
    const memo = container.querySelector<HTMLElement>('[data-field-name="memo"]')!
    applyConditions(container, schema, {})
    expect(memo.hidden).toBe(true)
    expect(memo.closest('p')!.hidden).toBe(false)
    applyConditions(container, schema, { type: '개인' })
    expect(memo.hidden).toBe(false)
  })

  it('leaves fields without conditions alone', () => {
    const container = form()
    applyConditions(container, schema, { type: '개인' })
    expect(Array.from(container.querySelectorAll<HTMLInputElement>('[name="type"]')).map((r) => r.disabled || r.closest<HTMLElement>('.formdown-field')!.hidden)).toEqual([false, false])
  })
})
