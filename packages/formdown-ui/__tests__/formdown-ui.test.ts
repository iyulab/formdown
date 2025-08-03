/**
 * Simple unit tests for FormdownUI component with real-time data features
 */

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
    // Phase 1 Core module creation methods
    createFieldProcessor: jest.fn(() => ({
      processCheckboxGroup: jest.fn(() => ({ success: true, value: [] })),
      processRadioGroup: jest.fn(() => ({ success: true, value: null })),
      validateFieldValue: jest.fn(() => ({ success: true, value: '', errors: [] })),
      getFieldType: jest.fn(() => 'text'),
      extractFieldValue: jest.fn(() => ''),
      setFieldValue: jest.fn(() => true)
    })),
    createDOMBinder: jest.fn(() => ({
      bindFieldToElement: jest.fn(() => ({ fieldName: 'test', elements: new Set(), unbind: jest.fn() })),
      syncFormData: jest.fn(),
      getRegisteredFields: jest.fn(() => []),
      setupElementEventHandlers: jest.fn()
    })),
    createValidationManager: jest.fn(() => ({
      registerCustomValidator: jest.fn(),
      createValidationPipeline: jest.fn(() => ({ rules: [], executeOrder: 'fail-fast' })),
      validateAsync: jest.fn(() => Promise.resolve({ isValid: true, errors: [], warnings: [] }))
    })),
    createEventOrchestrator: jest.fn(() => ({
      createEventBus: jest.fn(() => ({ emit: jest.fn(), on: jest.fn(), off: jest.fn() })),
      bridgeComponentEvents: jest.fn(() => 'mock-bridge-id'),
      getEventStats: jest.fn(() => ({ totalEventBuses: 0, totalBridges: 0, activeBridges: 0 }))
    })),
    // Phase 1 additional methods
    processFieldValue: jest.fn(() => ({ success: true, value: '' })),
    validateFieldWithPipeline: jest.fn(() => Promise.resolve({ isValid: true, errors: [] })),
    setupComponentBridge: jest.fn(() => 'mock-bridge-id'),
    renderToTemplate: jest.fn(() => ({ fields: [], formDeclarations: [], schema: {}, data: {}, html: '<div>Mock template</div>' })),
    handleUIEvent: jest.fn(),
    createPreviewTemplate: jest.fn(() => ({ html: '<div>Mock preview</div>', errors: [], schema: {}, fields: [] })),
    getCoreModules: jest.fn(() => ({ fieldProcessor: null, domBinder: null, validationManager: null, eventOrchestrator: null })),
    dispose: jest.fn()
  })),
  FieldProcessor: jest.fn(),
  DOMBinder: jest.fn(),
  ValidationManager: jest.fn(),
  EventOrchestrator: jest.fn(),
  extensionManager: {
    initialize: jest.fn(),
    getPlugin: jest.fn(),
    executeHook: jest.fn(),
    getFieldTypeRegistry: jest.fn().mockReturnValue({
      getStylesForTypes: jest.fn().mockReturnValue(''),
      getScriptsForTypes: jest.fn().mockReturnValue('')
    })
  }
}))

// Mock lit
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

describe('FormdownUI Module', () => {
    it('should be importable', async () => {
        const module = await import('../src/index');
        expect(module.FormdownUI).toBeDefined();
    });

    it('should have a FormdownUI class', async () => {
        const { FormdownUI } = await import('../src/index');
        expect(typeof FormdownUI).toBe('function');
    });

    it('should be a constructor function', async () => {
        const { FormdownUI } = await import('../src/index');
        expect(FormdownUI.prototype).toBeDefined();
    });
});

describe('Basic Component Properties', () => {
    let FormdownUI: any;
    let component: any;

    beforeAll(async () => {
        const module = await import('../src/index');
        FormdownUI = module.FormdownUI;
    });

    beforeEach(() => {
        component = new FormdownUI();
    });

    it('should create an instance', () => {
        expect(component).toBeInstanceOf(FormdownUI);
    });

    it('should have content property', () => {
        expect(component.content).toBeDefined();
        expect(typeof component.content).toBe('string');
    });

    it('should allow setting content property', () => {
        const testContent = 'Test content';
        component.content = testContent;
        expect(component.content).toBe(testContent);
    });

    it('should have getFormData method', () => {
        expect(typeof component.getFormData).toBe('function');
    });
});

describe('Universal Field Synchronization', () => {
    let FormdownUI: any;
    let component: any;

    beforeAll(async () => {
        const module = await import('../src/index');
        FormdownUI = module.FormdownUI;
    });

    beforeEach(() => {
        component = new FormdownUI();
    });

    it('should have syncFieldValue method', () => {
        expect(typeof (component as any).syncFieldValue).toBe('function');
    });

    it('should have universal field helper methods', () => {
        expect(typeof (component as any).getFieldName).toBe('function');
        expect(typeof (component as any).getFieldValue).toBe('function');
        expect(typeof (component as any).setElementValue).toBe('function');
        expect(typeof (component as any).registerField).toBe('function');
    });

    it('should dispatch events when syncFieldValue is called', () => {
        const mockDispatchEvent = jest.fn();
        component.dispatchEvent = mockDispatchEvent;

        (component as any).syncFieldValue('testField', 'testValue');

        // Should dispatch two events: formdown-change and formdown-data-update
        expect(mockDispatchEvent).toHaveBeenCalledTimes(2);
    });

    it('should create custom events with correct structure', () => {
        const events: any[] = [];
        component.dispatchEvent = (event: any) => {
            events.push(event);
        };

        (component as any).updateFormData('testField', 'testValue');

        expect(events).toHaveLength(2);

        // Check formdown-change event
        const changeEvent = events.find(e => e.type === 'formdown-change');
        expect(changeEvent).toBeDefined();
        expect(changeEvent.detail).toHaveProperty('fieldName', 'testField');
        expect(changeEvent.detail).toHaveProperty('value', 'testValue');
        expect(changeEvent.detail).toHaveProperty('formData');

        // Check formdown-data-update event
        const updateEvent = events.find(e => e.type === 'formdown-data-update');
        expect(updateEvent).toBeDefined();
        expect(updateEvent.detail).toHaveProperty('formData');
    });
});

describe('Form Data Collection', () => {
    let FormdownUI: any;
    let component: any;

    beforeAll(async () => {
        const module = await import('../src/index');
        FormdownUI = module.FormdownUI;
    });

    beforeEach(() => {
        component = new FormdownUI();
    });

    it('should return empty object when no shadow root exists', () => {
        const formData = component.getFormData();
        expect(formData).toEqual({});
    });

    it('should handle missing form elements gracefully', () => {
        // Mock shadowRoot with no form
        Object.defineProperty(component, 'shadowRoot', {
            get: () => ({
                querySelector: () => null
            }),
            configurable: true
        });

        const formData = component.getFormData();
        expect(formData).toEqual({});
    });
});
