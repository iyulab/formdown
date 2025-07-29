const { FormdownParser, FormdownGenerator } = require('./dist/index.js');

console.log('=== TDD Value Attribute Debug ===');

const parser = new FormdownParser();
const generator = new FormdownGenerator();

// Test case from user
const testCase = '@name(Full Name)*: [placeholder="Enter your full name" value="John snow"]';

console.log('\n1. Testing user case:');
console.log('Input:', testCase);

const parsed = parser.parseFormdown(testCase);
console.log('\nParsed result:');
console.log(JSON.stringify(parsed.forms[0], null, 2));

const html = generator.generateFieldHTML(parsed.forms[0]);
console.log('\nGenerated HTML:');
console.log(html);

console.log('\n=== Testing various attribute orders ===');

const testCases = [
    '@name: [text value="John" placeholder="Name"]',
    '@name: [text placeholder="Name" value="John"]', 
    '@email: [email required value="test@example.com"]',
    '@age: [number value=25 min=18]',
    '@country: [select value="USA" options="USA,Canada,UK"]',
    '@priority: [radio value="High" options="Low,Medium,High"]',
    '@features: [checkbox value="A,B" options="A,B,C,D"]',
    '@newsletter: [checkbox value=true]',
    '@message: [textarea value="Default text" rows=3]',
    '@rating: [range value=7 min=1 max=10]'
];

testCases.forEach((testCase, index) => {
    console.log(`\n${index + 1}. Testing: ${testCase}`);
    try {
        const result = parser.parseFormdown(testCase);
        const field = result.forms[0];
        console.log(`   Value: ${JSON.stringify(field.value)}`);
        console.log(`   Type: ${field.type}`);
        
        const html = generator.generateFieldHTML(field);
        const hasValue = html.includes('value=') || html.includes('selected') || html.includes('checked');
        console.log(`   HTML has value: ${hasValue ? '✅' : '❌'}`);
        
        if (!hasValue && field.value !== undefined) {
            console.log('   🚨 ERROR: Value defined but not in HTML!');
        }
    } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
    }
});