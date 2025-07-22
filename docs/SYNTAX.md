# FormDown Syntax Reference

FormDown extends Markdown with form field syntax while maintaining **100% compatibility** with existing Markdown.

## Core Principle

FormDown fields use the pattern `@field_name: [type attributes]` for clarity and Markdown compatibility.

## Smart Label Generation

FormDown automatically generates human-readable labels from field names when no custom label is provided. This feature helps create clean, readable forms without requiring explicit labels for every field.

### Field Naming Rules

- Field names must start with a letter (a-z, A-Z)
- Field names cannot start with a number
- Field names can contain letters, numbers, and underscores

### Automatic Label Formatting

FormDown intelligently converts field names to proper labels:

```formdown
// Snake case → Title Case
@first_name: []           → "First Name"
@email_address: []        → "Email Address"
@phone_number: []         → "Phone Number"

// Camel case → Title Case
@firstName: []            → "First Name"
@emailAddress: []         → "Email Address"
@userPhoneNumber: []      → "User Phone Number"

// Single words → Capitalized
@name: []                 → "Name"
@email: []                → "Email"
@age: []                  → "Age"
```

**Three ways to define field labels:**

```formdown
// Method 1: Using parentheses (recommended for readability)
@field_name(Custom Label): [type attributes]

// Method 2: Using label attribute 
@field_name: [type label="Custom Label" attributes]

// Method 3: Let FormDown generate smart labels automatically
@field_name: [type attributes]

// Examples
@user_name(Full Name): [text required]           // Custom label via parentheses
@user_name: [text required label="Full Name"]    // Custom label via attribute
@user_name: [text required]                      // Smart label: "User Name"
```

## Label Definition Methods

### Method 1: Parentheses Syntax (Recommended)
```formdown
@user_name(Full Name): [text required]
@email_address(Email Address): [email required]
@phone_number(Phone): [tel]
```

**Benefits:**
- **Cleaner syntax** - Separates label from attributes
- **Better readability** - Label stands out visually
- **Less verbose** - No need for `label=` attribute

### Method 2: Label Attribute
```formdown
@user_name: [text required label="Full Name"]
@email_address: [email required label="Email Address"]
@phone_number: [tel label="Phone"]
```

**Benefits:**
- **Attribute consistency** - Treats label like any other attribute
- **Familiar pattern** - Similar to HTML attributes
- **Conditional labels** - Can use dynamic values in frameworks

### When to Use Which?

**Use parentheses `@field(Label):` when:**
- Writing static forms with fixed labels
- Prioritizing readability and clean syntax
- Labels are simple text without special characters

**Use `label=` attribute when:**
- Labels contain quotes or special characters
- Building dynamic forms with template engines
- Consistency with other attribute patterns is important

**Mixed usage is perfectly fine:**
```formdown
@name(Full Name): [text required]
@description: [textarea label="Tell us about yourself" rows=4]
@submit_btn: [submit label="Send Application"]
```

## Minimal Syntax

FormDown supports minimal syntax for common use cases:

### Block Fields - Empty Brackets
```formdown
// Minimal syntax (defaults to text input)
@name: []
@email: []
@phone: []

// Equivalent to
@name: [text]
@email: [text] 
@phone: [text]
```

### Inline Fields - Optional Brackets
```formdown
// Minimal inline syntax
Hello ___@name!
Your age is ___@age.

// Equivalent to
Hello ___@name[text]!
Your age is ___@age[text].
```

**When to use minimal syntax:**
- ✅ **Simple text inputs** without validation
- ✅ **Rapid prototyping** and quick forms
- ✅ **Default behavior** is sufficient

**When to use full syntax:**
- 🔧 **Specific input types** (email, number, date, etc.)
- 🛡️ **Validation rules** (required, min/max, pattern)
- 🎨 **Custom attributes** (classes, data attributes)

## Field Types

### Text Inputs
```formdown
@name: [text required]
@email: [email required]
@password: [password minlength=8]
@phone: [tel]
@website: [url]
@age: [number min=18 max=100]
@birth_date: [date]
@appointment_time: [time]
@birth_month: [month]
@work_week: [week]
@theme_color: [color]
@avatar: [file accept="image/*"]
@volume: [range min=0 max=100]

// Minimal syntax - defaults to text input
@name: []
@description: []
```

### Text Areas
```formdown
@description: [textarea rows=4]
@comments: [textarea required placeholder="Your thoughts..."]
```

