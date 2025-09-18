'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

interface CustomElement extends HTMLElement {
    setAttribute(name: string, value: string): void
    addEventListener(type: string, listener: (event: CustomEvent) => void): void
    content?: string
    setFormData?: (data: Record<string, unknown>) => void
    updateFormData?: (fieldName: string, value: unknown) => void
    data?: Record<string, unknown>
    getFormData?: () => Record<string, unknown>
}

interface Sample {
    name: string
    filename: string
    description: string
}

// Static samples list - this would be generated at build time
const SAMPLES: Sample[] = [
    { name: 'New Features Demo', filename: 'new-features.fd', description: '🆕 Latest features: custom "other" options, field ordering, and enhanced data handling' },
    { name: 'Minimal', filename: 'minimal.fd', description: 'Basic form with essential fields' },
    { name: 'Contact', filename: 'contact.fd', description: 'Contact form with validation' },
    { name: 'Contact (Shorthand)', filename: 'contact-shorthand.fd', description: 'Contact form using shorthand syntax' },
    { name: 'Registration', filename: 'registration.fd', description: 'User registration form' },
    { name: 'Registration (Shorthand)', filename: 'registration-shorthand.fd', description: 'User registration with shorthand syntax' },
    { name: 'Booking (Shorthand)', filename: 'booking-shorthand.fd', description: 'Appointment booking with shorthand syntax' },
    { name: 'E-commerce (Shorthand)', filename: 'ecommerce-shorthand.fd', description: 'Product ordering with shorthand syntax' },
    { name: 'Survey', filename: 'survey.fd', description: 'Survey form with various field types' },
    { name: 'Advanced', filename: 'advanced.fd', description: 'Advanced form with complex validation' },
    { name: 'E-commerce', filename: 'ecommerce.fd', description: 'E-commerce checkout form' },
    { name: 'Event', filename: 'event.fd', description: 'Event registration form' },
    { name: 'Text Fields', filename: 'text-fields.fd', description: 'Various text input types' },
    { name: 'Selection Fields', filename: 'selection-fields.fd', description: 'Radio buttons, checkboxes, and select fields' },
    { name: 'Number Date Fields', filename: 'number-date-fields.fd', description: 'Numeric and date input fields' },
    { name: 'File Button Fields', filename: 'file-button-fields.fd', description: 'File uploads and buttons' },
    { name: 'Inline Fields', filename: 'inline-fields.fd', description: 'Inline field syntax examples' },
    { name: 'Validation Attributes', filename: 'validation-attributes.fd', description: 'Form validation examples' },
    { name: 'Complete Fields', filename: 'complete-fields.fd', description: 'Comprehensive field showcase' },
    { name: 'Accessibility', filename: 'accessibility.fd', description: 'Accessibility features and ARIA attributes' },
    { name: 'Markdown Demo', filename: 'markdown-demo.fd', description: 'Markdown integration examples' }
];

