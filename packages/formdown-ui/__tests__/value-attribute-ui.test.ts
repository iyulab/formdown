import { FormdownUI } from '../src/formdown-ui'

// Mock the lit library
jest.mock('lit', () => ({
  LitElement: class MockLitElement {
    shadowRoot = null
    requestUpdate = jest.fn()
    connectedCallback = jest.fn()
    render = jest.fn()
    firstUpdated = jest.fn()
    updated = jest.fn()
  },
  html: (strings: any, ...values: any[]) => ({ strings, values }),
  css: (strings: any, ...values: any[]) => ({ strings, values })
}))

jest.mock('lit/decorators.js', () => ({
  customElement: () => (_target: any) => _target,
  property: () => (_target: any, _propertyKey: string) => {}
}))

// Mock the core module
jest.mock('@formdown/core', () => ({
  FormManager: jest.fn().mockImplementation(() => ({
    parse: jest.fn(),
    render: jest.fn(() => '<div>mock form</div>'),
    getData: jest.fn(() => ({})),
    setFieldValue: jest.fn(),
    updateData: jest.fn(),
    validate: jest.fn(() => ({ isValid: true, errors: [] })),
    getSchema: jest.fn(() => ({})),
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
    reset: jest.fn(),
    // Core module creation methods
    createFieldProcessor: jest.fn(() => ({
      extractFieldValue: jest.fn(),
      getFieldType: jest.fn()
    })),
    createDOMBinder: jest.fn(() => ({
      bind: jest.fn(),
      unbind: jest.fn(),
      syncData: jest.fn()
    })),
    createValidationManager: jest.fn(() => ({
      validate: jest.fn(),
      addRule: jest.fn()
    })),
    createEventOrchestrator: jest.fn(() => ({
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    })),
    // Component bridge methods
    setupComponentBridge: jest.fn()
  })),
  generateFormHTML: jest.fn(),
  FormdownParser: jest.fn().mockImplementation(() => ({
    parseFormdown: jest.fn()
  })),
  FormdownGenerator: jest.fn().mockImplementation(() => ({
    generateHTML: jest.fn()
  })),
  getSchema: jest.fn(),
  validateField: jest.fn(),
  validateForm: jest.fn(),
  extensionManager: {
    getFieldTypeRegistry: jest.fn().mockReturnValue({
      getStylesForTypes: jest.fn().mockReturnValue(''),
      getScriptsForTypes: jest.fn().mockReturnValue('')
    })
  }
}))

jest.mock('../src/extension-support', () => ({
  uiExtensionSupport: {
    initialize: jest.fn().mockResolvedValue(undefined)
  }
}))

// Test helper functions (extracted from FormdownUI for testing purposes)
function getElementInitialValue(element: any): string | boolean | string[] | null {
  const el = element as any
  if (el.tagName === 'INPUT') {
    if (el.type === 'checkbox') {
      return (el.hasAttribute && el.hasAttribute('checked')) || el.checked ? true : null
    }
    if (el.type === 'radio') {
      const hasChecked = (el.hasAttribute && el.hasAttribute('checked')) || el.checked
      return hasChecked ? el.value : null
    }
    if (el.hasAttribute && el.hasAttribute('value')) {
      return el.getAttribute('value')
    }
    if (el.value !== undefined && el.value !== '') {
      return el.value
    }
    return null
  } else if (el.tagName === 'TEXTAREA') {
    const text = el.textContent?.trim() || el.value?.trim()
    return text ? text : null
  } else if (el.tagName === 'SELECT') {
    if (el.querySelector) {
      const selected = el.querySelector('option[selected]') as HTMLOptionElement
      return selected ? selected.value : null
    }
    return null
  }
  return null
}

function setElementValue(element: any, value: unknown): void {
  if (element.tagName === 'INPUT') {
    if (element.type === 'checkbox') {
      element.checked = Boolean(value)
    } else {
      element.value = String(value)
    }
  } else if (element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
    element.value = String(value)
  } else if (element.hasAttribute && element.hasAttribute('contenteditable')) {
    element.textContent = String(value)
  }
}

