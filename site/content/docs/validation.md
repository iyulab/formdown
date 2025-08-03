# Form Validation

Formdown provides comprehensive client-side validation with visual feedback and programmatic access to validation results.

## Overview

Both `<formdown-ui>` and `<formdown-editor>` components support form validation through the `validate()` method. When validation errors occur, fields are automatically highlighted with visual feedback.

## Validation Methods

### `validate()`

Returns a validation result object with error details and applies visual feedback to invalid fields.

```javascript
const form = document.querySelector('formdown-ui');
const result = form.validate();

if (result.isValid) {
    console.log('Form is valid!');
    // Proceed with form submission
} else {
    console.log('Validation errors:', result.errors);
    // Handle validation errors
}
```

**Return Type:**
```typescript
interface ValidationResult {
    isValid: boolean;
    errors: FieldError[];
}

interface FieldError {
    field: string;    // Field name that failed validation
    message: string;  // Human-readable error message
}
```

## Built-in Validation Rules

### Required Fields

```formdown
@name: [text required]
@email: [email required] 
@terms: [checkbox required]
```

### Input Type Validation

- **Email**: Validates email format
- **URL**: Validates URL format  
- **Tel**: Validates phone number format
- **Number**: Validates numeric input

```formdown
@email: [email required]
@website: [url]
@phone: [tel]
@age: [number min=18 max=120]
```

### Length Validation

```formdown
@username: [text required minlength=3 maxlength=20]
@bio: [textarea maxlength=500]
```

### Pattern Validation

```formdown
@username: [text pattern="[a-zA-Z0-9_]+" title="Only letters, numbers, and underscores"]
@zip: [text pattern="[0-9]{5}" title="5-digit ZIP code"]
```

### Range Validation

```formdown
@age: [number min=18 max=65]
@rating: [number min=1 max=5 step=0.5]
@birthdate: [date min="1900-01-01" max="2010-01-01"]
```

## Visual Feedback

### Error States

Fields that fail validation automatically receive:
- Red border color (`border-color: #dc2626`)
- Error box shadow
- Error message below the field

### Valid States  

Fields that pass validation receive:
- Green border color (`border-color: #10b981`)
- Success box shadow

### CSS Classes

You can style validation states using these classes:
- `.field-error`: Applied to invalid fields
- `.field-valid`: Applied to valid fields  
- `.validation-error-message`: Applied to error message elements

```css
/* Custom error styling */
.field-error {
    border-color: #ef4444 !important;
    background-color: #fef2f2;
}

.validation-error-message {
    color: #dc2626;
    font-size: 0.75rem;
    font-weight: 500;
}
```

## JavaScript Examples

### Basic Validation

```html
<formdown-ui id="contact-form">
@name: [text required]
@email: [email required]
@phone: [tel]
@message: [textarea required minlength=10]
</formdown-ui>

<button onclick="handleSubmit()">Submit</button>

<script>
function handleSubmit() {
    const form = document.getElementById('contact-form');
    const validation = form.validate();
    
    if (validation.isValid) {
        const data = form.getFormData();
        console.log('Submitting:', data);
        // Submit to server
        submitToServer(data);
    } else {
        console.error('Validation failed:', validation.errors);
        // Show error summary
        showErrorSummary(validation.errors);
    }
}

function showErrorSummary(errors) {
    const messages = errors.map(err => `${err.field}: ${err.message}`);
    alert('Please fix the following errors:\n' + messages.join('\n'));
}
</script>
```

### Real-time Validation

```html
<formdown-ui id="signup-form">
@username: [text required minlength=3]
@password: [password required minlength=8]
@confirmPassword: [password required]
@email: [email required]
</formdown-ui>

<script>
const form = document.getElementById('signup-form');

// Validate on every change
form.addEventListener('formdown-change', () => {
    const result = form.validate();
    updateSubmitButton(result.isValid);
    
    // Custom password confirmation check
    const data = form.getFormData();
    if (data.password && data.confirmPassword) {
        validatePasswordMatch(data.password, data.confirmPassword);
    }
});

function updateSubmitButton(isValid) {
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.disabled = !isValid;
        submitBtn.textContent = isValid ? 'Submit' : 'Please fix errors';
    }
}

function validatePasswordMatch(password, confirmPassword) {
    const confirmField = form.shadowRoot.querySelector('input[name="confirmPassword"]');
    
    if (password !== confirmPassword) {
        confirmField.classList.add('field-error');
        // Add custom error message
        addCustomError(confirmField, 'Passwords do not match');
    } else {
        confirmField.classList.remove('field-error');
        removeCustomError(confirmField);
    }
}
</script>
```

