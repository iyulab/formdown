/**
 * Phase 1 Core Module Tests
 * Tests for the new FieldProcessor, DOMBinder, ValidationManager, and EventOrchestrator
 */

import { 
  FieldProcessor, 
  DOMBinder, 
  ValidationManager, 
  EventOrchestrator, 
  FormManager 
} from '../src/index.js'

describe('Phase 1 Core Modules', () => {
  describe('FieldProcessor', () => {
    let processor: FieldProcessor

    beforeEach(() => {
      processor = new FieldProcessor()
    })

    test('should process checkbox groups correctly', () => {
      const mockContainer = {
        querySelectorAll: (selector: string) => {
          if (selector.includes('checkbox')) {
            return [
              { 
                name: 'interests', 
                value: 'sports', 
                checked: true, 
                id: 'interests_0',
                type: 'checkbox',
                hasAttribute: () => false,
                getAttribute: () => null
              },
              { 
                name: 'interests', 
                value: 'music', 
                checked: false, 
                id: 'interests_1',
                type: 'checkbox',
                hasAttribute: () => false,
                getAttribute: () => null
              },
              { 
                name: 'interests', 
                value: 'travel', 
                checked: true, 
                id: 'interests_2',
                type: 'checkbox',
                hasAttribute: () => false,
                getAttribute: () => null
              }
            ]
          }
          return []
        },
        querySelector: () => null
      }

      const result = processor.processCheckboxGroup('interests', mockContainer)
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(['sports', 'travel'])
    })

    test('should process single checkbox correctly', () => {
      const mockContainer = {
        querySelectorAll: (selector: string) => {
          if (selector.includes('checkbox')) {
            return [{ 
              name: 'newsletter', 
              value: 'true', 
              checked: true, 
              id: 'newsletter',
              type: 'checkbox',
              hasAttribute: () => false,
              getAttribute: () => null
            }]
          }
          return []
        },
        querySelector: () => null
      }

      const result = processor.processCheckboxGroup('newsletter', mockContainer)
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(true)
    })

    test('should process radio groups correctly', () => {
      const mockContainer = {
        querySelectorAll: (selector: string) => {
          if (selector.includes('radio')) {
            return [
              { 
                name: 'gender', 
                value: 'male', 
                checked: false, 
                id: 'gender_0',
                type: 'radio',
                hasAttribute: () => false,
                getAttribute: () => null
              },
              { 
                name: 'gender', 
                value: 'female', 
                checked: true, 
                id: 'gender_1',
                type: 'radio',
                hasAttribute: () => false,
                getAttribute: () => null
              }
            ]
          }
          return []
        },
        querySelector: () => null
      }

      const result = processor.processRadioGroup('gender', mockContainer)
      
      expect(result.success).toBe(true)
      expect(result.value).toBe('female')
    })

    test('should validate field values correctly', () => {
      const result = processor.validateFieldValue('test@example.com', 'email')
      
      expect(result.success).toBe(true)
      expect(result.value).toBe('test@example.com')
    })

    test('should validate required fields', () => {
      const result = processor.validateFieldValue('', 'text', { required: true })
      
      expect(result.success).toBe(false)
      expect(result.errors).toContain('This field is required')
    })

    test('should validate email format', () => {
      const result = processor.validateFieldValue('invalid-email', 'email')
      
      expect(result.success).toBe(false)
      expect(result.errors).toContain('Please enter a valid email address')
    })
  })

  describe('DOMBinder', () => {
    let binder: DOMBinder

    beforeEach(() => {
      binder = new DOMBinder()
    })

    test('should create field bindings', () => {
      const mockElement = {
        id: 'test-field',
        name: 'test',
        value: 'test-value',
        type: 'text',
        hasAttribute: () => false,
        getAttribute: () => null
      }

      const mockContainer = {
        querySelector: () => null,
        querySelectorAll: () => []
      }

      const binding = binder.bindFieldToElement('test', mockElement, mockContainer)
      
      expect(binding.fieldName).toBe('test')
      expect(binding.elements.has(mockElement)).toBe(true)
    })

    test('should sync form data', () => {
      const mockContainer = {
        querySelector: () => null,
        querySelectorAll: () => []
      }

      const formData = { name: 'John', email: 'john@example.com' }
      
      // Should not throw an error
      expect(() => {
        binder.syncFormData(formData, mockContainer)
      }).not.toThrow()
    })

    test('should get registered fields', () => {
      const mockElement = {
        id: 'test-field',
        name: 'test',
        value: 'test-value',
        type: 'text',
        hasAttribute: () => false,
        getAttribute: () => null
      }

      const mockContainer = {
        querySelector: () => null,
        querySelectorAll: () => []
      }

      binder.bindFieldToElement('test', mockElement, mockContainer)
      
      const fields = binder.getRegisteredFields()
      expect(fields).toContain('test')
    })
  })

  describe('ValidationManager', () => {
    let validator: ValidationManager

    beforeEach(() => {
      validator = new ValidationManager()
    })

    test('should register custom validators', () => {
      const customValidator = (value: any) => value === 'valid' || 'Value must be "valid"'
      
      validator.registerCustomValidator('custom-test', customValidator)
      
      // Should not throw an error
      expect(() => {
        validator.registerCustomValidator('custom-test', customValidator)
      }).not.toThrow()
    })

    test('should create validation pipelines', () => {
      const rules = [
        {
          name: 'required',
          validator: (value: any) => Boolean(value) || 'Field is required'
        }
      ]

      const pipeline = validator.createValidationPipeline(rules)
      
      expect(pipeline.rules).toHaveLength(1)
      expect(pipeline.executeOrder).toBe('fail-fast')
    })

    test('should validate async', async () => {
      const fieldContext = {
        fieldName: 'test',
        fieldType: 'text' as const,
        constraints: { required: true },
        schema: { name: 'test', type: 'text' }
      }

      const result = await validator.validateAsync(fieldContext, 'test-value', {})
      
      expect(result.isValid).toBeDefined()
      expect(Array.isArray(result.errors)).toBe(true)
    })
  })

  describe('EventOrchestrator', () => {
    let orchestrator: EventOrchestrator

    beforeEach(() => {
      orchestrator = new EventOrchestrator()
    })

    test('should create event buses', () => {
      const eventBus = orchestrator.createEventBus('test-bus')
      
      expect(eventBus).toBeDefined()
      expect(typeof eventBus.emit).toBe('function')
      expect(typeof eventBus.on).toBe('function')
      expect(typeof eventBus.off).toBe('function')
    })

    test('should handle event emission and listening', () => {
      const eventBus = orchestrator.createEventBus('test-bus')
      let receivedData: any = null

      const unsubscribe = eventBus.on('test-event', (data) => {
        receivedData = data
      })

      eventBus.emit('test-event', { message: 'hello' })
      
      expect(receivedData).toEqual({ message: 'hello' })
      
      // Test unsubscribe
      receivedData = null
      unsubscribe()
      eventBus.emit('test-event', { message: 'should not receive' })
      
      expect(receivedData).toBeNull()
    })

    test('should bridge component events', () => {
      const sourceComponent = {
        id: 'source',
        type: 'core' as const,
        eventHandlers: new Map(),
        emit: function(event: string, data?: any) {
          const handlers = this.eventHandlers.get(event) || []
          handlers.forEach((handler: any) => handler(data))
        },
        on: function(event: string, handler: any) {
          if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, [])
          }
          this.eventHandlers.get(event)!.push(handler)
          return () => {
            const handlers = this.eventHandlers.get(event) || []
            const index = handlers.indexOf(handler)
            if (index > -1) handlers.splice(index, 1)
          }
        }
      }

      const targetComponent = {
        id: 'target',
        type: 'ui' as const,
        receivedEvents: [] as any[],
        emit: function(event: string, data?: any) {
          this.receivedEvents.push({ event, data })
        },
        on: () => () => {}
      }

      const mappings = [
        {
          sourceEvent: 'test-source',
          targetEvent: 'test-target'
        }
      ]

      const bridgeId = orchestrator.bridgeComponentEvents(sourceComponent, targetComponent, mappings)
      
      expect(typeof bridgeId).toBe('string')
      expect(bridgeId).toContain('source_to_target')
    })

    test('should get event statistics', () => {
      orchestrator.createEventBus('test1')
      orchestrator.createEventBus('test2')
      
      const stats = orchestrator.getEventStats()
      
      expect(stats.totalEventBuses).toBeGreaterThan(0)
      expect(stats.totalBridges).toBeGreaterThanOrEqual(0)
      expect(stats.activeBridges).toBeGreaterThanOrEqual(0)
    })
  })

  describe('FormManager Integration', () => {
    let formManager: FormManager

    beforeEach(() => {
      formManager = new FormManager()
    })

    test('should create Core modules through FormManager', () => {
      const fieldProcessor = formManager.createFieldProcessor()
      const domBinder = formManager.createDOMBinder()
      const validationManager = formManager.createValidationManager()
      const eventOrchestrator = formManager.createEventOrchestrator()
      
      expect(fieldProcessor).toBeInstanceOf(FieldProcessor)
      expect(domBinder).toBeInstanceOf(DOMBinder)
      expect(validationManager).toBeInstanceOf(ValidationManager)
      expect(eventOrchestrator).toBeInstanceOf(EventOrchestrator)
    })

    test('should get all Core modules', () => {
      // Create modules first
      formManager.createFieldProcessor()
      formManager.createDOMBinder()
      formManager.createValidationManager()
      formManager.createEventOrchestrator()

      const modules = formManager.getCoreModules()
      
      expect(modules.fieldProcessor).toBeInstanceOf(FieldProcessor)
      expect(modules.domBinder).toBeInstanceOf(DOMBinder)
      expect(modules.validationManager).toBeInstanceOf(ValidationManager)
      expect(modules.eventOrchestrator).toBeInstanceOf(EventOrchestrator)
    })

    test('should render to template format', () => {
      const content = `
# Contact Form

@name: [text required]
@email: [email required]
`
      formManager.parse(content)
      
      const template = formManager.renderToTemplate()
      
      expect(template.fields).toBeDefined()
      expect(template.formDeclarations).toBeDefined()
      expect(template.schema).toBeDefined()
      expect(template.data).toBeDefined()
      expect(template.html).toBeDefined()
    })

    test('should create preview templates', () => {
      const content = `
# Test Form

@name: [text required]
@email: [email]
`
      
      const preview = formManager.createPreviewTemplate(content)
      
      expect(preview.html).toBeDefined()
      expect(Array.isArray(preview.errors)).toBe(true)
      expect(preview.schema).toBeDefined()
      expect(Array.isArray(preview.fields)).toBe(true)
    })

    test('should dispose properly', () => {
      // Create all modules
      formManager.createFieldProcessor()
      formManager.createDOMBinder()
      formManager.createValidationManager()
      formManager.createEventOrchestrator()

      // Should not throw
      expect(() => {
        formManager.dispose()
      }).not.toThrow()

      // Modules should be null after dispose
      const modules = formManager.getCoreModules()
      expect(modules.fieldProcessor).toBeNull()
      expect(modules.domBinder).toBeNull()
      expect(modules.validationManager).toBeNull()
      expect(modules.eventOrchestrator).toBeNull()
    })
  })
})