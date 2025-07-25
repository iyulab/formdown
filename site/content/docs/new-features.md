# Latest Features

Formdown continues to evolve with powerful new features that make form creation even more intuitive and flexible.

## 📋 Field Helper API (Latest)

**Major Release:** Introducing the **FormdownFieldHelper** API - a predictable and rational interface for programmatic form interaction with automatic "other" option handling.

### What's New

The Field Helper API provides:

- **Predictable Interface**: Consistent method signatures across all field types
- **Automatic Other Options**: Smart detection and handling of custom options
- **Type-Specific Behavior**: Optimized for single-value (radio, select) and multi-value (checkbox) fields
- **Clean Data Structure**: No `_other` field suffixes in form data
- **Real-time Updates**: Automatic DOM event dispatching
- **Error Handling**: Safe operations with clear success/failure indicators

### Quick Example

```javascript
import { FormdownFieldHelper } from '@formdown/core';

// Form with other options
// @priority{Low,Medium,High,*(Priority Level)}: r[]
// @skills{JavaScript,Python,Java,*(Other Skills)}: c[]

// Set values (automatically uses other options when needed)
FormdownFieldHelper.set('priority', 'Critical');    // → Uses "Priority Level" other option
FormdownFieldHelper.add('skills', 'Rust');          // → Uses "Other Skills" other option

// Get clean data
console.log(FormdownFieldHelper.get('priority'));   // → "Critical"
console.log(FormdownFieldHelper.get('skills'));     // → ["Rust"] (or existing + new)

// Field information
console.log(FormdownFieldHelper.getFieldType('priority')); // → 'radio'
console.log(FormdownFieldHelper.isOtherValue('priority', 'Critical')); // → true
```

### Key Benefits

1. **Automatic Other Detection**: Values not in predefined options automatically use other option
2. **Clean Data**: Form data structure remains simple: `{priority: "Critical"}` instead of `{priority: "_other", priority_other: "Critical"}`
3. **Type Safety**: Full TypeScript support with proper typing
4. **Consistent API**: Same methods work across radio, checkbox, select, and text fields

[**Learn More →**](/docs/field-helper)

---

## 🔌 Extension System

**Major Release:** Formdown now features a complete plugin architecture that allows developers to customize and extend every aspect of form parsing, generation, and validation.

### What's New

The extension system provides:

- **Hook-based Architecture**: 14 different hook types for maximum customization
- **Plugin System**: Complete plugin lifecycle management with error handling
- **Type Safety**: Full TypeScript support with compile-time validation
- **Event System**: Plugin communication through events
- **Field Type Plugins**: Create entirely new field types
- **Theme Integration**: Complete styling and layout customization
- **Validation Extensions**: Custom validation rules and logic

### Quick Example

```typescript
import { ExtensionManager } from '@formdown/core'

const extensionManager = new ExtensionManager()

// Register a Bootstrap theme plugin
extensionManager.registerPlugin({
  metadata: {
    name: 'bootstrap-theme',
    version: '1.0.0'
  },
  hooks: [{
    name: 'css-class',
    handler: (context) => {
      context.field.attributes.className = 'form-control'
      return context
    }
  }]
})

// Use with existing functions
const ast = await parseForm(source, { extensionManager })
const html = await generateHTML(ast, { extensionManager })
```

### Real-World Plugin Examples

**Credit Card Field Type:**
```typescript
const creditCardPlugin = {
  fieldTypes: [{
    type: 'credit-card',
    parser: (content) => ({
      name: 'cardNumber',
      type: 'credit-card',
      attributes: {
        pattern: '[0-9\\s]{13,19}',
        inputmode: 'numeric'
      }
    }),
    validator: (field, value) => isValidCreditCard(value),
    generator: (field) => `
      <input type="text" 
             pattern="${field.attributes.pattern}"
             inputmode="numeric" />
    `
  }]
}
```

**Internationalization Plugin:**
```typescript
const i18nPlugin = {
  hooks: [{
    name: 'post-parse',
    handler: (context) => {
      const locale = getCurrentLocale()
      context.parseResult.fields.forEach(field => {
        field.label = translate(field.label, locale)
      })
      return context
    }
  }]
}
```

### Built-in Features

- **Error Handling**: Robust error isolation and recovery
- **Performance Management**: Timeout controls and profiling
- **Testing Utilities**: Comprehensive testing framework for plugins
- **Documentation**: Complete API reference and examples

### Migration Path

Existing code continues to work unchanged. Extensions are completely optional:

```javascript
// Existing code (still works)
const html = generateHTML(ast)

// With extensions (new capability)  
const html = generateHTML(ast, { extensionManager })
```

