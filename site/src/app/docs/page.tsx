import Link from 'next/link';
import { getAllDocs } from '@/lib/docs';
import DocsLayout from '@/components/DocsLayout';

export default function DocsPage() {
    const docs = getAllDocs();

    // Sort docs by a specific order
    const docOrder = [
        'index',
        'overview',
        'quick-start',
        'syntax',
        'editor',
        'api',
        'examples',
        'tasks'
    ];

    const sortedDocs = docs.sort((a, b) => {
        const aIndex = docOrder.indexOf(a.slug);
        const bIndex = docOrder.indexOf(b.slug);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    }); return (
        <DocsLayout currentSlug="index">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Complete documentation for Formdown - the human-readable form format.
                </p>

                {/* Test formdown-editor web component */}
                <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="text-lg font-semibold mb-4">Interactive Editor Test</h3>
                    <formdown-editor
                        content="# Contact Form

Name: _____
Email: _____@_____
Message: 
_________
_________
_________

[Submit]"
                        show-preview="true"
                    />
                </div>

                <div className="grid gap-4 md:grid-cols-2">{sortedDocs.filter(doc => doc.slug !== 'index').map((doc) => (
                    <Link
                        key={doc.slug}
                        href={`/docs/${doc.slug}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all bg-white"
                    >
                        <h3 className="text-lg font-semibold mb-2 text-gray-900 hover:text-blue-600">
                            {doc.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                            {getDocDescription(doc.slug)}
                        </p>
                    </Link>
                ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/demo"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                        >
                            Try Demo
                        </Link>
                        <a
                            href="https://github.com/iyulab/formdown"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://www.npmjs.com/package/@formdown/ui"
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            npm Package
                        </a>
                    </div>
                </div>
            </div>
        </DocsLayout>
    );
}

function getDocDescription(slug: string): string {
    const descriptions: Record<string, string> = {
        'index': 'Documentation overview and navigation',
        'overview': 'Core concepts and philosophy',
        'quick-start': 'Get up and running in minutes',
        'syntax': 'Complete syntax reference and field types',
        'editor': 'Development tools and editor usage',
        'api': 'JavaScript API documentation',
        'examples': 'Real-world form examples',
        'tasks': 'Development status and roadmap'
    };

    return descriptions[slug] || 'Documentation';
}
