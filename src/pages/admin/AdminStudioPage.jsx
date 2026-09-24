import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useBlogs } from '../../context/BlogContext';
import { useCards } from '../../context/CardsContext';
import DarkModeToggle from '../../components/DarkModeToggle';
import CardsStudioSection from '../../components/admin/CardsStudioSection';
import HexagonBackground from '../../components/HexagonBackground';
import './AdminStudioPage.css';

const DEFAULT_CATEGORIES = [
    'Financial Planning',
    'Working Capital & OD/CC',
    'MSME & Govt Schemes',
    'Credit Score & CIBIL',
    'Taxation & Compliance',
    'Secured Lending & LAP',
    'Personal Loans & Cards',
    'Trade Finance & Treasury'
];

const COLOR_PALETTE = [
    { label: 'Default', value: 'inherit', color: '#1e293b' },
    { label: 'BeeFund Gold', value: '#d97706', color: '#d97706' },
    { label: 'Navy Blue', value: '#1e40af', color: '#1e40af' },
    { label: 'Emerald Green', value: '#059669', color: '#059669' },
    { label: 'Crimson Red', value: '#dc2626', color: '#dc2626' },
    { label: 'Purple', value: '#7c3aed', color: '#7c3aed' },
    { label: 'Slate Gray', value: '#475569', color: '#475569' }
];

const HIGHLIGHT_PALETTE = [
    { label: 'None', value: 'transparent', color: '#ffffff' },
    { label: 'Yellow Marker', value: '#fef08a', color: '#fef08a' },
    { label: 'Green Marker', value: '#bbf7d0', color: '#bbf7d0' },
    { label: 'Cyan Marker', value: '#bae6fd', color: '#bae6fd' },
    { label: 'Orange Marker', value: '#fed7aa', color: '#fed7aa' },
    { label: 'Pink Marker', value: '#fbcfe8', color: '#fbcfe8' }
];

