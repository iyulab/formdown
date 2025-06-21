export interface Field {
    name: string
    type: string
    label: string
    required?: boolean
    placeholder?: string
    options?: string[]
    attributes?: Record<string, any>
}

export interface ParseError {
    line: number
    message: string
}

export interface ParseResult {
    fields: Field[]
    errors: ParseError[]
}

