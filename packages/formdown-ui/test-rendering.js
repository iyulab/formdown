// Test script to diagnose formdown-ui rendering issues
const { FormdownParser, FormdownGenerator } = require('@formdown/core');

async function testParsing() {
    console.log('=== Testing FormDown Parsing ===');

    const parser = new FormdownParser();
    const generator = new FormdownGenerator();

    const testContent = `# Test Form

@name: [text required]
@email: [email]
@age: [number min=18]`;

    console.log('Input content:', testContent);

    // Test parsing
    const parseResult = parser.parseFormdown(testContent);
    console.log('\n=== Parse Result ===');
    console.log('Markdown length:', parseResult.markdown.length);
    console.log('Forms count:', parseResult.forms.length);
    console.log('Forms:', parseResult.forms);

    // Test generation
    const generatedHTML = generator.generateHTML(parseResult);
    console.log('\n=== Generated HTML ===');
    console.log('HTML length:', generatedHTML.length);
    console.log('HTML content:', generatedHTML);

    // Check if forms are properly detected
    if (parseResult.forms.length === 0) {
        console.error('\n❌ ERROR: No forms detected in parsing!');
        return false;
    }

    // Check if HTML contains form elements
    if (!generatedHTML.includes('<form') && !generatedHTML.includes('<input')) {
        console.error('\n❌ ERROR: Generated HTML does not contain form elements!');
        return false;
    }

    console.log('\n✅ Basic parsing and generation test passed');
    return true;
}

async function testInlineFields() {
    console.log('\n=== Testing Inline Fields ===');

    const parser = new FormdownParser();
    const generator = new FormdownGenerator();

    const testContent = `Hello ___@name[text required]! Your age is ___@age[number].`;

    console.log('Input content:', testContent);

    const parseResult = parser.parseFormdown(testContent);
    console.log('Parse result:', parseResult);

    const generatedHTML = generator.generateHTML(parseResult);
    console.log('Generated HTML:', generatedHTML);

    // Check if inline fields are detected
    if (!generatedHTML.includes('formdown-field')) {
        console.error('\n❌ ERROR: Inline fields not properly generated!');
        return false;
    }

    console.log('\n✅ Inline fields test passed');
    return true;
}

async function runAllTests() {
    console.log('Starting FormDown rendering tests...\n');

    try {
        const test1 = await testParsing();
        const test2 = await testInlineFields();

        if (test1 && test2) {
            console.log('\n🎉 All tests passed!');
        } else {
            console.log('\n❌ Some tests failed. Check the output above.');
        }
    } catch (error) {
        console.error('\n💥 Test execution failed:', error);
    }
}

runAllTests();
