'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem('formdown-theme') as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            // Check system preference
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(systemPrefersDark ? 'dark' : 'light');
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            const root = window.document.documentElement;
            const body = window.document.body;

            if (theme === 'dark') {
                root.classList.add('dark');
                body.classList.add('dark');
                // Update CSS variables for Shadow DOM compatibility
                root.style.setProperty('--theme-bg-primary', '#111827');
                root.style.setProperty('--theme-bg-secondary', '#1f2937');
                root.style.setProperty('--theme-text-primary', '#f9fafb');
                root.style.setProperty('--theme-text-secondary', '#d1d5db');
                root.style.setProperty('--theme-border', '#374151');
                root.style.setProperty('--theme-accent', '#60a5fa');
                root.style.setProperty('--theme-error', '#ef4444');
                root.style.setProperty('--theme-error-bg', '#1f1f1f');
            } else {
                root.classList.remove('dark');
                body.classList.remove('dark');
                // Update CSS variables for Shadow DOM compatibility
                root.style.setProperty('--theme-bg-primary', '#ffffff');
                root.style.setProperty('--theme-bg-secondary', '#f8fafc');
                root.style.setProperty('--theme-text-primary', '#1f2937');
                root.style.setProperty('--theme-text-secondary', '#6b7280');
                root.style.setProperty('--theme-border', '#e5e7eb');
                root.style.setProperty('--theme-accent', '#3b82f6');
                root.style.setProperty('--theme-error', '#dc2626');
                root.style.setProperty('--theme-error-bg', '#fef2f2');
            }

            localStorage.setItem('formdown-theme', theme);
        }
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Always provide the context, but mark when not mounted
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
