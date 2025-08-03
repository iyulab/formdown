#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packages = [
    'packages/formdown-core',
    'packages/formdown-editor',
    'packages/formdown-ui'
];

function publishPackages() {
    console.log('🚀 Publishing packages to npm...\n');

    const publishOrder = packages; // Publish in order to handle dependencies

    for (const packageDir of publishOrder) {
        const packagePath = path.join(packageDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

        console.log(`📦 Publishing ${packageJson.name}@${packageJson.version}...`);

        try {
            // Change to package directory and publish
            process.chdir(packageDir);
            execSync('npm publish --access public', { stdio: 'inherit' });
            console.log(`✅ Successfully published ${packageJson.name}@${packageJson.version}`);

            // Change back to root
            process.chdir('../../');
        } catch (error) {
            console.error(`❌ Failed to publish ${packageJson.name}:`, error.message);

            // If it's a version already exists error, continue with other packages
            if (error.message.includes('You cannot publish over the previously published versions')) {
                console.warn(`⚠️  ${packageJson.name}@${packageJson.version} already exists, skipping...`);
                process.chdir('../../');
                continue;
            }

            process.chdir('../../');
            process.exit(1);
        }
    }

    console.log('\n🎉 All packages published successfully!');

    // Create git tag for the release
    try {
        const firstPackagePath = path.join(packages[0], 'package.json');
        const firstPackage = JSON.parse(fs.readFileSync(firstPackagePath, 'utf8'));
        const version = firstPackage.version;

        console.log(`\n🏷️  Creating git tag v${version}...`);
        execSync(`git tag v${version}`, { stdio: 'inherit' });
        console.log(`✅ Created git tag v${version}`);

        console.log('\n💡 To push the tag to remote, run:');
        console.log(`   git push origin v${version}`);
    } catch (error) {
        console.warn('⚠️  Could not create git tag:', error.message);
    }
}

publishPackages();
