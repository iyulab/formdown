# Extension Examples

This document provides real-world examples of Formdown plugins for common use cases.

## Table of Contents

- [UI Enhancement Plugins](#ui-enhancement-plugins)
- [Validation Plugins](#validation-plugins)
- [Field Type Plugins](#field-type-plugins)
- [Integration Plugins](#integration-plugins)
- [Utility Plugins](#utility-plugins)

## UI Enhancement Plugins

### Bootstrap Theme Plugin

```typescript
import type { Plugin } from '@formdown/core'

export const bootstrapThemePlugin: Plugin = {
  metadata: {
    name: 'bootstrap-theme',
    version: '1.0.0',
    description: 'Bootstrap 5 theme for Formdown forms'
  },
  
  hooks: [{
    name: 'post-parse',
    priority: 10,
    handler: (context) => {
      if (context.parseResult?.fields) {
        context.parseResult.fields.forEach(field => {
          field.attributes = {
            ...field.attributes,
            className: getBootstrapClasses(field.type)
          }
        })
      }
    }
  }],
  
  renderers: [{
    template: 'text',
    render: (field) => `
      <div class="mb-3">
        <label for="${field.name}" class="form-label">${field.label}</label>
        <input type="text" 
               class="form-control ${field.attributes?.className || ''}" 
               name="${field.name}" 
               id="${field.name}"
               ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
               ${field.required ? 'required' : ''} />
      </div>
    `
  }]
}

function getBootstrapClasses(fieldType: string): string {
  const baseClasses = 'form-control'
  const typeClasses = {
    'text': '',
    'email': '',
    'select': 'form-select',
    'checkbox': 'form-check-input',
    'radio': 'form-check-input'
  }
  
  return `${baseClasses} ${typeClasses[fieldType] || ''}`
}
```

### Accessibility Enhancement Plugin

```typescript
export const accessibilityPlugin: Plugin = {
  metadata: {
    name: 'accessibility-enhancer',
    version: '1.0.0',
    description: 'Enhances forms with ARIA attributes and screen reader support'
  },
  
  hooks: [{
    name: 'post-generate',
    priority: 5,
    handler: (context) => {
      // Add ARIA attributes to form elements
      if (context.parseResult?.fields) {
        context.parseResult.fields.forEach(field => {
          addAriaAttributes(field)
        })
      }
    }
  }]
}

function addAriaAttributes(field: Field): void {
  field.attributes = {
    ...field.attributes,
    'aria-label': field.label,
    'aria-required': field.required ? 'true' : 'false',
    'aria-describedby': field.description ? `${field.name}-desc` : undefined
  }
}
```

## Validation Plugins

### Advanced Email Validation

```typescript
export const advancedEmailPlugin: Plugin = {
  metadata: {
    name: 'advanced-email-validation',
    version: '1.0.0',
    description: 'Advanced email validation with domain verification'
  },
  
  validators: [{
    name: 'verified-email',
    validate: async (value: string) => {
      if (!value) return true
      
      // Basic format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) return false
      
      // Check for disposable email domains
      const domain = value.split('@')[1]
      const isDisposable = await checkDisposableDomain(domain)
      if (isDisposable) return false
      
      // DNS MX record verification
      return await verifyMXRecord(domain)
    },
    getMessage: () => 'Please enter a valid, non-disposable email address'
  }]
}

async function checkDisposableDomain(domain: string): Promise<boolean> {
  // Check against disposable email domain list
  const disposableDomains = ['10minutemail.com', 'tempmail.org', /* ... */]
  return disposableDomains.includes(domain.toLowerCase())
}

async function verifyMXRecord(domain: string): Promise<boolean> {
  try {
    // In a real implementation, you'd use DNS lookup
    const response = await fetch(`/api/verify-domain/${domain}`)
    return response.ok
  } catch {
    return true // Fail gracefully
  }
}
```

### Credit Card Validation Plugin

```typescript
export const creditCardPlugin: Plugin = {
  metadata: {
    name: 'credit-card-validation',
    version: '1.0.0',
    description: 'Credit card validation with Luhn algorithm'
  },
  
  fieldTypes: [{
    type: 'credit-card',
    parser: (content) => {
      const match = content.match(/@(\w+):\s*\[credit-card\](.*)/)
      if (!match) return null
      
      return {
        name: match[1],
        type: 'credit-card',
        label: 'Credit Card Number',
        pattern: '[0-9\\s]{13,19}',
        attributes: {
          autoComplete: 'cc-number',
          inputMode: 'numeric'
        }
      }
    },
    validator: (field, value) => {
      const rules = []
      
      if (value && !isValidCreditCard(value)) {
        rules.push({
          type: 'custom',
          message: 'Please enter a valid credit card number'
        })
      }
      
      return rules
    },
    generator: (field) => `
      <div class="credit-card-field">
        <label for="${field.name}">${field.label}</label>
        <input type="text" 
               name="${field.name}" 
               id="${field.name}"
               autocomplete="cc-number"
               inputmode="numeric"
               placeholder="1234 5678 9012 3456"
               ${field.required ? 'required' : ''} />
        <div class="card-icons">
          <img src="/icons/visa.svg" alt="Visa" />
          <img src="/icons/mastercard.svg" alt="Mastercard" />
        </div>
      </div>
    `
  }]
}

function isValidCreditCard(number: string): boolean {
  // Remove spaces and non-digits
  const cleanNumber = number.replace(/\D/g, '')
  
  // Check length
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false
  }
  
  // Luhn algorithm
  let sum = 0
  let alternate = false
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10)
    
    if (alternate) {
      digit *= 2
      if (digit > 9) {
        digit = (digit % 10) + 1
      }
    }
    
    sum += digit
    alternate = !alternate
  }
  
  return sum % 10 === 0
}
```

## Field Type Plugins

### Rich Text Editor Plugin

```typescript
export const richTextPlugin: Plugin = {
  metadata: {
    name: 'rich-text-editor',
    version: '1.0.0',
    description: 'Rich text editor field using TinyMCE'
  },
  
  fieldTypes: [{
    type: 'richtext',
    parser: (content) => {
      const match = content.match(/@(\w+):\s*\[richtext\](.*)/)
      if (!match) return null
      
      const attributes = parseAttributes(match[2])
      
      return {
        name: match[1],
        type: 'richtext',
        label: attributes.label || match[1],
        attributes: {
          toolbar: attributes.toolbar || 'bold italic underline | link image',
          height: attributes.height || 300
        }
      }
    },
    generator: (field) => `
      <div class="richtext-field">
        <label for="${field.name}">${field.label}</label>
        <textarea name="${field.name}" 
                  id="${field.name}"
                  class="richtext-editor"
                  data-toolbar="${field.attributes?.toolbar}"
                  style="height: ${field.attributes?.height}px;">
        </textarea>
      </div>
      <script>
        tinymce.init({
          selector: '#${field.name}',
          toolbar: '${field.attributes?.toolbar}',
          height: ${field.attributes?.height}
        });
      </script>
    `
  }]
}
```

### File Upload Plugin

```typescript
export const fileUploadPlugin: Plugin = {
  metadata: {
    name: 'file-upload',
    version: '1.0.0',
    description: 'Enhanced file upload with drag & drop and previews'
  },
  
  fieldTypes: [{
    type: 'file-upload',
    parser: (content) => {
      const match = content.match(/@(\w+):\s*\[file-upload\](.*)/)
      if (!match) return null
      
      const attributes = parseAttributes(match[2])
      
      return {
        name: match[1],
        type: 'file-upload',
        label: attributes.label || 'Upload Files',
        attributes: {
          accept: attributes.accept || '*/*',
          multiple: attributes.multiple || false,
          maxSize: attributes.maxSize || '10MB',
          preview: attributes.preview !== false
        }
      }
    },
    generator: (field) => `
      <div class="file-upload-field" data-field="${field.name}">
        <label>${field.label}</label>
        <div class="upload-area" 
             ondrop="handleDrop(event, '${field.name}')"
             ondragover="handleDragOver(event)">
          <input type="file" 
                 name="${field.name}" 
                 id="${field.name}"
                 accept="${field.attributes?.accept}"
                 ${field.attributes?.multiple ? 'multiple' : ''}
                 style="display: none;" />
          <div class="upload-prompt">
            <i class="upload-icon"></i>
            <p>Drag files here or <button type="button" onclick="document.getElementById('${field.name}').click()">browse</button></p>
          </div>
        </div>
        ${field.attributes?.preview ? '<div class="file-previews"></div>' : ''}
      </div>
    `
  }]
}
```

## Integration Plugins

### Analytics Plugin

```typescript
export const analyticsPlugin: Plugin = {
  metadata: {
    name: 'google-analytics',
    version: '1.0.0',
    description: 'Google Analytics integration for form tracking'
  },
  
  hooks: [
    {
      name: 'post-generate',
      priority: 1,
      handler: (context) => {
        // Track form render
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_render', {
            form_fields: context.parseResult?.fields.length,
            field_types: context.parseResult?.fields.map(f => f.type)
          })
        }
      }
    },
    {
      name: 'field-validate',
      priority: 1,
      handler: (context) => {
        // Track validation errors
        if (context.field && typeof gtag !== 'undefined') {
          gtag('event', 'form_validation_error', {
            field_name: context.field.name,
            field_type: context.field.type
          })
        }
      }
    }
  ]
}
```

### Translation Plugin

```typescript
export const i18nPlugin: Plugin = {
  metadata: {
    name: 'internationalization',
    version: '1.0.0',
    description: 'Multi-language support for forms'
  },
  
  hooks: [{
    name: 'post-parse',
    priority: 20,
    handler: (context) => {
      if (context.parseResult?.fields) {
        const currentLocale = getCurrentLocale()
        
        context.parseResult.fields.forEach(field => {
          field.label = translate(field.label, currentLocale)
          field.placeholder = field.placeholder ? translate(field.placeholder, currentLocale) : undefined
          field.errorMessage = field.errorMessage ? translate(field.errorMessage, currentLocale) : undefined
        })
      }
    }
  }]
}

function getCurrentLocale(): string {
  return document.documentElement.lang || 'en'
}

function translate(text: string, locale: string): string {
  const translations = {
    'en': {
      'Name': 'Name',
      'Email': 'Email',
      'Submit': 'Submit'
    },
    'ko': {
      'Name': '이름',
      'Email': '이메일',
      'Submit': '제출'
    },
    'es': {
      'Name': 'Nombre',
      'Email': 'Correo electrónico',
      'Submit': 'Enviar'
    }
  }
  
  return translations[locale]?.[text] || text
}
```

## Utility Plugins

### Auto-save Plugin

```typescript
export const autoSavePlugin: Plugin = {
  metadata: {
    name: 'auto-save',
    version: '1.0.0',
    description: 'Automatically saves form data to localStorage'
  },
  
  hooks: [{
    name: 'post-generate',
    priority: 1,
    handler: (context) => {
      if (context.parseResult?.fields) {
        setupAutoSave(context.parseResult.fields)
      }
    }
  }]
}

function setupAutoSave(fields: Field[]): void {
  const formData = loadSavedData()
  
  fields.forEach(field => {
    const element = document.getElementById(field.name)
    if (element) {
      // Restore saved data
      if (formData[field.name]) {
        (element as HTMLInputElement).value = formData[field.name]
      }
      
      // Setup auto-save
      element.addEventListener('input', debounce(() => {
        saveFormData(field.name, (element as HTMLInputElement).value)
      }, 500))
    }
  })
}

function loadSavedData(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('formdown-autosave') || '{}')
  } catch {
    return {}
  }
}

function saveFormData(fieldName: string, value: string): void {
  const data = loadSavedData()
  data[fieldName] = value
  localStorage.setItem('formdown-autosave', JSON.stringify(data))
}

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

### Form Validation Summary Plugin

```typescript
export const validationSummaryPlugin: Plugin = {
  metadata: {
    name: 'validation-summary',
    version: '1.0.0',
    description: 'Shows validation errors in a summary at the top of the form'
  },
  
  hooks: [{
    name: 'post-generate',
    priority: 1,
    handler: (context) => {
      addValidationSummary()
    }
  }]
}

function addValidationSummary(): void {
  const form = document.querySelector('form')
  if (!form) return
  
  const summaryElement = document.createElement('div')
  summaryElement.id = 'validation-summary'
  summaryElement.className = 'validation-summary hidden'
  summaryElement.innerHTML = `
    <h3>Please correct the following errors:</h3>
    <ul class="error-list"></ul>
  `
  
  form.insertBefore(summaryElement, form.firstChild)
  
  // Listen for validation events
  form.addEventListener('invalid', (e) => {
    e.preventDefault()
    updateValidationSummary()
  }, true)
}

function updateValidationSummary(): void {
  const summary = document.getElementById('validation-summary')
  const errorList = summary?.querySelector('.error-list')
  
  if (!summary || !errorList) return
  
  const invalidFields = document.querySelectorAll(':invalid')
  
  if (invalidFields.length === 0) {
    summary.classList.add('hidden')
    return
  }
  
  errorList.innerHTML = ''
  invalidFields.forEach(field => {
    const input = field as HTMLInputElement
    const label = document.querySelector(`label[for="${input.id}"]`)?.textContent || input.name
    
    const li = document.createElement('li')
    li.innerHTML = `<a href="#${input.id}">${label}: ${input.validationMessage}</a>`
    errorList.appendChild(li)
  })
  
  summary.classList.remove('hidden')
  summary.scrollIntoView({ behavior: 'smooth' })
}
```

---

These examples demonstrate the power and flexibility of the Formdown extension system. You can combine multiple plugins to create sophisticated form experiences tailored to your specific needs.
