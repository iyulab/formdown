# Examples

Explore practical examples demonstrating Formdown's powerful features, including the latest smart field ordering and custom "other" options.

## 🆕 Latest Features Showcase

### Core-First Architecture with FormManager

This example demonstrates the new Core-First architecture using FormManager for complete form lifecycle management:

```javascript
import { FormManager, createFormManager } from '@formdown/core';

// Define form content
const formContent = `
# Event Registration

@form[action="/register" method="POST"]

@name(Full Name)*: [placeholder="Enter your full name" value="John Doe"]
@email(Email Address)*: @[placeholder="your.email@example.com"]
@role{Attendee,Speaker,Sponsor,*(Custom Role)}: r[value="Attendee"]
@interests{Tech,Design,Marketing,*(Other Interest)}: c[value="Tech,Design"]
@dietary{None,Vegetarian,Vegan,*(Special Requirement)}: c[]
`;

// Create FormManager instance
const manager = new FormManager();
manager.parse(formContent);

// Set up reactive event handlers
manager.on('data-change', ({ field, value, formData }) => {
  console.log(`Field ${field} changed to:`, value);
  updateUI(formData); // Update your UI reactively
});

manager.on('validation-error', ({ field, errors }) => {
  showFieldError(field, errors[0].message);
});

// Programmatic form interaction
manager.setFieldValue('email', 'jane@example.com');
manager.updateData({ 
  role: 'Volunteer', // Uses "Custom Role" other option automatically
  interests: ['Tech', 'Custom Framework'] // Adds "Other Interest" option
});

// Validation and rendering
const validation = manager.validate();
if (validation.isValid) {
  const html = manager.render();
  document.getElementById('form-container').innerHTML = html;
  
  console.log('Form data:', manager.getData());
  // Output: { name: "John Doe", email: "jane@example.com", 
  //          role: "Volunteer", interests: ["Tech", "Custom Framework"] }
}

// Form state management
console.log('Form has changes:', manager.isDirty());
console.log('Schema:', manager.getSchema());

// Reset form
document.getElementById('reset-btn').onclick = () => {
  manager.reset(); // Resets to schema defaults
};
```

**Key Benefits:**
- **Framework Agnostic**: Works with React, Vue, Angular, vanilla JavaScript
- **Event-Driven**: Reactive updates through proper event system
- **Clean Data Structure**: No `_other` field suffixes in form data
- **Complete API**: Parse, render, validate, manage state in one class
- **Testable**: Business logic separated from presentation layer

### Hidden Form Architecture & Value Attributes

This example demonstrates the latest features including hidden forms, default values, and multiple form support:

```formdown
# Multi-Form Dashboard

@form[id="profile" action="/profile" method="POST"]

## User Profile

@name: [text value="John Doe" required placeholder="Enter your full name"]
@email: [email value="john@example.com" required]
@age: [number value=30 min=18 max=100]
@country: [select value="USA" options="USA,Canada,UK,Australia"]

@form[id="preferences" action="/preferences" method="POST"]

## Preferences 

@theme: [radio value="Dark" options="Light,Dark,Auto"]
@notifications: [checkbox value="Email,SMS" options="Email,SMS,Push,Phone"]
@newsletter: [checkbox value=true content="Subscribe to weekly newsletter"]

@form[id="feedback" action="/feedback" method="POST"]

## Quick Feedback

@rating: [range value=8 min=1 max=10]
@comments: [textarea value="Great interface!" rows=3]

// Explicit form association
@special_note: [text form="profile" placeholder="Add to profile"]
```

**Generated HTML includes:**
- Three hidden forms with clean association
- Pre-filled default values for all fields
- Clean styling without form wrapper interference
- Flexible field positioning throughout content

### Traditional Examples with Custom "Other" Labels

This example demonstrates smart field ordering and custom "other" labels:

```formdown
# Event Registration

Welcome to our developer conference! Please fill out your registration details.

## Personal Information

@name(Full Name): [text required]
@email(Email Address): [email required]

Your information will be kept confidential.

## Professional Background

What's your primary role?

@role{Developer,Designer,Manager,Student,*(Your Role)}: r[required]

What technologies interest you most?

@interests{Frontend,Backend,Mobile,AI/ML,DevOps,*(Custom Interest)}: c[]

## Session Preferences

Which track would you like to attend?

@track{Technical Deep Dives,Career Development,Industry Trends,*(Preferred Track)}: r[required]

How would you rate your experience level?

@experience{Beginner,Intermediate,Advanced,*(Experience Level)}: r[]

## Additional Information

Any dietary restrictions or special requirements?

@dietary{None,Vegetarian,Vegan,Gluten-Free,Allergies,*(Special Requirement)}: c[]

Thank you for registering! We'll send confirmation details to your email.

@newsletter: [checkbox] Subscribe to our newsletter for updates
@submit: [submit label="Complete Registration"]
```

