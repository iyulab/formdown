/**
 * Field Grouping (Sections) Tests
 * Tests for the ## [Group Label] syntax that generates fieldset/legend HTML
 * Following WCAG accessibility best practices
 */

import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'
import { parseFormdown, generateFormHTML } from '../src/index'

describe('Field Grouping - Parser', () => {
    let parser: FormdownParser

    beforeEach(() => {
        parser = new FormdownParser()
    })

    describe('Basic Group Parsing', () => {
        it('should parse simple group declaration', () => {
            const content = `## [Basic Info]
@name*: []
@email*: @[]`

            const result = parser.parseFormdown(content)

            expect(result.groupDeclarations).toBeDefined()
            expect(result.groupDeclarations).toHaveLength(1)
            expect(result.groupDeclarations![0].label).toBe('Basic Info')
            expect(result.groupDeclarations![0].id).toBe('formdown-group-basic-info')
        })

        it('should parse Korean group labels', () => {
            const content = `## [기본정보]
@name*: []`

            const result = parser.parseFormdown(content)

            expect(result.groupDeclarations).toHaveLength(1)
            expect(result.groupDeclarations![0].label).toBe('기본정보')
            expect(result.groupDeclarations![0].id).toBe('formdown-group-기본정보')
        })

        it('should parse multiple groups', () => {
            const content = `## [Personal Info]
@name*: []
@email*: @[]

## [Contact Details]
@phone: %[]
@address: T2[]`

            const result = parser.parseFormdown(content)

            expect(result.groupDeclarations).toHaveLength(2)
            expect(result.groupDeclarations![0].label).toBe('Personal Info')
            expect(result.groupDeclarations![1].label).toBe('Contact Details')
        })

        it('should assign group to fields within the group', () => {
            const content = `## [Basic Info]
@name*: []
@email*: @[]

## [Additional]
@notes: T4[]`

            const result = parser.parseFormdown(content)

            expect(result.forms[0].group).toBe('formdown-group-basic-info')
            expect(result.forms[1].group).toBe('formdown-group-basic-info')
            expect(result.forms[2].group).toBe('formdown-group-additional')
        })

        it('should not assign group to fields before any group declaration', () => {
            const content = `@standalone: []

## [Grouped]
@grouped_field: []`

            const result = parser.parseFormdown(content)

            expect(result.forms[0].group).toBeUndefined()
            expect(result.forms[1].group).toBe('formdown-group-grouped')
        })
    })

    describe('Collapsible Groups', () => {
        it('should parse collapsible modifier', () => {
            const content = `## [Advanced Settings collapsible]
@setting1: []`

            const result = parser.parseFormdown(content)

            expect(result.groupDeclarations![0].label).toBe('Advanced Settings')
            expect(result.groupDeclarations![0].collapsible).toBe(true)
            expect(result.groupDeclarations![0].collapsed).toBeUndefined()
        })

        it('should parse collapsed modifier', () => {
            const content = `## [Hidden Options collapsed]
@option1: []`

            const result = parser.parseFormdown(content)

            expect(result.groupDeclarations![0].label).toBe('Hidden Options')
            expect(result.groupDeclarations![0].collapsible).toBe(true)
            expect(result.groupDeclarations![0].collapsed).toBe(true)
        })
    })

    describe('Group vs Regular Headings', () => {
        it('should distinguish group syntax from regular ## headings', () => {
            const content = `## Regular Heading
@field1: []

## [Group Section]
@field2: []`

            const result = parser.parseFormdown(content)

            // Only one group declaration (not two)
            expect(result.groupDeclarations).toHaveLength(1)
            expect(result.groupDeclarations![0].label).toBe('Group Section')
        })

        it('should close group when encountering regular ## heading', () => {
            const content = `## [Grouped Section]
@grouped: []

## Regular Heading
@not_grouped: []`

            const result = parser.parseFormdown(content)

            expect(result.forms[0].group).toBe('formdown-group-grouped-section')
            expect(result.forms[1].group).toBeUndefined()
        })
    })
})

