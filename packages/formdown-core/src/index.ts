export * from './types.js'
export { parseOption, parseOptionList, optionLabel, formatOptions, type OptionList } from './options.js'
export * from './parser.js'
export * from './generator.js'
export type { BodyHtml } from './body-html.js'
export * from './schema.js'
export { conditionHolds, conditionState, type ConditionState } from './conditions.js'
export { parseComputation, type Computation } from './compute.js'
export { applyEdits, updateFrontMatter, setFieldAttribute, authoringCompletion, type TextEdit, type Completion } from './edit.js'
export { formatField, formatFormdown, formatCondition, type FieldInput } from './format.js'
export { findFrontMatter, type FrontMatterBlock } from './source.js'
export { readFrontMatter, yamlFrontMatter, type FrontMatterResult } from './front-matter.js'
export * from './extensions/index.js'
export * from './form-manager.js'
export * from './form-data-binding.js'
export * from './dom-binder.js'
export * from './event-orchestrator.js'

// Export field-processor with renamed conflicting types
export {
  FieldProcessor,
  type ProcessResult,
  type OtherResult,
  type ValueSetting,
  type FieldConstraints,
  type FieldType as ProcessorFieldType,
  type FieldElement,
  type ElementContainer
} from './field-processor.js'

// Export validation-manager with renamed conflicting types
export {
  ValidationManager,
  type ValidationResult as AdvancedValidationResult,
  type ValidationError,
  type ValidationWarning,
  type ValidationRule as AdvancedValidationRule,
  type ValidationPipeline,
  type ValidatorFunction,
  type FieldValidationContext,
  type FieldValidationConstraints,
  type FieldSchema,
  type FormData as ValidationFormData,
  type AsyncValidationConfig,
  CrossFieldValidators,
  type CrossFieldRule
} from './validation-manager.js'
export { FormdownFieldHelper, type FieldHelperOptions, type FieldValue, type FormFieldType } from './field-helper.js'

import { FormdownParser } from './parser.js'
import { FormdownGenerator } from './generator.js'
import { yamlFrontMatter } from './front-matter.js'
import { getSchema as getSchemaFunction } from './schema.js'

export function parseFormdown(input: string) {
    const parser = new FormdownParser({ frontMatter: yamlFrontMatter })
    return parser.parseFormdown(input)
}

export function generateFormHTML(content: string | import('./types.js').FormdownContent, options: import('./generator.js').GeneratorOptions = {}) {
    const generator = new FormdownGenerator(options)

    // If input is a string, parse it first
    if (typeof content === 'string') {
        const parser = new FormdownParser({ frontMatter: yamlFrontMatter })
        const parsedContent = parser.parseFormdown(content)
        return generator.generateHTML(parsedContent)
    }

    // Already parsed content is generated as is
    return generator.generateHTML(content)
}

// Schema extraction
export function getSchema(content: string | import('./types.js').FormdownContent) {
    return getSchemaFunction(content)
}

export { validateField, validateForm, type BasicFieldSchema } from './validate.js'