**Key features demonstrated:**
- ✅ Fields maintain exact markdown positions
- ✅ Custom "other" labels like `*(Your Role)` and `*(Custom Interest)`
- ✅ Clean data output: `{"role": "Product Manager"}` instead of `{"role": "_other", "role_other": "Product Manager"}`
- ✅ Mixed content and form fields create natural flow

## Basic Contact Form

```formdown
# Contact Us

@name(Full Name): [text required placeholder="Enter your full name"]
@email(Email Address): [email required placeholder="your@email.com"]

@subject{General Inquiry,Support Request,Feature Request,Bug Report,*(Other Topic)}: s[required]

Please describe your inquiry:

@message(Message): [textarea required rows=5 placeholder="Tell us how we can help..."]

How did you hear about us?

@source{Website,Search Engine,Social Media,Friend,*(Please specify)}: r[]

@submit_btn: [submit label="Send Message"]
```

## User Registration

```formdown
# Create Account

## Personal Information
@firstName(First Name): [text required]
@lastName(Last Name): [text required]
@email(Email Address): [email required placeholder="Enter your email"]
@phone(Phone Number): [tel placeholder="(555) 123-4567"]

## Security
@password(Password): [password required minlength=8]
@confirmPassword(Confirm Password): [password required]
@terms: [checkbox required] I agree to the Terms of Service

@submit_btn: [submit label="Create Account"]
```

## Event Registration

```formdown
# Workshop Registration

## Event Details
You're registering for the **Advanced Web Development Workshop** on March 15, 2024.

## Attendee Information
@name(Full Name): [text required]
@email(Email Address): [email required]
@company(Company/Organization): [text]
@title(Job Title): [text]

## Preferences
@dietaryRestrictions(Dietary Restrictions or Allergies): [textarea rows=3]
@experience(Experience Level): [radio required]
  - Beginner
  - Intermediate  
  - Advanced

@newsletter: [checkbox] Subscribe to our newsletter for future events

## Payment
@eventFee: [hidden value="$299"]
@paymentMethod(Payment Method): [radio required]
  - Credit Card
  - PayPal
  - Bank Transfer

@submit_btn: [submit label="Register Now"]
```

## Survey Form

```formdown
# Customer Satisfaction Survey

## Overall Experience
@satisfaction(How satisfied are you with our service?): [radio required]
  - Very Satisfied
  - Satisfied
  - Neutral
  - Dissatisfied
  - Very Dissatisfied

## Specific Feedback
@quality(Product Quality): [range required min=1 max=10 value=5] (1-10)
@support(Customer Support): [range required min=1 max=10 value=5] (1-10)
@value(Value for Money): [range required min=1 max=10 value=5] (1-10)

## Additional Comments
@improvements(What could we improve?): [textarea rows=4]
@recommend(Would you recommend us to others?): [radio required]
  - Definitely
  - Probably
  - Maybe
  - Probably Not
  - Definitely Not

@contact: [checkbox] Contact me about this feedback

@submit_btn: [submit label="Submit Survey"]
```

@submit_btn: [submit label="Submit Application"]
```

```formdown
# Checkout

## Shipping Information
@firstName(First Name): [text required]
@lastName(Last Name): [text required]
@address(Street Address): [text required]
@city(City): [text required]
@state(State): [text required]
@zip(ZIP Code): [text required]
@country(Country): [select required]
  - United States
  - Canada
  - United Kingdom
  - Australia

## Delivery Options
@shipping(Shipping Method): [radio required]
  - Standard (5-7 days) - Free
  - Express (2-3 days) - $9.99
  - Overnight - $19.99

## Payment Information
@cardNumber(Card Number): [text required placeholder="1234 5678 9012 3456"]
@expiry(Expiry Date): [text required placeholder="MM/YY"]
@cvv(CVV): [text required placeholder="123"]

@billing: [checkbox] Billing address same as shipping

