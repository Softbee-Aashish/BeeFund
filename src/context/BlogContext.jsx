import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import initialBlogPosts from '../data/blogPosts.json';

const BlogContext = createContext(null);
const STORAGE_KEY = 'beefund_blogs_v1';
const PRIMARY_SHEET_KEY = 'beefund_sheet_url';
const LEGACY_SHEET_KEY = 'beefund_articles_sheet_url';

export const BlogProvider = ({ children }) => {
    // Google Apps Script Web App URL
    const [sheetUrl, setSheetUrlState] = useState(() => {
        try {
            return localStorage.getItem(PRIMARY_SHEET_KEY) || 
                   localStorage.getItem(LEGACY_SHEET_KEY) || 
                   import.meta.env.VITE_GOOGLE_SHEET_URL || 
                   import.meta.env.VITE_ARTICLES_SHEET_URL || '';
        } catch {
            return '';
        }
    });

    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState({ state: 'idle', message: '', time: null });

    const setSheetUrl = useCallback((url) => {
        const clean = (url || '').trim();
        setSheetUrlState(clean);
        try {
            if (clean) {
                localStorage.setItem(PRIMARY_SHEET_KEY, clean);
                localStorage.setItem(LEGACY_SHEET_KEY, clean);
            } else {
                localStorage.removeItem(PRIMARY_SHEET_KEY);
                localStorage.removeItem(LEGACY_SHEET_KEY);
            }
        } catch (e) {
            console.error('Failed to save sheet URL:', e);
        }
    }, []);

    // Sync across tabs and with CardsContext
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === PRIMARY_SHEET_KEY || e.key === LEGACY_SHEET_KEY) {
                setSheetUrlState(e.newValue || '');
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const [posts, setPosts] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Failed to parse blogs from localStorage:', e);
        }
        // Normalize initial posts with status and timestamp if missing
        return initialBlogPosts.map(p => ({
            ...p,
            status: p.status || 'published',
            category: p.category || 'Financial Planning',
            updatedAt: p.updatedAt || p.date
        }));
    });

    // Save to localStorage whenever posts change
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
        } catch (e) {
            console.error('Failed to save blogs to localStorage:', e);
        }
    }, [posts]);

    // Publicly published posts only
    const publishedPosts = posts.filter(post => post.status === 'published');

    // Get single post by slug
    const getPostBySlug = (slug, includeDrafts = false) => {
        return posts.find(p => p.slug === slug && (includeDrafts || p.status === 'published'));
    };

    // Helper: auto-generate unique slug
    const generateSlug = (title, currentId = null) => {
        let base = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
        
        if (!base) base = 'post';

        let candidate = base;
        let counter = 1;
        while (posts.some(p => p.slug === candidate && p.id !== currentId)) {
            candidate = `${base}-${counter}`;
            counter++;
        }
        return candidate;
    };

    // ----------------------------------------------------
    // GOOGLE APPS SCRIPT LIVE SYNC FUNCTIONS
    // ----------------------------------------------------

    // Fetch all articles from the Google Sheet
    const fetchFromSheet = useCallback(async (targetUrl = sheetUrl) => {
        const urlToUse = targetUrl || sheetUrl;
        if (!urlToUse) {
            return { success: false, message: 'Google Sheet Web App URL is not configured.' };
        }

        setIsSyncing(true);
        setSyncStatus({ state: 'syncing', message: 'Fetching articles from Google Sheet...', time: new Date() });

        try {
            const res = await fetch(urlToUse, { method: 'GET' });
            if (!res.ok) {
                throw new Error(`HTTP error ${res.status}`);
            }
            const data = await res.json();
            
            if (data && data.success && Array.isArray(data.articles)) {
                if (data.articles.length > 0) {
                    const normalized = data.articles.map(a => ({
                        id: Number(a.id) || a.id,
                        title: a.title || 'Untitled',
                        slug: a.slug || generateSlug(a.title || 'article'),
                        category: a.category || 'Financial Planning',
                        author: a.author || 'BeeFund Financial Editorial Team',
                        date: a.date || new Date().toISOString().split('T')[0],
                        excerpt: a.excerpt || '',
                        content: a.content || '',
                        status: a.status || 'published',
                        updatedAt: a.updatedAt || a.date
                    }));
                    setPosts(normalized);
                    setSyncStatus({ 
                        state: 'success', 
                        message: `Successfully loaded ${normalized.length} articles from Google Sheet!`, 
                        time: new Date() 
                    });
                    return { success: true, count: normalized.length };
                } else {
                    setSyncStatus({ 
                        state: 'idle', 
                        message: 'Google Sheet is connected, but has no rows yet.', 
                        time: new Date() 
                    });
                    return { success: true, count: 0 };
                }
            } else {
                throw new Error(data.error || 'Invalid response from Google Sheet script');
            }
        } catch (err) {
            console.error('Google Sheet fetch error:', err);
            setSyncStatus({ 
                state: 'error', 
                message: `Failed to fetch: ${err.message}. Please check Web App URL & permissions.`, 
                time: new Date() 
            });
            return { success: false, error: err.message };
        } finally {
            setIsSyncing(false);
        }
    }, [sheetUrl]);

    // Push all current local articles to the Google Sheet (Populate Sheet in 1-Click)
    const pushAllToSheet = useCallback(async (targetUrl = sheetUrl) => {
        const urlToUse = targetUrl || sheetUrl;
        if (!urlToUse) {
            return { success: false, message: 'Google Sheet Web App URL is not configured.' };
        }

        setIsSyncing(true);
        setSyncStatus({ state: 'syncing', message: 'Pushing articles to Google Sheet...', time: new Date() });

        try {
            await fetch(urlToUse, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'syncAll',
                    articles: posts
                })
            });

            setSyncStatus({ 
                state: 'success', 
                message: `Pushed ${posts.length} articles to Google Sheet successfully!`, 
                time: new Date() 
            });
            return { success: true, count: posts.length };
        } catch (err) {
            console.error('Push to Google Sheet error:', err);
            setSyncStatus({ 
                state: 'error', 
                message: `Push failed: ${err.message}`, 
                time: new Date() 
            });
            return { success: false, error: err.message };
        } finally {
            setIsSyncing(false);
        }
    }, [sheetUrl, posts]);

    // Helper to send individual post update to Google Sheet
    const sendPostToSheet = useCallback(async (action, payload) => {
        if (!sheetUrl) return;
        try {
            await fetch(sheetUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, ...payload })
            });
        } catch (e) {
            console.warn('Background sync to Google Sheet warning:', e);
        }
    }, [sheetUrl]);

    // Auto-fetch on mount if sheet URL exists
    useEffect(() => {
        if (sheetUrl) {
            fetchFromSheet(sheetUrl);
        }
    }, [sheetUrl]);

    // Create a new post
    const createPost = (postData) => {
        const newId = posts.length > 0 ? Math.max(...posts.map(p => Number(p.id) || 0)) + 1 : 1;
        const now = new Date().toISOString().split('T')[0];
        
        const newPost = {
            id: newId,
            title: postData.title.trim(),
            slug: postData.slug?.trim() || generateSlug(postData.title),
            author: postData.author?.trim() || 'BeeFund Financial Editorial Team',
            date: postData.date || now,
            updatedAt: now,
            category: postData.category || 'Financial Planning',
            excerpt: postData.excerpt?.trim() || '',
            content: postData.content || '',
            status: postData.status || 'published'
        };

        setPosts(prev => [newPost, ...prev]);

        // Sync to Google Sheet
        sendPostToSheet('save', { article: newPost });

        return newPost;
    };

    // Update an existing post
    const updatePost = (id, postData) => {
        const now = new Date().toISOString().split('T')[0];
        let updatedItem = null;

        setPosts(prev => prev.map(p => {
            if (p.id === id) {
                updatedItem = {
                    ...p,
                    ...postData,
                    slug: postData.slug?.trim() || p.slug,
                    updatedAt: now
                };
                return updatedItem;
            }
            return p;
        }));

        // Sync to Google Sheet
        if (updatedItem) {
            sendPostToSheet('save', { article: updatedItem });
        }
    };

    // Delete a post
    const deletePost = (id) => {
        setPosts(prev => prev.filter(p => p.id !== id));
        // Sync to Google Sheet
        sendPostToSheet('delete', { id });
    };

    // Toggle post status between published and draft
    const togglePublish = (id) => {
        let updatedItem = null;
        setPosts(prev => prev.map(p => {
            if (p.id === id) {
                updatedItem = {
                    ...p,
                    status: p.status === 'published' ? 'draft' : 'published',
                    updatedAt: new Date().toISOString().split('T')[0]
                };
                return updatedItem;
            }
            return p;
        }));

        if (updatedItem) {
            sendPostToSheet('save', { article: updatedItem });
        }
    };

    // Reset back to initial default blog posts
    const resetToDefaults = () => {
        const resetData = initialBlogPosts.map(p => ({
            ...p,
            status: 'published',
            category: p.category || 'Financial Planning',
            updatedAt: p.date
        }));
        setPosts(resetData);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
        } catch (e) {
            console.error(e);
        }
    };

    // Export current posts as JSON file download
    const exportJson = () => {
        const cleanData = posts.map(({ id, title, slug, author, date, category, excerpt, content, status }) => ({
            id,
            title,
            slug,
            author,
            date,
            category: category || 'Financial Planning',
            excerpt,
            content,
            status: status || 'published'
        }));
        const blob = new Blob([JSON.stringify(cleanData, null, 4)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blogPosts-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Import JSON string/file data
    const importJson = (jsonString) => {
        try {
            const data = JSON.parse(jsonString);
            if (!Array.isArray(data)) {
                throw new Error('Invalid format: expected an array of blog posts');
            }
            setPosts(data);
            return { success: true, count: data.length };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    return (
        <BlogContext.Provider value={{
            posts,
            publishedPosts,
            getPostBySlug,
            createPost,
            updatePost,
            deletePost,
            togglePublish,
            resetToDefaults,
            exportJson,
            importJson,
            generateSlug,
            // Google Sheet sync props
            sheetUrl,
            setSheetUrl,
            isSyncing,
            syncStatus,
            fetchFromSheet,
            pushAllToSheet
        }}>
            {children}
        </BlogContext.Provider>
    );
};

export const useBlogs = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error('useBlogs must be used within a BlogProvider');
    }
    return context;
};