[→ Learn more about the Extension System](./extensions.md)

---

## Smart Field Ordering

**Problem Solved:** Previously, all form fields were grouped together, breaking the natural flow of markdown content.

**Now:** Fields maintain their exact position in the markdown document, preserving content structure and flow.

### Before vs After

**Before (Old Behavior):**
```formdown
# Registration

## Personal Details
@name: [text required]
@email: [email required]

We value your privacy.

## Account Settings  
@username: [text required]
@password: [password required]
```

Would render as:
```html
<h1>Registration</h1>
<h2>Personal Details</h2>

<!-- ALL FIELDS GROUPED HERE -->
<form>
  <input name="name">
  <input name="email"> 
  <input name="username">
  <input name="password">
</form>

<p>We value your privacy.</p>
<h2>Account Settings</h2>
<!-- No fields here! -->
```

**After (New Behavior):**
```html
<h1>Registration</h1>
<h2>Personal Details</h2>

<form>
  <input name="name">
  <input name="email">
</form>

<p>We value your privacy.</p>

<h2>Account Settings</h2>

<form>
  <input name="username">
  <input name="password">
</form>
```

### Benefits

- ✅ **Natural Flow**: Content and fields stay exactly where you place them
- ✅ **Multi-Section Forms**: Create complex forms with explanatory text between sections
- ✅ **Better UX**: Users see relevant context for each field group
- ✅ **Markdown Integrity**: Your markdown structure is preserved perfectly

### Examples

**Tutorial-Style Form:**
```formdown
# Getting Started Guide

Let's start with your basic information:

@name: [text required]
@email: [email required]

Great! Now let's set up your preferences.

@theme{Light,Dark,Auto}: r[]
@notifications: [checkbox label="Enable notifications"]

Almost done! Choose your plan:

@plan{Free,Pro,Enterprise}: r[required]

Thank you for signing up!
```

**Survey with Sections:**
```formdown
# Customer Satisfaction Survey

## About Your Experience

How would you rate our service?

@rating{1,2,3,4,5}: r[required]

What did you like most?

@liked: [textarea rows=3]

## Suggestions for Improvement

Any areas we could improve?

@improvements: [textarea rows=3]

Would you recommend us to others?

@recommend{Yes,No,Maybe}: r[required]

Thank you for your feedback!
```

## Custom "Other" Options

**Problem Solved:** Generic "Other:" labels didn't match specific contexts, and data structure was complex.

**Now:** Customize "other" option labels and get clean, direct data output.

### Custom Labels with `*(Label)`

Instead of generic "Other:", use contextual labels:

```formdown
@source{Website,Social Media,Friend,*(Please specify)}: r[]
@interests{Tech,Sports,Music,*(Custom Interest)}: c[]
@experience{Beginner,Intermediate,Advanced,*(Experience Level)}: r[]
@country{USA,Canada,UK,*(Other Country)}: s[]
```

**Renders as:**
- "Please specify:" instead of "Other:"
- "Custom Interest:" for checkboxes
- "Experience Level:" for radio buttons
- "Other Country (please specify)" for select dropdowns

### Simplified Data Structure

**Before (Complex):**
```json
{
  "priority": "_other",
  "priority_other": "Urgent"
}
```

**After (Clean):**
```json
{
  "priority": "Urgent"
}
```

When users select the "other" option and enter text, that text becomes the field value directly.

### Complete Examples

**Event Registration:**
```formdown
# Event Registration

@role{Attendee,Speaker,Sponsor,*(Custom Role)}: r[required]
@dietary{None,Vegetarian,Vegan,Gluten-Free,*(Special Requirement)}: c[]
@transportation{Car,Train,Flight,*(Travel Method)}: r[]
```

**Results in clean data:**
```json
{
  "role": "Volunteer",           // User typed "Volunteer"
  "dietary": ["Keto"],          // User checked "Special Requirement" and typed "Keto"  
  "transportation": "Bicycle"    // User selected "Travel Method" and typed "Bicycle"
}
```

**Job Application:**
```formdown
# Job Application

@position{Developer,Designer,Manager,*(Desired Position)}: r[required]
@experience{0-1,2-5,5-10,10+,*(Years Experience)}: r[]
@skills{JavaScript,Python,Design,Marketing,*(Additional Skill)}: c[]
```

## Enhanced Field Types

### All Field Types Support Custom Others

Every selection field type supports custom "other" options:

```formdown
# Radio Buttons
@priority{Low,Medium,High,*(Priority Level)}: r[]

# Checkboxes  
@interests{Web,Mobile,AI,*(Custom Topic)}: c[]

# Select Dropdowns
@country{USA,Canada,UK,*(Other Country)}: s[]
```