@submit_btn: [submit label="Complete Order"]
```

## Job Application

```formdown
# Job Application - Senior Developer

## Personal Information
@fullName(Full Name): [text required]
@email(Email Address): [email required]
@phone(Phone Number): [tel required]
@linkedin(LinkedIn Profile): [url placeholder="https://linkedin.com/in/yourprofile"]

## Experience
@currentPosition(Current Position): [text]
@currentCompany(Current Company): [text]
@experience(Years of Experience): [select required]
  - Less than 1 year
  - 1-2 years
  - 3-5 years
  - 6-10 years
  - More than 10 years

## Skills
@skills(Technical Skills): [textarea required rows=4 placeholder="List your relevant technical skills..."]
@portfolio(Portfolio Website): [url placeholder="https://yourportfolio.com"]

## Additional Information
@coverLetter(Cover Letter): [textarea rows=6 placeholder="Tell us why you're interested in this position..."]
@startDate(Available Start Date): [date]
@salary(Salary Expectation): [number placeholder="50000"]

@resume(Resume): [file required accept=".pdf,.doc,.docx"]

@submit_btn: [submit label="Submit Application"]
```

## Form Validation Examples

### Basic Validation with JavaScript

```html
<formdown-ui id="contact-form">
@name(Full Name): [text required minlength=2 maxlength=50]
@email(Email Address): [email required]
@phone(Phone Number): [tel pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" title="Format: 123-456-7890"]
@age(Age): [number required min=18 max=120]
@website(Website): [url placeholder="https://example.com"]
@message(Message): [textarea required minlength=10 maxlength=500]
@subscribe: [checkbox] Subscribe to newsletter
</formdown-ui>

<button onclick="validateForm()">Validate Form</button>
<button onclick="getFormData()">Get Form Data</button>
<button onclick="resetForm()">Reset Form</button>

<script>
function validateForm() {
    const form = document.getElementById('contact-form');
    const result = form.validate();
    
    if (result.isValid) {
        alert('Form is valid! ✅');
        console.log('Form data:', form.getFormData());
    } else {
        alert('Form has errors! ❌');
        console.log('Validation errors:', result.errors);
        // Fields with errors are automatically highlighted in red
    }
}

function getFormData() {
    const form = document.getElementById('contact-form');
    const data = form.getFormData();
    console.log('Current form data:', data);
    alert('Check console for form data');
}

function resetForm() {
    const form = document.getElementById('contact-form');
    form.resetForm();
    alert('Form reset! All validation states cleared.');
}
</script>
```

### Editor Validation

```html
<formdown-editor mode="split" id="form-editor">
@username(Username): [text required minlength=3 maxlength=20 pattern="[a-zA-Z0-9_]+" title="Only letters, numbers, and underscores"]
@password(Password): [password required minlength=8]
@email(Email): [email required]
@birthdate(Birth Date): [date required max="2006-01-01"]
@terms: [checkbox required] I accept the terms and conditions
</formdown-editor>

<button onclick="validateEditor()">Validate Preview</button>
<button onclick="getEditorData()">Get Preview Data</button>

<script>
function validateEditor() {
    const editor = document.getElementById('form-editor');
    const result = editor.validate();
    
    console.log('Editor validation:', result);
    if (result.isValid) {
        alert('Preview form is valid! ✅');
    } else {
        alert(`Preview form has ${result.errors.length} error(s)! ❌`);
    }
}

function getEditorData() {
    const editor = document.getElementById('form-editor');
    const data = editor.getFormData();
    console.log('Editor form data:', data);
}
</script>
```

### Real-time Validation

```html
<formdown-ui id="realtime-form">
@email(Email): [email required]
@password(Password): [password required minlength=8]
@confirmPassword(Confirm Password): [password required]
</formdown-ui>

<script>
const form = document.getElementById('realtime-form');

// Validate on every change
form.addEventListener('formdown-change', (event) => {
    const result = form.validate();
    
    // Custom validation for password confirmation
    const formData = form.getFormData();
    if (formData.password && formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
            // Add custom error styling
            const confirmInput = form.shadowRoot.querySelector('input[name="confirmPassword"]');
            if (confirmInput) {
                confirmInput.classList.add('field-error');
            }
        }
    }
    
    // Update submit button state
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = !result.isValid;
    }
});
</script>
```

## Schema Extraction Examples

### Basic Schema Usage

Extract form schema for validation, documentation, or dynamic form generation.

```javascript
import { getSchema } from '@formdown/core';

