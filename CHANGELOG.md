# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.14] - 2025-07-29

### 🎉 Major Features Added

#### Value Attribute System
- **NEW**: Comprehensive default value support for all field types using `value` attribute
- **NEW**: Type-aware value processing with automatic conversion for numbers, booleans, dates
- **NEW**: Selection field pre-selection for radio buttons, checkboxes, and select dropdowns
- **NEW**: Boolean value support (`value=true/false`) for single checkboxes
- **NEW**: Multiple value support (`value="A,B,C"`) for checkbox groups
- **NEW**: Range input default positioning with `value` attribute

#### Hidden Form Architecture
- **NEW**: Revolutionary form system that separates form definition from field positioning
- **NEW**: `@form[attributes]` declaration syntax for form definition
- **NEW**: Hidden form elements with HTML5 `form` attribute association
- **NEW**: Multiple forms support in a single document
- **NEW**: Automatic form ID generation (formdown-form-1, formdown-form-2...)
- **NEW**: Explicit form association via `form="form-id"` attribute
- **NEW**: Clean CSS styling without form wrapper interference

#### Core Integration Improvements
- **IMPROVED**: Complete @formdown/editor core API integration
- **REMOVED**: Deprecated `SimpleFormdownParser` in favor of unified core parser
- **IMPROVED**: Schema-based validation system across all packages
- **IMPROVED**: Extension system integration in UI and Editor packages
- **IMPROVED**: API consistency across all packages

### 🔧 Technical Improvements

#### Parser Enhancements
- **ADDED**: `value` attribute parsing for all field types
- **ADDED**: Form declaration parsing with attribute support
- **ADDED**: Field-to-form association logic
- **IMPROVED**: Attribute parsing with proper type conversion
- **IMPROVED**: Error handling for invalid form references

#### Generator Updates
- **ADDED**: Hidden form HTML generation
- **ADDED**: Default value HTML generation for all field types
- **ADDED**: Proper `selected`, `checked`, and `value` attribute generation
- **IMPROVED**: HTML sanitization and security for default values
- **IMPROVED**: Form association via HTML5 `form` attribute

#### Type System
- **ADDED**: `value?: any` property to Field interface
- **IMPROVED**: TypeScript definitions for new architecture
- **IMPROVED**: Type safety for form declarations and associations

### 🧪 Testing
- **ADDED**: 16 comprehensive tests for value attribute functionality
- **ADDED**: 20 tests for Hidden Form Architecture
- **ADDED**: Integration tests for multi-form scenarios
- **ADDED**: Edge case and error handling tests
- **IMPROVED**: Test coverage for all new features

### 📚 Documentation
- **UPDATED**: Complete syntax reference with new features
- **UPDATED**: Architecture documentation with Hidden Form details
- **UPDATED**: Task management and project status documentation
- **ADDED**: Comprehensive examples for all new features
- **ADDED**: Migration guides and best practices

### 🎯 Performance & Compatibility
- **MAINTAINED**: 100% backward compatibility with existing forms
- **IMPROVED**: Build system consistency across packages
- **FIXED**: Module export issues between packages
- **OPTIMIZED**: Test execution and CI/CD pipeline

### 📦 Package Updates
- **@formdown/core**: Updated to support Hidden Form Architecture and Value Attributes
- **@formdown/ui**: Integrated with core extension system and new architecture
- **@formdown/editor**: Migrated to use core APIs exclusively
- **All packages**: Version bumped to 0.1.14 with coordinated release

---

## [0.1.13] - 2025-07-15

### 🔌 Extension System
- **NEW**: Complete plugin architecture with 14 hook types
- **NEW**: Field Type Registry for custom field types
- **NEW**: Plugin Manager with lifecycle management
- **NEW**: Event system for plugin communication
- **NEW**: Built-in plugins for text, email, select field types
- **NEW**: Error handling and performance management
- **NEW**: TypeScript support for third-party plugins

### 📋 Field Helper API
- **NEW**: FormdownFieldHelper API for programmatic form interaction
- **NEW**: Automatic "other" option handling
- **NEW**: Predictable interface across all field types
- **NEW**: Clean data structure without internal field suffixes

### 📚 Documentation
- **NEW**: EXTENSION_SYSTEM.md with complete API reference
- **NEW**: EXTENSION_EXAMPLES.md with 15 real-world examples
- **NEW**: Developer guidelines and best practices

### 🧪 Testing
- **ADDED**: 30 extension system tests
- **ADDED**: Integration tests for plugin lifecycle
- **ADDED**: Performance and error handling tests

---

## [0.1.12] - Previous Release

### Smart Field Ordering
- **NEW**: Fields maintain exact position in markdown content
- **IMPROVED**: Natural content flow preservation
- **ENHANCED**: Multi-section form support

### Custom "Other" Options
- **NEW**: `*(Custom Label)` syntax for contextual "other" labels
- **IMPROVED**: Clean data structure without `_other` suffixes
- **ENHANCED**: Support across all selection field types

### Quality Improvements
- **IMPROVED**: Test coverage and reliability
- **ENHANCED**: Documentation and examples
- **OPTIMIZED**: Build and distribution process

---

For complete release notes and migration guides, see [TASKS.md](./docs/TASKS.md).