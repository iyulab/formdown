// Manual test to verify the other option functionality

import { parseFormdown, generateFormHTML } from './dist/index.js';

console.log('🧪 Manual Other Option Test\n');

// Test 1: Simple select
console.log('=== Test 1: Simple Select ===');
const selectForm = '@country{USA,Canada,*}: s[required]';
const selectParsed = parseFormdown(selectForm);
const selectHTML = generateFormHTML(selectParsed);

console.log('Input:', selectForm);
console.log('Has allowOther:', selectParsed.forms[0].allowOther);
console.log('Options:', selectParsed.forms[0].options);
console.log('Contains onchange:', selectHTML.includes('onchange'));
console.log('Contains null check:', selectHTML.includes('if(otherInput)'));
console.log('');

// Test 2: Radio
console.log('=== Test 2: Radio ===');
const radioForm = '@contact{Email,Phone,*}: r[]';
const radioParsed = parseFormdown(radioForm);
const radioHTML = generateFormHTML(radioParsed);

console.log('Input:', radioForm);
console.log('Has allowOther:', radioParsed.forms[0].allowOther);
console.log('Options:', radioParsed.forms[0].options);
console.log('Contains other radio:', radioHTML.includes('_other_radio'));
console.log('Contains other input:', radioHTML.includes('_other_input'));
console.log('');

// Test 3: Checkbox
console.log('=== Test 3: Checkbox ===');
const checkboxForm = '@skills{JS,Python,*}: c[]';
const checkboxParsed = parseFormdown(checkboxForm);
const checkboxHTML = generateFormHTML(checkboxParsed);

console.log('Input:', checkboxForm);
console.log('Has allowOther:', checkboxParsed.forms[0].allowOther);
console.log('Options:', checkboxParsed.forms[0].options);
console.log('Contains other checkbox:', checkboxHTML.includes('_other_checkbox'));
console.log('Contains focus():', checkboxHTML.includes('focus()'));
console.log('');

// Test 4: Check for potential issues
console.log('=== Test 4: Issue Detection ===');
const allHTML = selectHTML + radioHTML + checkboxHTML;
const uniqueIds = [];
const idMatches = allHTML.match(/id="[^"]+"/g) || [];

idMatches.forEach(match => {
    const id = match.replace(/id="|"/g, '');
    if (uniqueIds.includes(id)) {
        console.log('⚠️ Duplicate ID found:', id);
    } else {
        uniqueIds.push(id);
    }
});

console.log('Total unique IDs:', uniqueIds.length);
console.log('Total ID references:', idMatches.length);

if (uniqueIds.length === idMatches.length) {
    console.log('✅ No duplicate IDs detected');
} else {
    console.log('❌ Duplicate IDs detected!');
}

console.log('\n🎯 Test completed. Check browser console for any runtime errors.');