# Shorthand Syntax

Write forms faster with Formdown's powerful shorthand syntax. Every shorthand expression converts to standard `[attributes]` syntax.

## Why Shorthand?

Compare these equivalent forms:

### Standard Syntax
```formdown
@name: [text required]
@email: [email required]
@age: [number min=18 max=100]
@phone: [tel pattern="\\(\\d{3}\\)\\d{3}-\\d{4}"]
@interests: [checkbox options="Web,Mobile,AI"]
```

### Shorthand Syntax
```formdown
@name*: []
@email*: @[]
@age: #[min=18 max=100]
@phone{(###)###-####}: %[]
@interests{Web,Mobile,AI}: c[]
```

**50% less typing, same functionality!**

## Core Shorthand Patterns

### Required Fields with `*`

| Shorthand | Standard | Description |
|-----------|----------|-------------|
| `@name*: []` | `@name: [text required]` | Required text field |
| `@email*: @[]` | `@email: [email required]` | Required email field |
| `@age*: #[]` | `@age: [number required]` | Required number field |

**Example:**
```formdown
# Registration form
@username*: []
@email*: @[]
@password*: ?[]
@age*: #[min=18]
```

### Type Markers

Quick type specification with single characters:

| Marker | Type | Full Syntax | Description |
|--------|------|-------------|-------------|
| `@[]` | Email | `[email]` | Email validation |
| `#[]` | Number | `[number]` | Numeric input |
| `%[]` | Tel | `[tel]` | Phone number |
| `&[]` | URL | `[url]` | URL validation |
| `?[]` | Password | `[password]` | Hidden input |
| `d[]` | Date | `[date]` | Date picker |
| `t[]` | Time | `[time]` | Time selector |
| `dt[]` | DateTime | `[datetime-local]` | Date and time |
| `M[]` | Month | `[month]` | Month picker |
| `W[]` | Week | `[week]` | Week picker |
| `T[]` | Textarea | `[textarea]` | Multi-line text |
| `T4[]` | Textarea | `[textarea rows=4]` | 4-row textarea |
| `r[]` | Radio | `[radio]` | Radio buttons |
| `c[]` | Checkbox | `[checkbox]` | Checkbox |
| `s[]` | Select | `[select]` | Dropdown |
| `R[]` | Range | `[range]` | Slider input |
| `F[]` | File | `[file]` | File upload |
| `C[]` | Color | `[color]` | Color picker |

**Example:**
```formdown
@email: @[]                    # Email field
@age: #[]                      # Number field
@phone: %[]                    # Phone field
@website: &[]                  # URL field
@password: ?[]                 # Password field
@birth_date: d[]               # Date field
@meeting_time: t[]             # Time field
@appointment: dt[]             # DateTime field
@birth_month: M[]              # Month picker
@work_week: W[]                # Week picker
@description: T[]              # Textarea
@bio: T4[]                     # 4-row textarea
@volume: R[]                   # Range slider
@avatar: F[]                   # File upload
@theme_color: C[]              # Color picker
```

### Content Patterns with `{}`

The `{}` syntax changes meaning based on field type:

#### Selection Fields → Options

| Shorthand | Standard | Description |
|-----------|----------|-------------|
| `{A,B,C}: r[]` | `[radio options="A,B,C"]` | Radio options |
| `{A,B,C}: c[]` | `[checkbox options="A,B,C"]` | Checkbox options |
| `{A,B,C}: s[]` | `[select options="A,B,C"]` | Select options |

**Example:**
```formdown
@size{S,M,L,XL}: r[]           # Radio buttons
@skills{JS,Python,Java}: c[]   # Checkbox group
@country{USA,Canada,UK}: s[]   # Select dropdown
```

**"Other" Option Support:**
Add `*` to allow custom user input for any predefined option that might not cover all cases:

```formdown
@size{S,M,L,XL,*}: r[]         # Radio with "Other" option
@skills{JS,Python,Java,*}: c[] # Checkbox with "Other" option  
@country{USA,Canada,UK,*}: s[] # Select with "Other" option
```

When `*` is included:
- ✅ Adds "Other (please specify)" option automatically
- ✅ Shows text input when "Other" is selected
- ✅ Creates `fieldname` and `fieldname_other` form fields
- ✅ Enables `allowOther: true` in field schema

#### Text Fields → Validation Pattern

