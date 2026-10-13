#!/usr/bin/env node

// The site's pages link to each other and to its samples by site path (`/docs/syntax`, `/samples/x.fd`). A link to
// a page or sample that is not there is a 404 nobody notices until a reader follows it; this checks each one
// against the sources, without building the site. Links inside code blocks are examples, and are not checked.

const fs = require('fs');
const path = require('path');

const site = path.join(__dirname, '..', 'site');
const content = path.join(site, 'content');

function* markdown(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* markdown(file);
        else if (entry.name.endsWith('.md')) yield file;
    }
}

/** Whether the site serves `target`, a site path without its anchor. */
function served(target) {
    const [, first, ...rest] = target.split('/');
    if (first === 'docs' && rest.length === 1) return fs.existsSync(path.join(content, 'docs', `${rest[0]}.md`));
    if (first === 'docs' && rest.length === 0) return true;
    // A file the site serves as it is, or a page of its own.
    if (fs.existsSync(path.join(site, 'public', target))) return true;
    return fs.existsSync(path.join(site, 'src', 'app', first, 'page.tsx'));
}

const broken = [];
for (const file of markdown(content)) {
    const text = fs.readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
    for (const [, target] of text.matchAll(/\]\((\/[^)\s#]*)(?:#[^)\s]*)?\)/g)) {
        if (!served(target)) broken.push(`${path.relative(site, file).replace(/\\/g, '/')}: ${target}`);
    }
}

if (broken.length) {
    console.error(`Links to nothing the site serves (${broken.length}):`);
    for (const line of broken) console.error(`  ${line}`);
    process.exit(1);
}
console.log('Every site link points at a page or file the site serves.');
