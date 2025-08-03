# Latest Features

## 🎯 HTML5 Datalist Support (Latest - Phase 2)

**Major Enhancement:** Complete HTML5 datalist support for advanced autocomplete functionality with dual syntax options.

### What's New

FormDown now supports HTML5 datalist elements for enhanced user experience:

- **Dual Syntax Support**: Both explicit declarations and shorthand auto-generation
- **Autocomplete UX**: Native browser autocomplete with custom option lists  
- **Smart Deduplication**: Automatic reuse of identical option lists
- **XSS Protection**: All datalist options are HTML-escaped for security
- **Form Integration**: Seamless integration with Hidden Form Architecture

### Quick Examples

**Explicit Datalist Declaration (Reusable):**
```formdown
@datalist[id="countries" options="Korea,Japan,China,USA,Canada,UK"]
@datalist[id="languages" options="JavaScript,TypeScript,Python,Java,Go,Rust"]

@country(Preferred Country): [text datalist="countries" autocomplete="country"]
@language(Primary Language): [text datalist="languages"]
```

**Shorthand Auto-Generation (Quick):**
```formdown
@city{Seoul,Tokyo,Beijing,New York,London}: [text autocomplete="address-level2"]
@framework{React,Vue,Angular,Svelte}: [text]
@status{Active,Inactive,Pending}: [text]
```

**Complete Registration Form:**
```formdown
@form[action="/register" method="POST"]

# User Registration with Autocomplete

@datalist[id="countries" options="Korea,Japan,China,USA,Canada,UK,Germany,France"]

@name(Full Name): [text required minlength=2]
@email(Email Address): [email required]
@country(Country): [text datalist="countries" autocomplete="country"]
@city{Seoul,Tokyo,Beijing,New York,London,Paris}: [text autocomplete="address-level2"]

@skills{JavaScript,Python,React,Node.js,AWS,Docker}: [text placeholder="Start typing..."]
@timezone{UTC,PST,EST,JST,CET,KST}: [text]

@[submit "Complete Registration"]
```

### Key Benefits

1. **Enhanced UX**: Native browser autocomplete with custom suggestions
2. **Flexibility**: Choose between explicit reusable lists or quick shorthand
3. **Performance**: Smart deduplication prevents duplicate datalist elements
4. **Standards Compliant**: Uses native HTML5 `<datalist>` and `list` attribute
5. **Accessibility**: Full keyboard navigation and screen reader support

### Technical Features

- **Smart ID Generation**: Hash-based unique IDs for shorthand syntax
- **Validation**: Proper error handling for missing/empty attributes  
- **HTML Output**: Clean `<datalist><option>` structure generation
- **Browser Fallback**: Graceful degradation to regular text inputs

[**Try the Interactive Demo →**](/demo)

---

## 🎯 Enhanced Action Elements (Latest - Phase 2)

**Major Enhancement:** Improved action element syntax for better semantic clarity and Markdown compatibility.

### What's New

Enhanced action element syntax that clearly distinguishes user actions from input fields:

- **Semantic Clarity**: Actions (`@[action]`) vs. Input Fields (`@field: [type]`)
- **Markdown Compatibility**: Avoids confusion with Markdown link syntax
- **Concise Syntax**: More intuitive and less verbose than legacy approach
- **Full Backward Compatibility**: Both syntaxes work seamlessly together

### New Action Syntax (Recommended)

```formdown
@[submit "Send Message"]                           # Submit button
@[reset "Clear Form"]                              # Reset button  
@[button "Calculate" onclick="calculate()"]        # Custom button
@[image "Submit Order" src="/submit.png"]          # Image button
```

**With Advanced Styling:**
```formdown
@[submit "Complete Registration" class="btn btn-success btn-lg"]
@[button "Save Draft" class="btn btn-warning" onclick="saveDraft()"]
@[reset "Start Over" class="btn btn-outline-secondary"]
```

### Complete Form Example

```formdown
@form[action="/contact" method="POST"]

# Contact Form with Enhanced Actions

@name(Full Name): [text required minlength=2]
@email(Email Address): [email required]
@message: [textarea required rows=4 placeholder="Your message..."]

@priority{Low,Medium,High}: [radio]
@newsletter: [checkbox content="Subscribe to our newsletter"]

@[submit "Send Message" class="btn btn-primary"]
@[reset "Clear Form" class="btn btn-outline-secondary"]
@[button "Save Draft" class="btn btn-warning" onclick="saveDraft()"]
```

