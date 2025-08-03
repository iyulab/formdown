/**
 * Common utility functions for creating and managing web components
 */

/**
 * Create a web component and append it to a container
 */
export function createWebComponent<T>(
    tagName: string, 
    container: HTMLElement, 
    options: Record<string, any> = {}
): T {
    const element = document.createElement(tagName) as any
    
    Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
            element[key] = value
        }
    })
    
    container.appendChild(element)
    return element
}

/**
 * Create FormdownUI component
 */
export function createFormdownUI(
    container: HTMLElement,
    content: string,
    options: Partial<{
        formId: string
        showSubmitButton: boolean
        submitText: string
        validateOnSubmit: boolean
    }> = {}
) {
    return createWebComponent('formdown-ui', container, {
        content,
        ...options
    })
}

/**
 * Create FormdownEditor component
 */
export function createFormdownEditor(
    container: HTMLElement,
    content: string,
    options: Partial<{
        mode: 'edit' | 'split' | 'view'
        placeholder: string
        header: boolean
        toolbar: boolean
    }> = {}
) {
    return createWebComponent('formdown-editor', container, {
        content,
        ...options
    })
}

/**
 * Common component lifecycle utilities
 */
export class ComponentLifecycle {
    private static instances = new WeakMap<HTMLElement, any>()
    
    static register(element: HTMLElement, instance: any) {
        this.instances.set(element, instance)
    }
    
    static get(element: HTMLElement) {
        return this.instances.get(element)
    }
    
    static cleanup(element: HTMLElement) {
        this.instances.delete(element)
    }
}