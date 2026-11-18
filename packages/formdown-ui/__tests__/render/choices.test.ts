// Choices the host offers, through the real generator and component.
import '../../src/formdown-ui'
import type { Choices } from '../../src/choices'

type Ui = HTMLElement & { content: string; data: Record<string, unknown>; choices: Choices; updateComplete: Promise<boolean> }

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function mount(content: string, init: Partial<Pick<Ui, 'data' | 'choices'>> = {}) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  Object.assign(ui, init)
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  return ui
}

const select = (ui: Ui, name: string) => ui.shadowRoot!.querySelector<HTMLSelectElement>(`select[name="${name}"]`)!
const values = (el: HTMLSelectElement) => Array.from(el.options).map((o) => o.value).filter(Boolean)

afterEach(() => {
  document.body.innerHTML = ''
})

test('a select lists the host choices after its own', async () => {
  const ui = await mount('@owner(담당): [select options="장비"]', { choices: { owner: [{ value: '인사' }, { value: '재무', label: '재무팀' }] } })
  expect(values(select(ui, 'owner'))).toEqual(['장비', '인사', '재무'])
  expect(Array.from(select(ui, 'owner').options).find((o) => o.value === '재무')!.textContent).toBe('재무팀')
})

test('choices given after the form is drawn show, and picking one reports its value', async () => {
  const ui = await mount('@owner(담당): [select]')
  ui.choices = { owner: [{ value: 'c-17', label: '이유랩' }] }
  await ui.updateComplete
  const field = select(ui, 'owner')
  expect(values(field)).toEqual(['c-17'])
  field.value = 'c-17'
  field.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(ui.data.owner).toBe('c-17')
})

test('a value the host offers is shown as offered, not as one nobody offers', async () => {
  const ui = await mount('@owner(담당): [select options="장비"]', { data: { owner: '인사' }, choices: { owner: [{ value: '인사' }] } })
  const option = Array.from(select(ui, 'owner').options).find((o) => o.value === '인사')!
  expect(option.hasAttribute('data-formdown-unlisted')).toBe(false)
  expect(option.hasAttribute('data-formdown-choice')).toBe(true)
  expect(select(ui, 'owner').value).toBe('인사')
})

test('a value becomes one nobody offers once the host stops offering it', async () => {
  const ui = await mount('@owner(담당): [select options="장비"]', { data: { owner: '인사' }, choices: { owner: [{ value: '인사' }] } })
  ui.choices = {}
  await ui.updateComplete
  const option = Array.from(select(ui, 'owner').options).find((o) => o.value === '인사')!
  expect(option.hasAttribute('data-formdown-unlisted')).toBe(true)
  expect(select(ui, 'owner').value).toBe('인사')
  expect(ui.data.owner).toBe('인사')
})

test('a text field lists the host choices as it is typed in', async () => {
  const ui = await mount('@owner(담당): [text]', { choices: { owner: [{ value: '장비' }, { value: '인사' }] } })
  const input = ui.shadowRoot!.querySelector<HTMLInputElement>('input[name="owner"]')!
  const list = ui.shadowRoot!.getElementById(input.getAttribute('list')!) as HTMLDataListElement
  expect(Array.from(list.options).map((o) => o.value)).toEqual(['장비', '인사'])
})

test('an option the author labels shows its label, holds its value, and keeps it over a host choice', async () => {
  const ui = await mount('@kind(분류): [select options="hw=하드웨어,sw=소프트웨어"]', {
    data: { kind: 'sw' },
    choices: { kind: [{ value: 'hw', label: '장비' }, { value: 'net', label: '네트워크' }] },
  })
  const field = select(ui, 'kind')
  expect(values(field)).toEqual(['hw', 'sw', 'net'])
  expect(Array.from(field.options).map((o) => o.textContent)).toEqual(['하드웨어', '소프트웨어', '네트워크'])
  expect(field.value).toBe('sw')
  field.value = 'hw'
  field.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(ui.data.kind).toBe('hw')
})

const chosenLine = (ui: Ui, name: string) => ui.shadowRoot!.getElementById(`formdown-chosen-description-${name}`)

test('a host choice that says what it means says it beside the option and, once chosen, under the field', async () => {
  const ui = await mount('@team(부서): [select]', {
    choices: { team: [{ value: 't-1', label: '구매', description: '물품과 용역을 사들이는 일' }, { value: 't-2', label: '총무' }] },
  })
  const field = select(ui, 'team')
  const option = Array.from(field.options).find((o) => o.value === 't-1')!
  expect(option.title).toBe('물품과 용역을 사들이는 일')
  expect(option.textContent).toBe('구매')
  const line = chosenLine(ui, 'team')!
  expect(line.hidden).toBe(true)
  expect(field.getAttribute('aria-describedby')?.split(' ')).toContain(line.id)

  field.value = 't-1'
  field.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(line.hidden).toBe(false)
  expect(line.textContent).toBe('물품과 용역을 사들이는 일')

  field.value = 't-2'
  field.dispatchEvent(new Event('change', { bubbles: true }))
  await ui.updateComplete
  expect(line.hidden).toBe(true)
})

