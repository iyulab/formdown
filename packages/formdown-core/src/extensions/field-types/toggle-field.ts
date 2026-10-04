/**
 * @fileoverview Toggle Field Type Plugin
 * Renders a toggle switch: a single checkbox with role="switch". Like a single checkbox it carries
 * value "true", so its form data is a boolean, and its on/off state is the checkbox's own.
 */

import type { FieldTypePlugin, HookContext } from '../types.js'
import type { Field } from '../../types.js'
import { NAME, pattern as unicodePattern } from '../../grammar.js'
import { escapeHtml } from '../../escape.js'

export const toggleFieldPlugin: FieldTypePlugin = {
    type: 'toggle',

    parser: (content: string, context: HookContext) => {
        // Match: @field: [toggle], @field(Label): [toggle checked], @field: [toggle required]
        const patterns = [
            unicodePattern(String.raw`@(${NAME})(?:\(([^)]+)\))?\s*:\s*\[toggle\s*([^\]]*)\]`),
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

    generator: (field: Field, context: HookContext) => {
        const { name, label, required, attributes = {} } = field
        const checked = attributes.checked === true || attributes.checked === 'true'
        const formId = context.metadata?.formId

        const inputAttrs = [
            'type="checkbox"',
            'role="switch"',
            `id="${escapeHtml(name)}"`,
            `name="${escapeHtml(name)}"`,
            'value="true"',
            checked ? 'checked' : '',
            required ? 'required' : '',
            formId ? `form="${escapeHtml(formId)}"` : '',
            'part="input toggle-input"',
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
