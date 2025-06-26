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

var defaultContent = `# Contact Form

Fill out the form below to get in touch:

@full_name: [text required placeholder="Enter your full name"]
@email_address: [email required]
@phone_number: [tel]
@message: [textarea rows=4 placeholder="Your message here..."]
@contact_method: [radio options="Email, Phone, Either"]
@newsletter_signup: [checkbox]`;

@customElement('formdown-editor')
export class FormdownEditor extends LitElement {
    static styles = css`${unsafeCSS(styles)}`

    @property()
    content = defaultContent

    @property({ type: String })
    mode: 'edit' | 'split' | 'view' = 'split'

    @property({ type: String })
    placeholder = 'Try FormDown with smart labels! Field names like "full_name" become "Full Name" automatically...'

    @property({ type: Boolean })
    header = false

    @property({ type: Boolean })
    toolbar = true

    @state()
    private _data: Record<string, any> = {}

    // Getter and setter for data to handle nested structures
    get data(): Record<string, any> {
        return this._data
    }

    set data(value: Record<string, any>) {
        let cleanedValue: Record<string, any> = {}

        if (value && typeof value === 'object') {
            // Clean up nested formData structures
            if ('formData' in value && typeof value.formData === 'object') {
                cleanedValue = { ...value.formData }
            } else {
                cleanedValue = { ...value }
            }

            // Process checkbox fields to ensure they are arrays
            cleanedValue = this.processCheckboxFields(cleanedValue)
        }

        this._data = cleanedValue
        this.requestUpdate('data')
    }

    @state()
    private parseResult: ParseResult = { fields: [], errors: [] }

    private parser = new SimpleFormdownParser()

    connectedCallback() {
        super.connectedCallback()

        // Use inner text as content if content property is default and inner text exists
        if (this.content === defaultContent && this.textContent?.trim()) {
            this.content = this.textContent.trim()
            // Clear the text content to avoid duplication
            this.textContent = ''
        }

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
            this.toolbar,
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

        // If mode changed, preserve data and force update of formdown-ui
        if (changedProperties.has('mode')) {
            // Store current data to preserve it across mode changes
            const currentData = this._data

            // If switching to a mode that uses formdown-ui, ensure it gets updated
            if (this.mode !== 'edit') {
                this.updateFormdownUI()

                // Restore data after UI update
                if (currentData && Object.keys(currentData).length > 0) {
                    setTimeout(() => {
                        const container = this.shadowRoot?.querySelector('#formdown-ui-container')
                        const formdownUI = container?.querySelector('formdown-ui') as any
                        if (formdownUI) {
                            formdownUI.data = currentData
                        }
                    }, 0)
                }
            }
            return
        }

        // Update formdown-ui component when content or parseResult changes
        // Don't update on data changes to prevent infinite loops (data is updated directly)
        if (this.mode !== 'edit' && (
            changedProperties.has('content') ||
            changedProperties.has('parseResult')
        )) {
            this.updateFormdownUI()
        }

        // Handle data changes separately to avoid infinite loops
        if (changedProperties.has('data') && this.mode !== 'edit') {
            const container = this.shadowRoot?.querySelector('#formdown-ui-container')
            const formdownUI = container?.querySelector('formdown-ui') as any
            if (formdownUI && this.data && typeof this.data === 'object') {
                // Only update formdown-ui data if it exists and avoid triggering events
                formdownUI.data = this.data
            }
        }
    } firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
        super.firstUpdated(changedProperties)

