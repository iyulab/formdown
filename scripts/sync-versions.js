#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 루트 package.json에서 버전 가져오기
const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const targetVersion = rootPackageJson.version;

console.log(`🔄 Syncing all packages to version: ${targetVersion}`);

// 패키지 디렉토리들
const packages = [
    'packages/formdown-core',
    'packages/formdown-ui',
    'packages/formdown-editor'
];

// 모든 패키지 버전 동기화
packages.forEach(packageDir => {
    const packageJsonPath = path.join(packageDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const oldVersion = packageJson.version;
    packageJson.version = targetVersion;

    // 내부 의존성도 업데이트
    if (packageJson.dependencies) {
        Object.keys(packageJson.dependencies).forEach(dep => {
            if (dep.startsWith('@formdown/')) {
                packageJson.dependencies[dep] = targetVersion;
            }
        });
    }

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`✅ ${packageDir}: ${oldVersion} → ${targetVersion}`);
});

// Site 버전도 동기화
const sitePackageJsonPath = 'site/package.json';
if (fs.existsSync(sitePackageJsonPath)) {
    const sitePackageJson = JSON.parse(fs.readFileSync(sitePackageJsonPath, 'utf8'));
    const oldSiteVersion = sitePackageJson.version;
    sitePackageJson.version = targetVersion;
    fs.writeFileSync(sitePackageJsonPath, JSON.stringify(sitePackageJson, null, 2));
    console.log(`✅ site: ${oldSiteVersion} → ${targetVersion}`);
}

console.log('🎉 Version sync completed!');