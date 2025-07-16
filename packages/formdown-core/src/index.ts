export * from './types.js'
export * from './parser.js'
export * from './generator.js'
export * from './schema.js'
export * from './extensions/index.js'
export * from './component-utils.js'

import { FormdownParser } from './parser.js'
import { FormdownGenerator } from './generator.js'
import { getSchema as getSchemaFunction } from './schema.js'

export function parseFormdown(input: string) {
    const parser = new FormdownParser()
    return parser.parseFormdown(input)
}

export function generateFormHTML(content: any) {
    const generator = new FormdownGenerator()
    return generator.generateHTML(content)
}

// Legacy support for simple form fields parsing
export function parseFormFields(input: string) {
    const parser = new FormdownParser()
    return parser.parse(input)
}

// Schema extraction
export function getSchema(content: string) {
    return getSchemaFunction(content)
}

// Component creation utilities are now in component-utils.js

// Validation utilities
export function validateField(value: any, schema: any): import('./types.js').FieldError[] {
    const errors: import('./types.js').FieldError[] = []
    
    if (schema.required && (!value || value.toString().trim() === '')) {
        errors.push({
            field: schema.name || 'field',
            message: schema.errorMessage || `${schema.label || 'Field'} is required`
        })
    }
    
    return errors
}

export function validateForm(data: Record<string, any>, schema: Record<string, any>): import('./types.js').ValidationResult {
    const errors: import('./types.js').FieldError[] = []
    
    Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
        const fieldErrors = validateField(data[fieldName], { ...fieldSchema, name: fieldName })
        errors.push(...fieldErrors)
    })
    
    return {
        isValid: errors.length === 0,
        errors
    }
}
