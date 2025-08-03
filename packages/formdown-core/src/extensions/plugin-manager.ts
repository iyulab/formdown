/**
 * @fileoverview Plugin Management System
 * Handles registration, initialization, and lifecycle of plugins
 */

import type {
    Plugin,
    PluginManager as IPluginManager,
    HookManager,
    ExtensionOptions,
    EventEmitter,
    FieldTypePlugin,
    ValidationPlugin,
    RendererPlugin,
    ThemePlugin
} from './types.js'

export class PluginManager implements IPluginManager {
    private plugins = new Map<string, Plugin>()
    private fieldTypes = new Map<string, FieldTypePlugin>()
    private validators = new Map<string, ValidationPlugin>()
    private renderers = new Map<string, RendererPlugin>()
    private themes = new Map<string, ThemePlugin>()
    private initialized = false

    constructor(
        private hookManager: HookManager,
        private options: ExtensionOptions = {},
        private eventEmitter?: EventEmitter,
        private fieldTypeRegistry?: import('./field-type-registry.js').FieldTypeRegistry
    ) { }

    /**
     * Register a plugin
     */
    async register(plugin: Plugin): Promise<void> {
        if (this.plugins.has(plugin.metadata.name)) {
            throw new Error(`Plugin '${plugin.metadata.name}' is already registered`)
        }

        // Validate dependencies
        await this.validateDependencies(plugin)

        // Register plugin
        this.plugins.set(plugin.metadata.name, plugin)

        // Register hooks
        if (plugin.hooks) {
            for (const hook of plugin.hooks) {
                this.hookManager.register(hook)
            }
        }

        // Register field types
        if (plugin.fieldTypes) {
            for (const fieldType of plugin.fieldTypes) {
                this.fieldTypes.set(fieldType.type, fieldType)
                // Also register with field type registry if available
                this.fieldTypeRegistry?.register(fieldType)
            }
        }

        // Register validators
        if (plugin.validators) {
            for (const validator of plugin.validators) {
                this.validators.set(validator.name, validator)
            }
        }

        // Register renderers
        if (plugin.renderers) {
            for (const renderer of plugin.renderers) {
                this.renderers.set(renderer.template, renderer)
            }
        }

        // Register themes
        if (plugin.themes) {
            for (const theme of plugin.themes) {
                this.themes.set(theme.name, theme)
            }
        }

        this.emit('plugin-registered', {
            plugin: plugin.metadata.name,
            version: plugin.metadata.version
        })

        if (this.options.debug) {
            console.debug(`[Formdown] Plugin registered: ${plugin.metadata.name} v${plugin.metadata.version}`)
        }

        // Initialize if already initialized
        if (this.initialized && plugin.initialize) {
            try {
                await plugin.initialize()
                this.emit('plugin-initialized', { plugin: plugin.metadata.name })
            } catch (error) {
                this.handlePluginError(plugin.metadata.name, 'initialization', error)
            }
        }
    }

    /**
     * Unregister a plugin
     */
    async unregister(pluginName: string): Promise<void> {
        const plugin = this.plugins.get(pluginName)
        if (!plugin) {
            return
        }

        // Cleanup plugin
        if (plugin.destroy) {
            try {
                await plugin.destroy()
                this.emit('plugin-destroyed', { plugin: pluginName })
            } catch (error) {
                this.handlePluginError(pluginName, 'cleanup', error)
            }
        }

        // Unregister hooks
        if (plugin.hooks) {
            for (const hook of plugin.hooks) {
                this.hookManager.unregister(hook.name, hook.handler)
            }
        }

        // Unregister field types
        if (plugin.fieldTypes) {
            for (const fieldType of plugin.fieldTypes) {
                this.fieldTypes.delete(fieldType.type)
                // Also unregister from field type registry if available
                this.fieldTypeRegistry?.unregister(fieldType.type)
            }
        }

        // Unregister validators
        if (plugin.validators) {
            for (const validator of plugin.validators) {
                this.validators.delete(validator.name)
            }
        }

        // Unregister renderers
        if (plugin.renderers) {
            for (const renderer of plugin.renderers) {
                this.renderers.delete(renderer.template)
            }
        }

        // Unregister themes
        if (plugin.themes) {
            for (const theme of plugin.themes) {
                this.themes.delete(theme.name)
            }
        }

        this.plugins.delete(pluginName)

        this.emit('plugin-unregistered', { plugin: pluginName })

        if (this.options.debug) {
            console.debug(`[Formdown] Plugin unregistered: ${pluginName}`)
        }
    }

