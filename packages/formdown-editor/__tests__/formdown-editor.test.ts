/**
 * The editor's own logic, run without rendering: the completion it inserts as a field is typed,
 * and `createFormdownEditor`.
 */
import { FormdownEditor } from '../src/formdown-editor';
import { createFormdownEditor } from '../src/index';
import { FormManager, initializeExtensions, registerHook, getDefaultExtensionManager } from '@formdown/core';

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

describe('the problems panel', () => {
    const editorWith = (content: string) => {
        const editor = new FormdownEditor();
        (editor as any).formManager = new FormManager();
        editor.content = content;
        return editor;
    };

    it("lists Formdown's own diagnostics with their line, then the field-validate messages", async () => {
        const editor = editorWith('# Intake\n@name: [text]\n@name: [email]');
        await (editor as any).updateParseResult();
        const problems = (editor as any).parseResult.problems;
        expect(problems).toContainEqual(expect.objectContaining({ severity: 'warning', line: 3, message: expect.stringContaining('"name"') }));
    });

    it('shows nothing for a source without problems', async () => {
        const editor = editorWith('@name: [text]');
        await (editor as any).updateParseResult();
        expect((editor as any).parseResult.problems).toEqual([]);
    });

    /** What Lit does when `content` changed: runs `willUpdate` with it among the changed properties. */
    const settle = async (editor: FormdownEditor) => {
        (editor as any).willUpdate(new Map([['content', undefined]]));
        await new Promise((resolve) => setTimeout(resolve, 0));
    };

    it('follows content set from outside, not only content typed', async () => {
        const editor = editorWith('@name: [text]\n@name: [email]');
        await settle(editor);
        expect((editor as any).parseResult.problems).toHaveLength(1);

        editor.content = '@title: [text]';
        await settle(editor);
        expect((editor as any).parseResult.problems).toEqual([]);
        expect((editor as any).parseResult.fields.map((f: { name: string }) => f.name)).toEqual(['title']);
    });

    it('shows the parse of the latest content when an earlier one finishes after it', async () => {
        await initializeExtensions({});
        // The earlier content's check is the slow one, so its result comes back last.
        registerHook({
            name: 'field-validate',
            priority: 1,
            handler: async (_context: unknown, content: string) => {
                if (content.includes('@name')) await new Promise((resolve) => setTimeout(resolve, 30));
                return { valid: true };
            },
        });
        const editor = editorWith('@name: [text]\n@name: [email]');
        (editor as any).willUpdate(new Map([['content', undefined]]));
        editor.content = '@title: [text]';
        await settle(editor);
        await new Promise((resolve) => setTimeout(resolve, 60));
        expect((editor as any).parseResult.fields.map((f: { name: string }) => f.name)).toEqual(['title']);
        expect((editor as any).parseResult.problems).toEqual([]);
        await getDefaultExtensionManager().destroy();
    });
});
