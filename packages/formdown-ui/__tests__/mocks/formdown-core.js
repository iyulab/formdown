// Mock for @formdown/core
class FormdownParser {
    parse(content) {
        return {
            fields: [],
            errors: []
        };
    }

    parseFormdown(content) {
        return {
            markdown: content || '',
            forms: []
        };
    }
}

class FormdownGenerator {
    generateHTML(content) {
        return '<div>Mock HTML</div>';
    }

    generateFormHTML(fields) {
        return '<form>Mock Form</form>';
    }
}

// Mock Phase 1 Core modules
class FieldProcessor {
    processCheckboxGroup(fieldName, container) {
        return { success: true, value: [] };
    }

    processRadioGroup(fieldName, container) {
        return { success: true, value: null };
    }

    validateFieldValue(value, type, constraints = {}) {
        return { success: true, value, errors: [] };
    }

    getFieldType(element) {
        return element.type || 'text';
    }

    extractFieldValue(element, type) {
        return element.value || '';
    }

    setFieldValue(element, value, type) {
        element.value = value;
        return true;
    }
}

class DOMBinder {
    constructor() {
        this.fieldRegistry = new Map();
    }

    bindFieldToElement(fieldName, element, container) {
        if (!this.fieldRegistry.has(fieldName)) {
            this.fieldRegistry.set(fieldName, new Set());
        }
        this.fieldRegistry.get(fieldName).add(element);
        return {
            fieldName,
            elements: this.fieldRegistry.get(fieldName),
            unbind: () => this.unbindElement(fieldName, element)
        };
    }

    syncFormData(formData, container) {
        // Mock implementation
    }

    getRegisteredFields() {
        return Array.from(this.fieldRegistry.keys());
    }

    unbindElement(fieldName, element) {
        this.fieldRegistry.get(fieldName)?.delete(element);
    }

    setupElementEventHandlers(element, fieldName, container) {
        // Mock implementation
    }
}

class ValidationManager {
    constructor() {
        this.customValidators = new Map();
    }

    registerCustomValidator(name, validator) {
        this.customValidators.set(name, validator);
    }

    createValidationPipeline(rules) {
        return {
            rules,
            executeOrder: 'fail-fast'
        };
    }

    async validateAsync(fieldContext, value, formData) {
        return {
            isValid: true,
            errors: [],
            warnings: []
        };
    }
}

class EventOrchestrator {
    constructor() {
        this.eventBuses = new Map();
        this.componentBridges = new Map();
    }

    createEventBus(id = 'default') {
        const eventListeners = new Map();
        const eventBus = {
            emit: (event, data) => {
                const handlers = eventListeners.get(event) || [];
                handlers.forEach(handler => handler(data));
            },
            on: (event, handler) => {
                if (!eventListeners.has(event)) {
                    eventListeners.set(event, []);
                }
                eventListeners.get(event).push(handler);
                return () => {
                    const handlers = eventListeners.get(event);
                    const index = handlers.indexOf(handler);
                    if (index > -1) handlers.splice(index, 1);
                };
            },
            off: (event, handler) => {
                const handlers = eventListeners.get(event);
                if (handlers) {
                    const index = handlers.indexOf(handler);
                    if (index > -1) handlers.splice(index, 1);
                }
            }
        };
        this.eventBuses.set(id, eventBus);
        return eventBus;
    }

    bridgeComponentEvents(source, target, mappings = []) {
        const bridgeId = `${source.id}_to_${target.id}_${Date.now()}`;
        this.componentBridges.set(bridgeId, { source, target, mappings });
        return bridgeId;
    }

    getEventStats() {
        return {
            totalEventBuses: this.eventBuses.size,
            totalBridges: this.componentBridges.size,
            activeBridges: this.componentBridges.size
        };
    }
}

// Mock FormManager with new Phase 1 methods
class FormManager {
    constructor() {
        this.fieldProcessor = null;
        this.domBinder = null;
        this.validationManager = null;
        this.eventOrchestrator = null;
        this.parsedContent = null;
        this.data = {};
    }

    // Core module creation methods
    createFieldProcessor() {
        if (!this.fieldProcessor) {
            this.fieldProcessor = new FieldProcessor();
        }
        return this.fieldProcessor;
    }

    createDOMBinder() {
        if (!this.domBinder) {
            this.domBinder = new DOMBinder();
        }
        return this.domBinder;
    }

    createValidationManager() {
        if (!this.validationManager) {
            this.validationManager = new ValidationManager();
        }
        return this.validationManager;
    }

    createEventOrchestrator() {
        if (!this.eventOrchestrator) {
            this.eventOrchestrator = new EventOrchestrator();
        }
        return this.eventOrchestrator;
    }

    // Existing methods
    parse(content) {
        this.parsedContent = {
            markdown: content || '',
            forms: [],
            fields: []
        };
        return this.parsedContent;
    }

    render() {
        return '<div>Mock rendered content</div>';
    }

    setFieldValue(fieldName, value) {
        this.data[fieldName] = value;
    }

    getFieldValue(fieldName) {
        return this.data[fieldName];
    }

    // New Phase 1 methods
    processFieldValue(fieldName, value) {
        this.setFieldValue(fieldName, value);
        return { success: true, value };
    }

    validateFieldWithPipeline(pipeline) {
        return Promise.resolve({ isValid: true, errors: [] });
    }

    setupComponentBridge(target) {
        return 'mock-bridge-id';
    }

    renderToTemplate(options = {}) {
        return {
            fields: [],
            formDeclarations: [],
            schema: {},
            data: this.data,
            html: '<div>Mock template HTML</div>'
        };
    }

    handleUIEvent(event, domBinder) {
        // Mock UI event handling
    }

    createPreviewTemplate(content) {
        return {
            html: '<div>Mock preview HTML</div>',
            errors: [],
            schema: {},
            fields: []
        };
    }

    getCoreModules() {
        return {
            fieldProcessor: this.fieldProcessor,
            domBinder: this.domBinder,
            validationManager: this.validationManager,
            eventOrchestrator: this.eventOrchestrator
        };
    }

    dispose() {
        this.fieldProcessor = null;
        this.domBinder = null;
        this.validationManager = null;
        this.eventOrchestrator = null;
    }
}

// Mock FormDataBinding class
class FormDataBinding {
    constructor(initialData = {}) {
        this.data = { ...initialData };
        this.listeners = new Set();
    }

    setFieldValue(fieldName, value) {
        this.data[fieldName] = value;
        this.listeners.forEach(listener => listener(fieldName, value));
    }

    getFieldValue(fieldName) {
        return this.data[fieldName];
    }

    getData() {
        return { ...this.data };
    }

    onDataChange(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }
}

// Mock extension manager
const extensionManager = {
    getExtensions: () => [],
    registerExtension: () => {},
    applyExtensions: (content) => content
};

module.exports = { 
    FormdownParser, 
    FormdownGenerator, 
    FormManager,
    FormDataBinding,
    FieldProcessor,
    DOMBinder,
    ValidationManager,
    EventOrchestrator,
    extensionManager
};
