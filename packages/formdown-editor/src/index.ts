// Export the class for SDK usage
export { FormdownEditor } from './formdown-editor.js'
export { editorExtensionSupport, EditorExtensionSupport } from './extension-support.js'
export type { EditorPlugin } from './extension-support.js'

// Auto-register the web component when this module is imported
import './formdown-editor.js'

// Utility functions for SDK usage
export const createFormdownEditor = (container: HTMLElement, options: {
    content?: string
    showPreview?: boolean
    showToolbar?: boolean
    placeholder?: string
} = {}) => {
    const editor = document.createElement('formdown-editor') as any

    if (options.content) editor.content = options.content
    if (options.showPreview !== undefined) editor.showPreview = options.showPreview
    if (options.showToolbar !== undefined) editor.showToolbar = options.showToolbar
    if (options.placeholder) editor.placeholder = options.placeholder

    container.appendChild(editor)
    return editor
}

export const registerFormdownEditor = () => {
    // Force registration if not already done
    if (!customElements.get('formdown-editor')) {
        import('./formdown-editor.js')
    }
}
