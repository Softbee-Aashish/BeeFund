import React, { useState, useMemo } from 'react';
import { useCards } from '../../context/CardsContext';
import CardEditorModal from './CardEditorModal';

const getBenefitIconSvg = (iconType) => {
    switch (iconType) {
        case 'travel':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            );
        case 'cashback':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            );
        case 'rewards':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
            );
        case 'fuel':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"></path><path d="M15 10h4a2 2 0 0 1 2 2v8"></path><line x1="3" y1="14" x2="15" y2="14"></line></svg>
            );
        case 'protection':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            );
        case 'vip':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            );
        case 'shopping':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            );
        case 'entertainment':
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
            );
        default:
            return (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
            );
    }
};

const CardsStudioSection = () => {
    const {
        cards,
        createCard,
        updateCard,
        deleteCard,
        toggleCardActive,
        duplicateCard,
        exportCardsJson,
        resetCardsToDefaults,
        loadStarterTemplates
    } = useCards();

    // Search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [bankFilter, setBankFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Editor modal & quick inspect state
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [expandedCardId, setExpandedCardId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
    const [notification, setNotification] = useState('');

    const triggerNotice = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 3500);
    };

    const handleCopyLink = (link, id, e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        if (!link) return;
        navigator.clipboard.writeText(link).then(() => {
            setCopiedId(id);
            triggerNotice('Card application link copied to clipboard!');
            setTimeout(() => setCopiedId(null), 2200);
        }).catch(() => {
            // fallback
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2200);
        });
    };

    const toggleExpand = (id) => {
        setExpandedCardId(prev => (prev === id ? null : id));
    };

    // Calculate unique banks and categories
    const banks = useMemo(() => {
        const set = new Set();
        cards.forEach(c => { if (c.bank) set.add(c.bank); });
        return ['all', ...Array.from(set)];
    }, [cards]);

    const categories = useMemo(() => {
        const set = new Set();
        cards.forEach(c => { if (c.category) set.add(c.category); });
        return ['all', ...Array.from(set)];
    }, [cards]);

    // KPI statistics
    const totalCount = cards.length;
    const activeCount = cards.filter(c => c.status === 'active').length;
    const inactiveCount = totalCount - activeCount;
    const bankCount = banks.length - 1 > 0 ? banks.length - 1 : 0;

    // Filtered list
    const filteredCards = useMemo(() => {
        return cards.filter(card => {
            const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
            const matchesBank = bankFilter === 'all' || card.bank === bankFilter;
            const matchesCat = categoryFilter === 'all' || card.category === categoryFilter;
            const q = searchQuery.toLowerCase().trim();
            const matchesQ = !q ||
                (card.name && card.name.toLowerCase().includes(q)) ||
                (card.bank && card.bank.toLowerCase().includes(q)) ||
                (card.category && card.category.toLowerCase().includes(q)) ||
                (card.tagline && card.tagline.toLowerCase().includes(q)) ||
                (card.description && card.description.toLowerCase().includes(q));
            return matchesStatus && matchesBank && matchesCat && matchesQ;
        });
    }, [cards, statusFilter, bankFilter, categoryFilter, searchQuery]);

    const handleSaveCard = (cardData) => {
        if (editingCard) {
            updateCard(editingCard.id, cardData);
            triggerNotice(`Updated "${cardData.name}" successfully!`);
        } else {
            createCard(cardData);
            triggerNotice(`Created new credit card "${cardData.name}"!`);
        }
        setEditingCard(null);
    };

    return (
        <section className="cards-studio-section">
            {notification && (
                <div className="studio-toast-banner">
                    <span>{notification}</span>
                </div>
            )}

            {/* KPI Stats Grid */}
            <div className="studio-stats-grid">
                <div className="studio-stat-card">
                    <div className="stat-icon-wrapper blue">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-num">{totalCount}</span>
                        <span className="stat-label">Total Credit Cards</span>
                    </div>
                </div>

                <div className="studio-stat-card">
                    <div className="stat-icon-wrapper green">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-num">{activeCount}</span>
                        <span className="stat-label">Live on Website</span>
                    </div>
                </div>

                <div className="studio-stat-card">
                    <div className="stat-icon-wrapper amber">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-num">{bankCount}</span>
                        <span className="stat-label">Partner Bank Issuers</span>
                    </div>
                </div>

                <div className="studio-stat-card">
                    <div className="stat-icon-wrapper purple">
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <div className="stat-details">
                        <span className="stat-tag-live">Direct Apply</span>
                        <span className="stat-label">Direct Bank Links</span>
                    </div>
                </div>
            </div>

            {/* Toolbar: Search, Filters, Add Button */}
            <div className="studio-action-toolbar">
                <div className="toolbar-left">
                    <div className="studio-search-box">
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search card by name, bank, category, or perks..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="search-clear-btn" onClick={() => setSearchQuery('')}>&times;</button>
                        )}
                    </div>

                    {/* Bank Filter */}
                    {banks.length > 2 && (
                        <select
                            className="studio-filter-select"
                            value={bankFilter}
                            onChange={e => setBankFilter(e.target.value)}
                        >
                            {banks.map(b => (
                                <option key={b} value={b}>{b === 'all' ? 'All Banks' : b}</option>
                            ))}
                        </select>
                    )}

                    {/* Category Filter */}
                    {categories.length > 2 && (
                        <select
                            className="studio-filter-select"
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
                            ))}
                        </select>
                    )}

                    {/* Status Tabs */}
                    <div className="studio-status-tabs">
                        <button
                            type="button"
                            className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('all')}
                        >
                            All ({totalCount})
                        </button>
                        <button
                            type="button"
                            className={`status-tab ${statusFilter === 'active' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('active')}
                        >
                            Live ({activeCount})
                        </button>
                        <button
                            type="button"
                            className={`status-tab ${statusFilter === 'inactive' ? 'active' : ''}`}
                            onClick={() => setStatusFilter('inactive')}
                        >
                            Drafts ({inactiveCount})
                        </button>
                    </div>
                </div>

                <div className="toolbar-right">
                    <button
                        type="button"
                        className="studio-btn studio-btn-primary"
                        onClick={() => {
                            setEditingCard(null);
                            setIsEditorOpen(true);
                        }}
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Credit Card</span>
                    </button>

                    <button
                        type="button"
                        className="studio-btn studio-btn-secondary"
                        onClick={exportCardsJson}
                        title="Download creditCards.json file to commit to codebase"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Export JSON</span>
                    </button>
                </div>
            </div>

            {/* Cards Data Table */}
            <div className="studio-table-card">
                <div className="studio-table-responsive">
                    <table className="studio-table studio-cards-table">
                        <thead>
                            <tr>
                                <th style={{ minWidth: '220px' }}>CARD & ARTWORK</th>
                                <th style={{ minWidth: '150px' }}>BANK & CATEGORY</th>
                                <th style={{ minWidth: '170px' }}>FEES & WAIVER</th>
                                <th style={{ minWidth: '180px' }}>PERKS CAROUSEL</th>
                                <th style={{ minWidth: '200px' }}>DIRECT APPLY LINK</th>
                                <th style={{ minWidth: '110px' }}>OFFICIAL PDF</th>
                                <th style={{ minWidth: '110px' }}>LIVE STATUS</th>
                                <th className="text-right" style={{ minWidth: '140px' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="table-empty-cell">
                                        <div className="empty-state-studio">
                                            <div className="empty-illustration">
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                            </div>
                                            <h4>Your Credit Card Catalog is Currently Empty</h4>
                                            <p>No credit cards are listed yet. Add your first credit card with direct application links, or load pre-configured starter templates to customize.</p>
                                            <div className="empty-state-actions">
                                                <button
                                                    type="button"
                                                    className="studio-btn studio-btn-primary"
                                                    onClick={() => {
                                                        setEditingCard(null);
                                                        setIsEditorOpen(true);
                                                    }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <line x1="12" y1="5" x2="12" y2="19" />
                                                        <line x1="5" y1="12" x2="19" y2="12" />
                                                    </svg>
                                                    <span>Add Your First Credit Card</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    className="studio-btn studio-btn-secondary"
                                                    onClick={() => {
                                                        loadStarterTemplates();
                                                        triggerNotice('Loaded 6 popular starter credit card templates!');
                                                    }}
                                                    title="Load 6 starter card templates to test or edit"
                                                >
                                                    Load Starter Templates (6 Banks)
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCards.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="table-empty-cell">
                                        <div className="empty-state-studio">
                                            <p>No credit cards matched your search or filters.</p>
                                            <button
                                                type="button"
                                                className="studio-btn studio-btn-secondary"
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setBankFilter('all');
                                                    setCategoryFilter('all');
                                                    setStatusFilter('all');
                                                }}
                                            >
                                                Clear All Filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCards.map(card => {
                                    const isExpanded = expandedCardId === card.id;
                                    return (
                                        <React.Fragment key={card.id}>
                                            <tr
                                                className={`card-table-row ${isExpanded ? 'row-expanded' : ''} ${card.status !== 'active' ? 'row-draft' : ''}`}
                                                onClick={() => toggleExpand(card.id)}
                                            >
                                                {/* 1. CARD & ARTWORK */}
                                                <td>
                                                    <div className="table-card-cell">
                                                        <div className="table-card-thumb-wrap">
                                                            {card.imageUrl ? (
                                                                <img src={card.imageUrl} alt={card.name} className="table-card-thumb" />
                                                            ) : (
                                                                <div className="table-card-thumb-placeholder">
                                                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                                                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                                                        <line x1="2" y1="10" x2="22" y2="10" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="table-card-identity">
                                                            <div className="card-title-row">
                                                                <span className="card-name-text" title={card.name}>{card.name}</span>
                                                                {card.rating && (
                                                                    <span className="card-rating-pill" title={`Rating: ${card.rating} / 5`}>
                                                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                                                            <span>{card.rating}</span>
                                                                        </span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {card.badge && (
                                                                <span className="card-ribbon-badge">{card.badge}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* 2. BANK & CATEGORY */}
                                                <td>
                                                    <div className="table-bank-col">
                                                        <span className="bank-name-badge">{card.bank}</span>
                                                        <span className="category-pill-tag">{card.category}</span>
                                                    </div>
                                                </td>

                                                {/* 3. FEES & WAIVER */}
                                                <td>
                                                    <div className="table-fee-summary">
                                                        <div className="fee-line">
                                                            <span className="fee-label">Joining:</span>
                                                            <span className="fee-val">{card.joiningFee || '₹0'}</span>
                                                        </div>
                                                        <div className="fee-line">
                                                            <span className="fee-label">Annual:</span>
                                                            <span className="fee-val">{card.annualFee || '₹0'}</span>
                                                        </div>
                                                        {card.feeWaiver && (
                                                            <span className="fee-waiver-pill" title={card.feeWaiver}>
                                                                {card.feeWaiver}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* 4. PERKS CAROUSEL */}
                                                <td>
                                                    <div className="table-perks-summary">
                                                        <span className="perks-count-badge">
                                                            {card.benefits?.length || 0} Perks
                                                        </span>
                                                        {card.benefits && card.benefits[0] && (
                                                            <div className="perk-preview-item" title={card.benefits[0].desc || card.benefits[0].title}>
                                                                <span className="perk-preview-icon">{getBenefitIconSvg(card.benefits[0].icon)}</span>
                                                                <span className="perk-preview-title">{card.benefits[0].title}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* 5. DIRECT APPLY LINK */}
                                                <td onClick={e => e.stopPropagation()}>
                                                    <div className="table-affiliate-col">
                                                        <span className="affiliate-url-preview" title={card.applyLink || 'No link configured'}>
                                                            {card.applyLink || 'No link configured'}
                                                        </span>
                                                        {card.applyLink && (
                                                            <div className="affiliate-actions-row">
                                                                <button
                                                                    type="button"
                                                                    className={`copy-link-btn ${copiedId === card.id ? 'copied' : ''}`}
                                                                    onClick={(e) => handleCopyLink(card.applyLink, card.id, e)}
                                                                    title="Copy apply URL to clipboard"
                                                                >
                                                                    {copiedId === card.id ? (
                                                                        <>
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                                                <polyline points="20 6 9 17 4 12" />
                                                                            </svg>
                                                                            <span>Copied!</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                                                            </svg>
                                                                            <span>Copy</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                                <a
                                                                    href={card.applyLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="test-link-btn"
                                                                    title="Open and test apply link in new tab"
                                                                >
                                                                    Test ↗
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* 6. OFFICIAL PDF */}
                                                <td onClick={e => e.stopPropagation()}>
                                                    <div className="table-doc-col">
                                                        {card.docUrl ? (
                                                            <a
                                                                href={card.docUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="doc-view-pill"
                                                                title={card.docName || 'Official PDF Document'}
                                                            >
                                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                                                    <polyline points="14 2 14 8 20 8"/>
                                                                </svg>
                                                                <span>PDF ↗</span>
                                                            </a>
                                                        ) : (
                                                            <span className="no-doc-label">— None —</span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* 7. LIVE STATUS */}
                                                <td onClick={e => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleCardActive(card.id)}
                                                        className={`status-pill ${card.status === 'active' ? 'pill-published' : 'pill-draft'}`}
                                                        title={`Status is ${card.status === 'active' ? 'Live' : 'Draft'}. Click to toggle.`}
                                                    >
                                                        <span className="status-dot" />
                                                        <span>{card.status === 'active' ? 'Live' : 'Draft'}</span>
                                                    </button>
                                                </td>

                                                {/* 8. ACTIONS */}
                                                <td onClick={e => e.stopPropagation()}>
                                                    <div className="actions-cluster">
                                                        <button
                                                            type="button"
                                                            className={`action-icon-btn inspect-btn ${isExpanded ? 'active' : ''}`}
                                                            onClick={() => toggleExpand(card.id)}
                                                            title={isExpanded ? 'Hide inspector drawer' : 'Quick inspect all card details & carousel perks'}
                                                        >
                                                            <svg
                                                                width="15"
                                                                height="15"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="2.5"
                                                                style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                                            >
                                                                <polyline points="6 9 12 15 18 9" />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-icon-btn edit-btn"
                                                            onClick={() => {
                                                                setEditingCard(card);
                                                                setIsEditorOpen(true);
                                                            }}
                                                            title="Edit card details, fees, artwork & carousel"
                                                        >
                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-icon-btn duplicate-btn"
                                                            onClick={() => {
                                                                duplicateCard(card.id);
                                                                triggerNotice(`Duplicated "${card.name}" as draft!`);
                                                            }}
                                                            title="Duplicate as new Draft"
                                                        >
                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                                            </svg>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="action-icon-btn delete-btn"
                                                            onClick={() => setDeleteConfirmId(card.id)}
                                                            title="Delete card offer"
                                                        >
                                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="3 6 5 6 21 6" />
                                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* EXPANDABLE QUICK INSPECTOR DRAWER */}
                                            {isExpanded && (
                                                <tr className="table-drawer-row">
                                                    <td colSpan={8} className="table-drawer-cell">
                                                        <div className="table-expanded-drawer">
                                                            <div className="drawer-header-bar">
                                                                <div className="drawer-header-title">
                                                                    <span className="drawer-tag">QUICK CARD INSPECTOR</span>
                                                                    <h4>{card.name}</h4>
                                                                    <span className="drawer-status-chip">
                                                                        {card.status === 'active' ? 'Live on /credit-cards' : 'Hidden Draft'}
                                                                    </span>
                                                                </div>
                                                                <div className="drawer-header-actions">
                                                                    <button
                                                                        type="button"
                                                                        className="studio-btn studio-btn-primary btn-sm"
                                                                        onClick={() => {
                                                                            setEditingCard(card);
                                                                            setIsEditorOpen(true);
                                                                        }}
                                                                    >
                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                                        </svg>
                                                                        <span>Edit Card in Studio</span>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="drawer-close-btn"
                                                                        onClick={() => setExpandedCardId(null)}
                                                                        title="Close inspector"
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="drawer-grid">
                                                                {/* Column 1: Card Visual Preview & Pricing */}
                                                                <div className="drawer-card-preview-col">
                                                                    <div className="drawer-mockup-card">
                                                                        {card.imageUrl ? (
                                                                            <img src={card.imageUrl} alt={card.name} className="drawer-mockup-img" />
                                                                        ) : (
                                                                            <div className="drawer-mockup-placeholder">
                                                                                <div className="mockup-chip" />
                                                                                <span className="mockup-bank">{card.bank}</span>
                                                                                <span className="mockup-brand">BEEFUND VIP</span>
                                                                            </div>
                                                                        )}
                                                                        <div className="drawer-mockup-overlay">
                                                                            {card.badge && <span className="drawer-badge">{card.badge}</span>}
                                                                            <span className="drawer-category">{card.category}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="drawer-fees-block">
                                                                        <div className="drawer-fee-item">
                                                                            <span className="fee-lbl">Joining Fee</span>
                                                                            <strong className="fee-val">{card.joiningFee || '₹0'}</strong>
                                                                        </div>
                                                                        <div className="drawer-fee-item">
                                                                            <span className="fee-lbl">Annual Fee</span>
                                                                            <strong className="fee-val">{card.annualFee || '₹0'}</strong>
                                                                        </div>
                                                                        {card.feeWaiver && (
                                                                            <div className="drawer-fee-item full">
                                                                                <span className="fee-lbl">Spend Waiver</span>
                                                                                <em className="fee-waiver-val">{card.feeWaiver}</em>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Column 2: Overview & Links */}
                                                                <div className="drawer-overview-col">
                                                                    <div className="drawer-section">
                                                                        <span className="drawer-label">VALUE PROPOSITION TAGLINE</span>
                                                                        <p className="drawer-tagline">{card.tagline || 'No tagline set.'}</p>
                                                                    </div>

                                                                    <div className="drawer-section">
                                                                        <span className="drawer-label">EDITORIAL DESCRIPTION</span>
                                                                        <p className="drawer-description">{card.description || 'No detailed editorial description set.'}</p>
                                                                    </div>

                                                                    <div className="drawer-links-section">
                                                                        <div className="drawer-link-item">
                                                                            <span className="drawer-label">DIRECT APPLY LINK</span>
                                                                            <div className="drawer-link-box">
                                                                                <code className="drawer-url">{card.applyLink || 'Not configured'}</code>
                                                                                {card.applyLink && (
                                                                                    <div className="drawer-link-actions">
                                                                                        <button
                                                                                            type="button"
                                                                                            className={`copy-link-btn ${copiedId === card.id ? 'copied' : ''}`}
                                                                                            onClick={(e) => handleCopyLink(card.applyLink, card.id, e)}
                                                                                        >
                                                                                            {copiedId === card.id ? 'Copied!' : 'Copy'}
                                                                                        </button>
                                                                                        <a
                                                                                            href={card.applyLink}
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                            className="test-link-btn"
                                                                                        >
                                                                                            Test ↗
                                                                                        </a>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        {card.docUrl && (
                                                                            <div className="drawer-link-item">
                                                                                <span className="drawer-label">OFFICIAL SANCTION / MITC PDF</span>
                                                                                <div className="drawer-doc-box">
                                                                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                                                                                        <span>{card.docName || 'Official Terms PDF'}</span>
                                                                                    </span>
                                                                                    <a
                                                                                        href={card.docUrl}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="test-link-btn"
                                                                                    >
                                                                                        View PDF ↗
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* Column 3: Full Perks Carousel Breakdown */}
                                                                <div className="drawer-carousel-col">
                                                                    <div className="drawer-perks-header">
                                                                        <span className="drawer-label">BENEFITS CAROUSEL SLIDES</span>
                                                                        <span className="drawer-badge-count">{card.benefits?.length || 0} Slides</span>
                                                                    </div>
                                                                    <div className="drawer-perks-list">
                                                                        {(card.benefits && card.benefits.length > 0) ? (
                                                                            card.benefits.map((benefit, bIdx) => (
                                                                                <div key={bIdx} className="drawer-perk-card">
                                                                                    <div className="drawer-perk-header">
                                                                                        <span className="drawer-perk-icon">{getBenefitIconSvg(benefit.icon)}</span>
                                                                                        <strong className="drawer-perk-title">{benefit.title || `Benefit Slide #${bIdx + 1}`}</strong>
                                                                                        <span className="drawer-perk-num">Slide {bIdx + 1}</span>
                                                                                    </div>
                                                                                    <p className="drawer-perk-desc">{benefit.desc || 'No description provided.'}</p>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <p className="text-muted">No carousel benefits added yet.</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bottom info & reset strip */}
            <div className="studio-bottom-sync-bar">
                <p>
                    <strong>Credit Card Management:</strong> All card changes, uploaded images, and apply links save instantly to your browser. Use <strong>"Export JSON"</strong> to download and preserve permanent catalog backups.
                </p>
                <button
                    type="button"
                    className="reset-defaults-link"
                    onClick={() => setResetConfirmOpen(true)}
                >
                    Reset Cards to Defaults
                </button>
            </div>

            {/* Editor Modal */}
            <CardEditorModal
                isOpen={isEditorOpen}
                editingCard={editingCard}
                onClose={() => {
                    setIsEditorOpen(false);
                    setEditingCard(null);
                }}
                onSave={handleSaveCard}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="studio-confirm-overlay" onClick={() => setDeleteConfirmId(null)}>
                    <div className="studio-confirm-card" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </div>
                        <h3>Delete Credit Card?</h3>
                        <p>Are you sure you want to delete this credit card offer? This action will remove it from the catalog and the website.</p>
                        <div className="confirm-actions">
                            <button
                                type="button"
                                className="studio-btn studio-btn-ghost"
                                onClick={() => setDeleteConfirmId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="studio-btn studio-btn-danger"
                                onClick={() => {
                                    deleteCard(deleteConfirmId);
                                    setDeleteConfirmId(null);
                                    if (expandedCardId === deleteConfirmId) setExpandedCardId(null);
                                    triggerNotice('Card deleted from catalog.');
                                }}
                            >
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset to defaults Confirmation */}
            {resetConfirmOpen && (
                <div className="studio-confirm-overlay" onClick={() => setResetConfirmOpen(false)}>
                    <div className="studio-confirm-card" onClick={e => e.stopPropagation()}>
                        <div className="confirm-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </div>
                        <h3>Reset Cards to Defaults?</h3>
                        <p>This will reload the initial template library of popular bank credit cards into your workspace.</p>
                        <div className="confirm-actions">
                            <button
                                type="button"
                                className="studio-btn studio-btn-ghost"
                                onClick={() => setResetConfirmOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="studio-btn studio-btn-danger"
                                onClick={() => {
                                    resetCardsToDefaults();
                                    setResetConfirmOpen(false);
                                    setExpandedCardId(null);
                                    triggerNotice('Reset cards catalog to defaults.');
                                }}
                            >
                                Confirm Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CardsStudioSection;
