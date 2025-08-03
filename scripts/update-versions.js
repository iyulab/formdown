#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = [
    'packages/formdown-core',
    'packages/formdown-editor',
    'packages/formdown-ui'
];

function updateVersion(type) {
    if (!['patch', 'minor', 'major'].includes(type)) {
        console.error('Version type must be patch, minor, or major');
        process.exit(1);
    }

    // Read current version from the first package
    const firstPackagePath = path.join(packages[0], 'package.json');
    const firstPackage = JSON.parse(fs.readFileSync(firstPackagePath, 'utf8'));
    const currentVersion = firstPackage.version;

    console.log(`Current version: ${currentVersion}`);

    // Calculate new version
    const [major, minor, patch] = currentVersion.split('.').map(Number);
    let newVersion;

    switch (type) {
        case 'patch':
            newVersion = `${major}.${minor}.${patch + 1}`;
            break;
        case 'minor':
            newVersion = `${major}.${minor + 1}.0`;
            break;
        case 'major':
            newVersion = `${major + 1}.0.0`;
            break;
    }

    console.log(`New version: ${newVersion}`);

    // Update all package.json files
    packages.forEach(packageDir => {
        const packagePath = path.join(packageDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

        packageJson.version = newVersion;

        // Update internal dependencies to use the new version
        if (packageJson.dependencies) {
            Object.keys(packageJson.dependencies).forEach(dep => {
                if (dep.startsWith('formdown-')) {
                    packageJson.dependencies[dep] = `^${newVersion}`;
                }
            });
        }

        if (packageJson.devDependencies) {
            Object.keys(packageJson.devDependencies).forEach(dep => {
                if (dep.startsWith('formdown-')) {
                    packageJson.devDependencies[dep] = `^${newVersion}`;
                }
            });
        }

        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log(`Updated ${packageDir}/package.json to version ${newVersion}`);
    });

    console.log(`✅ All packages updated to version ${newVersion}`);

    // Auto-commit the version changes
    try {
        execSync('git add packages/*/package.json', { stdio: 'inherit' });
        execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
        console.log(`✅ Version changes committed to git`);
    } catch (error) {
        console.warn('⚠️  Could not auto-commit version changes. Please commit manually.');
        console.warn('   Run: git add packages/*/package.json && git commit -m "chore: bump version to ' + newVersion + '"');
    }
}

const versionType = process.argv[2];
if (!versionType) {
    console.error('Usage: node update-versions.js <patch|minor|major>');
    process.exit(1);
}

updateVersion(versionType);
