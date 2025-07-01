import { parseFormdown, generateFormHTML } from './dist/index.js';

const testContent = `# Survey

Rate our service: ___@rating[radio options="1,2,3,4,5"]

Any additional comments: ___@comments[text]

Thank you for your feedback!`;

console.log('Input:');
console.log(testContent);
console.log('\n' + '='.repeat(50));

const result = parseFormdown(testContent);
const html = generateFormHTML(result);

console.log('\nGenerated HTML:');
console.log(html);