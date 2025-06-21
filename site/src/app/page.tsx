'use client'

import Link from "next/link";
import { useEffect, useState } from 'react';

interface CustomElement extends HTMLElement {
    setAttribute(name: string, value: string): void
}

export default function Home() {
    const [isComponentsLoaded, setIsComponentsLoaded] = useState(false)

    useEffect(() => {
        const loadComponents = async () => {
            if (typeof window !== "undefined") {
                try {
                    await import("@formdown/editor")
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
            const demoContainer = document.getElementById("formdown-demo-container")
            if (demoContainer) {
                const editor = document.createElement("formdown-editor") as CustomElement
                editor.setAttribute("mode", "split")
                editor.setAttribute("header", "true")
                editor.setAttribute("content",
                    '@name: [text required placeholder="Enter your name"]\n' +
                    '@email: [email required]\n' +
                    '@user_name(User Name): [text]\n' +
                    '@bio: [textarea rows=4]\n' +
                    '@gender: [radio] Male, Female, Other\n' +
                    '@interests: [checkbox] Development, Design, Music'
                )
                editor.style.height = "500px"
                editor.style.width = "100%"
                editor.style.display = "block"

                demoContainer.innerHTML = ""
                demoContainer.appendChild(editor)
            }
        }
    }, [isComponentsLoaded])

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
                            <Link href="/demo" className="text-gray-600 hover:text-gray-900">Demo</Link>
                            <Link href="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
                            <a href="https://github.com/formdown/formdown" className="text-gray-600 hover:text-gray-900">GitHub</a>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 py-20">
                <div className="text-center">
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">
                        Write Forms Like<br />
                        <span className="text-blue-600">Markdown</span>
                    </h2>                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Formdown extends Markdown syntax to easily create HTML documents and form elements.
                        Create complex web forms with simple text syntax.
                    </p>
                    <div className="flex justify-center space-x-4">                        <Link
                        href="/demo"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Try Live Demo
                    </Link>
                        <Link
                            href="/docs"
                            className="bg-white text-gray-700 px-8 py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            View Documentation
                        </Link>
                    </div>
                </div>
            </section>            {/* Code Example */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Try It Now</h3>
                    <p className="text-gray-600">
                        See how Formdown syntax transforms into interactive forms
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {!isComponentsLoaded ? (
                        <div className="text-center py-16">
                            <p className="text-lg text-gray-600">Loading interactive editor...</p>
                        </div>
                    ) : (
                        <div id="formdown-demo-container" style={{ height: "500px" }}></div>
                    )}
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the powerful features that Formdown provides
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Simple Syntax</h4>
                        <p className="text-gray-600">
                            Create complex HTML forms easily with intuitive Markdown-based syntax.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Extensible</h4>
                        <p className="text-gray-600">
                            Extend existing Markdown syntax to express all HTML form elements.
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Developer Friendly</h4>
                        <p className="text-gray-600">
                            Text-based approach makes version control easy and optimized for collaboration.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">                    <h3 className="text-3xl font-bold mb-4">Get Started Now</h3>
                    <p className="text-xl mb-8 text-blue-100">
                        Create beautiful web forms in minutes with Formdown
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link
                            href="/demo"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >                            Live Demo
                        </Link>
                        <a
                            href="https://www.npmjs.com/package/@formdown/core"
                            className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-500"
                        >
                            npm install
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>                            <h4 className="text-white font-semibold mb-4">Formdown</h4>
                            <p className="text-sm">
                                Markdown-based form creation tool
                            </p>
                        </div>
                        <div>                            <h4 className="text-white font-semibold mb-4">Documentation</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/docs" className="hover:text-white">Getting Started</Link></li>
                                <li><Link href="/docs" className="hover:text-white">Syntax Guide</Link></li>
                                <li><Link href="/docs" className="hover:text-white">Examples</Link></li>
                            </ul>
                        </div>
                        <div>                            <h4 className="text-white font-semibold mb-4">Packages</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://www.npmjs.com/package/@formdown/core" className="hover:text-white">@formdown/core</a></li>
                                <li><a href="https://www.npmjs.com/package/@formdown/editor" className="hover:text-white">@formdown/editor</a></li>
                                <li><a href="https://www.npmjs.com/package/@formdown/viewer" className="hover:text-white">@formdown/viewer</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Community</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://github.com/formdown/formdown" className="hover:text-white">GitHub</a></li>
                                <li><a href="https://github.com/formdown/formdown/issues" className="hover:text-white">Issues</a></li>
                                <li><a href="https://github.com/formdown/formdown/discussions" className="hover:text-white">Discussions</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                        <p>&copy; 2025 Formdown. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
