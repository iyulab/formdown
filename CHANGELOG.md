# Changelog

All notable changes to the `@formdown/*` packages. The packages share one version.

## Unreleased

### Fixed

- `@formdown/ui` shows a value a date, time, number, range or color field cannot hold — "next week" in a date field, "1,000" in a number field — beside the field, instead of an empty field. The browser drops such a value from the input, while the form's data keeps it and reports it unchanged; now the person sees it too. The input is marked `data-formdown-unread` and described by the shown value (`.formdown-unread`, `part="unread-value"`), which gives way once the field is given a value of its own.

## 0.12.1

### Fixed

- `@formdown/ui` `focusField(name)` puts the caret at the end of the field's value instead of selecting it, so a host returning a person to the field they were writing in (after a save, say) does not have the next keystroke replace the value. A person moving into a field still gets its value selected.

## 0.12.0

### Added

- `@formdown/ui` `choices` property: values the host offers for each field, `{ value, label? }`. Selects and radio or checkbox groups list them after their own options; fields one types into list them through a `<datalist>`. Added choices are marked `data-formdown-choice`, and a value the host offers is no longer shown as one nobody offers.
- `@formdown/ui` `focusField(name?)`: focuses a field — for a choice group its chosen option — or with no name the first field a person can reach, skipping fields a condition hides or turns off. Answers whether a field took focus, so a host can put the cursor in a new form, or back in the field being worked on after drawing the form again.
- `@formdown/core` `duplicate-field-name` diagnostics carry the field's name (`field`) and the `span` of the occurrence reported, so an editor can point at it. `Diagnostic` has an optional `field` for problems about a field.

### Changed

- `@formdown/ui` inline text fields grow with their value up to the width of the line, instead of stopping at 200px and truncating short values.

## 0.11.0

### Added

- `@formdown/ui` applies `visible-if`, `hidden-if`, `enabled-if`, `disabled-if` and `required-if` as values change. A hidden or disabled field keeps its value.
- `@formdown/core` `conditionState(conditions, data)` and `conditionHolds(condition, data)`: what a field's conditions make of it for a form's values.

### Changed

- `@formdown/core` `validateForm` asks for a field its `required-if` makes required, and no longer asks for one its conditions hide or disable.

### Fixed

- A condition naming a field outside ASCII (`visible-if="구분=법인"`) was dropped by the parser; it names fields the way fields are named.

## 0.10.2

### Fixed

- A select, radio group or checkbox group given a value its options do not offer — from front matter or data written elsewhere, or saved before an option was renamed — shows that value as an extra choice after the offered ones, chosen and marked `data-formdown-unlisted`. It rendered as an empty choice, so the value could not be seen, and nothing in the field could be chosen to keep it. `@formdown/core` renders such values with the source; `@formdown/ui` also adds them when they arrive as `data` later. Fields with an "other" choice are unchanged.

## 0.10.1

### Fixed

- `@formdown/ui` shows an inline field's value from its start once focus leaves it. A value longer than the field stayed scrolled to where typing ended, with its first characters cut off.
- `@formdown/ui` hands focus back to a field when the offered value or the decline button that held focus is drawn away — picking or declining a suggestion no longer leaves focus on the page, where keyboard input stops reaching the form.

## 0.10.0

### Added

- `@formdown/editor` completes a field as it is typed into the source, with `authoringCompletion` from `@formdown/core`: `@` after three underscores that follow other text on the line, `[]` after `@name: ` at the start of a line. One undo takes the completion away.

### Changed

- `@formdown/editor` `createFormdownEditor(container, options)` takes the element's own properties — `content`, `mode`, `placeholder`, `header`, `toolbar` — and returns a typed `FormdownEditor`. The `showPreview` and `showToolbar` options it took before set properties the element does not have, and did nothing.
- `@formdown/editor` `formdown-data-update` carries `detail.formData`, as `<formdown-ui>`'s does. It carried the values as `detail` itself.
- `@formdown/editor` builds `@formdown/core` and `@formdown/ui` as dependencies of its module, not into it.

### Fixed

- `@formdown/ui` reports a field's value only when it changed. Leaving a field as it was — a blur, or the change event after the input that already reported the value — fired `formdown-change` and `formdown-data-update` again, so a host could not tell looking at a field from editing it; a field removed while it held focus reported its blur after it was gone.
- `@formdown/editor` registers the `<formdown-ui>` its preview draws. Imported without `@formdown/ui`, the preview stayed at "Loading form preview..." — only the standalone bundle worked.

### Removed

- `@formdown/core` no longer exports `createFormdownUI`, `createFormdownEditor`, `createWebComponent` or `ComponentLifecycle`. The first two made elements that `@formdown/core` does not define; use `createFormdownUI` from `@formdown/ui` and `createFormdownEditor` from `@formdown/editor`, which register them.
- `@formdown/editor`'s hand-written `types.d.ts`, which described properties the element no longer had; its types come from the source.

