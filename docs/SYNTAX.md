# FormDown Syntax Reference

FormDown extends Markdown with form field syntax while maintaining **100% compatibility** with existing Markdown.

## Core Principle

FormDown fields require **both** `@` and `[...]` to be recognized, preventing conflicts with existing Markdown syntax.

```formdown
@field_name: [type attributes]              // Label: "field_name"
@field_name(Custom Label): [type attributes] // Label: "Custom Label"
```

## Conflict Prevention

| Syntax | Type | Status |
|--------|------|---------|
| `@username hello` | Text mention | ✅ Regular Markdown |
| `[link](url)` | Link | ✅ Regular Markdown |
| `![image](url)` | Image | ✅ Regular Markdown |
| `@field: [text]` | FormDown field | ✅ FormDown syntax |

## Field Types

### Text Inputs
```formdown
@name: [text required]
@email: [email required]
@password: [password minlength=8]
@phone: [tel]
@website: [url]
@age: [number min=18 max=100]
@date: [date]
@time: [time]
```

### Text Areas
```formdown
@description: [textarea rows=4 cols=50]
@comments: [textarea required placeholder="Your thoughts..."]
```

### Selection
```formdown
// Radio buttons
@gender: [radio] Male, Female, Other

// Checkboxes
@interests: [checkbox] Web, Mobile, AI, Design

// Select dropdown
@country: [select] 
- USA
- Canada  
- UK
- Other
```

### File Upload
```formdown
@avatar: [file accept="image/*"]
@documents: [file multiple accept=".pdf,.doc"]
```

### Special Types
```formdown
@color: [color]
@range: [range min=0 max=100 step=10]
@hidden_id: [hidden value="12345"]
```

### Actions
```formdown
@submit: [submit "Submit Form"]
@reset: [reset]
```

## Attributes

### Common Attributes
- `required` - Field is mandatory
- `placeholder="text"` - Placeholder text
- `value="default"` - Default value
- `disabled` - Disable field
- `readonly` - Read-only field

### Validation Attributes
- `minlength=n` - Minimum length
- `maxlength=n` - Maximum length  
- `min=n` - Minimum value (numbers/dates)
- `max=n` - Maximum value (numbers/dates)
- `step=n` - Step value for numbers
- `pattern="regex"` - Regex validation

### File Attributes
- `accept="mime-types"` - Accepted file types
- `multiple` - Allow multiple files

### Text Area Attributes
- `rows=n` - Number of rows
- `cols=n` - Number of columns

## Examples

### Basic Contact Form
```formdown
# Contact Us

@name(Full Name): [text required]
@email(Email Address): [email required]
@subject: [text required maxlength=100]
@message: [textarea required rows=5 placeholder="Your message here..."]

@priority(Priority): [radio] Low, Medium, High
@newsletter(Subscribe to newsletter): [checkbox] Yes

@submit(Send Message): [submit]
```

### API Testing Form
```formdown
# User Registration API

@username: [text required minlength=4 pattern="[a-zA-Z0-9_]+"]
@email: [email required]
@password: [password required minlength=8]
@age: [number min=13 max=120]

@terms(I agree to terms): [checkbox required] Accept

@test_api(Test API): [submit "POST /api/users"]
```

### Survey Form
```formdown
# User Feedback

@satisfaction(How satisfied are you?): [range min=1 max=10]
@recommend(Would you recommend us?): [radio] Yes, No, Maybe
@improvements: [textarea rows=3 placeholder="Suggestions for improvement..."]

@contact_email(Email for follow-up): [email]
@contact_ok(Contact me about this feedback): [checkbox] Yes

@submit_survey: [submit "Submit Feedback"]
```

## Parsing Rules

1. **Recognition Pattern**: `@identifier: [type ...]` or `@identifier(label): [type ...]`
2. **Markdown Priority**: Standard Markdown syntax takes precedence
3. **Label Resolution**: 
   - With parentheses: `@field(Custom Label)` → Label: "Custom Label"  
   - Without parentheses: `@field_name` → Label: "field_name"
4. **Safe Coexistence**: Single `@mentions` or `[links]` remain regular Markdown

## Field Name Guidelines

- Use snake_case for API compatibility: `@user_name`, `@email_address`
- Keep labels user-friendly: `@user_name(Full Name)`, `@email_address(Email)`
- Field names become HTML `name` attributes
- Labels become user-visible text

## Integration Notes

### HTML Output
```formdown
@email(Email Address): [email required]
```

Renders to:
```html
<label for="email">Email Address</label>
<input type="email" name="email" id="email" required>
```

### Data Collection
Form submission collects data using field names:
```json
{
  "email": "user@example.com",
  "user_name": "John Doe"
}
```