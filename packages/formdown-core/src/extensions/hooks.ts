/**
 * @fileoverview Hook Management System
 * Provides registration and execution of hooks for extensibility
 */

import type {
    Hook,
    HookName,
    HookFunction,
    HookContext,
    HookManager as IHookManager,
    ExtensionOptions,
    EventEmitter,
    ExtensionEvent
} from './types.js'

/** The kind of value a transforming hook passes along: an array, null, or its `typeof`. */
function kindOf(value: unknown): string {
    if (Array.isArray(value)) return 'array'
    if (value === null) return 'null'
    return typeof value
}

function article(kind: string): string {
    return /^[aeiou]/.test(kind) ? `an ${kind}` : `a ${kind}`
}

export class HookManager implements IHookManager {
    private hooks = new Map<HookName, Hook[]>()
    private eventEmitter?: EventEmitter

    constructor(
        private options: ExtensionOptions = {},
        eventEmitter?: EventEmitter
    ) {
        this.eventEmitter = eventEmitter
    }

    /**
     * Register a hook
     */
    register(hook: Hook): void {
        const hooks = this.hooks.get(hook.name) || []
        hooks.push(hook)

        // Sort by priority (higher priority first)
        hooks.sort((a, b) => b.priority - a.priority)

        this.hooks.set(hook.name, hooks)

        this.emit('hook-registered', { hook: hook.name, priority: hook.priority })

        if (this.options.debug) {
            console.debug(`[Formdown] Hook registered: ${hook.name} (priority: ${hook.priority})`)
        }
    }

    /**
     * Unregister a specific hook handler
     */
    unregister(hookName: HookName, handler: HookFunction): void {
        const hooks = this.hooks.get(hookName) || []
        const filtered = hooks.filter(hook => hook.handler !== handler)

        if (filtered.length !== hooks.length) {
            this.hooks.set(hookName, filtered)
            this.emit('hook-unregistered', { hook: hookName })

            if (this.options.debug) {
                console.debug(`[Formdown] Hook unregistered: ${hookName}`)
            }
        }
    }

    /**
     * Execute hooks asynchronously
     */
    async execute<T>(hookName: HookName, context: HookContext, ...args: any[]): Promise<T[]> {
        const hooks = this.hooks.get(hookName) || []
        const results: T[] = []

        this.emit('hooks-executing', { hook: hookName, count: hooks.length })

        for (const hook of hooks) {
            let timeoutInfo: { promise: Promise<never>, cleanup: () => void } | null = null
            
            try {
                timeoutInfo = this.options.timeout
                    ? this.createTimeoutPromise(this.options.timeout)
                    : null

                const hookPromise = Promise.resolve(hook.handler(context, ...args))

                const result = timeoutInfo
                    ? await Promise.race([hookPromise, timeoutInfo.promise])
                    : await hookPromise

                // Clean up timeout if it exists
                timeoutInfo?.cleanup()

                if (result !== undefined) {
                    results.push(result)
                }

                this.emit('hook-executed', { hook: hookName, success: true })

            } catch (error) {
                // Clean up timeout if it exists
                timeoutInfo?.cleanup()
                this.handleHookError(hookName, error)
            }
        }

        this.emit('hooks-completed', { hook: hookName, results: results.length })

        return results
    }

    /**
     * Execute hooks synchronously
     */
    executeSync<T>(hookName: HookName, context: HookContext, ...args: any[]): T[] {
        const hooks = this.hooks.get(hookName) || []
        const results: T[] = []

        this.emit('hooks-executing', { hook: hookName, count: hooks.length })

        for (const hook of hooks) {
            try {
                const result = hook.handler(context, ...args) as T

                if (result !== undefined) {
                    results.push(result)
                }

                this.emit('hook-executed', { hook: hookName, success: true })

            } catch (error) {
                this.handleHookError(hookName, error)
            }
        }

        this.emit('hooks-completed', { hook: hookName, results: results.length })

        return results
    }

    /**
     * Pass `value` through every hook registered under `hookName`, highest priority
     * first. Each hook receives the previous hook's result; a hook that returns
     * undefined leaves the value unchanged. A hook that throws or returns a promise is
     * skipped and reported through `onError`, so the pipeline always completes.
     */
    transformSync<T>(hookName: HookName, context: HookContext, value: T, onError?: (message: string) => void): T {
        for (const hook of this.hooks.get(hookName) || []) {
            try {
                const result = hook.handler(context, value)
                if (result instanceof Promise) {
                    result.catch(() => undefined)
                    throw new Error('asynchronous hooks cannot run during synchronous parsing or generation')
                }
                if (result !== undefined) {
                    // A value of another kind (the context handed back in place of the source, say)
                    // would break the next step; it counts as the hook failing.
                    const expected = kindOf(value)
                    const got = kindOf(result)
                    if (value !== undefined && value !== null && got !== expected) {
                        throw new Error(`returned ${article(got)} where ${article(expected)} was expected`)
                    }
                    value = result as T
                }
            } catch (error) {
                const message = `Hook "${hookName}" failed: ${error instanceof Error ? error.message : String(error)}`
                this.emit('hook-error', { hook: hookName, error: message })
                onError?.(message)
            }
        }
        return value
    }

    /**
     * Clear hooks
     */
    clear(hookName?: HookName): void {
        if (hookName) {
            this.hooks.delete(hookName)
            this.emit('hooks-cleared', { hook: hookName })
        } else {
            this.hooks.clear()
            this.emit('hooks-cleared', { all: true })
        }

        if (this.options.debug) {
            console.debug(`[Formdown] Hooks cleared: ${hookName || 'all'}`)
        }
    }

    /**
     * Get registered hooks for a specific name
     */
    getHooks(hookName: HookName): Hook[] {
        return [...(this.hooks.get(hookName) || [])]
    }

    /**
     * Get all registered hook names
     */
    getHookNames(): HookName[] {
        return Array.from(this.hooks.keys())
    }

    /**
     * Get total number of registered hooks
     */
    getHookCount(): number {
        return Array.from(this.hooks.values()).reduce((sum, hooks) => sum + hooks.length, 0)
    }

    /**
     * Create a timeout promise for hook execution
     */
    private createTimeoutPromise(timeout: number): { promise: Promise<never>, cleanup: () => void } {
        let timeoutId: NodeJS.Timeout
        const promise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new Error(`Hook execution timeout after ${timeout}ms`))
            }, timeout)
        })
        
        const cleanup = () => {
            clearTimeout(timeoutId)
        }
        
        return { promise, cleanup }
    }

    /**
     * Handle hook execution errors
     */
    private handleHookError(hookName: HookName, error: any): void {
        const errorMessage = `Hook execution failed: ${hookName} - ${error.message || error}`

        this.emit('hook-error', { hook: hookName, error: errorMessage })

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
            const event: ExtensionEvent = {
                type,
                data,
                timestamp: Date.now()
            }
            this.eventEmitter.emit(type, event)
        }
    }
}
