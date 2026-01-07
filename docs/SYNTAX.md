# FormDown Syntax Reference

FormDown extends Markdown with form field syntax while maintaining **100% compatibility** with existing Markdown.

## Core Principle

FormDown fields use the pattern `@field_name: [type attributes]` for clarity and Markdown compatibility.

## Form Declaration and Hidden Form Architecture

FormDown uses a **hidden form architecture** that separates form definition from field definition for clean styling and flexible layout:

### Form Declaration Syntax
```formdown
// Basic form declaration
@form[action="/submit" method="POST"]

// Form with custom ID
@form[id="contact-form" action="/contact" method="POST"]

// Multiple forms in one document
@form[id="login" action="/login" method="POST"]
@form[id="register" action="/register" method="POST"]
```

### Hidden Form Implementation
FormDown generates hidden form elements that don't interfere with your document styling:

```html
<!-- Generated hidden form -->
<form hidden id="formdown-form-1" action="/submit" method="POST"></form>

<!-- Fields reference the form via form attribute -->
<input type="text" name="username" form="formdown-form-1">
<input type="email" name="email" form="formdown-form-1">
```

### Field-Form Association
```formdown
@form[action="/submit" method="POST"]

// Fields automatically associate with the most recent @form
@username: [text required]
@email: [email required]

// Or explicitly specify form association
@special_field: [text form="other-form-id"]
```

**Benefits of Hidden Form Architecture:**
- ✅ **Clean styling**: No form wrapper interfering with CSS layout
- ✅ **Flexible positioning**: Fields can be placed anywhere in the document
- ✅ **Multiple forms**: Support multiple forms in one document
- ✅ **HTML standards**: Uses native HTML `form` attribute for proper association

## Field Grouping (Sections)

FormDown supports logical grouping of form fields using the `## [Group Label]` syntax. This generates semantic HTML `<fieldset>` and `<legend>` elements following WCAG accessibility best practices.

### Basic Group Syntax
```formdown
## [Personal Information]
@first_name*: [text]
@last_name*: [text]
@email*: [email]

## [Contact Details]
@phone: [tel]
@address: [textarea rows=2]

## [Preferences]
@newsletter: [checkbox content="Subscribe to newsletter"]
@theme: [radio options="Light,Dark,Auto"]
```

### Generated HTML Structure
```html
<fieldset class="formdown-group" data-group="formdown-group-personal-information">
  <legend>Personal Information</legend>
  <!-- Fields within this group -->
</fieldset>

<fieldset class="formdown-group" data-group="formdown-group-contact-details">
  <legend>Contact Details</legend>
  <!-- Fields within this group -->
</fieldset>
```

### Collapsible Groups
Groups can be made collapsible or start in a collapsed state:

```formdown
## [Basic Settings]
@name*: [text]
@email*: [email]

## [Advanced Settings collapsible]
@api_key: [text]
@timeout: [number min=1 max=60]

## [Developer Options collapsed]
@debug_mode: [checkbox]
@log_level: [select options="Error,Warning,Info,Debug"]
```

**Modifiers:**
- `collapsible` - Group can be collapsed/expanded by the user
- `collapsed` - Group starts in a collapsed state (implies collapsible)

**Generated HTML with collapsible:**
```html
<fieldset class="formdown-group" data-group="formdown-group-advanced-settings" data-collapsible="true">
  <legend>Advanced Settings</legend>
  <!-- Fields -->
</fieldset>

<fieldset class="formdown-group" data-group="formdown-group-developer-options" data-collapsible="true" data-collapsed="true">
  <legend>Developer Options</legend>
  <!-- Fields -->
</fieldset>
```

### Group vs Regular Headings
FormDown distinguishes between group declarations and regular Markdown headings:

```formdown
## Regular Heading
This is a regular Markdown heading that renders as <h2>.

## [Grouped Section]
@field1: [text]
@field2: [text]
This creates a fieldset group for the fields below.

## Another Regular Heading
@ungrouped_field: [text]
This field is NOT in any group (group closed by regular heading).
```

**Key differences:**
- `## [Label]` → Creates a `<fieldset>` group for form fields
- `## Label` → Standard Markdown `<h2>` heading (closes any open group)

### Accessibility Benefits
Using `<fieldset>` and `<legend>` elements provides:
- ✅ **Screen reader support**: Groups are announced with their labels
- ✅ **Semantic structure**: Clear relationship between fields and their group
- ✅ **Keyboard navigation**: Improves form navigation for assistive technologies
- ✅ **Visual organization**: Default browser styling groups related fields

### Schema Integration
Group information is included in the parsed schema:

```typescript
const parsed = parseFormdown(content)

// Access group declarations
parsed.groupDeclarations // Array of GroupDeclaration objects
// [{ id: 'formdown-group-personal-info', label: 'Personal Info', collapsible: false }]

// Fields have group reference
parsed.forms[0].group // 'formdown-group-personal-info'
```

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

FormDown supports two syntaxes for action elements (buttons):

#### New Action Syntax (Recommended) ⭐
```formdown
@[submit "Send Message"]                           // Submit button
@[reset "Clear Form"]                              // Reset button  
@[button "Calculate" onclick="calculate()"]        // Custom button
@[image "/submit.png" alt="Submit" src="/btn.png"] // Image button
```

