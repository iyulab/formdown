// Export the class for SDK usage
export { FormdownUI } from './formdown-ui'
export { uiExtensionSupport, UIExtensionSupport } from './extension-support'
export type { UIPlugin } from './extension-support'
export type { FieldState, FieldStates } from './field-states'
export type { Choice, Choices } from './choices'

// Auto-register the web component when this module is imported
import './formdown-ui'

// Utility functions for SDK usage
export const createFormdownUI = (container: HTMLElement, options: {
    content?: string
} = {}) => {
    const ui = document.createElement('formdown-ui') as any

    if (options.content) ui.content = options.content

    container.appendChild(ui)
    return ui
}

export const registerFormdownUI = () => {
    // Component is already registered via static import above
    // This function is kept for API compatibility
}