test('the line under a field goes with the descriptions: choices that say nothing take it away', async () => {
  const ui = await mount('@team(부서): [select]', { data: { team: 't-1' }, choices: { team: [{ value: 't-1', description: '사들이는 일' }] } })
  expect(chosenLine(ui, 'team')!.textContent).toBe('사들이는 일')
  ui.choices = { team: [{ value: 't-1' }] }
  await ui.updateComplete
  expect(chosenLine(ui, 'team')).toBeNull()
  expect(select(ui, 'team').hasAttribute('aria-describedby')).toBe(false)
  expect(select(ui, 'team').options[select(ui, 'team').selectedIndex].hasAttribute('title')).toBe(false)
})

test('a description is text, not markup', async () => {
  const ui = await mount('@team(부서): [select]', { data: { team: 't-1' }, choices: { team: [{ value: 't-1', description: '<b>굵게</b>' }] } })
  const line = chosenLine(ui, 'team')!
  expect(line.textContent).toBe('<b>굵게</b>')
  expect(line.querySelector('b')).toBeNull()
})

test('a radio group shows what each host choice means in its label', async () => {
  const ui = await mount('@team(부서): [radio options="총무"]', { choices: { team: [{ value: '구매', description: '사들이는 일' }] } })
  const input = ui.shadowRoot!.querySelector<HTMLInputElement>('input[name="team"][value="구매"]')!
  const note = input.closest('label')!.querySelector('.formdown-choice-description')!
  expect(note.textContent).toBe('사들이는 일')
  expect(input.closest('label')!.querySelector('span')!.textContent).toBe('구매')
  ui.choices = { team: [{ value: '구매' }] }
  await ui.updateComplete
  expect(ui.shadowRoot!.querySelector('input[name="team"][value="구매"]')!.closest('label')!.querySelector('.formdown-choice-description')).toBeNull()
})

test('a long select lists what each choice means under it, filters by the label only, and says the chosen one under the field', async () => {
  const many = Array.from({ length: 12 }, (_, i) => ({ value: `t-${i}`, label: `부서 ${i}`, description: i === 3 ? '사들이는 일' : undefined }))
  const ui = await mount('@team(부서): [select]', { choices: { team: many } })
  ;(ui as Ui & { filterSelectAbove: number }).filterSelectAbove = 10
  await ui.updateComplete
  const input = ui.shadowRoot!.querySelector<HTMLInputElement>('.formdown-select-filter-input')!
  input.value = '사들'
  input.dispatchEvent(new Event('input'))
  expect(ui.shadowRoot!.querySelectorAll('.formdown-select-filter-list [role="option"]').length).toBe(0)
  input.value = '부서 3'
  input.dispatchEvent(new Event('input'))
  const item = ui.shadowRoot!.querySelector('.formdown-select-filter-list [role="option"]')!
  expect(item.querySelector('.formdown-select-filter-description')!.textContent).toBe('사들이는 일')
  expect(input.getAttribute('aria-describedby')?.split(' ')).toContain('formdown-chosen-description-team')
  ;(item as HTMLElement).click()
  await ui.updateComplete
  const line = chosenLine(ui, 'team')!
  expect(line.textContent).toBe('사들이는 일')
  expect(line.previousElementSibling?.classList.contains('formdown-select-filter')).toBe(true)
})

describe('a chosen description beside what else describes the field', () => {
  type Full = Ui & { fieldStates: Record<string, unknown>; validate(): { isValid: boolean } }
  const form = '@owner(담당)*: [select]'
  const offered = { owner: [{ value: 'c-17', label: '이유랩', description: '본사 운영팀' }] }
  const root = (ui: Ui) => ui.shadowRoot!
  const described = (ui: Ui) => (select(ui, 'owner').getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean)
  const parts = (ui: Ui) => described(ui).map((id) => root(ui).getElementById(id)?.getAttribute('part'))

  test('a suggestion note, an error and the description line all show, each pointed at once', async () => {
    const ui = (await mount(form, { choices: offered, data: { owner: 'c-17' } })) as Full
    ui.fieldStates = { owner: { note: '지난 기록에서' } }
    await ui.updateComplete
    ui.data = { owner: '' }
    await ui.updateComplete
    ui.validate()
    await ui.updateComplete
    expect(parts(ui)).toEqual(['chosen-description', 'field-error'])
    expect(root(ui).querySelector('[part=chosen-description]')!.hasAttribute('hidden')).toBe(true)
    expect(root(ui).querySelector('[part=field-error]')).not.toBeNull()
    expect(root(ui).querySelector('.formdown-field-note, [data-formdown-note]')).not.toBeNull()
  })

  test('descriptions given while an error shows stay pointed at once the error goes', async () => {
    const ui = (await mount(form)) as Full
    ui.validate()
    await ui.updateComplete
    ui.choices = offered
    await ui.updateComplete
    expect(parts(ui)).toEqual(['field-error', 'chosen-description'])
    ui.data = { owner: 'c-17' }
    await ui.updateComplete
    expect(parts(ui)).toEqual(['chosen-description'])
    expect(root(ui).querySelector('[part=chosen-description]')!.textContent).toBe('본사 운영팀')
  })

  test('descriptions taken away while an error shows leave nothing pointed at once the error goes', async () => {
    const ui = (await mount(form, { choices: offered })) as Full
    ui.validate()
    await ui.updateComplete
    ui.choices = { owner: [{ value: 'c-17', label: '이유랩' }] }
    await ui.updateComplete
    expect(parts(ui)).toEqual(['field-error'])
    ui.data = { owner: 'c-17' }
    await ui.updateComplete
    expect(select(ui, 'owner').hasAttribute('aria-describedby')).toBe(false)
  })
})
