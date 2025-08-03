#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PACKAGE_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(PACKAGE_DIR, 'dist');
const PACKAGE_OUTPUT_DIR = path.join(DIST_DIR, 'package');

// Clean and create package directory
if (fs.existsSync(PACKAGE_OUTPUT_DIR)) {
    fs.rmSync(PACKAGE_OUTPUT_DIR, { recursive: true });
}
fs.mkdirSync(PACKAGE_OUTPUT_DIR, { recursive: true });

// HTML template for direct use
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formdown Editor</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: #2563eb;
            color: white;
            padding: 20px;
            text-align: center;
        }
        .content {
            padding: 20px;
        }
        formdown-editor {
            display: block;
            width: 100%;
            height: 500px;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }
        .example {
            margin-top: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 6px;
            border-left: 4px solid #2563eb;
        }
        .example h3 {
            margin-top: 0;
            color: #1e40af;
        }
        .example pre {
            background: #f1f5f9;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Formdown Editor</h1>
            <p>Interactive Formdown syntax editor</p>
        </div>
        
        <div class="content">
            <h2>Editor</h2>
            <formdown-editor id="editor"></formdown-editor>
            
            <div class="example">
                <h3>Example Formdown Syntax</h3>
                <p>Try this example in the editor:</p>
                <pre># Contact Form

## Personal Information
name: text* "Your full name"
email: email* "Email address"
phone: tel "Phone number (optional)"

## Preferences
newsletter: checkbox "Subscribe to newsletter"
category: select "Category of interest"
  - technology
  - business
  - design
  - other

## Message
message: textarea* "Your message"
  rows: 5

## Submit
submit: submit "Send Message"</pre>
            </div>
        </div>
    </div>

    <!-- Load Formdown Editor -->
    <script src="./formdown-editor.js"></script>
    
    <script type="module">
        // Initialize editor when component is ready
        customElements.whenDefined('formdown-editor').then(() => {
            const editor = document.getElementById('editor');
            
            // Set initial content
            editor.content = \`# Sample Form

## Basic Fields
name: text* "Your name"
email: email* "Email address"

## Submit
submit: submit "Send"\`;
            
            // Listen for changes
            editor.addEventListener('contentChange', (event) => {
                console.log('Editor content changed:', event.detail);
            });
            
            console.log('Formdown Editor is ready!');
        });
    </script>
</body>
</html>`;

// CDN usage example
const cdnExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formdown Editor - CDN Example</title>
</head>
<body>
    <h1>Formdown Editor - CDN Usage</h1>
    
    <!-- Formdown Editor -->
    <formdown-editor id="editor" style="height: 400px; border: 1px solid #ccc;"></formdown-editor>
    
    <!-- Load from CDN -->
    <script type="module" src="https://unpkg.com/@formdown/editor/dist/standalone.js"></script>
    
    <script type="module">
        customElements.whenDefined('formdown-editor').then(() => {
            const editor = document.getElementById('editor');
            editor.content = 'name: text* "Your name"\\nemail: email* "Email"';
        });
    </script>
</body>
</html>`;

// README for the package
const readme = `# Formdown Editor - Direct Use Package

This package contains everything you need to use Formdown Editor directly in your web pages.

## Quick Start

1. **Direct Use**: Open \`index.html\` directly in any browser (no server required!)
2. **CDN Usage**: See \`cdn-example.html\` for CDN usage

## File Structure

- \`index.html\` - Complete example with Formdown Editor (works without server)
- \`formdown-editor.js\` - IIFE bundle with all dependencies (no server required)
- \`cdn-example.html\` - Example using CDN
- \`README.md\` - This file

## Usage Options

### Option 1: Direct Browser Use (Recommended)

Simply open \`index.html\` in any modern browser. No web server required!

### Option 2: Local Development Server (Optional)

If you prefer using a local web server:
   \`\`\`bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # VS Code Live Server extension
   \`\`\`

2. Open \`http://localhost:8000\` in your browser

### Option 2: CDN

Include in your HTML:
\`\`\`html
<script type="module" src="https://unpkg.com/@formdown/editor/dist/standalone.js"></script>

<formdown-editor id="editor"></formdown-editor>

<script type="module">
  customElements.whenDefined('formdown-editor').then(() => {
    const editor = document.getElementById('editor');
    editor.content = 'name: text* "Your name"';
  });
</script>
\`\`\`

## API

### Properties
- \`content\` - Formdown content string
- \`mode\` - Editor mode: 'split', 'edit', 'view'
- \`placeholder\` - Placeholder text

### Events
- \`contentChange\` - Fired when content changes
- \`formdown-change\` - Detailed change events

## Support

- Documentation: https://github.com/your-repo/formdown
- Issues: https://github.com/your-repo/formdown/issues
`;

// Copy IIFE bundle JS file (no server required)
const bundleSource = path.join(DIST_DIR, 'bundle', 'formdown-editor.bundle.js');
const bundleTarget = path.join(PACKAGE_OUTPUT_DIR, 'formdown-editor.js');

if (fs.existsSync(bundleSource)) {
    fs.copyFileSync(bundleSource, bundleTarget);
    console.log('✓ Copied formdown-editor.bundle.js as formdown-editor.js');
} else {
    console.error('✗ formdown-editor.bundle.js not found. Run build:bundle first.');
    process.exit(1);
}

// Write HTML template
fs.writeFileSync(path.join(PACKAGE_OUTPUT_DIR, 'index.html'), htmlTemplate);
console.log('✓ Created index.html');

// Write CDN example
fs.writeFileSync(path.join(PACKAGE_OUTPUT_DIR, 'cdn-example.html'), cdnExample);
console.log('✓ Created cdn-example.html');

// Write README
fs.writeFileSync(path.join(PACKAGE_OUTPUT_DIR, 'README.md'), readme);
console.log('✓ Created README.md');

console.log(`\n📦 Package created at: ${PACKAGE_OUTPUT_DIR}`);
console.log('\nContents:');
console.log('- index.html (ready-to-use example)');
console.log('- formdown-editor.js (standalone bundle)');
console.log('- cdn-example.html (CDN usage example)');
console.log('- README.md (documentation)');
console.log('\n🚀 To test: Open dist/package/index.html directly in any browser!');
