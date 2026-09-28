import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        try {
            const saved = localStorage.getItem('beefund-theme');
            if (saved !== null) {
                return saved === 'dark';
            }
            if (typeof window !== 'undefined' && window.matchMedia) {
                return window.matchMedia('(prefers-color-scheme: dark)').matches;
            }
        } catch (e) {
            console.warn('Error reading theme preference:', e);
        }
        return false;
    });

    useEffect(() => {
        try {
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
            localStorage.setItem('beefund-theme', isDark ? 'dark' : 'light');
        } catch (e) {
            console.warn('Error saving theme preference:', e);
        }
    }, [isDark]);

    // Cross-tab theme synchronization
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === 'beefund-theme' && e.newValue) {
                setIsDark(e.newValue === 'dark');
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

