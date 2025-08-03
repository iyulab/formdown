/**
 * @fileoverview Extension Integration Tests
 * Tests for the extension system integration with core functionality
 */

import { 
    parseFormdown, 
    generateFormHTML, 
    getSchema,
    extensionManager,
    registerPlugin,
    registerHook
} from '../src/index'

import type { Plugin, Hook, HookContext } from '../src/extensions/types'
import type { Field } from '../src/types'

describe('Extension Integration', () => {
    beforeAll(async () => {
        // Initialize extension system once for all tests
        try {
            await extensionManager.initialize()
        } catch (error) {
            // Ignore if already initialized
            if (!(error instanceof Error) || !error.message?.includes('already registered')) {
                throw error
            }
        }
    })

    afterAll(async () => {
        // Clean up extension system after all tests
        // Note: Only destroy if we're the last test suite
        try {
            await extensionManager.destroy()
        } catch (error) {
            // Ignore destruction errors during test cleanup
        }
    })

    describe('Parser Extension Integration', () => {
        test('should allow custom field type parsing', async () => {
            const customPlugin: Plugin = {
                metadata: {
                    name: 'custom-parser-plugin',
                    version: '1.0.0'
                },
                fieldTypes: [{
                    type: 'rating',
                    parser: (content: string, context: HookContext): Field | null => {
                        return {
                            name: 'rating_field',
                            type: 'rating',
                            label: 'Rating',
                            attributes: { 
                                min: 1, 
                                max: 5,
                                'data-widget': 'star-rating'
                            }
                        }
                    }
                }]
            }

            await registerPlugin(customPlugin)

            // Test that the custom field type is registered
            const stats = extensionManager.getStats()
            expect(stats.fieldTypes).toContain('rating')
        })

        test('should integrate custom validators', async () => {
            const validatorPlugin: Plugin = {
                metadata: {
                    name: 'validator-plugin',
                    version: '1.0.0'
                },
                validators: [{
                    name: 'creditcard',
                    validate: (value: any) => {
                        // Simple credit card validation (Luhn algorithm)
                        if (typeof value !== 'string') return false
                        const nums = value.replace(/\D/g, '')
                        if (nums.length < 13 || nums.length > 19) return false
                        
                        let sum = 0
                        let isEven = false
                        for (let i = nums.length - 1; i >= 0; i--) {
                            let digit = parseInt(nums[i], 10)
                            if (isEven) {
                                digit *= 2
                                if (digit > 9) digit -= 9
                            }
                            sum += digit
                            isEven = !isEven
                        }
                        return sum % 10 === 0
                    },
                    getMessage: () => 'Please enter a valid credit card number'
                }]
            }

            await registerPlugin(validatorPlugin)
            
            const stats = extensionManager.getStats()
            expect(stats.validators).toContain('creditcard')
        })

        test('should support custom renderer plugins', async () => {
            const rendererPlugin: Plugin = {
                metadata: {
                    name: 'renderer-plugin',
                    version: '1.0.0'
                },
                renderers: [{
                    template: 'bootstrap-input',
                    render: (field: Field, context: HookContext): string => {
                        const required = field.required ? ' required' : ''
                        return `
                            <div class="form-group">
                                <label class="form-label" for="${field.name}">${field.label}</label>
                                <input 
                                    type="${field.type}" 
                                    class="form-control" 
                                    id="${field.name}" 
                                    name="${field.name}"${required}>
                            </div>
                        `
                    }
                }]
            }

            await registerPlugin(rendererPlugin)
            
            const stats = extensionManager.getStats()
            expect(stats.renderers).toContain('bootstrap-input')
        })
    })

    describe('Hook System Integration', () => {
        test('should execute pre-parse hooks', async () => {
            let hookExecuted = false
            
            const preParseHook: Hook = {
                name: 'pre-parse',
                priority: 1,
                handler: (context: HookContext) => {
                    hookExecuted = true
                    return context
                }
            }

            registerHook(preParseHook)
            
            // Execute hooks during parsing
            await extensionManager.executeHooks('pre-parse', { input: '@test: [text]' })
            
            expect(hookExecuted).toBe(true)
        })

        test('should execute field-parse hooks for field modification', async () => {
            const fieldParseHook: Hook = {
                name: 'field-parse',
                priority: 1,
                handler: (context: HookContext) => {
                    if (context.field && context.field.type === 'text') {
                        return {
                            ...context.field,
                            attributes: {
                                ...context.field.attributes,
                                'data-enhanced': 'true'
                            }
                        }
                    }
                    return context.field
                }
            }

            registerHook(fieldParseHook)
            
            const result = await extensionManager.executeHooks('field-parse', {
                field: {
                    name: 'test',
                    type: 'text',
                    label: 'Test',
                    attributes: { form: "formdown-form-default" }
                }
            })

            const enhancedField = result[0] as Field
            expect(enhancedField.attributes?.['data-enhanced']).toBe('true')
        })

        test('should execute field-validate hooks', async () => {
            let validationExecuted = false
            
            const validateHook: Hook = {
                name: 'field-validate',
                priority: 1,
                handler: (context: HookContext, value: any) => {
                    validationExecuted = true
                    return { valid: true, message: '' }
                }
            }

            registerHook(validateHook)
            
            await extensionManager.executeHooks('field-validate', {
                field: { name: 'test', type: 'text', label: 'Test', attributes: {} }
            }, 'test value')
            
            expect(validationExecuted).toBe(true)
        })

        test('should execute pre-generate and post-generate hooks', async () => {
            const executionOrder: string[] = []
            
            const preGenerateHook: Hook = {
                name: 'pre-generate',
                priority: 1,
                handler: (context: HookContext) => {
                    executionOrder.push('pre-generate')
                    return context
                }
            }

            const postGenerateHook: Hook = {
                name: 'post-generate',
                priority: 1,
                handler: (context: HookContext, html: string) => {
                    executionOrder.push('post-generate')
                    return html
                }
            }

            registerHook(preGenerateHook)
            registerHook(postGenerateHook)
            
            await extensionManager.executeHooks('pre-generate', {})
            await extensionManager.executeHooks('post-generate', {}, '<html></html>')
            
            expect(executionOrder).toEqual(['pre-generate', 'post-generate'])
        })
    })

    describe('End-to-End Extension Integration', () => {
        test('should integrate custom plugin throughout the entire pipeline', async () => {
            // Create a comprehensive plugin that affects parsing, validation, and rendering
            const comprehensivePlugin: Plugin = {
                metadata: {
                    name: 'comprehensive-plugin',
                    version: '1.0.0',
                    description: 'Tests end-to-end integration'
                },
                fieldTypes: [{
                    type: 'phone',
                    parser: (content: string, context: HookContext): Field => ({
                        name: 'phone_field',
                        type: 'phone',
                        label: 'Phone Number',
                        attributes: {
                            pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
                            placeholder: '123-456-7890'
                        }
                    }),
                    generator: (field: Field, context: HookContext): string => {
                        return `
                            <div class="phone-field">
                                <label for="${field.name}">${field.label}</label>
                                <input 
                                    type="tel" 
                                    id="${field.name}" 
                                    name="${field.name}"
                                    pattern="${field.attributes?.pattern || ''}"
                                    placeholder="${field.attributes?.placeholder || ''}"
                                    class="phone-input">
                            </div>
                        `
                    }
                }],
                validators: [{
                    name: 'phone-format',
                    validate: (value: string) => {
                        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/
                        return phoneRegex.test(value)
                    },
                    getMessage: () => 'Please enter phone number in format 123-456-7890'
                }],
                hooks: [{
                    name: 'post-parse',
                    priority: 1,
                    handler: (context: HookContext) => {
                        // Add metadata to all parsed fields
                        if (context.parseResult?.fields) {
                            context.parseResult.fields.forEach(field => {
                                field.attributes = {
                                    ...field.attributes,
                                    'data-processed-by': 'comprehensive-plugin'
                                }
                            })
                        }
                        return context
                    }
                }]
            }

            await registerPlugin(comprehensivePlugin)
            
            // Test the integration
            const stats = extensionManager.getStats()
            expect(stats.fieldTypes).toContain('phone')
            expect(stats.validators).toContain('phone-format')
            expect(stats.plugins.some(p => p.name === 'comprehensive-plugin')).toBe(true)
        })

        test('should handle plugin initialization and cleanup', async () => {
            let initCalled = false
            let destroyCalled = false
            
            const lifecyclePlugin: Plugin = {
                metadata: {
                    name: 'lifecycle-plugin',
                    version: '1.0.0'
                },
                initialize: async () => {
                    initCalled = true
                },
                destroy: async () => {
                    destroyCalled = true
                }
            }

            await registerPlugin(lifecyclePlugin)
            expect(initCalled).toBe(true)
            
            await extensionManager.destroy()
            expect(destroyCalled).toBe(true)

            // Clear plugin state completely and reinitialize for subsequent tests
            try {
                await extensionManager.initialize()
            } catch (error) {
                // Handle case where core plugin is already registered
                if (error instanceof Error && error.message?.includes('already registered')) {
                    // System is in a good state, continue
                } else {
                    throw error
                }
            }
        })

        test('should handle plugin dependencies', async () => {
            // Ensure extension system is initialized
            try {
                await extensionManager.initialize()
            } catch (error) {
                // Ignore if already initialized
                if (!(error instanceof Error) || !error.message?.includes('already registered')) {
                    throw error
                }
            }

            const dependentPlugin: Plugin = {
                metadata: {
                    name: 'dependent-plugin',
                    version: '1.0.0',
                    dependencies: ['formdown-core']
                }
            }

            // Should register successfully since formdown-core is already registered
            await expect(registerPlugin(dependentPlugin)).resolves.not.toThrow()
        })
    })

    describe('Error Handling in Extensions', () => {
        beforeEach(async () => {
            // Clean up any existing state and reinitialize for clean test environment
            try {
                await extensionManager.destroy()
            } catch (error) {
                // Ignore if already destroyed
            }
            await extensionManager.initialize()
        })

        test('should handle plugin registration errors gracefully', async () => {
            const faultyPlugin: Plugin = {
                metadata: {
                    name: 'faulty-plugin',
                    version: '1.0.0'
                },
                initialize: async () => {
                    throw new Error('Initialization failed')
                }
            }

            // Should not throw, but warn and continue (with errorStrategy: 'warn')
            await expect(registerPlugin(faultyPlugin)).resolves.not.toThrow()
            
            // Plugin should still be registered even though initialization failed
            const stats = extensionManager.getStats()
            const pluginNames = stats.plugins.map((p: any) => p.name || p)
            expect(pluginNames).toContain('faulty-plugin')
        })

        test('should handle hook execution errors', async () => {
            const errorHook: Hook = {
                name: 'field-parse',
                priority: 1,
                handler: () => {
                    throw new Error('Hook execution failed')
                }
            }

            registerHook(errorHook)
            
            // Should not crash the system
            const result = await extensionManager.executeHooks('field-parse', {})
            expect(result).toBeDefined()
        })

        test('should handle hook timeouts', async () => {
            const slowHook: Hook = {
                name: 'field-parse',
                priority: 1,
                handler: async () => {
                    // Simulate a slow operation (longer than timeout)
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    return 'completed'
                }
            }

            registerHook(slowHook)
            
            // Should timeout and not hang the system (with errorStrategy: 'warn')
            const start = Date.now()
            const result = await extensionManager.executeHooks('field-parse', {})
            const duration = Date.now() - start
            
            // Should timeout within reasonable bounds (around 1000ms + some buffer)
            expect(duration).toBeGreaterThan(900) // Should take at least the timeout duration
            expect(duration).toBeLessThan(1200) // Should timeout with small buffer
            expect(result).toEqual([]) // Should return empty array when hooks fail
        })
    })

    describe('Extension System Performance', () => {
        beforeEach(async () => {
            // Clean up any existing state and reinitialize
            try {
                await extensionManager.destroy()
            } catch (error) {
                // Ignore if already destroyed
            }
            await extensionManager.initialize()
        })

        test('should handle many plugins efficiently', async () => {
            const plugins = Array.from({ length: 10 }, (_, i) => ({
                metadata: {
                    name: `performance-plugin-${i}`,
                    version: '1.0.0'
                },
                fieldTypes: [{
                    type: `custom-${i}`,
                    defaultAttributes: { index: i }
                }]
            }))

            const start = performance.now()
            
            for (const plugin of plugins) {
                await registerPlugin(plugin)
            }
            
            const end = performance.now()
            
            expect(end - start).toBeLessThan(100) // Should register all plugins quickly
            
            const stats = extensionManager.getStats()
            expect(stats.plugins.length).toBeGreaterThanOrEqual(10)
        })

        test('should execute multiple hooks efficiently', async () => {
            // Register multiple hooks
            for (let i = 0; i < 20; i++) {
                registerHook({
                    name: 'field-parse',
                    priority: i,
                    handler: (context: HookContext) => context
                })
            }

            const start = performance.now()
            
            await extensionManager.executeHooks('field-parse', {
                field: { name: 'test', type: 'text', label: 'Test', attributes: {} }
            })
            
            const end = performance.now()
            
            expect(end - start).toBeLessThan(50) // Should execute all hooks quickly
        })
    })
})