### Editor Validation

```html
<formdown-editor mode="split" id="form-editor">
@title: [text required maxlength=100]
@description: [textarea required minlength=20]
@category: [select required]
  - Technology
  - Design
  - Business
@tags: [text pattern="[a-z,\s]+" title="Lowercase letters and commas only"]
</formdown-editor>

<div id="validation-status"></div>

<script>
const editor = document.getElementById('form-editor');

// Validate preview on content change
editor.addEventListener('contentChange', () => {
    setTimeout(() => {
        const result = editor.validate();
        updateValidationStatus(result);
    }, 100); // Small delay to allow UI update
});

function updateValidationStatus(result) {
    const status = document.getElementById('validation-status');
    
    if (result.isValid) {
        status.innerHTML = '✅ Preview form is valid';
        status.className = 'text-green-600';
    } else {
        const errorCount = result.errors.length;
        status.innerHTML = `❌ Preview form has ${errorCount} error(s)`;
        status.className = 'text-red-600';
    }
}
</script>
```

## Custom Validation

While Formdown provides comprehensive built-in validation, you can add custom validation logic:

```javascript
function customValidation(formData) {
    const errors = [];
    
    // Custom business rules
    if (formData.age && formData.category === 'senior' && formData.age < 65) {
        errors.push({
            field: 'age',
            message: 'Senior category requires age 65 or older'
        });
    }
    
    // Cross-field validation
    if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        
        if (start >= end) {
            errors.push({
                field: 'endDate', 
                message: 'End date must be after start date'
            });
        }
    }
    
    return errors;
}

// Use with built-in validation
function validateWithCustomRules() {
    const form = document.querySelector('formdown-ui');
    const builtInResult = form.validate();
    const formData = form.getFormData();
    const customErrors = customValidation(formData);
    
    return {
        isValid: builtInResult.isValid && customErrors.length === 0,
        errors: [...builtInResult.errors, ...customErrors]
    };
}
```

## Error Handling

### Graceful Degradation

```javascript
function safeValidate(form) {
    try {
        return form.validate();
    } catch (error) {
        console.warn('Validation failed:', error);
        return {
            isValid: false,
            errors: [{ field: 'general', message: 'Validation unavailable' }]
        };
    }
}
```

### Accessibility

Validation errors are announced to screen readers through:
- ARIA labels on invalid fields
- Error messages linked to fields via `aria-describedby`
- Visual focus indicators for keyboard navigation

## Best Practices

1. **Validate early and often** - Use real-time validation for better UX
2. **Clear error messages** - Make validation errors specific and actionable
3. **Visual hierarchy** - Use color, icons, and typography to guide attention  
4. **Accessibility first** - Ensure validation works with assistive technologies
5. **Custom validation** - Supplement built-in rules with business logic
6. **Error recovery** - Clear validation states when fields are corrected
7. **Submit protection** - Disable submit buttons when validation fails

## Validation Attributes Reference

| Attribute | Types | Description | Example |
|-----------|-------|-------------|---------|
| `required` | All | Field must have a value | `[text required]` |
| `minlength` | text, textarea | Minimum character length | `[text minlength=3]` |
| `maxlength` | text, textarea | Maximum character length | `[text maxlength=50]` |
| `min` | number, date | Minimum value/date | `[number min=18]` |
| `max` | number, date | Maximum value/date | `[date max="2024-12-31"]` |
| `step` | number | Numeric step value | `[number step=0.5]` |
| `pattern` | text, tel | Regular expression pattern | `[text pattern="[0-9]+"]` |
| `title` | All | Error message for pattern validation | `[text pattern="[0-9]+" title="Numbers only"]` |
