const fs = require('fs');
const path = require('path');

function generateVersionInfo() {
    const packagesDir = path.join(__dirname, '../../packages');
    const publicDir = path.join(__dirname, '../public');

    // Ensure public directory exists
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
    }

    const versionInfo = {
        site: {
            name: 'formdown-site',
            version: '0.1.0',
            description: 'Formdown documentation and demo site'
        },
        packages: {}
    };

    // Read package information from each package
    const packages = ['formdown-core', 'formdown-ui', 'formdown-editor'];

    packages.forEach(packageName => {
        const packageJsonPath = path.join(packagesDir, packageName, 'package.json');

        if (fs.existsSync(packageJsonPath)) {
            try {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                versionInfo.packages[packageName] = {
                    name: packageJson.name || packageName,
                    version: packageJson.version || '0.1.0',
                    description: packageJson.description || ''
                };
            } catch (error) {
                console.warn(`Warning: Could not read ${packageJsonPath}:`, error.message);
                // Fallback version info
                versionInfo.packages[packageName] = {
                    name: packageName,
                    version: '0.1.0',
                    description: ''
                };
            }
        } else {
            console.warn(`Warning: Package ${packageName} not found at ${packageJsonPath}`);
            // Fallback version info
            versionInfo.packages[packageName] = {
                name: packageName,
                version: '0.1.0',
                description: ''
            };
        }
    });

    // Use core package version as main version
    const corePackage = versionInfo.packages['formdown-core'];
    if (corePackage) {
        versionInfo.main = {
            name: 'formdown',
            version: corePackage.version,
            description: 'A declarative form builder using markdown-like syntax'
        };
    } else {
        versionInfo.main = {
            name: 'formdown',
            version: '0.1.0',
            description: 'A declarative form builder using markdown-like syntax'
        };
    }

    // Write version info to public directory
    const outputPath = path.join(publicDir, 'version-info.json');
    fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));

    console.log('✅ Version info generated successfully:', outputPath);
    console.log('📦 Main version:', versionInfo.main.version);
    console.log('📦 Packages:', Object.keys(versionInfo.packages).map(pkg =>
        `${pkg}@${versionInfo.packages[pkg].version}`
    ).join(', '));
}

if (require.main === module) {
    generateVersionInfo();
}

module.exports = { generateVersionInfo };
