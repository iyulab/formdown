# Extension Examples

Real-world examples of how to use the Formdown extension system to create powerful, customized form experiences.

## Bootstrap Integration

Create a complete Bootstrap 5 theme integration:

```typescript
import { ExtensionManager } from '@formdown/core'

const bootstrapTheme = {
  metadata: {
    name: 'bootstrap-theme',
    version: '1.0.0',
    description: 'Complete Bootstrap 5 integration'
  },
  hooks: [
    {
      name: 'css-class',
      priority: 10,
      handler: (context) => {
        const typeClasses = {
          'text': 'form-control',
          'email': 'form-control', 
          'password': 'form-control',
          'textarea': 'form-control',
          'select': 'form-select',
          'checkbox': 'form-check-input',
          'radio': 'form-check-input'
        }
        
        context.field.attributes.className = typeClasses[context.field.type] || 'form-control'
        return context
      }
    },
    {
      name: 'template-render',
      priority: 10,
      handler: (context) => {
        if (context.field.type === 'checkbox' || context.field.type === 'radio') {
          context.template = `
            <div class="form-check">
              ${context.template}
              <label class="form-check-label" for="${context.field.name}">
                ${context.field.label}
              </label>
            </div>
          `
        } else {
          context.template = `
            <div class="mb-3">
              <label for="${context.field.name}" class="form-label">${context.field.label}</label>
              ${context.template}
              <div class="invalid-feedback"></div>
            </div>
          `
        }
        return context
      }
    }
  ]
}

// Usage
const extensionManager = new ExtensionManager()
extensionManager.registerPlugin(bootstrapTheme)

const source = `
@name: [text required]
@email: [email required] 
@role{Developer,Designer,Manager}: r[required]
@notifications: [checkbox label="Email updates"]
`

const ast = await parseForm(source, { extensionManager })
const html = await generateHTML(ast, { extensionManager })
```

**Result:** All form fields automatically get Bootstrap classes and proper structure.

## Custom Field Types

### Credit Card Field

Create a specialized credit card input with validation:

```typescript
const creditCardPlugin = {
  metadata: {
    name: 'credit-card-plugin',
    version: '1.0.0'
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
        attributes: {
          pattern: '[0-9\\s]{13,19}',
          inputmode: 'numeric',
          autocomplete: 'cc-number'
        }
      }
    },
    validator: (field, value) => {
      if (!value) return []
      
      // Luhn algorithm validation
      const cleanNumber = value.replace(/\D/g, '')
      if (!isValidLuhn(cleanNumber)) {
        return [{
          type: 'invalid-credit-card',
          message: 'Please enter a valid credit card number'
        }]
      }
      return []
    },
    generator: (field) => `
      <div class="credit-card-field">
        <label for="${field.name}">${field.label}</label>
        <input type="text" 
               name="${field.name}" 
               id="${field.name}"
               pattern="${field.attributes?.pattern}"
               inputmode="${field.attributes?.inputmode}"
               autocomplete="${field.attributes?.autocomplete}"
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

function isValidLuhn(number) {
  let sum = 0
  let alternate = false
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number.charAt(i), 10)
    
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