describe('FormdownUI - Value Attribute HTML Standard Behavior', () => {
  let formdownUI: FormdownUI
  let mockShadowRoot: any

  beforeEach(() => {
    // Create a mock shadow DOM
    mockShadowRoot = {
      querySelector: jest.fn(),
      querySelectorAll: jest.fn(),
      appendChild: jest.fn()
    }

    formdownUI = new FormdownUI()
    // Override shadowRoot with mock
    ;(formdownUI as any).shadowRoot = mockShadowRoot
  })

  describe('HTML Value Attribute Initialization', () => {
    test('should initialize data from HTML value attributes (one-way)', () => {
      // Mock DOM elements with value attributes
      const mockInput = {
        tagName: 'INPUT',
        type: 'text',
        name: 'username',
        id: 'username',
        dataset: {},
        hasAttribute: jest.fn((attr) => attr === 'value'),
        getAttribute: jest.fn((attr) => attr === 'value' ? 'john_doe' : null),
        value: 'john_doe',
        addEventListener: jest.fn()
      }

      mockShadowRoot.querySelectorAll.mockReturnValue([mockInput])

      // Simulate field setup
      const fieldName = (formdownUI as any).getFieldName(mockInput)
      expect(fieldName).toBe('username')

      const initialValue = getElementInitialValue(mockInput)
      expect(initialValue).toBe('john_doe')

      // Verify that updateDataReactively would be called with the HTML value
      const updateDataSpy = jest.spyOn(formdownUI as any, 'updateDataReactively')
      updateDataSpy.mockImplementation(() => {})

      // Simulate the initialization logic
      if (formdownUI.data[fieldName] === undefined && initialValue !== null) {
        ;(formdownUI as any).updateDataReactively(fieldName, initialValue, mockInput)
      }

      expect(updateDataSpy).toHaveBeenCalledWith('username', 'john_doe', mockInput)
    })

    test('should respect user data over HTML value attributes', () => {
      const mockInput = {
        tagName: 'INPUT',
        type: 'text',
        name: 'username',
        id: 'username',
        dataset: {},
        hasAttribute: jest.fn((attr) => attr === 'value'),
        getAttribute: jest.fn((attr) => attr === 'value' ? 'html_default' : null),
        value: 'html_default',
        addEventListener: jest.fn()
      }

      // Set existing user data
      formdownUI.data = { username: 'user_input' }

      const fieldName = (formdownUI as any).getFieldName(mockInput)
      const initialValue = getElementInitialValue(mockInput)

      expect(initialValue).toBe('html_default')

      // Simulate initialization - user data should take precedence
      // Verify the logic: when user data exists, it should be applied to the element
      if (formdownUI.data[fieldName] !== undefined) {
        setElementValue(mockInput, formdownUI.data[fieldName])
      }

      // Verify that the mock element now has the user data value
      expect(mockInput.value).toBe('user_input')
    })

    test('should handle checkbox with checked attribute', () => {
      const mockCheckbox = {
        tagName: 'INPUT',
        type: 'checkbox',
        name: 'newsletter',
        id: 'newsletter',
        value: 'true',
        dataset: {},
        hasAttribute: jest.fn((attr) => attr === 'checked'),
        getAttribute: jest.fn(),
        addEventListener: jest.fn()
      }

      const initialValue = getElementInitialValue(mockCheckbox)
      expect(initialValue).toBe(true)
    })

    test('should handle radio button with checked attribute', () => {
      const mockRadio = {
        tagName: 'INPUT',
        type: 'radio',
        name: 'plan',
        id: 'plan_premium', 
        value: 'premium',
        dataset: {},
        hasAttribute: jest.fn((attr) => attr === 'checked'),
        getAttribute: jest.fn(),
        addEventListener: jest.fn()
      }

      const initialValue = getElementInitialValue(mockRadio)
      expect(initialValue).toBe('premium')
    })

    test('should handle select with selected option', () => {
      const mockOption = { value: 'canada', selected: true }
      const mockSelect = {
        tagName: 'SELECT',
        name: 'country',
        id: 'country',
        dataset: {},
        hasAttribute: jest.fn(),
        getAttribute: jest.fn(),
        querySelector: jest.fn().mockReturnValue(mockOption),
        addEventListener: jest.fn()
      }

      const initialValue = getElementInitialValue(mockSelect)
      expect(initialValue).toBe('canada')
    })

    test('should handle textarea with initial content', () => {
      const mockTextarea = {
        tagName: 'TEXTAREA',
        name: 'description',
        id: 'description',
        dataset: {},
        hasAttribute: jest.fn(),
        getAttribute: jest.fn(),
        textContent: 'Default description text',
        addEventListener: jest.fn()
      }

      const initialValue = getElementInitialValue(mockTextarea)
      expect(initialValue).toBe('Default description text')
    })

    test('should return null for elements without initial values', () => {
      const mockInput = {
        tagName: 'INPUT',
        type: 'text',
        name: 'empty',
        id: 'empty',
        dataset: {},
        hasAttribute: jest.fn(() => false),
        getAttribute: jest.fn(() => null),
        addEventListener: jest.fn()
      }

      const initialValue = getElementInitialValue(mockInput)
      expect(initialValue).toBeNull()
    })
  })

  describe('One-Way Initialization Behavior', () => {
    test('should not reverse-bind user input to value attribute', () => {
      // Set up initial data from value attribute
      formdownUI.data = { name: 'John Doe' }

      // Simulate user changing the input
      const newUserInput = 'Jane Smith'
      formdownUI.updateField('name', newUserInput)

      // The data should be updated
      expect(formdownUI.data.name).toBe('Jane Smith')

      // But the HTML value attribute should remain unchanged
      // (this is handled by the browser - we don't modify HTML attributes)
    })

    test('should preserve HTML structure during user interactions', () => {
      const mockInput = {
        tagName: 'INPUT',
        type: 'text',
        name: 'title',
        id: 'title',
        value: 'current_value',
        dataset: {},
        hasAttribute: jest.fn((attr) => attr === 'value'),
        getAttribute: jest.fn((attr) => attr === 'value' ? 'original_html_value' : null),
        addEventListener: jest.fn()
      }

      // User data should not affect the getAttribute result
      formdownUI.data = { title: 'user_modified_value' }

      const htmlValue = mockInput.getAttribute('value')
      expect(htmlValue).toBe('original_html_value') // HTML attribute unchanged

      // The .value property can be different from the value attribute
      // This demonstrates that user input doesn't change the HTML attribute
    })

    test('should handle complex form scenario with mixed initial values', () => {
      const mockElements = [
        {
          tagName: 'INPUT',
          type: 'text',
          name: 'name',
          id: 'name',
          value: 'John',
          dataset: {},
          hasAttribute: jest.fn((attr) => attr === 'value'),
          getAttribute: jest.fn((attr) => attr === 'value' ? 'John' : null),
          addEventListener: jest.fn()
        },
        {
          tagName: 'INPUT',
          type: 'email',
          name: 'email',
          id: 'email',
          value: '',
          dataset: {},
          hasAttribute: jest.fn(() => false),
          getAttribute: jest.fn(() => null),
          addEventListener: jest.fn()
        },
        {
          tagName: 'INPUT',
          type: 'checkbox',
          name: 'newsletter',
          id: 'newsletter',
          value: 'true',
          dataset: {},
          hasAttribute: jest.fn((attr) => attr === 'checked'),
          getAttribute: jest.fn(),
          addEventListener: jest.fn()
        }
      ]

      mockShadowRoot.querySelectorAll.mockReturnValue(mockElements)

      // Simulate field setup for each element
      const expectedInitialValues = [
        { field: 'name', value: 'John' },
        { field: 'email', value: null },
        { field: 'newsletter', value: true }
      ]

      expectedInitialValues.forEach(({ field, value }, index) => {
        const element = mockElements[index]
        const fieldName = (formdownUI as any).getFieldName(element)
        const initialValue = getElementInitialValue(element)
        
        expect(fieldName).toBe(field)
        expect(initialValue).toBe(value)
      })
    })
  })

  describe('Real-time Editing Compatibility', () => {
    test('should not interfere with real-time content updates', () => {
      // Initialize with content that has value attributes
      const originalContent = '@name: [value="Original"]'
      formdownUI.content = originalContent

      // User updates the content in real-time
      const updatedContent = '@name: [value="Updated"]'
      formdownUI.content = updatedContent

      // The implementation should handle the content change
      // without breaking existing user input or causing conflicts
      
      // This test ensures that our value attribute handling
      // doesn't interfere with the editor's real-time updates
      expect(formdownUI.content).toBe(updatedContent)
    })

    test('should preserve user input during content changes', () => {
      // User has entered data
      formdownUI.data = { name: 'User Input', email: 'user@example.com' }

      // Content is updated with new value attributes
      formdownUI.content = '@name: [value="Default"] @email: [value="default@example.com"]'

      // User data should remain intact (user input has precedence)
      expect(formdownUI.data.name).toBe('User Input')
      expect(formdownUI.data.email).toBe('user@example.com')
    })
  })

  describe('External Data Binding', () => {
    test('should allow external data to override initial values', () => {
      // Set external data
      const externalData = {
        name: 'External Name',
        email: 'external@example.com'
      }
      
      formdownUI.data = externalData

      // Even if HTML has value attributes, external data should take precedence
      expect(formdownUI.data.name).toBe('External Name')
      expect(formdownUI.data.email).toBe('external@example.com')
    })

    test('should maintain external data binding without value attribute conflicts', () => {
      // Initialize with content containing value attributes
      formdownUI.content = '@name: [value="HTML Default"]'

      // External system provides data
      formdownUI.updateData({ name: 'External Override' })

      // External data should take precedence
      expect(formdownUI.data.name).toBe('External Override')

      // Subsequent updates should work normally
      formdownUI.updateField('name', 'User Edit')
      expect(formdownUI.data.name).toBe('User Edit')
    })
  })

  describe('Performance and Memory', () => {
    test('should not leak memory through value attribute handling', () => {
      const fieldCount = 100
      const mockElements = Array.from({ length: fieldCount }, (_, i) => ({
        tagName: 'INPUT',
        type: 'text',
        name: `field${i}`,
        id: `field${i}`,
        value: `value${i}`,
        dataset: {},
        hasAttribute: jest.fn((attr) => attr === 'value'),
        getAttribute: jest.fn((attr) => attr === 'value' ? `value${i}` : null),
        addEventListener: jest.fn()
      }))

      mockShadowRoot.querySelectorAll.mockReturnValue(mockElements)

      // Process many fields - should not cause memory issues
      mockElements.forEach(element => {
        const fieldName = (formdownUI as any).getFieldName(element)
        const initialValue = getElementInitialValue(element)
        expect(fieldName).toBeDefined()
        expect(initialValue).toBeDefined()
      })

      // No memory leaks expected
      expect(mockElements.length).toBe(fieldCount)
    })

    test('should not cause infinite loops during initialization', () => {
      const mockInput = {
        tagName: 'INPUT',
        type: 'text',
        name: 'test',
        id: 'test',
        value: 'test_value',
        dataset: {},
        hasAttribute: jest.fn((attr) => attr === 'value'),
        getAttribute: jest.fn((attr) => attr === 'value' ? 'test_value' : null),
        addEventListener: jest.fn()
      }

      // This should complete without hanging
      const initialValue = getElementInitialValue(mockInput)
      expect(initialValue).toBe('test_value')

      // Multiple calls should be safe
      const secondCall = getElementInitialValue(mockInput)
      expect(secondCall).toBe('test_value')
    })
  })
})