# Publishing Guide

This guide explains how to publish Formdown packages to npm with synchronized versioning.

## Prerequisites

1. **npm account**: You need an npm account with publish permissions
2. **npm login**: Run `npm login` and authenticate
3. **Clean workspace**: Ensure your git working directory is clean
4. **Built packages**: All packages must be built before publishing

## Publishing Commands

### Quick Release (Recommended)

For patch releases (bug fixes):
```bash
npm run release:patch
```

For minor releases (new features):
```bash
npm run release:minor
```

For major releases (breaking changes):
```bash
npm run release:major
```

These commands will:
1. Update version numbers across all packages
2. Build all packages
3. Run pre-publish checks
4. Publish to npm
5. Create a git tag

### Manual Process

If you need more control, you can run the steps individually:

```bash
# 1. Update versions
npm run version:patch  # or version:minor, version:major

# 2. Build packages
npm run build:packages

# 3. Run checks
npm run publish:check

# 4. Publish
npm run publish:packages
```

## Package Structure

### Monorepo Organization

Formdown uses a monorepo structure with shared configuration:

- **Root `package.json`**: Contains shared metadata (author, license, repository, etc.)
- **Package-specific**: Each package only defines unique properties (name, description, specific keywords)

### Package Metadata Inheritance

Common properties defined in root:
- `author`: "Formdown Team"
- `license`: "MIT"  
- `repository.url`: "https://github.com/formdown/formdown.git"
- `homepage`: "https://formdown.dev"
- `keywords`: Base keywords shared across packages

Package-specific properties:
- `name`: Scoped package name (`@formdown/core`, etc.)
- `description`: Package-specific description
- `keywords`: Additional package-specific keywords
- `repository.directory`: Package subdirectory

## Version Management

All three packages (`@formdown/core`, `@formdown/editor`, `@formdown/ui`) always share the same version number. The version update script automatically:

- Updates the version in all package.json files
- Updates internal dependencies between formdown packages
- Maintains consistency across the monorepo

## Pre-publish Checks

The publish process includes automatic checks for:

- ✅ Clean git working directory
- ✅ Version consistency across packages
- ✅ Built packages (dist directories exist)
- ✅ npm authentication

## Package Scope

All packages are published under the `@formdown` scope:

- `@formdown/core` - Core parsing and generation engine
- `@formdown/editor` - Interactive editor web component
- `@formdown/ui` - Pure HTML renderer web component

## Troubleshooting

### "You cannot publish over the previously published versions"

This means the version already exists on npm. Update the version first:
```bash
npm run version:patch
npm run publish:packages
```

### "Not logged into npm"

Run `npm login` and authenticate with your npm account.

### "Missing dist directory"

Build the packages first:
```bash
npm run build:packages
```

### Git working directory not clean

Commit or stash your changes:
```bash
git add .
git commit -m "Your commit message"
```

## Git Tags

After successful publishing, a git tag is automatically created (e.g., `v0.1.1`). To push it to the remote repository:

```bash
git push origin v0.1.1
```

Or push all tags:
```bash
git push --tags
```
