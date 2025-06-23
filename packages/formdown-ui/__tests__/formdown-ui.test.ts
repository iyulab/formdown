/**
 * Simple unit tests for FormdownUI component with real-time data features
 */

describe('FormdownUI Module', () => {
    it('should be importable', async () => {
        const module = await import('../src/formdown-ui');
        expect(module.FormdownUI).toBeDefined();
    });

    it('should have a FormdownUI class', async () => {
        const { FormdownUI } = await import('../src/formdown-ui');
        expect(typeof FormdownUI).toBe('function');
    });

    it('should be a constructor function', async () => {
        const { FormdownUI } = await import('../src/formdown-ui');
        expect(FormdownUI.prototype).toBeDefined();
    });
});

describe('Basic Component Properties', () => {
    let FormdownUI: any;
    let component: any;

    beforeAll(async () => {
        const module = await import('../src/formdown-ui');
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
        const module = await import('../src/formdown-ui');
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
        const module = await import('../src/formdown-ui');
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
