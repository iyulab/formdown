// Export the class for SDK usage
export { FormdownUI } from './formdown-ui'
export { uiExtensionSupport, UIExtensionSupport } from './extension-support'
export type { UIPlugin } from './extension-support'

// Auto-register the web component when this module is imported
import './formdown-ui'

// Utility functions for SDK usage
export const createFormdownUI = (container: HTMLElement, options: {
    content?: string
    formId?: string
    showSubmitButton?: boolean
    submitText?: string
} = {}) => {
    const ui = document.createElement('formdown-ui') as any

    if (options.content) ui.content = options.content
    if (options.formId) ui.formId = options.formId
    if (options.showSubmitButton !== undefined) ui.showSubmitButton = options.showSubmitButton
    if (options.submitText) ui.submitText = options.submitText

    container.appendChild(ui)
    return ui
}

export const registerFormdownUI = () => {
    // Force registration if not already done
    if (!customElements.get('formdown-ui')) {
        import('./formdown-ui')
    }
}
