# Field Reference

Complete reference for all Formdown field types, attributes, and patterns.

## Field Types

### Text Input Fields

| Type | Syntax | Shorthand | HTML Type | Description |
|------|--------|-----------|-----------|-------------|
| **Text** | `[text]` | `[]` | `text` | General text input |
| **Email** | `[email]` | `@[]` | `email` | Email validation |
| **Password** | `[password]` | `***[]` | `password` | Hidden text input |
| **URL** | `[url]` | `http://[]` | `url` | URL validation |
| **Tel** | `[tel]` | `tel:[]` | `tel` | Phone number input |
| **Search** | `[search]` | | `search` | Search input with clear |
| **Number** | `[number]` | `#[]` | `number` | Numeric input with validation |
| **Range** | `[range]` | `R[]` | `range` | Slider input with min/max |
| **Hidden** | `[hidden]` | | `hidden` | Hidden form data |

**Example:**
```formdown
@name: [text required]              # Standard text
@email: [email required]            # Email with validation
@email: @[]                         # Shorthand email
@password: [password minlength=8]   # Password field
@phone: tel:[]                      # Shorthand phone
@age: #[min=18 max=100]            # Number with constraints
```

### Date and Time Fields

| Type | Syntax | Shorthand | HTML Type | Description |
|------|--------|-----------|-----------|-------------|
| **Date** | `[date]` | `date:[]` | `date` | Date picker |
| **Time** | `[time]` | `time:[]` | `time` | Time selector |
| **DateTime** | `[datetime-local]` | `dt[]` | `datetime-local` | Date and time picker |
| **Month** | `[month]` | `M[]` | `month` | Month picker |
| **Week** | `[week]` | `W[]` | `week` | Week picker |

**Example:**
```formdown
@birth_date: [date max="2010-12-31"]
@birth_date: date:[]                 # Shorthand
@meeting_time: time:[]               # Time only
@appointment: dt[]                   # Date and time
@birth_month: [month]               # Month picker
```

### Text Area

| Type | Syntax | Shorthand | Description |
|------|--------|-----------|-------------|
| **Textarea** | `[textarea]` | `T[]` | Multi-line text input |
| **Textarea (rows)** | `[textarea rows=4]` | `T4[]` | With specified height |

**Example:**
```formdown
@description: [textarea rows=4]
@description: T4[]                  # Shorthand with 4 rows
@bio: T[]                          # Default textarea
```

### Selection Fields

| Type | Syntax | Shorthand | Description |
|------|--------|-----------|-------------|
| **Radio** | `[radio options="A,B,C"]` | `{A,B,C}: r[]` | Single selection |
| **Checkbox** | `[checkbox]` | `c[]` | Single yes/no checkbox |
| **Checkbox Group** | `[checkbox options="A,B,C"]` | `{A,B,C}: c[]` | Multiple selection |
| **Select** | `[select options="A,B,C"]` | `{A,B,C}: s[]` | Dropdown selection |

**Example:**
```formdown
# Radio buttons (single choice)
@size: [radio options="S,M,L,XL"]
@size{S,M,L,XL}: r[]               # Shorthand

# Single checkbox
@newsletter: [checkbox]
@newsletter: c[]                   # Shorthand

# Checkbox group (multiple choice)
@interests: [checkbox options="Web,Mobile,AI"]
@interests{Web,Mobile,AI}: c[]     # Shorthand

# Select dropdown
@country: [select options="USA,Canada,UK"]
@country{USA,Canada,UK}: s[]       # Shorthand
```

### Special Input Types

| Type | Syntax | Shorthand | Description |
|------|--------|-----------|-------------|
| **File** | `[file]` | `F[]` | File upload |
| **Color** | `[color]` | `C[]` | Color picker |
| **Range** | `[range min=0 max=100]` | `R[]` | Slider input |
| **Hidden** | `[hidden]` | | Hidden form data |
| **Button** | `[button]` | | Generic button |
| **Submit** | `[submit]` | | Submit button |
| **Reset** | `[reset]` | | Reset button |