const formContent = `
# User Registration

@username*{^[a-zA-Z0-9_]{3,20}$}: [placeholder="Enter username"]
@email*: @[]
@age: #[min=13 max=120]
@bio: T4[maxlength=500]
@gender{Male,Female,Other}: r[]
@interests{Web,Mobile,AI,*}: c[]
@submit: [submit label="Create Account"]
`;

const schema = getSchema(formContent);

// Inspect schema structure
console.log('Available fields:', Object.keys(schema));
// → ['username', 'email', 'age', 'bio', 'gender', 'interests', 'submit']

console.log('Username field details:', schema.username);
// → {
//     type: 'text',
//     label: 'Username',
//     required: true,
//     position: 1,
//     placeholder: 'Enter username',
//     pattern: '^[a-zA-Z0-9_]{3,20}$',
//     validation: { pattern: '^[a-zA-Z0-9_]{3,20}$' },
//     layout: 'vertical'
//   }
```

### Form Validation with Schema

Use schema to implement comprehensive form validation:

```javascript
function validateFormWithSchema(formContent, userData) {
  const schema = getSchema(formContent);
  const errors = [];

  for (const [fieldName, fieldSchema] of Object.entries(schema)) {
    const value = userData[fieldName];
    
    // Skip non-input fields
    if (['submit', 'reset'].includes(fieldSchema.type)) continue;
    
    // Required field validation
    if (fieldSchema.required && (!value || value.toString().trim() === '')) {
      errors.push({
        field: fieldName,
        message: `${fieldSchema.label} is required`
      });
      continue;
    }
    
    // Skip further validation if no value provided
    if (!value) continue;
    
    // Type-specific validation
    switch (fieldSchema.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push({
            field: fieldName,
            message: `${fieldSchema.label} must be a valid email address`
          });
        }
        break;
        
      case 'number':
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors.push({
            field: fieldName,
            message: `${fieldSchema.label} must be a number`
          });
        } else if (fieldSchema.validation) {
          const { min, max } = fieldSchema.validation;
          if (min !== undefined && numValue < min) {
            errors.push({
              field: fieldName,
              message: `${fieldSchema.label} must be at least ${min}`
            });
          }
          if (max !== undefined && numValue > max) {
            errors.push({
              field: fieldName,
              message: `${fieldSchema.label} must be no more than ${max}`
            });
          }
        }
        break;
    }
    
    // Pattern validation
    if (fieldSchema.validation?.pattern) {
      const regex = new RegExp(fieldSchema.validation.pattern);
      if (!regex.test(value)) {
        errors.push({
          field: fieldName,
          message: `${fieldSchema.label} format is invalid`
        });
      }
    }
    
    // Length validation
    if (fieldSchema.validation?.maxlength && value.length > fieldSchema.validation.maxlength) {
      errors.push({
        field: fieldName,
        message: `${fieldSchema.label} must be no more than ${fieldSchema.validation.maxlength} characters`
      });
    }
    
    if (fieldSchema.validation?.minlength && value.length < fieldSchema.validation.minlength) {
      errors.push({
        field: fieldName,
        message: `${fieldSchema.label} must be at least ${fieldSchema.validation.minlength} characters`
      });
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

// Usage example
const userData = {
  username: 'john123',
  email: 'john@example.com',
  age: 25,
  bio: 'Software developer with 5 years of experience',
  gender: 'Male',
  interests: ['Web', 'AI']
};

const validation = validateFormWithSchema(formContent, userData);
if (validation.isValid) {
  console.log('✅ All data is valid!');
} else {
  console.log('❌ Validation errors:', validation.errors);
}
```

### Dynamic Form Generation

Create forms programmatically using schema:

```javascript
function generateFormHTML(formContent) {
  const schema = getSchema(formContent);
  let html = '<form class="dynamic-form">\n';
  
  // Sort fields by position
  const sortedFields = Object.entries(schema)
    .sort(([,a], [,b]) => (a.position || 0) - (b.position || 0));
  
  for (const [fieldName, fieldSchema] of sortedFields) {
    // Skip submit/reset buttons for now
    if (['submit', 'reset'].includes(fieldSchema.type)) continue;
    
    html += `  <div class="form-field">\n`;
    html += `    <label for="${fieldName}">${fieldSchema.label}`;
    
    if (fieldSchema.required) {
      html += ' <span class="required">*</span>';
    }
    
    html += `</label>\n`;
    
    // Generate input based on field type
    switch (fieldSchema.type) {
      case 'textarea':
        html += `    <textarea id="${fieldName}" name="${fieldName}"`;
        if (fieldSchema.placeholder) {
          html += ` placeholder="${fieldSchema.placeholder}"`;
        }
        if (fieldSchema.validation?.maxlength) {
          html += ` maxlength="${fieldSchema.validation.maxlength}"`;
        }
        html += `></textarea>\n`;
        break;
        
      case 'select':
        html += `    <select id="${fieldName}" name="${fieldName}">\n`;
        if (fieldSchema.options) {
          for (const option of fieldSchema.options) {
            html += `      <option value="${option}">${option}</option>\n`;
          }
        }
        html += `    </select>\n`;
        break;
        
      case 'radio':
        if (fieldSchema.options) {
          for (const option of fieldSchema.options) {
            html += `    <label><input type="radio" name="${fieldName}" value="${option}"> ${option}</label>\n`;
          }
        }
        break;
        
      case 'checkbox':
        if (fieldSchema.options) {
          for (const option of fieldSchema.options) {
            html += `    <label><input type="checkbox" name="${fieldName}" value="${option}"> ${option}</label>\n`;
          }
          if (fieldSchema.allowOther) {
            html += `    <label><input type="checkbox" name="${fieldName}" value="other"> Other: <input type="text" name="${fieldName}_other"></label>\n`;
          }
        } else {
          html += `    <input type="checkbox" id="${fieldName}" name="${fieldName}">\n`;
        }
        break;
        
      default:
        html += `    <input type="${fieldSchema.type}" id="${fieldName}" name="${fieldName}"`;
        
        if (fieldSchema.placeholder) {
          html += ` placeholder="${fieldSchema.placeholder}"`;
        }
        
        if (fieldSchema.required) {
          html += ` required`;
        }
        
        if (fieldSchema.validation) {
          const { min, max, minlength, maxlength, pattern } = fieldSchema.validation;
          if (min !== undefined) html += ` min="${min}"`;
          if (max !== undefined) html += ` max="${max}"`;
          if (minlength !== undefined) html += ` minlength="${minlength}"`;
          if (maxlength !== undefined) html += ` maxlength="${maxlength}"`;
          if (pattern) html += ` pattern="${pattern}"`;
        }
        
        html += `>\n`;
        break;
    }
    
    html += `  </div>\n`;
  }
  
  // Add submit button
  const submitField = Object.values(schema).find(field => field.type === 'submit');
  if (submitField) {
    html += `  <div class="form-field">\n`;
    html += `    <button type="submit">${submitField.label || 'Submit'}</button>\n`;
    html += `  </div>\n`;
  }
  
  html += '</form>';
  return html;
}

// Generate and insert form
const generatedForm = generateFormHTML(formContent);
document.getElementById('form-container').innerHTML = generatedForm;
```

### API Documentation Generation

Generate API documentation from form schemas:

```javascript
function generateAPIDoc(formContent, apiPath) {
  const schema = getSchema(formContent);
  
  console.log(`## API Endpoint: ${apiPath}`);
  console.log('### Request Body');
  console.log('```json');
  console.log('{');
  
  const fields = Object.entries(schema)
    .filter(([, field]) => !['submit', 'reset'].includes(field.type))
    .sort(([,a], [,b]) => (a.position || 0) - (b.position || 0));
  
  fields.forEach(([fieldName, fieldSchema], index) => {
    const isLast = index === fields.length - 1;
    let exampleValue;
    
    switch (fieldSchema.type) {
      case 'email': exampleValue = '"user@example.com"'; break;
      case 'number': exampleValue = '25'; break;
      case 'date': exampleValue = '"2023-12-25"'; break;
      case 'checkbox':
        if (fieldSchema.options) {
          exampleValue = '["option1", "option2"]';
        } else {
          exampleValue = 'true';
        }
        break;
      default: exampleValue = '"example value"'; break;
    }
    
    console.log(`  "${fieldName}": ${exampleValue}${isLast ? '' : ','}`);
  });
  
  console.log('}');
  console.log('```');
  console.log('');
  console.log('### Field Validation Rules');
  console.log('');
  
  for (const [fieldName, fieldSchema] of fields) {
    console.log(`**${fieldSchema.label}** (\`${fieldName}\`)`);
    console.log(`- Type: \`${fieldSchema.type}\``);
    console.log(`- Required: ${fieldSchema.required ? 'Yes' : 'No'}`);
    
    if (fieldSchema.validation) {
      const rules = [];
      if (fieldSchema.validation.min !== undefined) rules.push(`minimum: ${fieldSchema.validation.min}`);
      if (fieldSchema.validation.max !== undefined) rules.push(`maximum: ${fieldSchema.validation.max}`);
      if (fieldSchema.validation.minlength) rules.push(`min length: ${fieldSchema.validation.minlength}`);
      if (fieldSchema.validation.maxlength) rules.push(`max length: ${fieldSchema.validation.maxlength}`);
      if (fieldSchema.validation.pattern) rules.push(`pattern: \`${fieldSchema.validation.pattern}\``);
      
      if (rules.length > 0) {
        console.log(`- Validation: ${rules.join(', ')}`);
      }
    }
    
    if (fieldSchema.options) {
      console.log(`- Options: ${fieldSchema.options.join(', ')}`);
      if (fieldSchema.allowOther) {
        console.log('- Allows custom values');
      }
    }
    
    console.log('');
  }
}

// Generate documentation
generateAPIDoc(formContent, 'POST /api/users/register');
```

### Testing Data Generation

Generate test data based on schema:

```javascript
function generateTestData(formContent, count = 5) {
  const schema = getSchema(formContent);
  const testData = [];
  
  for (let i = 0; i < count; i++) {
    const data = {};
    
    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      // Skip non-input fields
      if (['submit', 'reset'].includes(fieldSchema.type)) continue;
      
      // Generate test value based on field type
      switch (fieldSchema.type) {
        case 'text':
          data[fieldName] = `Test ${fieldSchema.label} ${i + 1}`;
          break;
        case 'email':
          data[fieldName] = `test${i + 1}@example.com`;
          break;
        case 'number':
          const min = fieldSchema.validation?.min || 1;
          const max = fieldSchema.validation?.max || 100;
          data[fieldName] = Math.floor(Math.random() * (max - min + 1)) + min;
          break;
        case 'date':
          const date = new Date();
          date.setFullYear(date.getFullYear() - Math.floor(Math.random() * 50) - 18);
          data[fieldName] = date.toISOString().split('T')[0];
          break;
        case 'checkbox':
          if (fieldSchema.options) {
            // Select random subset of options
            const selectedCount = Math.floor(Math.random() * fieldSchema.options.length) + 1;
            data[fieldName] = fieldSchema.options
              .sort(() => 0.5 - Math.random())
              .slice(0, selectedCount);
          } else {
            data[fieldName] = Math.random() > 0.5;
          }
          break;
        case 'radio':
        case 'select':
          if (fieldSchema.options) {
            data[fieldName] = fieldSchema.options[Math.floor(Math.random() * fieldSchema.options.length)];
          }
          break;
        default:
          data[fieldName] = `Sample ${fieldSchema.type} value`;
          break;
      }
    }
    
    testData.push(data);
  }
  
  return testData;
}