        // Initialize formdown-ui component on first render
        if (this.mode !== 'edit') {
            this.updateFormdownUI()
        }
    } private updateFormdownUI() {
        const container = this.shadowRoot?.querySelector('#formdown-ui-container')
        if (!container) return

        // Check if formdown-ui is registered
        const isRegistered = customElements.get('formdown-ui')
        if (!isRegistered) {
            container.innerHTML = '<div style="padding: 1rem; color: #666;">Loading form preview...</div>'
            return
        }

        // Get or create formdown-ui element
        let formdownUI = container.querySelector('formdown-ui') as any

        if (!formdownUI) {
            // Create new formdown-ui component only if it doesn't exist
            formdownUI = document.createElement('formdown-ui')
            formdownUI.style.width = '100%'
            formdownUI.style.height = '100%'


            // Set up event listeners only once
            formdownUI.addEventListener('formdown-data-update', (e: Event) => {
                const customEvent = e as CustomEvent

                // Extract the actual form data, handle nested formData structure
                let newData = customEvent.detail
                if (newData && typeof newData === 'object' && 'formData' in newData) {
                    // If it's wrapped in formData, extract the actual data
                    newData = newData.formData
                }

                // Process checkbox fields to ensure they are arrays
                newData = this.processCheckboxFields(newData)

                // Update our data property (this will trigger reactive update)
                this.data = { ...newData }

                // Also dispatch the event for external listeners
                this.dispatchEvent(new CustomEvent('formdown-data-update', {
                    detail: newData,  // Pass the clean data
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
        }

        // Update properties on existing element
        formdownUI.setAttribute('content', this.content)

        // Preserve and set current data if it exists
        if (this._data && Object.keys(this._data).length > 0) {
            formdownUI.data = this._data
        }
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

    private processCheckboxFields(data: Record<string, any>): Record<string, any> {
        if (!data || typeof data !== 'object') {
            return data
        }

        const processedData = { ...data }

        // Parse content to find checkbox fields and their types
        const checkboxFieldInfo = this.getCheckboxFieldsFromContent()

        // Process each checkbox field based on its type
        checkboxFieldInfo.forEach(({ fieldName, isGroup }) => {
            if (fieldName in processedData) {
                const value = processedData[fieldName]

                if (isGroup) {
                    // Checkbox group - should be an array
                    if (Array.isArray(value)) {
                        // Already an array, keep it as is
                        processedData[fieldName] = value
                    } else if (typeof value === 'string' && value.trim() !== '') {
                        // Convert comma-separated string to array
                        processedData[fieldName] = value.split(',').map(v => v.trim()).filter(v => v)
                    } else {
                        // Ensure it's always an array for checkbox groups
                        processedData[fieldName] = value ? [value] : []
                    }
                } else {
                    // Single checkbox - should be boolean
                    if (typeof value === 'boolean') {
                        // Already boolean, keep it as is
                        processedData[fieldName] = value
                    } else if (Array.isArray(value)) {
                        // Convert array to boolean (true if has items)
                        processedData[fieldName] = value.length > 0
                    } else {
                        // Convert other types to boolean
                        processedData[fieldName] = Boolean(value)
                    }
                }
            }
        })

        return processedData
    }

    private getCheckboxFieldsFromContent(): { fieldName: string, isGroup: boolean }[] {
        const checkboxFields: { fieldName: string, isGroup: boolean }[] = []
        const lines = this.content.split('\n')

        lines.forEach(line => {
            // Match @fieldname: [checkbox ...]
            const match = line.match(/@(\w+):\s*\[([^\]]*checkbox[^\]]*)\]/i)
            if (match) {
                const fieldName = match[1]
                const checkboxConfig = match[2]

                // Check if it has options (checkbox group) or not (single checkbox)
                const isGroup = checkboxConfig.includes('options=')

                checkboxFields.push({ fieldName, isGroup })
            }
        })

        return checkboxFields
    }

    // Validation methods - delegate to FormdownUI component
    validate() {
        const previewContainer = this.shadowRoot?.querySelector('.preview-content')
        const formdownUI = previewContainer?.querySelector('formdown-ui') as any

        if (formdownUI && typeof formdownUI.validate === 'function') {
            return formdownUI.validate()
        }

        // Fallback validation result if FormdownUI is not available
        return {
            isValid: false,
            errors: [{ field: 'general', message: 'FormdownUI component not found for validation' }]
        }
    }

    // Get form data - delegate to FormdownUI component
    getFormData() {
        const previewContainer = this.shadowRoot?.querySelector('.preview-content')
        const formdownUI = previewContainer?.querySelector('formdown-ui') as any

        if (formdownUI && typeof formdownUI.getFormData === 'function') {
            return formdownUI.getFormData()
        }

        return {}
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'formdown-editor': FormdownEditor
    }
}