### Standard Syntax Support

Custom "other" labels work in both shorthand and standard syntax:

```formdown
# Shorthand syntax
@category{Web,Mobile,*(Custom Category)}: r[]

# Standard syntax  
@category: [radio options="Web,Mobile,*(Custom Category)"]
```

## Migration Guide

### Updating Existing Forms

**Simple Migration:**
1. **Field Ordering**: No changes needed - your forms will automatically respect field positions
2. **Other Options**: Replace `*` with `*(Custom Label)` where you want custom labels

**Before:**
```formdown
@source{Website,Friend,*}: r[]
```

**After:**
```formdown
@source{Website,Friend,*(Please specify)}: r[]
```

### Data Handling Updates

If your application expects the old `_other` data format, you may need to update your form processing:

**Old Format:**
```javascript
// Handle old format
if (formData.priority === "_other") {
  const actualValue = formData.priority_other;
  // Process actualValue
}
```

**New Format:**
```javascript
// Much simpler!
const actualValue = formData.priority;
// Process actualValue directly
```

### Backward Compatibility

- ✅ Existing forms without custom labels work unchanged
- ✅ Plain `*` still creates "Other:" labels
- ✅ All existing field types and validation continue to work
- ✅ Standard syntax remains fully supported

## Best Practices

### Choose Meaningful Labels

**Good:**
```formdown
@contact_method{Email,Phone,SMS,*(Preferred Method)}: r[]
@experience{Beginner,Intermediate,Advanced,*(Experience Level)}: r[]  
@department{Sales,Engineering,Marketing,*(Your Department)}: s[]
```

**Avoid:**
```formdown
@contact_method{Email,Phone,SMS,*(Other)}: r[]        # Not specific enough
@experience{Beginner,Intermediate,Advanced,*(More)}: r[]  # Unclear
```

### Use Field Ordering Strategically

**Create Flow:**
```formdown
# Registration

Welcome! Let's get started.

@name: [text required]
@email: [email required]

Now, tell us about your interests:

@interests{Tech,Sports,Music,*(Custom Interest)}: c[]

Finally, set your preferences:

@notifications: [checkbox label="Email updates"]

Thank you for registering!
```

### Combine Features

```formdown
# Complete Example

## Personal Information  

@name: [text required]
@email: [email required]

Choose your role in our community:

@role{Developer,Designer,Manager,Student,*(Your Role)}: r[required]

## Preferences

What topics interest you?

@topics{Web Dev,Mobile,AI,Data Science,*(Custom Topic)}: c[]

How would you like us to contact you?

@contact{Email,Phone,Newsletter,*(Contact Method)}: r[]

Great! You're all set.
```

## Technical Details

### Field Ordering Implementation

- Each field maintains its exact markdown position
- Individual forms are generated for each field location
- Markdown content between fields is preserved
- No impact on validation or data binding

### Custom Other Labels

- Labels support any text, including special characters
- HTML entities are properly escaped for safety
- Multiple `*(label)` entries use the first label found
- Empty labels default to "Other"

### Data Processing

- JavaScript automatically handles name switching
- Text input gets the primary field name when "other" selected
- Radio/checkbox controls get temporary names to avoid conflicts
- Form submission produces clean, direct values

## Examples Library

### Contact Form with Sections
```formdown
# Contact Us

## Your Information

@name: [text required]  
@email: [email required]

## How Can We Help?

What's your inquiry about?

@topic{Sales,Support,Partnership,*(Specific Topic)}: r[required]

How urgent is this?

@priority{Low,Medium,High,*(Priority Level)}: r[]

## Details

Please describe your request:

@message: [textarea rows=4 required]

We'll get back to you soon!
```

### Event Feedback Survey  
```formdown
# Event Feedback

Thanks for attending! Your feedback helps us improve.

## Overall Experience

How would you rate the event?

@rating{Excellent,Good,Average,Poor}: r[required]

What did you like most?

@liked: [textarea rows=2]

## Specific Feedback

Which sessions did you attend?

@sessions{Keynote,Workshop A,Workshop B,Panel,*(Other Session)}: c[]

How did you hear about this event?

@source{Website,Social Media,Friend,Email,*(How You Heard)}: r[]

## Future Events

What topics would you like to see?

@future_topics{Tech Trends,Career Development,Networking,*(Suggested Topic)}: c[]

Would you attend future events?

@future_attendance{Definitely,Probably,Maybe,No}: r[required]

Thank you for your valuable feedback!
```

These new features make Formdown even more powerful while maintaining its simplicity and markdown-first approach.