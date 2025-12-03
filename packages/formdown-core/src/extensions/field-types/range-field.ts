/**
 * @fileoverview Range Field Type Plugin
 * Example implementation of a custom field type with full extension capabilities
 */

import type { FieldTypePlugin, HookContext } from '../types.js'
import type { Field, ValidationRule } from '../../types.js'

export const rangeFieldPlugin: FieldTypePlugin = {
    type: 'range',
    
    parser: (content: string, context: HookContext) => {
        // Match various range field patterns
        const patterns = [
            /@(\w+)(?:\(([^)]+)\))?\s*:\s*\[range\](.*)/, // Standard: @field: [range] or @field(Label): [range]
            /@(\w+)(?:\(([^)]+)\))?\s*:\s*\[range\s+([^\]]+)\](.*)/, // With attributes: @field: [range min=0 max=100]
        ]

        for (const pattern of patterns) {
            const match = content.match(pattern)
            if (match) {
                const [, name, customLabel, attributeString = '', rest = ''] = match
                const attributes = parseRangeAttributes((attributeString || '') + (rest || ''))

                return {
                    name,
                    type: 'range',
                    label: customLabel || attributes.label || generateLabel(name),
                    required: attributes.required || false,
                    attributes: {
                        min: attributes.min || 0,
                        max: attributes.max || 100,
                        step: attributes.step || 1,
                        value: attributes.value || Math.floor(((attributes.min || 0) + (attributes.max || 100)) / 2),
                        showValue: attributes.showValue !== false,
                        unit: attributes.unit || '',
                        ...attributes
                    }
                }
            }
        }

        return null
    },

    validator: (field: Field, value: any): ValidationRule[] => {
        const rules: ValidationRule[] = []
        const numValue = Number(value)

        if (field.required && (value === null || value === undefined || value === '')) {
            rules.push({
                type: 'required' as const,
                message: `${field.label} is required`
            })
        }

        if (value !== null && value !== undefined && value !== '') {
            if (isNaN(numValue)) {
                rules.push({
                    type: 'type' as const,
                    message: `${field.label} must be a number`
                })
            } else {
                const min = Number(field.attributes?.min) || 0
                const max = Number(field.attributes?.max) || 100

                if (numValue < min) {
                    rules.push({
                        type: 'min' as const,
                        value: min,
                        message: `${field.label} must be at least ${min}`
                    })
                }

                if (numValue > max) {
                    rules.push({
                        type: 'max' as const,
                        value: max,
                        message: `${field.label} must be at most ${max}`
                    })
                }

                const step = Number(field.attributes?.step) || 1
                if (step > 0 && (numValue - min) % step !== 0) {
                    rules.push({
                        type: 'step' as const,
                        value: step,
                        message: `${field.label} must be a multiple of ${step}`
                    })
                }
            }
        }

        return rules
    },

    generator: (field: Field, context: HookContext) => {
        const { name, label, required, attributes = {} } = field
        const min = Number(attributes.min) || 0
        const max = Number(attributes.max) || 100
        const step = Number(attributes.step) || 1
        const value = attributes.value !== undefined ? Number(attributes.value) : Math.floor((min + max) / 2)
        const showValue = attributes.showValue !== false
        const unit = String(attributes.unit ?? '')

        const fieldId = name
        const outputId = `${name}-output`
        const formId = context.metadata?.formId

        const commonAttrs = {
            type: 'range',
            id: fieldId,
            name,
            min,
            max,
            step,
            value,
            ...(required && { required: true }),
            ...(formId && { form: formId }),
            ...Object.fromEntries(
                Object.entries(attributes).filter(([key]) => 
                    !['min', 'max', 'step', 'value', 'showValue', 'unit', 'label'].includes(key)
                )
            )
        }

        const attrString = Object.entries(commonAttrs)
            .map(([key, val]) => {
                if (typeof val === 'boolean') {
                    return val ? key : ''
                }
                return `${key}="${val}"`
            })
            .filter(Boolean)
            .join(' ')

        const valueDisplay = showValue ? 
            `<output id="${outputId}" for="${fieldId}" class="formdown-range-output">${value}${unit}</output>` : 
            ''

        return `
<div class="formdown-field formdown-range-field">
    <label for="${fieldId}">${label}${required ? ' *' : ''}</label>
    <div class="formdown-range-container">
        <input ${attrString} data-formdown-range-output="${outputId}" data-formdown-range-unit="${unit}">
        ${valueDisplay}
    </div>
</div>`
    },

    dataProcessor: {
        processInput: (value: any, field: Field) => {
            const numValue = Number(value)
            return isNaN(numValue) ? null : numValue
        },

        processOutput: (value: any, field: Field) => {
            if (value === null || value === undefined) return ''
            const unit = field.attributes?.unit || ''
            return `${value}${unit}`
        },

        validate: (value: any, field: Field) => {
            const numValue = Number(value)
            if (value !== null && value !== undefined && value !== '' && isNaN(numValue)) {
                return { valid: false, error: 'Value must be a number' }
            }
            return { valid: true }
        },

        serialize: (value: any, field: Field) => {
            return String(value)
        },

        deserialize: (value: string, field: Field) => {
            const numValue = Number(value)
            return isNaN(numValue) ? null : numValue
        }
    },

    schemaGenerator: (field: Field) => {
        const schema: any = {
            type: 'number',
            minimum: field.attributes?.min || 0,
            maximum: field.attributes?.max || 100
        }

        if (field.attributes?.step) {
            schema.multipleOf = field.attributes.step
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
        .formdown-range-field .formdown-range-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .formdown-range-field input[type="range"] {
            flex: 1;
            min-width: 100px;
        }
        
        .formdown-range-output {
            min-width: 60px;
            text-align: center;
            font-weight: 600;
            padding: 4px 8px;
            background: #f5f5f5;
            border-radius: 4px;
            font-family: monospace;
        }
        
        .formdown-range-field label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
        }
    `,

    clientScript: `
        // Enhanced range field interactions
        document.addEventListener('DOMContentLoaded', function() {
            const rangeFields = document.querySelectorAll('.formdown-range-field input[type="range"]');
            
            rangeFields.forEach(function(input) {
                // Add keyboard navigation enhancement
                input.addEventListener('keydown', function(e) {
                    const step = parseFloat(this.step) || 1;
                    const currentValue = parseFloat(this.value);
                    
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                        e.preventDefault();
                        this.value = Math.max(parseFloat(this.min), currentValue - step);
                        this.dispatchEvent(new Event('input', { bubbles: true }));
                    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                        e.preventDefault();
                        this.value = Math.min(parseFloat(this.max), currentValue + step);
                        this.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
                
                // Add visual feedback on interaction
                input.addEventListener('input', function() {
                    this.classList.add('active');
                    setTimeout(() => this.classList.remove('active'), 150);
                });
            });
        });
    `,

    defaultAttributes: {
        min: 0,
        max: 100,
        step: 1,
        showValue: true
    }
}

// Helper functions
function parseRangeAttributes(content: string): Record<string, any> {
    const attributes: Record<string, any> = {}

    // Parse min/max/step attributes
    const minMatch = content.match(/min=(\d+)/)
    if (minMatch) attributes.min = parseInt(minMatch[1])

    const maxMatch = content.match(/max=(\d+)/)
    if (maxMatch) attributes.max = parseInt(maxMatch[1])

    const stepMatch = content.match(/step=(\d+\.?\d*)/)
    if (stepMatch) attributes.step = parseFloat(stepMatch[1])

    const valueMatch = content.match(/value=(\d+\.?\d*)/)
    if (valueMatch) attributes.value = parseFloat(valueMatch[1])

    // Parse unit
    const unitMatch = content.match(/unit="([^"]*)"/)
    if (unitMatch) attributes.unit = unitMatch[1]

    // Parse showValue flag
    if (content.includes('hideValue')) {
        attributes.showValue = false
    }

    // Parse required flag
    if (content.includes('required')) {
        attributes.required = true
    }

    // Parse label
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