**Example:**
```formdown
@avatar: [file accept="image/*"]
@avatar: F[]                          # Shorthand
@volume: [range min=0 max=100 step=5]
@volume: R[min=0 max=100 step=5]      # Shorthand
@theme_color: [color value="#3366cc"]
@theme_color: C[]                     # Shorthand
@birth_month: [month]
@birth_month: M[]                     # Shorthand
@week_picker: [week]
@week_picker: W[]                     # Shorthand
```

### Action Fields

| Type | Syntax | Description |
|------|--------|-------------|
| **Submit** | `[submit]` | Form submission button |
| **Reset** | `[reset]` | Form reset button |
| **Button** | `[button]` | Generic button |

**Example:**
```formdown
@submit_form: [submit label="Send Message"]
@clear_form: [reset label="Clear All"]
@preview: [button label="Preview Form"]
```

## Universal Attributes

All field types support these attributes:

| Attribute | Type | Description | Example |
|-----------|------|-------------|---------|
| `label` | String | Custom field label | `label="Full Name"` |
| `required` | Boolean | Field is mandatory | `required` |
| `placeholder` | String | Placeholder text | `placeholder="Enter your name"` |
| `value` | String | Default value | `value="John Doe"` |
| `disabled` | Boolean | Disable field | `disabled` |
| `readonly` | Boolean | Read-only field | `readonly` |
| `class` | String | CSS classes | `class="form-control"` |
| `style` | String | Inline CSS | `style="border: 2px solid blue"` |
| `id` | String | Element ID | `id="custom-field"` |

## Validation Attributes

| Attribute | Applies To | Description | Example |
|-----------|------------|-------------|---------|
| `required` | All | Field must be filled | `required` |
| `minlength` | Text, Textarea | Minimum character length | `minlength=3` |
| `maxlength` | Text, Textarea | Maximum character length | `maxlength=100` |
| `min` | Number, Date, Range | Minimum value | `min=18` |
| `max` | Number, Date, Range | Maximum value | `max=100` |
| `step` | Number, Range | Value increment | `step=0.5` |
| `pattern` | Text types | Regex validation | `pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"` |

**Example:**
```formdown
@username: [text required minlength=3 maxlength=20]
@age: [number required min=18 max=120]
@phone: [tel pattern="\\(\\d{3}\\)\\d{3}-\\d{4}"]
@rating: [range min=1 max=5 step=1]
```

## Selection Field Options

### Options Attribute

For radio, checkbox groups, and select fields:

```formdown
# Basic options
@size: [radio options="Small,Medium,Large"]

# Options with values
@country: [select options="us:United States,ca:Canada,uk:United Kingdom"]

# Shorthand syntax
@size{Small,Medium,Large}: r[]
@country{us:United States,ca:Canada,uk:United Kingdom}: s[]
```

### Layout Options

For radio and checkbox groups:

| Layout | Description | Example |
|--------|-------------|---------|
| `layout="inline"` | Horizontal layout (default) | `[radio options="A,B,C" layout="inline"]` |
| `layout="vertical"` | Vertical layout | `[radio options="A,B,C" layout="vertical"]` |

## Custom Labels

### Three Ways to Define Labels

| Method | Syntax | Example |
|--------|--------|---------|
| **Parentheses** | `@field(Label):` | `@user_name(Full Name): []` |
| **Label Attribute** | `label="Label"` | `@user_name: [text label="Full Name"]` |
| **Smart Generation** | Auto from field name | `@user_name: []` → "User Name" |

### Label Generation Rules

| Field Name | Generated Label |
|------------|-----------------|
| `first_name` | "First Name" |
| `email_address` | "Email Address" |
| `phoneNumber` | "Phone Number" |
| `user_id` | "User ID" |
| `name` | "Name" |