// Usage in forms
const source = `
# Payment Information

@card_number: [credit-card required]
@expiry: [text pattern="[0-9]{2}/[0-9]{2}" placeholder="MM/YY"]
@cvv: [text pattern="[0-9]{3,4}" placeholder="123"]
`
```

### File Upload with Preview

Create a drag-and-drop file upload field:

```typescript
const fileUploadPlugin = {
  metadata: {
    name: 'file-upload-plugin',
    version: '1.0.0'
  },
  fieldTypes: [{
    type: 'file-upload',
    parser: (content) => {
      const match = content.match(/@(\w+):\s*\[file-upload(?:\s+([^\]]*))?\]/)
      if (!match) return null
      
      const attributes = parseAttributes(match[2] || '')
      
      return {
        name: match[1],
        type: 'file-upload',
        label: attributes.label || 'Upload Files',
        attributes: {
          accept: attributes.accept || '*/*',
          multiple: attributes.multiple !== false,
          maxSize: attributes.maxSize || '10MB'
        }
      }
    },
    generator: (field) => `
      <div class="file-upload-field" data-field="${field.name}">
        <label>${field.label}</label>
        <div class="upload-area" 
             ondrop="handleDrop(event, '${field.name}')"
             ondragover="handleDragOver(event)"
             ondragleave="handleDragLeave(event)">
          <input type="file" 
                 name="${field.name}" 
                 id="${field.name}"
                 accept="${field.attributes?.accept}"
                 ${field.attributes?.multiple ? 'multiple' : ''}
                 style="display: none;"
                 onchange="handleFileSelect(event)" />
          <div class="upload-prompt">
            <svg class="upload-icon" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
            <p>Drag files here or <button type="button" class="browse-btn" onclick="document.getElementById('${field.name}').click()">browse</button></p>
            <small>Max size: ${field.attributes?.maxSize}</small>
          </div>
        </div>
        <div class="file-previews" id="${field.name}-previews"></div>
      </div>
      
      <style>
        .upload-area {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .upload-area:hover,
        .upload-area.drag-over {
          border-color: #007bff;
          background-color: #f8f9fa;
        }
        .upload-icon {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          fill: #6c757d;
        }
        .browse-btn {
          color: #007bff;
          background: none;
          border: none;
          text-decoration: underline;
          cursor: pointer;
        }
        .file-previews {
          margin-top: 16px;
        }
        .file-preview {
          display: flex;
          align-items: center;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .file-preview img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
          margin-right: 12px;
        }
      </style>
      
      <script>
        function handleDrop(event, fieldName) {
          event.preventDefault()
          event.currentTarget.classList.remove('drag-over')
          
          const files = event.dataTransfer.files
          handleFiles(files, fieldName)
        }
        
        function handleDragOver(event) {
          event.preventDefault()
          event.currentTarget.classList.add('drag-over')
        }
        
        function handleDragLeave(event) {
          event.currentTarget.classList.remove('drag-over')
        }
        
        function handleFileSelect(event) {
          const files = event.target.files
          handleFiles(files, event.target.name)
        }
        
        function handleFiles(files, fieldName) {
          const previewContainer = document.getElementById(fieldName + '-previews')
          
          Array.from(files).forEach(file => {
            const preview = document.createElement('div')
            preview.className = 'file-preview'
            
            if (file.type.startsWith('image/')) {
              const img = document.createElement('img')
              img.src = URL.createObjectURL(file)
              img.onload = () => URL.revokeObjectURL(img.src)
              preview.appendChild(img)
            }
            
            const info = document.createElement('div')
            info.innerHTML = \`
              <div><strong>\${file.name}</strong></div>
              <div><small>\${formatFileSize(file.size)}</small></div>
            \`
            preview.appendChild(info)
            
            previewContainer.appendChild(preview)
          })
        }
        
        function formatFileSize(bytes) {
          if (bytes === 0) return '0 Bytes'
          const k = 1024
          const sizes = ['Bytes', 'KB', 'MB', 'GB']
          const i = Math.floor(Math.log(bytes) / Math.log(k))
          return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
        }
      </script>
    `
  }]
}

// Usage
const source = `
# Document Upload

@resume: [file-upload accept=".pdf,.doc,.docx" label="Upload Resume"]
@portfolio: [file-upload accept="image/*" multiple label="Portfolio Images"]
@references: [file-upload accept=".pdf" label="References"]
`
```

## Analytics Integration

Track form interactions with Google Analytics:

```typescript
const analyticsPlugin = {
  metadata: {
    name: 'google-analytics',
    version: '1.0.0'
  },
  hooks: [
    {
      name: 'post-generate',
      handler: (context) => {
        // Track form render
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_render', {
            form_id: context.parseResult.id || 'unknown',
            field_count: context.parseResult.fields.length,
            field_types: context.parseResult.fields.map(f => f.type)
          })
        }
        return context
      }
    },
    {
      name: 'field-validate',
      handler: (context) => {
        // Track validation errors
        if (!context.isValid && typeof gtag !== 'undefined') {
          gtag('event', 'form_validation_error', {
            field_name: context.field.name,
            field_type: context.field.type,
            error_type: 'validation_failed'
          })
        }
        return context
      }
    }
  ],
  initialize: (eventEmitter) => {
    // Track form submissions
    eventEmitter.on('form-submit', (data) => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          form_id: data.formId,
          field_count: data.fieldCount,
          submission_time: Date.now()
        })
      }
    })
    
    // Track field interactions
    eventEmitter.on('field-focus', (data) => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_field_focus', {
          field_name: data.fieldName,
          field_type: data.fieldType
        })
      }
    })
  }
}
```

## Internationalization

Create a complete i18n solution:

```typescript
const i18nPlugin = {
  metadata: {
    name: 'i18n-plugin',
    version: '1.0.0'
  },
  hooks: [{
    name: 'post-parse',
    priority: 20,
    handler: (context) => {
      const locale = getCurrentLocale()
      
      context.parseResult.fields.forEach(field => {
        // Translate labels
        field.label = translate(field.label, locale)
        
        // Translate placeholders
        if (field.placeholder) {
          field.placeholder = translate(field.placeholder, locale)
        }
        
        // Translate options for select/radio/checkbox
        if (field.options) {
          field.options = field.options.map(option => 
            translate(option, locale)
          )
        }
        
        // Translate validation messages
        if (field.errorMessage) {
          field.errorMessage = translate(field.errorMessage, locale)
        }
      })
      
      return context
    }
  }]
}

function getCurrentLocale() {
  return document.documentElement.lang || 
         navigator.language || 
         'en'
}

