import { parseFormdown, generateFormHTML } from './dist/index.js';

const formContent = `
# Test Form with Other Options

@country{USA,Canada,UK,*}: s[required]
@interests{Programming,Design,Music,*}: c[]
@contact_method{Email,Phone,*}: r[required]
`;

const parsed = parseFormdown(formContent);
const html = generateFormHTML(parsed);

console.log('=== ALL FIELD TYPES TEST ===\n');
console.log('Parsed content:');
console.log(JSON.stringify(parsed, null, 2));
console.log('\nGenerated HTML:');
console.log(html);

// Test specific field generation
import { FormdownGenerator } from './dist/generator.js';

const generator = new FormdownGenerator();

console.log('\n=== DIRECT FIELD GENERATION TESTS ===\n');

// Test Select
const selectField = {
    name: 'country',
    type: 'select',
    label: 'Country',
    options: ['USA', 'Canada', 'UK'],
    allowOther: true,
    attributes: { required: true }
};

console.log('SELECT FIELD:');
console.log(generator.generateFieldHTML(selectField));

// Test Radio
const radioField = {
    name: 'contact',
    type: 'radio',
    label: 'Contact Method',
    options: ['Email', 'Phone'],
    allowOther: true,
    attributes: { required: true }
};

console.log('\nRADIO FIELD:');
console.log(generator.generateFieldHTML(radioField));

// Test Checkbox
const checkboxField = {
    name: 'skills',
    type: 'checkbox',
    label: 'Skills',
    options: ['JavaScript', 'Python'],
    allowOther: true,
    attributes: {}
};

console.log('\nCHECKBOX FIELD:');
console.log(generator.generateFieldHTML(checkboxField));