    /**
     * Get a plugin by name
     */
    get(pluginName: string): Plugin | undefined {
        return this.plugins.get(pluginName)
    }

    /**
     * Get all registered plugins
     */
    getAll(): Plugin[] {
        return Array.from(this.plugins.values())
    }

    /**
     * Check if a plugin is registered
     */
    isRegistered(pluginName: string): boolean {
        return this.plugins.has(pluginName)
    }

    /**
     * Initialize all plugins
     */
    async initialize(): Promise<void> {
        if (this.initialized) {
            return
        }

        this.emit('plugins-initializing', { count: this.plugins.size })

        const initPromises: Promise<void>[] = []

        for (const plugin of this.plugins.values()) {
            if (plugin.initialize) {
                initPromises.push(
                    Promise.resolve(plugin.initialize()).catch((error: any) =>
                        this.handlePluginError(plugin.metadata.name, 'initialization', error)
                    )
                )
            }
        }

        await Promise.all(initPromises)

        this.initialized = true
        this.emit('plugins-initialized', { count: this.plugins.size })

        if (this.options.debug) {
            console.debug(`[Formdown] ${this.plugins.size} plugins initialized`)
        }
    }

    /**
     * Destroy all plugins
     */
    async destroy(): Promise<void> {
        if (!this.initialized) {
            return
        }

        this.emit('plugins-destroying', { count: this.plugins.size })

        const destroyPromises: Promise<void>[] = []

        for (const plugin of this.plugins.values()) {
            if (plugin.destroy) {
                destroyPromises.push(
                    Promise.resolve(plugin.destroy()).catch((error: any) =>
                        this.handlePluginError(plugin.metadata.name, 'cleanup', error)
                    )
                )
            }
        }

        await Promise.all(destroyPromises)

        // Clear all plugin registrations
        this.plugins.clear()
        this.fieldTypes.clear()
        this.validators.clear()
        this.renderers.clear()
        this.themes.clear()

        this.initialized = false
        this.emit('plugins-destroyed', { count: 0 })

        if (this.options.debug) {
            console.debug(`[Formdown] All plugins destroyed and cleared`)
        }
    }

    /**
     * Get registered field type plugins
     */
    getFieldTypes(): Map<string, FieldTypePlugin> {
        return new Map(this.fieldTypes)
    }

    /**
     * Get a specific field type plugin
     */
    getFieldType(type: string): FieldTypePlugin | undefined {
        return this.fieldTypes.get(type)
    }

    /**
     * Check if a field type is registered
     */
    hasFieldType(type: string): boolean {
        return this.fieldTypes.has(type)
    }

    /**
     * Get registered validation plugins
     */
    getValidators(): Map<string, ValidationPlugin> {
        return new Map(this.validators)
    }

    /**
     * Get registered renderer plugins
     */
    getRenderers(): Map<string, RendererPlugin> {
        return new Map(this.renderers)
    }

    /**
     * Get registered theme plugins
     */
    getThemes(): Map<string, ThemePlugin> {
        return new Map(this.themes)
    }

    /**
     * Validate plugin dependencies
     */
    private async validateDependencies(plugin: Plugin): Promise<void> {
        if (!plugin.metadata.dependencies) {
            return
        }

        for (const dependency of plugin.metadata.dependencies) {
            if (!this.isRegistered(dependency)) {
                throw new Error(
                    `Plugin '${plugin.metadata.name}' requires dependency '${dependency}' which is not registered`
                )
            }
        }
    }

    /**
     * Handle plugin errors
     */
    private handlePluginError(pluginName: string, operation: string, error: any): void {
        const errorMessage = `Plugin ${operation} failed: ${pluginName} - ${error.message || error}`

        this.emit('plugin-error', {
            plugin: pluginName,
            operation,
            error: errorMessage
        })

        switch (this.options.errorStrategy) {
            case 'ignore':
                // Silent failure
                break
            case 'warn':
                console.warn(`[Formdown] ${errorMessage}`)
                break
            case 'throw':
            default:
                throw new Error(errorMessage)
        }
    }

    /**
     * Emit events if event emitter is available
     */
    private emit(type: string, data?: any): void {
        if (this.eventEmitter) {
            this.eventEmitter.emit(type, data)
        }
    }
}
