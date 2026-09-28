import React, { useState } from 'react';
import { useBlogs } from '../../context/BlogContext';
import { useCards } from '../../context/CardsContext';
import GoogleSheetsSetupGuideModal from './GoogleSheetsSetupGuideModal';

const APPS_SCRIPT_TEMPLATE = `// ============================================================================
// BEEFUND LIVE SYNC WEB APP SCRIPT (Google Sheets Backend)
// ============================================================================
// Sheet Tabs Required:
// 1. "Articles" (Headers: id, title, slug, author, date, category, excerpt, content, status)
// 2. "CreditCards" (Headers: id, name, bank, category, badge, joiningFee, annualFee, rating, applyUrl, tagline, description, benefits, status)

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'get_articles';
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === 'get_cards') {
    return handleGetCards(ss);
  } else {
    return handleGetArticles(ss);
  }
}

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var payload = {};
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return respondJSON({ success: false, error: 'Invalid JSON payload' });
  }

  var action = payload.action;

  if (action === 'syncAll' && payload.articles) {
    return handleSyncArticles(ss, payload.articles);
  } else if (action === 'syncCards' && payload.cards) {
    return handleSyncCards(ss, payload.cards);
  } else if (action === 'save' && payload.article) {
    return handleSaveArticle(ss, payload.article);
  } else if (action === 'saveCard' && payload.card) {
    return handleSaveCard(ss, payload.card);
  }

  return respondJSON({ success: true, message: 'Action processed' });
}

function handleGetArticles(ss) {
  var sheet = ss.getSheetByName('Articles') || ss.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return respondJSON({ success: true, articles: [] });

  var articles = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && !row[1]) continue;
    var article = {
      id: row[0],
      title: row[1],
      slug: row[2],
      author: row[3],
      date: formatDate(row[4]),
      category: row[5],
      excerpt: row[6],
      content: row[7],
      status: row[8] || 'published'
    };
    articles.push(article);
  }
  return respondJSON({ success: true, articles: articles });
}

function handleSyncArticles(ss, articles) {
  var sheet = ss.getSheetByName('Articles');
  if (!sheet) sheet = ss.insertSheet('Articles');
  sheet.clear();
  sheet.appendRow(['id', 'title', 'slug', 'author', 'date', 'category', 'excerpt', 'content', 'status']);
  
  for (var i = 0; i < articles.length; i++) {
    var a = articles[i];
    sheet.appendRow([a.id, a.title, a.slug, a.author, a.date, a.category, a.excerpt, a.content, a.status]);
  }
  return respondJSON({ success: true, count: articles.length });
}

function handleGetCards(ss) {
  var sheet = ss.getSheetByName('CreditCards');
  if (!sheet) return respondJSON({ success: true, cards: [] });
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return respondJSON({ success: true, cards: [] });

  var cards = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (!row[0] && !row[1]) continue;
    var card = {
      id: row[0],
      name: row[1],
      bank: row[2],
      category: row[3],
      badge: row[4],
      joiningFee: row[5],
      annualFee: row[6],
      rating: row[7],
      applyUrl: row[8],
      tagline: row[9],
      description: row[10],
      benefits: row[11] ? row[11].toString().split('|') : [],
      status: row[12] || 'active'
    };
    cards.push(card);
  }
  return respondJSON({ success: true, cards: cards });
}

function handleSyncCards(ss, cards) {
  var sheet = ss.getSheetByName('CreditCards');
  if (!sheet) sheet = ss.insertSheet('CreditCards');
  sheet.clear();
  sheet.appendRow(['id', 'name', 'bank', 'category', 'badge', 'joiningFee', 'annualFee', 'rating', 'applyUrl', 'tagline', 'description', 'benefits', 'status']);

  for (var i = 0; i < cards.length; i++) {
    var c = cards[i];
    var benStr = Array.isArray(c.benefits) ? c.benefits.join('|') : (c.benefits || '');
    sheet.appendRow([c.id, c.name, c.bank, c.category, c.badge, c.joiningFee, c.annualFee, c.rating, c.applyUrl, c.tagline, c.description, benStr, c.status]);
  }
  return respondJSON({ success: true, count: cards.length });
}

function formatDate(val) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return val ? val.toString() : '';
}

function respondJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}`;