### Selection Fields
```formdown
// Radio buttons - single selection (inline by default)
@gender: [radio options="Male,Female,Other"]

// Single checkbox - for yes/no or agreement
@newsletter(Subscribe to newsletter): [checkbox]
@terms(I agree to terms and conditions): [checkbox required]

// Checkbox group - multiple selection (inline by default)
@interests: [checkbox options="Web,Mobile,AI,Design"]

// Vertical layout for longer option lists
@preferences: [checkbox layout="vertical" options="Email Notifications,SMS Alerts,Phone Calls,Push Notifications"]

// Select dropdown
@country: [select options="USA,Canada,UK,Other"]
```

**Checkbox Types:**
- **Single checkbox**: `[checkbox]` - Creates a single checkbox for yes/no, agreement, or subscription
- **Checkbox group**: `[checkbox options="..."]` - Creates multiple checkboxes for multi-select

**Checkbox Content Attribute:**
For single checkboxes, you can use the `content` attribute to specify the display text with priority: **content > label > name**

```formdown
// Using content attribute for precise checkbox text
@terms: [checkbox required content="I agree to the terms and conditions"]
@privacy: [checkbox content="I have read and accept the privacy policy"]

// Content takes priority over label
@newsletter(Newsletter): [checkbox content="Subscribe to our weekly newsletter"]
// Result: Displays "Subscribe to our weekly newsletter" (not "Newsletter")

// Without content, uses label or smart-generated label
@marketing: [checkbox]  // Displays: "Marketing"
```

**Layout Options:**
- **Default (inline)**: Options are displayed horizontally, wrapping to new lines as needed
- **`layout="vertical"`**: Options are displayed vertically, each on its own line

### Actions
```formdown
@submit_btn: [submit label="Submit Form"]
@reset_btn: [reset label="Clear Form"]
```

## Inline Fields 

For embedding fields within text flow, use the `___@field[type attributes]` pattern:

```formdown
Welcome back, ___@user_name[text required]!

Your order details:
- Quantity: ___@quantity[number min=1 max=100] items
- Delivery date: ___@delivery_date[date required]
- Total amount: $___@amount[number min=0 step=0.01]

Special instructions: ___@notes[textarea rows=2 placeholder="Optional notes"]

Contact preference: ___@contact_method[radio options="Email,Phone,SMS"]

// Minimal inline syntax - brackets optional for simple cases
Welcome ___@user_name!
Please enter ___@age and ___@email.
```

**Benefits of `___` prefix:**
- **Consistency**: Uses same `@field[type]` syntax as block fields
- **Visibility**: Easy to spot inline fields in text
- **No conflicts**: Unlikely to clash with existing Markdown syntax
- **Parsing simplicity**: Clear delimiter for parsers
- **Minimal syntax**: Brackets can be omitted for simple text fields

## Attributes

### Universal Attributes
- `label="text"` - Custom field label (overrides field name)
- `content="text"` - Display text for checkboxes (priority: content > label > name)
- `required` - Field is mandatory
- `placeholder="text"` - Placeholder text
- `value="default"` - Default value
- `disabled` - Disable field

### Validation Attributes
- `minlength=n` / `maxlength=n` - Text length constraints
- `min=n` / `max=n` - Numeric/date constraints
- `pattern="regex"` - Custom validation pattern

### Selection Attributes
- `options="item1,item2,item3"` - Available choices

### Text Area Attributes
- `rows=n` - Number of visible rows

### HTML Extensibility

**All HTML attributes are supported** - FormDown passes through any attributes you specify:

```formdown
// Standard HTML attributes
@email: [email required autocomplete="email" spellcheck="false"]
@phone: [tel maxlength=15 inputmode="tel"]
@search: [text autocomplete="off" aria-label="Search products"]

// CSS classes and styling
@username: [text class="form-control" style="border: 2px solid blue"]
@password: [password data-strength="true" aria-describedby="pwd-help"]

// Custom data attributes for JavaScript
@slider: [range min=0 max=100 step=5 data-unit="%" data-live-update="true"]
@upload: [file accept="image/*" data-max-size="5MB" data-preview="true"]

// Accessibility attributes
@bio: [textarea rows=4 aria-required="true" aria-describedby="bio-hint"]
```

**Attribute Processing:**
- Boolean attributes: `required`, `disabled`, `readonly`
- String attributes: Quoted values `placeholder="Enter name"`
- Numeric attributes: Unquoted numbers `min=18`, `max=100`
- All attributes are passed directly to HTML elements

## Examples

### Contact Form (Standard Syntax)
```formdown
# Contact Us

@name(Full Name): [text required]
@email(Email Address): [email required]
@subject: [text required maxlength=100]
@message: [textarea required rows=5 placeholder="Your message..."]

@priority: [radio options="Low,Medium,High"]
@newsletter: [checkbox content="Subscribe to our weekly newsletter"]
@terms: [checkbox required content="I agree to the terms and conditions"]

@submit_form: [submit label="Send Message"]
```

