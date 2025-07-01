// Test for the specific issue: @name: [] not being properly parsed/rendered
const { FormdownParser } = require('./dist/parser.js');
const { FormdownGenerator } = require('./dist/generator.js');

async function testSimpleFieldIssue() {
    console.log('=== Testing Simple Field Issue ===');

    const parser = new FormdownParser();
    const generator = new FormdownGenerator();

    // This is the exact content causing the issue
    const testContent = `## Hello

hello wrold...

@name: []`;

    console.log('Input content:');
    console.log(testContent);
    console.log('\n--- Parsing ---');

    // Test parsing step by step
    const parseResult = parser.parseFormdown(testContent);

    console.log('Markdown result:');
    console.log(JSON.stringify(parseResult.markdown, null, 2));

    console.log('\nForms detected:', parseResult.forms.length);
    parseResult.forms.forEach((form, index) => {
        console.log(`Form ${index + 1}:`, JSON.stringify(form, null, 2));
    });

    console.log('\n--- Generation ---');
    const generatedHTML = generator.generateHTML(parseResult);

    console.log('Generated HTML:');
    console.log(generatedHTML);

    console.log('\n--- Analysis ---');

    // Check if the issue is in parsing
    if (parseResult.forms.length === 0) {
        console.error('❌ ISSUE: No forms were parsed from the content');
        console.log('The parser is not recognizing @name: [] as a valid field');
        return 'parsing_issue';
    }

    // Check if markdown still contains the original field syntax
    if (parseResult.markdown.includes('@name: []')) {
        console.error('❌ ISSUE: Original field syntax still in markdown');
        console.log('The parser did not remove/replace the field from markdown');
        return 'markdown_replacement_issue';
    }

    // Check if HTML generation is working
    if (!generatedHTML.includes('<input') && !generatedHTML.includes('<form')) {
        console.error('❌ ISSUE: No form elements in generated HTML');
        console.log('The generator is not creating HTML form elements');
        return 'generation_issue';
    }

    // Check if the field appears correctly in HTML
    if (generatedHTML.includes('@name: []')) {
        console.error('❌ ISSUE: Raw field syntax appears in final HTML');
        console.log('The field was not properly converted to HTML');
        return 'html_conversion_issue';
    }

    console.log('✅ Simple field parsing and generation appears to work correctly');
    return 'success';
}

async function testMinimalFields() {
    console.log('\n=== Testing Minimal Field Variations ===');

    const parser = new FormdownParser();
    const generator = new FormdownGenerator();

    const testCases = [
        '@name: []',
        '@email: []',
        '@age: []',
        '@test: []'
    ];

    for (const testCase of testCases) {
        console.log(`\nTesting: "${testCase}"`);

        const parseResult = parser.parseFormdown(testCase);
        console.log(`  Forms detected: ${parseResult.forms.length}`);

        if (parseResult.forms.length > 0) {
            console.log(`  Field name: ${parseResult.forms[0].name}`);
            console.log(`  Field type: ${parseResult.forms[0].type}`);
        }

        const html = generator.generateHTML(parseResult);
        const hasInput = html.includes('<input');
        console.log(`  Has input element: ${hasInput}`);

        if (!hasInput) {
            console.error(`  ❌ FAILED: "${testCase}" did not generate input`);
        }
    }
}

async function testParserRegex() {
    console.log('\n=== Testing Parser Regex ===');

    const parser = new FormdownParser();

    // Let's test the internal parsing logic
    const testContent = '@name: []';

    console.log('Testing content:', testContent);

    // Try to access the internal regex patterns if possible
    // This helps us understand what's happening in the parser
    try {
        const parseResult = parser.parse(testContent);
        console.log('Legacy parse method result:', parseResult);
    } catch (error) {
        console.log('Legacy parse method not available or failed:', error.message);
    }

    try {
        const parseFormdownResult = parser.parseFormdown(testContent);
        console.log('parseFormdown result:', parseFormdownResult);
    } catch (error) {
        console.error('parseFormdown failed:', error);
    }
}

async function runDiagnosticTests() {
    console.log('🔍 Diagnosing FormDown parsing issue...\n');

    try {
        const simpleTestResult = await testSimpleFieldIssue();
        await testMinimalFields();
        await testParserRegex();

        console.log('\n📋 DIAGNOSIS SUMMARY:');
        console.log(`Simple field test result: ${simpleTestResult}`);

        if (simpleTestResult !== 'success') {
            console.log('\n🔧 RECOMMENDED ACTIONS:');
            switch (simpleTestResult) {
                case 'parsing_issue':
                    console.log('- Check parser regex patterns for field detection');
                    console.log('- Verify that @name: [] syntax is supported');
                    break;
                case 'markdown_replacement_issue':
                    console.log('- Check parser logic for removing processed fields from markdown');
                    break;
                case 'generation_issue':
                    console.log('- Check generator logic for creating HTML forms');
                    break;
                case 'html_conversion_issue':
                    console.log('- Check the complete parsing and generation pipeline');
                    break;
            }
        }

    } catch (error) {
        console.error('💥 Diagnostic test failed:', error);
    }
}

runDiagnosticTests();
