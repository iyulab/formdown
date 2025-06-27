'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface CustomElement extends HTMLElement {
    setAttribute(name: string, value: string): void
    addEventListener(type: string, listener: (event: CustomEvent) => void): void
    content?: string
}

interface Sample {
    name: string
    filename: string
    description: string
}

// Static samples list - this would be generated at build time
const SAMPLES: Sample[] = [
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

        // Set initial sample
        if (SAMPLES.length > 0) {
            setSelectedSample(SAMPLES[0])
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

    return (<div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b flex-shrink-0">
            <div className="px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <img src="/logo.svg" alt="Formdown" className="w-8 h-8" />
                        <h1 className="text-xl font-bold text-gray-900">Formdown Demo</h1>
                    </Link>
                    <div className="flex items-center space-x-4">
                        {/* Sample Selector moved to top bar */}
                        <div className="flex items-center space-x-2">
                            <label htmlFor="sample-select" className="text-sm font-medium text-gray-700">
                                Choose a sample:
                            </label>
                            <select
                                id="sample-select"
                                value={selectedSample?.filename || ''}
                                onChange={(e) => {
                                    const sample = samples.find(s => s.filename === e.target.value)
                                    if (sample) setSelectedSample(sample)
                                }}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                {samples.map((sample) => (
                                    <option key={sample.filename} value={sample.filename}>
                                        {sample.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                            Home
                        </Link>
                        <Link href="/docs" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                            Docs
                        </Link>
                    </div>
                </div>
                {selectedSample?.description && (
                    <p className="mt-1 text-sm text-gray-500">{selectedSample.description}</p>
                )}
            </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 flex flex-col overflow-hidden">{/* Remove old sample selector since it's now in header */}

            {isLoading && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Loading sample...</p>
                </div>
            )}            {!isLoading && (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 overflow-hidden">
                    {/* Editor Panel */}
                    <div className="bg-white rounded-lg shadow-sm border flex flex-col overflow-hidden">
                        <div className="border-b px-4 py-3 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-800">Editor</h2>
                            <p className="text-sm text-gray-600">Edit the Formdown content</p>
                        </div>
                        <div className="flex-1 min-h-0 overflow-hidden">
                            {isComponentsLoaded ? (
                                <div id="editor-container" className="h-full"></div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Loading editor...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Renderer Panel */}
                    <div className="bg-white rounded-lg shadow-sm border flex flex-col overflow-hidden">
                        <div className="border-b px-4 py-3 flex-shrink-0">
                            <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
                            <p className="text-sm text-gray-600">Live preview of the generated form</p>
                        </div>
                        <div className="flex-1 min-h-0 overflow-auto">
                            {isComponentsLoaded ? (
                                <div id="renderer-container" className="h-full p-4"></div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    Loading renderer...
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Data Panel - Fixed at bottom of main */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden" style={{ height: '200px' }}>
                <div className="border-b px-4 py-2 bg-gray-50 rounded-t-lg flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-800">
                            Data {Object.keys(formData).length > 0 && `(${Object.keys(formData).length} fields)`}
                        </h3>
                        <button
                            onClick={() => setFormData({})}
                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded transition-colors"
                        >
                            Clear
                        </button>
                    </div>
                </div>
                <div className="p-3 flex-1 min-h-0">
                    <textarea
                        value={Object.keys(formData).length > 0 ? JSON.stringify(formData, null, 2) : ''}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value)
                                setFormData(parsed)
                            } catch {
                                // Invalid JSON, don't update
                            }
                        }}
                        placeholder="Start typing in the form fields to see real-time data updates..."
                        className="w-full h-full resize-none border border-gray-200 rounded p-2 text-xs font-mono text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>                </div>
        </main>
    </div>
    )
}
