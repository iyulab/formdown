'use client'

import Link from "next/link";
import { useEffect, useState } from 'react';
import { FORMDOWN_INFO } from '@/lib/version';
import Head from 'next/head';

interface CustomElement extends HTMLElement {
    setAttribute(name: string, value: string): void
}

export default function Home() {
    const [isComponentsLoaded, setIsComponentsLoaded] = useState(false)

    useEffect(() => {
        const loadComponents = async () => {
            if (typeof window !== "undefined") {
                try {
                    console.log('Loading formdown components...')

                    // Import editor
                    await import("@formdown/editor")
                    console.log('Formdown editor loaded')

                    // Import UI component
                    await import("@formdown/ui")
                    console.log('Formdown UI loaded')

                    // Wait a bit for custom elements to register
                    await new Promise(resolve => setTimeout(resolve, 100))

                    setIsComponentsLoaded(true)
                    console.log('Components loaded successfully')
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
                    `# Contact Form (Shorthand Demo)

Please fill out the form below to get in touch with us.

@name(Your Name)*: [placeholder="Enter your full name"]
@email(Email Address)*: @[]
@message(Message): T4[placeholder="Your message..."]

@source(How did you hear about us?)*{Website,Social Media,Friend,Other}: r[]

@newsletter(Subscribe to newsletter): c[]

@submit_btn: [submit label="Send Message"]`
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
            <Head>
                <link rel="canonical" href="https://formdown.dev" />
            </Head>

            {/* Header */}
            <header className="bg-white shadow-sm" role="banner">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
                        <div className="flex items-center space-x-2">
                            <img src="/logo.svg" alt="Formdown Logo" className="w-8 h-8" />
                            <h1 className="text-2xl font-bold text-gray-900">Formdown</h1>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded" aria-label={`Version ${FORMDOWN_INFO.version}`}>
                                v{FORMDOWN_INFO.version}
                            </span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link href="/demo" className="text-gray-600 hover:text-gray-900" aria-label="View Demo">Demo</Link>
                            <Link href="/docs" className="text-gray-600 hover:text-gray-900" aria-label="Read Documentation">Docs</Link>
                            <a href="https://github.com/iyulab/formdown"
                                className="text-gray-600 hover:text-gray-900"
                                aria-label="View source code on GitHub"
                                target="_blank"
                                rel="noopener noreferrer">
                                GitHub
                            </a>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 py-20" role="main">
                <div className="text-center">
                    <h2 className="text-5xl font-bold text-gray-900 mb-6">
                        Create Interactive Forms<br />
                        <span className="text-blue-600">With Markdown Syntax</span>
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Formdown transforms Markdown documents into interactive web forms.
                        Write content in familiar Markdown, add @field syntax for form elements,
                        and get beautiful, functional forms with real-time data binding.
                        <strong>Plus shorthand syntax</strong> for faster development!
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
            <section className="max-w-6xl mx-auto px-4 py-16" aria-labelledby="demo-heading">
                <div className="text-center mb-8">
                    <h3 id="demo-heading" className="text-3xl font-bold text-gray-900 mb-4">Try It Now</h3>
                    <p className="text-gray-600">
                        See how Markdown with shorthand syntax becomes interactive forms. Edit the left panel and watch the form update in real-time.
                        Notice how <code>@name*: []</code> creates a required text field and <code>@email: @[]</code> makes an email input!
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {!isComponentsLoaded ? (
                        <div className="text-center py-16" role="status" aria-live="polite">
                            <p className="text-lg text-gray-600">Loading interactive editor...</p>
                        </div>
                    ) : (
                        <div id="formdown-demo-container" style={{ height: "500px" }} role="application" aria-label="Interactive Formdown editor"></div>
                    )}
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 py-16" aria-labelledby="features-heading">
                <div className="text-center mb-12">
                    <h3 id="features-heading" className="text-3xl font-bold text-gray-900 mb-4">Key Features</h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover the powerful features that Formdown provides
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8" role="list">
                    <article className="text-center" role="listitem">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Web Components</h4>
                        <p className="text-gray-600">
                            Built with Lit web components for universal compatibility. Works in any web framework or vanilla HTML.
                        </p>
                    </article>

                    <article className="text-center" role="listitem">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Real-time Preview</h4>
                        <p className="text-gray-600">
                            Interactive editor with live preview. See your Markdown transform into functional forms instantly.
                        </p>
                    </article>

                    <article className="text-center" role="listitem">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">TypeScript Ready</h4>
                        <p className="text-gray-600">
                            Full TypeScript support with type definitions. Perfect for modern development workflows.
                        </p>
                    </article>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 text-white py-16" role="complementary" aria-labelledby="cta-heading">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h3 id="cta-heading" className="text-3xl font-bold mb-4">Ready to Build Forms?</h3>
                    <p className="text-xl mb-8 text-blue-100">
                        Start creating interactive forms with Formdown&apos;s powerful web components
                    </p>
                    <div className="flex justify-center space-x-4" role="group" aria-label="Get started actions">
                        <Link
                            href="/demo"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            aria-label="Try the live demo"
                        >
                            Try Live Demo
                        </Link>
                        <a
                            href="https://www.npmjs.com/package/@formdown/ui"
                            className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors border border-blue-500"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Install via npm"
                        >
                            npm install @formdown/ui
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12" role="contentinfo">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-white font-semibold mb-4">Formdown</h4>
                            <p className="text-sm">
                                Interactive forms with Markdown syntax and web components
                            </p>
                        </div>
                        <nav aria-labelledby="docs-nav">
                            <h4 id="docs-nav" className="text-white font-semibold mb-4">Documentation</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/docs" className="hover:text-white">Getting Started</Link></li>
                                <li><Link href="/docs/syntax" className="hover:text-white">Syntax Guide</Link></li>
                                <li><Link href="/demo" className="hover:text-white">Live Demo</Link></li>
                            </ul>
                        </nav>
                        <nav aria-labelledby="packages-nav">
                            <h4 id="packages-nav" className="text-white font-semibold mb-4">Packages</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://www.npmjs.com/package/@formdown/ui" className="hover:text-white" target="_blank" rel="noopener noreferrer">@formdown/ui</a></li>
                                <li><a href="https://www.npmjs.com/package/@formdown/core" className="hover:text-white" target="_blank" rel="noopener noreferrer">@formdown/core</a></li>
                                <li><a href="https://www.npmjs.com/package/@formdown/editor" className="hover:text-white" target="_blank" rel="noopener noreferrer">@formdown/editor</a></li>
                            </ul>
                        </nav>
                        <nav aria-labelledby="community-nav">
                            <h4 id="community-nav" className="text-white font-semibold mb-4">Community</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://github.com/iyulab/formdown" className="hover:text-white" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                                <li><a href="https://github.com/iyulab/formdown/issues" className="hover:text-white" target="_blank" rel="noopener noreferrer">Issues</a></li>
                                <li><a href="https://formdown.dev" className="hover:text-white">Website</a></li>
                            </ul>
                        </nav>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                        <p>&copy; 2025 iyulab. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
