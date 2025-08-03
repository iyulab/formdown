# Syntax Reference

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

## Smart Label Generation

FormDown automatically generates human-readable labels from field names when no custom label is provided.

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
@email: [email label="Email Address"]            // Custom label via attribute
@phone_number: [tel]                             // Auto-generated: "Phone Number"
```

## Field Types

### Text Input Types

#### Basic Text Input
```formdown
@username: []                    // Type defaults to 'text'
@username: [text]               // Explicit type
@username: [text required]      // Required field
@username: [placeholder="Enter username"]
```

#### Email Input  
```formdown
@email: [email]
@email: [email required]
@contact_email: [email placeholder="your@email.com"]
```

#### Password Input
```formdown
@password: [password]
@password: [password required minlength=8]
@confirm_password: [password placeholder="Re-enter password"]
```

#### Number Input
```formdown
@age: [number]
@age: [number min=18 max=120]
@quantity: [number min=1 max=10 step=1]
@price: [number step=0.01 placeholder="0.00"]
```

#### Date/Time Inputs
```formdown
@birth_date: [date]
@appointment_time: [time]
@event_datetime: [datetime-local]
@birth_month: [month]
@week_number: [week]
```

#### Other Input Types
```formdown
@website: [url]
@phone: [tel]
@color_choice: [color]
@skill_level: [range min=0 max=100]
@profile_pic: [file accept="image/*"]
@documents: [file multiple accept=".pdf,.doc,.docx"]
@search_query: [search]
@user_id: [hidden value="12345"]
```

### Textarea
```formdown
@message: [textarea]
@message: [textarea rows=5]
@message: [textarea rows=5 cols=40]
@bio: [textarea placeholder="Tell us about yourself..." maxlength=500]
```

### Selection Fields

#### Radio Buttons
```formdown
@gender: [radio options="Male, Female, Other"]
@plan: [radio options="Basic, Pro, Enterprise" value="Pro"]
@preferred_contact: [radio options="Email, Phone, SMS" required]
```

#### Checkboxes
```formdown
@subscribe: [checkbox]
@subscribe: [checkbox checked]
@subscribe: [checkbox label="Subscribe to newsletter"]
@terms: [checkbox required label="I agree to terms"]

// Multiple checkboxes
@interests: [checkbox options="Sports, Music, Travel, Technology"]
@features: [checkbox options="Feature A, Feature B, Feature C" value="Feature A, Feature C"]
```

#### Select Dropdown
```formdown
@country: [select options="USA, Canada, UK, Other"]
@country: [select options="USA, Canada, UK, Other" value="USA"]
@language: [select options="English, Spanish, French" required]
@countries: [select options="USA, Canada, UK" multiple]
```

### Buttons
```formdown
@submit: [submit]
@submit: [submit value="Send Message"]
@reset: [reset]
@reset: [reset value="Clear Form"]
@cancel: [button value="Cancel"]
@preview: [button value="Preview"]
```

## Inline Fields

Inline fields appear within text flow using triple underscores:

```formdown
My name is ___@name[text required placeholder="your name"] and 
I'm ___@age[number min=1 max=120] years old.

I prefer ___@color[select options="Red, Blue, Green"] as my favorite color.
```

## Advanced Features

### Pattern Validation
```formdown
// Using field name pattern
@username{^[a-zA-Z0-9_]{3,20}$}: []
@employee_id{^EMP[0-9]{6}$}: [placeholder="EMP000000"]

// Using pattern attribute
@product_code: [pattern="^[A-Z]{3}-[0-9]{4}$" placeholder="ABC-1234"]
```

### Option Patterns
```formdown
// Inline options with custom syntax
@priority{Low|Medium|High}: [radio]
@skills{JavaScript|Python|Go|Rust}: [checkbox]

// Options with commas
@status{Draft,Under Review,Published,Archived}: [select]
```

### Other Options
```formdown
// Radio with other option
@browser: [radio options="Chrome, Firefox, Safari, *"]
@browser{Chrome|Firefox|Safari|*}: r[]

// Checkbox with other option
@languages: [checkbox options="English, Spanish, French, *"]
@languages{English|Spanish|French|*(Other Languages)}: c[]

