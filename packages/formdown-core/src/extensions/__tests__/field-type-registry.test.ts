/**
 * @fileoverview Tests for Field Type Registry System
 */

import { FieldTypeRegistry } from '../field-type-registry.js'
import type { FieldTypePlugin, HookContext } from '../types.js'
import type { Field } from '../../types.js'

describe('FieldTypeRegistry', () => {
    let registry: FieldTypeRegistry

    beforeEach(() => {
        registry = new FieldTypeRegistry()
    })

    describe('Basic registration and retrieval', () => {
        it('should register and retrieve field types', () => {
            const testPlugin: FieldTypePlugin = {
                type: 'test',
                parser: () => null
            }

            registry.register(testPlugin)

            expect(registry.has('test')).toBe(true)
            expect(registry.get('test')).toBe(testPlugin)
        })

        it('should throw error when registering duplicate types', () => {
            const plugin1: FieldTypePlugin = { type: 'test', parser: () => null }
            const plugin2: FieldTypePlugin = { type: 'test', parser: () => null }

            registry.register(plugin1)

            expect(() => {
                registry.register(plugin2)
            }).toThrow("Field type 'test' is already registered")
        })

        it('should unregister field types', () => {
            const testPlugin: FieldTypePlugin = {
                type: 'test',
                parser: () => null
            }

            registry.register(testPlugin)
            expect(registry.has('test')).toBe(true)

            registry.unregister('test')
            expect(registry.has('test')).toBe(false)
            expect(registry.get('test')).toBeUndefined()
        })
    })

    describe('Field parsing', () => {
        it('should parse fields using registered parsers', () => {
            const mockField: Field = {
                name: 'test',
                type: 'custom',
                label: 'Test Field'
            }

            const testPlugin: FieldTypePlugin = {
                type: 'custom',
                parser: (content: string, context: HookContext) => {
                    if (content.includes('@test')) {
                        return mockField
                    }
                    return null
                }
            }

            registry.register(testPlugin)

            const context: HookContext = { input: '@test: [custom]' }
            const result = registry.parseField('@test: [custom]', context)

            expect(result).toBe(mockField)
        })

        it('should apply default attributes when parsing', () => {
            const testPlugin: FieldTypePlugin = {
                type: 'custom',
                parser: () => ({
                    name: 'test',
                    type: 'custom',
                    label: 'Test'
                }),
                defaultAttributes: {
                    placeholder: 'Default placeholder',
                    required: true
                }
            }

            registry.register(testPlugin)

            const context: HookContext = { input: '@test: [custom]' }
            const result = registry.parseField('@test: [custom]', context)

            expect(result?.attributes).toEqual({
                placeholder: 'Default placeholder',
                required: true
            })
        })

        it('should return null when no parser matches', () => {
            const context: HookContext = { input: '@unknown: [type]' }
            const result = registry.parseField('@unknown: [type]', context)

            expect(result).toBeNull()
        })
    })

    describe('HTML generation', () => {
        it('should generate HTML using registered generators', () => {
            const testPlugin: FieldTypePlugin = {
                type: 'custom',
                generator: (field: Field) => `<input type="custom" name="${field.name}" />`
            }

            registry.register(testPlugin)

            const field: Field = { name: 'test', type: 'custom', label: 'Test' }
            const context: HookContext = { field }
            const result = registry.generateFieldHTML(field, context)

            expect(result).toBe('<input type="custom" name="test" />')
        })

        it('should return null when no generator exists', () => {
            const field: Field = { name: 'test', type: 'unknown', label: 'Test' }
            const context: HookContext = { field }
            const result = registry.generateFieldHTML(field, context)

            expect(result).toBeNull()
        })
    })

    describe('Field validation', () => {
        it("returns the messages of the type's validator", () => {
            registry.register({
                type: 'custom',
                validator: (value, field) => (String(value).includes('@') ? [] : [`${field.label} needs an @`]),
            })

            expect(registry.validate('a', { name: 'test', type: 'custom', label: 'Test' })).toEqual(['Test needs an @'])
            expect(registry.validate('a@b', { name: 'test', type: 'custom', label: 'Test' })).toEqual([])
        })

        it('finds nothing for a type without a validator, or a field without a type', () => {
            expect(registry.validate('value', { name: 'test', type: 'unknown' })).toEqual([])
            expect(registry.validate('value', { name: 'test' })).toEqual([])
        })
    })

    describe('Styles', () => {
        it('should collect and return all styles', () => {
            const plugin1: FieldTypePlugin = {
                type: 'type1',
                styles: '.type1 { color: red; }'
            }

            const plugin2: FieldTypePlugin = {
                type: 'type2',
                styles: '.type2 { color: blue; }'
            }

            registry.register(plugin1)
            registry.register(plugin2)

            const allStyles = registry.getAllStyles()
            expect(allStyles).toContain('.type1 { color: red; }')
            expect(allStyles).toContain('.type2 { color: blue; }')
        })

        it('should return styles for specific types', () => {
            const plugin1: FieldTypePlugin = {
                type: 'type1',
                styles: '.type1 { color: red; }'
            }

            const plugin2: FieldTypePlugin = {
                type: 'type2',
                styles: '.type2 { color: blue; }'
            }

            registry.register(plugin1)
            registry.register(plugin2)

            const specificStyles = registry.getStylesForTypes(['type1'])
            expect(specificStyles).toBe('.type1 { color: red; }')
            expect(specificStyles).not.toContain('.type2 { color: blue; }')
        })
    })

    describe('Statistics and management', () => {
        it('should provide registry statistics', () => {
            const plugin1: FieldTypePlugin = {
                type: 'type1',
                styles: '.type1 { color: red; }',
            }

            const plugin2: FieldTypePlugin = {
                type: 'type2'
            }

            registry.register(plugin1)
            registry.register(plugin2)

            const stats = registry.getStats()
            
            expect(stats.registeredTypes).toEqual(['type1', 'type2'])
            expect(stats.totalTypes).toBe(2)
            expect(stats.typesWithStyles).toEqual(['type1'])
        })

        it('should clear all registrations', () => {
            const plugin: FieldTypePlugin = { type: 'test' }

            registry.register(plugin)
            expect(registry.has('test')).toBe(true)

            registry.clear()
            expect(registry.has('test')).toBe(false)
            expect(registry.getStats().totalTypes).toBe(0)
        })
    })
})