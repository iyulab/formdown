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

All methods are equivalent and produce the same result when using custom labels.

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

## Shorthand Syntax

FormDown provides powerful shorthand syntax for even more concise form creation. This is **sugar syntax** that converts to standard FormDown syntax while maintaining full compatibility.

### Core Principles
1. **Complete compatibility**: All shorthand converts to `[attributes]` syntax
2. **Type-based interpretation**: `{content}` is interpreted based on field type
3. **Progressive complexity**: Start simple, add complexity as needed

### Required Fields with `*`
```formdown
// Shorthand
@name*: []
@email*: []

// Converts to
@name: [text required]
@email: [text required]
```

### Type Markers
Common input types can be specified with single-character markers before `[]`:

```formdown
// Shorthand
@email: @[]           // email type
@age: #[]             // number type  
@phone: %[]           // tel type
@website: &[]         // url type
@password: ?[]        // password type
@birth_date: d[]      // date type
@meeting_time: t[]    // time type
@appointment: dt[]    // datetime-local type
@description: T[]     // textarea
@notes: T4[]          // textarea with 4 rows

// Converts to
@email: [email]
@age: [number]
@phone: [tel] 
@website: [url]
@password: [password]
@birth_date: [date]
@meeting_time: [time]
@appointment: [datetime-local]
@description: [textarea]
@notes: [textarea rows=4]
```

### Combining Required + Type
```formdown
// Shorthand
@email*: @[]
@age*: #[]
@description*: T6[]

// Converts to
@email: [email required]
@age: [number required]
@description: [textarea required rows=6]
```

### Content Patterns with `{content}`
The `{content}` syntax is interpreted differently based on the field type:

**Text types** → `pattern` attribute (validation):
```formdown
// Shorthand - Pattern validation
@username{^[a-zA-Z0-9_]{3,20}$}: []
@phone{(###)###-####}: []
@email{*@company.com}: []

// Converts to
@username: [text pattern="^[a-zA-Z0-9_]{3,20}$"]
@phone: [text pattern="^\(\d{3}\)\d{3}-\d{4}$"]
@email: [text pattern="^.*@company\.com$"]
```

**Date/time types** → `format` attribute:
```formdown
// Shorthand - Format specification
@birth_date{yyyy-MM-dd}: d[]
@meeting_time{HH:mm}: t[]

// Converts to  
@birth_date: [date format="yyyy-MM-dd"]
@meeting_time: [time format="HH:mm"]
```

**Selection types** → `options` attribute:
```formdown
// Shorthand - Options list
@size{S,M,L,XL}: r[]           // radio
@country{USA,Canada,UK}: s[]   // select
@skills{JS,Python,Java}: c[]   // checkbox group

// Converts to
@size: [radio options="S,M,L,XL"]
@country: [select options="USA,Canada,UK"]
@skills: [checkbox options="JS,Python,Java"]
```

### Pattern Shortcuts
FormDown automatically converts user-friendly patterns to regex:

```formdown
// Mask patterns (# = digit, * = any)
@phone{(###)###-####}: []
@ssn{###-##-####}: []

// Glob patterns (* = wildcard)
@work_email{*@company.com}: []
@filename{*.pdf}: []

// Converts to proper regex patterns automatically
```

### Custom Labels with `()`
```formdown
// Shorthand
@first_name(Full Name)*: []
@user_email(Email Address)*: @[]
@birth_date(Date of Birth){yyyy-MM-dd}: d[]

// Converts to
@first_name: [text required label="Full Name"]
@user_email: [email required label="Email Address"] 
@birth_date: [date format="yyyy-MM-dd" label="Date of Birth"]
```

### Inline Shorthand
```formdown
// Shorthand inline
Hello @___@name*!
Your email: @___@email*
Age: #___@age* years old
Birth date: d___@birth_date{yyyy-MM-dd}

// Converts to
Hello ___@name[text required]!
Your email: ___@email[email required]
Age: ___@age[number required] years old
Birth date: ___@birth_date[date format="yyyy-MM-dd"]
```

### Complex Examples

**Registration form with shorthand:**
```formdown
# User Registration

@username(Username)*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="3-20 characters"]
@email(Email Address)*: @[]
@password(Password)*{^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$}: ?[]
@birth_date(Birth Date){yyyy-MM-dd}: d[min="1900-01-01" max="2010-12-31"]

@gender(Gender){male,female,other}: r[]
@interests(Interests){Web,Mobile,AI,Gaming,*}: c[]
@newsletter(Subscribe to newsletter): c[]

@terms(I agree to terms and conditions)*: c[]
@register: [submit label="Create Account"]
```

**Appointment booking with inline shorthand:**
```formdown
# Appointment Booking

Dear @___@customer_name*,

Please schedule your appointment:
- Service: s___@service{Consultation,Checkup,Treatment}
- Date: d___@appointment_date{yyyy-MM-dd}[min="2024-01-01"]  
- Time: t___@appointment_time{HH:mm}[min="09:00" max="17:00"]
- Phone: %___@phone{(###)###-####}

@special_requests(Special Requests): T3[placeholder="Any special requirements?"]
@book_appointment: [submit label="Book Appointment"]
```

### When to Use Shorthand vs Standard

**Use shorthand for:**
- ✅ **Simple forms** with common patterns
- ✅ **Rapid prototyping** and quick development
- ✅ **Common field types** (email, phone, dates)
- ✅ **Standard validation** patterns

**Use standard syntax for:**
- 🔧 **Complex validation** rules
- 🎨 **Custom attributes** and styling
- 🔌 **Framework integration** with dynamic values
- 📋 **Complex form logic** and conditional fields

**Mixed usage is recommended:**
```formdown
// Simple fields - use shorthand
@name*: []
@email*: @[]
@phone{(###)###-####}: []

// Complex fields - use standard syntax  
@bio: [textarea rows=4 maxlength=500 class="bio-field" data-counter="true"]
@advanced_options: [checkbox options="opt1,opt2,opt3" class="advanced" data-toggle="collapse"]
```

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

### Contact Form
```formdown
# Contact Us

@name(Full Name): [text required]
@email(Email Address): [email required]
@subject: [text required maxlength=100]
@message: [textarea required rows=5 placeholder="Your message..."]

@priority: [radio options="Low,Medium,High"]
@newsletter(Subscribe to newsletter): [checkbox]

@submit_form: [submit label="Send Message"]
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