function translate(text, locale) {
  const translations = {
    'en': {
      'Name': 'Name',
      'Email': 'Email',
      'Submit': 'Submit',
      'Required field': 'Required field'
    },
    'ko': {
      'Name': '이름',
      'Email': '이메일',
      'Submit': '제출',
      'Required field': '필수 항목'
    },
    'es': {
      'Name': 'Nombre',
      'Email': 'Correo electrónico', 
      'Submit': 'Enviar',
      'Required field': 'Campo requerido'
    },
    'fr': {
      'Name': 'Nom',
      'Email': 'E-mail',
      'Submit': 'Soumettre',
      'Required field': 'Champ requis'
    }
  }
  
  return translations[locale]?.[text] || text
}

// Usage
const source = `
@name: [text required placeholder="Enter your name"]
@email: [email required]
@submit: [submit label="Submit"]
`

// Form will be automatically translated based on user's locale
```

## Auto-Save Plugin

Automatically save form data to localStorage:

```typescript
const autoSavePlugin = {
  metadata: {
    name: 'auto-save',
    version: '1.0.0'
  },
  hooks: [{
    name: 'post-generate',
    handler: (context) => {
      // Setup auto-save for all fields
      setupAutoSave(context.parseResult.fields)
      return context
    }
  }]
}

function setupAutoSave(fields) {
  const formData = loadSavedData()
  
  fields.forEach(field => {
    const element = document.getElementById(field.name)
    if (!element) return
    
    // Restore saved data
    if (formData[field.name]) {
      element.value = formData[field.name]
    }
    
    // Setup auto-save on input
    element.addEventListener('input', debounce(() => {
      saveFormData(field.name, element.value)
    }, 500))
    
    // Save on change for select/radio/checkbox
    element.addEventListener('change', () => {
      saveFormData(field.name, element.value)
    })
  })
  
  // Clear saved data on successful submit
  const form = document.querySelector('form')
  if (form) {
    form.addEventListener('submit', () => {
      clearSavedData()
    })
  }
}

function loadSavedData() {
  try {
    return JSON.parse(localStorage.getItem('formdown-autosave') || '{}')
  } catch {
    return {}
  }
}

function saveFormData(fieldName, value) {
  const data = loadSavedData()
  data[fieldName] = value
  data._timestamp = Date.now()
  localStorage.setItem('formdown-autosave', JSON.stringify(data))
}

function clearSavedData() {
  localStorage.removeItem('formdown-autosave')
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

## Combining Multiple Plugins

Real-world forms often need multiple plugins working together:

```typescript
const extensionManager = new ExtensionManager()

// Register all plugins
extensionManager.registerPlugin(bootstrapTheme)
extensionManager.registerPlugin(creditCardPlugin)
extensionManager.registerPlugin(fileUploadPlugin)
extensionManager.registerPlugin(analyticsPlugin)
extensionManager.registerPlugin(i18nPlugin)
extensionManager.registerPlugin(autoSavePlugin)

// Create a comprehensive form
const source = `
# Complete Registration Form

## Personal Information

@name: [text required placeholder="Full Name"]
@email: [email required]
@phone: [tel placeholder="Phone Number"]

## Payment Details

@card_number: [credit-card required]
@expiry: [text pattern="[0-9]{2}/[0-9]{2}" placeholder="MM/YY" required]
@cvv: [text pattern="[0-9]{3,4}" placeholder="CVV" required]

## Documents

@id_document: [file-upload accept="image/*,.pdf" label="ID Document"]
@proof_address: [file-upload accept=".pdf,image/*" label="Proof of Address"]

## Preferences

@language{English,Español,Français,한국어,*(Other Language)}: s[required]
@notifications{Email,SMS,Push,*(Contact Method)}: c[]

@submit: [submit label="Complete Registration"]
`

const ast = await parseForm(source, { extensionManager })
const html = await generateHTML(ast, { extensionManager })
```

**Result:** A fully-featured form with:
- Bootstrap styling
- Custom credit card validation
- Drag-and-drop file uploads
- Analytics tracking
- Multi-language support
- Auto-save functionality
- All working together seamlessly

## Testing Your Plugins

```typescript
import { ExtensionManager, createTestContext } from '@formdown/core'

describe('Bootstrap Theme Plugin', () => {
  let extensionManager

  beforeEach(() => {
    extensionManager = new ExtensionManager()
    extensionManager.registerPlugin(bootstrapTheme)
  })

  test('should add Bootstrap classes to text fields', async () => {
    const context = createTestContext('css-class', {
      field: { name: 'test', type: 'text', label: 'Test' }
    })

    const result = await extensionManager.executeHooks('css-class', context)
    
    expect(result.field.attributes.className).toBe('form-control')
  })

  test('should wrap fields in Bootstrap structure', async () => {
    const context = createTestContext('template-render', {
      field: { name: 'test', type: 'text', label: 'Test' },
      template: '<input type="text" name="test">'
    })

    const result = await extensionManager.executeHooks('template-render', context)
    
    expect(result.template).toContain('mb-3')
    expect(result.template).toContain('form-label')
  })
})
```

These examples show the power and flexibility of the Formdown extension system. You can create sophisticated, customized form experiences while maintaining clean, readable code.
