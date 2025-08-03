'use client'

import Link from "next/link";
import { useEffect, useState } from 'react';
import { FORMDOWN_INFO } from '@/lib/version';
import Head from 'next/head';
import ThemeToggle from '@/components/ThemeToggle';

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
                    `# Contact Form (New Features Demo)

Please fill out the information below. Fields maintain their original order!

## Personal Details
@name(Your Name)*: [placeholder="Enter your full name"]
@email(Email Address)*: @[]

We value your privacy and will not share your information.

## Contact Preferences  
@source(How did you hear about us?)*{Website,Social Media,Friend,*(Please specify)}: r[]
@interests{Tech News,Product Updates,Events,*(Custom Topic)}: c[]
@contact_method{Email,Phone,SMS,*(Preferred Method)}: r[]

## Your Message
@message(Message): T4[placeholder="Your message..."]

Thank you for reaching out to us!

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900">
            <Head>
                <link rel="canonical" href="https://formdown.dev" />
            </Head>

            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm" role="banner">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <nav className="flex items-center justify-between" role="navigation" aria-label="Main navigation">
                        <div className="flex items-center space-x-2">
                            <img src="/logo.svg" alt="Formdown Logo" className="w-8 h-8" />
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Formdown</h1>
                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded" aria-label={`Version ${FORMDOWN_INFO.version}`}>
                                v{FORMDOWN_INFO.version}
                            </span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link href="/demo" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" aria-label="View Demo">Demo</Link>
                            <Link href="/docs" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" aria-label="Read Documentation">Docs</Link>
                            <a href="https://github.com/iyulab/formdown"
                                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                aria-label="View source code on GitHub"
                                target="_blank"
                                rel="noopener noreferrer">
                                GitHub
                            </a>
                            <ThemeToggle />
                        </div>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-6xl mx-auto px-4 py-20" role="main">
                <div className="text-center">
                    <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Create Interactive Forms<br />
                        <span className="text-blue-600 dark:text-blue-400">With Markdown Syntax</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        Formdown transforms Markdown documents into interactive web forms.
                        Write content in familiar Markdown, add @field syntax for form elements,
                        and get beautiful, functional forms with real-time data binding.
                        <strong className="text-gray-900 dark:text-white">Features custom &quot;other&quot; options, smart field ordering, and shorthand syntax</strong> for rapid development!
                    </p>
                    <div className="flex justify-center space-x-4">                        <Link
                        href="/demo"
                        className="bg-blue-600 dark:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                    >
                        Try Live Demo
                    </Link>
                        <Link
                            href="/docs"
                            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            View Documentation
                        </Link>
                    </div>
                </div>
            </section>            {/* Code Example */}
            <section className="max-w-6xl mx-auto px-4 py-16" aria-labelledby="demo-heading">
                <div className="text-center mb-8">
                    <h3 id="demo-heading" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Try It Now</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        See how Markdown with advanced features becomes interactive forms. Edit the left panel and watch the form update in real-time.
                        Notice field ordering preservation, custom &quot;other&quot; labels like <code className="text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-1 py-0.5 rounded">*(Please specify)</code>, and shorthand syntax like <code className="text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-1 py-0.5 rounded">@email: @[]</code>!
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                    {!isComponentsLoaded ? (
                        <div className="text-center py-16" role="status" aria-live="polite">
                            <p className="text-lg text-gray-600 dark:text-gray-300">Loading interactive editor...</p>
                        </div>
                    ) : (
                        <div id="formdown-demo-container" style={{ height: "500px" }} role="application" aria-label="Interactive Formdown editor"></div>
                    )}
                </div>
            </section>

            {/* Features */}
            <section className="max-w-6xl mx-auto px-4 py-16" aria-labelledby="features-heading">
                <div className="text-center mb-12">
                    <h3 id="features-heading" className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h3>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Discover the powerful features that Formdown provides
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
                    <article className="text-center" role="listitem">
                        <div className="bg-blue-100 dark:bg-blue-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Field Ordering</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                            Fields maintain their exact position in the markdown document. Create complex multi-section forms with preserved content flow.
                        </p>
                    </article>

                    <article className="text-center" role="listitem">
                        <div className="bg-green-100 dark:bg-green-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Custom &quot;Other&quot; Options</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                            Add custom &quot;other&quot; options with <code className="text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-1 py-0.5 rounded">*(Custom Label)</code>. Users can specify their own values with personalized labels.
                        </p>
                    </article>

                    <article className="text-center" role="listitem">
                        <div className="bg-purple-100 dark:bg-purple-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Shorthand Syntax</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                            Lightning-fast development with shorthand syntax. <code className="text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-1 py-0.5 rounded">@email: @[]</code> creates email fields in seconds.
                        </p>
                    </article>

                    <article className="text-center" role="listitem">
                        <div className="bg-yellow-100 dark:bg-yellow-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Preview</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                            Interactive editor with live preview. See your Markdown transform into functional forms instantly.
                        </p>
                    </article>

                    <article className="text-center" role="listitem">
                        <div className="bg-red-100 dark:bg-red-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10M7 4l1 16h8l1-16M7 4H4m3 0V2"></path>
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Web Components</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                            Built with Lit web components for universal compatibility. Works in any web framework or vanilla HTML.
                        </p>
                    </article>

                    <article className="text-center lg:col-span-1 md:col-span-2" role="listitem">
                        <div className="bg-indigo-100 dark:bg-indigo-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" aria-hidden="true">
                            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                            </svg>
                        </div>
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">TypeScript Ready</h4>
                        <p className="text-gray-600 dark:text-gray-300">
                            Full TypeScript support with comprehensive type definitions. Perfect for modern development workflows.
                        </p>
                    </article>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-blue-600 dark:bg-blue-700 text-white py-16" role="complementary" aria-labelledby="cta-heading">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h3 id="cta-heading" className="text-3xl font-bold mb-4">Ready to Build Forms?</h3>
                    <p className="text-xl mb-8 text-blue-100 dark:text-blue-200">
                        Start creating interactive forms with Formdown&apos;s powerful web components
                    </p>
                    <div className="flex justify-center space-x-4" role="group" aria-label="Get started actions">
                        <Link
                            href="/demo"
                            className="bg-white text-blue-600 dark:text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors"
                            aria-label="Try the live demo"
                        >
                            Try Live Demo
                        </Link>
                        <a
                            href="https://www.npmjs.com/package/@formdown/ui"
                            className="bg-blue-700 dark:bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 dark:hover:bg-blue-900 transition-colors border border-blue-500 dark:border-blue-600"
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
            <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400 py-12" role="contentinfo">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h4 className="text-white dark:text-gray-200 font-semibold mb-4">Formdown</h4>
                            <p className="text-sm">
                                Interactive forms with Markdown syntax and web components
                            </p>
                        </div>
                        <nav aria-labelledby="docs-nav">
                            <h4 id="docs-nav" className="text-white dark:text-gray-200 font-semibold mb-4">Documentation</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/docs" className="hover:text-white dark:hover:text-gray-200">Getting Started</Link></li>
                                <li><Link href="/docs/syntax" className="hover:text-white dark:hover:text-gray-200">Syntax Guide</Link></li>
                                <li><Link href="/demo" className="hover:text-white dark:hover:text-gray-200">Live Demo</Link></li>
                            </ul>
                        </nav>
                        <nav aria-labelledby="packages-nav">
                            <h4 id="packages-nav" className="text-white dark:text-gray-200 font-semibold mb-4">Packages</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://www.npmjs.com/package/@formdown/ui" className="hover:text-white dark:hover:text-gray-200" target="_blank" rel="noopener noreferrer">@formdown/ui</a></li>
                                <li><a href="https://www.npmjs.com/package/@formdown/core" className="hover:text-white dark:hover:text-gray-200" target="_blank" rel="noopener noreferrer">@formdown/core</a></li>
                                <li><a href="https://www.npmjs.com/package/@formdown/editor" className="hover:text-white dark:hover:text-gray-200" target="_blank" rel="noopener noreferrer">@formdown/editor</a></li>
                            </ul>
                        </nav>
                        <nav aria-labelledby="community-nav">
                            <h4 id="community-nav" className="text-white dark:text-gray-200 font-semibold mb-4">Community</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="https://github.com/iyulab/formdown" className="hover:text-white dark:hover:text-gray-200" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                                <li><a href="https://github.com/iyulab/formdown/issues" className="hover:text-white dark:hover:text-gray-200" target="_blank" rel="noopener noreferrer">Issues</a></li>
                                <li><a href="https://formdown.dev" className="hover:text-white dark:hover:text-gray-200">Website</a></li>
                            </ul>
                        </nav>
                    </div>
                    <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-sm">
                        <p>&copy; 2025 iyulab. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