| Shorthand | Standard | Description |
|-----------|----------|-------------|
| `{###-##-####}: []` | `[text pattern="\\d{3}-\\d{2}-\\d{4}"]` | SSN pattern |
| `{(###)###-####}: []` | `[text pattern="\\(\\d{3}\\)\\d{3}-\\d{4}"]` | Phone pattern |
| `{*@company.com}: []` | `[text pattern=".*@company\\.com$"]` | Email pattern |

**Example:**
```formdown
@ssn{###-##-####}: []
@phone{(###)###-####}: []
@work_email{*@company.com}: []
```

#### Date/Time Fields → Format

| Shorthand | Standard | Description |
|-----------|----------|-------------|
| `{yyyy-MM-dd}: d[]` | `[date format="yyyy-MM-dd"]` | Date format |
| `{HH:mm}: t[]` | `[time format="HH:mm"]` | Time format |

**Example:**
```formdown
@birth_date{yyyy-MM-dd}: d[]
@meeting_time{HH:mm}: t[]
```

## Combining Shorthand

### Required + Type
```formdown
@email*: @[]              # Required email
@age*: #[]                # Required number
@password*: ?[]           # Required password
@description*: T4[]       # Required 4-row textarea
```

### Required + Type + Pattern
```formdown
@email*{*@company.com}: @[]           # Required company email
@phone*{(###)###-####}: %[]           # Required formatted phone
@username*{^[a-zA-Z0-9_]{3,20}$}: []  # Required username pattern
```

### Custom Labels + Shorthand
```formdown
@first_name(Full Name)*: []
@user_email(Email Address)*: @[]
@birth_date(Date of Birth){yyyy-MM-dd}: d[]
@work_phone(Work Phone){(###)###-####}: %[]
```

## Pattern Shortcuts

Formdown converts user-friendly patterns to proper regex:

### Mask Patterns

| Pattern | Meaning | Regex Equivalent |
|---------|---------|-----------------|
| `#` | Single digit | `\\d` |
| `*` | Any character(s) | `.*` |
| `###` | Three digits | `\\d{3}` |
| `***` | Any three chars | `.{3}` |

**Example:**
```formdown
@phone{(###)###-####}: []      # Phone format
@ssn{###-##-####}: []          # SSN format  
@zip{#####}: []                # 5-digit ZIP
@license{***-###}: []          # License plate
```

### Glob Patterns

| Pattern | Meaning | Use Case |
|---------|---------|----------|
| `*@domain.com` | Ends with domain | Company emails |
| `user_*` | Starts with prefix | Username patterns |
| `*.pdf` | File extension | File uploads |

**Example:**
```formdown
@work_email{*@company.com}: @[]
@username{user_*}: []
@resume{*.pdf}: [file]
```

## Inline Shorthand

Use shorthand in inline fields too:

```formdown
Hello ___@name*!
Your email: ___@email*: @[]
Age: ___@age*: #[] years old
Phone: ___@phone{(###)###-####}: %[]
```

## Complete Examples

### Quick Contact Form
```formdown
# Contact Us
@name*: []
@email*: @[]
@phone{(###)###-####}: %[]
@message*: T4[]
@submit: [submit label="Send"]
```

### User Registration
```formdown
# Create Account
@username*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="3-20 characters"]
@email*: @[]
@password*{^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$}: ?[]
@birth_date{yyyy-MM-dd}: d[max="2010-12-31"]
@country{USA,Canada,UK,*}: s[]
@interests{Web,Mobile,AI,Gaming,*}: c[]
@newsletter(Subscribe): c[]
@terms*: c[label="I agree to terms"]
@register: [submit label="Create Account"]
```

### Event Booking
```formdown
# Book Appointment
Dear ___@customer_name*,

Your appointment details:
- Service: ___@service{Consultation,Checkup,Treatment}: s[]
- Date: ___@date{yyyy-MM-dd}: d[min="2024-01-01"]
- Time: ___@time{HH:mm}: t[min="09:00" max="17:00"]
- Phone: ___@phone{(###)###-####}: %[]

@special_requests: T3[placeholder="Any special requirements?"]
@book: [submit label="Book Appointment"]
```

## Shorthand Reference Tables

### Type Markers Quick Reference

