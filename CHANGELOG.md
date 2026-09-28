# Changelog

All notable changes to the `@formdown/*` packages. The packages share one version.

## 0.5.0

### Breaking changes

- **Quoted attribute values are strings.** `data-code="007"` is `"007"` and `aria-hidden="true"` is `"true"`, and both are rendered as written. Previously quoted values that looked like numbers or booleans were converted, which dropped `spellcheck="false"` from the markup, rendered `aria-hidden="true"` as a bare `aria-hidden`, and turned `"007"` into `7`. Write a value unquoted (`min=0`, `data-open=false`) to get a number or boolean.
- **Backslashes in quoted values**: `\"`, `\'` and `\\` are escapes; any other backslash is kept. `pattern="\d{5}"` is the regular expression `\d{5}`, and `pattern="\\d{5}"` is now also `\d{5}` (it was `\\d{5}`).
- **`FieldProcessor.setFieldValue` is removed** (it was scheduled for removal in 0.4). Use `computeValueSetting`.
- **Node.js 20 or later** is required.

### Added

- **Front matter.** A leading YAML block (`---` … `---` or `...`) is returned as `frontMatter` (`data`, `raw`, `span`) instead of being rendered as a heading. Keys that match a field name become that field's `value`, overriding a `value` written in the field.
- **Diagnostics.** `parseFormdown()` returns `diagnostics` with a code, severity, message and source span: `invalid-field-name`, `duplicate-field-name`, `unterminated-attributes`, `unterminated-quoted-value`, `front-matter-invalid-yaml`, `front-matter-not-mapping`, `hook-error`. Input that used to fall through to plain text silently is now reported.
- **Unicode field names**: `___@증상`, `@名前: [text]`, `___@naïve`.
- **Source spans.** Every field has `span` (0-based offsets into the original text, 1-based line and column).
- **Lossless editing.** `applyEdits(source, edits)` replaces ranges of the original text; `updateFrontMatter(source, changes)` sets or removes front matter keys, creating front matter when needed, and leaves the rest of the document byte for byte unchanged.
- **Extension hooks run.** `pre-parse`, `field-parse`, `post-parse`, `pre-generate`, `field-render` and `post-generate` are now called during parsing and generation (they were declared but never called). `ExtensionManager.transformSync()` and `unregisterHook()`.
- **Relations.** Block fields accept `-> Target` (foreign key) and `<-> Target` (many-to-many); the field gets `relation`.
- Attribute names may contain characters such as `:` and `.` (`x:note`, `data.v`).

### Fixed

- Field syntax inside fenced code blocks and inline code spans is left as text. It used to become a field, with markup injected into the code.
- An escaped quote in a quoted value (`value="He said \"stop\""`) no longer cuts the value short, and a quoted value may contain `]`.
- Attribute values are HTML-escaped when rendered. A value containing a double quote used to break the element.
- A second inline field that shares a name with an earlier one is kept (and reported) instead of being dropped.
- Inline fields on one line are listed in source order.
- An empty quoted value (`placeholder=""`) is kept.

### Deprecated

- `parseFormFields()` and `FormdownParser.parse()`: use `parseFormdown()`.

### Changed

- New dependency: `yaml` (front matter). The standalone and bundled builds of `@formdown/ui` and `@formdown/editor` include it and grow by about 45 KB gzipped.
- Toolchain: marked 18, TypeScript 6, Vite 8, jsdom 30.
