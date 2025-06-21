import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import styles from './styles.css?inline'
import { renderEditorPanel, renderPreviewPanel } from './templates'
import type { ParseResult } from './templates'

// Simple parser for demo purposes
class SimpleFormdownParser {
    parse(content: string): ParseResult {
        const lines = content.split('\n').filter(line => line.trim());
        const fields: any[] = [];
        const errors: string[] = [];

        lines.forEach((line, index) => {
            if (line.startsWith('@')) {
                try {
                    const match = line.match(/@(\w+):\s*\[([^\]]+)\](.*)$/);
                    if (match) {
                        const [, name, type] = match;
                        fields.push({
                            name,
                            type: type.split(' ')[0],
                            label: name,
                            required: type.includes('required'),
                            attributes: {}
                        });
                    }
                } catch (error) {
                    errors.push(`Line ${index + 1}: Invalid syntax`);
                }
            }
        });

        return { fields, errors };
    }
}

@customElement('formdown-editor')
export class FormdownEditor extends LitElement {
    static styles = css`${unsafeCSS(styles)}`

    @property()
    content = `@name: [text required placeholder="Enter your name"]
@email: [email required]
@age: [number min=18 max=100]
@bio: [textarea rows=4 placeholder="Tell us about yourself"]
@gender: [radio] Male, Female, Other
@interests: [checkbox] Programming, Design, Music, Sports`

    @property({ type: String })
    mode: 'edit' | 'split' | 'view' = 'split'

    @property({ type: String })
    placeholder = 'Enter your Formdown syntax here...'

    @property({ type: Boolean })
    header = false

    @state()
    private parseResult: ParseResult = { fields: [], errors: [] }

    private parser = new SimpleFormdownParser()

    connectedCallback() {
        super.connectedCallback()
        this.updateParseResult()
    }

    willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
        super.willUpdate(changedProperties)

        // Prevent content updates from external sources when user is editing
        if (changedProperties.has('content')) {
            const textarea = this.shadowRoot?.querySelector('.editor-textarea') as HTMLTextAreaElement
            if (textarea && document.activeElement === textarea) {
                return
            }
        }
    } render() {
        const containerClass = `editor-container mode-${this.mode}`

        return html`
            <div class="${containerClass}">
                ${this.mode !== 'view' ? renderEditorPanel(
            this.header,
            this.content,
            this.placeholder,
            this.insertSnippet.bind(this),
            this.handleInput.bind(this),
            this.handleKeydown.bind(this)
        ) : ''}
                ${this.mode !== 'edit' ? renderPreviewPanel(this.header, this.parseResult) : ''}
            </div>
        `
    }

    private handleInput(e: Event) {
        const target = e.target as HTMLTextAreaElement
        this.content = target.value
        this.updateParseResult()
        this.dispatchContentChange()
    }

    private handleKeydown(e: KeyboardEvent) {
        // Handle tab indentation
        if (e.key === 'Tab') {
            e.preventDefault()
            const target = e.target as HTMLTextAreaElement
            const start = target.selectionStart
            const end = target.selectionEnd

            const before = target.value.substring(0, start)
            const after = target.value.substring(end)

            target.value = before + '  ' + after
            target.selectionStart = target.selectionEnd = start + 2

            this.content = target.value
            this.updateParseResult()
            this.dispatchContentChange()
        }
    }

    private insertSnippet(snippet: string) {
        const textarea = this.shadowRoot?.querySelector('.editor-textarea') as HTMLTextAreaElement
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const before = this.content.substring(0, start)
        const after = this.content.substring(end)

        this.content = before + snippet + after
        this.updateParseResult()
        this.dispatchContentChange()

        // Focus and position cursor after the inserted snippet
        this.updateComplete.then(() => {
            textarea.focus()
            textarea.selectionStart = textarea.selectionEnd = start + snippet.length
        })
    }

    private updateParseResult() {
        try {
            this.parseResult = this.parser.parse(this.content)
        } catch (error) {
            this.parseResult = {
                fields: [],
                errors: [error instanceof Error ? error.message : 'Parse error']
            }
        }
    }

    private dispatchContentChange() {
        this.dispatchEvent(new CustomEvent('contentChange', {
            detail: { content: this.content },
            bubbles: true,
            composed: true
        }))
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'formdown-editor': FormdownEditor
    }
}
