#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// 루트 package.json에서 버전 가져오기
const rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const targetVersion = rootPackageJson.version;

console.log(`🎯 Publishing version: ${targetVersion}`);

// 패키지 디렉토리들
const packages = [
    'packages/formdown-core',
    'packages/formdown-ui',
    'packages/formdown-editor'
];

// 1. 모든 패키지 빌드 (버전 동기화 포함)
console.log('\n🔨 Building all packages...');
try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

// 2. 모든 테스트 실행
console.log('\n🧪 Running all tests...');
try {
    execSync('npm test', { stdio: 'inherit' });
    console.log('✅ All tests passed');
} catch (error) {
    console.error('❌ Tests failed:', error.message);
    process.exit(1);
}

// 3. 패키지들을 NPM에 배포
console.log('\n🚀 Publishing packages to NPM...');
packages.forEach(packageDir => {
    try {
        console.log(`📤 Publishing ${packageDir}...`);
        execSync('npm publish', {
            cwd: packageDir,
            stdio: 'inherit'
        });
        console.log(`✅ ${packageDir} published successfully`);
    } catch (error) {
        console.error(`❌ Failed to publish ${packageDir}:`, error.message);
        process.exit(1);
    }
});

// 4. Site 정적 빌드 및 publish 폴더 생성
console.log('\n🏗️ Site already built during npm run build');

console.log('\n🎉 All done!');
console.log(`✅ Version ${targetVersion} published successfully`);
console.log('📦 NPM packages: @formdown/core, @formdown/ui, @formdown/editor');
console.log('🌐 Site: Ready for deployment in site/out/');