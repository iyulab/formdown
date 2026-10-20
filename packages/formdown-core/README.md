# @formdown/core

The Formdown parser, generator and tools: read Formdown — Markdown with form fields — into fields and a schema, render it as HTML, edit its source without losing anything, and write fields held as data back as Formdown.

```bash
npm install @formdown/core
```

```typescript
import { parseFormdown, getSchema, generateFormHTML } from '@formdown/core'

const source = '@name*: []\n@email*: @[]\n@notify(Email me about replies): c[switch]'
parseFormdown(source).forms   // the fields, with diagnostics for anything the parser could not read
getSchema(source)             // { name: { type: 'text', required: true, … }, …, notify: { type: 'checkbox', switch: true, … } }
generateFormHTML(source)      // the form as HTML
```

## Entry points

Import only what you use; each subpath carries only what it needs.

| Import | What it gives |
|---|---|
| `@formdown/core` | Everything below, and `FormManager` |
| `@formdown/core/parser` | `FormdownParser` — fields, diagnostics and source positions. It finds front matter but reads its YAML only when given a reader, so it carries no YAML implementation |
| `@formdown/core/front-matter` | `yamlFrontMatter` (the reader to give the parser), `readFrontMatter` |
| `@formdown/core/format` | `formatFormdown(fields)`, `formatField(field)` — fields held as data written as Formdown text; parsing it gives the same fields back |
| `@formdown/core/schema` | `getSchema(content)` — from text or from content already parsed |
| `@formdown/core/generator` | `FormdownGenerator` — HTML from parsed content |
| `@formdown/core/form-manager` | `FormManager` — parse, render, data binding and validation together |
| `@formdown/core/extensions` | Hooks and plugins |

```typescript
import { FormdownParser } from '@formdown/core/parser'
import { yamlFrontMatter } from '@formdown/core/front-matter'

new FormdownParser().parseFormdown(source)                                    // no front matter values
new FormdownParser({ frontMatter: yamlFrontMatter }).parseFormdown(source)    // as parseFormdown() reads them
```

## Documentation

- [Syntax](https://github.com/iyulab/formdown/blob/main/docs/SYNTAX.md) — every field, attribute and diagnostic
- [Core architecture](https://github.com/iyulab/formdown/blob/main/docs/CORE_ARCHITECTURE.md) — the API, source positions and editing, writing fields as text
- [Changelog](https://github.com/iyulab/formdown/blob/main/CHANGELOG.md)

## License

MIT
