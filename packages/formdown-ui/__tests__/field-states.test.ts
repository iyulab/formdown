import { applyFieldStates, clearFieldStates } from '../src/field-states'

// The shapes the generator gives each kind of field.
function form() {
  const container = document.createElement('div')
  container.innerHTML = `
    <p>Request: <span contenteditable="true" data-field-name="request" data-field-type="text" data-placeholder="Request" class="formdown-inline-field"></span></p>
    <div class="formdown-field-container"><div class="formdown-field">
      <label for="owner">Owner</label>
      <select id="owner" name="owner"><option value="">-</option><option value="Kim">Kim</option></select>
    </div></div>
    <div class="formdown-field-container"><div class="formdown-field">
      <label for="summary">Summary</label>
      <input type="text" id="summary" name="summary" placeholder="One line">
    </div></div>
    <div class="formdown-field-container"><div class="formdown-field"><fieldset><div class="radio-group">
      <label class="formdown-option-label"><input type="radio" name="urgent" value="yes"><span>yes</span></label>
      <label class="formdown-option-label"><input type="radio" name="urgent" value="no"><span>no</span></label>
    </div></fieldset></div></div>`
  document.body.append(container)
  return container
}

describe('applyFieldStates', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('shows the first suggestion in place of the placeholder, and lists every suggestion by the field', () => {
    const container = form()
    applyFieldStates(container, { summary: { suggestions: ['Printer jam', 'Paper out'], note: 'From a similar record' } }, () => {})
    const input = container.querySelector<HTMLInputElement>('[name="summary"]')!
    expect(input.placeholder).toBe('Printer jam')
    expect(input.classList.contains('formdown-ghost')).toBe(true)
    expect(input.value).toBe('')
    const note = input.closest('.formdown-field')!.querySelector('.formdown-field-note')!
    expect(note.querySelector('.formdown-field-note-text')!.textContent).toBe('From a similar record')
    expect(Array.from(note.querySelectorAll('button')).map((b) => [b.type, b.textContent])).toEqual([
      ['button', 'Printer jam'],
      ['button', 'Paper out'],
    ])
  })

  it('puts an inline field\'s note right after it, and its suggestion in its placeholder', () => {
    const container = form()
    applyFieldStates(container, { request: { suggestions: ['New laptop'] } }, () => {})
    const span = container.querySelector<HTMLElement>('[data-field-name="request"]')!
    expect(span.getAttribute('data-placeholder')).toBe('New laptop')
    expect(span.nextElementSibling!.tagName).toBe('SPAN')
    expect(span.nextElementSibling!.classList.contains('formdown-field-note')).toBe(true)
  })

  it('marks the suggested option of a choice group, and gives a select its note alone', () => {
    const container = form()
    applyFieldStates(container, { urgent: { suggestions: ['no'] }, owner: { suggestions: ['Kim'] } }, () => {})
    const marked = Array.from(container.querySelectorAll('.formdown-suggested')).map((l) => l.textContent)
    expect(marked).toEqual(['no'])
    const select = container.querySelector('select')!
    expect(select.classList.contains('formdown-ghost')).toBe(false)
    expect(select.closest('.formdown-field')!.querySelector('.formdown-suggestion')!.textContent).toBe('Kim')
  })

  it('reports a picked value without putting it in the field', () => {
    const container = form()
    const picked: [string, string][] = []
    applyFieldStates(container, { summary: { suggestions: ['Printer jam', 'Paper out'] } }, (field, value) => picked.push([field, value]))
    container.querySelectorAll<HTMLButtonElement>('.formdown-suggestion')[1].click()
    expect(picked).toEqual([['summary', 'Paper out']])
    expect(container.querySelector<HTMLInputElement>('[name="summary"]')!.value).toBe('')
  })

  it('draws only the states given: the last ones replace what was drawn, and nothing leaves no trace', () => {
    const container = form()
    const before = container.innerHTML
    applyFieldStates(container, { summary: { suggestions: ['Printer jam'] }, urgent: { suggestions: ['yes'], note: 'Learning' } }, () => {})
    applyFieldStates(container, { request: { note: 'Nothing close enough yet' } }, () => {})
    expect(container.querySelector<HTMLInputElement>('[name="summary"]')!.placeholder).toBe('One line')
    expect(container.querySelectorAll('.formdown-field-note')).toHaveLength(1)
    expect(container.querySelectorAll('.formdown-suggested')).toHaveLength(0)
    clearFieldStates(container)
    expect(container.innerHTML).toBe(before)
  })

  it('passes over fields the form does not have', () => {
    const container = form()
    const before = container.innerHTML
    applyFieldStates(container, { missing: { suggestions: ['x'], note: 'y' } }, () => {})
    expect(container.innerHTML).toBe(before)
  })
})
