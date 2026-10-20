/**
 * @fileoverview The built-in plugin. It adds nothing to parsing or rendering: every field type
 * Formdown defines is in the core grammar, so a document reads the same whether or not the
 * extension system is initialized. Other plugins can name it in `dependencies`.
 */

import type { Plugin } from './types.js'

export const corePlugin: Plugin = {
    metadata: {
        name: 'formdown-core',
        version: '1.0.0',
        description: 'Field types Formdown adds through its extension system',
        author: 'Formdown Team'
    },
    // No field types: a type defined here would read differently before initialization. A plugin type
    // is also consulted before the core's own, so text, select or range here would replace them.
    fieldTypes: []
}
