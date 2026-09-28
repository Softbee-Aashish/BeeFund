import React, { useState } from 'react';
import { useBlogs } from '../../context/BlogContext';
import { useCards } from '../../context/CardsContext';

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

  var headers = data[0];
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
        syncStatus: blogSyncStatus, fetchFromSheet, pushAllToSheet 
    } = useBlog();
    const { 
        cards, isSyncing: isCardsSyncing, 
        fetchCardsFromSheet, pushCardsToSheet 
    } = useCards();

    const [inputUrl, setInputUrl] = useState(sheetUrl || '');
    const [actionNotice, setActionNotice] = useState(null);
    const [isTesting, setIsTesting] = useState(false);
    const [copiedScript, setCopiedScript] = useState(false);
    const [isCodeVisible, setIsCodeVisible] = useState(false);

    const isAnySyncing = isBlogSyncing || isCardsSyncing || isTesting;

    const showNotice = (text, type = 'success') => {
        setActionNotice({ text, type });
        setTimeout(() => setActionNotice(null), 5000);
    };

    // Save URL action
    const handleSaveUrl = () => {
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
                setSheetUrl(target);
                showNotice(`🟢 Live Connection Verified! Script returned ${data.articles ? data.articles.length : 0} articles.`, 'success');
            } else {
                throw new Error(data?.error || 'Invalid response from Web App');
            }
        } catch (err) {
            showNotice(`⚠️ Connection Test Failed: ${err.message}. Check Apps Script permissions ("Who has access: Anyone").`, 'error');
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
        if (inputUrl && inputUrl !== sheetUrl) {
            setSheetUrl(inputUrl);
        }
        const res = await fetchFromSheet(inputUrl || sheetUrl);
        if (res && res.success) {
            showNotice(`📥 Successfully pulled ${res.count || 0} articles from Google Sheet!`);
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
        if (inputUrl && inputUrl !== sheetUrl) {
            setSheetUrl(inputUrl);
        }
        const res = await pushAllToSheet(inputUrl || sheetUrl);
        if (res && res.success) {
            showNotice(`📤 Successfully pushed ${posts.length} articles to Google Sheet!`);
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
        if (inputUrl && inputUrl !== sheetUrl) {
            setSheetUrl(inputUrl);
        }
        const res = await fetchCardsFromSheet(inputUrl || sheetUrl);
        if (res && res.success) {
            showNotice(`📥 Successfully pulled ${res.count || 0} credit cards from Google Sheet!`);
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
        if (inputUrl && inputUrl !== sheetUrl) {
            setSheetUrl(inputUrl);
        }
        const res = await pushCardsToSheet(inputUrl || sheetUrl);
        if (res && res.success) {
            showNotice(`📤 Successfully pushed ${cards.length} credit cards to Google Sheet!`);
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
                        <div className="gsheet-icon-badge">📊</div>
                        <div>
                            <h2>Google Sheets Live Sync Hub</h2>
                            <p>Seamless two-way cloud synchronization between BeeFund and your Google Sheets database</p>
                        </div>
                    </div>

                    <div className="gsheet-connection-status">
                        {sheetUrl ? (
                            <span className="status-badge connected">
                                <span className="status-ping"></span>
                                🟢 Connected & Live
                            </span>
                        ) : (
                            <span className="status-badge disconnected">
                                ⚪ Not Connected
                            </span>
                        )}
                    </div>
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
                                className="gsheet-input"
                            />
                            {inputUrl && (
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
                            Deploy your Apps Script as Web App with <strong>Execute as: Me</strong> and <strong>Who has access: Anyone</strong>.
                        </span>
                    </div>

                    <div className="url-actions-container">
                        <button
                            type="button"
                            className="studio-btn studio-btn-primary"
                            onClick={handleSaveUrl}
                            disabled={isAnySyncing}
                        >
                            💾 Save URL
                        </button>
                        <button
                            type="button"
                            className="studio-btn studio-btn-secondary"
                            onClick={handleTestConnection}
                            disabled={isAnySyncing || !inputUrl.trim()}
                        >
                            {isTesting ? 'Testing...' : '⚡ Test Connection'}
                        </button>
                        {sheetUrl && (
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
                            <span className="station-icon">📄</span>
                            <div>
                                <h3>Blog & News Articles</h3>
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
                                📥 Pull Articles from Sheet
                            </button>
                            <button
                                type="button"
                                className="studio-btn studio-btn-secondary"
                                onClick={handlePushArticles}
                                disabled={isAnySyncing}
                            >
                                📤 Push Articles to Sheet
                            </button>
                        </div>
                    </div>
                </div>

                {/* STATION 2: CREDIT CARDS */}
                <div className="gsheet-sync-station-card">
                    <div className="station-header">
                        <div className="station-title-group">
                            <span className="station-icon">💳</span>
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
                            Manage and publish your credit card catalog, partner application links, joining & annual fees, benefits, and category filters directly from Google Sheets.
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
                                📥 Pull Cards from Sheet
                            </button>
                            <button
                                type="button"
                                className="studio-btn studio-btn-secondary"
                                onClick={handlePushCards}
                                disabled={isAnySyncing}
                            >
                                📤 Push Cards to Sheet
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. GOOGLE APPS SCRIPT READY-TO-USE CODE & GUIDE */}
            <div className="gsheet-guide-card">
                <div className="guide-header">
                    <div className="guide-title">
                        <h3>🛠️ Google Apps Script Backend Code (`Code.gs`)</h3>
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
                            {copiedScript ? '✅ Copied to Clipboard!' : '📋 Copy Script Code'}
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
        </div>
    );
};

export default GoogleSheetsHubSection;