const AdminStudioPage = () => {
    const { isAuthenticated, logout } = useAdminAuth();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        if (e) e.preventDefault();
        logout();
        navigate('/', { replace: true });
        window.location.href = '/';
    };
    const { 
        posts, createPost, updatePost, deletePost, togglePublish, exportJson, resetToDefaults, generateSlug,
        sheetUrl, setSheetUrl, isSyncing, syncStatus, fetchFromSheet, pushAllToSheet 
    } = useBlogs();
    const { cards, pushCardsToSheet, fetchCardsFromSheet, exportCardsJson } = useCards();

    // Active Admin Section Tab: 'articles' or 'cards'
    const [activeTabSection, setActiveTabSection] = useState('articles');

    // Google Sheets Modal state
    const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
    const [inputSheetUrl, setInputSheetUrl] = useState('');
    const [sheetActionNotice, setSheetActionNotice] = useState('');

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, published, draft

    // Editor Modal state
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null); // null means new post
    const [activeEditorTab, setActiveEditorTab] = useState('edit'); // 'edit' | 'preview'
    const [editorViewMode, setEditorViewMode] = useState('word'); // 'word' (Word WYSIWYG) | 'code' (HTML source)

    // Form data state
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        author: 'BeeFund Financial Editorial Team',
        date: new Date().toISOString().split('T')[0],
        category: 'Financial Planning',
        excerpt: '',
        content: '',
        status: 'published'
    });

    const [formError, setFormError] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
    const [saveSuccessNotice, setSaveSuccessNotice] = useState('');

    // Dropdown toggles for color & highlight menus
    const [showColorMenu, setShowColorMenu] = useState(false);
    const [showHighlightMenu, setShowHighlightMenu] = useState(false);
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const [showTableMenu, setShowTableMenu] = useState(false);

    // Dialog for link / image
    const [promptDialog, setPromptDialog] = useState(null); // { type: 'link' | 'image', url: '', text: '' }

    // Ref for the contentEditable Word canvas
    const wordCanvasRef = useRef(null);

    // Sync contentEditable with formData.content on initial open or post load
    useEffect(() => {
        if (isEditorOpen && wordCanvasRef.current && editorViewMode === 'word') {
            if (wordCanvasRef.current.innerHTML !== formData.content) {
                wordCanvasRef.current.innerHTML = formData.content || '<p>Start typing your document here...</p>';
            }
        }
    }, [isEditorOpen, editingPostId, editorViewMode]);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = () => {
            setShowColorMenu(false);
            setShowHighlightMenu(false);
            setShowHeadingMenu(false);
            setShowTableMenu(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // If not authenticated, silently redirect to home
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // Filtered posts calculation
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = 
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (post.author && post.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()));
            
            const matchesStatus = 
                statusFilter === 'all' || 
                (statusFilter === 'published' && post.status !== 'draft') || 
                (statusFilter === 'draft' && post.status === 'draft');

            return matchesSearch && matchesStatus;
        });
    }, [posts, searchQuery, statusFilter]);

    // Metrics
    const totalCount = posts.length;
    const publishedCount = posts.filter(p => p.status !== 'draft').length;
    const draftCount = posts.filter(p => p.status === 'draft').length;

    // Open editor for creating
    const handleOpenNew = () => {
        setEditingPostId(null);
        const initialContent = '<h2>Introduction</h2><p>Provide an engaging overview of this financial topic, market interest rate shifts, and practical borrower takeaways.</p><h2>Key Insights & Comparative Analysis</h2><p>Highlight strategic considerations for businesses and individuals seeking capital in 2026.</p>';
        setFormData({
            title: '',
            slug: '',
            author: 'BeeFund Financial Editorial Team',
            date: new Date().toISOString().split('T')[0],
            category: 'Financial Planning',
            excerpt: '',
            content: initialContent,
            status: 'published'
        });
        setFormError('');
        setActiveEditorTab('edit');
        setEditorViewMode('word');
        setIsEditorOpen(true);
    };

    // Open editor for editing
    const handleOpenEdit = (post) => {
        setEditingPostId(post.id);
        setFormData({
            title: post.title,
            slug: post.slug,
            author: post.author || 'BeeFund Financial Editorial Team',
            date: post.date,
            category: post.category || 'Financial Planning',
            excerpt: post.excerpt || '',
            content: post.content || '',
            status: post.status || 'published'
        });
        setFormError('');
        setActiveEditorTab('edit');
        setEditorViewMode('word');
        setIsEditorOpen(true);
    };

    // Auto-update slug when title changes in new post mode
    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData(prev => ({
            ...prev,
            title,
            slug: !editingPostId ? generateSlug(title) : prev.slug
        }));
    };

    // Synchronize canvas HTML to state
    const syncCanvasContent = useCallback(() => {
        if (wordCanvasRef.current) {
            const html = wordCanvasRef.current.innerHTML;
            setFormData(prev => ({ ...prev, content: html }));
        }
    }, []);

    // Execute standard formatting commands (document.execCommand)
    const execWordCmd = (command, value = null) => {
        if (editorViewMode !== 'word') {
            setEditorViewMode('word');
            setTimeout(() => {
                wordCanvasRef.current?.focus();
                document.execCommand(command, false, value);
                syncCanvasContent();
            }, 50);
            return;
        }

        wordCanvasRef.current?.focus();
        document.execCommand(command, false, value);
        syncCanvasContent();
    };

    // Handle Keyboard Shortcuts on Document Canvas (Ctrl+B, Ctrl+I, Ctrl+U, etc.)
    const handleCanvasKeyDown = (e) => {
        const isCtrl = e.ctrlKey || e.metaKey;

        if (isCtrl) {
            const key = e.key.toLowerCase();
            if (key === 'b') {
                e.preventDefault();
                execWordCmd('bold');
            } else if (key === 'i') {
                e.preventDefault();
                execWordCmd('italic');
            } else if (key === 'u') {
                e.preventDefault();
                execWordCmd('underline');
            } else if (key === 'z') {
                if (e.shiftKey) {
                    e.preventDefault();
                    execWordCmd('redo');
                } else {
                    e.preventDefault();
                    execWordCmd('undo');
                }
            } else if (key === 'y') {
                e.preventDefault();
                execWordCmd('redo');
            }
        }
    };

    // Insert formatted HTML snippets into the document
    const insertHtmlBlock = (htmlString) => {
        wordCanvasRef.current?.focus();
        document.execCommand('insertHTML', false, htmlString);
        syncCanvasContent();
    };

    // Insert Pre-styled Financial Comparison Table
    const handleInsertTable = (type = 'financial') => {
        let tableHtml = '';
        if (type === 'financial') {
            tableHtml = `
                <table class="blog-table">
                    <thead>
                        <tr>
                            <th>Loan Facility</th>
                            <th>Indicative Rate (ROI)</th>
                            <th>Sanctioned Limit</th>
                            <th>Key Eligibility / Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Working Capital (OD/CC)</strong></td>
                            <td>9.75% – 14.50% p.a.</td>
                            <td>Turnover Linked (Up to ₹10 Cr)</td>
                            <td>Daily cash flow & inventory replenishment</td>
                        </tr>
                        <tr>
                            <td><strong>Loan Against Property (LAP)</strong></td>
                            <td>8.50% – 10.50% p.a.</td>
                            <td>Up to ₹10 Crore</td>
                            <td>Long-term Capex & lowest borrowing cost</td>
                        </tr>
                        <tr>
                            <td><strong>Unsecured Business Loan</strong></td>
                            <td>11.50% – 18.00% p.a.</td>
                            <td>Up to ₹50 Lakhs</td>
                            <td>Fast 48-hr funding with zero collateral</td>
                        </tr>
                    </tbody>
                </table>
                <p><br></p>
            `;
        } else {
            tableHtml = `
                <table class="blog-table">
                    <thead>
                        <tr>
                            <th>Column 1</th>
                            <th>Column 2</th>
                            <th>Column 3</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Row 1 Data</td>
                            <td>Description</td>
                            <td>Status / Value</td>
                        </tr>
                        <tr>
                            <td>Row 2 Data</td>
                            <td>Description</td>
                            <td>Status / Value</td>
                        </tr>
                    </tbody>
                </table>
                <p><br></p>
            `;
        }
        insertHtmlBlock(tableHtml);
    };

    // Insert Callout Box
    const handleInsertCallout = (style = 'tip') => {
        let calloutHtml = '';
        if (style === 'tip') {
            calloutHtml = `
                <div class="blog-callout blog-callout-tip">
                    <strong>💡 Financial Pro-Tip:</strong> Businesses that maintain their FOIR (Fixed Obligation to Income Ratio) under 45% consistently qualify for up to 1.5% interest rate concessions across leading partner banks.
                </div>
                <p><br></p>
            `;
        } else if (style === 'warning') {
            calloutHtml = `
                <div class="blog-callout blog-callout-warning">
                    <strong>⚠️ Important Regulatory Note:</strong> Always review the Sanction Letter APR (Annual Percentage Rate) including processing charges, doc charges, and stamp duty before executing final loan agreements.
                </div>
                <p><br></p>
            `;
        } else {
            calloutHtml = `
                <div class="blog-callout blog-callout-info">
                    <strong>ℹ️ Industry Fact:</strong> Over 68% of commercial bank loan applications in India utilize GST returns (GSTR-3B) and bank banking analytics for digital pre-qualification.
                </div>
                <p><br></p>
            `;
        }
        insertHtmlBlock(calloutHtml);
    };

    // Insert Custom Link / Image Prompt submission
    const handlePromptSubmit = (e) => {
        e.preventDefault();
        if (!promptDialog) return;

        if (promptDialog.type === 'link') {
            if (promptDialog.url) {
                const linkText = promptDialog.text || promptDialog.url;
                const linkHtml = `<a href="${promptDialog.url}" target="_blank" rel="noopener noreferrer" style="color: #d97706; font-weight: 700; text-decoration: underline;">${linkText}</a>`;
                insertHtmlBlock(linkHtml);
            }
        } else if (promptDialog.type === 'image') {
            if (promptDialog.url) {
                const imgHtml = `
                    <figure style="margin: 1.5rem 0; text-align: center;">
                        <img src="${promptDialog.url}" alt="${promptDialog.text || 'Article image'}" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
                        ${promptDialog.text ? `<figcaption style="font-size: 0.85rem; color: #64748b; margin-top: 0.5rem; font-style: italic;">${promptDialog.text}</figcaption>` : ''}
                    </figure>
                    <p><br></p>
                `;
                insertHtmlBlock(imgHtml);
            }
        }
        setPromptDialog(null);
    };

    // Save article handler
    const handleSaveArticle = (statusOverride) => {
        // If in word mode, ensure the latest canvas content is captured
        let finalContent = formData.content;
        if (editorViewMode === 'word' && wordCanvasRef.current) {
            finalContent = wordCanvasRef.current.innerHTML;
        }

        if (!formData.title.trim()) {
            setFormError('Article headline is mandatory.');
            return;
        }
        if (!finalContent.trim()) {
            setFormError('Document content cannot be empty.');
            return;
        }

        const finalStatus = statusOverride || formData.status || 'published';
        const finalSlug = formData.slug?.trim() || generateSlug(formData.title, editingPostId);

        const payload = {
            ...formData,
            content: finalContent,
            slug: finalSlug,
            status: finalStatus
        };

        if (editingPostId) {
            updatePost(editingPostId, payload);
            triggerNotification('Article updated successfully!');
        } else {
            createPost(payload);
            triggerNotification('New article published successfully!');
        }

        setIsEditorOpen(false);
    };

    const triggerNotification = (msg) => {
        setSaveSuccessNotice(msg);
        setTimeout(() => setSaveSuccessNotice(''), 3500);
    };

    // Word count & read time statistics
    const docStats = useMemo(() => {
        const text = formData.content.replace(/<[^>]*>/g, ' ');
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).length : 0;
        const chars = text.length;
        const minutes = Math.max(1, Math.ceil(words / 200));
        return { words, chars, minutes };
    }, [formData.content]);

    return (
        <div className="admin-studio-container">
            <HexagonBackground opacity={0.03} />

            {/* Top Navigation Bar */}
            <header className="admin-studio-header">
                <div className="studio-brand">
                    <img src="/logo.png" alt="BeeFund Logo" className="studio-logo" />
                    <div className="studio-brand-meta">
                        <span className="studio-title">BeeFund Studio</span>
                        <span className="studio-badge">Admin Gateway</span>
                    </div>
                </div>

                <div className="studio-header-actions">
                    <DarkModeToggle />

                    <button 
                        onClick={() => {
                            setInputSheetUrl(sheetUrl);
                            setSheetActionNotice('');
                            setIsSheetModalOpen(true);
                        }} 
                        className={`studio-btn ${sheetUrl ? 'studio-btn-success' : 'studio-btn-secondary'}`}
                        title="Connect & live sync articles and cards with Google Sheets"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                        <span>{sheetUrl ? 'G-Sheet (Live)' : 'Connect G-Sheet'}</span>
                        {isSyncing && <span className="studio-mini-spinner" />}
                    </button>

                    {activeTabSection === 'articles' ? (
                        <button onClick={exportJson} className="studio-btn studio-btn-secondary" title="Download blogPosts.json to save changes into repository">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Export Articles</span>
                        </button>
                    ) : (
                        <button onClick={exportCardsJson} className="studio-btn studio-btn-secondary" title="Download creditCards.json to save changes into repository">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>Export Cards</span>
                        </button>
                    )}

                    <Link to="/blog" target="_blank" rel="noopener noreferrer" className="studio-btn studio-btn-ghost">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Public Blog</span>
                    </Link>

                    <Link to="/credit-cards" target="_blank" rel="noopener noreferrer" className="studio-btn studio-btn-ghost">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Public Cards</span>
                    </Link>

                    <button onClick={handleLogout} className="studio-btn studio-btn-danger-outline" title="Log out and return to home page">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Log Out</span>
                    </button>
                </div>
            </header>

            {/* Primary Workspace Navigation Switcher */}
            <div className="studio-workspace-tabs-strip">
                <button
                    type="button"
                    className={`workspace-tab-btn ${activeTabSection === 'articles' ? 'active' : ''}`}
                    onClick={() => setActiveTabSection('articles')}
                >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <span>Articles Desk</span>
                    <span className="workspace-tab-badge">{posts.length}</span>
                </button>

                <button
                    type="button"
                    className={`workspace-tab-btn ${activeTabSection === 'cards' ? 'active' : ''}`}
                    onClick={() => setActiveTabSection('cards')}
                >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="2" y1="10" x2="22" y2="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Credit Cards Manager</span>
                    <span className="workspace-tab-badge">{cards.length}</span>
                    <span className="workspace-tab-pill">Live Catalog</span>
                </button>
            </div>

            {saveSuccessNotice && (
                <div className="studio-toast-banner">
                    <span>✨ {saveSuccessNotice}</span>
                </div>
            )}

            {/* Dashboard Content */}
            <main className="studio-main-content">
                {activeTabSection === 'cards' ? (
                    <CardsStudioSection />
                ) : (
                    <>
                {/* Stats Bar */}
                <section className="studio-stats-grid">
                    <div className="studio-stat-card">
                        <div className="stat-icon-wrapper blue">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-num">{totalCount}</span>
                            <span className="stat-label">Total Articles</span>
                        </div>
                    </div>

                    <div className="studio-stat-card">
                        <div className="stat-icon-wrapper green">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-num">{publishedCount}</span>
                            <span className="stat-label">Live on Website</span>
                        </div>
                    </div>

                    <div className="studio-stat-card">
                        <div className="stat-icon-wrapper amber">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-num">{draftCount}</span>
                            <span className="stat-label">Unpublished Drafts</span>
                        </div>
                    </div>

                    <div className="studio-stat-card">
                        <div className="stat-icon-wrapper purple">
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="stat-details">
                            <span className="stat-tag-live">Active</span>
                            <span className="stat-label">Instant Local Storage Sync</span>
                        </div>
                    </div>
                </section>

                {/* Toolbar Section */}
                <div className="studio-action-toolbar">
                    <div className="toolbar-left">
                        <div className="studio-search-box">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search by title, author, or category..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button className="search-clear-btn" onClick={() => setSearchQuery('')}>&times;</button>
                            )}
                        </div>

                        <div className="studio-status-tabs">
                            <button
                                className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('all')}
                            >
                                All ({totalCount})
                            </button>
                            <button
                                className={`status-tab ${statusFilter === 'published' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('published')}
                            >
                                Published ({publishedCount})
                            </button>
                            <button
                                className={`status-tab ${statusFilter === 'draft' ? 'active' : ''}`}
                                onClick={() => setStatusFilter('draft')}
                            >
                                Drafts ({draftCount})
                            </button>
                        </div>
                    </div>

                    <div className="toolbar-right">
                        <button onClick={handleOpenNew} className="studio-btn studio-btn-primary">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <span>Write New Article</span>
                        </button>
                    </div>
                </div>

                {/* Articles List / Table */}
                <div className="studio-table-card">
                    {filteredPosts.length === 0 ? (
                        <div className="studio-empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>No articles found</h3>
                            <p>No matching blog posts based on your search or filter.</p>
                            <button onClick={handleOpenNew} className="studio-btn studio-btn-primary mt-3">
                                Create Your First Article
                            </button>
                        </div>
                    ) : (
                        <div className="studio-table-responsive">
                            <table className="studio-table">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Article Details</th>
                                        <th>Category</th>
                                        <th>Author</th>
                                        <th>Date</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPosts.map(post => {
                                        const isDraft = post.status === 'draft';
                                        return (
                                            <tr key={post.id} className={isDraft ? 'row-draft' : ''}>
                                                <td>
                                                    <button
                                                        onClick={() => togglePublish(post.id)}
                                                        className={`status-pill ${isDraft ? 'pill-draft' : 'pill-published'}`}
                                                        title="Click to toggle publish status"
                                                    >
                                                        <span className="status-dot"></span>
                                                        {isDraft ? 'Draft' : 'Published'}
                                                    </button>
                                                </td>
                                                <td className="col-article">
                                                    <div className="article-title">{post.title}</div>
                                                    <div className="article-slug">
                                                        <span>/blog/{post.slug}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="category-badge">{post.category || 'General'}</span>
                                                </td>
                                                <td className="text-secondary">{post.author}</td>
                                                <td className="text-secondary">{post.date}</td>
                                                <td className="col-actions">
                                                    <div className="actions-cluster">
                                                        <button
                                                            onClick={() => handleOpenEdit(post)}
                                                            className="action-icon-btn edit-btn"
                                                            title="Edit Article"
                                                        >
                                                            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>

                                                        <Link
                                                            to={`/blog/${post.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="action-icon-btn view-btn"
                                                            title="View Live Page"
                                                        >
                                                            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </Link>

                                                        <button
                                                            onClick={() => setDeleteConfirmId(post.id)}
                                                            className="action-icon-btn delete-btn"
                                                            title="Delete Article"
                                                        >
                                                            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer Controls & Reset */}
                <div className="studio-footer-note">
                    <div>
                        <strong>💡 How Changes Work:</strong> All created or edited articles are instantly saved and live on your site via browser local storage. When you are ready to persist them into source code, click <strong>"Export JSON"</strong> and replace <code>src/data/blogPosts.json</code> before committing.
                    </div>
                    <button
                        onClick={() => setResetConfirmOpen(true)}
                        className="studio-btn-tiny-link"
                    >
                        Reset to default initial blogs
                    </button>
                </div>
                </>
                )}
            </main>

            {/* ========================================================
               REAL DOCUMENT WORD ARTICLE COMPOSER MODAL
               ======================================================== */}
            {isEditorOpen && (
                <div className="editor-modal-overlay">
                    <div className="editor-modal-window word-studio-window">
                        {/* 1. Modal Top Bar */}
                        <div className="editor-header">
                            <div className="editor-header-left">
                                <span className="editor-mode-badge">{editingPostId ? 'Edit Article' : 'New Article'}</span>
                                <h2 className="editor-heading">{formData.title || 'Untitled Financial Document'}</h2>
                            </div>

                            <div className="editor-header-tabs">
                                <button
                                    type="button"
                                    className={`editor-tab-btn ${activeEditorTab === 'edit' ? 'active' : ''}`}
                                    onClick={() => setActiveEditorTab('edit')}
                                >
                                    📄 Document Editor
                                </button>
                                <button
                                    type="button"
                                    className={`editor-tab-btn ${activeEditorTab === 'preview' ? 'active' : ''}`}
                                    onClick={() => {
                                        syncCanvasContent();
                                        setActiveEditorTab('preview');
                                    }}
                                >
                                    👁️ Public Preview
                                </button>
                            </div>

                            <button className="editor-close-btn" onClick={() => setIsEditorOpen(false)} aria-label="Close Editor">
                                &times;
                            </button>
                        </div>

                        {/* Error Alert */}
                        {formError && (
                            <div className="editor-error-alert">
                                <span>⚠️ {formError}</span>
                            </div>
                        )}

                        {/* 2. Main Content Area */}
                        {activeEditorTab === 'edit' ? (
                            <div className="word-editor-layout">
                                {/* Article Metadata Panel (Headline, Slug, Author, Category) */}
                                <div className="word-meta-strip">
                                    <div className="meta-strip-row">
                                        <div className="meta-field-title">
                                            <input
                                                type="text"
                                                className="word-doc-title-input"
                                                placeholder="Enter Article Headline / Title..."
                                                value={formData.title}
                                                onChange={handleTitleChange}
                                            />
                                        </div>

                                        <div className="meta-field-item">
                                            <label>Category:</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                                className="meta-compact-select"
                                            >
                                                {DEFAULT_CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="meta-field-item">
                                            <label>Status:</label>
                                            <select
                                                value={formData.status}
                                                onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                                className="meta-compact-select"
                                            >
                                                <option value="published">🟢 Published</option>
                                                <option value="draft">🟡 Draft</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="meta-strip-subrow">
                                        <div className="meta-slug-indicator">
                                            <span>URL:</span>
                                            <code>beefund.in/blog/<strong>{formData.slug || 'url-slug'}</strong></code>
                                            <input
                                                type="text"
                                                placeholder="Custom slug..."
                                                value={formData.slug}
                                                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                                className="meta-slug-edit"
                                            />
                                        </div>

                                        <div className="meta-author-indicator">
                                            <span>Author:</span>
                                            <input
                                                type="text"
                                                value={formData.author}
                                                onChange={e => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                                className="meta-author-edit"
                                            />
                                            <span>Date:</span>
                                            <input
                                                type="date"
                                                value={formData.date}
                                                onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                                className="meta-date-edit"
                                            />
                                        </div>
                                    </div>

                                    {/* Brief Excerpt Bar */}
                                    <div className="meta-excerpt-row">
                                        <input
                                            type="text"
                                            className="meta-excerpt-input"
                                            placeholder="Summary Excerpt: Brief 1-2 sentence teaser shown on blog preview cards..."
                                            value={formData.excerpt}
                                            onChange={e => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                {/* 3. REAL MICROSOFT WORD FORMATTING RIBBON */}
                                <div className="word-ribbon-toolbar">
                                    {/* Group: History & Source Mode */}
                                    <div className="ribbon-group">
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('undo')}
                                            className="ribbon-btn"
                                            title="Undo (Ctrl+Z)"
                                        >
                                            ↩️
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('redo')}
                                            className="ribbon-btn"
                                            title="Redo (Ctrl+Y)"
                                        >
                                            ↪️
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (editorViewMode === 'word') {
                                                    syncCanvasContent();
                                                    setEditorViewMode('code');
                                                } else {
                                                    setEditorViewMode('word');
                                                }
                                            }}
                                            className={`ribbon-btn ${editorViewMode === 'code' ? 'active' : ''}`}
                                            title="Toggle HTML Source Code View"
                                        >
                                            &lt;/&gt; {editorViewMode === 'code' ? 'Word View' : 'HTML Code'}
                                        </button>
                                    </div>

                                    <div className="ribbon-sep" />

                                    {/* Group: Text Hierarchy */}
                                    <div className="ribbon-group relative-pos" onClick={e => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                                            className="ribbon-btn ribbon-dropdown-trigger"
                                            title="Styles & Headings"
                                        >
                                            <span>Paragraph Style ▾</span>
                                        </button>

                                        {showHeadingMenu && (
                                            <div className="ribbon-menu-dropdown">
                                                <button type="button" onClick={() => { execWordCmd('formatBlock', '<p>'); setShowHeadingMenu(false); }}>Normal Paragraph</button>
                                                <button type="button" onClick={() => { execWordCmd('formatBlock', '<h2>'); setShowHeadingMenu(false); }} style={{ fontSize: '1.2rem', fontWeight: 800 }}>Heading 2 (Section)</button>
                                                <button type="button" onClick={() => { execWordCmd('formatBlock', '<h3>'); setShowHeadingMenu(false); }} style={{ fontSize: '1.05rem', fontWeight: 700 }}>Heading 3 (Subsection)</button>
                                                <button type="button" onClick={() => { execWordCmd('formatBlock', '<h4>'); setShowHeadingMenu(false); }} style={{ fontSize: '0.95rem', fontWeight: 600 }}>Heading 4 (Minor)</button>
                                                <button type="button" onClick={() => { execWordCmd('formatBlock', '<blockquote>'); setShowHeadingMenu(false); }}>Blockquote Quote</button>
                                                <button type="button" onClick={() => { execWordCmd('formatBlock', '<pre>'); setShowHeadingMenu(false); }}>Code Block</button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ribbon-sep" />

                                    {/* Group: Basic Formatting (Bold, Italic, Underline, Strikethrough) */}
                                    <div className="ribbon-group">
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('bold')}
                                            className="ribbon-btn font-bold"
                                            title="Bold (Ctrl+B)"
                                        >
                                            B
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('italic')}
                                            className="ribbon-btn italic"
                                            title="Italic (Ctrl+I)"
                                        >
                                            I
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('underline')}
                                            className="ribbon-btn underline"
                                            title="Underline (Ctrl+U)"
                                        >
                                            U
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('strikeThrough')}
                                            className="ribbon-btn strike"
                                            title="Strikethrough"
                                        >
                                            S
                                        </button>
                                    </div>

                                    <div className="ribbon-sep" />

                                    {/* Group: Text Color & Highlight */}
                                    <div className="ribbon-group relative-pos" onClick={e => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            onClick={() => { setShowColorMenu(!showColorMenu); setShowHighlightMenu(false); }}
                                            className="ribbon-btn"
                                            title="Font Color"
                                        >
                                            <span style={{ borderBottom: '3px solid #d97706', paddingBottom: '1px' }}>A</span> ▾
                                        </button>

                                        {showColorMenu && (
                                            <div className="ribbon-menu-dropdown color-palette-menu">
                                                <div className="palette-label">Text Color</div>
                                                <div className="palette-swatches">
                                                    {COLOR_PALETTE.map(c => (
                                                        <button
                                                            key={c.label}
                                                            type="button"
                                                            className="color-swatch-btn"
                                                            style={{ backgroundColor: c.color }}
                                                            title={c.label}
                                                            onClick={() => {
                                                                execWordCmd('foreColor', c.value);
                                                                setShowColorMenu(false);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => { setShowHighlightMenu(!showHighlightMenu); setShowColorMenu(false); }}
                                            className="ribbon-btn"
                                            title="Highlight Color (Marker)"
                                        >
                                            🖍️ ▾
                                        </button>

                                        {showHighlightMenu && (
                                            <div className="ribbon-menu-dropdown color-palette-menu">
                                                <div className="palette-label">Highlight Color</div>
                                                <div className="palette-swatches">
                                                    {HIGHLIGHT_PALETTE.map(h => (
                                                        <button
                                                            key={h.label}
                                                            type="button"
                                                            className="color-swatch-btn"
                                                            style={{ backgroundColor: h.color, border: '1px solid #cbd5e1' }}
                                                            title={h.label}
                                                            onClick={() => {
                                                                execWordCmd('hiliteColor', h.value);
                                                                setShowHighlightMenu(false);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="ribbon-sep" />

                                    {/* Group: Text Alignments */}
                                    <div className="ribbon-group">
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('justifyLeft')}
                                            className="ribbon-btn"
                                            title="Align Left (Ctrl+L)"
                                        >
                                            ⇤
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('justifyCenter')}
                                            className="ribbon-btn"
                                            title="Align Center (Ctrl+E)"
                                        >
                                            ≡
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('justifyRight')}
                                            className="ribbon-btn"
                                            title="Align Right (Ctrl+R)"
                                        >
                                            ⇥
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('justifyFull')}
                                            className="ribbon-btn"
                                            title="Justify (Ctrl+J)"
                                        >
                                            ≣
                                        </button>
                                    </div>

                                    <div className="ribbon-sep" />

                                    {/* Group: Lists & Indents */}
                                    <div className="ribbon-group">
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('insertUnorderedList')}
                                            className="ribbon-btn"
                                            title="Bulleted List"
                                        >
                                            &bull;≡
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('insertOrderedList')}
                                            className="ribbon-btn"
                                            title="Numbered List"
                                        >
                                            1≡
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('outdent')}
                                            className="ribbon-btn"
                                            title="Decrease Indent"
                                        >
                                            &lt;&lt;
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('indent')}
                                            className="ribbon-btn"
                                            title="Increase Indent"
                                        >
                                            &gt;&gt;
                                        </button>
                                    </div>

                                    <div className="ribbon-sep" />

                                    {/* Group: Insert Objects (Table, Callout, Link, Image, Divider) */}
                                    <div className="ribbon-group relative-pos" onClick={e => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            onClick={() => setShowTableMenu(!showTableMenu)}
                                            className="ribbon-btn ribbon-btn-accent"
                                            title="Insert Table"
                                        >
                                            📊 Table ▾
                                        </button>

                                        {showTableMenu && (
                                            <div className="ribbon-menu-dropdown">
                                                <button type="button" onClick={() => { handleInsertTable('financial'); setShowTableMenu(false); }}>
                                                    <strong>Financial Rate Comparison Table (3x4)</strong>
                                                </button>
                                                <button type="button" onClick={() => { handleInsertTable('standard'); setShowTableMenu(false); }}>
                                                    Standard 3x3 Table
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => handleInsertCallout('tip')}
                                            className="ribbon-btn"
                                            title="Insert Tip Callout Box"
                                        >
                                            💡 Tip
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleInsertCallout('warning')}
                                            className="ribbon-btn"
                                            title="Insert Warning Callout Box"
                                        >
                                            ⚠️ Warning
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPromptDialog({ type: 'link', url: 'https://', text: '' })}
                                            className="ribbon-btn"
                                            title="Insert Link"
                                        >
                                            🔗 Link
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setPromptDialog({ type: 'image', url: 'https://', text: '' })}
                                            className="ribbon-btn"
                                            title="Insert Image URL"
                                        >
                                            🖼️ Image
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('insertHorizontalRule')}
                                            className="ribbon-btn"
                                            title="Insert Divider Line"
                                        >
                                            ➖ Line
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => execWordCmd('removeFormat')}
                                            className="ribbon-btn"
                                            title="Clear Formatting"
                                        >
                                            🧹
                                        </button>
                                    </div>
                                </div>

                                {/* 4. THE DOCUMENT DESK & WORD SHEET CANVAS */}
                                <div className="word-desk-surface">
                                    {editorViewMode === 'word' ? (
                                        <div className="word-paper-sheet">
                                            <div
                                                ref={wordCanvasRef}
                                                className="word-doc-content"
                                                contentEditable="true"
                                                onInput={syncCanvasContent}
                                                onKeyDown={handleCanvasKeyDown}
                                                spellCheck="true"
                                                suppressContentEditableWarning
                                            />
                                        </div>
                                    ) : (
                                        <div className="word-code-sheet">
                                            <div className="code-editor-header">
                                                <span>HTML Source Code (Direct Edit)</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditorViewMode('word')}
                                                    className="btn-tiny-code-toggle"
                                                >
                                                    Switch to Word Canvas
                                                </button>
                                            </div>
                                            <textarea
                                                className="word-html-textarea"
                                                value={formData.content}
                                                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                                rows="20"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* 5. WORD STATUS BAR (Page 1 | Words | Characters | Read Time) */}
                                <div className="word-status-bar">
                                    <div className="status-bar-left">
                                        <span className="status-pill-item">Page 1 of 1</span>
                                        <span className="status-pill-item">{docStats.words} words</span>
                                        <span className="status-pill-item">{docStats.chars} characters</span>
                                        <span className="status-pill-item">~{docStats.minutes} min read</span>
                                        <span className="status-pill-item">English (India)</span>
                                    </div>
                                    <div className="status-bar-right">
                                        <span className="shortcuts-hint">Shortcuts: <code>Ctrl+B</code> Bold &bull; <code>Ctrl+I</code> Italic &bull; <code>Ctrl+U</code> Underline &bull; <code>Ctrl+Z</code> Undo</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* 6. LIVE PUBLIC PREVIEW TAB (Exact Website Simulation) */
                            <div className="editor-preview-container">
                                <div className="preview-banner">
                                    <span>👁️ Viewing live simulation of how this article will appear to visitors on <strong>beefund.in/blog/{formData.slug || 'slug'}</strong></span>
                                </div>

                                <div className="preview-paper">
                                    <div className="preview-meta">
                                        <span className="preview-category">{formData.category}</span>
                                        <span>&bull;</span>
                                        <span>{new Date(formData.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        <span>&bull;</span>
                                        <span>By {formData.author}</span>
                                    </div>

                                    <h1 className="preview-title">{formData.title || 'Untitled Financial Article'}</h1>

                                    {formData.excerpt && (
                                        <p className="preview-lead">{formData.excerpt}</p>
                                    )}

                                    <hr className="preview-divider" />

                                    <div
                                        className="preview-content-body blog-post-content"
                                        dangerouslySetInnerHTML={{ __html: formData.content || '<p><em>No document content written yet...</em></p>' }}
                                    />

                                    <div className="preview-cta-card">
                                        <h3>Ready to Fuel Your Growth?</h3>
                                        <p>Apply for a working capital or business loan today and take your business to the next level.</p>
                                        <span className="preview-cta-btn">Apply Now — Free</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 7. Modal Bottom Action Bar */}
                        <div className="editor-footer">
                            <button
                                type="button"
                                className="studio-btn studio-btn-ghost"
                                onClick={() => setIsEditorOpen(false)}
                            >
                                Cancel
                            </button>

                            <div className="editor-footer-right">
                                <button
                                    type="button"
                                    className="studio-btn studio-btn-draft"
                                    onClick={() => handleSaveArticle('draft')}
                                >
                                    Save as Draft
                                </button>
                                <button
                                    type="button"
                                    className="studio-btn studio-btn-primary"
                                    onClick={() => handleSaveArticle('published')}
                                >
                                    {formData.status === 'draft' ? 'Publish Article Now' : 'Save & Publish'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PROMPT MODAL FOR INSERT LINK / IMAGE */}
            {promptDialog && (
                <div className="studio-confirm-overlay" onClick={() => setPromptDialog(null)}>
                    <div className="studio-confirm-card" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">{promptDialog.type === 'link' ? '🔗' : '🖼️'}</div>
                        <h3>{promptDialog.type === 'link' ? 'Insert Web Link' : 'Insert Image URL'}</h3>
                        <form onSubmit={handlePromptSubmit} className="prompt-form">
                            <div className="prompt-input-group">
                                <label>{promptDialog.type === 'link' ? 'Destination URL (href)' : 'Image Address (src)'}</label>
                                <input
                                    type="url"
                                    className="editor-input"
                                    placeholder="https://..."
                                    value={promptDialog.url}
                                    onChange={e => setPromptDialog(prev => ({ ...prev, url: e.target.value }))}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="prompt-input-group">
                                <label>{promptDialog.type === 'link' ? 'Anchor Text (optional)' : 'Caption / Alt Text (optional)'}</label>
                                <input
                                    type="text"
                                    className="editor-input"
                                    placeholder={promptDialog.type === 'link' ? 'Click here to read more...' : 'Description of image...'}
                                    value={promptDialog.text}
                                    onChange={e => setPromptDialog(prev => ({ ...prev, text: e.target.value }))}
                                />
                            </div>
                            <div className="confirm-actions mt-3">
                                <button type="button" className="studio-btn studio-btn-ghost" onClick={() => setPromptDialog(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="studio-btn studio-btn-primary">
                                    Insert {promptDialog.type === 'link' ? 'Link' : 'Image'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION DIALOG */}
            {deleteConfirmId && (
                <div className="studio-confirm-overlay">
                    <div className="studio-confirm-card">
                        <div className="confirm-icon danger">🗑️</div>
                        <h3>Delete Article?</h3>
                        <p>Are you sure you want to delete this blog post? It will be removed from your website and local storage.</p>
                        <div className="confirm-actions">
                            <button className="studio-btn studio-btn-ghost" onClick={() => setDeleteConfirmId(null)}>
                                Cancel
                            </button>
                            <button
                                className="studio-btn studio-btn-danger"
                                onClick={() => {
                                    deletePost(deleteConfirmId);
                                    setDeleteConfirmId(null);
                                    triggerNotification('Article deleted.');
                                }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* RESET CONFIRMATION DIALOG */}
            {resetConfirmOpen && (
                <div className="studio-confirm-overlay">
                    <div className="studio-confirm-card">
                        <div className="confirm-icon warning">⚠️</div>
                        <h3>Reset to Default Articles?</h3>
                        <p>This will restore the original default articles from the JSON data file. Any custom draft or post not exported will be lost.</p>
                        <div className="confirm-actions">
                            <button className="studio-btn studio-btn-ghost" onClick={() => setResetConfirmOpen(false)}>
                                Cancel
                            </button>
                            <button
                                className="studio-btn studio-btn-warning"
                                onClick={() => {
                                    resetToDefaults();
                                    setResetConfirmOpen(false);
                                    triggerNotification('Reset to defaults complete.');
                                }}
                            >
                                Yes, Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GOOGLE SHEETS LIVE SYNC MODAL */}
            {isSheetModalOpen && (
                <div className="studio-confirm-overlay" onClick={() => setIsSheetModalOpen(false)}>
                    <div className="studio-sheet-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="studio-sheet-header">
                            <div className="studio-sheet-header-title">
                                <div className="sheet-logo-badge">📊</div>
                                <div>
                                    <h3>Google Sheets Live Sync</h3>
                                    <p>Connect your "Beefund_Articles" sheet directly to the live website</p>
                                </div>
                            </div>
                            <button className="studio-modal-close" onClick={() => setIsSheetModalOpen(false)}>&times;</button>
                        </div>

                        <div className="studio-sheet-body">
                            <div className="studio-sheet-status-row">
                                <span className="status-label">Connection Status:</span>
                                {sheetUrl ? (
                                    <span className="status-pill connected">🟢 Connected</span>
                                ) : (
                                    <span className="status-pill disconnected">⚪ Not Connected</span>
                                )}
                            </div>

                            {syncStatus.message && (
                                <div className={`studio-sheet-alert ${syncStatus.state}`}>
                                    <span>{syncStatus.message}</span>
                                </div>
                            )}

                            {sheetActionNotice && (
                                <div className="studio-sheet-alert success">
                                    <span>{sheetActionNotice}</span>
                                </div>
                            )}

                            <div className="studio-sheet-input-group">
                                <label htmlFor="sheet-app-url">Google Apps Script Web App URL:</label>
                                <input
                                    id="sheet-app-url"
                                    type="url"
                                    className="studio-input"
                                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                                    value={inputSheetUrl}
                                    onChange={(e) => setInputSheetUrl(e.target.value)}
                                />
                                <span className="input-hint">
                                    Deploy your Apps Script as a Web App (Execute as: Me, Access: Anyone).
                                </span>
                            </div>

                            <div className="studio-sheet-section-title">
                                <span>📄 Articles Live Sync</span>
                            </div>
                            <div className="studio-sheet-actions-grid">
                                <button
                                    type="button"
                                    className="studio-btn studio-btn-primary"
                                    disabled={isSyncing}
                                    onClick={async () => {
                                        setSheetUrl(inputSheetUrl);
                                        const res = await fetchFromSheet(inputSheetUrl);
                                        if (res && res.success) {
                                            setSheetActionNotice(`Saved URL & loaded ${res.count || 0} articles from sheet!`);
                                        }
                                    }}
                                >
                                    💾 Save & Pull Articles
                                </button>

                                <button
                                    type="button"
                                    className="studio-btn studio-btn-secondary"
                                    disabled={isSyncing || !inputSheetUrl}
                                    onClick={async () => {
                                        setSheetUrl(inputSheetUrl);
                                        const res = await pushAllToSheet(inputSheetUrl);
                                        if (res && res.success) {
                                            setSheetActionNotice(`Pushed ${posts.length} articles to your Google Sheet!`);
                                        }
                                    }}
                                >
                                    📤 Push Articles to Sheet
                                </button>
                            </div>

                            <div className="studio-sheet-section-title" style={{ marginTop: '1.25rem' }}>
                                <span>💳 Credit Cards Live Sync</span>
                            </div>
                            <div className="studio-sheet-actions-grid">
                                <button
                                    type="button"
                                    className="studio-btn studio-btn-primary"
                                    disabled={isSyncing || !inputSheetUrl}
                                    onClick={async () => {
                                        setSheetUrl(inputSheetUrl);
                                        const res = await fetchCardsFromSheet(inputSheetUrl);
                                        if (res && res.success) {
                                            setSheetActionNotice(`Loaded ${res.count || 0} credit cards from Google Sheet!`);
                                        }
                                    }}
                                >
                                    📥 Pull Cards from Sheet
                                </button>

                                <button
                                    type="button"
                                    className="studio-btn studio-btn-secondary"
                                    disabled={isSyncing || !inputSheetUrl}
                                    onClick={async () => {
                                        setSheetUrl(inputSheetUrl);
                                        const res = await pushCardsToSheet(inputSheetUrl);
                                        if (res && res.success) {
                                            setSheetActionNotice(`Pushed ${cards.length} credit cards to your Google Sheet!`);
                                        }
                                    }}
                                >
                                    📤 Push Cards to Sheet
                                </button>
                            </div>

                            {sheetUrl && (
                                <div className="studio-sheet-disconnect">
                                    <button
                                        type="button"
                                        className="studio-btn studio-btn-danger-outline"
                                        onClick={() => {
                                            setSheetUrl('');
                                            setInputSheetUrl('');
                                            setSheetActionNotice('Disconnected Google Sheet.');
                                        }}
                                    >
                                        Disconnect Google Sheet
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudioPage;
