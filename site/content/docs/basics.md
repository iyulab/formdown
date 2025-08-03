# Basic Syntax

Learn the fundamentals of Formdown syntax to create interactive forms.

## Core Concept

Formdown uses a simple pattern: `@field_name: [type attributes]`

```formdown
@name: [text required]
@email: [email required]
@submit: [submit label="Send"]
```

**That's it!** This creates a complete form with validation.

## Field Anatomy

Every Formdown field has these parts:

| Part | Required | Description | Example |
|------|----------|-------------|---------|
| `@` | ✅ | Field marker | `@` |
| `field_name` | ✅ | Unique identifier | `name`, `email_address` |
| `(Label)` | ❌ | Custom label | `(Full Name)` |
| `:` | ✅ | Separator | `:` |
| `[type attributes]` | ✅ | Field definition | `[text required]` |

**Complete example:**
```formdown
@first_name(Full Name): [text required placeholder="Enter your name"]
```

## Smart Labels

Formdown automatically generates readable labels from field names:

| Field Name | Generated Label |
|------------|-----------------|
| `name` | "Name" |
| `first_name` | "First Name" |
| `email_address` | "Email Address" |
| `phone_number` | "Phone Number" |
| `dateOfBirth` | "Date Of Birth" |

**Example:**
```formdown
@first_name: []        # Label: "First Name"
@email_address: []     # Label: "Email Address"
@phone_number: []      # Label: "Phone Number"
```

## Custom Labels

Override automatic labels when needed:

### Method 1: Parentheses (Recommended)
```formdown
@user_name(Full Name): [text required]
@contact_email(Email Address): [email required]
@birth_date(Date of Birth): [date]
```

### Method 2: Label Attribute
```formdown
@user_name: [text required label="Full Name"]
@contact_email: [email required label="Email Address"]
@birth_date: [date label="Date of Birth"]
```

Both methods produce identical results. Use parentheses for cleaner syntax.

## Basic Field Types

### Text Input Fields

| Type | Description | Example |
|------|-------------|---------|
| `text` | General text input | `@name: [text]` |
| `email` | Email with validation | `@email: [email]` |
| `password` | Hidden text input | `@password: [password]` |
| `tel` | Phone number input | `@phone: [tel]` |
| `url` | URL with validation | `@website: [url]` |
| `number` | Numeric input | `@age: [number]` |

**Example:**
```formdown
@name: [text required]
@email: [email required]
@password: [password minlength=8]
@phone: [tel]
@website: [url]
@age: [number min=18 max=100]
```

### Date and Time Fields

| Type | Description | Example |
|------|-------------|---------|
| `date` | Date picker | `@birth_date: [date]` |
| `time` | Time selector | `@meeting_time: [time]` |
| `datetime-local` | Date and time | `@appointment: [datetime-local]` |

**Example:**
```formdown
@birth_date: [date max="2010-12-31"]
@meeting_time: [time min="09:00" max="17:00"]
@appointment: [datetime-local required]
```

### Text Area

For multi-line text input:

```formdown
@description: [textarea]
@bio: [textarea rows=4]
@comments: [textarea rows=6 placeholder="Your thoughts..."]
```

### Selection Fields

#### Radio Buttons (Single Choice)
```formdown
@size: [radio options="Small,Medium,Large"]
@priority: [radio options="Low,Medium,High"]
```

#### Checkboxes
**Single checkbox (yes/no):**
```formdown
@newsletter: [checkbox]
@terms(I agree to terms): [checkbox required]
```

**Checkbox group (multiple choice):**
```formdown
@interests: [checkbox options="Web,Mobile,AI,Design"]
@features: [checkbox options="Feature A,Feature B,Feature C"]
```

#### Select Dropdown
```formdown
@country: [select options="USA,Canada,UK,Other"]
@department: [select options="Sales,Marketing,Engineering"]
```

### Action Buttons

```formdown
@submit_form: [submit label="Send Message"]
@clear_form: [reset label="Clear Form"]
@preview: [button label="Preview"]
```

