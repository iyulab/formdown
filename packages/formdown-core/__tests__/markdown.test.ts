import { FormdownParser } from '../src/parser'
import { FormdownGenerator } from '../src/generator'

describe('Markdown Compatibility', () => {
    let parser: FormdownParser
    let generator: FormdownGenerator

    beforeEach(() => {
        parser = new FormdownParser()
        generator = new FormdownGenerator()
    })

    describe('Basic Markdown Elements', () => {
        test('should preserve headers', () => {
            const content = `# Main Title
## Subtitle
### Section Title`

            const result = parser.parseFormdown(content)
            expect(result.markdown).toContain('# Main Title')
            expect(result.markdown).toContain('## Subtitle')
            expect(result.markdown).toContain('### Section Title')

            const html = generator.generateHTML(result)
            expect(html).toContain('<h1>Main Title</h1>')
            expect(html).toContain('<h2>Subtitle</h2>')
            expect(html).toContain('<h3>Section Title</h3>')
        })

        test('should preserve paragraphs and text formatting', () => {
            const content = `This is a **bold** paragraph with *italic* text.

Another paragraph with ~~strikethrough~~ and \`inline code\`.`

            const result = parser.parseFormdown(content)
            expect(result.markdown).toContain('**bold**')
            expect(result.markdown).toContain('*italic*')

            const html = generator.generateHTML(result)
            expect(html).toContain('<strong>bold</strong>')
            expect(html).toContain('<em>italic</em>')
            expect(html).toContain('<del>strikethrough</del>')
            expect(html).toContain('<code>inline code</code>')
        })

        test('should preserve links and images', () => {
            const content = `Visit [our website](https://example.com) for more info.

![Alt text](image.jpg "Image title")`

            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('<a href="https://example.com">our website</a>')
            expect(html).toContain('<img src="image.jpg" alt="Alt text" title="Image title"')
        })

        test('should preserve lists', () => {
            const content = `## Unordered List
- Item 1
- Item 2
  - Nested item
- Item 3

## Ordered List
1. First item
2. Second item
3. Third item`

            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('<ul>')
            expect(html).toContain('<ol>')
            expect(html).toContain('<li>Item 1</li>')
            expect(html).toContain('<li>First item</li>')
        })

        test('should preserve code blocks', () => {
            const content = `Here's some code:

\`\`\`javascript
function hello() {
    console.log("Hello, world!");
}
\`\`\`

And some other content.`

            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('<pre>')
            expect(html).toContain('<code')
            expect(html).toContain('function hello()')
        })

        test('should preserve blockquotes', () => {
            const content = `> This is a blockquote.
> It can span multiple lines.
>
> And have multiple paragraphs.`

            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('<blockquote>')
            expect(html).toContain('This is a blockquote')
        })

        test('should preserve tables', () => {
            const content = `| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |`

            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('<table>')
            expect(html).toContain('<thead>')
            expect(html).toContain('<tbody>')
            expect(html).toContain('<th>Header 1</th>')
            expect(html).toContain('<td>Cell 1</td>')
        })

        test('should preserve horizontal rules', () => {
            const content = `Before the rule

---

After the rule`

            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('<hr>')
        })
    })

    describe('Markdown with FormDown Fields', () => {
        test('should combine markdown headers with form fields', () => {
            const content = `# Contact Form

Please fill out the information below:

@name(Full Name): [text required]
@email(Email): [email required]

## Additional Information

Feel free to add any comments:

@comments: [textarea rows=4]`

            const result = parser.parseFormdown(content)

            // Should preserve markdown
            expect(result.markdown).toContain('# Contact Form')
            expect(result.markdown).toContain('## Additional Information')
            expect(result.markdown).toContain('Please fill out the information below:')

            // Should extract form fields
            expect(result.forms).toHaveLength(3)
            expect(result.forms[0].name).toBe('name')
            expect(result.forms[1].name).toBe('email')
            expect(result.forms[2].name).toBe('comments')

            const html = generator.generateHTML(result)
            expect(html).toContain('<h1>Contact Form</h1>')
            expect(html).toContain('<h2>Additional Information</h2>')
            expect(html).toContain('<form class="formdown-form">')
        })

        test('should handle inline fields within markdown content', () => {
            const content = `# Welcome

Hello ___@user_name[text required]! 

Your **membership level** is ___@level[select options="Basic,Premium,VIP"].

## Benefits

- Access to *exclusive* content
- Priority support  
- Special ___@discount[number min=0 max=100]% discount`

            const result = parser.parseFormdown(content)

            // Should preserve markdown structure
            expect(result.markdown).toContain('# Welcome')
            expect(result.markdown).toContain('## Benefits')
            expect(result.markdown).toContain('**membership level**')
            expect(result.markdown).toContain('*exclusive*')

            // Should extract inline fields
            expect(result.forms).toHaveLength(3)
            expect(result.forms[0].name).toBe('user_name')
            expect(result.forms[1].name).toBe('level')
            expect(result.forms[2].name).toBe('discount')

            const html = generator.generateHTML(result)
            expect(html).toContain('<h1>Welcome</h1>')
            expect(html).toContain('<strong>membership level</strong>')
            expect(html).toContain('<em>exclusive</em>')
        })

        test('should handle complex markdown with nested elements', () => {
            const content = `# User Registration

Welcome to our platform! Please complete the registration below.

## Personal Information

> **Important**: All fields marked with * are required.

@first_name(First Name): [text required]
@last_name(Last Name): [text required]

### Contact Details

1. Email address ___@email[email required]
2. Phone number ___@phone[tel]

#### Additional Options

- [ ] Newsletter subscription
- [x] Terms acceptance ___@terms[checkbox required options="I agree"]

\`\`\`
Registration Process:
1. Fill form
2. Verify email
3. Complete setup
\`\`\`

---

**Note**: Registration is free and takes less than 2 minutes.`

            const result = parser.parseFormdown(content)

            // Should preserve all markdown elements
            expect(result.markdown).toContain('# User Registration')
            expect(result.markdown).toContain('## Personal Information')
            expect(result.markdown).toContain('### Contact Details')
            expect(result.markdown).toContain('#### Additional Options')
            expect(result.markdown).toContain('> **Important**')
            expect(result.markdown).toContain('```')
            expect(result.markdown).toContain('---')

            // Should extract fields
            expect(result.forms).toHaveLength(5)

            const html = generator.generateHTML(result)
            expect(html).toContain('<h1>User Registration</h1>')
            expect(html).toContain('<h2>Personal Information</h2>')
            expect(html).toContain('<blockquote>')
            expect(html).toContain('<pre>')
            expect(html).toContain('<hr>')
        })
    })

    describe('Edge Cases', () => {
        test('should not interfere with markdown @ symbols', () => {
            const content = `# Contact Information

Email us at support@example.com or admin@company.org.

Follow us @twitter and @instagram.

@contact_form: [text required]`

            const result = parser.parseFormdown(content)

            // Should preserve email addresses and social handles
            expect(result.markdown).toContain('support@example.com')
            expect(result.markdown).toContain('admin@company.org')
            expect(result.markdown).toContain('@twitter')
            expect(result.markdown).toContain('@instagram')

            // Should only extract the actual form field
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0].name).toBe('contact_form')
        })

        test('should not interfere with markdown brackets', () => {
            const content = `# Links and References

Check out [this link](https://example.com) and [another one][ref].

![Image alt text](image.jpg)

[ref]: https://reference.com

@field: [text required]`

            const result = parser.parseFormdown(content)

            // Should preserve markdown links and images
            expect(result.markdown).toContain('[this link](https://example.com)')
            expect(result.markdown).toContain('[another one][ref]')
            expect(result.markdown).toContain('![Image alt text](image.jpg)')
            expect(result.markdown).toContain('[ref]: https://reference.com')

            // Should only extract the form field
            expect(result.forms).toHaveLength(1)
            expect(result.forms[0].name).toBe('field')

            const html = generator.generateHTML(result)
            expect(html).toContain('<a href="https://example.com">this link</a>')
            expect(html).toContain('<img src="image.jpg" alt="Image alt text"')
        })

        test('should handle empty markdown sections', () => {
            const content = `

# Title


@field1: [text]


## Section



@field2: [email]


`

            const result = parser.parseFormdown(content)

            expect(result.forms).toHaveLength(2)
            expect(result.forms[0].name).toBe('field1')
            expect(result.forms[1].name).toBe('field2')

            const html = generator.generateHTML(result)
            expect(html).toContain('<h1>Title</h1>')
            expect(html).toContain('<h2>Section</h2>')
        })
    })

    describe('Markdown Options', () => {
        test('should support disabling markdown preservation', () => {
            const parser = new FormdownParser({ preserveMarkdown: false })
            const content = `# Title

@field: [text]`

            const result = parser.parseFormdown(content)
            expect(result.markdown).toBe('')
            expect(result.forms).toHaveLength(1)
        })

        test('should handle GFM (GitHub Flavored Markdown) features', () => {
            const content = `# Task List

- [x] Completed task
- [ ] Pending task ___@task_name[text]

## Code with syntax highlighting

\`\`\`javascript
const formdown = require('formdown');
\`\`\`

| Feature | Status |
|---------|--------|
| Forms   | ✅     |
| Tables  | ✅     |

~~Strikethrough~~ text and autolinks: https://example.com`

            const result = parser.parseFormdown(content)
            const html = generator.generateHTML(result)

            expect(html).toContain('<input checked="" disabled="" type="checkbox"')
            expect(html).toContain('<code class="language-javascript"')
            expect(html).toContain('<table>')
            expect(html).toContain('<del>Strikethrough</del>')
            expect(html).toContain('<a href="https://example.com"')
        })
    })
})
