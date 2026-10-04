/**
 * @fileoverview Core Extension Types
 * Defines interfaces and types for the Formdown extension system
 */

import type { Field, FieldSchema } from '../types.js'

// ================================
// Hook System Types
// ================================

export type HookName =
    | 'pre-parse'
    | 'post-parse'
    | 'field-parse'
    | 'field-validate'
    | 'pre-generate'
    | 'post-generate'
    | 'field-render'
    | 'error-handle'

export interface HookContext {
    /** Input being processed */
    input?: string
    /** Current field being processed */
    field?: Field
    /** Additional metadata */
    metadata?: Record<string, any>
}

export type HookFunction<T = any> = (
    context: HookContext,
    ...args: any[]
) => T | Promise<T>

export interface Hook {
    name: HookName
    priority: number
    handler: HookFunction
}

// ================================
// Plugin System Types
// ================================

export interface PluginMetadata {
    name: string
    version: string
    description?: string
    author?: string
    dependencies?: string[]
}

/** A field as `validateForm` sees it: its schema entry (`getSchema`) and its name. */
export type FieldTypeSubject = Omit<Partial<FieldSchema>, 'type'> & { name: string; type?: string }

export interface FieldTypePlugin {
    /** Field type identifier */
    type: string
    /** Parser for this field type */
    parser?: (content: string, context: HookContext) => Field | null
    /**
     * Checks a value of this field type. `validateForm` (and `<formdown-ui>`'s `validate()`) call it for
     * every field of the type that can be filled in, after the required check; each message returned is
     * one error. Required is checked by Formdown already — check only what is particular to the type.
     */
    validator?: (value: unknown, field: FieldTypeSubject) => string[]
    /** HTML generator for this field type */
    generator?: (field: Field, context: HookContext) => string
    /** Default attributes for this field type */
    defaultAttributes?: Record<string, any>
    /** CSS for the HTML `generator` writes; `<formdown-ui>` applies it to a form holding a field of this type */
    styles?: string
}

export interface Plugin {
    metadata: PluginMetadata

    /** Hooks to register */
    hooks?: Hook[]

    /** Field type extensions */
    fieldTypes?: FieldTypePlugin[]

    /** Plugin initialization */
    initialize?: () => void | Promise<void>

    /** Plugin cleanup */
    destroy?: () => void | Promise<void>
}

// ================================
// Extension Context Types
// ================================

export interface ExtensionContext {
    /** Hook manager instance */
    hooks: HookManager
    /** Plugin manager instance */
    plugins: PluginManager
    /** Field type registry instance */
    fieldTypes: FieldTypeRegistry
    /** Configuration options */
    options: ExtensionOptions
}

export interface FieldTypeRegistry {
    register(plugin: FieldTypePlugin): void
    unregister(type: string): void
    get(type: string): FieldTypePlugin | undefined
    has(type: string): boolean
    getAll(): Map<string, FieldTypePlugin>
    parseField(content: string, context: HookContext): Field | null
    generateFieldHTML(field: Field, context: HookContext): string | null
    validate(value: unknown, field: FieldTypeSubject): string[]
    getAllStyles(): string
    getStylesForTypes(types: string[]): string
    getStats(): object
    clear(): void
}

export interface ExtensionOptions {
    /** Hook execution timeout (ms) */
    timeout?: number
    /** Error handling strategy */
    errorStrategy?: 'ignore' | 'warn' | 'throw'
    /** Debug mode */
    debug?: boolean
}

// ================================
// Manager Interfaces
// ================================

export interface HookManager {
    register(hook: Hook): void
    unregister(hookName: HookName, handler: HookFunction): void
    execute<T>(hookName: HookName, context: HookContext, ...args: any[]): Promise<T[]>
    executeSync<T>(hookName: HookName, context: HookContext, ...args: any[]): T[]
    clear(hookName?: HookName): void
    getHooks(hookName: HookName): Hook[]
}

export interface PluginManager {
    register(plugin: Plugin): Promise<void>
    unregister(pluginName: string): Promise<void>
    get(pluginName: string): Plugin | undefined
    getAll(): Plugin[]
    isRegistered(pluginName: string): boolean
    initialize(): Promise<void>
    destroy(): Promise<void>
}

// ================================
// Event System Types
// ================================

export interface ExtensionEvent {
    type: string
    plugin?: string
    hook?: HookName
    data?: any
    timestamp: number
}

export type EventListener = (event: ExtensionEvent) => void

export interface EventEmitter {
    on(event: string, listener: EventListener): void
    off(event: string, listener: EventListener): void
    emit(event: string, data?: any): void
}
