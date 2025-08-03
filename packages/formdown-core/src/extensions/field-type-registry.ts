/**
 * @fileoverview Field Type Registry System
 * Manages registration and execution of custom field types
 */

import type { 
    FieldTypePlugin, 
    FieldDataProcessor, 
    HookContext 
} from './types.js'
import type { Field, ValidationRule } from '../types.js'

export class FieldTypeRegistry {
    private fieldTypes = new Map<string, FieldTypePlugin>()
    private styleCache = new Map<string, string>()
    private scriptCache = new Map<string, string>()

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

        // Cache scripts if provided
        if (plugin.clientScript) {
            this.scriptCache.set(plugin.type, plugin.clientScript)
        }
    }

    /**
     * Unregister a field type plugin
     */
    unregister(type: string): void {
        this.fieldTypes.delete(type)
        this.styleCache.delete(type)
        this.scriptCache.delete(type)
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
     * Validate field using registered validators
     */
    validateField(field: Field, value: any): ValidationRule[] {
        const plugin = this.fieldTypes.get(field.type)
        if (plugin?.validator) {
            return plugin.validator(field, value)
        }
        return []
    }

    /**
     * Process field data using registered data processors
     */
    processFieldData(field: Field, value: any, operation: 'input' | 'output' | 'serialize' | 'deserialize'): any {
        const plugin = this.fieldTypes.get(field.type)
        const processor = plugin?.dataProcessor

        if (!processor) {
            return value
        }

        switch (operation) {
            case 'input':
                return processor.processInput?.(value, field) ?? value
            case 'output':
                return processor.processOutput?.(value, field) ?? value
            case 'serialize':
                return processor.serialize?.(value, field) ?? value
            case 'deserialize':
                return processor.deserialize?.(value, field) ?? value
            default:
                return value
        }
    }

    /**
     * Validate field data format using registered data processors
     */
    validateFieldData(field: Field, value: any): { valid: boolean; error?: string } {
        const plugin = this.fieldTypes.get(field.type)
        const processor = plugin?.dataProcessor

        if (!processor?.validate) {
            return { valid: true }
        }

        return processor.validate(value, field)
    }

    /**
     * Generate JSON schema for a field using registered schema generators
     */
    generateFieldSchema(field: Field): object | null {
        const plugin = this.fieldTypes.get(field.type)
        if (plugin?.schemaGenerator) {
            return plugin.schemaGenerator(field)
        }
        return null
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
     * Get all client scripts for registered field types
     */
    getAllScripts(): string {
        return Array.from(this.scriptCache.values()).join('\n')
    }

    /**
     * Get scripts for specific field types
     */
    getScriptsForTypes(types: string[]): string {
        return types
            .map(type => this.scriptCache.get(type))
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
            typesWithStyles: Array.from(this.styleCache.keys()),
            typesWithScripts: Array.from(this.scriptCache.keys())
        }
    }

    /**
     * Clear all registered field types
     */
    clear(): void {
        this.fieldTypes.clear()
        this.styleCache.clear()
        this.scriptCache.clear()
    }
}

// Default instance for use across the extension system
export const defaultFieldTypeRegistry = new FieldTypeRegistry()