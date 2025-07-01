import { parseFormdown, generateFormHTML } from './dist/index.js';

const content = '@source{Website,Social Media,*(Please specify)}: r[]';
const result = parseFormdown(content);
const html = generateFormHTML(result);

console.log('Generated HTML:');
console.log(html);
console.log('\n=== Expected behavior ===');
console.log('✅ All radio buttons have name="source"');
console.log('✅ Other radio button has value="" initially');
console.log('✅ Text input updates radio button value');
console.log('✅ Form data: {"source": "user_typed_text"}');