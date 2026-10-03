/**
 * @fileoverview Extension Manager - Main Entry Point
 * Coordinates hooks, plugins, and events for the Formdown extension system
 */

import { HookManager } from './hooks.js'
import { PluginManager } from './plugin-manager.js'
import { EventEmitter } from './event-emitter.js'
import { FieldTypeRegistry } from './field-type-registry.js'
import { corePlugin } from './built-in-plugins.js'

import type {
    ExtensionContext,
    ExtensionOptions,
    Plugin,
    Hook,
    HookName,
    HookContext,
    HookFunction
} from './types.js'

export class ExtensionManager {
    private eventEmitter: EventEmitter
    private hookManager: HookManager
    private pluginManager: PluginManager
    private fieldTypeRegistry: FieldTypeRegistry
    private context: ExtensionContext
    private initialized = false
    private initializing?: Promise<void>

    constructor(options: ExtensionOptions = {}) {
        // Set default options
        const defaultOptions: ExtensionOptions = {
            timeout: 1000, // Reduced from 5000 to prevent test hangs
            errorStrategy: 'warn',
            debug: false,
            ...options
        }

        // Initialize components
        this.eventEmitter = new EventEmitter()
        this.hookManager = new HookManager(defaultOptions, this.eventEmitter)
        this.fieldTypeRegistry = new FieldTypeRegistry()
        this.pluginManager = new PluginManager(this.hookManager, defaultOptions, this.eventEmitter, this.fieldTypeRegistry)

        // Create extension context
        this.context = {
            hooks: this.hookManager,
            plugins: this.pluginManager,
            fieldTypes: this.fieldTypeRegistry,
            options: defaultOptions
        }

        // Setup error handling
        this.setupErrorHandling()
    }

    /**
     * Initialize the extension system
     */
    initialize(): Promise<void> {
        if (this.initialized) return Promise.resolve()
        // Callers that ask while it is under way (a form and an editor on one page) share the one run
        this.initializing ??= this.runInitialize().finally(() => { this.initializing = undefined })
        return this.initializing
    }

    private async runInitialize(): Promise<void> {
        this.eventEmitter.emit('extension-system-initializing')

        try {
            // Register core plugin first
            await this.pluginManager.register(corePlugin)

            // Initialize all plugins
            await this.pluginManager.initialize()

            this.initialized = true
            this.eventEmitter.emit('extension-system-initialized')

            if (this.context.options.debug) {
                console.debug('[Formdown] Extension system initialized')
            }

        } catch (error) {
            this.eventEmitter.emit('extension-system-error', {
                phase: 'initialization',
                error: error instanceof Error ? error.message : String(error)
            })
            throw error
        }
    }

    /**
     * Destroy the extension system
     */
    async destroy(): Promise<void> {
        if (!this.initialized) {
            return
        }

        this.eventEmitter.emit('extension-system-destroying')

        try {
            await this.pluginManager.destroy()
            this.hookManager.clear()

            this.initialized = false
            this.eventEmitter.emit('extension-system-destroyed')
            // Listeners added from outside go; the manager's own error reporting stays for the next initialize()
            this.eventEmitter.removeAllListeners()
            this.setupErrorHandling()

            if (this.context.options.debug) {
                console.debug('[Formdown] Extension system destroyed')
            }

        } catch (error) {
            this.eventEmitter.emit('extension-system-error', {
                phase: 'destruction',
                error: error instanceof Error ? error.message : String(error)
            })
            throw error
        }
    }

    /**
     * Register a plugin
     */
    async registerPlugin(plugin: Plugin): Promise<void> {
        this.ensureInitialized()
        return this.pluginManager.register(plugin)
    }

    /**
     * Unregister a plugin
     */
    async unregisterPlugin(pluginName: string): Promise<void> {
        this.ensureInitialized()
        return this.pluginManager.unregister(pluginName)
    }

    /**
     * Register a hook
     */
    registerHook(hook: Hook): void {
        this.ensureInitialized()
        this.hookManager.register(hook)
    }

