import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        try {
            const saved = localStorage.getItem('beefund-theme');
            if (saved !== null) {
                return saved === 'dark';
            }
            // Default to Light Mode for professional financial portal experience
            return false;
        } catch (e) {
            console.warn('Error reading theme preference:', e);
        }
        return false;
    });

    useEffect(() => {
        try {
            const themeVal = isDark ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', themeVal);
            document.body.setAttribute('data-theme', themeVal);
            if (isDark) {
                document.documentElement.classList.add('dark-theme', 'dark-mode');
                document.documentElement.classList.remove('light-theme', 'light-mode');
                document.body.classList.add('dark-theme', 'dark-mode');
                document.body.classList.remove('light-theme', 'light-mode');
            } else {
                document.documentElement.classList.add('light-theme', 'light-mode');
                document.documentElement.classList.remove('dark-theme', 'dark-mode');
                document.body.classList.add('light-theme', 'light-mode');
                document.body.classList.remove('dark-theme', 'dark-mode');
            }
            localStorage.setItem('beefund-theme', themeVal);
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

