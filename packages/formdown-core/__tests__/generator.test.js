import { FormdownGenerator } from '../src/generator';
describe('FormdownGenerator', () => {
    let generator;
    beforeEach(() => {
        generator = new FormdownGenerator();
    });
    describe('Markdown Integration', () => {
        test('should generate HTML from markdown content', () => {
            const content = {
                markdown: '# Test Title\n\nThis is a test paragraph.',
                forms: []
            };
            const html = generator.generateHTML(content);
            expect(html).toContain('<h1>Test Title</h1>');
            expect(html).toContain('<p>This is a test paragraph.</p>');
        });
        test('should combine markdown and form HTML', () => {
            const content = {
                markdown: '# Contact Us\n\nPlease fill out the form below:',
                forms: [{
                        name: 'name',
                        type: 'text',
                        label: 'Name',
                        required: true,
                        attributes: {}
                    }]
            };
            const html = generator.generateHTML(content);
            expect(html).toContain('<h1>Contact Us</h1>');
            expect(html).toContain('<p>Please fill out the form below:</p>');
            expect(html).toContain('<form class="formdown-form">');
            expect(html).toContain('<input type="text"');
        });
    });
    describe('Form Generation', () => {
        test('should generate empty string for no fields', () => {
            const html = generator.generateFormHTML([]);
            expect(html).toBe('');
        });
        test('should generate basic text input', () => {
            const fields = [{
                    name: 'username',
                    type: 'text',
                    label: 'Username',
                    required: true,
                    attributes: {}
                }];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('<form class="formdown-form">');
            expect(html).toContain('<div class="formdown-field">');
            expect(html).toContain('<label for="username">Username *</label>');
            expect(html).toContain('<input type="text" id="username" name="username" required>');
        });
        test('should generate email input with placeholder', () => {
            const fields = [{
                    name: 'email',
                    type: 'email',
                    label: 'Email Address',
                    required: true,
                    placeholder: 'Enter your email',
                    attributes: {}
                }];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('<input type="email"');
            expect(html).toContain('id="email"');
            expect(html).toContain('name="email"');
            expect(html).toContain('placeholder="Enter your email"');
            expect(html).toContain('required');
        });
        test('should generate number input with min/max', () => {
            const fields = [{
                    name: 'age',
                    type: 'number',
                    label: 'Age',
                    attributes: {
                        min: 18,
                        max: 100
                    }
                }];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('<input type="number"');
            expect(html).toContain('min="18"');
            expect(html).toContain('max="100"');
        });
    });
    describe('Textarea Generation', () => {
        test('should generate textarea with rows and cols', () => {
            const fields = [{
                    name: 'description',
                    type: 'textarea',
                    label: 'Description',
                    attributes: {
                        rows: 4,
                        cols: 50
                    }
                }];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('<textarea');
            expect(html).toContain('rows="4"');
            expect(html).toContain('cols="50"');
            expect(html).toContain('id="description"');
            expect(html).toContain('name="description"');
        });
    });
    describe('Select Generation', () => {
        test('should generate select with options', () => {
            const fields = [{
                    name: 'country',
                    type: 'select',
                    label: 'Country',
                    options: ['USA', 'Canada', 'UK'],
                    attributes: {}
                }];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('<select');
            expect(html).toContain('<option value="USA">USA</option>');
            expect(html).toContain('<option value="Canada">Canada</option>');
            expect(html).toContain('<option value="UK">UK</option>');
        });
    });
    describe('Radio Button Generation', () => {
        test('should generate radio buttons with options', () => {
            const fields = [{
                    name: 'gender',
                    type: 'radio',
                    label: 'Gender',
                    required: true,
                    options: ['Male', 'Female', 'Other'],
                    attributes: {}
                }];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('<fieldset>');
            expect(html).toContain('<legend>Gender *</legend>');
            expect(html).toContain('type="radio"');
            expect(html).toContain('value="Male"');
            expect(html).toContain('value="Female"');
            expect(html).toContain('value="Other"');
            expect(html).toContain('name="gender"');
        });
    });
    describe('Checkbox Generation', () => {
        test('should generate checkboxes with options', () => {
            const fields = [{
                    name: 'interests',
                    type: 'checkbox',
                    label: 'Interests',
                    options: ['Programming', 'Design', 'Music'],
                    attributes: {}
                }];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('<fieldset>');
            expect(html).toContain('<legend>Interests</legend>');
            expect(html).toContain('type="checkbox"');
            expect(html).toContain('value="Programming"');
            expect(html).toContain('value="Design"');
            expect(html).toContain('value="Music"');
            expect(html).toContain('name="interests"');
        });
    });
    describe('Complex Forms', () => {
        test('should generate multiple fields correctly', () => {
            const fields = [
                {
                    name: 'name',
                    type: 'text',
                    label: 'Full Name',
                    required: true,
                    attributes: {}
                },
                {
                    name: 'email',
                    type: 'email',
                    label: 'Email',
                    required: true,
                    placeholder: 'your@email.com',
                    attributes: {}
                },
                {
                    name: 'age',
                    type: 'number',
                    label: 'Age',
                    attributes: { min: 18 }
                }
            ];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('Full Name *');
            expect(html).toContain('Email *');
            expect(html).toContain('Age');
            expect(html).toContain('placeholder="your@email.com"');
            expect(html).toContain('min="18"');
        });
    });
    describe('Edge Cases', () => {
        test('should handle field without label', () => {
            const fields = [{
                    name: 'test',
                    type: 'text',
                    label: '',
                    attributes: {}
                }];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('<label for="test"></label>');
        });
        test('should handle boolean attributes correctly', () => {
            const fields = [{
                    name: 'test',
                    type: 'text',
                    label: 'Test',
                    attributes: {
                        disabled: true,
                        readonly: false,
                        autocomplete: 'off'
                    }
                }];
            const html = generator.generateFormHTML(fields);
            expect(html).toContain('disabled');
            expect(html).not.toContain('readonly');
            expect(html).toContain('autocomplete="off"');
        });
    });
});
