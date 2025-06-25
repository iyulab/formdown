// Test script for new checkbox and radio syntax
import { FormdownParser, FormdownGenerator } from './dist/index.js';

async function testCheckboxSyntax() {
    console.log('=== Testing New Checkbox and Radio Syntax ===');

    const parser = new FormdownParser();
    const generator = new FormdownGenerator();

    const testCases = [
        {
            name: 'Single Checkbox',
            content: '@agree_terms: [checkbox required]',
            expectedType: 'checkbox',
            expectOptions: false
        },
        {
            name: 'Checkbox Group with options',
            content: '@interests: [checkbox options="Programming,Design,Music"]',
            expectedType: 'checkbox',
            expectOptions: true
        },
        {
            name: 'Radio Group with options',
            content: '@gender: [radio options="Male,Female,Other"]',
            expectedType: 'radio',
            expectOptions: true
        },
        {
            name: 'Radio without options (should fallback)',
            content: '@invalid_radio: [radio required]',
            expectedType: 'radio',
            expectOptions: false
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n--- ${testCase.name} ---`);
        console.log(`Input: ${testCase.content}`);

        const parseResult = parser.parseFormdown(testCase.content);
        console.log(`Forms detected: ${parseResult.forms.length}`);

        if (parseResult.forms.length > 0) {
            const field = parseResult.forms[0];
            console.log(`Field type: ${field.type}`);
            console.log(`Has options: ${!!field.options}`);
            if (field.options) {
                console.log(`Options: ${field.options.join(', ')}`);
            }

            const html = generator.generateHTML(parseResult);
            console.log(`Generated HTML contains:`);

            if (testCase.expectedType === 'checkbox' && !testCase.expectOptions) {
                // Single checkbox
                const hasSingleCheckbox = html.includes('type="checkbox"') &&
                    html.includes('value="true"') &&
                    !html.includes('<fieldset>');
                console.log(`  ✓ Single checkbox: ${hasSingleCheckbox}`);
            } else if (testCase.expectedType === 'checkbox' && testCase.expectOptions) {
                // Checkbox group
                const hasCheckboxGroup = html.includes('type="checkbox"') &&
                    html.includes('<fieldset>') &&
                    html.includes('checkbox-group');
                console.log(`  ✓ Checkbox group: ${hasCheckboxGroup}`);
            } else if (testCase.expectedType === 'radio' && testCase.expectOptions) {
                // Radio group
                const hasRadioGroup = html.includes('type="radio"') &&
                    html.includes('<fieldset>') &&
                    html.includes('radio-group');
                console.log(`  ✓ Radio group: ${hasRadioGroup}`);
            } else if (testCase.expectedType === 'radio' && !testCase.expectOptions) {
                // Radio fallback to text
                const hasTextFallback = html.includes('type="text"') &&
                    !html.includes('type="radio"');
                console.log(`  ✓ Radio fallback to text: ${hasTextFallback}`);
            }
        }
    }
}

testCheckboxSyntax();
