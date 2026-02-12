import { FormManager } from '../src/form-manager'

describe('FormManager.setDefaults()', () => {
    let manager: FormManager

    beforeEach(() => {
        manager = new FormManager()
    })

    afterEach(() => {
        manager.dispose()
    })

    const formContent = `
@name: [text]
@email: [email]
@age: [number]
`

    test('should apply defaults to empty fields after parse()', () => {
        manager.parse(formContent)
        manager.setDefaults({ name: 'John', email: 'john@example.com' })

        const data = manager.getData()
        expect(data.name).toBe('John')
        expect(data.email).toBe('john@example.com')
    })

    test('should not override existing explicit values by default', () => {
        manager.parse(formContent)
        manager.setFieldValue('name', 'Jane')
        manager.setDefaults({ name: 'John', email: 'john@example.com' })

        const data = manager.getData()
        expect(data.name).toBe('Jane')
        expect(data.email).toBe('john@example.com')
    })

    test('should override existing values when override: true', () => {
        manager.parse(formContent)
        manager.setFieldValue('name', 'Jane')
        manager.setDefaults({ name: 'John', email: 'john@example.com' }, { override: true })

        const data = manager.getData()
        expect(data.name).toBe('John')
        expect(data.email).toBe('john@example.com')
    })

    test('should store pending defaults when called before parse()', () => {
        manager.setDefaults({ name: 'John', age: 25 })
        manager.parse(formContent)

        const data = manager.getData()
        expect(data.name).toBe('John')
        expect(data.age).toBe(25)
    })

    test('should clear pending defaults after parse() applies them', () => {
        manager.setDefaults({ name: 'John' })
        manager.parse(formContent)

        // Parse again — previous pending defaults should not re-apply
        manager.parse(formContent)
        const data = manager.getData()
        expect(data.name).toBeUndefined()
    })

    test('should handle empty defaults object', () => {
        manager.parse(formContent)
        manager.setDefaults({})
        const data = manager.getData()
        expect(data.name).toBeUndefined()
    })

    test('should be cleared by dispose()', () => {
        manager.setDefaults({ name: 'John' })
        manager.dispose()

        // After dispose, create a fresh parse — no defaults should apply
        manager = new FormManager()
        manager.parse(formContent)
        const data = manager.getData()
        expect(data.name).toBeUndefined()
    })
})

describe('FormDataBinding.applyDefaults()', () => {
    test('should apply defaults via FormManager', () => {
        const manager = new FormManager()
        const content = `
@first: [text]
@last: [text]
`
        manager.parse(content)
        manager.setDefaults({ first: 'A', last: 'B' })

        expect(manager.getData().first).toBe('A')
        expect(manager.getData().last).toBe('B')
        manager.dispose()
    })

    test('should respect hasExplicitValue check', () => {
        const manager = new FormManager()
        const content = '@field: [text]'
        manager.parse(content)

        // Set a value explicitly
        manager.setFieldValue('field', 'explicit')

        // Apply defaults without override — should not change
        manager.setDefaults({ field: 'default' })
        expect(manager.getData().field).toBe('explicit')

        // Apply defaults with override — should change
        manager.setDefaults({ field: 'overridden' }, { override: true })
        expect(manager.getData().field).toBe('overridden')

        manager.dispose()
    })
})
