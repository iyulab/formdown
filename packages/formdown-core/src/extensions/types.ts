/**
 * @fileoverview Core Extension Types
 * Defines interfaces and types for the Formdown extension system
 */

import type { Field, ValidationRule, ParseResult } from '../types.js'

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
    /** Parsing results so far */
    parseResult?: ParseResult
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

export interface FieldTypePlugin {
    /** Field type identifier */
    type: string
    /** Parser for this field type */
    parser?: (content: string, context: HookContext) => Field | null
    /** Validator for this field type */
    validator?: (field: Field, value: any) => ValidationRule[]
    /** HTML generator for this field type */
    generator?: (field: Field, context: HookContext) => string
    /** Default attributes for this field type */
    defaultAttributes?: Record<string, any>
}

export interface ValidationPlugin {
    /** Validation rule name */
    name: string
    /** Validation function */
    validate: (value: any, rule: ValidationRule, field: Field) => boolean | Promise<boolean>
    /** Error message generator */
    getMessage?: (rule: ValidationRule, field: Field) => string
}

export interface RendererPlugin {
    /** Template name to override */
    template: string
    /** Template renderer function */
    render: (field: Field, context: HookContext) => string
    /** CSS styles for this template */
    styles?: string
}

export interface ThemePlugin {
    /** Theme identifier */
    name: string
    /** CSS custom properties */
    cssProperties: Record<string, string>
    /** CSS classes override */
    classOverrides?: Record<string, string>
    /** Component-specific overrides */
    componentOverrides?: Record<string, any>
}

export interface Plugin {
    metadata: PluginMetadata

    /** Hooks to register */
    hooks?: Hook[]

    /** Field type extensions */
    fieldTypes?: FieldTypePlugin[]

    /** Validation extensions */
    validators?: ValidationPlugin[]

    /** Renderer extensions */
    renderers?: RendererPlugin[]

    /** Theme extensions */
    themes?: ThemePlugin[]

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
    /** Configuration options */
    options: ExtensionOptions
}

export interface ExtensionOptions {
    /** Enable async hook execution */
    async?: boolean
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