// Generate test data
const testData = generateTestData(formContent, 3);
console.log('Generated test data:', testData);

// Use for automated testing
testData.forEach((data, index) => {
  const validation = validateFormWithSchema(formContent, data);
  console.log(`Test case ${index + 1}:`, validation.isValid ? '✅ Valid' : '❌ Invalid');
});
```

## "Other" Option Forms

FormDown supports an "Other" option in selection fields that allows users to provide custom input when predefined options aren't sufficient.

### Basic "Other" Option Usage

```formdown
# Survey Form with Custom Input

## Personal Information
@country{USA,Canada,UK,Germany,*}: s[required]
@education{High School,Bachelor's,Master's,PhD,*}: r[required]
@skills{JavaScript,Python,Java,C++,*}: c[]

## Feedback
@rating{Excellent,Good,Fair,Poor}: r[required]
@contact_method{Email,Phone,Mail,*}: r[]

@comments: [textarea rows=4 placeholder="Additional comments..."]
@submit: [submit label="Submit Survey"]
```

### How "Other" Options Work

When `*` is included in options, FormDown automatically:

1. **Adds "Other" choice** - Appends "Other (please specify)" option
2. **Creates text input** - Shows when "Other" is selected  
3. **Separate form fields** - Generates `fieldname` and `fieldname_other`
4. **Interactive behavior** - Text input appears/hides dynamically

### Processing "Other" Option Data

```javascript
// Form data with "other" selections
const formData = {
  country: "USA",              // Standard selection
  education: "_other",         // "Other" was selected
  education_other: "Trade School",  // Custom input
  skills: ["JavaScript", "_other"],  // Mix of standard and other
  skills_other: "Rust",        // Custom skill
  contact_method: "Email"      // Standard selection
};

