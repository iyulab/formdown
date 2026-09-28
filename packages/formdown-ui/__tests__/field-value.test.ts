import { applyFieldValue, isCheckedValue } from '../src/field-value'

function input(type: string, value = 'true'): HTMLInputElement {
  const el = document.createElement('input')
  el.type = type
  el.value = value
  return el
}

describe('isCheckedValue', () => {
  it.each([
    [true, true],
    ['true', true],
    ['TRUE', true],
    [false, false],
    ['false', false],
    ['', false],
    [undefined, false],
    [null, false],
    ['yes', false],
  ])('%p → %p', (value, expected) => {
    expect(isCheckedValue(value)).toBe(expected)
  })
})

describe('applyFieldValue', () => {
  it('checks a single checkbox from a boolean or its text form', () => {
    for (const value of [true, 'true']) {
      const el = input('checkbox')
      applyFieldValue(el, value, 'checkbox')
      expect(el.checked).toBe(true)
    }
  })

  it('unchecks a single checkbox for false, "false" and missing values', () => {
    for (const value of [false, 'false', '', undefined]) {
      const el = input('checkbox')
      el.checked = true
      applyFieldValue(el, value, 'checkbox')
      expect(el.checked).toBe(false)
    }
  })

  it('checks a checkbox-group option when the list holds its value', () => {
    const web = input('checkbox', 'Web')
    const ai = input('checkbox', 'AI')
    applyFieldValue(web, ['Web'], 'checkbox')
    applyFieldValue(ai, ['Web'], 'checkbox')
    expect([web.checked, ai.checked]).toEqual([true, false])
  })

  it('checks a checkbox-group option named by a single text value', () => {
    const web = input('checkbox', 'Web')
    const ai = input('checkbox', 'AI')
    applyFieldValue(web, 'AI', 'checkbox')
    applyFieldValue(ai, 'AI', 'checkbox')
    expect([web.checked, ai.checked]).toEqual([false, true])
  })

  it('checks only the radio whose value matches', () => {
    const light = input('radio', 'Light')
    const dark = input('radio', 'Dark')
    applyFieldValue(light, 'Dark', 'radio')
    applyFieldValue(dark, 'Dark', 'radio')
    expect([light.checked, dark.checked]).toEqual([false, true])
  })

  it('writes text into inputs, text areas, selects and inline fields', () => {
    const text = input('text', '')
    applyFieldValue(text, 'hello', 'text')
    expect(text.value).toBe('hello')

    const area = document.createElement('textarea')
    applyFieldValue(area, 'line', 'textarea')
    expect(area.value).toBe('line')

    const inline = document.createElement('span')
    inline.setAttribute('contenteditable', 'true')
    applyFieldValue(inline, 'name', 'text')
    expect(inline.textContent).toBe('name')

    applyFieldValue(text, undefined, 'text')
    expect(text.value).toBe('')
  })
})
