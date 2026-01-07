export interface Field {
    name: string
    type: string
    label: string
    required?: boolean
    placeholder?: string
    options?: string[]
    allowOther?: boolean
    otherLabel?: string
    format?: string
    pattern?: string
    content?: string  // For checkbox display text with priority: content > label > name
    value?: unknown   // Default value for the field
    attributes?: Record<string, unknown>
    description?: string
    errorMessage?: string
    inline?: boolean
    position?: number  // Position in the source content for form association
    group?: string    // Group ID for fieldset grouping
    conditions?: ConditionalAttributes  // Conditional visibility/behavior
    [key: string]: unknown  // Index signature for compatibility with FieldSchema
}

export interface ValidationRule {
    type: 'required' | 'pattern' | 'min' | 'max' | 'minlength' | 'maxlength' | 'step' | 'type' | 'custom'
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

export interface FormDeclaration {
    id: string
    attributes: Record<string, any>
    position?: number  // Position in the source content for nearest form logic
}

export interface DatalistDeclaration {
    id: string
    options: string[]
    position?: number
}

export interface GroupDeclaration {
    id: string
    label: string
    position?: number
    collapsible?: boolean
    collapsed?: boolean
}

/**
 * Conditional field visibility/behavior rules
 * Supports simple equality and boolean checks
 */
export interface FieldCondition {
    /** The field name to check */
    field: string
    /** Operator for comparison */
    operator: '=' | '!=' | 'truthy' | 'falsy'
    /** Value to compare against (for = and != operators) */
    value?: string
}

/**
 * Conditional attributes for fields
 */
export interface ConditionalAttributes {
    /** Show field only when condition is met */
    visibleIf?: FieldCondition
    /** Hide field when condition is met */
    hiddenIf?: FieldCondition
    /** Enable field only when condition is met */
    enabledIf?: FieldCondition
    /** Disable field when condition is met */
    disabledIf?: FieldCondition
    /** Make field required only when condition is met */
    requiredIf?: FieldCondition
}

export interface FormdownContent {
    markdown: string
    forms: Field[]
    formDeclarations?: FormDeclaration[]
    datalistDeclarations?: DatalistDeclaration[]
    groupDeclarations?: GroupDeclaration[]
}

export interface FormdownOptions {
    preserveMarkdown?: boolean
    fieldPrefix?: string
    inlineFieldDelimiter?: string
    autoGenerateFormIds?: boolean
}

// Schema-related types for getSchema() functionality
export interface FieldSchema {
    type: FieldType
    label?: string
    required?: boolean
    defaultValue?: any
    value?: any

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
    group?: string  // Group ID for fieldset grouping
    conditions?: ConditionalAttributes  // Conditional visibility/behavior
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

// Common component configuration types (removed duplicate from component-utils)

// Common event types
export interface FormdownEvent {
    type: 'parse' | 'render' | 'validate' | 'submit' | 'change'
    source: 'core' | 'ui' | 'editor'
    data: any
    target?: HTMLElement
}

// Validation result types
export interface FieldError {
    field: string
    message: string
}

export interface ValidationResult {
    isValid: boolean
    errors: FieldError[]
}

