import { html } from 'lit'
import type { ParseResult } from '@formdown/core'

// Re-export for backward compatibility
export type { ParseResult }

export function renderEditorPanel(
    header: boolean,
    toolbar: boolean,
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
            ${toolbar ? html`
                <div class="toolbar">
                    <button class="toolbar-button" @click=${() => insertSnippet('@name: [text required]')}>
                        Text
                    </button>
                    <button class="toolbar-button" @click=${() => insertSnippet('@bio: [textarea rows=4]')}>
                        Textarea
                    </button>
                    <button class="toolbar-button" @click=${() => insertSnippet(`@gender: [radio required options="Option 1,Option 2"]`)}>
                        Radio
                    </button>
                    <button class="toolbar-button" @click=${() => insertSnippet(`@interests: [checkbox options="Item 1,Item 2"]`)}>
                        Check
                    </button>
                    <button class="toolbar-button" @click=${() => insertSnippet(`@country: [select required options="USA,Canada,UK"]`)}>
                        Select
                    </button>
                    <button class="toolbar-button" @click=${() => insertSnippet(`@volume: [range min=0 max=100 unit="%"]`)}>
                        Range
                    </button>
                </div>
            ` : ''}

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
