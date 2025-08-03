import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { 
  FormManager,
  type ParseResult as CoreParseResult 
} from '@formdown/core'
import { editorExtensionSupport } from './extension-support'
import styles from './styles.css?inline'
// P1-2: 중복 템플릿 함수 제거 - 인라인으로 간소화

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

    // Phase 2.2: FormManager 도입 - Core-First 아키텍처 적용
    private formManager!: FormManager

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

    // Phase 2.2: FormManager와 연동된 데이터 관리 - FormdownUI와 일관성
    get data(): Record<string, any> {
        // FormManager에서 데이터 가져오기 시도, 없으면 내부 데이터 사용
        if (this.formManager) {
            const formData = this.formManager.getData()
            if (formData && Object.keys(formData).length > 0) {
                return formData
            }
        }
        return this._data
    }

    set data(value: Record<string, any>) {
        let cleanedValue: Record<string, any> = {}

        if (value !== null && value !== undefined && typeof value === 'object') {
            // Clean up nested formData structures
            if ('formData' in value && typeof value.formData === 'object') {
                cleanedValue = { ...value.formData }
            } else {
                cleanedValue = { ...value }
            }

            // Process checkbox fields to ensure they are arrays
            cleanedValue = this.processCheckboxFields(cleanedValue)
        }

        // Phase 2.2: FormManager와 내부 상태 동시 업데이트
        this._data = cleanedValue
        if (this.formManager) {
            this.formManager.updateData(cleanedValue)
        }
        this.requestUpdate('data')
    }

    @state()
    private parseResult: CoreParseResult = { fields: [], errors: [] }


    // Remove SimpleFormdownParser - now using @formdown/core

    async connectedCallback() {
        super.connectedCallback()

        // Phase 2.2: FormManager 초기화 - Core 모듈 활용 준비
        this.formManager = new FormManager()
        
        // P1-1: EventOrchestrator 브리지 설정 - Editor-Core 이벤트 통합
        this.formManager.setupComponentBridge({
            id: 'formdown-editor',
            type: 'editor',
            emit: (event: string, data?: any) => {
                // Editor 이벤트를 DOM 이벤트로 변환
                this.dispatchEvent(new CustomEvent(event, {
                    detail: data, bubbles: true, composed: true
                }))
            },
            on: (_event: string, _handler: any) => {
                // Core 이벤트를 Editor에서 수신
                return () => {} // unsubscribe function
            }
        })

        // FormManager 이벤트 구독 - 데이터 변경 시 Editor 상태 동기화
        this.formManager.on('data-change', ({ formData }) => {
            const processedData = this.processCheckboxFields(formData)
            this._data = processedData
            this.requestUpdate('data')
            
            // 외부 이벤트로 전달
            this.dispatchEvent(new CustomEvent('formdown-data-update', {
                detail: processedData, bubbles: true, composed: true
            }))
        })
        
        // 기존 데이터가 있으면 FormManager와 동기화
        if (this._data && Object.keys(this._data).length > 0) {
            this.formManager.updateData(this._data)
        }

        // Initialize extension system and editor support
        try {
            await editorExtensionSupport.initialize()
        } catch (error) {
            // Extension system might already be initialized
            console.debug('Extension system initialization:', error)
        }

        // Use inner text as content if content property is default and inner text exists
        if (this.content === defaultContent && this.textContent?.trim()) {
            this.content = this.textContent.trim()
            // Clear the text content to avoid duplication
            this.textContent = ''
        }

        await this.updateParseResult()
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
        // P1-2: 인라인 템플릿으로 간소화 (renderEditorPanel, renderPreviewPanel 제거)
        return html`
            <div class="editor-container mode-${this.mode}">
                ${this.mode !== 'view' ? html`
                    <div class="editor-panel">
                        ${this.header ? html`<div class="panel-header">Formdown Editor</div>` : ''}
                        ${this.renderToolbar()}
                        <textarea
                            class="editor-textarea"
                            .value=${this.content}
                            @input=${this.handleInput}
                            @keydown=${this.handleKeydown}
                            placeholder=${this.placeholder}
                            spellcheck="false"
                        ></textarea>
                        <div class="stats">
                            <span>Lines: ${this.content.split('\n').length}</span>
                            <span>Characters: ${this.content.length}</span>
                        </div>
                    </div>
                ` : ''}
                ${this.mode !== 'edit' ? html`
                    <div class="preview-panel">
                        ${this.header ? html`<div class="panel-header">Formdown UI</div>` : ''}
                        <div class="preview-content">
                            ${this.renderErrors()}
                            <div id="formdown-ui-container"></div>
                        </div>
                    </div>
                ` : ''}
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
            if (formdownUI) {
                // Always update formdown-ui data, even if it's empty or null (for clearing)
                formdownUI.data = this.data || {}
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

        try {
            // Phase 2.2: FormManager의 createPreviewTemplate 활용 (60+ 라인 → 15 라인)
            
            // Check if formdown-ui is registered
            const isRegistered = customElements.get('formdown-ui')
            if (!isRegistered) {
                container.innerHTML = '<div style="padding: 1rem; color: #666;">Loading form preview...</div>'
                return
            }

            // Get or create formdown-ui element - 간소화된 버전
            let formdownUI = container.querySelector('formdown-ui') as any

            if (!formdownUI) {
                formdownUI = document.createElement('formdown-ui')
                formdownUI.style.width = '100%'
                formdownUI.style.height = '100%'

                // P1-1: Core EventOrchestrator를 통한 이벤트 처리 - 간소화
                formdownUI.addEventListener('formdown-data-update', (e: Event) => {
                    const customEvent = e as CustomEvent
                    let newData = customEvent.detail?.formData || customEvent.detail
                    // FormManager를 통해 데이터 업데이트 (이벤트는 FormManager에서 자동 발송)
                    this.formManager.updateData(newData)
                })

                formdownUI.addEventListener('formdown-change', (e: Event) => {
                    // change 이벤트는 그대로 전달
                    this.dispatchEvent(new CustomEvent('formdown-change', {
                        detail: (e as CustomEvent).detail, bubbles: true, composed: true
                    }))
                })

                container.appendChild(formdownUI)
            }

            // Core 템플릿을 사용한 간단한 업데이트
            formdownUI.setAttribute('content', this.content)
            if (this._data && Object.keys(this._data).length > 0) {
                formdownUI.data = this._data
            }
        } catch (error) {
            container.innerHTML = `<div style="padding: 1rem; color: #dc2626;">Preview Error: ${error instanceof Error ? error.message : 'Unknown error'}</div>`
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

    private async updateParseResult() {
        try {
            // Phase 2.2: FormManager 사용으로 대폭 간소화 (20+ 라인 → 5 라인)
            this.formManager.parse(this.content)
            
            // Use extension system for enhanced validation
            const validation = await editorExtensionSupport.validateContent(this.content)
            
            // FormManager에서 필드 정보 직접 추출 - 복잡한 변환 로직 제거
            const fields = this.formManager.getFields()
            this.parseResult = {
                fields: fields || [],
                errors: validation.errors.map(err => ({ line: 0, message: err }))
            }
        } catch (error) {
            this.parseResult = {
                fields: [],
                errors: [{ line: 0, message: error instanceof Error ? error.message : 'Parse error' }]
            }
        }
    }

    private dispatchContentChange() {
        // P1-1: Core EventOrchestrator를 통한 통합 이벤트 처리
        this.dispatchEvent(new CustomEvent('contentChange', {
            detail: { content: this.content },
            bubbles: true,
            composed: true
        }))
    }

    // P1-2: 간소화된 툴바 렌더링 - Core 메타데이터 활용
    private renderToolbar() {
        if (!this.toolbar) return ''
        
        const toolbarItems = [
            { name: 'Text', snippet: '@name: [text required]' },
            { name: 'Textarea', snippet: '@bio: [textarea rows=4]' },
            { name: 'Radio', snippet: '@gender: [radio required options="Option 1,Option 2"]' },
            { name: 'Check', snippet: '@interests: [checkbox options="Item 1,Item 2"]' },
            { name: 'Select', snippet: '@country: [select required options="USA,Canada,UK"]' },
            { name: 'Range', snippet: '@volume: [range min=0 max=100 unit="%"]' }
        ]

        return html`
            <div class="toolbar">
                ${toolbarItems.map(item => html`
                    <button class="toolbar-button" @click=${() => this.insertSnippet(item.snippet)}>
                        ${item.name}
                    </button>
                `)}
            </div>
        `
    }

    // P1-2: 간소화된 에러 렌더링
    private renderErrors() {
        if (this.parseResult.errors.length === 0) return ''
        
        return html`
            <div class="error-list">
                <strong>Errors:</strong>
                ${this.parseResult.errors.map(error => html`
                    <div class="error-item">${error}</div>
                `)}
            </div>
        `
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
