/**
 * @fileoverview Toggle Field Type Plugin
 * Renders a toggle switch (checkbox with role="switch")
 */

import type { FieldTypePlugin, HookContext } from '../types.js'
import type { Field, ValidationRule } from '../../types.js'

export const toggleFieldPlugin: FieldTypePlugin = {
    type: 'toggle',

    parser: (content: string, context: HookContext) => {
        // Match: @field: [toggle], @field(Label): [toggle checked], @field: [toggle required]
        const patterns = [
            /@(\w+)(?:\(([^)]+)\))?\s*:\s*\[toggle\s*([^\]]*)\]/,
        ]

        for (const pattern of patterns) {
            const match = content.match(pattern)
            if (match) {
                const [, name, customLabel, attributeString = ''] = match
                const attributes = parseToggleAttributes(attributeString)

                return {
                    name,
                    type: 'toggle',
                    label: customLabel || attributes.label || generateLabel(name),
                    required: attributes.required || false,
                    attributes: {
                        checked: attributes.checked || false,
                        ...attributes
                    }
                }
            }
        }

        return null
    },

    validator: (field: Field, value: any): ValidationRule[] => {
        const rules: ValidationRule[] = []

        if (field.required && !value) {
            rules.push({
                type: 'required' as const,
                message: `${field.label} must be enabled`
            })
        }

        return rules
    },

    generator: (field: Field, context: HookContext) => {
        const { name, label, required, attributes = {} } = field
        const checked = attributes.checked === true || attributes.checked === 'true'
        const formId = context.metadata?.formId

        const inputAttrs = [
            'type="checkbox"',
            'role="switch"',
            `id="${name}"`,
            `name="${name}"`,
            checked ? 'checked' : '',
            required ? 'required' : '',
            formId ? `form="${formId}"` : '',
            `aria-checked="${checked}"`,
        ].filter(Boolean).join(' ')

        return `
<div class="formdown-field formdown-toggle-field">
    <label class="formdown-toggle-label">
        <span class="formdown-toggle-switch">
            <input ${inputAttrs}>
            <span class="formdown-toggle-slider"></span>
        </span>
        <span class="formdown-toggle-text">${label}${required ? ' *' : ''}</span>
    </label>
</div>`
    },

    dataProcessor: {
        processInput: (value: any, field: Field) => {
            if (typeof value === 'boolean') return value
            if (typeof value === 'string') return value === 'true' || value === 'on'
            return Boolean(value)
        },

        processOutput: (value: any, field: Field) => {
            return value ? 'true' : 'false'
        },

        validate: (value: any, field: Field) => {
            return { valid: true }
        },

        serialize: (value: any, field: Field) => {
            return value ? 'true' : 'false'
        },

        deserialize: (value: string, field: Field) => {
            return value === 'true' || value === 'on'
        }
    },

    schemaGenerator: (field: Field) => {
        const schema: any = {
            type: 'boolean'
        }

        if (field.required) {
            schema.required = true
        }

        if (field.label) {
            schema.title = field.label
        }

        return schema
    },

    styles: `
        .formdown-toggle-field {
            margin: 8px 0;
        }

        .formdown-toggle-label {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            cursor: pointer;
            user-select: none;
        }

        .formdown-toggle-switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
            flex-shrink: 0;
        }

        .formdown-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
            position: absolute;
        }

        .formdown-toggle-slider {
            position: absolute;
            inset: 0;
            background-color: var(--formdown-toggle-bg, #ccc);
            border-radius: 24px;
            transition: background-color 0.2s;
        }

        .formdown-toggle-slider::before {
            content: "";
            position: absolute;
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: var(--formdown-toggle-knob, #fff);
            border-radius: 50%;
            transition: transform 0.2s;
        }

        .formdown-toggle-switch input:checked + .formdown-toggle-slider {
            background-color: var(--formdown-toggle-active, #4caf50);
        }

        .formdown-toggle-switch input:checked + .formdown-toggle-slider::before {
            transform: translateX(20px);
        }

        .formdown-toggle-switch input:focus-visible + .formdown-toggle-slider {
            outline: 2px solid var(--formdown-toggle-focus, #2196f3);
            outline-offset: 2px;
        }

        .formdown-toggle-text {
            font-weight: 500;
        }
    `,

    clientScript: `
        document.addEventListener('DOMContentLoaded', function() {
            var toggles = document.querySelectorAll('.formdown-toggle-field input[role="switch"]');
            toggles.forEach(function(input) {
                input.addEventListener('change', function() {
                    this.setAttribute('aria-checked', String(this.checked));
                });
            });
        });
    `,

    defaultAttributes: {
        checked: false
    }
}

function parseToggleAttributes(content: string): Record<string, any> {
    const attributes: Record<string, any> = {}

    if (content.includes('checked')) {
        attributes.checked = true
    }

    if (content.includes('required')) {
        attributes.required = true
    }

    const labelMatch = content.match(/label="([^"]*)"/)
    if (labelMatch) attributes.label = labelMatch[1]

    return attributes
}

function generateLabel(name: string): string {
    return name
        .split(/[_-]/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}
