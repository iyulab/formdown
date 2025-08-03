# Architecture

## Core-First Architecture (Phase 2 Complete)

Formdown features a revolutionary **Core-First architecture** where the `@formdown/core` package provides comprehensive form management capabilities through the **FormManager** and **4 Core modules**. The UI and Editor packages are thin presentation layers that delegate 100% of their operations to these core APIs.

**Phase 2 Achievement**: Complete legacy code elimination with 100% Core module integration across all packages.

### Package Structure

Formdown is organized as a monorepo with three main packages:

- **@formdown/core** ⭐ - Complete form lifecycle engine with 4 Core modules (depends only on `marked`)
- **@formdown/ui** 🎨 - Web component renderer with 100% Core delegation (1186 lines, 9.3% optimized)
- **@formdown/editor** ✏️ - Development editor with Core-powered real-time preview (505 lines + template consolidation)

### Package Dependencies and Relationships

- **formdown-core**: Core-First architecture hub (depends only on `marked` for markdown processing)
  - **FormManager**: Central API with 12+ methods for complete form lifecycle management
  - **4 Core Modules**: FieldProcessor, DOMBinder, ValidationManager, EventOrchestrator
  - Entry point: `packages/formdown-core/src/index.ts`
  - Main parser: `packages/formdown-core/src/parser.ts` 
  - HTML generator: `packages/formdown-core/src/generator.ts`
  - Extensions system: `packages/formdown-core/src/extensions/`

- **formdown-ui**: Rendering layer with 100% Core integration (depends on formdown-core + Lit)
  - **Phase 2.1 Complete**: Full FormManager delegation, DOMBinder integration
  - Entry point: `packages/formdown-ui/src/index.ts`
  - Main component: `packages/formdown-ui/src/formdown-ui.ts` (1186 lines)
  - Standalone build: `packages/formdown-ui/src/standalone.ts`

- **formdown-editor**: Development layer with 100% Core integration (depends on formdown-core + formdown-ui + Lit)
  - **Phase 2.2 Complete**: Full EventOrchestrator integration, legacy elimination
  - Entry point: `packages/formdown-editor/src/index.ts` 
  - Editor component: `packages/formdown-editor/src/formdown-editor.ts` (505 lines)
  - Standalone build: `packages/formdown-editor/src/standalone.ts`

### Build System Architecture

Each package uses different build configurations:

- **Core**: TypeScript compilation only (`tsc`)
- **UI/Editor**: Vite with multiple output formats:
  - ES modules for bundlers (`dist/index.es.js`)
  - UMD for direct usage (`dist/index.umd.js`) 
  - Standalone builds for CDN (`dist/standalone.js`)
  - TypeScript definitions (`dist/index.d.ts`)

## Core-First Design Pattern (Phase 2 Implementation)

The Core-First architecture ensures complete business logic centralization through 4 specialized Core modules:

1. **Business Logic Centralization**: 100% of form operations handled by Core modules
2. **Framework Independence**: Core functionality works without any UI framework
3. **Consistent Behavior**: All UI layers share identical Core-powered behavior
4. **Modular Architecture**: 4 specialized modules for different concerns
5. **Better Performance**: Optimized Core with thin presentation layers

### FormManager + 4 Core Modules Architecture

**FormManager** serves as the central coordinator for:
- **FieldProcessor**: Field type processing, validation, and value extraction
- **DOMBinder**: DOM manipulation, event handling, and data synchronization
- **ValidationManager**: Async validation pipelines with caching and debouncing
- **EventOrchestrator**: Component-to-component event coordination and bridging

### Enhanced Data Flow (Phase 2)

```
User Input → UI Component → FormManager
    ↓              ↓              ↓
EventOrchestrator → FieldProcessor → DOMBinder
    ↓              ↓              ↓
Event Coordination → Validation → DOM Updates
    ↓              ↓              ↓
Component Bridge → ValidationManager → Data Persistence
```

### Core Module Responsibilities

- **FieldProcessor**: `extractFieldValue()`, `setFieldValue()`, `processCheckboxGroup()`
- **DOMBinder**: `setupElementEventHandlers()`, `syncFormData()`, `clearAllBindings()`
- **ValidationManager**: `validateAsync()`, `registerValidator()`, `dispose()`
- **EventOrchestrator**: `createCoreUIBridge()`, `bridgeComponentEvents()`, `dispose()`

