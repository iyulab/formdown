#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read package.json files
const rootPackagePath = path.join(__dirname, '..', '..', 'package.json');
const corePackagePath = path.join(__dirname, '..', '..', 'packages', 'formdown-core', 'package.json');
const uiPackagePath = path.join(__dirname, '..', '..', 'packages', 'formdown-ui', 'package.json');
const editorPackagePath = path.join(__dirname, '..', '..', 'packages', 'formdown-editor', 'package.json');
const sitePackagePath = path.join(__dirname, '..', 'package.json');

function readPackageVersion(packagePath) {
    try {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return packageJson.version;
    } catch (error) {
        console.warn(`Failed to read ${packagePath}:`, error.message);
        return '0.1.0';
    }
}

// Read all versions
const rootVersion = readPackageVersion(rootPackagePath);
const coreVersion = readPackageVersion(corePackagePath);
const uiVersion = readPackageVersion(uiPackagePath);
const editorVersion = readPackageVersion(editorPackagePath);
const siteVersion = readPackageVersion(sitePackagePath);

// Generate version.ts file
const versionFileContent = `// Auto-generated version information
// This file contains the current versions of all Formdown packages

export const FORMDOWN_VERSIONS = {
  core: "${coreVersion}",
  ui: "${uiVersion}", 
  editor: "${editorVersion}",
  site: "${siteVersion}"
} as const;

export const FORMDOWN_INFO = {
  name: "formdown",
  description: "A declarative form builder using markdown-like syntax",
  version: FORMDOWN_VERSIONS.core // Use core version as main version
} as const;`;

// Write the file
const versionFilePath = path.join(__dirname, '..', 'src', 'lib', 'version.ts');
fs.writeFileSync(versionFilePath, versionFileContent, 'utf8');

console.log('Version information updated:');
console.log(`- Core: ${coreVersion}`);
console.log(`- UI: ${uiVersion}`);
console.log(`- Editor: ${editorVersion}`);
console.log(`- Site: ${siteVersion}`);
console.log(`Version file updated: ${versionFilePath}`);
