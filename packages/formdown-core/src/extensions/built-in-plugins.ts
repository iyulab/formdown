/**
 * @fileoverview The built-in plugin, which adds the field types the core parser and generator
 * do not have.
 */

import type { Plugin } from './types.js'
import { toggleFieldPlugin } from './field-types/toggle-field.js'

export const corePlugin: Plugin = {
    metadata: {
        name: 'formdown-core',
        version: '1.0.0',
        description: 'Field types Formdown adds through its extension system',
        author: 'Formdown Team'
    },
    // Only types the core parser and generator do not have. A plugin type is consulted before the
    // core's own, so registering text, select or range here would replace their parsing and rendering.
    fieldTypes: [
        toggleFieldPlugin
    ]
}
