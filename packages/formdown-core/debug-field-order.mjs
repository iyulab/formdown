import { parseFormdown, generateFormHTML } from './dist/index.js';

const testContent = `# Contact Form

Please fill out this form:

@name: [text required]

Your name will be used for correspondence.

@email: [email required]

We'll send a confirmation to this address.

@message: [textarea required]

Thank you for your message!`;

console.log('Input:');
console.log(testContent);
console.log('\n' + '='.repeat(50));

const result = parseFormdown(testContent);
const html = generateFormHTML(result);

console.log('\nGenerated HTML:');
console.log(html);
console.log('\n' + '='.repeat(50));

// Check field positions
const nameFieldIndex = html.indexOf('name="name"');
const nameDescIndex = html.indexOf('Your name will be used');
const emailFieldIndex = html.indexOf('name="email"');
const emailDescIndex = html.indexOf("We'll send a confirmation");
const messageFieldIndex = html.indexOf('name="message"');
const thankYouIndex = html.indexOf('Thank you for your message');

console.log('\nField positions:');
console.log('name field:', nameFieldIndex);
console.log('name description:', nameDescIndex);
console.log('email field:', emailFieldIndex);
console.log('email description:', emailDescIndex);
console.log('message field:', messageFieldIndex);
console.log('thank you:', thankYouIndex);