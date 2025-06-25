import Link from 'next/link';

// Simple SVG icon components
const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

interface DocNavItem {
    slug: string;
    title: string;
}

interface DocsLayoutProps {
    children: React.ReactNode;
    currentSlug?: string;
}

const docItems: DocNavItem[] = [
    { slug: 'index', title: 'Documentation' },
    { slug: 'overview', title: 'Overview' },
    { slug: 'quick-start', title: 'Quick Start' },
    { slug: 'syntax', title: 'Syntax Guide' },
    { slug: 'editor', title: 'Editor Guide' },
    { slug: 'api', title: 'API Reference' },
    { slug: 'examples', title: 'Examples' }
];

export default function DocsLayout({ children, currentSlug }: DocsLayoutProps) {
    const currentIndex = docItems.findIndex(item => item.slug === currentSlug);
    const prevDoc = currentIndex > 0 ? docItems[currentIndex - 1] : null;
    const nextDoc = currentIndex < docItems.length - 1 ? docItems[currentIndex + 1] : null;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="flex items-center space-x-2">
                                <img src="/logo.svg" alt="Formdown" className="w-8 h-8" />
                                <span className="text-xl font-semibold text-gray-900">Formdown</span>
                            </Link>
                            <Link href="/docs" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                Docs
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/demo" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                Demo
                            </Link>
                            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                                Home
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                <div className="flex">
                    {/* Sidebar Navigation */}
                    <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-gray-50 min-h-screen sticky top-16">
                        <div className="p-6">
                            <nav className="space-y-1">
                                {docItems.map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={`/docs/${item.slug}`}
                                        className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentSlug === item.slug
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <div className="max-w-4xl mx-auto px-6 py-8">
                            {children}

                            {/* Navigation buttons */}
                            {(prevDoc || nextDoc) && (
                                <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
                                    <div>
                                        {prevDoc && (
                                            <Link
                                                href={`/docs/${prevDoc.slug}`}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-blue-600"
                                            >
                                                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                                                {prevDoc.title}
                                            </Link>
                                        )}
                                    </div>
                                    <div>
                                        {nextDoc && (
                                            <Link
                                                href={`/docs/${nextDoc.slug}`}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-blue-600"
                                            >
                                                {nextDoc.title}
                                                <ChevronRightIcon className="w-4 h-4 ml-2" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
