/**
 * @jest-environment jsdom
 */
import { parseFormdown, generateFormHTML } from '../src/index'

// A document can hold a value its choice field does not offer: written by hand or by another tool,
// or saved before the option was renamed. The form shows it as it is, so that nothing reads it as empty.
function render(frontMatter: string, field: string): HTMLElement {
    const container = document.createElement('div')
    container.innerHTML = generateFormHTML(parseFormdown(`---\n${frontMatter}\n---\n\n${field}`))
    return container
}

describe('A value its choice field does not offer', () => {
    it('is the selected option of a select, after the ones it offers', () => {
        const select = render('owner: Vendor', '@owner: [select options="Kim,Lee"]').querySelector('select')!
        expect(Array.from(select.options).map((o) => o.value)).toEqual(['Kim', 'Lee', 'Vendor'])
        expect(select.value).toBe('Vendor')
        expect(select.options[2].hasAttribute('data-formdown-unlisted')).toBe(true)
        expect(select.options[0].hasAttribute('data-formdown-unlisted')).toBe(false)
    })

    it('is the checked radio of a group, after the ones it offers', () => {
        const radios = Array.from(render('os: Linux', '@os: [radio options="Windows,Mac"]').querySelectorAll<HTMLInputElement>('input[type=radio]'))
        expect(radios.map((r) => [r.value, r.checked])).toEqual([['Windows', false], ['Mac', false], ['Linux', true]])
        expect(radios[2].hasAttribute('data-formdown-unlisted')).toBe(true)
        expect(radios[2].closest('label')!.textContent!.trim()).toBe('Linux')
    })

    it('is a checked box of a group for each value the group does not offer', () => {
        const boxes = Array.from(render('tags: [Web, Print, Radio]', '@tags: [checkbox options="Web,Mobile"]').querySelectorAll<HTMLInputElement>('input[type=checkbox]'))
        expect(boxes.map((b) => [b.value, b.checked])).toEqual([['Web', true], ['Mobile', false], ['Print', true], ['Radio', true]])
        expect(boxes.filter((b) => b.hasAttribute('data-formdown-unlisted')).map((b) => b.value)).toEqual(['Print', 'Radio'])
    })

    it('adds nothing when the value is one it offers, or there is none', () => {
        for (const frontMatter of ['owner: Kim', 'owner: ""', 'other: 1']) {
            const select = render(frontMatter, '@owner: [select options="Kim,Lee"]').querySelector('select')!
            expect(Array.from(select.options).map((o) => o.value)).toEqual(['Kim', 'Lee'])
        }
    })

    it('is escaped like any option', () => {
        const select = render('owner: "<b>x</b>"', '@owner: [select options="Kim"]').querySelector('select')!
        expect(select.querySelector('b')).toBeNull()
        expect(select.value).toBe('<b>x</b>')
    })

    it('is left to the "other" input when the field allows one', () => {
        const select = render('owner: Vendor', '@owner: [select options="Kim,Lee,*"]').querySelector('select')!
        expect(select.querySelector('[data-formdown-unlisted]')).toBeNull()
    })
})
