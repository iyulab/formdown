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

