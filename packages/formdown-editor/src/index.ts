// Importing the class registers `<formdown-editor>`.
import { FormdownEditor } from './formdown-editor.js'
export { FormdownEditor }
export { editorExtensionSupport, EditorExtensionSupport } from './extension-support.js'
export type { EditorPlugin } from './extension-support.js'

/** Makes a `<formdown-editor>` with the given properties and appends it to `container`. */
export const createFormdownEditor = (
    container: HTMLElement,
    options: Partial<Pick<FormdownEditor, 'content' | 'mode' | 'placeholder' | 'header' | 'toolbar'>> = {},
): FormdownEditor => {
    const editor = document.createElement('formdown-editor')
    Object.assign(editor, options)
    container.appendChild(editor)
    return editor
}

