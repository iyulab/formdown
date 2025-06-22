/**
 * Simple unit tests for FormdownUI without complex DOM manipulation
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

    beforeAll(async () => {
        const module = await import('../src/formdown-ui');
        FormdownUI = module.FormdownUI;
    });

    it('should create an instance', () => {
        const instance = new FormdownUI();
        expect(instance).toBeInstanceOf(FormdownUI);
    });

    it('should have content property', () => {
        const instance = new FormdownUI();
        expect(instance.content).toBeDefined();
        expect(typeof instance.content).toBe('string');
    });

    it('should allow setting content property', () => {
        const instance = new FormdownUI();
        const testContent = 'Test content';
        instance.content = testContent;
        expect(instance.content).toBe(testContent);
    });
});
