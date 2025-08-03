/**
 * @fileoverview Extension System for Formdown Core
 * Provides hook-based extensibility for parsers, generators, and validators
 */

// Export types
export type * from './types.js'

// Export implementations
export { HookManager } from './hooks.js'
export { PluginManager } from './plugin-manager.js'
export { EventEmitter } from './event-emitter.js'
export { ExtensionManager, defaultExtensionManager as extensionManager } from './extension-manager.js'

// Export plugins
export * from './built-in-plugins.js'

// Convenience exports
export {
    initializeExtensions,
    registerPlugin,
    registerHook,
    executeHooks,
    getExtensionStats
} from './extension-manager.js'