### Benefits

- ✅ **Clear Semantics**: Immediate distinction between data input and user actions
- ✅ **Better Readability**: Action intent is obvious at first glance
- ✅ **Markdown Safe**: No conflicts with `[text](url)` link syntax
- ✅ **Framework Ready**: Generated HTML works with all CSS frameworks
- ✅ **Backward Compatible**: Legacy `@button: [submit]` syntax still supported

[**View Action Elements Demo →**](/samples/file-button-fields.fd)

---

## 🎉 Core-First Architecture Phase 2 Complete

**Major Achievement:** Revolutionary **FormManager + 4 Core modules** architecture with 100% legacy code elimination and complete UI/Editor integration.

### Phase 2 Achievements

#### ⭐ **Core Module System Complete**
- **FormManager**: Central coordinator with 12+ UI/Editor integration APIs
- **FieldProcessor**: Field type processing, validation, and value extraction
- **DOMBinder**: DOM manipulation, event handling, and data synchronization
- **ValidationManager**: Async validation pipelines with caching and debouncing
- **EventOrchestrator**: Component-to-component event coordination and bridging

#### 🎨 **FormdownUI Optimization (Phase 2.1)**
- **Code Reduction**: 1307 lines → 1186 lines (9.3% optimization)
- **100% Core Integration**: All DOM operations delegated to DOMBinder
- **Legacy Elimination**: processFormHTML removed, renderToTemplate adopted
- **Performance Boost**: Streamlined event handling via Core modules

#### ✏️ **FormdownEditor Enhancement (Phase 2.2)**  
- **Core Integration**: 100% EventOrchestrator and FormManager delegation
- **Template Consolidation**: templates.ts eliminated, inline rendering
- **Real-time Power**: createPreviewTemplate for instant Core-powered parsing
- **Architecture Achievement**: Complete legacy code elimination

### FormManager - The Central API

The FormManager class is the heart of the new architecture:

```javascript
import { FormManager, createFormManager } from '@formdown/core';

// Full control approach
const manager = new FormManager();
manager.parse('@name*: [placeholder="Enter name"]');
manager.setFieldValue('name', 'John Doe');
const html = manager.render();

// Convenience approach  
const quickManager = createFormManager('@email*: @[]');
quickManager.updateData({ email: 'user@example.com' });
```

### Key Benefits

1. **Framework Independence**: Use Formdown with React, Vue, Angular, or vanilla JS
2. **Business Logic Separation**: All form logic centralized in Core package
3. **Event-Driven Reactivity**: Subscribe to data changes, validation events, form submission
4. **Enhanced Reusability**: Same Core logic across different presentation layers
5. **Easier Testing**: Test business logic independently of UI components
6. **Better Maintainability**: Single source of truth for form behavior

### Migration Path

Existing code continues to work unchanged. The new architecture is additive:

**Legacy approach (still works):**
```javascript
import { parseFormdown, generateFormHTML } from '@formdown/core';

const parsed = parseFormdown(content);
const html = generateFormHTML(parsed);
```

**Modern approach (recommended):**
```javascript
import { FormManager } from '@formdown/core';

const manager = new FormManager();
manager.parse(content);
manager.on('data-change', ({ field, value }) => {
  console.log(`${field} changed to ${value}`);
});
const html = manager.render();
```

### Complete Example

```javascript
import { FormManager } from '@formdown/core';

const formContent = `
# User Registration

@name(Full Name)*: [placeholder="Enter your full name"]
@email(Email Address)*: @[placeholder="your.email@example.com"]
@age: [number min=18 max=100 value=25]
@interests{Web,Mobile,AI,*(Custom Interest)}: c[]
`;

// Create and initialize form manager
const manager = new FormManager();
manager.parse(formContent);

// Set up reactive event handlers
manager.on('data-change', ({ field, value, formData }) => {
  console.log(`Field ${field} changed:`, value);
  console.log('Full form data:', formData);
});

manager.on('validation-error', ({ field, errors }) => {
  console.log(`Validation error in ${field}:`, errors);
});

// Interact with form data
manager.setFieldValue('name', 'Jane Smith');
manager.updateData({ 
  email: 'jane@example.com',
  interests: ['Web', 'Custom Framework']
});

// Validate and render
const validation = manager.validate();
if (validation.isValid) {
  const html = manager.render();
  document.body.innerHTML = html;
}

// Check for changes
console.log('Form has changes:', manager.isDirty());
console.log('Current data:', manager.getData());
```

