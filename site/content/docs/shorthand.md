# Shorthand Syntax

FormDown's shorthand syntax provides **sugar syntax** for common patterns to make form creation faster and more intuitive.

## Core Principles

1. **Full Compatibility**: All shorthand syntax is fully convertible to `[attributes]` syntax
2. **Type-based Interpretation**: `{content}` is interpreted appropriately by field type
3. **Additional Validation**: Complex validation uses standard HTML5 attributes
4. **Sugar Syntax**: Provides convenience without limiting functionality

## Shorthand Markers

### Required Marker
- `*` - Placed after field name

### Type Markers (before brackets)
- `@` = email
- `#` = number  
- `***` = password
- `http://` = url
- `tel:` = tel
- `date:` = date
- `time:` = time
- `dt` = datetime-local
- `M` = month
- `W` = week
- `$` = number (money input with currency formatting)
- `T` = textarea (+ number for rows, e.g., T5)
- `F` = file
- `C` = color
- `R` = range
- `r` = radio
- `s` = select
- `c` = checkbox

### Content Definition (`{content}`)
**Core Principle**: `{content}` is interpreted by type
- **Text-based types** → `pattern` attribute (regex validation)
- **Date/time types** → `format` attribute (format specification)
- **Selection types** → `options` attribute (choice options)

### Label Definition
- `(Label Text)` = [label="Label Text"]

### Inline Notation
- `___@fieldname` = inline field

## Type Interpretation Rules

| Type Marker | Type | `{content}` Interpretation | Attribute |
|------------|------|---------------------------|-----------|
| `@` | email | Pattern | `pattern="{content}"` |
| `#` | number | Min,Max,Step | Parsed as constraints |
| `***` | password | Pattern | `pattern="{content}"` |
| `T` | textarea | Default text | `value="{content}"` |
| `r`, `s`, `c` | radio/select/checkbox | Options | `options="{content}"` |

## Examples by Type

### Text Fields
```formdown
// Standard → Shorthand
@username: [text] → @username: []
@username: [text required] → @username*: []
@username: [text pattern="[a-z0-9]{3,20}"] → @username{[a-z0-9]{3,20}}: []
```

### Email Fields
```formdown
// Standard → Shorthand
@email: [email] → @email: @[]
@email: [email required] → @email*: @[]
@work_email: [email required] → @work_email*: @[]
```

### Number Fields
```formdown
// Standard → Shorthand
@age: [number] → @age: #[]
@age: [number required] → @age*: #[]
@age: [number min=0 max=120] → @age: #[min=0 max=120]
@price: [number step=0.01] → @price: #[step=0.01]
```

### Password Fields
```formdown
// Standard → Shorthand
@password: [password] → @password: ***[]
@password: [password required] → @password*: ***[]
@password: [password minlength=8] → @password*: ***[minlength=8]
```

### URL Fields
```formdown
// Standard → Shorthand
@website: [url] → @website: http://[]
@website: [url required] → @website*: http://[]
```

### Phone Fields
```formdown
// Standard → Shorthand  
@phone: [tel] → @phone: tel:[]
@phone: [tel required] → @phone*: tel:[]
```

### Date/Time Fields
```formdown
// Standard → Shorthand
@birthdate: [date] → @birthdate: date:[]
@appointment: [time] → @appointment: time:[]
@birthdate: [date required] → @birthdate*: date:[]
```

### Textarea
```formdown
// Standard → Shorthand
@message: [textarea] → @message: T[]
@message: [textarea rows=5] → @message: T5[]
@bio: [textarea rows=10 required] → @bio*: T10[]
```

### Selection Fields
```formdown
// Radio buttons
@plan: [radio options="Basic,Pro,Enterprise"] → @plan: r{Basic,Pro,Enterprise}[]
@plan: [radio options="Basic,Pro,Enterprise" value="Pro"] → @plan: r{Basic,Pro,Enterprise=Pro}[]

// Checkboxes
@features: [checkbox options="A,B,C"] → @features: c{A,B,C}[]
@features: [checkbox options="A,B,C" value="A,C"] → @features: c{A,B=A,C=C}[]

// Select dropdown
@country: [select options="USA,Canada,UK"] → @country: s{USA,Canada,UK}[]
```

### Options with "Other"
```formdown
// Radio with other
@browser: r{Chrome,Firefox,Safari,*}[]
@browser: r{Chrome,Firefox,Safari,*(Other Browser)}[]

// Checkbox with other
@skills: c{JavaScript,Python,Go,*}[]
@skills: c{JavaScript,Python,Go,*(Other Skills)}[]

// Select with other
@country: s{USA,Canada,UK,*}[]
@country: s{USA,Canada,UK,*(Other Country)}[]
```

## Pattern Validation Shorthand

### Using Field Name Pattern
```formdown
// Username pattern (3-20 alphanumeric + underscore)
@username{^[a-zA-Z0-9_]{3,20}$}*: []

// Employee ID pattern
@employee_id{^EMP[0-9]{6}$}: []

// Product code pattern  
@product_code{^[A-Z]{3}-[0-9]{4}$}: []
```

