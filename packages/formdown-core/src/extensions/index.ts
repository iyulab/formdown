/**
 * @fileoverview Extension System for Formdown Core
 * Provides hook-based extensibility for parsers, generators, and validators
 */

// Export types
export type * from './types'

// Export implementations
export { HookManager } from './hooks'
export { PluginManager } from './plugin-manager'
export { EventEmitter } from './event-emitter'
export { ExtensionManager, defaultExtensionManager as extensionManager } from './extension-manager'

// Export plugins
export * from './built-in-plugins'

// Convenience exports
export {
    initializeExtensions,
    registerPlugin,
    registerHook,
    executeHooks,
    getExtensionStats
} from './extension-manager'