[**Learn More →**](/docs/api#formmanager-class)

---

## 🎯 Value Attribute for Default Values (Latest)

**Major Release:** Comprehensive default value support for all field types using the intuitive `value` attribute.

### What's New

The Value Attribute system provides:

- **Universal Support**: Default values for all field types (text, select, radio, checkbox, etc.)
- **Type-Aware Processing**: Automatic value conversion and validation
- **Selection Pre-selection**: Pre-check radio buttons, checkboxes, and select options
- **Boolean Support**: `value=true/false` for single checkboxes
- **Multiple Values**: `value="A,B,C"` for checkbox groups
- **Clean Syntax**: Natural, HTML-like attribute syntax

### Quick Examples

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

// Text area with default content
@message: [textarea value="Please enter your message here..." rows=4]

// Selection fields with defaults
@country: [select value="USA" options="USA,Canada,UK,Australia"]
@priority: [radio value="Medium" options="Low,Medium,High"]
@features: [checkbox value="Email,SMS" options="Email,SMS,Push,Phone"]

// Single checkbox (boolean)
@newsletter: [checkbox value=true content="Subscribe to newsletter"]

// Range with default value
@satisfaction: [range value=8 min=1 max=10]
```

### Key Benefits

1. **Intuitive Syntax**: Uses familiar HTML `value` attribute pattern
2. **Type Safety**: Automatic type conversion for numbers, booleans, dates
3. **Selection Logic**: Smart pre-selection for radio, checkbox, and select fields
4. **Edge Case Handling**: Graceful handling of invalid or missing values
5. **HTML Standards**: Generates proper `selected`, `checked`, and `value` attributes

[**Learn More →**](/docs/syntax#default-values-with-value-attribute)

---

## 🏗️ Hidden Form Architecture

**Major Release:** Revolutionary form architecture that separates form definition from field positioning for maximum styling flexibility.

### What's New

The Hidden Form Architecture provides:

- **Clean Styling**: No form wrapper interfering with CSS layout
- **Flexible Positioning**: Fields can be placed anywhere in the document  
- **Multiple Forms**: Support multiple forms in one document
- **HTML Standards**: Uses native HTML `form` attribute for proper association
- **Accessibility**: Maintains proper form semantics and screen reader support

### How It Works

Traditional form builders wrap fields in visible `<form>` elements, which can interfere with CSS layouts. Formdown's Hidden Form Architecture solves this:

```formdown
@form[action="/submit" method="POST"]

@name: [text required]
@email: [email required]
```

Generates:
```html
<!-- Hidden form - no layout impact -->
<form hidden id="formdown-form-1" action="/submit" method="POST"></form>

<!-- Fields with form association -->
<div class="formdown-field">
    <label for="name">Name *</label>
    <input type="text" id="name" name="name" required form="formdown-form-1">
</div>
<div class="formdown-field">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required form="formdown-form-1">
</div>
```

### Multiple Forms Example

```formdown
# Multi-Form Document

@form[id="login" action="/login" method="POST"]

## Login
@username: [text required]
@password: [password required]

@form[id="register" action="/register" method="POST"]

## Register  
@new_username: [text required]
@new_password: [password required]
@email: [email required]

// Explicit form association
@special_field: [text form="login"]
```

### Benefits

- ✅ **Clean CSS**: No form wrapper interfering with layout
- ✅ **Flexible Design**: Fields positioned anywhere in content
- ✅ **Multiple Forms**: Several forms in one document
- ✅ **Modern Standards**: Uses HTML5 `form` attribute
- ✅ **Backward Compatible**: Existing code works unchanged

[**Learn More →**](/docs/syntax#hidden-form-architecture)

---

## 📋 Field Helper API

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