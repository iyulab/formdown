import Link from 'next/link'

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="text-2xl font-bold text-gray-900">Formdown</Link>
                            <span className="text-gray-500">/</span>
                            <h1 className="text-xl text-gray-700">Documentation</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/demo" className="text-gray-600 hover:text-gray-900">Demo</Link>
                            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <nav className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                            <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>                            <ul className="space-y-2">
                                <li><a href="#overview" className="text-blue-600 hover:text-blue-800">Overview</a></li>
                                <li><a href="#installation" className="text-blue-600 hover:text-blue-800">Installation</a></li>
                                <li><a href="#syntax" className="text-blue-600 hover:text-blue-800">Basic Syntax</a></li>
                                <li><a href="#field-types" className="text-blue-600 hover:text-blue-800">Field Types</a></li>
                                <li><a href="#attributes" className="text-blue-600 hover:text-blue-800">Attributes</a></li>
                                <li><a href="#examples" className="text-blue-600 hover:text-blue-800">Examples</a></li>
                                <li><a href="#api" className="text-blue-600 hover:text-blue-800">API Reference</a></li>
                            </ul>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <section id="overview" className="mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Formdown Documentation</h2>
                                <p className="text-gray-600 mb-4">
                                    Formdown is a tool that enables web form creation using simple syntax similar to Markdown.
                                    Create complete forms with intuitive text syntax without writing complex HTML.
                                </p>
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                                    <p className="text-blue-800">
                                        <strong>GitHub Repository:</strong>
                                        <a href="https://github.com/formdown/formdown" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-2">
                                            https://github.com/formdown/formdown
                                        </a>
                                    </p>
                                </div>
                            </section>                            <section id="installation" className="mb-12">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Installation</h3>
                                <p className="text-gray-600 mb-4">
                                    Install Formdown packages using npm:
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <pre className="text-sm"><code>{`npm install @formdown/core @formdown/editor @formdown/viewer`}</code></pre>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Package roles:
                                </p>
                                <ul className="text-gray-600 space-y-2 ml-6">
                                    <li>• <strong>@formdown/core</strong>: Parsing and HTML generation</li>
                                    <li>• <strong>@formdown/editor</strong>: Web component editor</li>
                                    <li>• <strong>@formdown/viewer</strong>: Web component viewer</li>
                                </ul>
                            </section>

                            <section id="syntax" className="mb-12">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Basic Syntax</h3>
                                <p className="text-gray-600 mb-4">
                                    Formdown basic syntax follows <code className="bg-gray-100 px-2 py-1 rounded">@fieldname: [type] options</code> format.
                                </p>
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <pre className="text-sm"><code>{`@name: [text required placeholder="Enter your name"]
@email: [email required]
@age: [number min=18 max=100]`}</code></pre>
                                </div>
                            </section>                            <section id="field-types" className="mb-12">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Field Types</h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Basic Input Types</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li><code className="bg-gray-100 px-1 rounded">text</code> - Text input</li>
                                            <li><code className="bg-gray-100 px-1 rounded">email</code> - Email input</li>
                                            <li><code className="bg-gray-100 px-1 rounded">password</code> - Password input</li>
                                            <li><code className="bg-gray-100 px-1 rounded">tel</code> - Phone number input</li>
                                            <li><code className="bg-gray-100 px-1 rounded">url</code> - URL input</li>
                                            <li><code className="bg-gray-100 px-1 rounded">number</code> - Number input</li>
                                            <li><code className="bg-gray-100 px-1 rounded">date</code> - Date picker</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Advanced Input Types</h4>
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            <li><code className="bg-gray-100 px-1 rounded">textarea</code> - Text area</li>
                                            <li><code className="bg-gray-100 px-1 rounded">select</code> - Dropdown select</li>
                                            <li><code className="bg-gray-100 px-1 rounded">radio</code> - Radio buttons</li>
                                            <li><code className="bg-gray-100 px-1 rounded">checkbox</code> - Checkboxes</li>
                                            <li><code className="bg-gray-100 px-1 rounded">file</code> - File upload</li>
                                            <li><code className="bg-gray-100 px-1 rounded">range</code> - Range slider</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <section id="attributes" className="mb-12">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Attributes</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">                                        <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-2 text-left font-medium text-gray-900">Attribute</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-900">Description</th>
                                            <th className="px-4 py-2 text-left font-medium text-gray-900">Example</th>
                                        </tr>
                                    </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">required</code></td>
                                                <td className="px-4 py-2">Required input field</td>
                                                <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">[text required]</code></td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">placeholder</code></td>
                                                <td className="px-4 py-2">Placeholder text</td>
                                                <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">placeholder=&quot;Enter here&quot;</code></td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">min/max</code></td>
                                                <td className="px-4 py-2">Min/max values (numbers)</td>
                                                <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">min=18 max=100</code></td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">rows</code></td>
                                                <td className="px-4 py-2">Number of textarea rows</td>
                                                <td className="px-4 py-2"><code className="bg-gray-100 px-1 rounded">rows=4</code></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section id="examples" className="mb-12">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Examples</h3>

                                <h4 className="font-medium text-gray-900 mb-2">Simple Contact Form</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <pre className="text-sm"><code>{`@name: [text required placeholder="Enter your name"]
@email: [email required]
@message: [textarea rows=5 placeholder="Enter your message"]`}</code></pre>
                                </div>                                <h4 className="font-medium text-gray-900 mb-2">Registration Form</h4>
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <pre className="text-sm"><code>{`@username: [text required placeholder="Username"]
@email: [email required]
@password: [password required]
@age: [number min=18 max=100]
@gender: [radio] Male, Female, Prefer not to say
@interests: [checkbox] Sports, Music, Movies, Reading
@newsletter: [checkbox] Subscribe to newsletter`}</code></pre>
                                </div>
                            </section>

                            <section id="api" className="mb-12">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">API Reference</h3>

                                <h4 className="font-medium text-gray-900 mb-2">FormdownEditor Component</h4>
                                <p className="text-gray-600 mb-4">Editor component for editing Formdown syntax.</p>
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <pre className="text-sm"><code>{`<formdown-editor 
  content="@name: [text required]"
  show-preview="true"
></formdown-editor>`}</code></pre>
                                </div>

                                <h4 className="font-medium text-gray-900 mb-2">FormdownViewer Component</h4>
                                <p className="text-gray-600 mb-4">Viewer component that renders Formdown syntax as actual forms.</p>
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <pre className="text-sm"><code>{`<formdown-viewer 
  content="@name: [text required]"
  submit-text="Submit"
></formdown-viewer>`}</code></pre>
                                </div>
                            </section>

                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <Link href="/demo" className="text-blue-600 hover:text-blue-800">
                                        ← Try Live Demo
                                    </Link>
                                    <a href="https://github.com/formdown/formdown" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                        View on GitHub →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