### Option Definition Patterns
```formdown
// Pipe separator for cleaner syntax
@priority{Low|Medium|High}: r[]
@skills{JavaScript|Python|Go|Rust}: c[]

// Comma separator (traditional)
@status{Draft,Under Review,Published}: s[]
```

## Inline Field Shorthand

```formdown
// Basic inline
My name is ___@name[] and I'm ___@age: #[] years old.

// With required
Please enter your ___@email*: @[] to continue.

// With options
I prefer ___@color: s{Red,Blue,Green}[] as my favorite color.
```

## Label Shorthand

```formdown
// Using parentheses for labels
@username(Username): []
@email(Email Address)*: @[]
@age(Your Age): #[min=0 max=120]

// Combines with all other shorthand
@password(Choose Password)*: ***[minlength=8]
```

### Money/Currency Fields
```formdown
// Standard → Shorthand
@price: [number step=0.01] → @price: $[step=0.01]
@budget: [number min=0] → @budget: $[min=0]
@donation: [number] → @donation: $[]
```

### Special Fields
```formdown
// Search field
@search: [search placeholder="Search..."]

// Hidden field
@user_id: [hidden value="12345"]

// Button fields
@save: [submit value="Save Changes"]
@clear: [reset value="Clear Form"]
@cancel: [button value="Cancel"]
```

## Complex Examples

### Contact Form
```formdown
# Contact Us

@name(Full Name)*: []
@email*: @[]
@phone(Phone Number): tel:[]
@subject: []
@message(Your Message)*: T5[]
@newsletter: c[] Subscribe to newsletter
```

### User Registration
```formdown
# Sign Up

@username{^[a-zA-Z0-9_]{3,20}$}*: []
@email*: @[]
@password*: ***[minlength=8]
@confirm_password(Confirm Password)*: ***[]
@age: #[min=13 max=120]
@country: s{USA,Canada,UK,Other}[]
@interests: c{Sports,Music,Tech,Gaming}[]
@terms*: c[] I agree to terms
```

### Survey Form
```formdown
@rating(How would you rate us?): r{1|2|3|4|5=3}[]
@improve(What should we improve?): c{UI|Features|Docs|Support|*}[]
@comments: T4[maxlength=500]
```

## Migration Examples

### From Standard to Shorthand
```formdown
// Before (Standard syntax)
@first_name: [text required placeholder="Enter first name"]
@email: [email required]
@age: [number min=18 max=100]
@bio: [textarea rows=5 maxlength=500]
@country: [select options="USA,Canada,UK,Other"]
@newsletter: [checkbox checked label="Subscribe"]

// After (Shorthand syntax)
@first_name*: [placeholder="Enter first name"]
@email*: @[]
@age: #[min=18 max=100]
@bio: T5[maxlength=500]
@country: s{USA,Canada,UK,Other}[]
@newsletter: [checked] Subscribe
```

## Best Practices

### 1. Use Shorthand for Common Patterns
```formdown
// Good - Clear and concise
@email*: @[]
@age: #[min=0 max=120]
@message*: T5[]

// Avoid mixing when standard is clearer
@complex_field: [text data-custom="value" aria-label="Complex"]
```

### 2. Pattern Validation
```formdown
// Good - Clear pattern in field name
@username{^[a-zA-Z0-9_]{3,20}$}: []
@zip_code{^[0-9]{5}$}: []

// For complex patterns, consider standard syntax
@field: [pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"]
```

### 3. Keep Options Readable
```formdown
// Good - Pipe separator for few options
@size: r{S|M|L|XL}[]

// Good - Comma for many options
@country: s{USA,Canada,Mexico,UK,France,Germany,Japan,Australia}[]
```

### 4. Smart Label Usage
```formdown
// Let FormDown generate labels from good field names
@first_name*: []           // → "First Name"
@email_address*: @[]       // → "Email Address"

// Use explicit labels for unclear field names
@usr(Username)*: []
@msg(Your Message)*: T5[]
```

## Reference Table

| Standard | Shorthand | Notes |
|----------|-----------|-------|
| `[text]` | `[]` | Default type |
| `[text required]` | `*: []` | Asterisk after field name |
| `[email]` | `@[]` | @ prefix |
| `[number]` | `#[]` | # prefix |
| `[number]` (money) | `$[]` | $ prefix (currency) |
| `[password]` | `***[]` | *** prefix |
| `[tel]` | `tel:[]` | tel: prefix |
| `[url]` | `http://[]` | http:// prefix |
| `[date]` | `date:[]` | date: prefix |
| `[time]` | `time:[]` | time: prefix |
| `[datetime-local]` | `dt[]` | dt prefix |
| `[month]` | `M[]` | M prefix |
| `[week]` | `W[]` | W prefix |
| `[file]` | `F[]` | F prefix |
| `[color]` | `C[]` | C prefix |
| `[range]` | `R[]` | R prefix |
| `[textarea rows=5]` | `T5[]` | T + number |
| `[radio options="..."]` | `r{...}[]` | r + options |
| `[checkbox options="..."]` | `c{...}[]` | c + options |
| `[select options="..."]` | `s{...}[]` | s + options |
| `[label="..."]` | `(...)` | Parentheses |
| Pattern validation | `{pattern}` | In field name |