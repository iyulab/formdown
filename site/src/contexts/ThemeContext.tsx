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
            } else {
                root.classList.remove('dark');
                body.classList.remove('dark');
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
