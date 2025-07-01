import { parseFormdown, generateFormHTML } from './dist/index.js';

console.log('=== SHADOW DOM COMPATIBLE TEST ===\n');

const radioContent = '@source{Website,Friend,*}: r[]';
const radioHTML = generateFormHTML(parseFormdown(radioContent));

console.log('Generated HTML:');
console.log(radioHTML);

// Check compatibility
const usesClosest = radioHTML.includes('this.closest');
const usesGetElementById = radioHTML.includes('document.getElementById');

console.log('\n=== COMPATIBILITY ANALYSIS ===');
console.log('Uses this.closest():', usesClosest);
console.log('Uses document.getElementById():', usesGetElementById);

if (usesClosest && !usesGetElementById) {
    console.log('✅ Fully Shadow DOM compatible!');
} else if (usesClosest && usesGetElementById) {
    console.log('⚠️ Mixed approach - partially compatible');
} else if (!usesClosest && usesGetElementById) {
    console.log('❌ Not Shadow DOM compatible');
} else {
    console.log('🤔 Unknown compatibility status');
}

// Test select field too
console.log('\n=== SELECT FIELD TEST ===');
const selectContent = '@country{USA,Canada,*}: s[]';
const selectHTML = generateFormHTML(parseFormdown(selectContent));

console.log('Select field uses closest():', selectHTML.includes('this.closest'));
console.log('Select field uses getElementById():', selectHTML.includes('document.getElementById'));