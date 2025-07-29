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
        it('should validate fields using registered validators', () => {
            const testPlugin: FieldTypePlugin = {
                type: 'custom',
                validator: (field: Field, value: any) => {
                    if (!value) {
                        return [{ type: 'required', message: 'Field is required' }]
                    }
                    return []
                }
            }

            registry.register(testPlugin)

            const field: Field = { name: 'test', type: 'custom', label: 'Test' }
            const rules = registry.validateField(field, '')

            expect(rules).toHaveLength(1)
            expect(rules[0]).toEqual({
                type: 'required',
                message: 'Field is required'
            })
        })

        it('should return empty array when no validator exists', () => {
            const field: Field = { name: 'test', type: 'unknown', label: 'Test' }
            const rules = registry.validateField(field, 'value')

            expect(rules).toEqual([])
        })
    })

    describe('Data processing', () => {
        it('should process field data using registered processors', () => {
            const testPlugin: FieldTypePlugin = {
                type: 'custom',
                dataProcessor: {
                    processInput: (value: any) => value.toUpperCase(),
                    processOutput: (value: any) => value.toLowerCase(),
                    serialize: (value: any) => JSON.stringify(value),
                    deserialize: (value: string) => JSON.parse(value)
                }
            }

            registry.register(testPlugin)

            const field: Field = { name: 'test', type: 'custom', label: 'Test' }

            expect(registry.processFieldData(field, 'hello', 'input')).toBe('HELLO')
            expect(registry.processFieldData(field, 'WORLD', 'output')).toBe('world')
            expect(registry.processFieldData(field, { data: 'test' }, 'serialize')).toBe('{"data":"test"}')
            expect(registry.processFieldData(field, '{"data":"test"}', 'deserialize')).toEqual({ data: 'test' })
        })

        it('should return original value when no processor exists', () => {
            const field: Field = { name: 'test', type: 'unknown', label: 'Test' }
            const result = registry.processFieldData(field, 'value', 'input')

            expect(result).toBe('value')
        })
    })

    describe('Data validation', () => {
        it('should validate field data using registered validators', () => {
            const testPlugin: FieldTypePlugin = {
                type: 'custom',
                dataProcessor: {
                    validate: (value: any) => {
                        if (typeof value !== 'string') {
                            return { valid: false, error: 'Must be a string' }
                        }
                        return { valid: true }
                    }
                }
            }

            registry.register(testPlugin)

            const field: Field = { name: 'test', type: 'custom', label: 'Test' }

            expect(registry.validateFieldData(field, 'valid')).toEqual({ valid: true })
            expect(registry.validateFieldData(field, 123)).toEqual({
                valid: false,
                error: 'Must be a string'
            })
        })

        it('should return valid when no validator exists', () => {
            const field: Field = { name: 'test', type: 'unknown', label: 'Test' }
            const result = registry.validateFieldData(field, 'any value')

            expect(result).toEqual({ valid: true })
        })
    })

    describe('Schema generation', () => {
        it('should generate schema using registered generators', () => {
            const testPlugin: FieldTypePlugin = {
                type: 'custom',
                schemaGenerator: (field: Field) => ({
                    type: 'string',
                    title: field.label,
                    required: field.required
                })
            }

            registry.register(testPlugin)

            const field: Field = { name: 'test', type: 'custom', label: 'Test', required: true }
            const schema = registry.generateFieldSchema(field)

            expect(schema).toEqual({
                type: 'string',
                title: 'Test',
                required: true
            })
        })

        it('should return null when no schema generator exists', () => {
            const field: Field = { name: 'test', type: 'unknown', label: 'Test' }
            const schema = registry.generateFieldSchema(field)

            expect(schema).toBeNull()
        })
    })

    describe('Styles and scripts management', () => {
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

        it('should collect and return all scripts', () => {
            const plugin1: FieldTypePlugin = {
                type: 'type1',
                clientScript: 'console.log("type1");'
            }

            const plugin2: FieldTypePlugin = {
                type: 'type2',
                clientScript: 'console.log("type2");'
            }

            registry.register(plugin1)
            registry.register(plugin2)

            const allScripts = registry.getAllScripts()
            expect(allScripts).toContain('console.log("type1");')
            expect(allScripts).toContain('console.log("type2");')
        })
    })

    describe('Statistics and management', () => {
        it('should provide registry statistics', () => {
            const plugin1: FieldTypePlugin = {
                type: 'type1',
                styles: '.type1 { color: red; }',
                clientScript: 'console.log("type1");'
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
            expect(stats.typesWithScripts).toEqual(['type1'])
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