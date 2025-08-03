'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';

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

const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
    { slug: 'index', title: 'Getting Started' },
    { slug: 'installation', title: 'Installation' },
    { slug: 'basics', title: 'Basic Syntax' },
    { slug: 'shorthand', title: 'Shorthand Syntax' },
    { slug: 'reference', title: 'Field Reference' },
    { slug: 'validation', title: 'Validation' },
    { slug: 'api', title: 'JavaScript API' },
    { slug: 'editor', title: 'Editor Tools' },
    { slug: 'examples', title: 'Examples' }
];

export default function DocsLayout({ children, currentSlug }: DocsLayoutProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const currentIndex = docItems.findIndex(item => item.slug === currentSlug);
    const prevDoc = currentIndex > 0 ? docItems[currentIndex - 1] : null;
    const nextDoc = currentIndex < docItems.length - 1 ? docItems[currentIndex + 1] : null;

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="flex items-center space-x-2">
                                <img src="/logo.svg" alt="Formdown" className="w-8 h-8" />
                                <span className="text-xl font-semibold text-gray-900 dark:text-white">Formdown</span>
                            </Link>
                            <Link href="/docs" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                Docs
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                                <SearchIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">Search</span>
                                <span className="hidden sm:inline text-xs">
                                    <kbd className="px-1 py-0.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">⌘K</kbd>
                                </span>
                            </button>
                            <ThemeToggle />
                            <Link href="/demo" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                Demo
                            </Link>
                            <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                                Home
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                <div className="lg:flex">
                    {/* Sidebar Navigation - Hidden on mobile */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 fixed top-16 left-0 h-screen overflow-y-auto z-40">
                        <div className="p-6">
                            {/* Search button in sidebar */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="w-full flex items-center space-x-3 px-3 py-2 mb-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                <SearchIcon className="w-4 h-4" />
                                <span>Search docs</span>
                                <span className="ml-auto text-xs">
                                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs">⌘K</kbd>
                                </span>
                            </button>

                            <nav className="space-y-1">
                                {docItems.map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={item.slug === 'index' ? '/docs' : `/docs/${item.slug}`}
                                        className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentSlug === item.slug
                                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Mobile Navigation */}
                    <div className="lg:hidden mb-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-2">
                                {docItems.map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={item.slug === 'index' ? '/docs' : `/docs/${item.slug}`}
                                        className={`px-3 py-2 text-sm font-medium rounded-md text-center transition-colors ${currentSlug === item.slug
                                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                                            }`}
                                    >
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 lg:ml-64">
                        <div className="max-w-4xl mx-auto px-6 py-8">
                            {children}

                            {/* Navigation buttons */}
                            {(prevDoc || nextDoc) && (
                                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                                    <div>
                                        {prevDoc && (
                                            <Link
                                                href={`/docs/${prevDoc.slug}`}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
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
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
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

            {/* Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </div>
    );
}