## Common Attributes

### Validation Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `required` | Field must be filled | `required` |
| `minlength` | Minimum text length | `minlength=3` |
| `maxlength` | Maximum text length | `maxlength=100` |
| `min` | Minimum number/date | `min=18` |
| `max` | Maximum number/date | `max=100` |
| `pattern` | Custom validation regex | `pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"` |

**Example:**
```formdown
@username: [text required minlength=3 maxlength=20]
@age: [number required min=18 max=120]
@phone: [tel pattern="\\(\\d{3}\\)\\d{3}-\\d{4}"]
```

### Display Attributes

| Attribute | Description | Example |
|-----------|-------------|---------|
| `placeholder` | Hint text | `placeholder="Enter your name"` |
| `value` | Default value | `value="John Doe"` |
| `disabled` | Disable field | `disabled` |
| `readonly` | Read-only field | `readonly` |

**Example:**
```formdown
@name: [text placeholder="Enter your full name"]
@country: [text value="United States"]
@user_id: [text readonly value="12345"]
```

### HTML Attributes

All HTML attributes are supported:

```formdown
@email: [email required autocomplete="email" spellcheck="false"]
@password: [password class="form-control" data-strength="true"]
@bio: [textarea rows=4 style="border: 2px solid #ccc"]
```

## Minimal Syntax

For quick prototyping, use minimal syntax:

### Empty Brackets
```formdown
@name: []        # Defaults to text input
@email: []       # Defaults to text input
@age: []         # Defaults to text input
```

### Simple Form
```formdown
# Contact Form
@name: []
@email: []
@message: [textarea]
@submit: [submit]
```

This creates a working contact form with smart labels and basic validation.

## Required Fields

Mark fields as required using the `required` attribute:

```formdown
@name: [text required]
@email: [email required]
@age: [number required min=18]
@terms: [checkbox required]
```

**Required fields show with asterisk (*) in labels.**

## Complete Examples

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
@confirm_password(Confirm Password): [password required]
@birth_date(Date of Birth): [date required max="2010-12-31"]
@gender: [radio options="Male,Female,Other"]
@interests: [checkbox options="Technology,Sports,Music,Travel"]
@terms(I agree to the terms and conditions): [checkbox required]

@register: [submit label="Create Account"]
@reset: [reset label="Clear Form"]
```

### Survey Form
```formdown
# Customer Satisfaction Survey

@customer_name(Your Name): [text required]
@email: [email required]
@service_date(Service Date): [date required]
@rating(Overall Rating): [radio options="1 - Poor,2 - Fair,3 - Good,4 - Very Good,5 - Excellent"]
@satisfaction: [select options="Very Dissatisfied,Dissatisfied,Neutral,Satisfied,Very Satisfied"]
@improvements: [checkbox options="Faster Service,Better Communication,Lower Prices,More Options"]
@comments: [textarea rows=4 placeholder="Additional comments..."]
@recommend(Would you recommend us?): [radio options="Yes,No,Maybe"]

@submit_survey: [submit label="Submit Survey"]
```

## Next Steps

1. **[Shorthand Syntax](./shorthand)** - Learn faster form creation
2. **[Field Reference](./reference)** - Complete field type reference
3. **[Validation](./validation)** - Advanced validation rules
4. **[Examples](./examples)** - More real-world examples

## Tips

### Field Naming
- Use descriptive names: `email_address` not `email`
- Use snake_case for consistency: `first_name` not `firstname`
- Avoid starting with numbers: `user_1` not `1st_user`

### Organization
- Group related fields together
- Use headers (`#`, `##`) to organize sections
- Add descriptive text between field groups

### Validation
- Always mark required fields
- Use appropriate input types (`email`, `tel`, `number`)
- Add reasonable constraints (`min`, `max`, `maxlength`)

### Labels
- Let smart generation handle simple cases
- Use custom labels for clarity when needed
- Keep labels concise but descriptive