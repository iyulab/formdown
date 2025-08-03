/**
 * @fileoverview Tests for Range Field Type Plugin
 */

import { rangeFieldPlugin } from '../field-types/range-field.js'
import type { HookContext } from '../types.js'
import type { Field } from '../../types.js'

describe('Range Field Plugin', () => {
    describe('Parser', () => {
        it('should parse basic range field', () => {
            const content = '@volume: [range]'
            const context: HookContext = { input: content }
            
            const result = rangeFieldPlugin.parser!(content, context)
            
            expect(result).toEqual({
                name: 'volume',
                type: 'range',
                label: 'Volume',
                required: false,
                attributes: {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: 50,
                    showValue: true,
                    unit: ''
                }
            })
        })

        it('should parse range field with attributes', () => {
            const content = '@temperature: [range min=0 max=40 step=0.5 unit="°C"] required'
            const context: HookContext = { input: content }
            
            const result = rangeFieldPlugin.parser!(content, context)
            
            expect(result).toEqual({
                name: 'temperature',
                type: 'range',
                label: 'Temperature',
                required: true,
                attributes: {
                    min: 0,
                    max: 40,
                    step: 0.5,
                    value: 20,
                    showValue: true,
                    unit: '°C',
                    required: true  // This gets added to attributes as well
                }
            })
        })

        it('should parse range field with custom label', () => {
            const content = '@brightness(Display Brightness): [range max=255]'
            const context: HookContext = { input: content }
            
            const result = rangeFieldPlugin.parser!(content, context)
            
            expect(result?.label).toBe('Display Brightness')
            expect(result?.attributes?.max).toBe(255)
        })

        it('should parse range field with hidden value display', () => {
            const content = '@opacity: [range hideValue]'
            const context: HookContext = { input: content }
            
            const result = rangeFieldPlugin.parser!(content, context)
            
            expect(result?.attributes?.showValue).toBe(false)
        })

        it('should return null for non-range content', () => {
            const content = '@name: [text]'
            const context: HookContext = { input: content }
            
            const result = rangeFieldPlugin.parser!(content, context)
            
            expect(result).toBeNull()
        })
    })

    describe('Validator', () => {
        const field: Field = {
            name: 'test',
            type: 'range',
            label: 'Test Range',
            attributes: { min: 0, max: 100, step: 5 }
        }

        it('should validate required field', () => {
            const requiredField = { ...field, required: true }
            
            const rules = rangeFieldPlugin.validator!(requiredField, null)
            
            expect(rules).toHaveLength(1)
            expect(rules[0].type).toBe('required')
        })

        it('should validate numeric values', () => {
            const rules = rangeFieldPlugin.validator!(field, 'not a number')
            
            expect(rules).toHaveLength(1)
            expect(rules[0].type).toBe('type')
            expect(rules[0].message).toContain('must be a number')
        })

        it('should validate minimum value', () => {
            const rules = rangeFieldPlugin.validator!(field, -5)
            
            expect(rules).toHaveLength(1)
            expect(rules[0].type).toBe('min')
            expect(rules[0].value).toBe(0)
        })

        it('should validate maximum value', () => {
            const rules = rangeFieldPlugin.validator!(field, 150)
            
            expect(rules).toHaveLength(1)
            expect(rules[0].type).toBe('max')
            expect(rules[0].value).toBe(100)
        })

        it('should validate step value', () => {
            const rules = rangeFieldPlugin.validator!(field, 7) // Not divisible by step (5)
            
            expect(rules).toHaveLength(1)
            expect(rules[0].type).toBe('step')
            expect(rules[0].value).toBe(5)
        })

        it('should pass validation for valid values', () => {
            const rules = rangeFieldPlugin.validator!(field, 50)
            
            expect(rules).toHaveLength(0)
        })
    })

    describe('Generator', () => {
        const field: Field = {
            name: 'volume',
            type: 'range',
            label: 'Volume Level',
            required: true,
            attributes: {
                min: 0,
                max: 100,
                step: 1,
                value: 50,
                showValue: true,
                unit: '%'
            }
        }

        it('should generate HTML with all attributes', () => {
            const context: HookContext = { field, metadata: { formId: 'test-form' } }
            
            const html = rangeFieldPlugin.generator!(field, context)
            
            expect(html).toContain('type="range"')
            expect(html).toContain('name="volume"')
            expect(html).toContain('min="0"')
            expect(html).toContain('max="100"')
            expect(html).toContain('step="1"')
            expect(html).toContain('value="50"')
            expect(html).toContain('form="test-form"')
            expect(html).toContain('required')
            expect(html).toContain('Volume Level *')
            expect(html).toContain('50%')
        })

        it('should generate HTML without value display when hidden', () => {
            const fieldWithHiddenValue = {
                ...field,
                attributes: { ...field.attributes, showValue: false }
            }
            const context: HookContext = { field: fieldWithHiddenValue }
            
            const html = rangeFieldPlugin.generator!(fieldWithHiddenValue, context)
            
            expect(html).not.toContain('<output')
            expect(html).not.toContain('50%')
        })

        it('should include interactive script for value updates', () => {
            const context: HookContext = { field }
            
            const html = rangeFieldPlugin.generator!(field, context)
            
            expect(html).toContain('oninput=')
            expect(html).toContain('textContent = this.value')
        })
    })

    describe('Data Processor', () => {
        const field: Field = {
            name: 'test',
            type: 'range',
            label: 'Test',
            attributes: { unit: '%' }
        }

        it('should process input values to numbers', () => {
            const processor = rangeFieldPlugin.dataProcessor!
            
            expect(processor.processInput!('50', field)).toBe(50)
            expect(processor.processInput!('25.5', field)).toBe(25.5)
            expect(processor.processInput!('invalid', field)).toBeNull()
        })

        it('should process output values with units', () => {
            const processor = rangeFieldPlugin.dataProcessor!
            
            expect(processor.processOutput!(50, field)).toBe('50%')
            expect(processor.processOutput!(null, field)).toBe('')
        })

        it('should validate numeric values', () => {
            const processor = rangeFieldPlugin.dataProcessor!
            
            expect(processor.validate!(50, field)).toEqual({ valid: true })
            expect(processor.validate!('invalid', field)).toEqual({
                valid: false,
                error: 'Value must be a number'
            })
        })

        it('should serialize and deserialize values', () => {
            const processor = rangeFieldPlugin.dataProcessor!
            
            expect(processor.serialize!(50, field)).toBe('50')
            expect(processor.deserialize!('50', field)).toBe(50)
            expect(processor.deserialize!('invalid', field)).toBeNull()
        })
    })

    describe('Schema Generator', () => {
        it('should generate JSON schema for range field', () => {
            const field: Field = {
                name: 'volume',
                type: 'range',
                label: 'Volume Level',
                required: true,
                attributes: {
                    min: 0,
                    max: 100,
                    step: 5
                }
            }
            
            const schema = rangeFieldPlugin.schemaGenerator!(field)
            
            expect(schema).toEqual({
                type: 'number',
                minimum: 0,
                maximum: 100,
                multipleOf: 5,
                required: true,
                title: 'Volume Level'
            })
        })

        it('should generate minimal schema when no attributes present', () => {
            const field: Field = {
                name: 'simple',
                type: 'range',
                label: 'Simple Range'
            }
            
            const schema = rangeFieldPlugin.schemaGenerator!(field)
            
            expect(schema).toEqual({
                type: 'number',
                minimum: 0,
                maximum: 100,
                title: 'Simple Range'
            })
        })
    })

    describe('Default attributes', () => {
        it('should provide sensible defaults', () => {
            expect(rangeFieldPlugin.defaultAttributes).toEqual({
                min: 0,
                max: 100,
                step: 1,
                showValue: true
            })
        })
    })

    describe('Styles and scripts', () => {
        it('should provide CSS styles for range fields', () => {
            expect(rangeFieldPlugin.styles).toBeTruthy()
            expect(rangeFieldPlugin.styles).toContain('.formdown-range-field')
            expect(rangeFieldPlugin.styles).toContain('.formdown-range-container')
            expect(rangeFieldPlugin.styles).toContain('.formdown-range-output')
        })

        it('should provide client-side JavaScript', () => {
            expect(rangeFieldPlugin.clientScript).toBeTruthy()
            expect(rangeFieldPlugin.clientScript).toContain('DOMContentLoaded')
            expect(rangeFieldPlugin.clientScript).toContain('keydown')
            expect(rangeFieldPlugin.clientScript).toContain('ArrowLeft')
        })
    })
})