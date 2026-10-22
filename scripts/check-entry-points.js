#!/usr/bin/env node

// After a build: every file a package's manifest points to (main, module, types, exports) exists,
// the ES entry imports under plain Node, and no runtime dependency was inlined into it.
// A missing file, an entry that throws on import, or a second copy of a dependency would be
// published as a broken package, which no test of the sources notices.

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

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

// A dependency's own copy must run — inlining one (e.g. `lit/decorators.js` pulling in
// `@lit/reactive-element`) skips its export conditions and doubles it in the consumer's page.
async function checkEsEntries() {
    let broken = 0;
    for (const dir of packages) {
        const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
        const entry = path.join(dir, manifest.module || manifest.main);
        const source = fs.readFileSync(entry, 'utf8');
        const inlined = [...new Set([...source.matchAll(/node_modules\/((?:@[^/]+\/)?[^/]+)\//g)].map((m) => m[1]))];
        if (inlined.length > 0) {
            console.error(`${manifest.name}: ${manifest.module || manifest.main} inlines ${inlined.join(', ')} — keep every import path of a dependency external`);
            broken++;
        }
        try {
            await import(pathToFileURL(path.resolve(entry)).href);
        } catch (error) {
            console.error(`${manifest.name}: importing ${manifest.module || manifest.main} under Node fails — ${error}`);
            broken++;
        }
    }
    if (broken > 0) process.exit(1);
    console.log('Every ES entry imports under Node with its dependencies external.');
}

checkEsEntries();
