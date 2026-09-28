import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlogs } from '../../context/BlogContext';
import { useTheme } from '../../context/ThemeContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import './ArticleEditorPage.css';

const DEFAULT_CATEGORIES = [
    'Financial Planning',
    'Loans & Credit',
    'Credit Cards',
    'Business & MSME',
    'Banking & Regulations',
    'Investment & Wealth',
    'Taxation & Legal',
    'Personal Finance'
];

const ArticleEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { posts, createPost, updatePost, deletePost } = useBlogs();
    const { isDark, toggleTheme } = useTheme();
    const { isAuthenticated, openLoginModal } = useAdminAuth();

    // Editor modes: 'canvas' (focus writing) | 'split' (writing + live preview) | 'preview' (full live view)
    const [viewMode, setViewMode] = useState('split');
    // Settings Drawer
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    // Image Insertion Modal
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imgUrl, setImgUrl] = useState('');
    const [imgCaption, setImgCaption] = useState('');
    const [imgAlt, setImgAlt] = useState('');
    // Link Insertion Modal
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    // Notification banner
    const [toastMessage, setToastMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSavedTime, setLastSavedTime] = useState(null);

    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const featuredImageInputRef = useRef(null);

    // Form data state
    const [formData, setFormData] = useState({
        id: null,
        title: '',
        slug: '',
        author: 'BeeFund Financial Editorial Team',
        date: new Date().toISOString().split('T')[0],
        category: 'Financial Planning',
        excerpt: '',
        content: '',
        featuredImage: '',
        status: 'published'
    });

    // Check if editing existing post
    useEffect(() => {
        if (id) {
            const numericId = Number(id);
            const found = posts.find(p => p.id === numericId || p.id === id);
            if (found) {
                setFormData({
                    id: found.id,
                    title: found.title || '',
                    slug: found.slug || '',
                    author: found.author || 'BeeFund Financial Editorial Team',
                    date: found.date || new Date().toISOString().split('T')[0],
                    category: found.category || 'Financial Planning',
                    excerpt: found.excerpt || '',
                    content: found.content || '',
                    featuredImage: found.featuredImage || '',
                    status: found.status || 'published'
                });
                return;
            }
        }
        
        // If new post, check local auto-draft
        try {
            const draftKey = `beefund_editor_draft_${id || 'new'}`;
            const savedDraft = localStorage.getItem(draftKey);
            if (savedDraft) {
                const parsed = JSON.parse(savedDraft);
                if (parsed && parsed.title) {
                    setFormData(prev => ({ ...prev, ...parsed }));
                }
            }
        } catch (e) {
            console.warn('Error reading local draft:', e);
        }
    }, [id, posts]);

    // Local Auto-save every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (formData.title.trim() || formData.content.trim()) {
                try {
                    const draftKey = `beefund_editor_draft_${formData.id || 'new'}`;
                    localStorage.setItem(draftKey, JSON.stringify(formData));
                    setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                } catch (e) {
                    console.warn('Auto-save error:', e);
                }
            }
        }, 8000);
        return () => clearInterval(interval);
    }, [formData]);

    const showToast = (msg, type = 'success') => {
        setToastMessage({ text: msg, type });
        setTimeout(() => setToastMessage(null), 4000);
    };

    // Calculate word count & reading time
    const stats = useMemo(() => {
        const text = (formData.content || '').replace(/<[^>]*>/g, ' ').trim();
        const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
        const chars = text.length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        return { words, chars, minutes };
    }, [formData.content]);

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const val = e.target.value;
        const autoSlug = val
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        setFormData(prev => ({
            ...prev,
            title: val,
            slug: prev.id ? prev.slug : autoSlug
        }));
    };

    // Text formatting helpers using selection manipulation in textarea
    const insertFormat = (prefix, suffix = '', defaultText = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const originalText = formData.content;
        const selectedText = originalText.substring(start, end) || defaultText;

        const newContent = originalText.substring(0, start) + prefix + selectedText + suffix + originalText.substring(end);
        setFormData(prev => ({ ...prev, content: newContent }));

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
        }, 50);
    };

    // Rich Insert Blocks
    const insertBlock = (blockHtml) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const originalText = formData.content;

        const separator = (start > 0 && !originalText[start - 1].endsWith('\n')) ? '\n\n' : '';
        const newContent = originalText.substring(0, start) + separator + blockHtml + '\n\n' + originalText.substring(end);

        setFormData(prev => ({ ...prev, content: newContent }));

        setTimeout(() => {
            textarea.focus();
            const newCursor = start + separator.length + blockHtml.length;
            textarea.setSelectionRange(newCursor, newCursor);
        }, 50);
    };

    // File upload handler (convert to base64)
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Image size exceeds 2MB. Please upload an image smaller than 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result;
            insertBlock(`<figure class="blog-figure">\n  <img src="${base64}" alt="${file.name.replace(/\.[^/.]+$/, '')}" class="blog-in-content-img" />\n  <figcaption>${file.name.replace(/\.[^/.]+$/, '')}</figcaption>\n</figure>`);
            showToast('Image inserted into article!');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    // Featured image upload handler
    const handleFeaturedImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Featured image exceeds 2MB limit.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setFormData(prev => ({ ...prev, featuredImage: event.target?.result }));
            showToast('Featured image uploaded!');
        };
        reader.readAsDataURL(file);
    };

    // Save or Publish Article
    const handleSave = (targetStatus = null) => {
        if (!formData.title.trim()) {
            showToast('Please enter an article headline title.', 'error');
            return;
        }

        const statusToUse = targetStatus || formData.status;
        const postPayload = {
            ...formData,
            status: statusToUse,
            updatedAt: new Date().toISOString().split('T')[0]
        };

        setIsSaving(true);

        try {
            if (formData.id) {
                updatePost(formData.id, postPayload);
                showToast(`Article "${formData.title}" updated successfully!`);
            } else {
                const created = createPost(postPayload);
                setFormData(prev => ({ ...prev, id: created.id }));
                showToast(`New article "${created.title}" published!`);
                // Clear draft
                try {
                    localStorage.removeItem('beefund_editor_draft_new');
                } catch { /* ignore */ }
                // Update URL to edit route without reloading
                window.history.replaceState(null, '', `/admin-studio/editor/${created.id}`);
            }
            setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch (err) {
            console.error('Error saving article:', err);
            showToast('Failed to save article. Check console.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Handle Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+K, Tab)
    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b' || e.key === 'B') {
                e.preventDefault();
                insertFormat('<strong>', '</strong>', 'bold text');
            } else if (e.key === 'i' || e.key === 'I') {
                e.preventDefault();
                insertFormat('<em>', '</em>', 'italic text');
            } else if (e.key === 'k' || e.key === 'K') {
                e.preventDefault();
                setIsLinkModalOpen(true);
            } else if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                handleSave();
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            insertFormat('  ');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="editorial-suite-container" data-theme={isDark ? 'dark' : 'light'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1.25rem', textAlign: 'center', padding: '2rem' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Admin Authentication Required</h2>
                <p style={{ color: 'var(--suite-text-muted)', maxWidth: '440px', margin: 0, lineHeight: 1.5 }}>
                    You must be logged in as an administrator to create or edit articles in the BeeFund Editorial Suite.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="button" className="btn-suite-primary" onClick={openLoginModal}>
                        Enter Passkey
                    </button>
                    <button type="button" className="btn-suite-secondary" onClick={() => navigate('/')}>
                        Return to Homepage
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="editorial-suite-container" data-theme={isDark ? 'dark' : 'light'}>
            {/* TOAST BANNER */}
            {toastMessage && (
                <div className={`suite-toast ${toastMessage.type}`}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        {toastMessage.type === 'error' ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        )}
                        <span>{toastMessage.text}</span>
                    </span>
                    <button type="button" onClick={() => setToastMessage(null)}>&times;</button>
                </div>
            )}

            {/* SUITE TOP NAVIGATION BAR */}
            <header className="suite-topbar">
                <div className="topbar-left">
                    <button 
                        type="button" 
                        className="back-btn" 
                        onClick={() => {
                            if (window.opener && !window.opener.closed) {
                                window.close();
                            } else {
                                navigate('/admin-studio');
                            }
                        }}
                        title="Back to Admin Studio"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Studio</span>
                    </button>

                    <div className="topbar-divider"></div>

                    <div className="doc-meta-badge">
                        <span className={`status-dot ${formData.status === 'published' ? 'dot-published' : 'dot-draft'}`}></span>
                        <span className="doc-status-text">{formData.status === 'published' ? 'Published' : 'Draft'}</span>
                        {lastSavedTime && (
                            <span className="doc-saved-time">Saved {lastSavedTime}</span>
                        )}
                    </div>
                </div>

                {/* Center: Live Stats */}
                <div className="topbar-center">
                    <div className="stats-pill">
                        <span><strong>{stats.words.toLocaleString()}</strong> words</span>
                        <span className="stats-dot">•</span>
                        <span><strong>{stats.minutes}</strong> min read</span>
                        <span className="stats-dot">•</span>
                        <span><strong>{stats.chars.toLocaleString()}</strong> chars</span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="topbar-right">
                    {/* View Mode Toggle */}
                    <div className="view-mode-group">
                        <button
                            type="button"
                            className={`view-mode-btn ${viewMode === 'canvas' ? 'active' : ''}`}
                            onClick={() => setViewMode('canvas')}
                            title="Distraction-Free Writing Canvas"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                            </svg>
                            <span>Canvas</span>
                        </button>
                        <button
                            type="button"
                            className={`view-mode-btn ${viewMode === 'split' ? 'active' : ''}`}
                            onClick={() => setViewMode('split')}
                            title="Split Editor & Live Article Preview"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="12" y1="3" x2="12" y2="21"></line>
                            </svg>
                            <span>Split</span>
                        </button>
                        <button
                            type="button"
                            className={`view-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
                            onClick={() => setViewMode('preview')}
                            title="Full Screen Live Reader Preview"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>Preview</span>
                        </button>
                    </div>

                    {/* Dark/Light Mode Switcher */}
                    <button
                        type="button"
                        className="suite-icon-btn"
                        onClick={toggleTheme}
                        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                    >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            {isDark ? (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                            )}
                            <span>{isDark ? 'Light' : 'Dark'}</span>
                        </span>
                    </button>

                    {/* SEO & Settings Drawer Toggle */}
                    <button
                        type="button"
                        className={`suite-icon-btn ${isSettingsOpen ? 'active' : ''}`}
                        onClick={() => setIsSettingsOpen(prev => !prev)}
                        title="SEO, Slug, Image & Post Settings"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <span>SEO & Info</span>
                    </button>

                    {/* Save Draft */}
                    <button
                        type="button"
                        className="btn-suite-secondary"
                        onClick={() => handleSave('draft')}
                        disabled={isSaving}
                    >
                        Save Draft
                    </button>

                    {/* Publish */}
                    <button
                        type="button"
                        className="btn-suite-primary"
                        onClick={() => handleSave('published')}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : formData.status === 'published' ? 'Update Article' : 'Publish'}
                    </button>
                </div>
            </header>

            {/* STICKY EDITORIAL FORMATTING RIBBON */}
            <div className="editorial-ribbon">
                <div className="ribbon-inner">
                    {/* Headings */}
                    <div className="ribbon-cluster">
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Heading 2 (Main Section)"
                            onClick={() => insertFormat('<h2>', '</h2>', 'Section Heading')}
                        >
                            <strong>H2</strong>
                        </button>
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Heading 3 (Subsection)"
                            onClick={() => insertFormat('<h3>', '</h3>', 'Subsection Heading')}
                        >
                            <strong>H3</strong>
                        </button>
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Paragraph Lead"
                            onClick={() => insertFormat('<p>', '</p>', 'Paragraph text')}
                        >
                            ¶
                        </button>
                    </div>

                    <div className="ribbon-sep"></div>

                    {/* Inline Text Formatting */}
                    <div className="ribbon-cluster">
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Bold (Ctrl+B)"
                            onClick={() => insertFormat('<strong>', '</strong>', 'bold text')}
                        >
                            <strong>B</strong>
                        </button>
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Italic (Ctrl+I)"
                            onClick={() => insertFormat('<em>', '</em>', 'italic text')}
                        >
                            <em>I</em>
                        </button>
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Strikethrough"
                            onClick={() => insertFormat('<del>', '</del>', 'struck text')}
                        >
                            <s>S</s>
                        </button>
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Inline Code"
                            onClick={() => insertFormat('<code>', '</code>', 'code')}
                        >
                            &lt;/&gt;
                        </button>
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Insert Link (Ctrl+K)"
                            onClick={() => setIsLinkModalOpen(true)}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                        </button>
                    </div>

                    <div className="ribbon-sep"></div>

                    {/* Lists & Quotes */}
                    <div className="ribbon-cluster">
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Bullet List"
                            onClick={() => insertBlock('<ul>\n  <li>Key takeaway point one</li>\n  <li>Key takeaway point two</li>\n  <li>Key takeaway point three</li>\n</ul>')}
                        >
                            • List
                        </button>
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Numbered Steps List"
                            onClick={() => insertBlock('<ol>\n  <li>Step 1: Check your credit eligibility</li>\n  <li>Step 2: Compare interest rates and processing fees</li>\n  <li>Step 3: Submit digital documentation</li>\n</ol>')}
                        >
                            1. List
                        </button>
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Blockquote / Pull Quote"
                            onClick={() => insertBlock('<blockquote>\n  "Financial discipline and early compounding are the two greatest drivers of long-term wealth creation in India."\n</blockquote>')}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path></svg>
                                <span>Quote</span>
                            </span>
                        </button>
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Horizontal Divider"
                            onClick={() => insertBlock('<hr />')}
                        >
                            — Divider
                        </button>
                    </div>

                    <div className="ribbon-sep"></div>

                    {/* Newsroom Rich Elements */}
                    <div className="ribbon-cluster">
                        {/* Callout Box */}
                        <div className="ribbon-dropdown-wrapper">
                            <button
                                type="button"
                                className="ribbon-btn ribbon-btn-dropdown"
                                title="Insert Informational Callout Box"
                                onClick={() => {
                                    insertBlock('<div class="editorial-callout tip">\n  <div class="callout-title">Pro Tip</div>\n  <p>Maintaining a credit utilization ratio below 30% boosts your credit score significantly faster than simply paying the minimum amount due.</p>\n</div>');
                                }}
                            >
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    <span>Callout Box</span>
                                </span>
                            </button>
                        </div>

                        {/* Financial Comparison Table */}
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Insert Financial Comparison Table"
                            onClick={() => {
                                insertBlock('<table class="table table-bordered">\n  <thead>\n    <tr>\n      <th>Feature / Parameter</th>\n      <th>Option A (e.g. Secured)</th>\n      <th>Option B (e.g. Unsecured)</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td><strong>Interest Rate</strong></td>\n      <td>8.5% – 10.5% p.a.</td>\n      <td>12.5% – 18.0% p.a.</td>\n    </tr>\n    <tr>\n      <td><strong>Collateral</strong></td>\n      <td>Property or Fixed Deposit</td>\n      <td>None Required</td>\n    </tr>\n    <tr>\n      <td><strong>Sanction Speed</strong></td>\n      <td>7 to 10 Working Days</td>\n      <td>24 to 48 Hours</td>\n    </tr>\n  </tbody>\n</table>');
                            }}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>
                                <span>Table</span>
                            </span>
                        </button>

                        {/* Image Upload / URL */}
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Insert Image (Upload or URL)"
                            onClick={() => setIsImageModalOpen(true)}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                <span>Image</span>
                            </span>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFileUpload}
                        />

                        {/* Key Takeaways Box */}
                        <button
                            type="button"
                            className="ribbon-btn"
                            title="Insert Key Takeaways Box"
                            onClick={() => {
                                insertBlock('<div class="key-takeaways-box">\n  <h4>Key Takeaways</h4>\n  <ul>\n    <li>Verify all hidden charges including processing fees and foreclosure penalties.</li>\n    <li>Keep your Debt-to-Income (DTI) ratio under 40% for the best interest concessions.</li>\n    <li>Audit your CIBIL TransUnion report every quarter for reporting discrepancies.</li>\n  </ul>\n</div>');
                            }}
                        >
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                <span>Takeaways</span>
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN SUITE WORKSPACE */}
            <main className={`suite-workspace layout-${viewMode}`}>
                {/* 1. LEFT CANVAS (WRITING DESK) */}
                {(viewMode === 'canvas' || viewMode === 'split') && (
                    <section className="suite-canvas-panel">
                        <div className="canvas-scroller">
                            <div className="canvas-sheet">
                                {/* Article Headline Title */}
                                <div className="headline-wrapper">
                                    <textarea
                                        rows="2"
                                        className="headline-textarea"
                                        placeholder="Article Headline Title..."
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                    />
                                </div>

                                {/* Article Subhead / Excerpt */}
                                <div className="subhead-wrapper">
                                    <input
                                        type="text"
                                        className="subhead-input"
                                        placeholder="Add a compelling subtitle or 1-2 sentence teaser summary..."
                                        value={formData.excerpt}
                                        onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                    />
                                </div>

                                {/* Metadata Pill Bar */}
                                <div className="canvas-meta-bar">
                                    <span className="meta-pill category-pill">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                                        <span>{formData.category}</span>
                                    </span>
                                    <span className="meta-pill author-pill">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        <span>{formData.author}</span>
                                    </span>
                                    <span className="meta-pill date-pill">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        <span>{formData.date}</span>
                                    </span>
                                    <span className="meta-pill slug-pill">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                        <code>/blog/{formData.slug || 'slug'}</code>
                                    </span>
                                </div>

                                {/* Content Writing Area */}
                                <div className="content-editor-wrapper">
                                    <textarea
                                        ref={textareaRef}
                                        className="editorial-content-textarea"
                                        placeholder="Write your article story here... You can use standard HTML tags or the toolbar above for headings, bullet points, financial comparison tables, callouts, and images."
                                        value={formData.content}
                                        onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                        onKeyDown={handleKeyDown}
                                        spellCheck="true"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* 2. RIGHT PANEL (LIVE ARTICLE PREVIEW) */}
                {(viewMode === 'split' || viewMode === 'preview') && (
                    <section className="suite-preview-panel">
                        <div className="preview-scroller">
                            <article className="preview-article-body">
                                {/* Category Badge */}
                                <div className="preview-category-badge">{formData.category}</div>

                                {/* Title */}
                                <h1 className="preview-headline">
                                    {formData.title || <span className="placeholder-text">Headline Title Preview</span>}
                                </h1>

                                {/* Subtitle */}
                                {formData.excerpt && (
                                    <p className="preview-subhead">{formData.excerpt}</p>
                                )}

                                {/* Bylines */}
                                <div className="preview-byline">
                                    <div className="byline-avatar">BF</div>
                                    <div className="byline-meta">
                                        <div className="byline-author">{formData.author}</div>
                                        <div className="byline-sub">
                                            <span>{formData.date}</span>
                                            <span>•</span>
                                            <span>{stats.minutes} min read</span>
                                            <span>•</span>
                                            <span>BeeFund Financial Editorial</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Featured Image Preview */}
                                {formData.featuredImage && (
                                    <div className="preview-featured-image-container">
                                        <img src={formData.featuredImage} alt={formData.title} />
                                    </div>
                                )}

                                {/* Article Body HTML Rendering */}
                                <div 
                                    className="preview-prose-content"
                                    dangerouslySetInnerHTML={{ 
                                        __html: formData.content || '<p class="preview-empty-notice">Start typing or use the formatting ribbon to craft your story. Live preview will render here with BeeFund typography, tables, and callouts.</p>' 
                                    }}
                                />

                                {/* Footer Disclaimer */}
                                <div className="preview-article-footer">
                                    <p><em>Disclaimer: Content published on BeeFund is intended for general informational & financial literacy purposes and does not constitute formal tax or investment advice.</em></p>
                                </div>
                            </article>
                        </div>
                    </section>
                )}

                {/* 3. SLIDE-IN EDITORIAL & SEO SETTINGS DRAWER */}
                {isSettingsOpen && (
                    <aside className="suite-settings-drawer">
                        <div className="drawer-header">
                            <div className="drawer-title">
                                <h3>Editorial & SEO Settings</h3>
                                <p>Manage URL slug, search snippet & metadata</p>
                            </div>
                            <button
                                type="button"
                                className="drawer-close-btn"
                                onClick={() => setIsSettingsOpen(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="drawer-body">
                            {/* Status */}
                            <div className="drawer-form-group">
                                <label>Publication Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                    className="drawer-select"
                                >
                                    <option value="published">Published (Live to public)</option>
                                    <option value="draft">Draft (Hidden from readers)</option>
                                </select>
                            </div>

                            {/* Category */}
                            <div className="drawer-form-group">
                                <label>Article Category</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="drawer-select"
                                >
                                    {DEFAULT_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Custom URL Slug */}
                            <div className="drawer-form-group">
                                <label>Permanent URL Slug</label>
                                <div className="slug-input-wrapper">
                                    <span className="slug-prefix">/blog/</span>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        className="drawer-input slug-input"
                                        placeholder="url-slug"
                                    />
                                </div>
                                <span className="drawer-hint">Auto-generated from title. Keep clean and hyphenated for Google rankings.</span>
                            </div>

                            {/* Author */}
                            <div className="drawer-form-group">
                                <label>Author Bylines</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                    className="drawer-input"
                                />
                            </div>

                            {/* Publication Date */}
                            <div className="drawer-form-group">
                                <label>Publication Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                    className="drawer-input"
                                />
                            </div>

                            {/* Featured Image */}
                            <div className="drawer-form-group">
                                <label>Featured Hero Image</label>
                                <div className="featured-img-input-row">
                                    <input
                                        type="text"
                                        placeholder="https://... or upload below"
                                        value={formData.featuredImage}
                                        onChange={e => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                                        className="drawer-input"
                                    />
                                    <button
                                        type="button"
                                        className="drawer-upload-btn"
                                        onClick={() => featuredImageInputRef.current?.click()}
                                    >
                                        Upload
                                    </button>
                                    <input
                                        type="file"
                                        ref={featuredImageInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleFeaturedImageUpload}
                                    />
                                </div>
                                {formData.featuredImage && (
                                    <div className="featured-img-preview-box">
                                        <img src={formData.featuredImage} alt="Featured" />
                                        <button
                                            type="button"
                                            className="remove-img-btn"
                                            onClick={() => setFormData(prev => ({ ...prev, featuredImage: '' }))}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Google SERP Search Snippet Preview */}
                            <div className="drawer-form-group">
                                <label>Google SERP Snippet Preview</label>
                                <div className="google-serp-card">
                                    <div className="serp-site-meta">
                                        <span className="serp-favicon" style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.75rem' }}>BF</span>
                                        <span className="serp-domain">beefund.in &gt; blog &gt; {formData.slug || 'article'}</span>
                                    </div>
                                    <div className="serp-title">{formData.title || 'Article Headline | BeeFund Advisory'}</div>
                                    <div className="serp-desc">
                                        {formData.excerpt || 'Read the comprehensive financial analysis, eligibility guidelines, and expert loan calculators by BeeFund...'}
                                    </div>
                                </div>
                            </div>

                            {/* Danger Zone: Delete */}
                            {formData.id && (
                                <div className="drawer-danger-zone">
                                    <h4>Danger Zone</h4>
                                    <p>Permanently remove this article from the blog index.</p>
                                    <button
                                        type="button"
                                        className="drawer-delete-btn"
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to permanently delete "${formData.title}"?`)) {
                                                deletePost(formData.id);
                                                showToast('Article deleted.');
                                                setTimeout(() => navigate('/admin-studio'), 1000);
                                            }
                                        }}
                                    >
                                        Delete Article
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>
                )}
            </main>

            {/* MODAL: INSERT IMAGE */}
            {isImageModalOpen && (
                <div className="suite-modal-overlay" onClick={() => setIsImageModalOpen(false)}>
                    <div className="suite-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                <h3 style={{ margin: 0 }}>Insert Image</h3>
                            </div>
                            <button type="button" className="modal-close-btn" onClick={() => setIsImageModalOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="drawer-form-group">
                                <label>Image URL:</label>
                                <input
                                    type="url"
                                    className="drawer-input"
                                    placeholder="https://images.unsplash.com/..."
                                    value={imgUrl}
                                    onChange={e => setImgUrl(e.target.value)}
                                />
                            </div>
                            <div className="drawer-form-group">
                                <label>Caption / Figure Title:</label>
                                <input
                                    type="text"
                                    className="drawer-input"
                                    placeholder="e.g. Figure 1: Working capital liquidity cycles"
                                    value={imgCaption}
                                    onChange={e => setImgCaption(e.target.value)}
                                />
                            </div>
                            <div className="drawer-form-group">
                                <label>Alt Text (for SEO & Accessibility):</label>
                                <input
                                    type="text"
                                    className="drawer-input"
                                    placeholder="Brief image description"
                                    value={imgAlt}
                                    onChange={e => setImgAlt(e.target.value)}
                                />
                            </div>
                            <div className="modal-or-divider"><span>OR UPLOAD LOCAL IMAGE</span></div>
                            <button
                                type="button"
                                className="btn-suite-secondary btn-block"
                                onClick={() => {
                                    fileInputRef.current?.click();
                                    setIsImageModalOpen(false);
                                }}
                            >
                                Choose Local Image File (Max 2MB)
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-suite-secondary" onClick={() => setIsImageModalOpen(false)}>Cancel</button>
                            <button
                                type="button"
                                className="btn-suite-primary"
                                disabled={!imgUrl.trim()}
                                onClick={() => {
                                    const captionHtml = imgCaption.trim() ? `\n  <figcaption>${imgCaption.trim()}</figcaption>` : '';
                                    insertBlock(`<figure class="blog-figure">\n  <img src="${imgUrl.trim()}" alt="${imgAlt.trim() || imgCaption.trim()}" class="blog-in-content-img" />${captionHtml}\n</figure>`);
                                    setIsImageModalOpen(false);
                                    setImgUrl('');
                                    setImgCaption('');
                                    setImgAlt('');
                                    showToast('Image inserted!');
                                }}
                            >
                                Insert Image
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: INSERT HYPERLINK */}
            {isLinkModalOpen && (
                <div className="suite-modal-overlay" onClick={() => setIsLinkModalOpen(false)}>
                    <div className="suite-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                                <h3 style={{ margin: 0 }}>Insert Hyperlink</h3>
                            </div>
                            <button type="button" className="modal-close-btn" onClick={() => setIsLinkModalOpen(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="drawer-form-group">
                                <label>Link URL:</label>
                                <input
                                    type="url"
                                    className="drawer-input"
                                    placeholder="https://example.com or /tools/emi-calculator"
                                    value={linkUrl}
                                    onChange={e => setLinkUrl(e.target.value)}
                                />
                            </div>
                            <div className="drawer-form-group">
                                <label>Anchor Text (Label):</label>
                                <input
                                    type="text"
                                    className="drawer-input"
                                    placeholder="e.g. Calculate your business loan EMI"
                                    value={linkText}
                                    onChange={e => setLinkText(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn-suite-secondary" onClick={() => setIsLinkModalOpen(false)}>Cancel</button>
                            <button
                                type="button"
                                className="btn-suite-primary"
                                disabled={!linkUrl.trim()}
                                onClick={() => {
                                    const label = linkText.trim() || linkUrl.trim();
                                    const isExternal = linkUrl.startsWith('http');
                                    const targetAttr = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
                                    insertBlock(`<a href="${linkUrl.trim()}"${targetAttr} class="blog-in-content-link">${label}</a>`);
                                    setIsLinkModalOpen(false);
                                    setLinkUrl('');
                                    setLinkText('');
                                    showToast('Link inserted!');
                                }}
                            >
                                Insert Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleEditorPage;
