/**
 * @fileoverview Built-in Plugins for Formdown Core
 * Provides standard field types, validators, and renderers
 */

import type { Plugin, FieldTypePlugin, ValidationPlugin } from './types.js'
import type { Field, ValidationRule } from '../types.js'
import { rangeFieldPlugin } from './field-types/range-field.js'
import { toggleFieldPlugin } from './field-types/toggle-field.js'

// ================================
// Built-in Field Type Plugins
// ================================

export const textFieldPlugin: FieldTypePlugin = {
    type: 'text',
    parser: (content: string) => {
        const match = content.match(/@(\w+):\s*\[text\](.*)/)
        if (!match) return null

        const [, name, rest] = match
        const attributes = parseAttributes(rest)

        return {
            name,
            type: 'text',
            label: attributes.label || name,
            required: attributes.required || false,
            placeholder: attributes.placeholder,
            pattern: attributes.pattern,
            attributes: attributes
        }
    },
    validator: (field: Field, value: any) => {
        const rules: ValidationRule[] = []

        if (field.required && (!value || value.trim() === '')) {
            rules.push({
                type: 'required',
                message: `${field.label} is required`
            })
        }

        if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
            rules.push({
                type: 'pattern',
                value: field.pattern,
                message: `${field.label} does not match the required pattern`
            })
        }

        return rules
    },
    generator: (field: Field) => {
        const attributes = [
            `type="text"`,
            `name="${field.name}"`,
            `id="${field.name}"`,
            field.placeholder ? `placeholder="${field.placeholder}"` : '',
            field.required ? 'required' : '',
            field.pattern ? `pattern="${field.pattern}"` : ''
        ].filter(Boolean).join(' ')

        return `<input ${attributes} />`
    }
}

export const emailFieldPlugin: FieldTypePlugin = {
    type: 'email',
    parser: (content: string) => {
        const match = content.match(/@(\w+):\s*\[email\](.*)/)
        if (!match) return null

        const [, name, rest] = match
        const attributes = parseAttributes(rest)

        return {
            name,
            type: 'email',
            label: attributes.label || name,
            required: attributes.required || false,
            placeholder: attributes.placeholder,
            attributes: attributes
        }
    },
    validator: (field: Field, value: any) => {
        const rules: ValidationRule[] = []

        if (field.required && (!value || value.trim() === '')) {
            rules.push({
                type: 'required',
                message: `${field.label} is required`
            })
        }

        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            rules.push({
                type: 'pattern',
                message: `${field.label} must be a valid email address`
            })
        }

        return rules
    },
    generator: (field: Field) => {
        const attributes = [
            `type="email"`,
            `name="${field.name}"`,
            `id="${field.name}"`,
            field.placeholder ? `placeholder="${field.placeholder}"` : '',
            field.required ? 'required' : ''
        ].filter(Boolean).join(' ')

        return `<input ${attributes} />`
    }
}

export const selectFieldPlugin: FieldTypePlugin = {
    type: 'select',
    parser: (content: string) => {
        const match = content.match(/@(\w+):\s*\[select\](.*)/)
        if (!match) return null

        const [, name, rest] = match
        const attributes = parseAttributes(rest)
        const options = parseOptions(rest)

        return {
            name,
            type: 'select',
            label: attributes.label || name,
            required: attributes.required || false,
            options,
            allowOther: attributes.allowOther || false,
            attributes: attributes
        }
    },
    generator: (field: Field) => {
        const attributes = [
            `name="${field.name}"`,
            `id="${field.name}"`,
            field.required ? 'required' : ''
        ].filter(Boolean).join(' ')

        const options = (field.options || [])
            .map((option: string) => `<option value="${option}">${option}</option>`)
            .join('\n')

        return `<select ${attributes}>\n${options}\n</select>`
    }
}

// ================================
// Built-in Validation Plugins
// ================================

export const requiredValidator: ValidationPlugin = {
    name: 'required',
    validate: (value: any) => {
        return value !== null && value !== undefined && value !== ''
    },
    getMessage: (rule: ValidationRule, field: Field) => {
        return rule.message || `${field.label} is required`
    }
}

export const patternValidator: ValidationPlugin = {
    name: 'pattern',
    validate: (value: any, rule: ValidationRule) => {
        if (!value) return true // Empty values are handled by required validator
        if (!rule.value) return true

        return new RegExp(rule.value).test(value)
    },
    getMessage: (rule: ValidationRule, field: Field) => {
        return rule.message || `${field.label} does not match the required pattern`
    }
}

export const lengthValidator: ValidationPlugin = {
    name: 'minlength',
    validate: (value: any, rule: ValidationRule) => {
        if (!value) return true
        return value.length >= (rule.value || 0)
    },
    getMessage: (rule: ValidationRule, field: Field) => {
        return rule.message || `${field.label} must be at least ${rule.value} characters long`
    }
}

// ================================
// Core Plugin Bundle
// ================================

export const corePlugin: Plugin = {
    metadata: {
        name: 'formdown-core',
        version: '1.0.0',
        description: 'Built-in field types and validators for Formdown',
        author: 'Formdown Team'
    },
    fieldTypes: [
        textFieldPlugin,
        emailFieldPlugin,
        selectFieldPlugin,
        rangeFieldPlugin,
        toggleFieldPlugin
    ],
    validators: [
        requiredValidator,
        patternValidator,
        lengthValidator
    ]
}

// ================================
// Utility Functions
// ================================

function parseAttributes(content: string): Record<string, any> {
    const attributes: Record<string, any> = {}

    // Parse required attribute
    if (content.includes('required')) {
        attributes.required = true
    }

    // Parse placeholder
    const placeholderMatch = content.match(/placeholder="([^"]*)"/)
    if (placeholderMatch) {
        attributes.placeholder = placeholderMatch[1]
    }

    // Parse label
    const labelMatch = content.match(/label="([^"]*)"/)
    if (labelMatch) {
        attributes.label = labelMatch[1]
    }

    // Parse pattern
    const patternMatch = content.match(/pattern="([^"]*)"/)
    if (patternMatch) {
        attributes.pattern = patternMatch[1]
    }

    // Parse allowOther
    if (content.includes('allowOther')) {
        attributes.allowOther = true
    }

    return attributes
}

function parseOptions(content: string): string[] {
    const optionsMatch = content.match(/options=\[([^\]]*)\]/)
    if (!optionsMatch) return []

    return optionsMatch[1]
        .split(',')
        .map(option => option.trim().replace(/"/g, ''))
        .filter(Boolean)
}
