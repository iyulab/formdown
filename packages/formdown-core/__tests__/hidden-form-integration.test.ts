import { parseFormdown, generateFormHTML } from '../src/index'

describe('Hidden Form Architecture - Integration Tests', () => {
  describe('End-to-End Form Generation', () => {
    test('should create complete contact form with hidden form architecture', () => {
      const content = `
# Contact Us

@form[action="/contact" method="POST"]

@name(Full Name): [text required maxlength=50]
@email(Email Address): [email required]
@subject: [text required maxlength=100]
@message: [textarea required rows=5 placeholder="Your message..."]

@priority: [radio options="Low,Medium,High"]
@newsletter: [checkbox content="Subscribe to our weekly newsletter"]
@terms: [checkbox required content="I agree to the terms and conditions"]

@submit_form: [submit label="Send Message"]
`
      
      const html = generateFormHTML(content)
      
      // Should contain hidden form
      expect(html).toContain('<form hidden id="formdown-form-1" action="/contact" method="POST"></form>')
      
      // Should contain all fields with proper form association
      expect(html).toContain('form="formdown-form-1"')
      expect(html).toContain('name="name"')
      expect(html).toContain('name="email"')
      expect(html).toContain('name="subject"')
      expect(html).toContain('name="message"')
      expect(html).toContain('name="priority"')
      expect(html).toContain('name="newsletter"')
      expect(html).toContain('name="terms"')
      
      // Should contain submit button with form association
      expect(html).toContain('<button type="submit" form="formdown-form-1">Send Message</button>')
      
      // Should preserve markdown content
      expect(html).toContain('<h1>Contact Us</h1>')
    })

    test('should handle multi-form login/register system', () => {
      const content = `
# Authentication System

@form[id="login-form" action="/login" method="POST"]
@form[id="register-form" action="/register" method="POST"]

## Login
@login_username: [text required placeholder="Username" form="login-form"]
@login_password: [password required form="login-form"]
@remember_me: [checkbox content="Remember me" form="login-form"]
@login_submit: [submit label="Login" form="login-form"]

## Registration  
@reg_username: [text required minlength=3 placeholder="Choose username" form="register-form"]
@reg_email: [email required placeholder="your@email.com" form="register-form"]
@reg_password: [password required minlength=8 form="register-form"]
@reg_confirm: [password required placeholder="Confirm password" form="register-form"]
@terms_agree: [checkbox required content="I agree to terms" form="register-form"]
@register_submit: [submit label="Create Account" form="register-form"]
`
      
      const html = generateFormHTML(content)
      
      // Should contain both hidden forms
      expect(html).toContain('<form hidden id="login-form" action="/login" method="POST"></form>')
      expect(html).toContain('<form hidden id="register-form" action="/register" method="POST"></form>')
      
      // Should properly associate login fields
      expect(html).toContain('name="login_username"')
      expect(html).toContain('form="login-form"')
      expect(html).toContain('<button type="submit" form="login-form">Login</button>')
      
      // Should properly associate register fields
      expect(html).toContain('name="reg_username"')
      expect(html).toContain('form="register-form"')
      expect(html).toContain('<button type="submit" form="register-form">Create Account</button>')
    })

    test('should handle inline fields with form association', () => {
      const content = `
# Survey Form

@form[id="survey" action="/survey" method="POST"]

## Personal Information
Hello! Please tell us about yourself.

Your name is ___@name[text required form="survey"] and you are ___@age[number min=18 max=100 form="survey"] years old.

You can be reached at ___@email[email required form="survey"].

## Submit
@submit_survey: [submit label="Submit Survey" form="survey"]
`
      
      const html = generateFormHTML(content)
      
      // Should contain hidden form
      expect(html).toContain('<form hidden id="survey" action="/survey" method="POST"></form>')
      
      // Should contain inline fields (as spans with data attributes)
      expect(html).toContain('data-field-name="name"')
      expect(html).toContain('data-field-name="age"')
      expect(html).toContain('data-field-name="email"')
      
      // Should contain submit button
      expect(html).toContain('<button type="submit" form="survey">Submit Survey</button>')
      
      // Should preserve markdown structure
      expect(html).toContain('<h1>Survey Form</h1>')
      expect(html).toContain('<h2>Personal Information</h2>')
    })

    test('should work with shorthand syntax', () => {
      const content = `
# Quick Form

@form[action="/quick" method="POST"]

@name*: []
@email*: @[]
@age: #[]
@comments: T3[]
@priority{Low,Medium,High}: r[]
@newsletter: c[]

@submit: [submit label="Submit"]
`
      
      const html = generateFormHTML(content)
      
      // Should contain hidden form
      expect(html).toContain('<form hidden id="formdown-form-1" action="/quick" method="POST"></form>')
      
      // Should expand shorthand correctly with form association
      expect(html).toContain('name="name"')
      expect(html).toContain('required')
      expect(html).toContain('type="email"')
      expect(html).toContain('type="number"')
      expect(html).toContain('type="radio"')
      expect(html).toContain('form="formdown-form-1"')
    })

    test('should handle file upload form with proper enctype', () => {
      const content = `
# File Upload

@form[action="/upload" method="POST" enctype="multipart/form-data"]

@title: [text required]
@description: [textarea rows=3]
@file: [file accept="image/*" required]
@category: [select options="Photos,Documents,Videos"]

@upload: [submit label="Upload File"]
`
      
      const html = generateFormHTML(content)
      
      // Should contain proper form attributes
      expect(html).toContain('<form hidden id="formdown-form-1" action="/upload" method="POST" enctype="multipart/form-data"></form>')
      
      // Should contain file input with form association
      expect(html).toContain('type="file"')
      expect(html).toContain('accept="image/*"')
      expect(html).toContain('form="formdown-form-1"')
    })

    test('should handle default form when no @form declared', () => {
      const content = `
# Simple Form

@username: [text required]
@password: [password required]
@submit: [submit label="Login"]
`
      
      const html = generateFormHTML(content)
      
      // Should create default hidden form
      expect(html).toContain('<form hidden id="formdown-form-default" action="." method="GET"></form>')
      
      // Should associate fields with default form
      expect(html).toContain('form="formdown-form-default"')
      expect(html).toContain('<button type="submit" form="formdown-form-default">Login</button>')
    })
  })

  describe('Complex Real-World Scenarios', () => {
    test('should handle e-commerce checkout form', () => {
      const content = `
# Checkout

@form[id="shipping" action="/shipping" method="POST"]
@form[id="payment" action="/payment" method="POST"]

## Shipping Information
@ship_name: [text required form="shipping"]
@ship_address: [text required form="shipping"]
@ship_city: [text required form="shipping"]
@ship_country: [select options="USA,Canada,UK" form="shipping"]

## Payment Information  
@card_number: [text required pattern="\\\\d{4} \\\\d{4} \\\\d{4} \\\\d{4}" form="payment"]
@card_expiry: [text required pattern="\\\\d{2}/\\\\d{2}" form="payment"]
@card_cvv: [text required pattern="\\\\d{3,4}" form="payment"]

@save_shipping: [submit label="Save Shipping" form="shipping"]
@process_payment: [submit label="Process Payment" form="payment"]
`
      
      const html = generateFormHTML(content)
      
      expect(html).toContain('<form hidden id="shipping" action="/shipping" method="POST"></form>')
      expect(html).toContain('<form hidden id="payment" action="/payment" method="POST"></form>')
      expect(html).toContain('form="shipping"')
      expect(html).toContain('form="payment"')
      expect(html).toContain('<button type="submit" form="shipping">Save Shipping</button>')
      expect(html).toContain('<button type="submit" form="payment">Process Payment</button>')
    })

    test('should handle survey with mixed field types and forms', () => {
      const content = `
# Customer Survey

@form[id="demographics" action="/demographics" method="POST"]
@form[id="feedback" action="/feedback" method="POST"]

Please tell us about yourself: ___@name[text form="demographics"] (age ___@age[number form="demographics"]).

## Demographics
@gender: [radio options="Male,Female,Other,Prefer not to say" form="demographics"]
@income: [select options="<$25k,$25k-$50k,$50k-$100k,>$100k" form="demographics"]

## Feedback
Rate our service: ___@service_rating[range min=1 max=5 form="feedback"]

@comments: [textarea rows=4 placeholder="Additional comments..." form="feedback"]
@recommend: [radio options="Yes,No,Maybe" form="feedback"]

@submit_demographics: [submit label="Submit Demographics" form="demographics"]
@submit_feedback: [submit label="Submit Feedback" form="feedback"]
`
      
      const html = generateFormHTML(content)
      
      expect(html).toContain('<form hidden id="demographics"')
      expect(html).toContain('<form hidden id="feedback"')
      expect(html).toContain('data-field-name="name"')
      expect(html).toContain('data-field-name="age"')
      expect(html).toContain('data-field-name="service_rating"')
      expect(html).toContain('form="demographics"')
      expect(html).toContain('form="feedback"')
    })
  })

  describe('Error Recovery and Edge Cases', () => {
    test('should recover from malformed @form declarations', () => {
      const content = `
@form[action="/test" invalid-syntax
@form[action="/valid" method="POST"]

@field1: [text]
@field2: [email]
`
      
      const html = generateFormHTML(content)
      
      // Should handle valid form and associate fields
      expect(html).toContain('<form hidden id="formdown-form-1" action="/valid" method="POST"></form>')
      expect(html).toContain('form="formdown-form-1"')
    })

    test('should handle mixed explicit and automatic form associations', () => {
      const content = `
@form[id="form1" action="/submit1"]
@form[id="form2" action="/submit2"]

@auto1: [text]  // Should auto-associate with form2 (most recent)
@explicit1: [email form="form1"]  // Explicit association
@auto2: [password]  // Should auto-associate with form2
@explicit2: [text form="form1"]  // Explicit association
@invalid: [text form="nonexistent"]  // Should fallback to form2 or default
`
      
      const html = generateFormHTML(content)
      
      expect(html).toContain('<form hidden id="form1"')
      expect(html).toContain('<form hidden id="form2"')
      expect(html).toContain('name="auto1"')
      expect(html).toContain('name="explicit1"')
      expect(html).toContain('form="form1"')
      expect(html).toContain('form="form2"')
    })
  })
})