## Hidden Form Architecture

Formdown uses a hidden form architecture to ensure maximum compatibility and progressive enhancement.

### How It Works

1. **Dual Rendering**: Each field is rendered twice:
   - Once in a hidden `<form>` element with standard HTML inputs
   - Once in the visible UI with enhanced styling and interactions

2. **Value Synchronization**: JavaScript keeps both representations in sync:
   - User interactions with the visible UI update the hidden form fields
   - Form submissions use the hidden form's data

3. **Progressive Enhancement**: If JavaScript fails:
   - The hidden form can be made visible via CSS
   - Forms remain fully functional with standard HTML behavior

### Benefits

- **Accessibility**: Screen readers work with standard form elements
- **Browser Compatibility**: Works with all form-related browser features
- **Framework Integration**: Easy to integrate with any form library
- **SEO Friendly**: Search engines can understand the form structure
- **Graceful Degradation**: Forms work even without JavaScript

### Implementation Example

```html
<!-- Hidden form (actual form data) -->
<form id="formdown-form-1" style="display: none;">
  <input type="text" name="username" required>
  <input type="email" name="email" required>
</form>

<!-- Visible UI (enhanced presentation) -->
<div class="formdown-field">
  <label for="username">Username</label>
  <input type="text" id="username" class="formdown-input" required>
</div>
```

## Extension System Architecture

The extension system allows developers to extend Formdown's functionality through plugins and hooks.

### Extension Manager

The ExtensionManager orchestrates all extensions:

```typescript
interface ExtensionManager {
  registerPlugin(plugin: Plugin): Promise<void>
  executeHooks(hookType: HookType, context: HookContext): Promise<HookContext>
  getPluginInfo(pluginName: string): PluginInfo | null
  listPlugins(): PluginInfo[]
}
```

### Plugin Structure

Plugins can provide:

- **Field Types**: Custom field type definitions
- **Validators**: Custom validation logic
- **Renderers**: Custom HTML generation
- **Hooks**: Intercept and modify processing at various stages

### Hook System

Hooks allow fine-grained control over the parsing and generation pipeline:

- `pre-parse`: Modify content before parsing
- `post-parse`: Modify parse results
- `field-parse`: Custom field parsing logic
- `field-validate`: Custom validation rules
- `pre-generate`: Modify data before HTML generation
- `post-generate`: Modify generated HTML
- `css-class`: Add custom CSS classes
- `attribute-inject`: Add custom HTML attributes

### Event System

The extension system is event-driven:

```typescript
interface EventEmitter {
  on(event: string, handler: Function): void
  off(event: string, handler: Function): void
  emit(event: string, data: any): void
}
```

## Testing Architecture

### Test Structure

- **Unit Tests**: Each package has comprehensive unit tests
- **Integration Tests**: Test interactions between packages
- **E2E Tests**: Test complete user workflows

### Test Configuration

- **Jest**: Unit testing framework
- **@testing-library/dom**: DOM testing utilities
- **JSDOM**: Browser environment simulation
- **Mock Files**: Located in `__tests__/mocks/`

### Test Patterns

```typescript
// Example test pattern
describe('FormManager', () => {
  let manager: FormManager
  
  beforeEach(() => {
    manager = new FormManager()
  })
  
  test('should parse formdown content', () => {
    const result = manager.parse('@name: [text required]')
    expect(result.forms).toHaveLength(1)
    expect(result.forms[0].name).toBe('name')
  })
})
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: UI components load only when needed
2. **Tree Shaking**: Unused code is eliminated during build
3. **Code Splitting**: Separate bundles for different features
4. **Memoization**: Cache expensive computations
5. **Virtual DOM**: Efficient UI updates with Lit

### Bundle Sizes

- Core package: ~15KB minified + gzipped
- UI package: ~25KB minified + gzipped (includes Lit)
- Editor package: ~35KB minified + gzipped

## Security Architecture

### Input Sanitization

All user input is sanitized to prevent XSS attacks:

- Field names are validated against allowed characters
- HTML attributes are filtered through an allowlist
- Generated HTML is escaped by default

### Content Security Policy

Formdown is designed to work with strict CSP:

- No inline scripts
- No eval() usage
- Event handlers use addEventListener

### Data Privacy

- No data is sent to external servers
- All processing happens client-side
- Form data is only accessible to the host application