// Standalone entry point for CDN usage
// This file bundles all dependencies and auto-registers the web component

import { FormdownEditor } from './formdown-editor.js'

// Ensure the web component is registered immediately when this script loads
if (!customElements.get('formdown-editor')) {
    customElements.define('formdown-editor', FormdownEditor)
}

// Also register formdown-ui if available
async function registerFormdownUI() {
    try {
        // Using any to bypass type checking for optional dependency
        const formdownUIModule = await import('@formdown/ui' as any)
        const FormdownUI = formdownUIModule?.FormdownUI
        if (FormdownUI && !customElements.get('formdown-ui')) {
            customElements.define('formdown-ui', FormdownUI)
        }
    } catch (error) {
        console.warn('formdown-ui not available for auto-registration:', error)
    }
}

registerFormdownUI()

// Export for programmatic usage
export { FormdownEditor, createFormdownEditor } from './index.js'

// Make it available globally for script tag usage
if (typeof window !== 'undefined') {
    (window as any).FormdownEditor = FormdownEditor
}
