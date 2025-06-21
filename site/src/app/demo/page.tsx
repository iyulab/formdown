'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface CustomElement extends HTMLElement {
    setAttribute(name: string, value: string): void
    addEventListener(type: string, listener: (event: CustomEvent) => void): void
}

export default function DemoPage() {
    const [isComponentsLoaded, setIsComponentsLoaded] = useState(false)
    const [formData, setFormData] = useState<Record<string, unknown>>({})
    const [content, setContent] = useState(
        '@name: [text required placeholder="Enter your full name"]\n' +
        '@email: [email required placeholder="your@email.com"]\n' +
        '@user_name(User Name): [text placeholder="Username"]\n' +
        '@bio: [textarea rows=4 placeholder="Tell us about yourself"]\n' +
        '@gender: [radio] Male, Female, Other\n' +
        '@interests: [checkbox] Programming, Design, Music, Sports\n' +
        '@country: [select] USA, Canada, UK, Germany, Japan, Other'
    )

    useEffect(() => {
        const loadComponents = async () => {
            if (typeof window !== "undefined") {
                try {
                    await import("@formdown/editor")
                    await import("@formdown/ui")
                    setIsComponentsLoaded(true)
                } catch (error) {
                    console.error("Failed to load components:", error)
                }
            }
        }
        loadComponents()
    }, [])

    useEffect(() => {
        if (isComponentsLoaded) {
            const editorContainer = document.getElementById("editor-container")
            if (editorContainer) {
                const editor = document.createElement("formdown-editor") as CustomElement
                editor.setAttribute("content", content)
                editor.setAttribute("mode", "edit")
                editor.style.height = "100%"
                editor.style.width = "100%"
                editor.style.display = "block"

                editor.addEventListener('contentChange', (e: CustomEvent) => {
                    setContent(e.detail.content)
                })

                editorContainer.innerHTML = ""
                editorContainer.appendChild(editor)
            }

            const uiContainer = document.getElementById("ui-container")
            if (uiContainer) {
                const ui = document.createElement("formdown-ui") as CustomElement
                ui.setAttribute("content", content)
                ui.setAttribute("form-id", "demo-form")
                ui.style.width = "100%"
                ui.style.display = "block"

                ui.addEventListener('formDataChanged', (e: CustomEvent) => {
                    setFormData(e.detail || {})
                })

                uiContainer.innerHTML = ""
                uiContainer.appendChild(ui)
            }
        }
    }, [isComponentsLoaded, content])

    // Separate effect for updating content
    useEffect(() => {
        if (isComponentsLoaded) {
            const ui = document.getElementById("ui-container")?.firstElementChild as CustomElement
            if (ui && ui.setAttribute) {
                ui.setAttribute("content", content)
            }
        }
    }, [content, isComponentsLoaded])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-2xl font-bold text-gray-900">Formdown</h1>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">v0.1.0</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link href="/demo" className="text-blue-600 font-semibold">Demo</Link>
                            <Link href="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
                            <a href="https://github.com/formdown/formdown" className="text-gray-600 hover:text-gray-900">GitHub</a>
                        </div>
                    </nav>
                </div>
            </header>            {/* Demo Section */}
            <section className="max-w-full mx-auto px-0 py-0" style={{ height: "calc(100vh - 80px)" }}>
                {!isComponentsLoaded ? (
                    <div className="text-center pt-20">
                        <p className="text-lg text-gray-600">Loading components...</p>
                    </div>) : (
                    <div className="h-full flex flex-col">
                        {/* Top: Editor and Viewer */}
                        <div className="flex-1 grid grid-cols-2">
                            {/* Editor */}
                            <div className="border-r border-gray-200 flex flex-col">
                                <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium">
                                    Editor
                                </div>
                                <div className="flex-1">
                                    <div id="editor-container" style={{ height: "100%", width: "100%" }}></div>
                                </div>
                            </div>

                            {/* Viewer */}
                            <div className="bg-gray-50 flex flex-col">
                                <div className="bg-gray-700 text-white px-4 py-2 text-sm font-medium">
                                    Viewer
                                </div>
                                <div className="flex-1 p-8">
                                    <div id="ui-container" style={{ height: "100%" }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Data - Fixed height */}
                        <div className="border-t border-gray-200 flex flex-col h-48">
                            <div className="bg-gray-600 text-white px-4 py-2 text-sm font-medium">
                                Data
                            </div>
                            <div className="flex-1 p-4 bg-gray-900">
                                <pre className="text-green-400 text-sm font-mono h-full overflow-auto">
                                    {Object.keys(formData).length > 0
                                        ? JSON.stringify(formData, null, 2)
                                        : '{\n  // Form data will appear here as you interact with the form...\n}'}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    )
}
