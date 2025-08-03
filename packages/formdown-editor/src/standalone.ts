// Standalone entry point for CDN usage
// This file bundles all dependencies and auto-registers the web component

import { FormdownEditor } from './formdown-editor.js'

// Direct import of formdown-ui to ensure it's bundled
import { FormdownUI } from '../../formdown-ui/src/formdown-ui.js'

// Ensure the web component is registered immediately when this script loads
if (!customElements.get('formdown-editor')) {
    customElements.define('formdown-editor', FormdownEditor)
}

// Register formdown-ui
if (FormdownUI && !customElements.get('formdown-ui')) {
    customElements.define('formdown-ui', FormdownUI)
}

// Export for programmatic usage
export { FormdownEditor, createFormdownEditor } from './index.js'