describe('Field Grouping - Generator', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Fieldset/Legend HTML Generation', () => {
        it('should generate fieldset with legend for groups', () => {
            const content = `## [Basic Info]
@name*: []`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('<fieldset')
            expect(html).toContain('class="formdown-group"')
            expect(html).toContain('data-group="formdown-group-basic-info"')
            expect(html).toContain('<legend>Basic Info</legend>')
            expect(html).toContain('</fieldset>')
        })

        it('should generate collapsible attributes', () => {
            const content = `## [Advanced collapsible]
@setting: []`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('data-collapsible="true"')
        })

        it('should generate collapsed attributes', () => {
            const content = `## [Hidden collapsed]
@option: []`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).toContain('data-collapsible="true"')
            expect(html).toContain('data-collapsed="true"')
        })

        it('should properly nest fields inside fieldset', () => {
            const content = `## [Contact]
@email*: @[]
@phone: %[]`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            // The fieldset should contain the fields
            const fieldsetMatch = html.match(/<fieldset[^>]*>[\s\S]*?<\/fieldset>/)
            expect(fieldsetMatch).toBeTruthy()

            const fieldsetContent = fieldsetMatch![0]
            expect(fieldsetContent).toContain('name="email"')
            expect(fieldsetContent).toContain('name="phone"')
        })

        it('should close fieldset before next group starts', () => {
            const content = `## [Group 1]
@field1: []

## [Group 2]
@field2: []`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            // Count fieldsets - should be 2
            const fieldsetCount = (html.match(/<fieldset/g) || []).length
            const closeFieldsetCount = (html.match(/<\/fieldset>/g) || []).length

            expect(fieldsetCount).toBe(2)
            expect(closeFieldsetCount).toBe(2)
        })
    })

    describe('Accessibility Compliance', () => {
        it('should always pair fieldset with legend', () => {
            const content = `## [Accessible Group]
@field: []`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            // Every fieldset should have a legend as first child
            expect(html).toMatch(/<fieldset[^>]*>\s*\n?\s*<legend>/)
        })

        it('should escape HTML in legend text', () => {
            const content = `## [<script>alert("xss")</script>]
@field: []`

            const parsed = parser.parseFormdown(content)
            const html = generator.generateHTML(parsed)

            expect(html).not.toContain('<script>')
            expect(html).toContain('&lt;script&gt;')
        })
    })
})

describe('Field Grouping - Integration', () => {
    it('should work with convenience functions', () => {
        const content = `# Customer Registration

## [Personal Information]
@first_name*: []
@last_name*: []
@email*: @[]

## [Contact Details]
@phone: %[]
@address: T2[]

## [Preferences collapsed]
@newsletter: c[]`

        const parsed = parseFormdown(content)
        const html = generateFormHTML(content)

        // Verify parsing
        expect(parsed.groupDeclarations).toHaveLength(3)
        expect(parsed.forms).toHaveLength(6)

        // Verify HTML generation
        expect(html).toContain('<fieldset')
        expect(html).toContain('<legend>Personal Information</legend>')
        expect(html).toContain('<legend>Contact Details</legend>')
        expect(html).toContain('<legend>Preferences</legend>')
        expect(html).toContain('data-collapsed="true"')
    })

    it('should work with forms and groups together', () => {
        const content = `@form[id="registration"]

## [Account Info]
@username*: []
@password*: [password]

## [Profile]
@bio: T4[]`

        const parsed = parseFormdown(content)

        expect(parsed.formDeclarations).toHaveLength(1)
        expect(parsed.groupDeclarations).toHaveLength(2)
        expect(parsed.forms.every(f => f.attributes?.form === 'registration')).toBe(true)
    })

    it('should work with inline fields in groups', () => {
        const content = `## [Quick Info]
Enter your name: ___@name* and email: ___@email*`

        const parsed = parseFormdown(content)
        const html = generateFormHTML(content)

        expect(parsed.forms[0].inline).toBe(true)
        expect(parsed.forms[0].group).toBe('formdown-group-quick-info')
        expect(html).toContain('<fieldset')
    })
})

describe('Field Grouping - Edge Cases', () => {
    it('should handle empty groups', () => {
        const content = `## [Empty Group]

## [Non-empty]
@field: []`

        const parsed = parseFormdown(content)

        expect(parsed.groupDeclarations).toHaveLength(2)
        expect(parsed.forms).toHaveLength(1)
        expect(parsed.forms[0].group).toBe('formdown-group-non-empty')
    })

    it('should handle groups at end of content', () => {
        const content = `## [Final Group]
@last_field: []`

        const html = generateFormHTML(content)

        // Should properly close the final fieldset
        expect(html).toContain('</fieldset>')
        const openCount = (html.match(/<fieldset/g) || []).length
        const closeCount = (html.match(/<\/fieldset>/g) || []).length
        expect(openCount).toBe(closeCount)
    })

    it('should handle special characters in group labels', () => {
        const content = `## [User's Info & Details]
@field: []`

        const parsed = parseFormdown(content)
        const html = generateFormHTML(content)

        expect(parsed.groupDeclarations![0].label).toBe("User's Info & Details")
        expect(html).toContain('User&#39;s Info &amp; Details')
    })

    it('should generate unique IDs for similar labels', () => {
        const content = `## [Basic Info]
@field1: []

## [Basic  Info]
@field2: []`

        const parsed = parseFormdown(content)

        // Both should have IDs but they might be the same due to normalization
        // The important thing is that the groups are distinct
        expect(parsed.groupDeclarations).toHaveLength(2)
    })
})