export default function DemoPage() {
    const [isComponentsLoaded, setIsComponentsLoaded] = useState(false)
    const [formData, setFormData] = useState<Record<string, unknown>>({})
    const [formSchema, setFormSchema] = useState<Record<string, unknown>>({})
    const [activeTab, setActiveTab] = useState<'data' | 'schema'>('data')
    const [samples] = useState<Sample[]>(SAMPLES) // Use static samples
    const [selectedSample, setSelectedSample] = useState<Sample | null>(null)
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [lastLoadedSample, setLastLoadedSample] = useState<string | null>(null)
    const isUpdatingFromEditor = useRef(false)

    useEffect(() => {
        const loadComponents = async () => {
            if (typeof window !== "undefined") {
                try {
                    console.log('Loading formdown components...')

                    // Import editor
                    await import("@formdown/editor")
                    console.log('Formdown editor loaded')

                    // Import UI component and ensure registration
                    const uiModule = await import("@formdown/ui")
                    console.log('Formdown UI loaded')

                    // Force registration if needed
                    if (uiModule.registerFormdownUI) {
                        uiModule.registerFormdownUI()
                        console.log('FormdownUI registration forced')
                    }

                    // Wait a bit for custom elements to register
                    await new Promise(resolve => setTimeout(resolve, 100))

                    // Check if the element is properly registered
                    const isRegistered = customElements.get('formdown-ui')
                    console.log('formdown-ui registered:', !!isRegistered)

                    setIsComponentsLoaded(true)
                    console.log('Components loaded successfully')
                } catch (error) {
                    console.error("Failed to load components:", error)
                }
            }
        }
        loadComponents()

        // Set initial sample to New Features Demo
        if (SAMPLES.length > 0) {
            setSelectedSample(SAMPLES[0]) // This will be the New Features Demo
        }
    }, [])

    useEffect(() => {
        if (selectedSample) {
            loadSample(selectedSample.filename)
            // Clear form data when sample changes
            setFormData({})
        }
    }, [selectedSample])

    const loadSample = async (filename: string) => {
        setIsLoading(true)
        try {
            const response = await fetch(`/samples/${filename}`)
            if (response.ok) {
                const text = await response.text()
                setContent(text)
            } else {
                console.error(`Failed to load sample: ${filename}`)
                setContent(`# Error\n\nCould not load sample file: ${filename}`)
            }
        } catch (error) {
            console.error('Error loading sample:', error)
            setContent(`# Error\n\nFailed to load sample file.`)
        } finally {
            setIsLoading(false)
        }
    }

    const generateSchema = async (content: string) => {
        try {
            // Import getSchema from @formdown/core
            const { getSchema } = await import('@formdown/core')
            const schema = getSchema(content)
            setFormSchema(schema)
        } catch (error) {
            console.error('Error generating schema:', error)
            setFormSchema({ error: 'Failed to generate schema' })
        }
    }

    useEffect(() => {
        if (isComponentsLoaded && content && (selectedSample?.filename !== lastLoadedSample)) {
            const editorContainer = document.getElementById("editor-container")
            const rendererContainer = document.getElementById("renderer-container")

            // Clear containers when loading new sample
            if (editorContainer) {
                editorContainer.innerHTML = ''
            }
            if (rendererContainer) {
                rendererContainer.innerHTML = ''
            }

            setLastLoadedSample(selectedSample?.filename || null)
        }
    }, [isComponentsLoaded, content, selectedSample?.filename, lastLoadedSample])

    // Update schema whenever content changes
    useEffect(() => {
        if (content) {
            generateSchema(content)
        }
    }, [content])

    useEffect(() => {
        if (isComponentsLoaded && content) {
            const editorContainer = document.getElementById("editor-container")
            if (editorContainer) {
                // Only create editor if it doesn't exist
                let editor = editorContainer.querySelector("formdown-editor") as CustomElement

                if (!editor) {
                    editor = document.createElement("formdown-editor") as CustomElement
                    editor.setAttribute("mode", "edit")
                    editor.style.height = "100%"
                    editor.style.width = "100%"
                    editor.style.display = "block"

                    editor.addEventListener('contentChange', (e: CustomEvent) => {
                        isUpdatingFromEditor.current = true
                        setContent(e.detail.content)
                        setTimeout(() => {
                            isUpdatingFromEditor.current = false
                        }, 100)
                    })

                    editorContainer.appendChild(editor)
                }

                // Update content property only if not updating from editor
                if (!isUpdatingFromEditor.current) {
                    (editor as CustomElement).content = content
                }
            }

            const rendererContainer = document.getElementById("renderer-container")
            if (rendererContainer) {
                console.log('Setting up renderer with content:', content)
                console.log('Content length:', content.length)

                // Only create renderer if it doesn't exist
                let renderer = rendererContainer.querySelector("formdown-ui") as CustomElement

                if (!renderer) {
                    // Check if formdown-ui is available
                    const FormdownUIElement = customElements.get('formdown-ui')
                    if (!FormdownUIElement) {
                        console.error('formdown-ui custom element not registered')
                        rendererContainer.innerHTML = '<div style="color: red;">Error: formdown-ui component not registered</div>'
                        return
                    }

                    renderer = document.createElement("formdown-ui") as CustomElement
                    renderer.style.height = "100%"
                    renderer.style.width = "100%"
                    renderer.style.display = "block"

                    console.log('Created formdown-ui element:', renderer)

                    renderer.addEventListener('formSubmit', (e: CustomEvent) => {
                        setFormData(e.detail)
                        console.log('Form data:', e.detail)
                    })

                    // Add real-time data update listener
                    renderer.addEventListener('formdown-data-update', (e: CustomEvent) => {
                        setFormData(e.detail.formData || {})
                        console.log('Real-time form data update:', e.detail.formData)
                    })

                    // Add form change listener for backward compatibility
                    renderer.addEventListener('formdown-change', (e: CustomEvent) => {
                        setFormData(e.detail.formData || {})
                        console.log('Form field changed:', e.detail)
                    })

                    rendererContainer.appendChild(renderer)
                    console.log('Appended renderer to container')

                    // Check if the element has any content after a short delay
                    setTimeout(() => {
                        console.log('Renderer innerHTML after 500ms:', renderer.innerHTML ? 'Has content' : 'Empty')
                        console.log('Renderer shadowRoot after 500ms:', renderer.shadowRoot ? 'Has shadow DOM' : 'No shadow DOM')
                    }, 500)
                }

                // Always update content property
                (renderer as CustomElement).content = content
                console.log('Element content property updated:', (renderer as CustomElement).content)
            } else {
                console.error('Renderer container not found')
            }
        }
    }, [isComponentsLoaded, content])

    return (<div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 flex-shrink-0">
            <div className="px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <img src="/logo.svg" alt="Formdown" className="w-8 h-8" />
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Formdown Demo</h1>
                    </Link>
                    <div className="flex items-center space-x-4">
                        {/* Sample Selector moved to top bar */}
                        <div className="flex items-center space-x-2">
                            <label htmlFor="sample-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Choose a sample:
                            </label>
                            <select
                                id="sample-select"
                                value={selectedSample?.filename || ''}
                                onChange={(e) => {
                                    const sample = samples.find(s => s.filename === e.target.value)
                                    if (sample) setSelectedSample(sample)
                                }}
                                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                {samples.map((sample) => (
                                    <option key={sample.filename} value={sample.filename}>
                                        {sample.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <ThemeToggle />
                        <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Home
                        </Link>
                        <Link href="/docs" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                            Docs
                        </Link>
                    </div>
                </div>
                {selectedSample?.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{selectedSample.description}</p>
                )}
            </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 flex flex-col overflow-hidden">{/* Remove old sample selector since it's now in header */}

            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Loading sample...</p>
                </div>
            )}            {!isLoading && (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 overflow-hidden">
                    {/* Editor Panel */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 flex flex-col overflow-hidden">
                        <div className="border-b dark:border-gray-700 px-4 py-3 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Editor</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Edit the Formdown content</p>
                        </div>
                        <div className="flex-1 min-h-0 overflow-hidden">
                            {isComponentsLoaded ? (
                                <div id="editor-container" className="h-full"></div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                    Loading editor...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Renderer Panel */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 flex flex-col overflow-hidden">
                        <div className="border-b dark:border-gray-700 px-4 py-3 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Preview</h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Live preview of the generated form</p>
                        </div>
                        <div className="flex-1 min-h-0 overflow-auto">
                            {isComponentsLoaded ? (
                                <div id="renderer-container" className="h-full p-4"></div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                                    Loading renderer...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Data/Schema Panel - Fixed at bottom of main */}
            <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm flex flex-col overflow-hidden" style={{ height: '200px' }}>
                <div className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-lg flex-shrink-0">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('data')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'data'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Data {Object.keys(formData).length > 0 && `(${Object.keys(formData).length} fields)`}
                        </button>
                        <button
                            onClick={() => setActiveTab('schema')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'schema'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            Schema {Object.keys(formSchema).length > 0 && `(${Object.keys(formSchema).length} fields)`}
                        </button>
                        <div className="flex-1 flex justify-end items-center px-4 space-x-2">
                            {activeTab === 'data' && (
                                <>
                                    <button
                                        onClick={() => {
                                            console.log('=== Apply Data Button Clicked ===')
                                            console.log('Current formData:', formData)

                                            const applyDataWithRetry = (attempt = 1, maxAttempts = 5) => {
                                                console.log(`Attempt ${attempt}/${maxAttempts}`)

                                                // Apply Data: Data -> UI
                                                const rendererContainer = document.getElementById('renderer-container')
                                                console.log('Renderer container found:', !!rendererContainer)

                                                if (rendererContainer) {
                                                    console.log('Container innerHTML length:', rendererContainer.innerHTML.length)
                                                    console.log('Container children:', rendererContainer.children.length)

                                                    // List all elements in container
                                                    Array.from(rendererContainer.children).forEach((child, index) => {
                                                        console.log(`Child ${index}:`, child.tagName, child.id, child.className)
                                                    })
                                                }

                                                const renderer = rendererContainer?.querySelector('formdown-ui') as CustomElement
                                                console.log('Renderer element found:', !!renderer)

                                                if (!renderer && attempt < maxAttempts) {
                                                    console.log(`Renderer not found, retrying in 500ms... (attempt ${attempt}/${maxAttempts})`)
                                                    setTimeout(() => applyDataWithRetry(attempt + 1, maxAttempts), 500)
                                                    return
                                                }

                                                if (renderer) {
                                                    console.log('setFormData method available:', typeof renderer?.setFormData)

                                                    // Check all available methods on the renderer
                                                    console.log('Available methods on renderer:')
                                                    console.log('Object.getOwnPropertyNames:', Object.getOwnPropertyNames(renderer))
                                                    console.log('Object.getOwnPropertyNames(prototype):', Object.getOwnPropertyNames(Object.getPrototypeOf(renderer)))

                                                    // Check specifically for setFormData variations
                                                    console.log('setFormData:', typeof renderer.setFormData)
                                                    console.log('updateFormData:', typeof renderer.updateFormData)
                                                    console.log('data property:', typeof renderer.data)
                                                    console.log('getFormData:', typeof renderer.getFormData)

                                                    // Try multiple methods to update form data
                                                    if (renderer && typeof renderer.setFormData === 'function') {
                                                        console.log('Using setFormData method')
                                                        renderer.setFormData(formData)
                                                    } else if (renderer && typeof renderer.updateFormData === 'function') {
                                                        console.log('Using updateFormData method')
                                                        // updateFormData expects (fieldName, value) format, so we need to call it for each field
                                                        Object.entries(formData).forEach(([fieldName, value]) => {
                                                            renderer.updateFormData!(fieldName, value)
                                                        })
                                                    } else {
                                                        console.log('Attempting direct DOM manipulation...')
                                                        // Direct DOM manipulation as fallback
                                                        const shadowRoot = (renderer as HTMLElement & { shadowRoot?: ShadowRoot }).shadowRoot
                                                        if (shadowRoot) {
                                                            const container = shadowRoot.querySelector('#content-container')
                                                            if (container) {
                                                                Object.entries(formData).forEach(([fieldName, value]) => {
                                                                    const field = container.querySelector(`[name="${fieldName}"], [data-field-name="${fieldName}"]`) as HTMLElement
                                                                    if (field) {
                                                                        if (field.hasAttribute('contenteditable')) {
                                                                            field.textContent = String(value || '')
                                                                        } else if (field instanceof HTMLInputElement) {
                                                                            if (field.type === 'checkbox' || field.type === 'radio') {
                                                                                field.checked = Boolean(value)
                                                                            } else {
                                                                                field.value = String(value || '')
                                                                            }
                                                                        } else if (field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
                                                                            field.value = String(value || '')
                                                                        }
                                                                        // Trigger input event
                                                                        field.dispatchEvent(new Event('input', { bubbles: true }))
                                                                    }
                                                                })
                                                                console.log('Direct DOM manipulation completed')
                                                            } else {
                                                                console.error('Container not found in shadow DOM')
                                                            }
                                                        } else {
                                                            console.error('Shadow root not found')
                                                        }
                                                    }
                                                } else {
                                                    console.error('Renderer not found after all retries')
                                                    console.log('Available elements in rendererContainer:')
                                                    if (rendererContainer) {
                                                        console.log('innerHTML:', rendererContainer.innerHTML.substring(0, 200) + '...')
                                                    }
                                                }
                                            }

                                            applyDataWithRetry()
                                        }}
                                        className="text-xs bg-blue-500 text-white hover:bg-blue-600 px-3 py-1 rounded transition-colors font-medium"
                                    >
                                        Apply Data
                                    </button>
                                    <button
                                        onClick={() => setFormData({})}
                                        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 px-2 py-1 rounded transition-colors"
                                    >
                                        Clear Data
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="p-3 flex-1 min-h-0">
                    {activeTab === 'data' ? (
                        <textarea
                            value={Object.keys(formData).length > 0 ? JSON.stringify(formData, null, 2) : ''}
                            onChange={(e) => {
                                try {
                                    const parsed = JSON.parse(e.target.value)
                                    setFormData(parsed)
                                    // Note: UI will not be updated automatically. Use "Apply Data" button to apply changes to form.
                                } catch {
                                    // Invalid JSON, don't update
                                }
                            }}
                            placeholder="Edit JSON data here, then click 'Apply Data' to update the form..."
                            className="w-full h-full resize-none border border-gray-200 dark:border-gray-600 rounded p-2 text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    ) : (
                        <textarea
                            value={Object.keys(formSchema).length > 0 ? JSON.stringify(formSchema, null, 2) : ''}
                            readOnly
                            placeholder="Schema will appear here when content is loaded..."
                            className="w-full h-full resize-none border border-gray-200 dark:border-gray-600 rounded p-2 text-xs font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 focus:outline-none"
                        />
                    )}
                </div>
            </div>
        </main>
    </div>
    )
}
