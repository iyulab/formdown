/**
 * @fileoverview Field Type Registry System
 * Manages registration and execution of custom field types
 */

import type { FieldTypePlugin, FieldTypeSubject, HookContext } from './types.js'
import type { Field } from '../types.js'

export class FieldTypeRegistry {
    private fieldTypes = new Map<string, FieldTypePlugin>()
    private styleCache = new Map<string, string>()

    /**
     * Register a field type plugin
     */
    register(plugin: FieldTypePlugin): void {
        if (this.fieldTypes.has(plugin.type)) {
            throw new Error(`Field type '${plugin.type}' is already registered`)
        }

        this.fieldTypes.set(plugin.type, plugin)

        // Cache styles if provided
        if (plugin.styles) {
            this.styleCache.set(plugin.type, plugin.styles)
        }
    }

    /**
     * Unregister a field type plugin
     */
    unregister(type: string): void {
        this.fieldTypes.delete(type)
        this.styleCache.delete(type)
    }

    /**
     * Get a field type plugin
     */
    get(type: string): FieldTypePlugin | undefined {
        return this.fieldTypes.get(type)
    }

    /**
     * Check if a field type is registered
     */
    has(type: string): boolean {
        return this.fieldTypes.has(type)
    }

    /**
     * Get all registered field types
     */
    getAll(): Map<string, FieldTypePlugin> {
        return new Map(this.fieldTypes)
    }

    /**
     * Parse field content using registered field type parsers
     */
    parseField(content: string, context: HookContext): Field | null {
        for (const plugin of this.fieldTypes.values()) {
            if (plugin.parser) {
                const result = plugin.parser(content, context)
                if (result) {
                    // Apply default attributes if specified
                    if (plugin.defaultAttributes) {
                        result.attributes = {
                            ...plugin.defaultAttributes,
                            ...result.attributes
                        }
                    }
                    return result
                }
            }
        }
        return null
    }

    /**
     * Generate HTML for a field using registered generators
     */
    generateFieldHTML(field: Field, context: HookContext): string | null {
        const plugin = this.fieldTypes.get(field.type)
        if (plugin?.generator) {
            return plugin.generator(field, context)
        }
        return null
    }

    /**
     * The errors the field type's own validator finds in `value` — none when the type has no validator.
     */
    validate(value: unknown, field: FieldTypeSubject): string[] {
        const plugin = field.type ? this.fieldTypes.get(field.type) : undefined
        return plugin?.validator ? plugin.validator(value, field) : []
    }

    /**
     * Get all CSS styles for registered field types
     */
    getAllStyles(): string {
        return Array.from(this.styleCache.values()).join('\n')
    }

    /**
     * Get styles for specific field types
     */
    getStylesForTypes(types: string[]): string {
        return types
            .map(type => this.styleCache.get(type))
            .filter(Boolean)
            .join('\n')
    }

    /**
     * Get registry statistics
     */
    getStats() {
        return {
            registeredTypes: Array.from(this.fieldTypes.keys()),
            totalTypes: this.fieldTypes.size,
            typesWithStyles: Array.from(this.styleCache.keys())
        }
    }

    /**
     * Clear all registered field types
     */
    clear(): void {
        this.fieldTypes.clear()
        this.styleCache.clear()
    }
}

// Default instance for use across the extension system
export const defaultFieldTypeRegistry = new FieldTypeRegistry()