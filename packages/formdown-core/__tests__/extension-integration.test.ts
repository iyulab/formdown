/**
 * @fileoverview Extension System Integration Tests
 * Tests integration between extensions and core functionality
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import { ExtensionManager, registerPlugin } from '../src/extensions'
import { FormdownParser } from '../src/parser'
import type { Plugin, FieldTypePlugin, HookContext } from '../src/extensions'
import type { Field } from '../src/types'

describe('Extension System Integration', () => {
    let extensionManager: ExtensionManager
    let parser: FormdownParser

    beforeEach(async () => {
        extensionManager = new ExtensionManager({ debug: false })
        await extensionManager.initialize()
        parser = new FormdownParser()
    })

    afterEach(async () => {
        await extensionManager.destroy()
    })

    describe('Custom Field Type Integration', () => {
        it('should register and use custom field types', async () => {
            // Create a custom field type plugin
            const customFieldPlugin: Plugin = {
                metadata: {
                    name: 'rating-field-plugin',
                    version: '1.0.0',
                    description: 'Adds star rating field support'
                },
                fieldTypes: [{
                    type: 'rating',
                    parser: (content: string): Field | null => {
                        const match = content.match(/@(\w+):\s*\[rating\](.*)/)
                        if (!match) return null

                        const [, name, rest] = match
                        const maxMatch = rest.match(/max=(\d+)/)
                        const max = maxMatch ? parseInt(maxMatch[1]) : 5

                        return {
                            name,
                            type: 'rating',
                            label: name,
                            attributes: { max, form: "formdown-form-default" }
                        }
                    },
                    generator: (field: Field): string => {
                        const max = Number(field.attributes?.max) || 5
                        const stars = Array.from({ length: max }, (_, i) =>
                            `<span class="star" data-value="${i + 1}">☆</span>`
                        ).join('')

                        return `<div class="rating-field" data-name="${field.name}">${stars}</div>`
                    }
                }]
            }

            // Register the plugin
            await extensionManager.registerPlugin(customFieldPlugin)

            // Verify plugin is registered
            const stats = extensionManager.getStats()
            expect(stats.fieldTypes).toContain('rating')
            expect(stats.plugins.map(p => p.name)).toContain('rating-field-plugin')

            // Test that field types are accessible via stats
            const fieldTypeStats = extensionManager.getStats()
            expect(fieldTypeStats.fieldTypes).toContain('rating')
            expect(fieldTypeStats.plugins.map(p => p.name)).toContain('rating-field-plugin')
        })

        it('should handle custom field validation', async () => {
            const validationPlugin: Plugin = {
                metadata: {
                    name: 'custom-validation-plugin',
                    version: '1.0.0'
                },
                validators: [{
                    name: 'phone',
                    validate: (value: any) => {
                        if (!value) return true
                        return /^\+?[\d\s\-\(\)]+$/.test(value)
                    },
                    getMessage: () => 'Please enter a valid phone number'
                }]
            }

            await extensionManager.registerPlugin(validationPlugin)

            const validationStats = extensionManager.getStats()
            expect(validationStats.validators).toContain('phone')
        })
    })

    describe('Hook System Integration', () => {
        it('should execute pre-parse hooks', async () => {
            let hookExecuted = false
            let inputReceived = ''

            const preprocessPlugin: Plugin = {
                metadata: {
                    name: 'preprocess-plugin',
                    version: '1.0.0'
                },
                hooks: [{
                    name: 'pre-parse',
                    priority: 10,
                    handler: (context: HookContext) => {
                        hookExecuted = true
                        inputReceived = context.input || ''
                        // Transform input before parsing
                        return context.input?.replace(/\[star\]/g, '[rating]')
                    }
                }]
            }

            await extensionManager.registerPlugin(preprocessPlugin)

            // Simulate hook execution that would happen in parser
            const context: HookContext = { input: '@feedback: [star] max=5' }
            const results = await extensionManager.executeHooks('pre-parse', context)

            expect(hookExecuted).toBe(true)
            expect(inputReceived).toBe('@feedback: [star] max=5')
            expect(results[0]).toBe('@feedback: [rating] max=5')
        })

        it('should execute post-parse hooks', async () => {
            let fieldsProcessed: Field[] = []

            const postprocessPlugin: Plugin = {
                metadata: {
                    name: 'postprocess-plugin',
                    version: '1.0.0'
                },
                hooks: [{
                    name: 'post-parse',
                    priority: 10,
                    handler: (context: HookContext) => {
                        if (context.parseResult?.fields) {
                            fieldsProcessed = context.parseResult.fields
                            // Add default CSS classes to all fields
                            context.parseResult.fields.forEach(field => {
                                field.attributes = {
                                    ...field.attributes,
                                    className: `form-field form-field--${field.type}`
                                }
                            })
                        }
                        return context.parseResult
                    }
                }]
            }

            await extensionManager.registerPlugin(postprocessPlugin)

            // Simulate post-parse hook execution
            const mockFields: Field[] = [
                { name: 'email', type: 'email', label: 'Email', attributes: { form: "formdown-form-default" } },
                { name: 'name', type: 'text', label: 'Name', attributes: { form: "formdown-form-default" } }
            ]

            const context: HookContext = {
                parseResult: { fields: mockFields, errors: [] }
            }

            await extensionManager.executeHooks('post-parse', context)

            expect(fieldsProcessed).toHaveLength(2)
            expect(mockFields[0].attributes?.className).toBe('form-field form-field--email')
            expect(mockFields[1].attributes?.className).toBe('form-field form-field--text')
        })
    })

    describe('Error Handling', () => {
        it('should handle plugin initialization errors gracefully', async () => {
            const manager = new ExtensionManager({ errorStrategy: 'warn' })

            const faultyPlugin: Plugin = {
                metadata: {
                    name: 'faulty-plugin',
                    version: '1.0.0'
                },
                initialize: async () => {
                    throw new Error('Initialization failed')
                }
            }

            // Should not throw despite plugin error
            await manager.initialize()
            await expect(manager.registerPlugin(faultyPlugin)).resolves.not.toThrow()

            await manager.destroy()
        })

        it('should handle hook execution errors', async () => {
            const manager = new ExtensionManager({ errorStrategy: 'ignore' })
            await manager.initialize()

            const errorPlugin: Plugin = {
                metadata: {
                    name: 'error-plugin',
                    version: '1.0.0'
                },
                hooks: [{
                    name: 'field-parse',
                    priority: 10,
                    handler: () => {
                        throw new Error('Hook execution failed')
                    }
                }]
            }

            await manager.registerPlugin(errorPlugin)

            // Should not throw and should return empty results
            const results = await manager.executeHooks('field-parse', {})
            expect(results).toEqual([])

            await manager.destroy()
        })
    })

    describe('Plugin Dependencies', () => {
        it('should validate plugin dependencies', async () => {
            const dependentPlugin: Plugin = {
                metadata: {
                    name: 'dependent-plugin',
                    version: '1.0.0',
                    dependencies: ['non-existent-plugin']
                }
            }

            await expect(extensionManager.registerPlugin(dependentPlugin))
                .rejects.toThrow('requires dependency')
        })

        it('should allow plugins with satisfied dependencies', async () => {
            // Register base plugin first
            const basePlugin: Plugin = {
                metadata: {
                    name: 'base-plugin',
                    version: '1.0.0'
                }
            }

            await extensionManager.registerPlugin(basePlugin)

            // Register dependent plugin
            const dependentPlugin: Plugin = {
                metadata: {
                    name: 'dependent-plugin',
                    version: '1.0.0',
                    dependencies: ['base-plugin']
                }
            }

            await expect(extensionManager.registerPlugin(dependentPlugin))
                .resolves.not.toThrow()
        })
    })

    describe('Performance', () => {
        it('should handle many hooks efficiently', async () => {
            const hookCount = 100
            let executionCount = 0

            // Register many hooks
            for (let i = 0; i < hookCount; i++) {
                const plugin: Plugin = {
                    metadata: {
                        name: `performance-plugin-${i}`,
                        version: '1.0.0'
                    },
                    hooks: [{
                        name: 'field-validate',
                        priority: i,
                        handler: () => {
                            executionCount++
                            return `result-${i}`
                        }
                    }]
                }

                await extensionManager.registerPlugin(plugin)
            }

            const start = performance.now()
            const results = await extensionManager.executeHooks('field-validate', {})
            const end = performance.now()

            expect(results).toHaveLength(hookCount)
            expect(executionCount).toBe(hookCount)
            expect(end - start).toBeLessThan(100) // Should complete in under 100ms
        })
    })
})