    /**
     * Execute hooks
     */
    async executeHooks<T>(hookName: HookName, context: HookContext, ...args: any[]): Promise<T[]> {
        this.ensureInitialized()
        return this.hookManager.execute<T>(hookName, context, ...args)
    }

    /**
     * Remove a registered hook handler
     */
    unregisterHook(hookName: HookName, handler: HookFunction): void {
        this.hookManager.unregister(hookName, handler)
    }

    /**
     * Pass `value` through the hooks registered under `hookName` (see
     * HookManager.transformSync). Before initialization no hooks can be registered,
     * so the value passes through unchanged; parsing never requires initialization.
     */
    transformSync<T>(hookName: HookName, context: HookContext, value: T, onError?: (message: string) => void): T {
        if (!this.initialized) return value
        return this.hookManager.transformSync(hookName, context, value, onError)
    }

    /**
     * Execute hooks synchronously
     */
    executeHooksSync<T>(hookName: HookName, context: HookContext, ...args: any[]): T[] {
        this.ensureInitialized()
        return this.hookManager.executeSync<T>(hookName, context, ...args)
    }

    /**
     * Get extension context
     */
    getContext(): ExtensionContext {
        return { ...this.context }
    }

    /**
     * Get field type registry
     */
    getFieldTypeRegistry(): FieldTypeRegistry {
        return this.fieldTypeRegistry
    }

    /**
     * Get event emitter for external listeners
     */
    getEventEmitter(): EventEmitter {
        return this.eventEmitter
    }

    /**
     * Get system statistics
     */
    getStats() {
        return {
            initialized: this.initialized,
            plugins: this.pluginManager.getAll().map(p => ({
                name: p.metadata.name,
                version: p.metadata.version
            })),
            hookCount: this.hookManager.getHookCount(),
            registeredHooks: this.hookManager.getHookNames(),
            fieldTypes: Array.from(this.pluginManager.getFieldTypes().keys())
        }
    }

    /**
     * Enable debug mode
     */
    enableDebug(): void {
        this.context.options.debug = true
        console.debug('[Formdown] Debug mode enabled')
        console.debug('[Formdown] Extension system stats:', this.getStats())
    }

    /**
     * Disable debug mode
     */
    disableDebug(): void {
        this.context.options.debug = false
    }

    /**
     * Setup error handling
     */
    private setupErrorHandling(): void {
        this.eventEmitter.on('hook-error', (event) => {
            if (this.context.options.debug) {
                console.error('[Formdown] Hook error:', event.data)
            }
        })

        this.eventEmitter.on('plugin-error', (event) => {
            if (this.context.options.debug) {
                console.error('[Formdown] Plugin error:', event.data)
            }
        })

        this.eventEmitter.on('extension-system-error', (event) => {
            console.error('[Formdown] Extension system error:', event.data)
        })
    }

    /**
     * Ensure the system is initialized
     */
    private ensureInitialized(): void {
        if (!this.initialized) {
            throw new Error('Extension system must be initialized before use')
        }
    }
}

// Lazy-initialized default instance
let _defaultInstance: ExtensionManager | null = null

export function getDefaultExtensionManager(): ExtensionManager {
    if (!_defaultInstance) {
        _defaultInstance = new ExtensionManager()
    }
    return _defaultInstance
}

// Convenience functions using default instance

/**
 * Initialize the default extension manager — the one parsing and generation run through.
 * Options start it afresh with those options; plugins and hooks registered on the earlier
 * default instance are not carried over, so pass options before registering anything.
 */
export async function initializeExtensions(options?: ExtensionOptions): Promise<void> {
    if (options) {
        _defaultInstance = new ExtensionManager(options)
    }
    await getDefaultExtensionManager().initialize()
}

export async function registerPlugin(plugin: Plugin): Promise<void> {
    return getDefaultExtensionManager().registerPlugin(plugin)
}

export function registerHook(hook: Hook): void {
    return getDefaultExtensionManager().registerHook(hook)
}

export async function executeHooks<T>(hookName: HookName, context: HookContext, ...args: any[]): Promise<T[]> {
    return getDefaultExtensionManager().executeHooks<T>(hookName, context, ...args)
}

export function getExtensionStats() {
    return getDefaultExtensionManager().getStats()
}
