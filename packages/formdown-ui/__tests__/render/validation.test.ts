// validate() checks what each field declares and draws what it finds by the field, with the real core.
import '../../src/formdown-ui'
import { messages as ko } from '../../../formdown-core/src/messages/ko'

type Ui = HTMLElement & {
  content: string
  data: Record<string, unknown>
  messages: Record<string, string>
  updateComplete: Promise<boolean>
  validate(): { isValid: boolean; errors: { field: string; message: string }[] }
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

async function mount(content: string) {
  const ui = document.createElement('formdown-ui') as Ui
  ui.content = content
  document.body.appendChild(ui)
  await ui.updateComplete
  await tick()
  return ui
}

async function set(ui: Ui, data: Record<string, unknown>) {
  ui.data = data
  await ui.updateComplete
}

const field = (ui: Ui, name: string) =>
  Array.from(ui.shadowRoot!.querySelectorAll<HTMLInputElement>('[name]')).find((el) => el.getAttribute('name') === name)!
const errorOf = (ui: Ui, name: string) => {
  const ids = (field(ui, name).getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean)
  return ids.map((id) => ui.shadowRoot!.getElementById(id)).find((el) => el?.getAttribute('part') === 'field-error')
}

afterEach(() => {
  document.body.innerHTML = ''
})

const form = `@title(Title): [text required minlength=3 maxlength=5]
@n: [number min=0 max=10]
@mail: [email]
@code: [text pattern="^[A-Z]+$"]`

test('validate() holds every declared rule, not only required', async () => {
  const ui = await mount(form)
  expect(ui.validate()).toEqual({ isValid: false, errors: [{ field: 'title', message: 'Title is required' }] })

  await set(ui, { title: 'abcdefgh', n: 50, mail: 'nope', code: 'abc' })
  expect(ui.validate().errors.map((e) => e.field)).toEqual(['title', 'n', 'mail', 'code'])
})

test('a field that broke a rule says so beside it, and is marked invalid', async () => {
  const ui = await mount(form)
  await set(ui, { title: 'ab', n: 50 })
  ui.validate()

  expect(field(ui, 'title').getAttribute('aria-invalid')).toBe('true')
  expect(errorOf(ui, 'title')?.textContent).toBe('Must be at least 3 characters')
  expect(errorOf(ui, 'n')?.textContent).toBe('Value must be at most 10')
  expect(field(ui, 'mail').hasAttribute('aria-invalid')).toBe(false)
})

test('fixing the field takes its error away; the others stay', async () => {
  const ui = await mount(form)
  await set(ui, { title: 'ab', n: 50 })
  ui.validate()

  await set(ui, { title: 'abc', n: 50 })
  expect(field(ui, 'title').hasAttribute('aria-invalid')).toBe(false)
  expect(errorOf(ui, 'title')).toBeUndefined()
  expect(ui.shadowRoot!.querySelectorAll('[part="field-error"]')).toHaveLength(1)
  expect(errorOf(ui, 'n')?.textContent).toBe('Value must be at most 10')
})

test('typing into a field shown an error checks it again as it is typed', async () => {
  const ui = await mount(form)
  ui.validate()
  const title = field(ui, 'title')
  title.value = 'ab'
  title.dispatchEvent(new Event('input', { bubbles: true }))
  await ui.updateComplete
  expect(errorOf(ui, 'title')?.textContent).toBe('Must be at least 3 characters')

  title.value = 'abc'
  title.dispatchEvent(new Event('input', { bubbles: true }))
  await ui.updateComplete
  expect(errorOf(ui, 'title')).toBeUndefined()
})

test('a field not yet validated is not told before the host asks', async () => {
  const ui = await mount(form)
  await set(ui, { title: 'ab' })
  expect(ui.shadowRoot!.querySelectorAll('[part="field-error"]')).toHaveLength(0)
})

test('says the host sentences, Korean among them', async () => {
  const ui = await mount(form)
  ui.messages = ko
  await ui.updateComplete
  await set(ui, { title: 'abcdefgh' })
  expect(ui.validate().errors).toEqual([{ field: 'title', message: '5자까지 입력할 수 있습니다' }])
  expect(errorOf(ui, 'title')?.textContent).toBe('5자까지 입력할 수 있습니다')
})

test("says the field's own sentence written in the form, for whichever rule it breaks", async () => {
  const ui = await mount('@name(Name): [text required minlength=2 error-message="Tell us your name"]')
  ui.messages = ko
  expect(ui.validate().errors).toEqual([{ field: 'name', message: 'Tell us your name' }])
  expect(errorOf(ui, 'name')?.textContent).toBe('Tell us your name')
  await set(ui, { name: 'J' })
  expect(ui.validate().errors).toEqual([{ field: 'name', message: 'Tell us your name' }])
})

test('keeps the description the field already pointed to', async () => {
  const ui = await mount('@title(Title): [text required help="Two words"]')
  const before = field(ui, 'title').getAttribute('aria-describedby')
  ui.validate()
  expect(field(ui, 'title').getAttribute('aria-describedby')).toContain(before ?? '')
  await set(ui, { title: 'ok' })
  expect(field(ui, 'title').getAttribute('aria-describedby')).toBe(before)
})
