import { applyChoices } from '../src/choices'

function form() {
  const container = document.createElement('div')
  container.innerHTML = `
    <select name="status"><option value="">Select</option><option value="접수">접수</option><option value="보류" selected data-formdown-unlisted="true">보류</option></select>
    <div class="radio-group">
      <label class="formdown-option-label"><input type="radio" id="ch_0" name="channel" value="전화"><span>전화</span></label>
    </div>
    <input type="text" name="owner">
    <select name="other" data-formdown-has-other="true"><option value="a">a</option></select>
    <input type="checkbox" name="agree" value="true">`
  return container
}

const values = (select: HTMLSelectElement) => Array.from(select.options).map((o) => o.value)

test('a select offers the host choices after its own, before a value it does not offer', () => {
  const container = form()
  applyChoices(container, { status: [{ value: '처리중' }, { value: '접수', label: '무시됨' }, { value: '완료', label: '끝남' }] })
  const select = container.querySelector<HTMLSelectElement>('select[name="status"]')!
  expect(values(select)).toEqual(['', '접수', '처리중', '완료', '보류'])
  expect(select.options[1].textContent).toBe('접수') // the author's own option keeps its text
  expect(select.options[3].textContent).toBe('끝남')
  expect(select.options[2].getAttribute('data-formdown-choice')).toBe('true')
})

test('a value the host offers is no longer marked as one nobody offers', () => {
  const container = form()
  applyChoices(container, { status: [{ value: '보류', label: '보류 중' }] })
  const option = Array.from(container.querySelector<HTMLSelectElement>('select[name="status"]')!.options).find((o) => o.value === '보류')!
  expect(option.hasAttribute('data-formdown-unlisted')).toBe(false)
  expect(option.getAttribute('data-formdown-choice')).toBe('true')
  expect(option.textContent).toBe('보류 중')
  expect(option.selected).toBe(true)
})

test('choices follow what the host offers now', () => {
  const container = form()
  applyChoices(container, { status: [{ value: '처리중' }, { value: '완료' }] })
  applyChoices(container, { status: [{ value: '완료', label: '끝남' }] })
  const select = container.querySelector<HTMLSelectElement>('select[name="status"]')!
  expect(values(select)).toEqual(['', '접수', '완료', '보류'])
  expect(select.options[2].textContent).toBe('끝남')
  applyChoices(container, {})
  expect(values(select)).toEqual(['', '접수', '보류'])
})

test('a radio group gets a choice for each host value, and returns the inputs it added', () => {
  const container = form()
  const added = applyChoices(container, { channel: [{ value: '전화' }, { value: '채팅', label: '채팅 상담' }] })
  const radios = Array.from(container.querySelectorAll<HTMLInputElement>('input[name="channel"]'))
  expect(radios.map((r) => r.value)).toEqual(['전화', '채팅'])
  expect(added).toEqual([radios[1]])
  expect(radios[1].closest('label')!.textContent).toBe('채팅 상담')
  expect(radios[1].closest('label')!.className).toBe('formdown-option-label')

  applyChoices(container, {})
  expect(Array.from(container.querySelectorAll<HTMLInputElement>('input[name="channel"]')).map((r) => r.value)).toEqual(['전화'])
})

test('a group whose choices were all the host\'s takes the new ones in their place', () => {
  const container = document.createElement('div')
  container.innerHTML = `<div class="checkbox-group"><label class="formdown-option-label"><input type="checkbox" name="tags" value="a"><span>a</span></label></div>`
  applyChoices(container, { tags: [{ value: 'b' }, { value: 'c' }] })
  // Now the host offers only what the author did not.
  container.querySelector('input[value="a"]')!.closest('label')!.remove()
  applyChoices(container, { tags: [{ value: 'd' }] })
  expect(Array.from(container.querySelectorAll<HTMLInputElement>('input[name="tags"]')).map((c) => c.value)).toEqual(['d'])
  expect(container.querySelector('input[value="d"]')!.closest('.checkbox-group')).not.toBeNull()
})

test('a text field lists the host choices as its suggestions list', () => {
  const container = form()
  applyChoices(container, { owner: [{ value: '장비', label: '장비팀' }, { value: '인사' }] })
  const input = container.querySelector<HTMLInputElement>('input[name="owner"]')!
  const list = Array.from(container.querySelectorAll('datalist')).find((l) => l.id === input.getAttribute('list'))!
  expect(Array.from(list.options).map((o) => [o.value, o.label])).toEqual([['장비', '장비팀'], ['인사', '인사']])
  applyChoices(container, {})
  expect(input.hasAttribute('list')).toBe(false)
  expect(container.querySelector('datalist')).toBeNull()
})

test('a field with an "other" choice and a single checkbox are left alone', () => {
  const container = form()
  applyChoices(container, { other: [{ value: 'b' }], agree: [{ value: 'x' }] })
  expect(values(container.querySelector<HTMLSelectElement>('select[name="other"]')!)).toEqual(['a'])
  expect(container.querySelectorAll('input[name="agree"]')).toHaveLength(1)
})