### Contact Form (Shorthand Syntax)
```formdown
# Contact Us

@name*: []
@email*: @[]
@subject*: [maxlength=100]
@message*: T5[]

@priority{Low,Medium,High}: r[]
@newsletter(Subscribe to newsletter): c[]

@submit: [submit label="Send Message"]
```

### Registration Form  
```formdown
# User Registration

@username: [text required minlength=4 pattern="[a-zA-Z0-9_]+"]
@email: [email required]
@password: [password required minlength=8]
@age: [number min=13 max=120]

@terms(I agree to terms and conditions): [checkbox required]

@register: [submit label="Create Account"]
```

### Order Form with Inline Fields
```formdown
# Order Confirmation

Dear ___@customer_name[text required],

Please confirm your order:
- Product: ___@product[select options="Laptop,Phone,Tablet"]
- Quantity: ___@quantity[number min=1 max=10] units
- Delivery by: ___@delivery_date[date required]

Payment method: ___@payment[radio options="Credit Card,PayPal,Bank Transfer"]

Additional notes: ___@notes[textarea rows=3 placeholder="Special delivery instructions"]

@confirm_order: [submit label="Confirm Order"]
```

### Advanced Form with Custom Attributes
```formdown
# User Profile

@avatar(Profile Picture): [file accept="image/*" class="file-upload"]
@username: [text required minlength=3 autocomplete="username" spellcheck="false"]
@email(Email Address): [email required autocomplete="email" class="form-control"]
@birth_date(Date of Birth): [date max="2010-12-31"]
@bio: [textarea rows=4 maxlength=500 placeholder="Tell us about yourself..."]

@theme(Theme Preference): [radio options="Light,Dark,Auto"]
@notifications(Notification Settings): [checkbox options="Email,SMS,Push" class="notification-options"]

@privacy_level(Privacy Level): [range min=1 max=5 step=1 style="width: 200px"]

@save_profile: [submit label="Save Changes" class="btn btn-primary"]
```

## Implementation Notes

### Field Names
- Use snake_case for API compatibility: `user_name`, `email_address`
- Field names become HTML `name` attributes
- Labels can be customized using `label="Custom Text"`

### HTML Output
```formdown
@email(Email Address): [email required autocomplete="email" class="form-control"]
```

Renders to:
```html
<div class="formdown-field">
    <label for="email">Email Address *</label>
    <input type="email" id="email" name="email" required autocomplete="email" class="form-control">
</div>
```

**Custom attributes are preserved:**
```formdown
@slider(Volume Control): [range min=0 max=100 step=5 class="custom-slider"]
```

Renders to:
```html
<div class="formdown-field">
    <label for="slider">Volume Control</label>
    <input type="range" id="slider" name="slider" min="0" max="100" step="5" class="custom-slider">
</div>
```

### Data Collection
```json
{
  "email": "user@example.com",
  "user_name": "John Doe"
}
```

## Validation System

FormDown includes a built-in validation system that works with the core API functions.

### Field Validation

```typescript
import { validateField, validateForm, getSchema } from '@formdown/core'

// Validate a single field
const fieldErrors = validateField('', { 
  required: true, 
  name: 'email',
  label: 'Email Address'
})
// Returns: [{ field: 'email', message: 'Email Address is required' }]

// Validate entire form
const formData = { email: '', name: 'John' }
const schema = getSchema(formdownContent)
const result = validateForm(formData, schema)
// Returns: { isValid: false, errors: [...] }
```

### FormdownUI Component Integration

```typescript
// FormdownUI automatically validates fields with validation attributes
// Access validation state through component methods
const formElement = document.querySelector('formdown-ui')
const validationResult = formElement.validate()

if (!validationResult.isValid) {
  console.log('Validation errors:', validationResult.errors)
}
```

## Programmatic API

### Component Creation

```typescript
import { createFormdownUI, createFormdownEditor } from '@formdown/core'

// Create FormdownUI component
const container = document.getElementById('form-container')
const formComponent = createFormdownUI(container, formdownContent, {
  formId: 'my-form',
  showSubmitButton: true,
  submitText: 'Submit Form'
})

// Create FormdownEditor component
const editorContainer = document.getElementById('editor-container')
const editorComponent = createFormdownEditor(editorContainer, formdownContent, {
  mode: 'split',
  toolbar: true
})
```

### Data Management

```typescript
// Update form data programmatically
formComponent.updateData({ email: 'new@example.com', name: 'Jane' })

// Update single field
formComponent.updateField('email', 'updated@example.com')

// Get current form data
const currentData = formComponent.data
```