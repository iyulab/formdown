export interface Field {
    name: string
    type: string
    label: string
    required?: boolean
    placeholder?: string
    options?: string[]
    allowOther?: boolean
    format?: string
    pattern?: string
    attributes?: Record<string, any>
    description?: string
    errorMessage?: string
    inline?: boolean
}

export interface ValidationRule {
    type: 'required' | 'pattern' | 'min' | 'max' | 'minlength' | 'maxlength' | 'custom'
    value?: any
    message?: string
}

export interface AccessibilityOptions {
    description?: string
    ariaLabel?: string
    ariaDescribedBy?: string
    role?: string
}

export interface ParseError {
    line: number
    message: string
}

export interface ParseResult {
    fields: Field[]
    errors: ParseError[]
}

export interface FormdownContent {
    markdown: string
    forms: Field[]
}

export interface FormdownOptions {
    preserveMarkdown?: boolean
    fieldPrefix?: string
    inlineFieldDelimiter?: string
}

// Schema-related types for getSchema() functionality
export interface FieldSchema {
    type: FieldType
    label?: string
    required?: boolean
    defaultValue?: any
    
    // Validation rules
    validation?: ValidationRules
    
    // Selection fields
    options?: string[]
    allowOther?: boolean
    
    // Layout and presentation
    layout?: 'inline' | 'vertical'
    placeholder?: string
    
    // HTML attributes
    htmlAttributes?: Record<string, any>
    
    // Metadata
    position?: number
    isInline?: boolean
    format?: string
    pattern?: string
    description?: string
    errorMessage?: string
}

export type FieldType = 
    | 'text' | 'email' | 'password' | 'tel' | 'url' | 'number'
    | 'date' | 'time' | 'datetime-local' | 'month' | 'week'
    | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file'
    | 'color' | 'range' | 'submit' | 'reset'

export interface ValidationRules {
    min?: number | string
    max?: number | string
    minlength?: number
    maxlength?: number
    step?: number
    pattern?: string
    accept?: string
}

export interface FormDownSchema {
    [fieldName: string]: FieldSchema
}

