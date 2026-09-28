import React, { useState } from 'react';

const APPS_SCRIPT_SOURCE = `// ============================================================================
// BEEFUND LIVE SYNC WEB APP SCRIPT (Google Sheets Backend)
// ============================================================================
// Required Tabs in your Google Sheet:
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

  return respondJSON({ success: true, message: 'Action processed successfully' });
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

const GoogleSheetsSetupGuideModal = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'code' | 'columns'

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(APPS_SCRIPT_SOURCE).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        });
    };

    return (
        <div className="studio-confirm-overlay" onClick={onClose} style={{ zIndex: 1200 }}>
            <div 
                className="studio-sheet-modal-card setup-guide-modal-card" 
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: '820px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
            >
                {/* Header */}
                <div className="studio-sheet-header">
                    <div className="studio-sheet-header-title">
                        <div className="sheet-logo-badge">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="3" y1="9" x2="21" y2="9"></line>
                                <line x1="3" y1="15" x2="21" y2="15"></line>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                                <line x1="15" y1="3" x2="15" y2="21"></line>
                            </svg>
                        </div>
                        <div>
                            <h3>Google Sheets Live Sync Setup Guide</h3>
                            <p>Complete instructions to set up or replicate live synchronization on any Google Sheet</p>
                        </div>
                    </div>
                    <button type="button" className="studio-modal-close" onClick={onClose}>&times;</button>
                </div>

                {/* Sub-nav tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.5rem', borderBottom: '1px solid var(--suite-border, rgba(255,255,255,0.08))', background: 'rgba(0,0,0,0.03)' }}>
                    <button
                        type="button"
                        className={`studio-btn ${activeTab === 'steps' ? 'studio-btn-primary' : 'studio-btn-secondary'}`}
                        onClick={() => setActiveTab('steps')}
                        style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                    >
                        Setup Steps
                    </button>
                    <button
                        type="button"
                        className={`studio-btn ${activeTab === 'code' ? 'studio-btn-primary' : 'studio-btn-secondary'}`}
                        onClick={() => setActiveTab('code')}
                        style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                    >
                        Apps Script Code
                    </button>
                    <button
                        type="button"
                        className={`studio-btn ${activeTab === 'columns' ? 'studio-btn-primary' : 'studio-btn-secondary'}`}
                        onClick={() => setActiveTab('columns')}
                        style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                    >
                        Required Columns & Tabs
                    </button>
                </div>

                {/* Body */}
                <div className="studio-sheet-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Notice */}
                    <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '8px', padding: '0.85rem 1rem', fontSize: '0.84rem', color: 'var(--suite-text, #cbd5e1)', lineHeight: 1.5 }}>
                        <strong>Replication Notice:</strong> You can follow this exact guide anytime you want to connect a new or existing Google Sheet. Once connected, remember to check the <strong>Lock Google Sheet</strong> checkbox to safeguard your URL against accidental modifications or disconnections.
                    </div>

                    {/* TAB 1: STEPS */}
                    {activeTab === 'steps' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem' }}>
                                <div style={{ minWidth: '30px', height: '30px', borderRadius: '50%', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>1</div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Create Your Google Sheet</h4>
                                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                                        Open <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>sheets.new</a> or your existing Google Sheet. Create two tabs named exactly: <code>Articles</code> and <code>CreditCards</code>.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem' }}>
                                <div style={{ minWidth: '30px', height: '30px', borderRadius: '50%', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>2</div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Open the Apps Script Editor</h4>
                                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                                        In the Google Sheets top menu bar, click <strong>Extensions &gt; Apps Script</strong>. Replace the contents of <code>Code.gs</code> with the code in the <strong>Apps Script Code</strong> tab.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem' }}>
                                <div style={{ minWidth: '30px', height: '30px', borderRadius: '50%', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>3</div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Deploy as Web App</h4>
                                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                                        Click <strong>Deploy &gt; New deployment</strong>. Select type <strong>Web app</strong>. Configure:
                                    </p>
                                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.25rem', fontSize: '0.82rem', color: '#cbd5e1' }}>
                                        <li><strong>Execute as:</strong> Me (your Google account)</li>
                                        <li><strong>Who has access:</strong> Anyone (critical so BeeFund can read/write data)</li>
                                    </ul>
                                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                                        Click Deploy, grant Google permissions, and copy the resulting <strong>Web App URL</strong> (ends in <code>/exec</code>).
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '1rem' }}>
                                <div style={{ minWidth: '30px', height: '30px', borderRadius: '50%', background: '#d97706', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>4</div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>Paste, Sync & Lock</h4>
                                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                                        Paste the URL into the input field in the live sync dialog. Click <strong>Save & Pull</strong> (or Push). Once connected, check the <strong>Lock Google Sheet</strong> checkbox to lock the URL.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: CODE */}
                    {activeTab === 'code' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.84rem', color: '#94a3b8' }}>Copy this code into your Google Sheet's <code>Code.gs</code> file:</span>
                                <button
                                    type="button"
                                    className="studio-btn studio-btn-primary"
                                    onClick={handleCopy}
                                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.9rem' }}
                                >
                                    {copied ? 'Copied to Clipboard!' : 'Copy Script Code'}
                                </button>
                            </div>
                            <pre style={{ margin: 0, background: '#090d16', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '1rem', fontSize: '0.8rem', lineHeight: 1.5, color: '#e2e8f0', maxHeight: '360px', overflowY: 'auto', fontFamily: 'monospace' }}>
                                <code>{APPS_SCRIPT_SOURCE}</code>
                            </pre>
                        </div>
                    )}

                    {/* TAB 3: COLUMNS */}
                    {activeTab === 'columns' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>Tab 1: "Articles"</h4>
                                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Row 1 must contain these exact column headers:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {['id', 'title', 'slug', 'author', 'date', 'category', 'excerpt', 'content', 'status'].map(col => (
                                        <span key={col} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.78rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                                            {col}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>Tab 2: "CreditCards"</h4>
                                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 0.5rem 0' }}>Row 1 must contain these exact column headers:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {['id', 'name', 'bank', 'category', 'badge', 'joiningFee', 'annualFee', 'rating', 'applyUrl', 'tagline', 'description', 'benefits', 'status'].map(col => (
                                        <span key={col} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.78rem', fontFamily: 'monospace', color: '#cbd5e1' }}>
                                            {col}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                                <em>Tip:</em> You don't need to manually type these headers if you use the <strong>Push Articles to Sheet</strong> or <strong>Push Cards to Sheet</strong> buttons—BeeFund will automatically create the tabs and write the header row for you!
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--suite-border, rgba(255,255,255,0.08))', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button type="button" className="studio-btn studio-btn-primary" onClick={onClose}>
                        Close Guide
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoogleSheetsSetupGuideModal;
