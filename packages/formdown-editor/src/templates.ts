import { html } from 'lit'

export interface ParseResult {
    fields: Array<{
        name: string;
        type: string;
        label: string;
        required?: boolean;
        attributes?: Record<string, any>;
    }>;
    errors: string[];
}

export function renderEditorPanel(
    header: boolean,
    content: string,
    placeholder: string,
    insertSnippet: (snippet: string) => void,
    handleInput: (e: Event) => void,
    handleKeydown: (e: KeyboardEvent) => void
) {
    return html`
        <div class="editor-panel">
            ${header ? html`
                <div class="panel-header">Formdown Editor</div>
            ` : ''}
            <div class="toolbar">
                <button class="toolbar-button" @click=${() => insertSnippet('@name: [text required]')}>
                    Text Field
                </button>
                <button class="toolbar-button" @click=${() => insertSnippet('@bio: [textarea rows=4]')}>
                    Textarea
                </button>
                <button class="toolbar-button" @click=${() => insertSnippet('@gender: [radio] Option1, Option2')}>
                    Radio
                </button>
                <button class="toolbar-button" @click=${() => insertSnippet('@interests: [checkbox] Item1, Item2')}>
                    Checkbox
                </button>
                <button class="toolbar-button" @click=${() => insertSnippet('@country: [select] USA, Canada, UK')}>
                    Select
                </button>
            </div>

            <textarea
                class="editor-textarea"
                .value=${content}
                @input=${handleInput}
                @keydown=${handleKeydown}
                placeholder=${placeholder}
                spellcheck="false"
            ></textarea>

            <div class="stats">
                <span>Lines: ${content.split('\n').length}</span>
                <span>Characters: ${content.length}</span>
            </div>
        </div>
    `
}

export function renderPreviewPanel(header: boolean, parseResult: ParseResult) {
    return html`
        <div class="preview-panel">
            ${header ? html`
                <div class="panel-header">Formdown UI</div>
            ` : ''}
            <div class="preview-content">
                ${parseResult.errors.length > 0 ? html`
                    <div class="error-list">
                        <strong>Errors:</strong>
                        ${parseResult.errors.map(error => html`
                            <div class="error-item">${error}</div>
                        `)}
                    </div>
                ` : ''}
                <div id="formdown-ui-container"></div>
            </div>
        </div>
    `
}
