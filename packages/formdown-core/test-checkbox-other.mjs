import { parseFormdown, generateFormHTML } from './dist/index.js';

const content = '@interests{Tech,Sports,*(Custom Interest)}: c[]';
const result = parseFormdown(content);
const html = generateFormHTML(result);

console.log('Generated HTML:');
console.log(html);
console.log('\n=== Checking for correct implementation ===');

// Check for the correct attributes
const hasCorrectCheckboxName = html.includes('name="interests_temp"');
const hasCorrectTextInputName = html.includes('name="interests_other"');
const hasOnChangeHandler = html.includes('onchange=');

console.log('✅ Checkbox has name="interests_temp":', hasCorrectCheckboxName);
console.log('✅ Text input has name="interests_other":', hasCorrectTextInputName);
console.log('✅ Has onchange handlers:', hasOnChangeHandler);

if (hasCorrectCheckboxName && hasCorrectTextInputName && hasOnChangeHandler) {
    console.log('\n🎉 Checkbox other option implementation looks correct!');
} else {
    console.log('\n❌ Implementation needs review');
}