#### Legacy Action Syntax (Still Supported)
```formdown
@submit_btn: [submit label="Submit Form"]
@reset_btn: [reset label="Clear Form"]
```

**Benefits of New Action Syntax:**
- **Semantic Clarity**: Clearly distinguishes actions (`@[action]`) from input fields (`@field: [type]`)
- **Markdown Compatibility**: Avoids confusion with Markdown link syntax `[text](url)`
- **Concise**: More intuitive and less verbose
- **Consistent**: Follows `@[action "label"]` pattern

**Action Types:**
- `submit` - Form submission button
- `reset` - Form reset button  
- `button` - Generic button for JavaScript actions
- `image` - Image-based submit button

**Advanced Examples:**
```formdown
// Button with CSS classes and data attributes
@[button "Advanced Search" class="btn-primary" data-toggle="modal"]

// Image button with dimensions
@[image "Submit Order" src="/images/submit.png" width="120" height="40"]

// Submit button with custom styling
@[submit "Complete Registration" class="btn-success btn-lg"]
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
- `value="text"` - Default value for the field
- `required` - Field is mandatory
- `placeholder="text"` - Placeholder text
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

### Contact Form (New Action Syntax) ⭐
```formdown
# Contact Us

@name(Full Name): [text required]
@email(Email Address): [email required]
@subject: [text required maxlength=100]
@message: [textarea required rows=5 placeholder="Your message..."]

@priority: [radio options="Low,Medium,High"]
@newsletter: [checkbox content="Subscribe to our weekly newsletter"]
@terms: [checkbox required content="I agree to the terms and conditions"]

@[submit "Send Message"]
@[reset "Clear Form"]
```

### Contact Form (Legacy Syntax)
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

@[submit "Create Account"]
@[reset "Clear Form"]
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

@[submit "Confirm Order"]
@[button "Calculate Total" onclick="calculateTotal()"]
```

### Advanced Form with Custom Attributes
```formdown
# User Profile

@avatar(Profile Picture): [file accept="image/*" class="file-upload"]
@username: [text required minlength=3 autocomplete="username" spellcheck="false"]
@email(Email Address): [email required autocomplete="email" class="form-control"]
@birth_date(Date of Birth): [date max="2010-12-31"]
@bio: [textarea rows=4 maxlength=500 placeholder="Tell us about yourself..."]

@theme(Theme Preference): [radio options="Light,Dark,Auto" value="Auto"]
@notifications(Notification Settings): [checkbox options="Email,SMS,Push" class="notification-options"]

@privacy_level(Privacy Level): [range min=1 max=5 step=1 value=3 style="width: 200px"]

@[submit "Save Changes" class="btn btn-primary"]
@[button "Preview Profile" class="btn btn-secondary" onclick="previewProfile()"]
```

### Default Values with Value Attribute
```formdown
# Contact Form with Defaults

@form[action="/contact" method="POST"]

// Text fields with default values
@name: [text value="John Doe" placeholder="Enter your full name"]
@email: [email value="user@example.com" required]
@phone: [tel value="+1-555-0123"]

// Number fields with defaults
@age: [number value=25 min=18 max=100]
@quantity: [number value=1 min=1 max=10]

// Date/time fields with defaults
@meeting_date: [date value="2024-12-25"]
@appointment_time: [time value="14:30"]
@deadline: [datetime-local value="2024-12-25T14:30"]

// Text area with default content
@message: [textarea value="Please enter your message here..." rows=4]

// Selection fields with defaults
@country: [select value="USA" options="USA,Canada,UK,Australia"]
@priority: [radio value="Medium" options="Low,Medium,High"]
@features: [checkbox value="Email,SMS" options="Email,SMS,Push,Phone"]

// Range with default value
@satisfaction: [range value=8 min=1 max=10]

// Single checkbox (boolean)
@newsletter: [checkbox value=true content="Subscribe to newsletter"]

@submit: [submit label="Send Message"]
```

**Default Value Behavior:**
- **Text fields**: Pre-filled with the specified value
- **Number/Date fields**: Display the default value 
- **Select**: Pre-selects the matching option
- **Radio**: Pre-selects the matching option
- **Checkbox group**: Pre-checks matching options (comma-separated values)
- **Single checkbox**: `value=true` checks the box, `value=false` unchecks it
- **Range**: Sets the initial position

## Implementation Notes

### Field Names
- Use snake_case for API compatibility: `user_name`, `email_address`
- Field names become HTML `name` attributes
- Labels can be customized using `label="Custom Text"`

### HTML Output
```formdown
@form[action="/contact" method="POST"]
@email(Email Address): [email required autocomplete="email" class="form-control"]
```

Renders to:
```html
<!-- Hidden form element -->
<form hidden id="formdown-form-1" action="/contact" method="POST"></form>

<!-- Field with form association -->
<div class="formdown-field">
    <label for="email">Email Address *</label>
    <input type="email" id="email" name="email" required autocomplete="email" class="form-control" form="formdown-form-1">
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