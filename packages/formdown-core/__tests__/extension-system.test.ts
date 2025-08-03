/**
 * @fileoverview Extension System Tests
 * Tests for hooks, plugins, and the overall extension architecture
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import {
    ExtensionManager,
    HookManager,
    PluginManager,
    EventEmitter,
    corePlugin
} from '../src/extensions'
import type { Plugin, Hook, HookContext } from '../src/extensions'

describe('Extension System', () => {
    let extensionManager: ExtensionManager

    beforeEach(async () => {
        extensionManager = new ExtensionManager({ debug: false })
        await extensionManager.initialize()
    })

    afterEach(async () => {
        await extensionManager.destroy()
    })

    describe('ExtensionManager', () => {
        it('should initialize and destroy properly', async () => {
            const manager = new ExtensionManager()
            expect(manager.getStats().initialized).toBe(false)

            await manager.initialize()
            expect(manager.getStats().initialized).toBe(true)

            await manager.destroy()
            expect(manager.getStats().initialized).toBe(false)
        })

        it('should register core plugin automatically', async () => {
            const stats = extensionManager.getStats()
            expect(stats.plugins).toContainEqual({
                name: 'formdown-core',
                version: '1.0.0'
            })
        })

        it('should provide system statistics', () => {
            const stats = extensionManager.getStats()
            expect(stats).toHaveProperty('initialized')
            expect(stats).toHaveProperty('plugins')
            expect(stats).toHaveProperty('hookCount')
            expect(stats).toHaveProperty('fieldTypes')
            expect(stats).toHaveProperty('validators')
        })
    })

    describe('HookManager', () => {
        let hookManager: HookManager

        beforeEach(() => {
            hookManager = new HookManager()
        })

        it('should register and execute hooks', async () => {
            const mockHandler = jest.fn().mockReturnValue('test-result')
            const hook: Hook = {
                name: 'field-parse',
                priority: 10,
                handler: mockHandler
            }

            hookManager.register(hook)

            const context: HookContext = { input: 'test' }
            const results = await hookManager.execute('field-parse', context)

            expect(mockHandler).toHaveBeenCalledWith(context)
            expect(results).toEqual(['test-result'])
        })

        it('should execute hooks in priority order', async () => {
            const executionOrder: number[] = []

            const hooks: Hook[] = [
                {
                    name: 'field-parse',
                    priority: 5,
                    handler: () => { executionOrder.push(5); return 'low' }
                },
                {
                    name: 'field-parse',
                    priority: 15,
                    handler: () => { executionOrder.push(15); return 'high' }
                },
                {
                    name: 'field-parse',
                    priority: 10,
                    handler: () => { executionOrder.push(10); return 'medium' }
                }
            ]

            hooks.forEach(hook => hookManager.register(hook))

            const context: HookContext = {}
            const results = await hookManager.execute('field-parse', context)

            expect(executionOrder).toEqual([15, 10, 5])
            expect(results).toEqual(['high', 'medium', 'low'])
        })

        it('should handle sync hook execution', () => {
            const mockHandler = jest.fn().mockReturnValue('sync-result')
            const hook: Hook = {
                name: 'field-validate',
                priority: 10,
                handler: mockHandler
            }

            hookManager.register(hook)

            const context: HookContext = { field: { name: 'test', type: 'text', label: 'Test' } }
            const results = hookManager.executeSync('field-validate', context)

            expect(results).toEqual(['sync-result'])
        })

        it('should unregister hooks', () => {
            const handler = () => 'test'
            const hook: Hook = {
                name: 'field-parse',
                priority: 10,
                handler
            }

            hookManager.register(hook)
            expect(hookManager.getHooks('field-parse')).toHaveLength(1)

            hookManager.unregister('field-parse', handler)
            expect(hookManager.getHooks('field-parse')).toHaveLength(0)
        })

        it('should clear all hooks', () => {
            const hook1: Hook = {
                name: 'field-parse',
                priority: 10,
                handler: () => 'test1'
            }
            const hook2: Hook = {
                name: 'field-validate',
                priority: 10,
                handler: () => 'test2'
            }

            hookManager.register(hook1)
            hookManager.register(hook2)

            expect(hookManager.getHookCount()).toBe(2)

            hookManager.clear()
            expect(hookManager.getHookCount()).toBe(0)
        })
    })

    describe('PluginManager', () => {
        let pluginManager: PluginManager
        let hookManager: HookManager

        beforeEach(() => {
            hookManager = new HookManager()
            pluginManager = new PluginManager(hookManager)
        })

        afterEach(async () => {
            await pluginManager.destroy()
        })

        it('should register and unregister plugins', async () => {
            const testPlugin: Plugin = {
                metadata: {
                    name: 'test-plugin',
                    version: '1.0.0'
                }
            }

            expect(pluginManager.isRegistered('test-plugin')).toBe(false)

            await pluginManager.register(testPlugin)
            expect(pluginManager.isRegistered('test-plugin')).toBe(true)

            await pluginManager.unregister('test-plugin')
            expect(pluginManager.isRegistered('test-plugin')).toBe(false)
        })

        it('should prevent duplicate plugin registration', async () => {
            const testPlugin: Plugin = {
                metadata: {
                    name: 'test-plugin',
                    version: '1.0.0'
                }
            }

            await pluginManager.register(testPlugin)

            await expect(pluginManager.register(testPlugin))
                .rejects.toThrow("Plugin 'test-plugin' is already registered")
        })

        it('should register plugin hooks', async () => {
            const mockHandler = jest.fn()
            const testPlugin: Plugin = {
                metadata: {
                    name: 'test-plugin',
                    version: '1.0.0'
                },
                hooks: [{
                    name: 'field-parse',
                    priority: 10,
                    handler: mockHandler
                }]
            }

            await pluginManager.register(testPlugin)

            expect(hookManager.getHooks('field-parse')).toHaveLength(1)
        })

        it('should register field type plugins', async () => {
            const testPlugin: Plugin = {
                metadata: {
                    name: 'test-plugin',
                    version: '1.0.0'
                },
                fieldTypes: [{
                    type: 'custom-text',
                    parser: () => null,
                    generator: () => '<input type="text" />'
                }]
            }

            await pluginManager.register(testPlugin)

            const fieldTypes = pluginManager.getFieldTypes()
            expect(fieldTypes.has('custom-text')).toBe(true)
        })

        it('should call plugin lifecycle methods', async () => {
            const initialize = jest.fn()
            const destroy = jest.fn()

            const testPlugin: Plugin = {
                metadata: {
                    name: 'test-plugin',
                    version: '1.0.0'
                },
                initialize,
                destroy
            }

            await pluginManager.register(testPlugin)
            await pluginManager.initialize()

            expect(initialize).toHaveBeenCalled()

            await pluginManager.unregister('test-plugin')

            expect(destroy).toHaveBeenCalled()
        })
    })

    describe('EventEmitter', () => {
        let eventEmitter: EventEmitter

        beforeEach(() => {
            eventEmitter = new EventEmitter()
        })

        it('should register and emit events', () => {
            const listener = jest.fn()

            eventEmitter.on('test-event', listener)
            eventEmitter.emit('test-event', { data: 'test' })

            expect(listener).toHaveBeenCalledWith({
                type: 'test-event',
                data: { data: 'test' },
                timestamp: expect.any(Number)
            })
        })

        it('should unregister event listeners', () => {
            const listener = jest.fn()

            eventEmitter.on('test-event', listener)
            eventEmitter.off('test-event', listener)
            eventEmitter.emit('test-event')

            expect(listener).not.toHaveBeenCalled()
        })

        it('should support one-time listeners', () => {
            const listener = jest.fn()

            eventEmitter.once('test-event', listener)
            eventEmitter.emit('test-event')
            eventEmitter.emit('test-event')

            expect(listener).toHaveBeenCalledTimes(1)
        })

        it('should provide listener statistics', () => {
            const listener1 = jest.fn()
            const listener2 = jest.fn()

            eventEmitter.on('event1', listener1)
            eventEmitter.on('event1', listener2)
            eventEmitter.on('event2', listener1)

            expect(eventEmitter.listenerCount('event1')).toBe(2)
            expect(eventEmitter.listenerCount('event2')).toBe(1)
            expect(eventEmitter.eventNames()).toEqual(['event1', 'event2'])
        })
    })

    describe('Core Plugin', () => {
        it('should provide built-in field types', () => {
            expect(corePlugin.fieldTypes).toBeDefined()
            expect(corePlugin.fieldTypes?.length).toBeGreaterThan(0)

            const fieldTypes = corePlugin.fieldTypes?.map(ft => ft.type) || []
            expect(fieldTypes).toContain('text')
            expect(fieldTypes).toContain('email')
            expect(fieldTypes).toContain('select')
        })

        it('should provide built-in validators', () => {
            expect(corePlugin.validators).toBeDefined()
            expect(corePlugin.validators?.length).toBeGreaterThan(0)

            const validators = corePlugin.validators?.map(v => v.name) || []
            expect(validators).toContain('required')
            expect(validators).toContain('pattern')
            expect(validators).toContain('minlength')
        })
    })

    describe('Integration Tests', () => {
        it('should work end-to-end with custom plugin', async () => {
            let hookCalled = false

            const customPlugin: Plugin = {
                metadata: {
                    name: 'custom-plugin',
                    version: '1.0.0'
                },
                hooks: [{
                    name: 'field-parse',
                    priority: 100,
                    handler: () => {
                        hookCalled = true
                        return 'custom-result'
                    }
                }],
                fieldTypes: [{
                    type: 'custom-field',
                    generator: (field) => `<custom-input name="${field.name}" />`
                }]
            }

            await extensionManager.registerPlugin(customPlugin)

            // Execute hook
            const results = await extensionManager.executeHooks('field-parse', {})
            expect(results).toContain('custom-result')
            expect(hookCalled).toBe(true)

            // Check field type registration
            const stats = extensionManager.getStats()
            expect(stats.fieldTypes).toContain('custom-field')
        })

        it('should handle errors gracefully', async () => {
            const manager = new ExtensionManager({ errorStrategy: 'warn', timeout: 100 })
            await manager.initialize()

            const errorHook: Hook = {
                name: 'field-parse',
                priority: 10,
                handler: () => {
                    throw new Error('Test error')
                }
            }

            manager.registerHook(errorHook)

            // Should not throw due to error strategy
            const results = await manager.executeHooks('field-parse', {})
            expect(results).toEqual([])

            await manager.destroy()
        }, 10000)
    })
})
