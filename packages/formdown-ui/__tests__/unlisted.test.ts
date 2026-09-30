import { addUnlistedChoices } from '../src/unlisted'

// The shapes the generator gives choice fields.
function form() {
  const container = document.createElement('div')
  container.innerHTML = `
    <select name="owner"><option value="Kim">Kim</option><option value="Lee">Lee</option></select>
    <select name="team" data-formdown-has-other="true"><option value="A">A</option><option value="">Other</option></select>
    <div class="radio-group">
      <label for="os_0" class="formdown-option-label"><input type="radio" id="os_0" name="os" value="Windows"><span>Windows</span></label>
      <label for="os_1" class="formdown-option-label"><input type="radio" id="os_1" name="os" value="Mac"><span>Mac</span></label>
    </div>
    <div class="checkbox-group">
      <label for="tags_0" class="formdown-option-label"><input type="checkbox" id="tags_0" name="tags" value="Web"><span>Web</span></label>
    </div>
    <label><input type="checkbox" name="done" value="true"><span>Done</span></label>`
  return container
}

describe('addUnlistedChoices', () => {
  it('gives a select an option for a value it does not offer, once', () => {
    const container = form()
    addUnlistedChoices(container, { owner: 'Vendor' })
    addUnlistedChoices(container, { owner: 'Vendor' })
    const options = Array.from(container.querySelector<HTMLSelectElement>('select[name="owner"]')!.options)
    expect(options.map((o) => [o.value, o.hasAttribute('data-formdown-unlisted')])).toEqual([
      ['Kim', false],
      ['Lee', false],
      ['Vendor', true],
    ])
  })

  it('adds a radio after the group, labelled with the value, and returns it to be bound', () => {
    const container = form()
    const added = addUnlistedChoices(container, { os: 'Linux' })
    expect(added.map((i) => [i.type, i.name, i.value])).toEqual([['radio', 'os', 'Linux']])
    const labels = Array.from(container.querySelectorAll('.radio-group label')).map((l) => [l.textContent, l.className])
    expect(labels).toEqual([
      ['Windows', 'formdown-option-label'],
      ['Mac', 'formdown-option-label'],
      ['Linux', 'formdown-option-label'],
    ])
    expect(container.querySelector<HTMLLabelElement>('.radio-group label:last-child')!.htmlFor).toBe(added[0].id)
  })

  it('adds a checkbox for each listed value a group does not offer, in order', () => {
    const container = form()
    addUnlistedChoices(container, { tags: ['Web', 'Print', 'Radio'] })
    expect(Array.from(container.querySelectorAll<HTMLInputElement>('input[name="tags"]')).map((i) => i.value)).toEqual(['Web', 'Print', 'Radio'])
  })

  it('leaves fields with an other choice, single checkboxes, empty values and offered values alone', () => {
    const container = form()
    const before = container.innerHTML
    expect(addUnlistedChoices(container, { team: 'B', done: true, owner: '', os: 'Mac', tags: [], missing: 'x' })).toEqual([])
    expect(container.innerHTML).toBe(before)
  })
})
