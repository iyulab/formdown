#!/usr/bin/env node

// After a build: every file a package's manifest points to (main, module, types, exports) exists.
// A missing one would be published as a broken entry point, which no test of the sources notices.

const fs = require('fs');
const path = require('path');

const packages = [
    'packages/formdown-core',
    'packages/formdown-ui',
    'packages/formdown-editor'
];

function targets(value) {
    if (typeof value === 'string') return [value];
    if (value && typeof value === 'object') return Object.values(value).flatMap(targets);
    return [];
}

let missing = 0;
for (const dir of packages) {
    const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
    const files = new Set([manifest.main, manifest.module, manifest.types, ...targets(manifest.exports)].filter(Boolean));
    for (const file of files) {
        if (!fs.existsSync(path.join(dir, file))) {
            console.error(`${manifest.name}: ${file} is named in package.json but was not built`);
            missing++;
        }
    }
}
if (missing > 0) process.exit(1);
console.log('Every entry point named in the packages is built.');
