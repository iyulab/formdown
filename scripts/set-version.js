#!/usr/bin/env node

// Sets the version every @formdown package shares, everywhere it is written:
//   node scripts/set-version.js 0.11.0
// the root and workspace manifests, their @formdown dependencies, those same entries in package-lock.json
// (and nothing else in it — a dependency that happens to have the same version is not ours), the site's
// version file, and the CHANGELOG's "## Unreleased" heading. Commit the result, then tag v<version>.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version ?? '')) {
    console.error('usage: node scripts/set-version.js <major.minor.patch>');
    process.exit(1);
}

const root = path.join(__dirname, '..');
const workspaces = ['packages/formdown-core', 'packages/formdown-ui', 'packages/formdown-editor', 'site'];

/** Rewrites a JSON file through `change`, keeping its indentation and final newline. */
function editJson(file, change) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    const indent = text.match(/^\{\r?\n([ \t]+)"/)?.[1] ?? '  ';
    const eol = text.includes('\r\n') ? '\r\n' : '\n';
    const data = JSON.parse(text);
    change(data);
    let out = JSON.stringify(data, null, indent);
    if (eol === '\r\n') out = out.replace(/\n/g, '\r\n');
    if (/\r?\n$/.test(text)) out += eol;
    fs.writeFileSync(path.join(root, file), out);
}

/**
 * Points the @formdown dependencies of a manifest (or a lock entry) that name an exact version at `version`.
 * One that names a path (the site's `file:../packages/...`) stays as it is.
 */
function pinOurs(entry) {
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
        for (const [name, spec] of Object.entries(entry[field] ?? {})) {
            if (name.startsWith('@formdown/') && /^\d/.test(spec)) entry[field][name] = version;
        }
    }
}

editJson('package.json', (pkg) => {
    pkg.version = version;
});
for (const dir of workspaces) {
    editJson(`${dir}/package.json`, (pkg) => {
        pkg.version = version;
        pinOurs(pkg);
    });
}
editJson('package-lock.json', (lock) => {
    lock.version = version;
    for (const key of ['', ...workspaces]) {
        const entry = lock.packages?.[key];
        if (!entry) continue;
        entry.version = version;
        pinOurs(entry);
    }
});

execFileSync(process.execPath, [path.join(root, 'site', 'scripts', 'update-version.js')], { stdio: 'ignore' });

const changelog = path.join(root, 'CHANGELOG.md');
const notes = fs.readFileSync(changelog, 'utf8');
if (/^## Unreleased$/m.test(notes)) {
    fs.writeFileSync(changelog, notes.replace(/^## Unreleased$/m, `## ${version}`));
} else if (!new RegExp(`^## ${version.replace(/\./g, '\\.')}$`, 'm').test(notes)) {
    console.warn('CHANGELOG.md has no "## Unreleased" section to name: add the notes for this version.');
}

console.log(`@formdown packages set to ${version}`);