// Select with other option
@country: [select options="USA, Canada, UK, *"]
@country{USA|Canada|UK|*(Other Country)}: s[]
```

## Shorthand Syntax

FormDown supports abbreviated syntax for faster form creation:

### Field Type Shortcuts
```formdown
@email: @[]                    // Email field
@age: #[]                      // Number field
@password: ***[]               // Password field
@website: http://[]            // URL field
@phone: tel:[]                 // Tel field
@birthdate: date:[]            // Date field
@bio: T[]                      // Textarea (default)
@bio: T5[]                     // Textarea with 5 rows
@agree: []                     // Checkbox (single)
@plan: ()                      // Radio (with options)
@country: v[]                  // Select dropdown
```

### Required Fields
```formdown
@username*: []                 // Required field (asterisk after name)
@email*: @[]                   // Required email
@age*: #[min=18]              // Required number with validation
```

### Option Shortcuts
```formdown
// Radio shorthand
@size: (S,M,L,XL)             // Radio buttons
@size: (S,M,L,XL=L)           // With default value

// Checkbox shorthand  
@features: [x,y,z]            // Multiple checkboxes
@features: [x,y=y,z=z]        // With default checked

// Select shorthand
@country: v[USA,Canada,UK]    // Select dropdown
@country: v[USA,Canada=Canada,UK]  // With default
```

## Validation Attributes

### Common Validation
```formdown
@field: [required]                    // Required field
@field: [disabled]                    // Disabled field
@field: [readonly]                    // Read-only field
```

### Text Validation
```formdown
@username: [minlength=3 maxlength=20]
@bio: [textarea maxlength=500]
@code: [pattern="[A-Z]{3}[0-9]{3}"]
```

### Number Validation
```formdown
@age: [number min=0 max=120]
@price: [number min=0.01 step=0.01]
@quantity: [number min=1 max=100 step=1]
```

### File Validation
```formdown
@photo: [file accept="image/*"]
@document: [file accept=".pdf,.doc,.docx"]
@photos: [file multiple accept="image/*" max=5]
```

## Real-World Examples

### Contact Form
```formdown
# Contact Us

@form[action="/contact" method="POST"]

@name*: [placeholder="Your full name"]
@email*: @[placeholder="your@email.com"]
@subject: [placeholder="Message subject"]
@message*: T5[placeholder="Your message here..."]
@newsletter: [] Subscribe to our newsletter
@submit: [submit value="Send Message"]
```

### User Registration
```formdown
# Create Account

@form[action="/register" method="POST"]

## Account Information
@username*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="Choose username"]
@email*: @[]
@password*: ***[minlength=8]
@confirm_password*: ***[placeholder="Confirm password"]

## Profile Details  
@full_name*: []
@birth_date: date:[max="2006-01-01"]
@gender: (Male,Female,Other,Prefer not to say)
@bio: T4[maxlength=500 placeholder="Tell us about yourself"]

## Preferences
@interests: [Sports,Music,Travel,Technology,Gaming,Reading]
@newsletter: [checked] Receive weekly newsletter
@terms*: [] I agree to the [terms of service](/terms)

@submit: [submit value="Create Account"]
```

### Survey Form
```formdown
# Customer Satisfaction Survey

@form[action="/survey" method="POST"]

@satisfaction: (Very Unsatisfied,Unsatisfied,Neutral,Satisfied,Very Satisfied=Neutral)
How satisfied are you with our service?

@recommend: [range min=0 max=10 value=5]
How likely are you to recommend us? (0-10)

@improvements: [UI/UX,Performance,Features,Support,Documentation,*]
What areas need improvement?

@comments: T5[placeholder="Additional comments..."]

@email: @[placeholder="Email (optional)"]
@submit: [submit value="Submit Survey"]
```

## Best Practices

### 1. Use Smart Labels
Let FormDown generate labels from well-named fields:
```formdown
// Good
@first_name: []              // Generates "First Name"
@email_address: @[]          // Generates "Email Address"

// Avoid
@fname: []                   // Generates "Fname" (unclear)
@em: @[]                     // Generates "Em" (unclear)
```

### 2. Group Related Fields
Use Markdown headers to organize forms:
```formdown
## Personal Information
@first_name*: []
@last_name*: []
@email*: @[]

## Address
@street_address: []
@city: []
@postal_code: []
```

### 3. Provide Clear Placeholders
Help users understand expected input:
```formdown
@phone: tel:[placeholder="(555) 123-4567"]
@date: date:[placeholder="MM/DD/YYYY"]
@username: [placeholder="Letters, numbers, underscore only"]
```

### 4. Use Appropriate Input Types
Choose the right input type for better UX:
```formdown
@email: @[]                  // Email keyboard on mobile
@phone: tel:[]               // Number pad on mobile
@website: http://[]          // URL keyboard on mobile
@age: #[min=0 max=120]      // Number spinner
```

### 5. Add Helpful Validation
Validate on the client side when possible:
```formdown
@password: ***[minlength=8 pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"]
@username{^[a-zA-Z0-9_]{3,20}$}: [required]
@age: #[min=13 max=120 required]
```