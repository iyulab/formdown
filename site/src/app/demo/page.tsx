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

export default function DemoPage() {
    const [isComponentsLoaded, setIsComponentsLoaded] = useState(false)
    const [formData, setFormData] = useState<Record<string, unknown>>({})
    const [samples, setSamples] = useState<Sample[]>([])
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

        // Load samples from API
        loadSamples()
    }, [])

    const loadSamples = async () => {
        try {
            const response = await fetch('/api/samples')
            if (response.ok) {
                const samplesData = await response.json()
                setSamples(samplesData)
                if (samplesData.length > 0) {
                    setSelectedSample(samplesData[0])
                }
            }
        } catch (error) {
            console.error('Error loading samples:', error)
        }
    }

    useEffect(() => {
        if (selectedSample) {
            loadSample(selectedSample.filename)
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
                }                // Update content property only if not updating from editor
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
                    } renderer = document.createElement("formdown-ui") as CustomElement
                    renderer.style.height = "100%"
                    renderer.style.width = "100%"
                    renderer.style.display = "block"

                    console.log('Created formdown-ui element:', renderer)

                    renderer.addEventListener('formSubmit', (e: CustomEvent) => {
                        setFormData(e.detail)
                        console.log('Form data:', e.detail)
                    })

                    rendererContainer.appendChild(renderer)
                    console.log('Appended renderer to container')

                    // Check if the element has any content after a short delay
                    setTimeout(() => {
                        console.log('Renderer innerHTML after 500ms:', renderer.innerHTML ? 'Has content' : 'Empty')
                        console.log('Renderer shadowRoot after 500ms:', renderer.shadowRoot ? 'Has shadow DOM' : 'No shadow DOM')
                    }, 500)
                }                // Always update content property
                (renderer as CustomElement).content = content
                console.log('Element content property updated:', (renderer as CustomElement).content)
            } else {
                console.error('Renderer container not found')
            }
        }
    }, [isComponentsLoaded, content])

    return (
        <div className="h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm border-b flex-shrink-0">
                <div className="px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Formdown Demo</h1>
                            <p className="text-sm text-gray-600">Interactive editor and renderer</p>
                        </div>
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 overflow-y-auto">{/* Sample Selector */}
                <div className="mb-6">
                    <label htmlFor="sample-select" className="block text-sm font-medium text-gray-700 mb-2">
                        Choose a sample:
                    </label>
                    <select
                        id="sample-select" value={selectedSample?.filename || ''}
                        onChange={(e) => {
                            const sample = samples.find(s => s.filename === e.target.value)
                            if (sample) setSelectedSample(sample)
                        }}
                        className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        disabled={samples.length === 0}
                    >
                        {samples.length === 0 ? (
                            <option>Loading samples...</option>
                        ) : (
                            samples.map((sample) => (
                                <option key={sample.filename} value={sample.filename}>
                                    {sample.name}
                                </option>
                            ))
                        )}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                        {selectedSample?.description || 'Select a sample to see its description'}
                    </p>
                </div>                {isLoading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="mt-2 text-gray-600">Loading sample...</p>
                    </div>
                )}                {!isLoading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-12rem)]">
                        {/* Editor Panel */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="border-b px-4 py-3">
                                <h2 className="text-lg font-semibold text-gray-800">Editor</h2>
                                <p className="text-sm text-gray-600">Edit the Formdown content</p>
                            </div>                            <div className="p-4 h-[calc(100%-4rem)]">
                                {isComponentsLoaded ? (
                                    <div id="editor-container" className="h-full border rounded"></div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        Loading editor...
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Renderer Panel */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="border-b px-4 py-3">
                                <h2 className="text-lg font-semibold text-gray-800">Preview</h2>
                                <p className="text-sm text-gray-600">Live preview of the generated form</p>
                            </div>
                            <div className="p-4 h-[calc(100%-4rem)] overflow-auto">
                                {isComponentsLoaded ? (
                                    <div id="renderer-container" className="h-full"></div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        Loading renderer...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Data Display */}
                {Object.keys(formData).length > 0 && (
                    <div className="mt-6 bg-white rounded-lg shadow-sm border">
                        <div className="border-b px-4 py-3">
                            <h2 className="text-lg font-semibold text-gray-800">Form Data</h2>
                            <p className="text-sm text-gray-600">Latest form submission</p>
                        </div>
                        <div className="p-4">
                            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                                {JSON.stringify(formData, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