// Process the data
function processOtherOptions(data) {
  const processed = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (key.endsWith('_other')) {
      // Skip - will be handled with main field
      continue;
    }
    
    if (Array.isArray(value)) {
      // Handle checkbox groups with other
      const finalValues = value.map(v => {
        if (v === '_other') {
          return data[`${key}_other`] || 'Other';
        }
        return v;
      });
      processed[key] = finalValues;
    } else if (value === '_other') {
      // Handle radio/select with other
      processed[key] = data[`${key}_other`] || 'Other';
    } else {
      processed[key] = value;
    }
  }
  
  return processed;
}

const result = processOtherOptions(formData);
console.log('Processed data:', result);
// Output:
// {
//   country: "USA",
//   education: "Trade School", 
//   skills: ["JavaScript", "Rust"],
//   contact_method: "Email"
// }
```

### Advanced "Other" Option Examples

```formdown
# Event Registration

## Dietary Restrictions
@diet{Vegetarian,Vegan,Gluten-Free,Kosher,Halal,*}: c[]

## T-Shirt Size  
@size{XS,S,M,L,XL,XXL,*}: r[required]

## How did you hear about us?
@referral{Social Media,Friend,Website,Newsletter,*}: r[]

## Programming Languages (select all that apply)
@languages{JavaScript,Python,Java,C#,Go,Rust,*}: c[]

## Session Preference
@session{Morning,Afternoon,Evening,*}: r[required]
```

### Schema Analysis with "Other" Options

```javascript
import { getSchema } from '@formdown/core';

const formContent = `
@country{USA,Canada,UK,*}: s[required]
@interests{Tech,Sports,Music,*}: c[]
`;

const schema = getSchema(formContent);

console.log('Country field schema:');
console.log({
  type: schema.country.type,           // "select"
  options: schema.country.options,     // ["USA", "Canada", "UK"]
  allowOther: schema.country.allowOther, // true
  required: schema.country.required    // true
});

console.log('Interests field schema:');
console.log({
  type: schema.interests.type,         // "checkbox"
  options: schema.interests.options,   // ["Tech", "Sports", "Music"]
  allowOther: schema.interests.allowOther, // true
  required: schema.interests.required  // false
});
```

### HTML Output for "Other" Options

FormDown generates interactive HTML with automatic show/hide behavior:

```html
<!-- Select with other option -->
<div class="formdown-field">
  <label for="country">Country *</label>
  <select id="country" name="country" required 
          onchange="this.value === '_other' ? this.nextElementSibling.style.display = 'block' : this.nextElementSibling.style.display = 'none'">
    <option value="USA">USA</option>
    <option value="Canada">Canada</option>
    <option value="UK">UK</option>
    <option value="_other">Other (please specify)</option>
  </select>
  <input type="text" id="country_other" name="country_other" 
         placeholder="Please specify..." style="display: none;" 
         class="formdown-other-input">
</div>

<!-- Radio with other option -->
<div class="formdown-field">
  <fieldset>
    <legend>Interests</legend>
    <div class="checkbox-group inline" role="group">
      <label for="interests_0" class="formdown-option-label">
        <input type="checkbox" id="interests_0" name="interests" value="Tech">
        <span>Tech</span>
      </label>
      <label for="interests_1" class="formdown-option-label">
        <input type="checkbox" id="interests_1" name="interests" value="Sports">
        <span>Sports</span>
      </label>
      <label for="interests_other_checkbox" class="formdown-option-label">
        <input type="checkbox" id="interests_other_checkbox" name="interests" value="_other"
               onchange="document.getElementById('interests_other_input').style.display = this.checked ? 'block' : 'none'">
        <span>Other:</span>
        <input type="text" id="interests_other_input" name="interests_other" 
               placeholder="Please specify..." style="display: none; margin-left: 8px;" 
               class="formdown-other-input">
      </label>
    </div>
  </fieldset>
</div>
```