const GoogleSheetsHubSection = () => {
    const { 
        posts, sheetUrl, setSheetUrl, isSyncing: isBlogSyncing, 
        fetchFromSheet, pushAllToSheet 
    } = useBlogs();
    const { 
        cards, isSyncing: isCardsSyncing, 
        fetchCardsFromSheet, pushCardsToSheet 
    } = useCards();

    const [inputUrl, setInputUrl] = useState(sheetUrl || '');
    const [actionNotice, setActionNotice] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [copiedScript, setCopiedScript] = useState(false);
    const [isCodeVisible, setIsCodeVisible] = useState(false);
    const [isSheetLocked, setIsSheetLocked] = useState(() => {
        try {
            return localStorage.getItem('beefund_sheet_locked') === 'true';
        } catch (e) {
            return false;
        }
    });
    const [isSetupGuideModalOpen, setIsSetupGuideModalOpen] = useState(false);

    const isAnySyncing = isBlogSyncing || isCardsSyncing || isTesting;

    const showNotice = (text, type = 'success') => {
        setActionNotice({ text, type });
        setTimeout(() => setActionNotice(null), 5000);
    };

    const handleToggleLock = (checked) => {
        setIsSheetLocked(checked);
        try {
            localStorage.setItem('beefund_sheet_locked', checked ? 'true' : 'false');
        } catch (err) {
            console.warn(err);
        }
    };

    // Save URL action
    const handleSaveUrl = () => {
        if (isSheetLocked) {
            showNotice('Google Sheet configuration is locked. Uncheck lock to modify.', 'error');
            return;
        }
        const clean = inputUrl.trim();
        setSheetUrl(clean);
        if (clean) {
            showNotice('Google Sheet Web App URL saved successfully!');
        } else {
            showNotice('Google Sheet disconnected.', 'neutral');
        }
    };

    // Test live connection
    const handleTestConnection = async () => {
        const target = inputUrl.trim() || sheetUrl;
        if (!target) {
            showNotice('Please enter a Google Apps Script Web App URL first.', 'error');
            return;
        }

        setIsTesting(true);
        try {
            const res = await fetch(target, { method: 'GET' });
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data = await res.json();
            if (data && data.success) {
                if (!isSheetLocked) setSheetUrl(target);
                showNotice(`Live Connection Verified! Script returned ${data.articles ? data.articles.length : 0} articles.`, 'success');
            } else {
                throw new Error(data?.error || 'Invalid response from Web App');
            }
        } catch (err) {
            showNotice(`Connection Test Failed: ${err.message}. Check Apps Script permissions ("Who has access: Anyone").`, 'error');
        } finally {
            setIsTesting(false);
        }
    };

    // Copy script
    const handleCopyScript = () => {
        navigator.clipboard.writeText(APPS_SCRIPT_TEMPLATE).then(() => {
            setCopiedScript(true);
            setTimeout(() => setCopiedScript(false), 3000);
        });
    };

    // Pull Articles
    const handlePullArticles = async () => {
        if (!sheetUrl && !inputUrl) {
            showNotice('Please save a Google Sheet URL first.', 'error');
            return;
        }
        if (!isSheetLocked && inputUrl && inputUrl !== sheetUrl) {
            setSheetUrl(inputUrl);
        }
        const res = await fetchFromSheet(inputUrl || sheetUrl);
        if (res && res.success) {
            showNotice(`Successfully pulled ${res.count || 0} articles from Google Sheet!`);
        } else {
            showNotice(res?.error || 'Failed to pull articles.', 'error');
        }
    };

    // Push Articles
    const handlePushArticles = async () => {
        if (!sheetUrl && !inputUrl) {
            showNotice('Please save a Google Sheet URL first.', 'error');
            return;
        }
        if (!isSheetLocked && inputUrl && inputUrl !== sheetUrl) {
            setSheetUrl(inputUrl);
        }
        const res = await pushAllToSheet(inputUrl || sheetUrl);
        if (res && res.success) {
            showNotice(`Successfully pushed ${posts.length} articles to Google Sheet!`);
        } else {
            showNotice(res?.error || 'Failed to push articles.', 'error');
        }
    };

    // Pull Cards
    const handlePullCards = async () => {
        if (!sheetUrl && !inputUrl) {
            showNotice('Please save a Google Sheet URL first.', 'error');
            return;
        }
        if (!isSheetLocked && inputUrl && inputUrl !== sheetUrl) {
            setSheetUrl(inputUrl);
        }
        const res = await fetchCardsFromSheet(inputUrl || sheetUrl);
        if (res && res.success) {
            showNotice(`Successfully pulled ${res.count || 0} credit cards from Google Sheet!`);
        } else {
            showNotice(res?.error || 'Failed to pull credit cards.', 'error');
        }
    };

    // Push Cards
    const handlePushCards = async () => {
        if (!sheetUrl && !inputUrl) {
            showNotice('Please save a Google Sheet URL first.', 'error');
            return;
        }
        if (!isSheetLocked && inputUrl && inputUrl !== sheetUrl) {
            setSheetUrl(inputUrl);
        }
        const res = await pushCardsToSheet(inputUrl || sheetUrl);
        if (res && res.success) {
            showNotice(`Successfully pushed ${cards.length} credit cards to Google Sheet!`);
        } else {
            showNotice(res?.error || 'Failed to push credit cards.', 'error');
        }
    };

    return (
        <div className="gsheet-hub-container">
            {/* NOTICE BANNER */}
            {actionNotice && (
                <div className={`gsheet-notice-banner ${actionNotice.type}`}>
                    <span>{actionNotice.text}</span>
                    <button type="button" onClick={() => setActionNotice(null)}>&times;</button>
                </div>
            )}

            {/* 1. HERO CONNECTION STATUS CARD */}
            <div className="gsheet-hero-card">
                <div className="gsheet-hero-header">
                    <div className="gsheet-hero-brand">
                        <div className="gsheet-icon-badge">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="8" y1="13" x2="16" y2="13"></line>
                                <line x1="8" y1="17" x2="16" y2="17"></line>
                                <line x1="10" y1="9" x2="10" y2="9"></line>
                            </svg>
                        </div>
                        <div>
                            <h2>Google Sheets Live Sync Hub</h2>
                            <p>Seamless two-way cloud synchronization between BeeFund and your Google Sheets database</p>
                        </div>
                    </div>

                    <div className="gsheet-connection-status">
                        {sheetUrl ? (
                            <span className="status-badge connected">
                                <span className="status-ping"></span>
                                Connected &amp; Live
                            </span>
                        ) : (
                            <span className="status-badge disconnected">
                                Not Connected
                            </span>
                        )}
                    </div>
                </div>

                {/* LOCK CHECKBOX AND SETUP GUIDE LINK BAR */}
                <div className="studio-sheet-lock-bar" style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
                    <label className="sheet-lock-checkbox-label">
                        <input
                            type="checkbox"
                            checked={isSheetLocked}
                            onChange={(e) => handleToggleLock(e.target.checked)}
                        />
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            {isSheetLocked ? (
                                <>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </>
                            ) : (
                                <>
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                                </>
                            )}
                        </svg>
                        <span style={{ fontWeight: 600 }}>
                            {isSheetLocked ? 'Google Sheet Locked (Protected)' : 'Lock Google Sheet Configuration'}
                        </span>
                    </label>

                    <button
                        type="button"
                        className="setup-guide-link-btn"
                        onClick={() => setIsSetupGuideModalOpen(true)}
                        title="Open complete Google Sheets setup guide and Apps Script code"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        <span>Setup Guide &amp; Code</span>
                    </button>
                </div>

                {/* URL INPUT & CONFIG */}
                <div className="gsheet-url-control-row">
                    <div className="url-input-container">
                        <label htmlFor="gsheet-url-input">Google Apps Script Web App Endpoint URL:</label>
                        <div className="url-input-box">
                            <input
                                id="gsheet-url-input"
                                type="url"
                                placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                                value={inputUrl}
                                onChange={(e) => setInputUrl(e.target.value)}
                                className={`gsheet-input ${isSheetLocked ? 'input-locked' : ''}`}
                                disabled={isSheetLocked}
                            />
                            {inputUrl && !isSheetLocked && (
                                <button 
                                    type="button" 
                                    className="url-clear-btn"
                                    onClick={() => setInputUrl('')}
                                    title="Clear input"
                                >
                                    &times;
                                </button>
                            )}
                        </div>
                        <span className="url-helper-text">
                            {isSheetLocked 
                                ? 'Configuration is locked. URL cannot be changed or cleared while lock is active.' 
                                : 'Deploy your Apps Script as Web App with Execute as: Me and Who has access: Anyone.'}
                        </span>
                    </div>

                    <div className="url-actions-container">
                        <button
                            type="button"
                            className="studio-btn studio-btn-primary"
                            onClick={handleSaveUrl}
                            disabled={isAnySyncing || isSheetLocked}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            <span>Save URL</span>
                        </button>
                        <button
                            type="button"
                            className="studio-btn studio-btn-secondary"
                            onClick={handleTestConnection}
                            disabled={isAnySyncing || (!inputUrl.trim() && !sheetUrl)}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                            </svg>
                            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                        </button>
                        {sheetUrl && !isSheetLocked && (
                            <button
                                type="button"
                                className="studio-btn studio-btn-danger-outline"
                                onClick={() => {
                                    setSheetUrl('');
                                    setInputUrl('');
                                    showNotice('Google Sheet disconnected.');
                                }}
                            >
                                Disconnect
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. DUAL LIVE SYNC STATIONS */}
            <div className="gsheet-stations-grid">
                {/* STATION 1: ARTICLES */}
                <div className="gsheet-sync-station-card">
                    <div className="station-header">
                        <div className="station-title-group">
                            <span className="station-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                            </span>
                            <div>
                                <h3>Blog &amp; News Articles</h3>
                                <p>Sheet Tab: <code>Articles</code></p>
                            </div>
                        </div>
                        <span className="station-badge">
                            {posts.length} Local Articles
                        </span>
                    </div>

                    <div className="station-body">
                        <p className="station-desc">
                            Synchronize your news articles, guides, formatting, categories, and slugs. Pull updates from external collaborators or push local edits to the sheet.
                        </p>

                        <div className="station-fields-preview">
                            <span className="field-chip">id</span>
                            <span className="field-chip">title</span>
                            <span className="field-chip">slug</span>
                            <span className="field-chip">author</span>
                            <span className="field-chip">date</span>
                            <span className="field-chip">category</span>
                            <span className="field-chip">excerpt</span>
                            <span className="field-chip">content</span>
                            <span className="field-chip">status</span>
                        </div>

                        <div className="station-actions-row">
                            <button
                                type="button"
                                className="studio-btn studio-btn-primary"
                                onClick={handlePullArticles}
                                disabled={isAnySyncing}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <span>Pull Articles from Sheet</span>
                            </button>
                            <button
                                type="button"
                                className="studio-btn studio-btn-secondary"
                                onClick={handlePushArticles}
                                disabled={isAnySyncing}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <span>Push Articles to Sheet</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* STATION 2: CREDIT CARDS */}
                <div className="gsheet-sync-station-card">
                    <div className="station-header">
                        <div className="station-title-group">
                            <span className="station-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                                    <line x1="2" y1="10" x2="22" y2="10"></line>
                                </svg>
                            </span>
                            <div>
                                <h3>Credit Cards Catalog</h3>
                                <p>Sheet Tab: <code>CreditCards</code></p>
                            </div>
                        </div>
                        <span className="station-badge">
                            {cards.length} Local Cards
                        </span>
                    </div>

                    <div className="station-body">
                        <p className="station-desc">
                            Manage and publish your credit card catalog, partner application links, joining &amp; annual fees, benefits, and category filters directly from Google Sheets.
                        </p>

                        <div className="station-fields-preview">
                            <span className="field-chip">id</span>
                            <span className="field-chip">name</span>
                            <span className="field-chip">bank</span>
                            <span className="field-chip">category</span>
                            <span className="field-chip">badge</span>
                            <span className="field-chip">fees</span>
                            <span className="field-chip">rating</span>
                            <span className="field-chip">applyUrl</span>
                            <span className="field-chip">benefits</span>
                        </div>

                        <div className="station-actions-row">
                            <button
                                type="button"
                                className="studio-btn studio-btn-primary"
                                onClick={handlePullCards}
                                disabled={isAnySyncing}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <span>Pull Cards from Sheet</span>
                            </button>
                            <button
                                type="button"
                                className="studio-btn studio-btn-secondary"
                                onClick={handlePushCards}
                                disabled={isAnySyncing}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                <span>Push Cards to Sheet</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. GOOGLE APPS SCRIPT READY-TO-USE CODE & GUIDE */}
            <div className="gsheet-guide-card">
                <div className="guide-header">
                    <div className="guide-title">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="16 18 22 12 16 6"></polyline>
                                <polyline points="8 6 2 12 8 18"></polyline>
                            </svg>
                            <h3 style={{ margin: 0 }}>Google Apps Script Backend Code (<code>Code.gs</code>)</h3>
                        </div>
                        <p>Complete Apps Script code to copy and paste into your Google Sheet's script editor</p>
                    </div>

                    <div className="guide-header-actions">
                        <button
                            type="button"
                            className="studio-btn studio-btn-secondary"
                            onClick={() => setIsCodeVisible(prev => !prev)}
                        >
                            {isCodeVisible ? 'Hide Script Code' : 'View Script Code'}
                        </button>
                        <button
                            type="button"
                            className="studio-btn studio-btn-primary"
                            onClick={handleCopyScript}
                        >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                                {copiedScript ? (
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                ) : (
                                    <>
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </>
                                )}
                            </svg>
                            <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script Code'}</span>
                        </button>
                    </div>
                </div>

                {/* Steps */}
                <div className="guide-steps-grid">
                    <div className="guide-step-item">
                        <span className="step-num">1</span>
                        <div className="step-content">
                            <strong>Create Google Sheet</strong>
                            <p>Create a new Google Sheet named "BeeFund Database". Ensure tabs named <code>Articles</code> and <code>CreditCards</code> exist.</p>
                        </div>
                    </div>
                    <div className="guide-step-item">
                        <span className="step-num">2</span>
                        <div className="step-content">
                            <strong>Open Apps Script</strong>
                            <p>In your Google Sheet menu, click <strong>Extensions &gt; Apps Script</strong> to open the script editor.</p>
                        </div>
                    </div>
                    <div className="guide-step-item">
                        <span className="step-num">3</span>
                        <div className="step-content">
                            <strong>Paste Code</strong>
                            <p>Click "Copy Script Code" above, paste it into <code>Code.gs</code>, and press <strong>Ctrl+S / Cmd+S</strong> to save.</p>
                        </div>
                    </div>
                    <div className="guide-step-item">
                        <span className="step-num">4</span>
                        <div className="step-content">
                            <strong>Deploy as Web App</strong>
                            <p>Click <strong>Deploy &gt; New deployment &gt; Web app</strong>. Choose: <em>Execute as: Me</em>, <em>Who has access: Anyone</em>, then paste the URL above!</p>
                        </div>
                    </div>
                </div>

                {/* Code Preview Box */}
                {isCodeVisible && (
                    <div className="guide-code-box">
                        <pre><code>{APPS_SCRIPT_TEMPLATE}</code></pre>
                    </div>
                )}
            </div>

            {/* SETUP GUIDE MODAL */}
            <GoogleSheetsSetupGuideModal
                isOpen={isSetupGuideModalOpen}
                onClose={() => setIsSetupGuideModalOpen(false)}
            />
        </div>
    );
};

export default GoogleSheetsHubSection;
