// Standalone entry point for CDN usage
// This file bundles all dependencies and auto-registers the web component

import { FormdownUI } from './formdown-ui.js'

// Ensure the web component is registered immediately when this script loads
if (!customElements.get('formdown-ui')) {
    customElements.define('formdown-ui', FormdownUI)
}

// Export for programmatic usage
export { FormdownUI, createFormdownUI } from './index.js'

// Make it available globally for script tag usage
if (typeof window !== 'undefined') {
    (window as any).FormdownUI = FormdownUI
}