## Required Fields

### Syntax Options

| Method | Syntax | Result |
|--------|--------|--------|
| **Shorthand** | `@name*: []` | Required text field |
| **Attribute** | `@name: [text required]` | Required text field |
| **Combined** | `@name*: @[]` | Required email field |

**Example:**
```formdown
# These are equivalent
@email*: @[]
@email: [email required]

# Combined with custom labels
@user_email(Email Address)*: @[]
@user_email: [email required label="Email Address"]
```

## Shorthand Reference

### Type Markers

| Marker | Type | Full Syntax |
|--------|------|-------------|
| `@[]` | Email | `[email]` |
| `#[]` | Number | `[number]` |
| `%[]` | Tel | `[tel]` |
| `&[]` | URL | `[url]` |
| `?[]` | Password | `[password]` |
| `d[]` | Date | `[date]` |
| `t[]` | Time | `[time]` |
| `dt[]` | DateTime | `[datetime-local]` |
| `M[]` | Month | `[month]` |
| `W[]` | Week | `[week]` |
| `T[]` | Textarea | `[textarea]` |
| `T4[]` | Textarea (4 rows) | `[textarea rows=4]` |
| `r[]` | Radio | `[radio]` |
| `c[]` | Checkbox | `[checkbox]` |
| `s[]` | Select | `[select]` |
| `R[]` | Range | `[range]` |
| `F[]` | File | `[file]` |
| `C[]` | Color | `[color]` |

### Content Patterns

| Pattern | Context | Meaning | Example |
|---------|---------|---------|---------|
| `{options}` | Selection | Options list | `{A,B,C}: r[]` |
| `{pattern}` | Text | Validation pattern | `{###-##-####}: []` |
| `{format}` | Date/Time | Format specification | `{yyyy-MM-dd}: d[]` |

### Complex Examples

```formdown
# Registration form with shorthand
@username*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="3-20 characters"]
@email*: @[]
@password*{^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).{8,}$}: ?[]
@age: #[min=18 max=100]
@gender{male,female,other}: r[]
@interests{Web,Mobile,AI,Gaming}: c[]
@newsletter(Subscribe to updates): c[]
@submit: [submit label="Create Account"]
```

## HTML Output

### Generated Structure

```formdown
@email(Email Address): [email required class="form-control"]
```

**Renders to:**
```html
<div class="formdown-field">
    <label for="email">Email Address *</label>
    <input type="email" 
           id="email" 
           name="email" 
           required 
           class="form-control">
</div>
```

### CSS Classes

| Element | Default Class | Description |
|---------|---------------|-------------|
| Field wrapper | `formdown-field` | Container for label and input |
| Required fields | `required` | Added to required field containers |
| Error state | `field-error` | Added during validation errors |
| Error messages | `validation-error-message` | Error message styling |

## Data Collection

Form data is collected using field names as keys:

```formdown
@first_name: []
@email_address: @[]
@age: #[]
@interests{Web,Mobile}: c[]
```

**Collected data:**
```json
{
  "first_name": "John",
  "email_address": "john@example.com",
  "age": 25,
  "interests": ["Web", "Mobile"]
}
```

## Best Practices

### Field Naming
- Use `snake_case` for consistency: `first_name`, `email_address`
- Avoid starting with numbers: `user_1` not `1st_user`
- Be descriptive: `phone_number` not `phone`

### Label Strategy
- Use parentheses for simple custom labels: `@field(Label):`
- Use `label=` attribute for complex labels with quotes
- Let smart generation handle simple cases: `@first_name: []`

### Validation
- Always mark required fields: `@field*:` or `required`
- Use appropriate input types: `@[]` for email, `#[]` for numbers
- Add constraints: `min`, `max`, `pattern` as needed

### Shorthand Usage
- Use shorthand for common patterns: `@email*: @[]`
- Mix shorthand and full syntax as needed
- Prioritize readability over brevity