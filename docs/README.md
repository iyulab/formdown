# Formdown Documentation

Reference documents for Formdown contributors and advanced users. The guides for people using Formdown are on the website, [formdown.dev/docs](https://formdown.dev/docs), whose source is `site/content/docs/`.

| Document | What it covers | Website page |
|---|---|---|
| [SYNTAX.md](SYNTAX.md) | The full syntax reference | [Syntax](https://formdown.dev/docs/syntax) (a shorter guide) |
| [SHORTHAND_SYNTAX.md](SHORTHAND_SYNTAX.md) | Shorthand field syntax | [Shorthand](https://formdown.dev/docs/shorthand) |
| [HIDDEN_FORM_ARCHITECTURE.md](HIDDEN_FORM_ARCHITECTURE.md) | How fields are tied to generated hidden forms | — |
| [ARCHITECTURE.md](ARCHITECTURE.md) | How the packages fit together | [Architecture](https://formdown.dev/docs/architecture) |
| [CORE_ARCHITECTURE.md](CORE_ARCHITECTURE.md) | The modules of `@formdown/core` | — |
| [EXTENSION_SYSTEM.md](EXTENSION_SYSTEM.md) | The extension API: hooks, field types, plugins | [Extensions](https://formdown.dev/docs/extensions) (same content) |
| [EXTENSION_EXAMPLES.md](EXTENSION_EXAMPLES.md) | Worked extension examples | [Extension Examples](https://formdown.dev/docs/extension-examples) (same content) |
| [STYLING.md](STYLING.md) | Theming with `--formdown-*` properties and `::part()` | [Styling](https://formdown.dev/docs/styling) |
| [TABLE_STYLING.md](TABLE_STYLING.md) | Styling tables in forms | — |

The examples in the extension documents run as tests (`packages/formdown-core/__tests__/extension-docs.test.ts`); change both together.
