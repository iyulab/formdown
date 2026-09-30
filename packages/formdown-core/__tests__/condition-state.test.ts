import { conditionHolds, conditionState, getSchema, parseFormdown, validateForm } from '../src/index'

describe('conditionHolds', () => {
    it('compares text exactly, and finds a value in a list', () => {
        const is = (value: unknown) => conditionHolds({ field: 'type', operator: '=', value: 'Business' }, { type: value })
        expect([is('Business'), is('business'), is(''), is(undefined), is(['Web', 'Business']), is(['Web'])]).toEqual([
            true, false, false, false, true, false,
        ])
        expect(conditionHolds({ field: 'type', operator: '!=', value: 'Business' }, { type: 'Individual' })).toBe(true)
        expect(conditionHolds({ field: 'type', operator: '!=', value: 'Business' }, {})).toBe(true)
    })

    it('counts true, non-empty text and a non-empty list as set', () => {
        const set = (value: unknown) => conditionHolds({ field: 'x', operator: 'truthy' }, { x: value })
        expect([true, 'true', 'yes', ['a'], false, 'false', '', '  ', [], undefined, null].map(set)).toEqual([
            true, true, true, true, false, false, false, false, false, false, false,
        ])
        expect(conditionHolds({ field: 'x', operator: 'falsy' }, { x: false })).toBe(true)
    })
})

describe('conditionState', () => {
    it('leaves a field without conditions visible, enabled and not required by them', () => {
        expect(conditionState(undefined, {})).toEqual({ visible: true, enabled: true, required: false })
    })

    it('combines visible-if with hidden-if, and enabled-if with disabled-if', () => {
        const conditions = {
            visibleIf: { field: 'a', operator: 'truthy' as const },
            hiddenIf: { field: 'b', operator: 'truthy' as const },
            disabledIf: { field: 'c', operator: 'truthy' as const },
        }
        expect(conditionState(conditions, { a: true }).visible).toBe(true)
        expect(conditionState(conditions, { a: true, b: true }).visible).toBe(false)
        expect(conditionState(conditions, {}).visible).toBe(false)
        expect(conditionState(conditions, { c: 'on' }).enabled).toBe(false)
    })

    it('requires a field only while it can be filled in', () => {
        const conditions = { requiredIf: { field: 'coupon', operator: 'truthy' as const }, visibleIf: { field: 'coupon', operator: 'truthy' as const } }
        expect(conditionState(conditions, { coupon: true }).required).toBe(true)
        expect(conditionState(conditions, {}).required).toBe(false)
    })
})

describe('Conditions on fields named in any script', () => {
    it('are parsed from the source', () => {
        const [, company] = parseFormdown('@구분{개인,법인}: r[]\n@회사명: [text visible-if="구분=법인" required-if="구분=법인"]').forms
        expect(company.conditions).toEqual({
            visibleIf: { field: '구분', operator: '=', value: '법인' },
            requiredIf: { field: '구분', operator: '=', value: '법인' },
        })
        expect(parseFormdown('@동의: c[]\n@사유: [textarea visible-if="!동의"]').forms[1].conditions?.visibleIf).toEqual({
            field: '동의',
            operator: 'falsy',
        })
    })
})

describe('validateForm with conditions', () => {
    const schema = getSchema('@구분{개인,법인}: r[]\n@회사명: [text visible-if="구분=법인" required-if="구분=법인"]\n@이름*: []')

    it('asks for a field its required-if makes required', () => {
        expect(validateForm({ 구분: '법인', 이름: '김' }, schema).errors.map((e) => e.field)).toEqual(['회사명'])
        expect(validateForm({ 구분: '법인', 이름: '김', 회사명: '주식회사' }, schema).isValid).toBe(true)
    })

    it('does not ask for a field its conditions hide', () => {
        expect(validateForm({ 구분: '개인', 이름: '김' }, schema).isValid).toBe(true)
        expect(validateForm({ 구분: '개인' }, schema).errors.map((e) => e.field)).toEqual(['이름'])
    })
})
