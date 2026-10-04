/**
 * Describes a relation (FK) attached to a field.
 */
export interface FieldRelation {
    /** Target entity name (e.g., "Customers") */
    target: string
    /** Relation type: 'fk' for one-to-many (->), 'many-to-many' for (<->) */
    type: 'fk' | 'many-to-many'
}

/**
 * One option of a choice field: the value it stores, and the text shown for it when that differs
 * (written `value=Label`; without a label the value is shown).
 */
export interface FieldOption {
    value: string
    label?: string
}

export interface Field {
    name: string
    type: string
    label: string
    required?: boolean
    placeholder?: string
    options?: FieldOption[]
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
    relation?: FieldRelation  // FK relation metadata (-> or <->)
    span?: SourceSpan  // Where the field syntax is in the original source
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

/** A range of the original source text. Offsets are 0-based; line and column are 1-based. */
export interface SourceSpan {
    start: number
    end: number
    line: number
    column: number
}

/** A problem found while parsing. Parsing continues; nothing is dropped silently. */
export interface Diagnostic {
    code: string
    message: string
    severity: 'error' | 'warning'
    span?: SourceSpan
    /** The name of the field the problem is about, when it is about a field. */
    field?: string
}

/** YAML front matter at the start of a document. */
export interface FrontMatter {
    /** Parsed mapping. Empty when the YAML is invalid (see diagnostics). */
    data: Record<string, unknown>
    /** The YAML text between the opening and closing lines, unchanged. */
    raw: string
    /** The whole block, opening and closing lines included. */
    span: SourceSpan
}

export interface FormdownContent {
    markdown: string
    forms: Field[]
    /** Leading YAML front matter, when the document has one. */
    frontMatter?: FrontMatter
    /** Problems found while parsing. Always present on results from parseFormdown(). */
    diagnostics?: Diagnostic[]
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
    options?: FieldOption[]
    allowOther?: boolean
    otherLabel?: string

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
    | 'color' | 'range' | 'toggle' | 'submit' | 'reset'

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

