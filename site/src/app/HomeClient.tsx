"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FORMDOWN_INFO } from '@/lib/version';

interface CustomElement extends HTMLElement {
    setAttribute(name: string, value: string): void;
}

export default function HomeClient() {
    const [isComponentsLoaded, setIsComponentsLoaded] = useState(false);

    useEffect(() => {
        const loadComponents = async () => {
            if (typeof window !== "undefined") {
                try {
                    await import("@formdown/editor");
                    await import("@formdown/ui");
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    setIsComponentsLoaded(true);
                } catch (error) {
                    console.error("Failed to load components:", error);
                }
            }
        };
        loadComponents();
    }, []);

    useEffect(() => {
        if (isComponentsLoaded) {
            const demoContainer = document.getElementById("formdown-demo-container");
            if (demoContainer) {
                const editor = document.createElement("formdown-editor") as CustomElement;
                editor.setAttribute("mode", "split");
                editor.setAttribute("header", "true");
                editor.setAttribute(
                    "content",
                    `# Contact Form\n\nPlease fill out the form below to get in touch with us.\n\n@name(Your Name): [text required placeholder=\"Enter your full name\"]\n@email(Email Address): [email required]\n@message(Message): [textarea rows=4 placeholder=\"Your message...\"]\n\n@source(How did you hear about us?): [radio required]\n  - Website\n  - Social Media\n  - Friend\n  - Other\n\n@newsletter(Subscribe to newsletter): [checkbox]\n\n@submit_btn: [submit label=\"Send Message\"]`
                );
                editor.style.height = "500px";
                editor.style.width = "100%";
                editor.style.display = "block";
                demoContainer.innerHTML = "";
                demoContainer.appendChild(editor);
            }
        }
    }, [isComponentsLoaded]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <h1 className="text-2xl font-bold text-gray-900">Formdown</h1>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">v{FORMDOWN_INFO.version}</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link href="/demo" className="text-gray-600 hover:text-gray-900">Demo</Link>
                            <Link href="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
                            <a href="https://github.com/iyulab/formdown" className="text-gray-600 hover:text-gray-900">GitHub</a>
                        </div>
                    </nav>
                </div>
            </header>
            {/* ...existing code... */}
        </div>
    );
}
