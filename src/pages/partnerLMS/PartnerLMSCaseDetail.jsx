import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePartnerLMS } from './PartnerLMSAuthContext';
import PartnerThemeToggle from './components/PartnerThemeToggle';
import './PartnerLMSCaseDetail.css';

const PartnerLMSCaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getCaseById, deductWallet, walletBalance, updateCase, partnerProfile } = usePartnerLMS();

    const caseData = getCaseById(id);

    // Left Sidebar Navigation state
    const [activeTab, setActiveTab] = useState('intelligence'); // intelligence | financials | scorecard | dossier | promoters | security
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Credit Intelligence API States
    const [cibilState, setCibilState] = useState({
        run: !!caseData?.cibilScore,
        score: caseData?.cibilScore || 758,
        loading: false
    });
    const [bsaState, setBsaState] = useState({
        run: true,
        loading: false,
        selectedAccounts: [1, 2]
    });
    const [gstState, setGstState] = useState({
        run: true,
        loading: false,
        turnover: '₹32.49 Cr'
    });
    const [exportNotice, setExportNotice] = useState('');
    const [intelSubTab, setIntelSubTab] = useState('all'); // 'all' | 'bureau' | 'bsa' | 'gst' | 'ratios'

    if (!caseData) {
        return (
            <div className="lms-case-notfound">
                <div className="notfound-card">
                    <div className="notfound-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h2>Credit Case #{id} Not Found</h2>
                    <p>The requested borrower proposal record could not be located in your LMS portfolio.</p>
                    <Link to="/partnerLMS/dashboard" className="btn-lms-primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        <span>Return to Case Dashboard</span>
                    </Link>
                </div>
            </div>
        );
    }

    // Handlers for running intelligence APIs with wallet deduction
    const handleRunCIBIL = () => {
        const cost = 50;
        const res = deductWallet(cost, `CIBIL CIR Bureau Pull - Case #${caseData.id} (${caseData.enterpriseName})`);
        if (!res.success) {
            alert(res.message);
            return;
        }
        setCibilState(prev => ({ ...prev, loading: true }));
        setTimeout(() => {
            setCibilState({ run: true, score: 758, loading: false });
            updateCase(caseData.id, { cibilScore: 758 });
            setExportNotice('✓ TransUnion CIBIL Bureau refreshed successfully (₹50 deducted).');
            setTimeout(() => setExportNotice(''), 4000);
        }, 800);
    };

    const handleRunBSA = () => {
        const cost = bsaState.selectedAccounts.length * 45;
        const res = deductWallet(cost, `BSA Multi-Account Parsing (${bsaState.selectedAccounts.length} A/Cs, 12M) - Case #${caseData.id}`);
        if (!res.success) {
            alert(res.message);
            return;
        }
        setBsaState(prev => ({ ...prev, loading: true }));
        setTimeout(() => {
            setBsaState(prev => ({ ...prev, run: true, loading: false }));
            setExportNotice(`✓ BSA Cash Flow Re-parsed for ${bsaState.selectedAccounts.length} accounts (₹${cost} deducted).`);
            setTimeout(() => setExportNotice(''), 4000);
        }, 1000);
    };

    const handleRunGST = () => {
        const cost = 40;
        const res = deductWallet(cost, `GST Turnover & ITC Reconciliation (12M) - Case #${caseData.id}`);
        if (!res.success) {
            alert(res.message);
            return;
        }
        setGstState(prev => ({ ...prev, loading: true }));
        setTimeout(() => {
            setGstState(prev => ({ ...prev, run: true, loading: false }));
            setExportNotice('✓ GSTR-3B & GSTR-1 Turnover reconciled with 100% tax match (₹40 deducted).');
            setTimeout(() => setExportNotice(''), 4000);
        }, 700);
    };

    const handleExportPDF = () => {
        setExportNotice('Generating Institutional Bank Proposal Dossier PDF...');
        setTimeout(() => {
            setExportNotice('✓ Dossier exported successfully: ' + (caseData.enterpriseName || 'Credit_Case').replace(/\s+/g, '_') + '_Credit_Proposal.pdf');
            setTimeout(() => setExportNotice(''), 4500);
        }, 1200);
    };

    const handleExportExcel = () => {
        setExportNotice('Exporting Multi-Sheet Financial Model Workbook (.xlsx)...');
        setTimeout(() => {
            setExportNotice('✓ Financial model exported: ' + (caseData.enterpriseName || 'Credit_Case').replace(/\s+/g, '_') + '_Financial_Model.xlsx');
            setTimeout(() => setExportNotice(''), 4500);
        }, 1000);
    };

    // Nav items definition for Left Sidebar
    const navItems = [
        {
            id: 'intelligence',
            title: 'Credit Intelligence Hub',
            subtitle: 'CIBIL, BSA, GST & Ratios',
            badge: 'Active (3 APIs)',
            badgeType: 'success',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
            )
        },
        {
            id: 'financials',
            title: 'Project Cost & Means',
            subtitle: 'Capex & Financing Sizing',
            badge: caseData.projectCostFormatted || '₹36.00 Cr',
            badgeType: 'gold',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
            )
        },
        {
            id: 'scorecard',
            title: '0–100 Risk Scorecard',
            subtitle: 'Multi-Pillar Bankability',
            badge: `${caseData.scorecard || 88}/100 Tier-1`,
            badgeType: 'emerald',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
            )
        },
        {
            id: 'dossier',
            title: 'Proposal Dossier & Export',
            subtitle: 'PDF, CMA XLSX & Checklist',
            badge: 'Ready',
            badgeType: 'blue',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            )
        },
        {
            id: 'promoters',
            title: 'Promoters & Governance',
            subtitle: 'Shareholding & Net Worth',
            badge: 'Verified',
            badgeType: 'neutral',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            )
        },
        {
            id: 'security',
            title: 'Security & Collateral',
            subtitle: 'Hypothecation & Mortgage',
            badge: '1st Charge',
            badgeType: 'purple',
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
            )
        }
    ];

    return (
        <div className="case-detail-root">
            {/* Top Bar Header */}
            <header className="case-detail-top">
                <div className="case-detail-top-inner">
                    <div className="case-header-left">
                        <div className="header-nav-actions">
                            <button
                                type="button"
                                className="btn-toggle-sidebar"
                                onClick={() => setIsSidebarCollapsed(prev => !prev)}
                                title={isSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
                                aria-label="Toggle Navigation Sidebar"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                                <span className="toggle-sidebar-text">{isSidebarCollapsed ? 'Expand Menu' : 'Menu'}</span>
                            </button>
                            <Link to="/partnerLMS/dashboard" className="back-link-btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                                <span>Dashboard</span>
                            </Link>
                        </div>
                        <div className="case-header-titles">
                            <div className="title-row">
                                <h1>{caseData.enterpriseName}</h1>
                                <span className="case-category-pill">{caseData.loanType || 'Project Loan'}</span>
                            </div>
                            <div className="case-ack-chips">
                                <span>App ID: <strong>{caseData.id}</strong></span>
                                <span>Ack: <strong>{caseData.ackNo}</strong></span>
                                <span>PAN: <strong>{caseData.pan}</strong></span>
                                <span>{caseData.constitution}</span>
                            </div>
                        </div>
                    </div>

                    <div className="case-header-right">
                        <div className="loan-stat-box">
                            <span className="lbl">Requested Loan</span>
                            <span className="val-cyan">{caseData.loanAmountFormatted}</span>
                        </div>
                        <div className="loan-stat-box">
                            <span className="lbl">Total Project Cost</span>
                            <span className="val-gold">{caseData.projectCostFormatted}</span>
                        </div>
                        <div className="case-status-chip status-sanctioned">
                            <span className="status-dot"></span>
                            <span>{caseData.status || 'Sanction Proposal Ready'}</span>
                        </div>
                        <PartnerThemeToggle />
                    </div>
                </div>
            </header>

            {/* Workflow Progress Bar */}
            <div className="case-progress-strip">
                <div className="progress-strip-container">
                    <div className="progress-step-item done">
                        <span className="step-badge">1</span>
                        <span>Data Verified</span>
                    </div>
                    <span className="step-arrow">→</span>
                    <div className="progress-step-item done">
                        <span className="step-badge">2</span>
                        <span>CIBIL 758</span>
                    </div>
                    <span className="step-arrow">→</span>
                    <div className="progress-step-item done">
                        <span className="step-badge">3</span>
                        <span>BSA Parsed</span>
                    </div>
                    <span className="step-arrow">→</span>
                    <div className="progress-step-item done">
                        <span className="step-badge">4</span>
                        <span>GST Matched</span>
                    </div>
                    <span className="step-arrow">→</span>
                    <div className="progress-step-item done">
                        <span className="step-badge">5</span>
                        <span>Score: 88/100</span>
                    </div>
                    <span className="step-arrow">→</span>
                    <div className="progress-step-item active">
                        <span className="step-badge">6</span>
                        <span>Sanction Ready</span>
                    </div>
                </div>
            </div>

            {/* Notification Banner */}
            {exportNotice && (
                <div className="export-alert-banner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 14 14"></polyline>
                    </svg>
                    <span>{exportNotice}</span>
                </div>
            )}

            {/* Main Application Shell: Left Sidebar + Content Canvas */}
            <div className={`case-app-shell ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {/* Collapsible Left Sidebar */}
                <aside className="case-sidebar-panel">
                    <div className="sidebar-brand-box">
                        <div className="sidebar-box-top">
                            <span className="sidebar-box-label">PORTFOLIO CASE</span>
                            <span className="sidebar-box-rating">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                                88/100
                            </span>
                        </div>
                        <div className="sidebar-target-bank">
                            <span className="target-bank-lbl">Target Lender:</span>
                            <strong>{caseData.targetLender || 'State Bank of India (MSME Desk)'}</strong>
                        </div>
                    </div>

                    <div className="sidebar-menu-section-header">
                        <span>NAVIGATION MODULES</span>
                    </div>

                    <nav className="case-sidebar-nav">
                        {navItems.map(item => {
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`case-sidebar-item ${isActive ? 'active' : ''}`}
                                    onClick={() => setActiveTab(item.id)}
                                    title={item.title}
                                >
                                    <div className="sidebar-item-icon">
                                        {item.icon}
                                    </div>
                                    <div className="sidebar-item-content">
                                        <div className="item-title-row">
                                            <span className="item-title">{item.title}</span>
                                            {item.badge && (
                                                <span className={`item-badge badge-${item.badgeType}`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <span className="item-subtitle">{item.subtitle}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="sidebar-bottom-actions">
                        <div className="facilitator-mini-card">
                            <div className="fac-icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <div className="fac-info">
                                <span className="fac-name">{partnerProfile?.name || 'Authorized Channel Partner'}</span>
                                <span className="fac-id">ID: {partnerProfile?.facilitatorId || '10492'}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleExportPDF}
                            className="btn-sidebar-quick-export"
                            title="Generate and Download Proposal PDF"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            <span>Quick Export Dossier</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="case-content-area">
                    {/* ========================================================================= */}
                    {/* TAB 1: CREDIT INTELLIGENCE & BUREAU PANELS                                */}
                    {/* ========================================================================= */}
                    {activeTab === 'intelligence' && (
                        <div className="tab-pane-content">
                            {/* Intelligence KPI Summary Banner */}
                            <div className="intel-hero-banner">
                                <div className="intel-kpi-card">
                                    <div className="kpi-icon icon-blue">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                    </div>
                                    <div className="kpi-meta">
                                        <span className="kpi-label">TransUnion CIBIL CIR</span>
                                        <div className="kpi-value-row">
                                            <span className="kpi-val text-green">{cibilState.score}</span>
                                            <span className="kpi-sub-pill text-green">Tier-1 Excellent</span>
                                        </div>
                                        <span className="kpi-note">36M DPD Track: Clean (000)</span>
                                    </div>
                                </div>

                                <div className="intel-kpi-card">
                                    <div className="kpi-icon icon-gold">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                                            <line x1="1" y1="10" x2="23" y2="10"></line>
                                        </svg>
                                    </div>
                                    <div className="kpi-meta">
                                        <span className="kpi-label">12M Banking ABB</span>
                                        <div className="kpi-value-row">
                                            <span className="kpi-val text-gold">₹116.70 L</span>
                                            <span className="kpi-sub-pill">2 Current A/Cs</span>
                                        </div>
                                        <span className="kpi-note">0 Inward / ECS Bounces</span>
                                    </div>
                                </div>

                                <div className="intel-kpi-card">
                                    <div className="kpi-icon icon-purple">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                        </svg>
                                    </div>
                                    <div className="kpi-meta">
                                        <span className="kpi-label">GST Turnover (12M)</span>
                                        <div className="kpi-value-row">
                                            <span className="kpi-val text-cyan">₹32.49 Cr</span>
                                            <span className="kpi-sub-pill text-green">100% Match</span>
                                        </div>
                                        <span className="kpi-note">12/12 GSTR-3B Filed on Time</span>
                                    </div>
                                </div>

                                <div className="intel-kpi-card">
                                    <div className="kpi-icon icon-emerald">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                    </div>
                                    <div className="kpi-meta">
                                        <span className="kpi-label">Projected DSCR</span>
                                        <div className="kpi-value-row">
                                            <span className="kpi-val text-green">2.05x</span>
                                            <span className="kpi-sub-pill text-green">Safe Margin</span>
                                        </div>
                                        <span className="kpi-note">Min Lender Hurdle: 1.35x</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section Header & Sub-filter */}
                            <div className="intel-section-header-bar">
                                <div className="header-info">
                                    <h3>Comprehensive Credit Intelligence Underwriting</h3>
                                    <p>Institutional API verification data synthesized across credit bureaus, banking statements, and GSTN tax filings.</p>
                                </div>
                                <div className="intel-filter-tabs">
                                    <button
                                        type="button"
                                        className={`intel-tab-btn ${intelSubTab === 'all' ? 'active' : ''}`}
                                        onClick={() => setIntelSubTab('all')}
                                    >
                                        All Modules
                                    </button>
                                    <button
                                        type="button"
                                        className={`intel-tab-btn ${intelSubTab === 'bureau' ? 'active' : ''}`}
                                        onClick={() => setIntelSubTab('bureau')}
                                    >
                                        CIBIL CIR
                                    </button>
                                    <button
                                        type="button"
                                        className={`intel-tab-btn ${intelSubTab === 'bsa' ? 'active' : ''}`}
                                        onClick={() => setIntelSubTab('bsa')}
                                    >
                                        Bank Analyzer (BSA)
                                    </button>
                                    <button
                                        type="button"
                                        className={`intel-tab-btn ${intelSubTab === 'gst' ? 'active' : ''}`}
                                        onClick={() => setIntelSubTab('gst')}
                                    >
                                        GST Reconciliation
                                    </button>
                                    <button
                                        type="button"
                                        className={`intel-tab-btn ${intelSubTab === 'ratios' ? 'active' : ''}`}
                                        onClick={() => setIntelSubTab('ratios')}
                                    >
                                        Financial Ratios
                                    </button>
                                </div>
                            </div>

                            {/* Intelligence Detail Cards Grid */}
                            <div className="intel-cards-grid">
                                {/* CARD 1: CIBIL Bureau Deep Dive */}
                                {(intelSubTab === 'all' || intelSubTab === 'bureau') && (
                                    <div className="intel-card intel-card-cibil">
                                        <div className="intel-card-header">
                                            <div className="intel-title-group">
                                                <span className="api-icon-pill icon-blue">CIBIL</span>
                                                <div>
                                                    <h4>TransUnion Commercial / Promoters CIR Bureau</h4>
                                                    <span className="intel-subtitle">Institutional Credit Record (Score & DPD Track)</span>
                                                </div>
                                            </div>
                                            <div className="intel-header-actions">
                                                <span className="cost-tag">₹50 / Pull</span>
                                                <button
                                                    type="button"
                                                    onClick={handleRunCIBIL}
                                                    className="btn-refresh-api"
                                                    disabled={cibilState.loading}
                                                    title="Refresh Bureau CIR"
                                                >
                                                    {cibilState.loading ? 'Pulling...' : 'Re-Pull Bureau'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="intel-body">
                                            <div className="cibil-overview-row">
                                                <div className="cibil-gauge-center">
                                                    <span className="cibil-score-val">{cibilState.score}</span>
                                                    <span className="cibil-score-label">EXCELLENT (750+ PRIME)</span>
                                                    <span className="cibil-score-note">Scored out of 900</span>
                                                </div>
                                                <div className="cibil-quick-stats">
                                                    <div className="quick-stat-box">
                                                        <span className="stat-label">Active Trade Lines</span>
                                                        <span className="stat-value">4 Accounts</span>
                                                    </div>
                                                    <div className="quick-stat-box">
                                                        <span className="stat-label">Total Current Overdue</span>
                                                        <span className="stat-value text-green">₹0.00 (Zero)</span>
                                                    </div>
                                                    <div className="quick-stat-box">
                                                        <span className="stat-label">Enquiries (Last 6M)</span>
                                                        <span className="stat-value">1 Enquiry</span>
                                                    </div>
                                                    <div className="quick-stat-box">
                                                        <span className="stat-label">Suit-Filed / Defaulter</span>
                                                        <span className="stat-value text-green">Nil / Clean</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 36-Month DPD Grid */}
                                            <div className="dpd-track-container">
                                                <div className="dpd-header">
                                                    <span className="dpd-title">36-Month Days Past Due (DPD) Payment Discipline Matrix</span>
                                                    <span className="dpd-legend"><span className="legend-dot green"></span> 000 = Regular On-Time Settlement</span>
                                                </div>
                                                <div className="dpd-grid-tiles">
                                                    {Array.from({ length: 36 }).map((_, i) => (
                                                        <div key={i} className="dpd-tile clean" title={`Month ${36 - i}: 000 DPD (No Delinquency)`}>
                                                            <span className="dpd-num">000</span>
                                                            <span className="dpd-m-label">M{36 - i}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Existing Facilities Table */}
                                            <div className="intel-table-wrap">
                                                <table className="intel-data-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Lender</th>
                                                            <th>Facility Type</th>
                                                            <th>Sanctioned</th>
                                                            <th>Outstanding</th>
                                                            <th>DPD Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><strong>Standard Chartered Bank</strong></td>
                                                            <td>Term Loan (Machinery)</td>
                                                            <td>₹180.00 L</td>
                                                            <td>₹112.40 L</td>
                                                            <td><span className="badge-tag-clean">000 Regular</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>State Bank of India</strong></td>
                                                            <td>Working Capital Cash Credit</td>
                                                            <td>₹120.00 L</td>
                                                            <td>₹50.80 L (42%)</td>
                                                            <td><span className="badge-tag-clean">000 Regular</span></td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>HDFC Bank Ltd</strong></td>
                                                            <td>Commercial Vehicle Loan</td>
                                                            <td>₹18.50 L</td>
                                                            <td>₹0.00 L</td>
                                                            <td><span className="badge-tag-closed">Closed (No Dues)</span></td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* CARD 2: Multi-Bank Statement Analysis (BSA) */}
                                {(intelSubTab === 'all' || intelSubTab === 'bsa') && (
                                    <div className="intel-card intel-card-bsa">
                                        <div className="intel-card-header">
                                            <div className="intel-title-group">
                                                <span className="api-icon-pill icon-gold">BSA</span>
                                                <div>
                                                    <h4>Multi-Bank Statement Analysis (12 Months)</h4>
                                                    <span className="intel-subtitle">Current Account Cash Flow Velocity & Repayment Capacity</span>
                                                </div>
                                            </div>
                                            <div className="intel-header-actions">
                                                <span className="cost-tag">₹45 / Account</span>
                                                <button
                                                    type="button"
                                                    onClick={handleRunBSA}
                                                    className="btn-refresh-api"
                                                    disabled={bsaState.loading}
                                                >
                                                    {bsaState.loading ? 'Parsing...' : 'Re-Parse BSA'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="intel-body">
                                            <div className="bsa-key-metrics-grid">
                                                <div className="bsa-metric-tile">
                                                    <span className="lbl">Annual Banking Credits</span>
                                                    <strong className="val text-gold">₹3,184.20 Lakhs</strong>
                                                    <span className="sub">₹31.84 Cr / Annum</span>
                                                </div>
                                                <div className="bsa-metric-tile">
                                                    <span className="lbl">Combined 12M ABB</span>
                                                    <strong className="val text-green">₹116.70 Lakhs</strong>
                                                    <span className="sub">Consistent positive float</span>
                                                </div>
                                                <div className="bsa-metric-tile">
                                                    <span className="lbl">Cheque / ECS Returns</span>
                                                    <strong className="val text-green">0 Bounces</strong>
                                                    <span className="sub">100% Inward clearing</span>
                                                </div>
                                                <div className="bsa-metric-tile">
                                                    <span className="lbl">Existing Monthly EMIs</span>
                                                    <strong className="val">₹4.20 Lakhs / mo</strong>
                                                    <span className="sub">3 Facilities mapped</span>
                                                </div>
                                            </div>

                                            {/* Quarterly ABB Trend Breakdown */}
                                            <div className="abb-trend-section">
                                                <span className="trend-title">Quarterly Average Bank Balance (ABB) & Turnover Trend</span>
                                                <div className="abb-quarter-grid">
                                                    <div className="quarter-box">
                                                        <div className="q-label">Q1 (Apr–Jun)</div>
                                                        <div className="q-val">₹108.40 L ABB</div>
                                                        <div className="q-bar-wrap"><div className="q-bar" style={{ width: '78%' }}></div></div>
                                                        <span className="q-turnover">Credits: ₹742.8 L</span>
                                                    </div>
                                                    <div className="quarter-box">
                                                        <div className="q-label">Q2 (Jul–Sep)</div>
                                                        <div className="q-val">₹114.20 L ABB</div>
                                                        <div className="q-bar-wrap"><div className="q-bar" style={{ width: '84%' }}></div></div>
                                                        <span className="q-turnover">Credits: ₹798.5 L</span>
                                                    </div>
                                                    <div className="quarter-box">
                                                        <div className="q-label">Q3 (Oct–Dec)</div>
                                                        <div className="q-val">₹121.80 L ABB</div>
                                                        <div className="q-bar-wrap"><div className="q-bar" style={{ width: '92%' }}></div></div>
                                                        <span className="q-turnover">Credits: ₹815.1 L</span>
                                                    </div>
                                                    <div className="quarter-box">
                                                        <div className="q-label">Q4 (Jan–Mar)</div>
                                                        <div className="q-val">₹122.40 L ABB</div>
                                                        <div className="q-bar-wrap"><div className="q-bar" style={{ width: '94%' }}></div></div>
                                                        <span className="q-turnover">Credits: ₹827.8 L</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bank Accounts Analyzed */}
                                            <div className="accounts-list-wrap">
                                                <div className="acc-row">
                                                    <div className="acc-info">
                                                        <strong>State Bank of India — Noida MSME Branch</strong>
                                                        <span>Current A/C #...8821 • Primary Operational Account</span>
                                                    </div>
                                                    <div className="acc-stats">
                                                        <span>Credits: <strong>₹2,240.50 L</strong></span>
                                                        <span>ABB: <strong className="text-green">₹84.30 L</strong></span>
                                                    </div>
                                                </div>
                                                <div className="acc-row">
                                                    <div className="acc-info">
                                                        <strong>HDFC Bank Ltd — New Delhi Connaught Place</strong>
                                                        <span>Current A/C #...4109 • Collections & Capex Account</span>
                                                    </div>
                                                    <div className="acc-stats">
                                                        <span>Credits: <strong>₹943.70 L</strong></span>
                                                        <span>ABB: <strong className="text-green">₹32.40 L</strong></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* CARD 3: GST Turnover & ITC Reconciliation */}
                                {(intelSubTab === 'all' || intelSubTab === 'gst') && (
                                    <div className="intel-card intel-card-gst">
                                        <div className="intel-card-header">
                                            <div className="intel-title-group">
                                                <span className="api-icon-pill icon-purple">GST</span>
                                                <div>
                                                    <h4>GSTIN Turnover & ITC Reconciliation (12 Months)</h4>
                                                    <span className="intel-subtitle">GSTN 09ABNFA3331Q1Z8 • Tax Compliance Verification</span>
                                                </div>
                                            </div>
                                            <div className="intel-header-actions">
                                                <span className="cost-tag">₹40 / GSTIN</span>
                                                <button
                                                    type="button"
                                                    onClick={handleRunGST}
                                                    className="btn-refresh-api"
                                                    disabled={gstState.loading}
                                                >
                                                    {gstState.loading ? 'Verifying...' : 'Re-Check GSTN'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="intel-body">
                                            <div className="gst-stat-tiles">
                                                <div className="gst-tile">
                                                    <span className="lbl">Declared vs GSTR-3B Sales</span>
                                                    <strong className="val text-green">₹32.49 Cr (100% Match)</strong>
                                                    <span className="desc">Zero declared turnover inflation</span>
                                                </div>
                                                <div className="gst-tile">
                                                    <span className="lbl">GSTR-3B Return Regularity</span>
                                                    <strong className="val text-green">12 / 12 Months On-Time</strong>
                                                    <span className="desc">Zero late fees / arrears</span>
                                                </div>
                                                <div className="gst-tile">
                                                    <span className="lbl">Circular Trading Pattern</span>
                                                    <strong className="val text-green">Negative (Zero Risk)</strong>
                                                    <span className="desc">Legitimate B2B supply chain</span>
                                                </div>
                                                <div className="gst-tile">
                                                    <span className="lbl">ITC vs Output Tax Ratio</span>
                                                    <strong className="val">84.2% (Benchmark Normal)</strong>
                                                    <span className="desc">₹2.74 Cr Input Tax Credit</span>
                                                </div>
                                            </div>

                                            {/* Top Customer / Buyer Concentration */}
                                            <div className="gst-concentration-box">
                                                <span className="box-title">Buyer Concentration Risk Assessment</span>
                                                <div className="concentration-bars">
                                                    <div className="conc-row">
                                                        <span className="conc-name">Top 1 Buyer (Automotive Component Tier-1)</span>
                                                        <div className="conc-track"><div className="conc-fill" style={{ width: '14.2%' }}></div></div>
                                                        <span className="conc-pct">14.2%</span>
                                                    </div>
                                                    <div className="conc-row">
                                                        <span className="conc-name">Top 2–5 Buyers (Diversified MSME & FMCG Packagers)</span>
                                                        <div className="conc-track"><div className="conc-fill" style={{ width: '31.8%' }}></div></div>
                                                        <span className="conc-pct">31.8%</span>
                                                    </div>
                                                    <div className="conc-row">
                                                        <span className="conc-name">Remaining 40+ Direct B2B Accounts</span>
                                                        <div className="conc-track"><div className="conc-fill" style={{ width: '54.0%' }}></div></div>
                                                        <span className="conc-pct">54.0%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* CARD 4: Institutional Financial Ratios & DSCR */}
                                {(intelSubTab === 'all' || intelSubTab === 'ratios') && (
                                    <div className="intel-card intel-card-ratios">
                                        <div className="intel-card-header">
                                            <div className="intel-title-group">
                                                <span className="api-icon-pill icon-emerald">RATIOS</span>
                                                <div>
                                                    <h4>Key Institutional Underwriting Ratios & DSCR Sizing</h4>
                                                    <span className="intel-subtitle">Debt Servicing Capacity & Balance Sheet Health</span>
                                                </div>
                                            </div>
                                            <span className="ratio-verdict-badge">All 6 Benchmarks Passed</span>
                                        </div>

                                        <div className="intel-body">
                                            <div className="ratios-grid">
                                                <div className="ratio-item-card passed">
                                                    <div className="ratio-top">
                                                        <span className="ratio-code">DSCR</span>
                                                        <span className="ratio-badge pass">PASS</span>
                                                    </div>
                                                    <span className="ratio-name">Debt Service Coverage Ratio</span>
                                                    <div className="ratio-number text-green">2.05x</div>
                                                    <span className="ratio-benchmark">Bank Benchmark: &gt; 1.35x</span>
                                                </div>

                                                <div className="ratio-item-card passed">
                                                    <div className="ratio-top">
                                                        <span className="ratio-code">ISCR</span>
                                                        <span className="ratio-badge pass">PASS</span>
                                                    </div>
                                                    <span className="ratio-name">Interest Service Coverage</span>
                                                    <div className="ratio-number text-green">3.42x</div>
                                                    <span className="ratio-benchmark">Bank Benchmark: &gt; 2.00x</span>
                                                </div>

                                                <div className="ratio-item-card passed">
                                                    <div className="ratio-top">
                                                        <span className="ratio-code">CR</span>
                                                        <span className="ratio-badge pass">PASS</span>
                                                    </div>
                                                    <span className="ratio-name">Current Ratio</span>
                                                    <div className="ratio-number text-green">1.48x</div>
                                                    <span className="ratio-benchmark">Bank Benchmark: &gt; 1.33x</span>
                                                </div>

                                                <div className="ratio-item-card passed">
                                                    <div className="ratio-top">
                                                        <span className="ratio-code">TOL/TNW</span>
                                                        <span className="ratio-badge pass">PASS</span>
                                                    </div>
                                                    <span className="ratio-name">Total Outside Liabilities / Net Worth</span>
                                                    <div className="ratio-number text-green">1.82x</div>
                                                    <span className="ratio-benchmark">Bank Benchmark: &lt; 3.00x</span>
                                                </div>

                                                <div className="ratio-item-card passed">
                                                    <div className="ratio-top">
                                                        <span className="ratio-code">EBITDA</span>
                                                        <span className="ratio-badge pass">PASS</span>
                                                    </div>
                                                    <span className="ratio-name">Operating Profit Margin</span>
                                                    <div className="ratio-number text-green">14.6%</div>
                                                    <span className="ratio-benchmark">Industry Avg: 11.5% - 13.0%</span>
                                                </div>

                                                <div className="ratio-item-card passed">
                                                    <div className="ratio-top">
                                                        <span className="ratio-code">WCC</span>
                                                        <span className="ratio-badge pass">PASS</span>
                                                    </div>
                                                    <span className="ratio-name">Working Capital Cycle</span>
                                                    <div className="ratio-number text-green">58 Days</div>
                                                    <span className="ratio-benchmark">Debtors 42d • Inv 34d • Cred 18d</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 2: FINANCIALS & PROJECT COST                                          */}
                    {/* ========================================================================= */}
                    {activeTab === 'financials' && (
                        <div className="tab-pane-content">
                            <div className="financials-tab-grid">
                                <div className="finance-section-card">
                                    <div className="card-header-flex">
                                        <div>
                                            <h3>Project Cost Sizing ({caseData.projectCostFormatted || '₹36.00 Cr'})</h3>
                                            <p className="card-sub">Granular Capex schedule and execution outlays</p>
                                        </div>
                                        <span className="cost-total-badge">{caseData.projectCostFormatted || '₹36.00 Cr'}</span>
                                    </div>

                                    <div className="table-responsive-wrap">
                                        <table className="mini-data-table">
                                            <thead>
                                                <tr>
                                                    <th>Particulars</th>
                                                    <th>Incurred</th>
                                                    <th>To be Incurred</th>
                                                    <th>Total Outlay</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Land including Site Development & Boundary</td>
                                                    <td>₹600.00 L</td>
                                                    <td>₹0.00 L</td>
                                                    <td><strong>₹600.00 L</strong></td>
                                                </tr>
                                                <tr>
                                                    <td>Factory Building & Civil Infrastructure</td>
                                                    <td>₹200.00 L</td>
                                                    <td>₹800.00 L</td>
                                                    <td><strong>₹1,000.00 L</strong></td>
                                                </tr>
                                                <tr>
                                                    <td>Plant & Machinery (Indigenous Automated Lines)</td>
                                                    <td>₹100.00 L</td>
                                                    <td>₹1,900.00 L</td>
                                                    <td><strong>₹2,000.00 L</strong></td>
                                                </tr>
                                                <tr className="sub-line">
                                                    <td>Electrification, Utilities & Effluent Treatment (ETP)</td>
                                                    <td>₹0.00 L</td>
                                                    <td>₹250.00 L</td>
                                                    <td><strong>₹250.00 L</strong></td>
                                                </tr>
                                                <tr className="sub-line">
                                                    <td>Margin Money for Working Capital (MMWC)</td>
                                                    <td>₹0.00 L</td>
                                                    <td>₹150.00 L</td>
                                                    <td><strong>₹150.00 L</strong></td>
                                                </tr>
                                                <tr className="total-highlight">
                                                    <td><strong>TOTAL PROJECT COST</strong></td>
                                                    <td><strong>₹900.00 L</strong></td>
                                                    <td><strong>₹3,100.00 L</strong></td>
                                                    <td><strong className="text-gold">₹4,000.00 L ({caseData.projectCostFormatted || '₹40.00 Cr'})</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="finance-section-card">
                                    <div className="card-header-flex">
                                        <div>
                                            <h3>Means of Finance Structure</h3>
                                            <p className="card-sub">Debt vs Equity financing structure (Promoter Margin & Debt)</p>
                                        </div>
                                        <span className="cost-total-badge">Debt-Equity 2.33:1</span>
                                    </div>

                                    <div className="table-responsive-wrap">
                                        <table className="mini-data-table">
                                            <thead>
                                                <tr>
                                                    <th>Funding Source</th>
                                                    <th>Raised / Infused</th>
                                                    <th>Proposed</th>
                                                    <th>Total Commitment</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Promoter / Partners Capital (Equity)</td>
                                                    <td>₹600.00 L</td>
                                                    <td>₹400.00 L</td>
                                                    <td><strong>₹1,000.00 L</strong></td>
                                                </tr>
                                                <tr>
                                                    <td>Unsecured Loans (Subordinated to Bank Term Loan)</td>
                                                    <td>₹300.00 L</td>
                                                    <td>₹100.00 L</td>
                                                    <td><strong>₹400.00 L</strong></td>
                                                </tr>
                                                <tr>
                                                    <td>Term Loan from Commercial Bank / Lender Desk</td>
                                                    <td>₹0.00 L</td>
                                                    <td>₹{(caseData.loanAmountLakhs || 375).toFixed(2)} L</td>
                                                    <td><strong>₹{(caseData.loanAmountLakhs || 375).toFixed(2)} L</strong></td>
                                                </tr>
                                                <tr className="total-highlight">
                                                    <td><strong>TOTAL MEANS OF FINANCE</strong></td>
                                                    <td><strong>₹900.00 L</strong></td>
                                                    <td><strong>₹{(caseData.loanAmountLakhs || 375).toFixed(2)} L</strong></td>
                                                    <td><strong className="text-gold">₹{(caseData.projectCostLakhs || 500).toFixed(2)} L ({caseData.projectCostFormatted || '₹5.00 Cr'})</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 3: 0–100 RISK SCORECARD                                               */}
                    {/* ========================================================================= */}
                    {activeTab === 'scorecard' && (
                        <div className="tab-pane-content">
                            <div className="scorecard-tab-layout">
                                <div className="scorecard-hero-box">
                                    <div className="scorecard-number-circle">
                                        <span className="score-num">{caseData.scorecard || 88}</span>
                                        <span className="score-max">/ 100</span>
                                    </div>
                                    <div className="scorecard-verdict">
                                        <div className="verdict-tag">
                                            <span className="tag-dot"></span>
                                            <span>SANCTION RECOMMENDED • TIER-1 BANKABLE</span>
                                        </div>
                                        <h3>High-Quality Credit Profile with Low Default Probability</h3>
                                        <p>Strong promoter equity infusion, unblemished {caseData.cibilScore || 758} CIBIL score, zero cheque bounces over 12 months, and prime industrial asset hypothecation coverage.</p>
                                    </div>
                                </div>

                                <div className="score-pillars-list">
                                    <div className="pillar-header-row">
                                        <span className="col-name">UNDERWRITING PILLAR & VERIFICATION PARAMETER</span>
                                        <span className="col-score">ALLOCATED SCORE</span>
                                    </div>

                                    <div className="score-pillar-row">
                                        <div className="pillar-info">
                                            <div className="pillar-title-row">
                                                <span className="pillar-name">1. CIBIL Bureau & DPD Track (30% Weight)</span>
                                                <span className="pillar-tag-pass">100% Score</span>
                                            </div>
                                            <span className="pillar-desc">{caseData.cibilScore || 758} CIR score, zero past 36M delayed settlements, 0 written-off records.</span>
                                            <div className="pillar-bar-wrap"><div className="pillar-bar" style={{ width: '100%' }}></div></div>
                                        </div>
                                        <div className="pillar-score text-green">30 / 30 Pts</div>
                                    </div>

                                    <div className="score-pillar-row">
                                        <div className="pillar-info">
                                            <div className="pillar-title-row">
                                                <span className="pillar-name">2. Debt Service & FOIR Capacity (20% Weight)</span>
                                                <span className="pillar-tag-pass">100% Score</span>
                                            </div>
                                            <span className="pillar-desc">Projected DSCR of 2.05x under structured amortisation tenure (Benchmark: 1.35x).</span>
                                            <div className="pillar-bar-wrap"><div className="pillar-bar" style={{ width: '100%' }}></div></div>
                                        </div>
                                        <div className="pillar-score text-green">20 / 20 Pts</div>
                                    </div>

                                    <div className="score-pillar-row">
                                        <div className="pillar-info">
                                            <div className="pillar-title-row">
                                                <span className="pillar-name">3. Banking Cash Flow & Average Bank Balance (20% Weight)</span>
                                                <span className="pillar-tag-pass">90% Score</span>
                                            </div>
                                            <span className="pillar-desc">Combined ABB of ₹116.70 Lakhs, active trade credits, zero inward returns/bounces.</span>
                                            <div className="pillar-bar-wrap"><div className="pillar-bar" style={{ width: '90%' }}></div></div>
                                        </div>
                                        <div className="pillar-score text-green">18 / 20 Pts</div>
                                    </div>

                                    <div className="score-pillar-row">
                                        <div className="pillar-info">
                                            <div className="pillar-title-row">
                                                <span className="pillar-name">4. Declared vs GST / ITR Consistency (15% Weight)</span>
                                                <span className="pillar-tag-pass">100% Score</span>
                                            </div>
                                            <span className="pillar-desc">Declared sales matches ITR and GSTR-3B filings with 100.0% verified consistency.</span>
                                            <div className="pillar-bar-wrap"><div className="pillar-bar" style={{ width: '100%' }}></div></div>
                                        </div>
                                        <div className="pillar-score text-green">15 / 15 Pts</div>
                                    </div>

                                    <div className="score-pillar-row">
                                        <div className="pillar-info">
                                            <div className="pillar-title-row">
                                                <span className="pillar-name">5. Statutory Compliance & Corporate Governance (10% Weight)</span>
                                                <span className="pillar-tag-pass">100% Score</span>
                                            </div>
                                            <span className="pillar-desc">Zero disputed tax arrears, non-wilful defaulter status, clean MCA and legal filings.</span>
                                            <div className="pillar-bar-wrap"><div className="pillar-bar" style={{ width: '100%' }}></div></div>
                                        </div>
                                        <div className="pillar-score text-green">5 / 5 Pts</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 4: BANK PROPOSAL DOSSIER & EXPORTS                                    */}
                    {/* ========================================================================= */}
                    {activeTab === 'dossier' && (
                        <div className="tab-pane-content">
                            <div className="dossier-tab-layout">
                                <div className="dossier-export-actions">
                                    <div className="dossier-card">
                                        <div className="dossier-card-top">
                                            <div className="dossier-icon icon-gold">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4>Institutional Bank Proposal Dossier (PDF)</h4>
                                                <span className="dossier-pages-badge">10-Page Comprehensive Credit Proposal</span>
                                            </div>
                                        </div>
                                        <p>Comprehensive credit memorandum containing Enterprise Profile, Project Sizing, Means of Finance, Promoters Net Worth, Primary & Collateral Security 1st Charge, Financial Estimates, and Facilitator E-Signature.</p>
                                        <button type="button" onClick={handleExportPDF} className="btn-export-pdf">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="7 10 12 15 17 10"></polyline>
                                                <line x1="12" y1="15" x2="12" y2="3"></line>
                                            </svg>
                                            <span>Download Bank Proposal Dossier (.PDF)</span>
                                        </button>
                                    </div>

                                    <div className="dossier-card">
                                        <div className="dossier-card-top">
                                            <div className="dossier-icon icon-green">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                    <line x1="3" y1="9" x2="21" y2="9"></line>
                                                    <line x1="9" y1="21" x2="9" y2="9"></line>
                                                </svg>
                                            </div>
                                            <div>
                                                <h4>Granular CMA Financial Model (.XLSX)</h4>
                                                <span className="dossier-pages-badge green">Multi-Sheet Macro Workbook</span>
                                            </div>
                                        </div>
                                        <p>Multi-sheet CMA data including Balance Sheet projections (2027–2030), P&L Statements, DSCR schedules, Cash Flow projections, and Sensitivity Analysis ready for bank underwriting desks.</p>
                                        <button type="button" onClick={handleExportExcel} className="btn-export-excel">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                <polyline points="7 10 12 15 17 10"></polyline>
                                                <line x1="12" y1="15" x2="12" y2="3"></line>
                                            </svg>
                                            <span>Export Full CMA & Financial Model (.XLSX)</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Bank Document Checklist */}
                                <div className="bank-checklist-card">
                                    <h3>Bank Underwriting Document Checklist</h3>
                                    <div className="checklist-grid">
                                        <div className="check-item verified">
                                            <span className="check-icon">✓</span>
                                            <span>Udyam Registration Certificate (MSME Verified)</span>
                                        </div>
                                        <div className="check-item verified">
                                            <span className="check-icon">✓</span>
                                            <span>Last 3 Years Audited ITR & Balance Sheets</span>
                                        </div>
                                        <div className="check-item verified">
                                            <span className="check-icon">✓</span>
                                            <span>12-Month Bank Statements (SBI & HDFC)</span>
                                        </div>
                                        <div className="check-item verified">
                                            <span className="check-icon">✓</span>
                                            <span>GSTR-3B & GSTR-1 12-Month Reconciled Filings</span>
                                        </div>
                                        <div className="check-item verified">
                                            <span className="check-icon">✓</span>
                                            <span>Partnership Deed / Incorporation Documents</span>
                                        </div>
                                        <div className="check-item verified">
                                            <span className="check-icon">✓</span>
                                            <span>Industrial Land Title Deed & Approved Building Plan</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 5: PROMOTERS & GOVERNANCE                                              */}
                    {/* ========================================================================= */}
                    {activeTab === 'promoters' && (
                        <div className="tab-pane-content">
                            <div className="promoters-tab-layout">
                                <div className="promoter-card">
                                    <div className="promoter-header">
                                        <div className="promoter-avatar">
                                            <span>RK</span>
                                        </div>
                                        <div className="promoter-info">
                                            <h4>Rajesh Kumar Verma</h4>
                                            <span className="promoter-role">Managing Partner • 60.0% Shareholding</span>
                                        </div>
                                        <div className="promoter-cibil-badge">
                                            <span className="cibil-lbl">CIBIL CIR</span>
                                            <span className="cibil-val text-green">768</span>
                                        </div>
                                    </div>
                                    <div className="promoter-details-grid">
                                        <div className="p-item"><span className="lbl">PAN Number:</span><strong>AAEPK8812M</strong></div>
                                        <div className="p-item"><span className="lbl">Net Worth (CA Certified):</span><strong className="text-gold">₹8.40 Cr</strong></div>
                                        <div className="p-item"><span className="lbl">Industry Experience:</span><strong>18 Years in Precision Engineering</strong></div>
                                        <div className="p-item"><span className="lbl">DIN / DPIN:</span><strong>00291844</strong></div>
                                    </div>
                                </div>

                                <div className="promoter-card">
                                    <div className="promoter-header">
                                        <div className="promoter-avatar">
                                            <span>SK</span>
                                        </div>
                                        <div className="promoter-info">
                                            <h4>Suresh Kumar Verma</h4>
                                            <span className="promoter-role">Technical & Operations Partner • 40.0% Shareholding</span>
                                        </div>
                                        <div className="promoter-cibil-badge">
                                            <span className="cibil-lbl">CIBIL CIR</span>
                                            <span className="cibil-val text-green">752</span>
                                        </div>
                                    </div>
                                    <div className="promoter-details-grid">
                                        <div className="p-item"><span className="lbl">PAN Number:</span><strong>AAEPS9943P</strong></div>
                                        <div className="p-item"><span className="lbl">Net Worth (CA Certified):</span><strong className="text-gold">₹5.20 Cr</strong></div>
                                        <div className="p-item"><span className="lbl">Industry Experience:</span><strong>14 Years in Polymer Injection Lines</strong></div>
                                        <div className="p-item"><span className="lbl">DIN / DPIN:</span><strong>00384910</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========================================================================= */}
                    {/* TAB 6: SECURITY & COLLATERAL                                              */}
                    {/* ========================================================================= */}
                    {activeTab === 'security' && (
                        <div className="tab-pane-content">
                            <div className="security-tab-layout">
                                <div className="security-card">
                                    <div className="sec-header">
                                        <span className="sec-type-badge primary">PRIMARY SECURITY</span>
                                        <h4>Hypothecation of Plant, Machinery & Current Assets</h4>
                                    </div>
                                    <p>First Exclusive Charge by way of hypothecation over entire Indigenous and Imported Plant & Machinery, ETP Utilities, and Current Assets (Stocks, Raw Materials, Work-in-Progress, Book Debts).</p>
                                    <div className="sec-value-row">
                                        <span>Estimated Hypothecated Asset Value:</span>
                                        <strong className="text-gold">₹28.50 Cr</strong>
                                    </div>
                                </div>

                                <div className="security-card">
                                    <div className="sec-header">
                                        <span className="sec-type-badge collateral">COLLATERAL SECURITY</span>
                                        <h4>Equitable Mortgage of Industrial Land & Factory Shed</h4>
                                    </div>
                                    <p>First Exclusive Charge by way of Equitable Mortgage over Industrial Plot #45, Ecotech Industrial Park, Greater Noida, UP (Land Area: 4,000 sq. meters + 28,000 sq. ft covered factory shed).</p>
                                    <div className="sec-value-row">
                                        <span>Approved Bank Valuation:</span>
                                        <strong className="text-gold">₹14.80 Cr</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PartnerLMSCaseDetail;
