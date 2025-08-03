/**
 * @fileoverview Event Emitter for Extension System
 * Provides event-driven communication between plugins and core
 */

import type { EventEmitter as IEventEmitter, EventListener, ExtensionEvent } from './types.js'

export class EventEmitter implements IEventEmitter {
    private listeners = new Map<string, Set<EventListener>>()

    /**
     * Register an event listener
     */
    on(event: string, listener: EventListener): void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set())
        }

        this.listeners.get(event)!.add(listener)
    }

    /**
     * Unregister an event listener
     */
    off(event: string, listener: EventListener): void {
        const listeners = this.listeners.get(event)
        if (listeners) {
            listeners.delete(listener)
            if (listeners.size === 0) {
                this.listeners.delete(event)
            }
        }
    }

    /**
     * Emit an event to all registered listeners
     */
    emit(event: string, data?: any): void {
        const listeners = this.listeners.get(event)
        if (!listeners) return

        const extensionEvent: ExtensionEvent = {
            type: event,
            data,
            timestamp: Date.now()
        }

        // Execute listeners in isolation to prevent one from affecting others
        for (const listener of listeners) {
            try {
                listener(extensionEvent)
            } catch (error) {
                console.error(`[Formdown] Event listener error in '${event}':`, error)
            }
        }
    }

    /**
     * Register a one-time event listener
     */
    once(event: string, listener: EventListener): void {
        const onceListener: EventListener = (event: ExtensionEvent) => {
            listener(event)
            this.off(event.type, onceListener)
        }

        this.on(event, onceListener)
    }

    /**
     * Remove all listeners for an event or all events
     */
    removeAllListeners(event?: string): void {
        if (event) {
            this.listeners.delete(event)
        } else {
            this.listeners.clear()
        }
    }

    /**
     * Get listener count for an event
     */
    listenerCount(event: string): number {
        return this.listeners.get(event)?.size || 0
    }

    /**
     * Get all registered event names
     */
    eventNames(): string[] {
        return Array.from(this.listeners.keys())
    }
}
