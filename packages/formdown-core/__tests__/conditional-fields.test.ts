/**
 * Conditional Fields Tests
 * Tests for the visible-if, hidden-if, enabled-if, disabled-if, required-if attributes
 */

import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'
import { getSchema } from '../src/schema'

describe('Conditional Fields', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Parser - Condition Parsing', () => {
        it('should parse visible-if with equality condition', () => {
            const content = `
@order_type{Individual,Corporate}: r[]
@company_name: [visible-if="order_type=Corporate"]
`
            const result = parser.parseFormdown(content)
            const companyField = result.forms.find(f => f.name === 'company_name')

            expect(companyField).toBeDefined()
            expect(companyField?.conditions).toBeDefined()
            expect(companyField?.conditions?.visibleIf).toEqual({
                field: 'order_type',
                operator: '=',
                value: 'Corporate'
            })
        })

        it('should parse visible-if with inequality condition', () => {
            const content = `
@status{Active,Inactive}: r[]
@notes: [visible-if="status!=Active"]
`
            const result = parser.parseFormdown(content)
            const notesField = result.forms.find(f => f.name === 'notes')

            expect(notesField?.conditions?.visibleIf).toEqual({
                field: 'status',
                operator: '!=',
                value: 'Active'
            })
        })

        it('should parse visible-if with truthy condition (checkbox)', () => {
            const content = `
@has_coupon: c[]
@coupon_code: [visible-if="has_coupon"]
`
            const result = parser.parseFormdown(content)
            const couponField = result.forms.find(f => f.name === 'coupon_code')

            expect(couponField?.conditions?.visibleIf).toEqual({
                field: 'has_coupon',
                operator: 'truthy'
            })
        })

        it('should parse visible-if with falsy condition (negation)', () => {
            const content = `
@newsletter: c[]
@unsubscribe_reason: [visible-if="!newsletter"]
`
            const result = parser.parseFormdown(content)
            const reasonField = result.forms.find(f => f.name === 'unsubscribe_reason')

            expect(reasonField?.conditions?.visibleIf).toEqual({
                field: 'newsletter',
                operator: 'falsy'
            })
        })

        it('should parse hidden-if condition', () => {
            const content = `
@is_guest: c[]
@member_id: [hidden-if="is_guest"]
`
            const result = parser.parseFormdown(content)
            const memberField = result.forms.find(f => f.name === 'member_id')

            expect(memberField?.conditions?.hiddenIf).toEqual({
                field: 'is_guest',
                operator: 'truthy'
            })
        })

        it('should parse enabled-if condition', () => {
            const content = `
@agree_terms: c[]
@submit: [submit enabled-if="agree_terms"]
`
            const result = parser.parseFormdown(content)
            const submitField = result.forms.find(f => f.name === 'submit')

            expect(submitField?.conditions?.enabledIf).toEqual({
                field: 'agree_terms',
                operator: 'truthy'
            })
        })

        it('should parse disabled-if condition', () => {
            const content = `
@is_locked: c[]
@edit_button: [button disabled-if="is_locked"]
`
            const result = parser.parseFormdown(content)
            const editField = result.forms.find(f => f.name === 'edit_button')

            expect(editField?.conditions?.disabledIf).toEqual({
                field: 'is_locked',
                operator: 'truthy'
            })
        })

        it('should parse required-if condition', () => {
            const content = `
@has_coupon: c[]
@coupon_code: [required-if="has_coupon"]
`
            const result = parser.parseFormdown(content)
            const couponField = result.forms.find(f => f.name === 'coupon_code')

            expect(couponField?.conditions?.requiredIf).toEqual({
                field: 'has_coupon',
                operator: 'truthy'
            })
        })

        it('should parse multiple conditions on same field', () => {
            const content = `
@payment_type{Cash,Credit,Other}: r[]
@card_number: [visible-if="payment_type=Credit" required-if="payment_type=Credit"]
`
            const result = parser.parseFormdown(content)
            const cardField = result.forms.find(f => f.name === 'card_number')

            expect(cardField?.conditions?.visibleIf).toEqual({
                field: 'payment_type',
                operator: '=',
                value: 'Credit'
            })
            expect(cardField?.conditions?.requiredIf).toEqual({
                field: 'payment_type',
                operator: '=',
                value: 'Credit'
            })
        })

        it('should handle quoted condition values', () => {
            const content = `
@status{Active,In Progress,Completed}: r[]
@progress_notes: [visible-if="status=In Progress"]
`
            const result = parser.parseFormdown(content)
            const notesField = result.forms.find(f => f.name === 'progress_notes')

            expect(notesField?.conditions?.visibleIf).toEqual({
                field: 'status',
                operator: '=',
                value: 'In Progress'
            })
        })
    })

    describe('Generator - Data Attributes Output', () => {
        it('should generate data attributes for visible-if condition', () => {
            const content = `
@order_type{Individual,Corporate}: r[]
@company_name: [visible-if="order_type=Corporate"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('data-visible-if-field="order_type"')
            expect(html).toContain('data-visible-if-operator="="')
            expect(html).toContain('data-visible-if-value="Corporate"')
        })

        it('should generate data attributes for hidden-if condition', () => {
            const content = `
@is_guest: c[]
@member_id: [hidden-if="is_guest"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('data-hidden-if-field="is_guest"')
            expect(html).toContain('data-hidden-if-operator="truthy"')
        })

        it('should generate data attributes for enabled-if condition', () => {
            const content = `
@agree: c[]
@next_button: [text enabled-if="agree"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('data-enabled-if-field="agree"')
            expect(html).toContain('data-enabled-if-operator="truthy"')
        })

        it('should generate data attributes for disabled-if condition', () => {
            const content = `
@is_locked: c[]
@edit_field: [text disabled-if="is_locked"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('data-disabled-if-field="is_locked"')
            expect(html).toContain('data-disabled-if-operator="truthy"')
        })

        it('should generate data attributes for required-if condition', () => {
            const content = `
@has_coupon: c[]
@coupon_code: [required-if="has_coupon"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('data-required-if-field="has_coupon"')
            expect(html).toContain('data-required-if-operator="truthy"')
        })

        it('should add formdown-conditional class to fields with conditions', () => {
            const content = `
@has_coupon: c[]
@coupon_code: [visible-if="has_coupon"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('class="formdown-field formdown-conditional"')
        })

        it('should not add formdown-conditional class to fields without conditions', () => {
            const content = `
@name: []
@email: @[]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            // Should have formdown-field but not formdown-conditional
            expect(html).toContain('class="formdown-field"')
            expect(html).not.toContain('formdown-conditional')
        })

        it('should escape HTML in condition values', () => {
            const content = `
@status{Active,<script>alert(1)</script>}: r[]
@notes: [visible-if="status=<script>alert(1)</script>"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).not.toContain('<script>')
            expect(html).toContain('&lt;script&gt;')
        })
    })

    describe('Schema - Conditional Fields', () => {
        it('should include conditions in schema output', () => {
            const content = `
@order_type{Individual,Corporate}: r[]
@company_name: [visible-if="order_type=Corporate"]
`
            const schema = getSchema(content)

            expect(schema.company_name.conditions).toBeDefined()
            expect(schema.company_name.conditions?.visibleIf).toEqual({
                field: 'order_type',
                operator: '=',
                value: 'Corporate'
            })
        })

        it('should include multiple conditions in schema', () => {
            const content = `
@payment: r[options="Cash,Credit"]
@card: [visible-if="payment=Credit" required-if="payment=Credit"]
`
            const schema = getSchema(content)

            expect(schema.card.conditions?.visibleIf).toBeDefined()
            expect(schema.card.conditions?.requiredIf).toBeDefined()
        })
    })

    describe('Real-World Scenarios', () => {
        it('should handle order form with conditional business fields', () => {
            const content = `
# Order Form

@customer_type{Individual,Business}: r[]
@name*: []
@company: [visible-if="customer_type=Business"]
@business_number: [visible-if="customer_type=Business"]
@tax_id: [visible-if="customer_type=Business" required-if="customer_type=Business"]
`
            const result = parser.parseFormdown(content)

            // Verify all business fields have conditions
            const company = result.forms.find(f => f.name === 'company')
            const businessNumber = result.forms.find(f => f.name === 'business_number')
            const taxId = result.forms.find(f => f.name === 'tax_id')

            expect(company?.conditions?.visibleIf?.field).toBe('customer_type')
            expect(businessNumber?.conditions?.visibleIf?.field).toBe('customer_type')
            expect(taxId?.conditions?.visibleIf?.field).toBe('customer_type')
            expect(taxId?.conditions?.requiredIf?.field).toBe('customer_type')
        })

        it('should handle payment form with conditional card fields', () => {
            const content = `
# Payment

@payment_method{Cash,Credit Card,Bank Transfer}: r[]
@card_number: [visible-if="payment_method=Credit Card"]
@card_expiry: [visible-if="payment_method=Credit Card"]
@card_cvv: [visible-if="payment_method=Credit Card"]
@bank_name: [visible-if="payment_method=Bank Transfer"]
@account_number: [visible-if="payment_method=Bank Transfer"]
`
            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            // Card fields should have Credit Card condition
            expect(html).toContain('data-visible-if-value="Credit Card"')

            // Bank fields should have Bank Transfer condition
            expect(html).toContain('data-visible-if-value="Bank Transfer"')
        })

        it('should handle newsletter subscription with confirmation', () => {
            const content = `
@subscribe: c[content="Subscribe to newsletter"]
@email: @[visible-if="subscribe" required-if="subscribe"]
@frequency{Daily,Weekly,Monthly}: r[visible-if="subscribe"]
`
            const result = parser.parseFormdown(content)

            const email = result.forms.find(f => f.name === 'email')
            const frequency = result.forms.find(f => f.name === 'frequency')

            expect(email?.conditions?.visibleIf?.operator).toBe('truthy')
            expect(email?.conditions?.requiredIf?.operator).toBe('truthy')
            expect(frequency?.conditions?.visibleIf?.field).toBe('subscribe')
        })
    })
})