## 0.9.0

### Added

- `@formdown/core` `authoringCompletion(source, caret)`: what completes a field a person has just started writing in a source editor — `@` after three underscores that follow other text on the line (`Name: ___` → `Name: ___@`), `[]` with the caret inside after `@name: ` at the start of an otherwise empty line — or `null`. A line of underscores alone (a Markdown rule), front matter, fenced code blocks and inline code are left alone.

### Fixed

- `@formdown/ui` and `@formdown/editor` no longer name `dist/standalone.umd.js` as the `require` entry of `./standalone`. The standalone bundle is built as an ES module only and that file never existed; `require('@formdown/ui/standalone')` failed to resolve it.

## 0.8.1

### Fixed

- `@formdown/ui` and `@formdown/editor` ship their type declarations. Both packages named `dist/index.d.ts` as their types, but the build never wrote it, so a TypeScript consumer importing from them (`import type { FieldStates } from '@formdown/ui'`) got no types.

## 0.8.0

### Added

- `@formdown/core` `setFieldAttribute(source, field, key, value)`: sets or removes one attribute of a field, found by name, leaving the rest of the source byte for byte — for authoring tools that edit a form's source, such as changing a select's options. Options written in braces after the name are edited there.

- `@formdown/ui` `fieldStates` takes `decline`: the label of a button, drawn after the offered values, that says none of them is wanted. Clicking it fires `formdown-suggestion-decline` with `{ field }`; the form is left as it is.

### Fixed

- A block field with the required marker and a type named in its brackets (`@status*: [select options="Open,Closed"]`, `@tone(Tone)*: [radio …]`) is that type, with its options. It was read as a text field with a `select` attribute, and its options were lost.

## 0.7.0

### Added

- `@formdown/ui` `fieldStates`: a host can say, per field, which values it offers and give a short note. The first offered value shows in the empty field in place of its placeholder, every offered value is listed by the field as a button, and an offered option of a radio or checkbox group is marked. Picking one fires `formdown-suggestion-pick` with `{ field, value }`; the value goes into the field only when the host sets it through `data`.

### Fixed

- `@formdown/ui` draws checkboxes and radio buttons in `--formdown-accent-color`, as it already did for focused inputs; they were left in the browser's default color whatever the theme.
- `@formdown/ui` inline fields take their background, border and focus ring from the theme (`--formdown-bg-secondary`, `--formdown-border-color`, `--formdown-input-focus-ring`); they were drawn in fixed light colors, so an empty inline field stood out as a light box in a dark theme.

### Removed

- `@formdown/ui` `<formdown-ui>` no longer declares `submitText` (`submit-text`), `showSubmitButton` (`show-submit-button`), `formId` (`form-id`) or `selectOnFocus` (`select-on-focus`). None of them changed what was drawn; a submit button comes from the content (`@submit: [submit label="…"]`). `createFormdownUI` in `@formdown/ui` takes only `content`, and in `@formdown/core` only `container` and `content`.

### Documentation

- The `@formdown/ui` README lists the element's actual properties, methods and events (`form-submit` with `detail.formData`, `formdown-change`, `formdown-data-update`, `validation-error`), and its examples use the current syntax.

## 0.6.0

### Added

- `readFrontMatter(source)` is exported from `@formdown/core`: a document's front matter — the same `frontMatter` `parseFormdown` reports, with its diagnostics — without parsing the fields. Reading only the front matter of many documents is several times faster than parsing each one in full.

## 0.5.1

### Documentation

- The label rule for field names is stated as it behaves: one rule for every script — underscores and camelCase boundaries become spaces and letters with case are capitalized (`naïve` → "Naïve"); scripts without case keep their characters (`재현_절차` → "재현 절차"). It previously said non-ASCII names were used unchanged.

### Fixed

- **Inline fields show their value.** An inline field (`___@title`) bound to a front matter key, or written with `value="…"`, rendered its label instead of its value. Inline fields are now rendered by the generator like block fields — from the final field — so they show the bound value, HTML-escaped, and the `field-render` hook applies to them. `parseFormdown().markdown` holds a field placeholder where it used to hold finished markup.
- An inline field's label is HTML-escaped when it is shown in place of a value; it used to be inserted as markup.
- **Checkbox and radio values in `<formdown-ui>`.** Values given through `data` or `setFormData()` are shown the way the generator renders them: a single checkbox is checked by `true` or `"true"` and unchecked by anything else, a checkbox-group option is checked when the value (a list, or one text) names it, and only the radio whose value matches is checked. `setFormData()` used to check a checkbox for any non-empty text, `"false"` included, and to check the first radio of a group whatever the value; `data` ignored a checkbox value given as text.

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
