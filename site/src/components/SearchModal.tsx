'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// Simple SVG icon components
const SearchIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const FileIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

interface SearchResult {
    title: string;
    slug: string;
    content: string;
    section?: string;
}

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Search data - in a real app, this would be loaded from an API or generated at build time
const searchData: SearchResult[] = [
    {
        title: "Getting Started",
        slug: "index",
        content: "Formdown transforms markdown-like syntax into interactive HTML forms. Write forms as naturally as writing text. Human readable, type safe, zero dependencies, framework agnostic.",
        section: "Introduction"
    },
    {
        title: "Installation",
        slug: "installation",
        content: "CDN, NPM package, editor tools. Quick start with script tag or npm install. React, Vue, Angular, Svelte integration examples.",
        section: "Setup"
    },
    {
        title: "Basic Syntax",
        slug: "basics",
        content: "Core pattern @field_name: [type attributes]. Smart labels, custom labels, field types: text, email, password, number, date, textarea, radio, checkbox, select.",
        section: "Fundamentals"
    },
    {
        title: "Shorthand Syntax",
        slug: "shorthand",
        content: "Faster form creation with shortcuts. Required fields with *, type markers @[] email #[] number, content patterns {options}, inline fields.",
        section: "Advanced"
    },
    {
        title: "Field Reference",
        slug: "reference",
        content: "Complete field types reference. Text inputs, date time, selection fields, validation attributes, HTML extensibility. All field types and attributes.",
        section: "Reference"
    },
    {
        title: "Validation",
        slug: "validation",
        content: "Form validation rules, JavaScript API, visual feedback, error handling. Required fields, pattern validation, custom validation rules.",
        section: "Features"
    },
    {
        title: "JavaScript API",
        slug: "api",
        content: "Programmatic control, validate() method, getFormData(), resetForm(), event handling. Access form data and validation from JavaScript.",
        section: "API"
    },
    {
        title: "Editor Tools",
        slug: "editor",
        content: "Development environment, live preview, syntax highlighting, error detection, auto-completion. Enhanced development experience.",
        section: "Tools"
    },
    {
        title: "Examples",
        slug: "examples",
        content: "Real-world form examples. Contact forms, registration, surveys, booking forms, inline fields, complex validation patterns.",
        section: "Examples"
    }
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Search function
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setSelectedIndex(0);
            return;
        }

        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        const searchResults = searchData
            .map(item => {
                let score = 0;
                const titleLower = item.title.toLowerCase();
                const contentLower = item.content.toLowerCase();
                const sectionLower = item.section?.toLowerCase() || '';

                // Title matches (highest weight)
                searchTerms.forEach(term => {
                    if (titleLower.includes(term)) {
                        score += titleLower === term ? 10 : 5;
                    }
                    if (sectionLower.includes(term)) {
                        score += 3;
                    }
                    if (contentLower.includes(term)) {
                        score += 1;
                    }
                });

                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8); // Limit to 8 results

        setResults(searchResults);
        setSelectedIndex(0);
    }, [query]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (results[selectedIndex]) {
                        const slug = results[selectedIndex].slug;
                        window.location.href = slug === 'index' ? '/docs' : `/docs/${slug}`;
                        onClose();
                    }
                    break;
                case 'Escape':
                    onClose();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex, onClose]);

    // Scroll selected item into view
    useEffect(() => {
        if (resultsRef.current) {
            const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [selectedIndex]);

    if (!isOpen) return null;

    const highlightText = (text: string, query: string) => {
        if (!query.trim()) return text;

        const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
        let highlightedText = text;

        searchTerms.forEach(term => {
            const regex = new RegExp(`(${term})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">$1</mark>');
        });

        return highlightedText;
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-screen items-start justify-center p-4 pt-[10vh]">
                <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center border-b border-gray-200 dark:border-gray-700 px-4">
                        <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search documentation..."
                            className="flex-1 py-4 text-lg outline-none placeholder-gray-400 dark:placeholder-gray-500 bg-transparent text-gray-900 dark:text-white"
                        />
                        <button
                            onClick={onClose}
                            className="ml-3 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Results */}
                    <div ref={resultsRef} className="max-h-96 overflow-y-auto">
                        {results.length > 0 ? (
                            <div className="py-2">
                                {results.map((result, index) => (
                                    <Link
                                        key={result.slug}
                                        href={result.slug === 'index' ? '/docs' : `/docs/${result.slug}`}
                                        onClick={onClose}
                                        className={`flex items-start px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${index === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/50 border-r-2 border-blue-500' : ''
                                            }`}
                                    >
                                        <FileIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3
                                                    className="font-medium text-gray-900 dark:text-white"
                                                    dangerouslySetInnerHTML={{
                                                        __html: highlightText(result.title, query)
                                                    }}
                                                />
                                                {result.section && (
                                                    <span className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                                                        {result.section}
                                                    </span>
                                                )}
                                            </div>
                                            <p
                                                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2"
                                                dangerouslySetInnerHTML={{
                                                    __html: highlightText(result.content, query)
                                                }}
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : query.trim() ? (
                            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                <SearchIcon className="w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                <p>No results found for &quot;{query}&quot;</p>
                                <p className="text-sm mt-1">Try different keywords or check spelling</p>
                            </div>
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                <SearchIcon className="w-8 h-8 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                                <p>Start typing to search documentation</p>
                                <div className="mt-4 text-sm space-y-1">
                                    <p><kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">↑↓</kbd> Navigate</p>
                                    <p><kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Enter</kbd> Select</p>
                                    <p><kbd className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd> Close</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded mr-1">⌘</kbd>
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded">K</kbd>
                                    <span className="ml-1">to search</span>
                                </span>
                            </div>
                            <span>Search {searchData.length} documents</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}