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
    } updated(changedProperties: Map<string | number | symbol, unknown>) {
        super.updated(changedProperties)

        // Update formdown-ui component when content changes
        if (this.mode !== 'edit' && (changedProperties.has('content') || changedProperties.has('parseResult'))) {
            this.updateFormdownUI()
        }
    } firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties)

        // Initialize formdown-ui component on first render
        if (this.mode !== 'edit') {
            this.updateFormdownUI()
        }
    } private updateFormdownUI() {
        console.log('updateFormdownUI called, mode:', this.mode, 'content:', this.content.substring(0, 50))
        const container = this.shadowRoot?.querySelector('#formdown-ui-container')
        console.log('Container found:', !!container)
        if (!container) return

        // Remove existing formdown-ui if present
        const existingUI = container.querySelector('formdown-ui')
        if (existingUI) {
            existingUI.remove()
        }

        // Check if formdown-ui is registered
        const isRegistered = customElements.get('formdown-ui')
        console.log('formdown-ui registered:', !!isRegistered)
        if (!isRegistered) {
            console.warn('formdown-ui custom element not registered')
            container.innerHTML = '<div style="padding: 1rem; color: #666;">Loading form preview...</div>'
            return
        }

        // Create new formdown-ui component
        const formdownUI = document.createElement('formdown-ui')
        formdownUI.setAttribute('content', this.content)
        formdownUI.style.width = '100%'
        formdownUI.style.height = '100%'

        console.log('Created formdown-ui element:', formdownUI)
        // Listen for form data changes and dispatch them
        formdownUI.addEventListener('formdown-data-update', (e: Event) => {
            const customEvent = e as CustomEvent
            this.dispatchEvent(new CustomEvent('formdown-data-update', {
                detail: customEvent.detail,
                bubbles: true,
                composed: true
            }))
        })

        formdownUI.addEventListener('formdown-change', (e: Event) => {
            const customEvent = e as CustomEvent
            this.dispatchEvent(new CustomEvent('formdown-change', {
                detail: customEvent.detail,
                bubbles: true,
                composed: true
            }))
        })

        container.appendChild(formdownUI)
        console.log('Appended formdown-ui to container')
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
