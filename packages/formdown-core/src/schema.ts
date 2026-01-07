import { FormdownParser } from './parser.js'
import { Field, FieldSchema, FormDownSchema, FieldType, ValidationRules } from './types.js'

export class SchemaExtractor {
    private parser: FormdownParser

    constructor() {
        this.parser = new FormdownParser()
    }

    /**
     * Extract schema from FormDown content
     */
    extractSchema(content: string): FormDownSchema {
        const parseResult = this.parser.parse(content)
        const schema: FormDownSchema = {}

        parseResult.fields.forEach((field, index) => {
            schema[field.name] = this.convertFieldToSchema(field, index)
        })

        return schema
    }

    /**
     * Convert a Field object to FieldSchema
     */
    private convertFieldToSchema(field: Field, position: number): FieldSchema {
        const schema: FieldSchema = {
            type: field.type as FieldType,
            label: field.label,
            required: field.required,
            position: position + 1,
            isInline: field.inline
        }

        // Add optional properties if they exist
        if (field.placeholder) {
            schema.placeholder = field.placeholder
        }

        if (field.value !== undefined) {
            schema.value = field.value
        }

        if (field.options) {
            schema.options = field.options
        }

        if (field.allowOther) {
            schema.allowOther = field.allowOther
        }

        if (field.format) {
            schema.format = field.format
        }

        if (field.pattern) {
            schema.pattern = field.pattern
        }

        if (field.description) {
            schema.description = field.description
        }

        if (field.errorMessage) {
            schema.errorMessage = field.errorMessage
        }

        // Extract validation rules from both attributes and field properties
        const validationRules = this.extractValidationRules(field.attributes || {})
        const fieldValidationRules = this.extractFieldValidationRules(field)
        
        if (validationRules || fieldValidationRules) {
            schema.validation = { ...validationRules, ...fieldValidationRules }
        }

        // Extract HTML attributes (excluding validation and already processed attributes)
        const htmlAttributes = this.extractHtmlAttributes(field.attributes || {})
        if (htmlAttributes && Object.keys(htmlAttributes).length > 0) {
            schema.htmlAttributes = htmlAttributes
        }

        // Determine layout based on field type and inline status
        schema.layout = field.inline ? 'inline' : 'vertical'

        // Add group if present
        if (field.group) {
            schema.group = field.group
        }

        // Add conditions if present
        if (field.conditions) {
            schema.conditions = field.conditions
        }

        return schema
    }

    /**
     * Extract validation rules from field attributes
     */
    private extractValidationRules(attributes: Record<string, any>): ValidationRules | undefined {
        const validation: ValidationRules = {}
        let hasValidation = false

        // Numeric validation
        if (attributes.min !== undefined) {
            validation.min = attributes.min
            hasValidation = true
        }
        if (attributes.max !== undefined) {
            validation.max = attributes.max
            hasValidation = true
        }
        if (attributes.step !== undefined) {
            validation.step = attributes.step
            hasValidation = true
        }

        // String validation
        if (attributes.minlength !== undefined) {
            validation.minlength = attributes.minlength
            hasValidation = true
        }
        if (attributes.maxlength !== undefined) {
            validation.maxlength = attributes.maxlength
            hasValidation = true
        }

        // Pattern validation
        if (attributes.pattern !== undefined) {
            validation.pattern = attributes.pattern
            hasValidation = true
        }

        // File validation
        if (attributes.accept !== undefined) {
            validation.accept = attributes.accept
            hasValidation = true
        }

        return hasValidation ? validation : undefined
    }

    /**
     * Extract validation rules from field properties (not attributes)
     */
    private extractFieldValidationRules(field: Field): ValidationRules | undefined {
        const validation: ValidationRules = {}
        let hasValidation = false

        if (field.pattern !== undefined) {
            validation.pattern = field.pattern
            hasValidation = true
        }

        return hasValidation ? validation : undefined
    }

    /**
     * Extract HTML attributes (excluding validation attributes and field-level properties)
     */
    private extractHtmlAttributes(attributes: Record<string, any>): Record<string, any> | undefined {
        const htmlAttributes: Record<string, any> = {}
        const excludedKeys = new Set([
            'min', 'max', 'step', 'minlength', 'maxlength', 'pattern', 'accept', 'required',
            'placeholder', 'options', 'allow-other', 'format'
        ])
        let hasAttributes = false

        for (const [key, value] of Object.entries(attributes)) {
            if (!excludedKeys.has(key)) {
                htmlAttributes[key] = value
                hasAttributes = true
            }
        }

        return hasAttributes ? htmlAttributes : undefined
    }
}

/**
 * Extract schema from FormDown content
 * @param content - FormDown content string
 * @returns FormDownSchema object
 */
export function getSchema(content: string): FormDownSchema {
    const extractor = new SchemaExtractor()
    return extractor.extractSchema(content)
}