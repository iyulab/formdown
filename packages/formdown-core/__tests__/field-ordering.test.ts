import { parseFormdown, generateFormHTML } from '../src/index'

describe('Field Ordering', () => {
  describe('Block field ordering with mixed content', () => {
    it('should preserve field order with markdown content between fields', () => {
      const formdown = `# Registration Form

## Personal Details
@name: [text required]
@email: [email required]

We value your privacy and will not share your information.

## Account Settings
@username: [text required]
@password: [password required]

By registering, you agree to our terms.`

      const result = parseFormdown(formdown)
      const html = generateFormHTML(result)
      
      // Verify the structure maintains proper ordering
      expect(html).toMatch(/<h1[^>]*>Registration Form<\/h1>/)
      expect(html).toMatch(/<h2[^>]*>Personal Details<\/h2>/)
      
      // Name and email should appear after "Personal Details" heading
      const personalDetailsIndex = html.indexOf('Personal Details')
      const nameFieldIndex = html.indexOf('name="name"')
      const emailFieldIndex = html.indexOf('name="email"')
      
      expect(nameFieldIndex).toBeGreaterThan(personalDetailsIndex)
      expect(emailFieldIndex).toBeGreaterThan(nameFieldIndex)
      
      // Privacy text should appear after email field but before "Account Settings"
      const privacyTextIndex = html.indexOf('We value your privacy')
      const accountSettingsIndex = html.indexOf('Account Settings')
      
      expect(privacyTextIndex).toBeGreaterThan(emailFieldIndex)
      expect(accountSettingsIndex).toBeGreaterThan(privacyTextIndex)
      
      // Username and password should appear after "Account Settings" heading
      const usernameFieldIndex = html.indexOf('name="username"')
      const passwordFieldIndex = html.indexOf('name="password"')
      
      expect(usernameFieldIndex).toBeGreaterThan(accountSettingsIndex)
      expect(passwordFieldIndex).toBeGreaterThan(usernameFieldIndex)
      
      // Terms text should appear after password field
      const termsTextIndex = html.indexOf('By registering, you agree')
      expect(termsTextIndex).toBeGreaterThan(passwordFieldIndex)
    })

    it('should handle multiple fields separated by markdown content', () => {
      const formdown = `# Contact Form

Please fill out this form:

@name: [text required]

Your name will be used for correspondence.

@email: [email required]

We'll send a confirmation to this address.

@message: [textarea required]

Thank you for your message!`

      const result = parseFormdown(formdown)
      const html = generateFormHTML(result)
      
      // Verify fields are positioned correctly relative to their descriptions
      const nameFieldIndex = html.indexOf('name="name"')
      const nameDescIndex = html.indexOf('Your name will be used')
      const emailFieldIndex = html.indexOf('name="email"')
      const emailDescIndex = html.indexOf("We&#39;ll send a confirmation")
      const messageFieldIndex = html.indexOf('name="message"')
      const thankYouIndex = html.indexOf('Thank you for your message')
      
      expect(nameDescIndex).toBeGreaterThan(nameFieldIndex)
      expect(emailFieldIndex).toBeGreaterThan(nameDescIndex)
      expect(emailDescIndex).toBeGreaterThan(emailFieldIndex)
      expect(messageFieldIndex).toBeGreaterThan(emailDescIndex)
      expect(thankYouIndex).toBeGreaterThan(messageFieldIndex)
    })

    it('should handle inline fields maintaining order', () => {
      const formdown = `# Survey

Rate our service: ___@rating[radio options="1,2,3,4,5"]

Any additional comments: ___@comments[text]

Thank you for your feedback!`

      const result = parseFormdown(formdown)
      const html = generateFormHTML(result)
      
      // Verify inline fields maintain their position in the text
      // Note: Inline fields are rendered as contenteditable spans, not traditional form inputs
      expect(html).toMatch(/Rate our service:[\s\S]*data-field-name="rating"/)
      expect(html).toMatch(/Any additional comments:[\s\S]*data-field-name="comments"/)
      expect(html).toMatch(/data-field-name="comments"[\s\S]*Thank you for your feedback/)
    })

    it('should handle mixed inline and block fields', () => {
      const formdown = `# Mixed Form

Block field first:
@name: [text required]

Inline field in sentence: Please rate ___@rating[radio options="1,2,3"] stars.

Another block field:
@email: [email required]

Final inline: Your score is ___@score[number].`

      const result = parseFormdown(formdown)
      const html = generateFormHTML(result)
      
      // Verify proper ordering of mixed field types
      const nameIndex = html.indexOf('name="name"')
      const ratingIndex = html.indexOf('data-field-name="rating"')
      const emailIndex = html.indexOf('name="email"')
      const scoreIndex = html.indexOf('data-field-name="score"')
      
      expect(ratingIndex).toBeGreaterThan(nameIndex)
      expect(emailIndex).toBeGreaterThan(ratingIndex)
      expect(scoreIndex).toBeGreaterThan(emailIndex)
      
      // Verify inline fields are within their sentences
      expect(html).toMatch(/Please rate[\s\S]*data-field-name="rating"[\s\S]*stars/)
      expect(html).toMatch(/Your score is[\s\S]*data-field-name="score"/)
    })
  })

  describe('Fixed behavior verification', () => {
    it('verifies field ordering is now working correctly', () => {
      const formdown = `# Form

First section:
@field1: [text]

Middle content here.

Second section:
@field2: [text]`

      const result = parseFormdown(formdown)
      const html = generateFormHTML(result)
      
      // Verify the fix: fields should now appear in their correct order
      const field1Index = html.indexOf('name="field1"')
      const field2Index = html.indexOf('name="field2"')
      const middleContentIndex = html.indexOf('Middle content here')
      
      // FIXED BEHAVIOR: field2 now appears AFTER middle content
      expect(field2Index).toBeGreaterThan(middleContentIndex)
      expect(field1Index).toBeLessThan(middleContentIndex)
    })
  })
})