| Input Type | Marker | Example |
|------------|--------|---------|
| Text | `[]` | `@name: []` |
| Email | `@[]` | `@email: @[]` |
| Password | `?[]` | `@password: ?[]` |
| Number | `#[]` | `@age: #[]` |
| Tel | `%[]` | `@phone: %[]` |
| URL | `&[]` | `@website: &[]` |
| Date | `d[]` | `@date: d[]` |
| Time | `t[]` | `@time: t[]` |
| DateTime | `dt[]` | `@datetime: dt[]` |
| Month | `M[]` | `@month: M[]` |
| Week | `W[]` | `@week: W[]` |
| Textarea | `T[]` | `@bio: T[]` |
| Textarea (rows) | `T4[]` | `@bio: T4[]` |
| Radio | `r[]` | `@size: r[]` |
| Checkbox | `c[]` | `@agree: c[]` |
| Select | `s[]` | `@country: s[]` |
| Range | `R[]` | `@volume: R[]` |
| File | `F[]` | `@upload: F[]` |
| Color | `C[]` | `@color: C[]` |

### Pattern Examples

| Use Case | Shorthand | Generated Pattern |
|----------|-----------|-------------------|
| Phone | `{(###)###-####}` | `^\\(\\d{3}\\)\\d{3}-\\d{4}$` |
| SSN | `{###-##-####}` | `^\\d{3}-\\d{2}-\\d{4}$` |
| ZIP Code | `{#####}` | `^\\d{5}$` |
| ZIP+4 | `{#####-####}` | `^\\d{5}-\\d{4}$` |
| Credit Card | `{####-####-####-####}` | `^\\d{4}-\\d{4}-\\d{4}-\\d{4}$` |
| Company Email | `{*@company.com}` | `^.*@company\\.com$` |
| Username | `{user_*}` | `^user_.*$` |

## When to Use Shorthand

### ✅ Perfect for Shorthand
- **Common field types**: email, phone, numbers
- **Simple validation**: required fields, basic patterns
- **Rapid prototyping**: quick form mockups
- **Standard forms**: contact, registration, surveys

### 🔧 Use Standard Syntax
- **Complex validation**: multi-step regex patterns
- **Custom attributes**: CSS classes, data attributes
- **Framework integration**: dynamic values
- **Advanced features**: conditional logic

### 💡 Mixed Approach (Recommended)
```formdown
# Use shorthand for simple fields
@name*: []
@email*: @[]
@phone{(###)###-####}: %[]

# Use standard for complex fields
@bio: [textarea rows=4 maxlength=500 class="bio-field" 
      placeholder="Tell us about yourself..." 
      data-counter="true"]
      
@preferences: [checkbox options="Email,SMS,Phone" 
               class="notification-prefs" 
               data-toggle="advanced-options"]
```

## Conversion Chart

Every shorthand expression has a standard equivalent:

| Shorthand Expression | Standard Equivalent |
|---------------------|-------------------|
| `@name*: []` | `@name: [text required]` |
| `@email*: @[]` | `@email: [email required]` |
| `@age: #[min=18]` | `@age: [number min=18]` |
| `@phone{(###)###-####}: %[]` | `@phone: [tel pattern="^\\(\\d{3}\\)\\d{3}-\\d{4}$"]` |
| `@size{S,M,L}: r[]` | `@size: [radio options="S,M,L"]` |
| `@bio: T4[]` | `@bio: [textarea rows=4]` |
| `@name(Full Name)*: []` | `@name: [text required label="Full Name"]` |

## Tips for Effective Shorthand

### Start Simple
```formdown
# Begin with basic shorthand
@name*: []
@email*: @[]
```

### Add Complexity Gradually
```formdown
# Add patterns and options
@phone{(###)###-####}: %[]
@interests{Web,Mobile,AI}: c[]
```

### Mix with Standard When Needed
```formdown
# Shorthand for simple fields
@name*: []
@email*: @[]

# Standard for complex requirements
@advanced_options: [checkbox options="opt1,opt2,opt3" 
                   class="advanced-section" 
                   data-toggle="collapse-panel"]
```

### Use Descriptive Field Names
```formdown
# Good - descriptive names
@work_email*: @[]
@home_phone{(###)###-####}: %[]

# Avoid - unclear names  
@email1*: @[]
@phone2{(###)###-####}: %[]
```

Shorthand syntax makes Formdown incredibly fast to write while maintaining full functionality and readability.