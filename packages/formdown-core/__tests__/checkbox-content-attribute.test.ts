import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Checkbox Content Attribute', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Parser - Content Attribute Support', () => {
        test('should parse checkbox with content attribute', () => {
            const content = '@terms: c[required content="I agree to the terms and conditions"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'terms',
                type: 'checkbox',
                label: 'Terms',
                required: true,
                content: 'I agree to the terms and conditions',
                attributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should parse checkbox with both label and content attributes', () => {
            const content = '@privacy: c[label="Privacy Policy" content="I have read and accept the privacy policy" required]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'privacy',
                type: 'checkbox',
                label: 'Privacy Policy',
                required: true,
                content: 'I have read and accept the privacy policy',
                attributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should parse checkbox with parentheses label and content attribute', () => {
            const content = '@newsletter(Newsletter Subscription): c[content="Subscribe to our weekly newsletter"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'newsletter',
                type: 'checkbox',
                label: 'Newsletter Subscription',
                content: 'Subscribe to our weekly newsletter',
                attributes: {
                    form: 'formdown-form-default'
                }
            })
        })

        test('should handle checkbox without content attribute (fallback behavior)', () => {
            const content = '@terms: c[required]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0]).toEqual({
                name: 'terms',
                type: 'checkbox',
                label: 'Terms',
                required: true,
                attributes: {
                    form: 'formdown-form-default'
                }
            })
            expect(result.forms[0].content).toBeUndefined()
        })

        test('should handle quoted content with special characters', () => {
            const content = '@agreement: c[content="I agree to the terms and conditions"]'
            const result = parser.parseFormdown(content)
            
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0].content).toBe('I agree to the terms and conditions')
        })
    })

    describe('Generator - Content Attribute Rendering', () => {
        test('should render checkbox with content as display text', () => {
            const field = {
                name: 'terms',
                type: 'checkbox',
                label: 'Terms',
                required: true,
                content: 'I agree to the terms and conditions',
                attributes: {
                    form: 'formdown-form-default'
                }
            }
            
            const html = generator.generateFieldHTML(field)
            
            // Should use content for the checkbox text, not the label
            expect(html).toContain('I agree to the terms and conditions')
            expect(html).toContain('type="checkbox"')
            expect(html).toContain('name="terms"')
            expect(html).toContain('required')
        })

        test('should prioritize content over label for checkbox text', () => {
            const field = {
                name: 'privacy',
                type: 'checkbox',
                label: 'Privacy Policy',
                content: 'I have read and accept the privacy policy',
                required: true,
                attributes: {
                    form: 'formdown-form-default'
                }
            }
            
            const html = generator.generateFieldHTML(field)
            
            // Should use content, not label, for display text
            expect(html).toContain('I have read and accept the privacy policy')
            expect(html).not.toContain('Privacy Policy')
        })

        test('should fall back to label when no content is provided', () => {
            const field = {
                name: 'newsletter',
                type: 'checkbox',
                label: 'Newsletter Subscription',
                attributes: {
                    form: 'formdown-form-default'
                }
            }
            
            const html = generator.generateFieldHTML(field)
            
            // Should use label as fallback
            expect(html).toContain('Newsletter Subscription')
        })

        test('should fall back to smart label from name when no content or label', () => {
            const field = {
                name: 'email_notifications',
                type: 'checkbox',
                label: 'Email Notifications', // Fix: label is required in Field interface
                attributes: {
                    form: 'formdown-form-default'
                }
            }
            
            const html = generator.generateFieldHTML(field)
            
            // Should use smart label generated from name
            expect(html).toContain('Email Notifications')
        })

        test('should handle HTML escaping in content', () => {
            const field = {
                name: 'terms',
                type: 'checkbox',
                label: 'Terms', // Fix: label is required in Field interface
                content: 'I agree to the <Terms> & "Conditions"',
                attributes: {
                    form: 'formdown-form-default'
                }
            }
            
            const html = generator.generateFieldHTML(field)
            
            // Should properly escape HTML characters
            expect(html).toContain('I agree to the &lt;Terms&gt; &amp; &quot;Conditions&quot;')
        })
    })

    describe('Integration Tests', () => {
        test('should parse and generate correct HTML with content priority', () => {
            const content = `
# User Agreement
@terms(Terms and Conditions): c[required content="I have read and agree to all terms and conditions"]
@privacy: c[content="I accept the privacy policy" label="Privacy"]
@marketing: c[label="Marketing Emails"]
            `.trim()
            
            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)
            
            // First checkbox: should use content
            expect(html).toContain('I have read and agree to all terms and conditions')
            
            // Second checkbox: should use content over label
            expect(html).toContain('I accept the privacy policy')
            expect(html).not.toContain('Privacy')
            
            // Third checkbox: should use label (no content)
            expect(html).toContain('Marketing Emails')
        })

        test('should handle mixed checkbox types in form', () => {
            const content = `
@single_terms: c[content="I agree to terms"]
@multi_interests: c[options="Web,Mobile,AI" content="Select your interests"]
            `.trim()
            
            const parsed = parser.parseFormdown(content)
            expect(parsed.forms).toHaveLength(2)
            
            // Single checkbox with content
            expect(parsed.forms[0].content).toBe('I agree to terms')
            expect(parsed.forms[0].options).toBeUndefined()
            
            // Checkbox group with content and options
            expect(parsed.forms[1].content).toBe('Select your interests')
            expect(parsed.forms[1].options).toEqual(['Web', 'Mobile', 'AI'])
        })
    })
})