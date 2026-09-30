/**
 * The editor's own logic, run without rendering: the completion it inserts as a field is typed,
 * and `createFormdownEditor`.
 */
import { FormdownEditor } from '../src/formdown-editor';
import { createFormdownEditor } from '../src/index';

/** Types `text` at the end of `before` in a text area, as the editor sees it. */
function type(editor: FormdownEditor, before: string, text: string, inputType = 'insertText') {
    const area = document.createElement('textarea');
    document.body.appendChild(area);
    area.value = before + text;
    area.setSelectionRange(area.value.length, area.value.length);
    const event = new InputEvent('input', { inputType, data: text });
    Object.defineProperty(event, 'target', { value: area });
    (editor as any).handleInput(event);
    return area;
}

describe('completing a field as it is typed', () => {
    let editor: FormdownEditor;
    beforeEach(() => {
        editor = new FormdownEditor();
        (editor as any).formManager = { parse: () => {}, getFields: () => [] };
    });

    it('gives three underscores after text an @ for the field name, the caret after it', () => {
        const area = type(editor, '이름: __', '_');
        expect(area.value).toBe('이름: ___@');
        expect(area.selectionStart).toBe(area.value.length);
        expect(editor.content).toBe('이름: ___@');
    });

    it('gives a block field its brackets, the caret inside', () => {
        const area = type(editor, '@status:', ' ');
        expect(area.value).toBe('@status: []');
        expect(area.selectionStart).toBe('@status: ['.length);
    });

    it('leaves anything else, and input that is not typing, as it is', () => {
        expect(type(editor, 'plain', ' text').value).toBe('plain text');
        expect(type(editor, '이름: __', '_', 'insertFromPaste').value).toBe('이름: ___');
    });
});

describe('createFormdownEditor', () => {
    it('makes an editor with the given properties, in the container', () => {
        const container = document.createElement('div');
        const editor = createFormdownEditor(container, { content: '@name: [text]', mode: 'edit', toolbar: false });
        expect(container.firstElementChild).toBe(editor);
        expect(editor.content).toBe('@name: [text]');
        expect(editor.mode).toBe('edit');
        expect(editor.toolbar).toBe(false);
    });
});
