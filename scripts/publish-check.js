#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = [
    'packages/formdown-core',
    'packages/formdown-editor',
    'packages/formdown-ui'
];

function checkPublishReadiness() {
    console.log('🔍 Checking publish readiness...\n');

    let allGood = true;    // Check if we're in a git repository and working directory is clean
    try {
        const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
        if (gitStatus.trim() !== '') {
            console.error('❌ Git working directory is not clean.');
            console.error('   Uncommitted changes detected. This is normal after version update.');
            console.error('   The version update script should have auto-committed the changes.');
            console.error('   If auto-commit failed, please run:');
            console.error('   git add packages/*/package.json && git commit -m "chore: bump version"');
            allGood = false;
        } else {
            console.log('✅ Git working directory is clean');
        }
    } catch (error) {
        console.warn('⚠️  Not in a git repository or git not available');
    }

    // Check if all packages have the same version
    const versions = packages.map(packageDir => {
        const packagePath = path.join(packageDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        return { name: packageJson.name, version: packageJson.version, path: packageDir };
    });

    const firstVersion = versions[0].version;
    const versionMismatch = versions.some(pkg => pkg.version !== firstVersion);

    if (versionMismatch) {
        console.error('❌ Version mismatch detected:');
        versions.forEach(pkg => {
            console.error(`   ${pkg.name}: ${pkg.version}`);
        });
        allGood = false;
    } else {
        console.log(`✅ All packages have version ${firstVersion}`);
    }

    // Check if dist directories exist (built packages)
    packages.forEach(packageDir => {
        const distPath = path.join(packageDir, 'dist');
        if (!fs.existsSync(distPath)) {
            console.error(`❌ Missing dist directory for ${packageDir}. Run 'npm run build:packages' first.`);
            allGood = false;
        } else {
            console.log(`✅ ${packageDir} has been built`);
        }
    });

    // Check if we're logged into npm
    try {
        const whoami = execSync('npm whoami', { encoding: 'utf8', stdio: 'pipe' });
        console.log(`✅ Logged into npm as: ${whoami.trim()}`);
    } catch (error) {
        console.error('❌ Not logged into npm. Run "npm login" first.');
        allGood = false;
    }

    if (!allGood) {
        console.error('\n❌ Pre-publish checks failed. Please fix the issues above.');
        process.exit(1);
    }

    console.log('\n✅ All pre-publish checks passed!');
    return true;
}

checkPublishReadiness();
