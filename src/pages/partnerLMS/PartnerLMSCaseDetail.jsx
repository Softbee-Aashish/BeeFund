import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePartnerLMS } from './PartnerLMSAuthContext';
import './PartnerLMSCaseDetail.css';

const PartnerLMSCaseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getCaseById, deductWallet, walletBalance, updateCase, partnerProfile } = usePartnerLMS();

    const caseData = getCaseById(id);

    const [activeTab, setActiveTab] = useState('intelligence'); // intelligence | financials | scorecard | dossier
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

    if (!caseData) {
        return (
            <div className="lms-case-notfound">
                <h2>Credit Case ID #{id} Not Found</h2>
                <Link to="/partnerLMS/dashboard" className="btn-lms-primary">Return to Case Dashboard</Link>
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
        setCibilState({ ...cibilState, loading: true });
        setTimeout(() => {
            setCibilState({ run: true, score: 758, loading: false });
            updateCase(caseData.id, { cibilScore: 758 });
        }, 800);
    };

    const handleRunBSA = () => {
        const cost = bsaState.selectedAccounts.length * 45;
        const res = deductWallet(cost, `BSA Multi-Account Parsing (${bsaState.selectedAccounts.length} A/Cs, 12M) - Case #${caseData.id}`);
        if (!res.success) {
            alert(res.message);
            return;
        }
        setBsaState({ ...bsaState, loading: true });
        setTimeout(() => {
            setBsaState({ ...bsaState, run: true, loading: false });
        }, 1000);
    };

    const handleRunGST = () => {
        const cost = 40;
        const res = deductWallet(cost, `GST Turnover & ITC Reconciliation (12M) - Case #${caseData.id}`);
        if (!res.success) {
            alert(res.message);
            return;
        }
        setGstState({ ...gstState, loading: true });
        setTimeout(() => {
            setGstState({ ...gstState, run: true, loading: false });
        }, 700);
    };

    const handleExportPDF = () => {
        setExportNotice('Generating Institutional 14-Page SIDBI / Bank Proposal Dossier PDF...');
        setTimeout(() => {
            setExportNotice('✓ Dossier exported successfully: ' + caseData.enterpriseName.replace(/\s+/g, '_') + '_Credit_Proposal.pdf');
            setTimeout(() => setExportNotice(''), 4000);
        }, 1200);
    };

    const handleExportExcel = () => {
        setExportNotice('Exporting Multi-Sheet Financial Model Workbook (.xlsx)...');
        setTimeout(() => {
            setExportNotice('✓ Financial model exported: ' + caseData.enterpriseName.replace(/\s+/g, '_') + '_Financial_Model.xlsx');
            setTimeout(() => setExportNotice(''), 4000);
        }, 1000);
    };

    return (
        <div className="case-detail-root">
            {/* Top Bar Header */}
            <header className="case-detail-top">
                <div className="case-detail-top-inner">
                    <div className="case-header-left">
                        <Link to="/partnerLMS/dashboard" className="back-link-btn">← Lead Dashboard</Link>
                        <div className="case-header-titles">
                            <h1>{caseData.enterpriseName}</h1>
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
                            {caseData.status}
                        </div>
                    </div>
                </div>
            </header>

            {/* Workflow Progress Bar */}
            <div className="case-progress-strip">
                <div className="progress-step-item done">1. Data Collected & Verified</div>
                <div className="progress-step-item done">2. CIBIL Bureau Pulled</div>
                <div className="progress-step-item done">3. BSA Cash Flow Parsed</div>
                <div className="progress-step-item done">4. GST Reconciled</div>
                <div className="progress-step-item done">5. Scorecard: 88/100</div>
                <div className="progress-step-item active">6. Sanction Proposal Ready</div>
            </div>

            {/* Notification Banner */}
            {exportNotice && (
                <div className="export-alert-banner">
                    <span>{exportNotice}</span>
                </div>
            )}

            {/* Sub-Navigation Tabs */}
            <div className="case-tabs-nav">
                <button
                    type="button"
                    className={`case-tab-btn ${activeTab === 'intelligence' ? 'active' : ''}`}
                    onClick={() => setActiveTab('intelligence')}
                >
                    Credit Intelligence & API Panels
                </button>
                <button
                    type="button"
                    className={`case-tab-btn ${activeTab === 'financials' ? 'active' : ''}`}
                    onClick={() => setActiveTab('financials')}
                >
                    Project Cost & Means of Finance
                </button>
                <button
                    type="button"
                    className={`case-tab-btn ${activeTab === 'scorecard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('scorecard')}
                >
                    0–100 Risk Scorecard
                </button>
                <button
                    type="button"
                    className={`case-tab-btn ${activeTab === 'dossier' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dossier')}
                >
                    Bank Proposal Dossier & Exports
                </button>
            </div>

            {/* Main Tab Views */}
            <main className="case-main-body">
                {/* TAB 1: Intelligence Panels */}
                {activeTab === 'intelligence' && (
                    <div className="intelligence-grid">
                        {/* Panel 1: CIBIL */}
                        <div className="intel-card">
                            <div className="intel-card-header">
                                <div className="intel-title-group">
                                    <span className="api-icon-pill icon-blue">CIBIL</span>
                                    <h4>TransUnion Commercial / Promoters Bureau</h4>
                                </div>
                                <span className="cost-tag">₹50 / Pull</span>
                            </div>

                            <div className="intel-body">
                                {cibilState.run ? (
                                    <div className="cibil-result-box">
                                        <div className="cibil-gauge-center">
                                            <span className="cibil-score-val">{cibilState.score}</span>
                                            <span className="cibil-score-label">EXCELLENT (750+)</span>
                                        </div>
                                        <div className="cibil-breakdown-list">
                                            <div className="cibil-row">
                                                <span>Active Trade Lines:</span>
                                                <strong>6 Accounts</strong>
                                            </div>
                                            <div className="cibil-row">
                                                <span>Total Overdue:</span>
                                                <strong className="text-green">₹0.00 (Zero Overdue)</strong>
                                            </div>
                                            <div className="cibil-row">
                                                <span>36-Month DPD Track:</span>
                                                <strong className="text-green">000 across all accounts</strong>
                                            </div>
                                            <div className="cibil-row">
                                                <span>Settled / Written-off:</span>
                                                <strong>None</strong>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="api-prompt-box">
                                        <p>Pull latest CIBIL Commercial & Promoters CIR report.</p>
                                        <button type="button" onClick={handleRunCIBIL} className="btn-run-api" disabled={cibilState.loading}>
                                            {cibilState.loading ? 'Fetching CIBIL Bureau...' : 'Run CIBIL Bureau (Deduct ₹50)'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Panel 2: Multi-Bank BSA */}
                        <div className="intel-card">
                            <div className="intel-card-header">
                                <div className="intel-title-group">
                                    <span className="api-icon-pill icon-gold">BSA</span>
                                    <h4>Multi-Bank Statement Analysis (12 Months)</h4>
                                </div>
                                <span className="cost-tag">₹45 / Account</span>
                            </div>

                            <div className="intel-body">
                                <div className="bsa-accounts-summary">
                                    <div className="bsa-stat-row">
                                        <span>Combined 12M Average Bank Balance:</span>
                                        <strong className="text-gold">₹116.70 Lakhs</strong>
                                    </div>
                                    <div className="bsa-stat-row">
                                        <span>Inward Cheque / ECS Returns:</span>
                                        <strong className="text-green">0 Bounces (Clean Repayment)</strong>
                                    </div>
                                    <div className="bsa-stat-row">
                                        <span>Total Annual Credits:</span>
                                        <strong>₹3,184.20 Lakhs (~₹31.84 Cr)</strong>
                                    </div>
                                    <div className="bsa-stat-row">
                                        <span>Active EMI Debits Mapped:</span>
                                        <strong>3 Loans (₹4.2 Lakhs / Month)</strong>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Panel 3: GST Verification */}
                        <div className="intel-card">
                            <div className="intel-card-header">
                                <div className="intel-title-group">
                                    <span className="api-icon-pill icon-purple">GST</span>
                                    <h4>GSTIN Turnover & ITC Reconciliation</h4>
                                </div>
                                <span className="cost-tag">₹40 / GSTIN</span>
                            </div>

                            <div className="intel-body">
                                <div className="gst-summary-box">
                                    <div className="gst-stat-row">
                                        <span>Declared vs GSTR-3B Turnover:</span>
                                        <strong className="text-green">₹32.49 Cr (100% Verified Match)</strong>
                                    </div>
                                    <div className="gst-stat-row">
                                        <span>GSTR-3B Return Filing Regularity:</span>
                                        <strong className="text-green">12 / 12 Months Filed On Time</strong>
                                    </div>
                                    <div className="gst-stat-row">
                                        <span>Circular Trading Pattern:</span>
                                        <strong className="text-green">Negative (Zero Suspicious Links)</strong>
                                    </div>
                                    <div className="gst-stat-row">
                                        <span>ITC vs Output Tax Ratio:</span>
                                        <strong>84.2% (Standard for Packaging)</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: Financials & Project Cost */}
                {activeTab === 'financials' && (
                    <div className="financials-tab-grid">
                        <div className="finance-section-card">
                            <h3>Project Cost (₹36.00 Cr Sizing)</h3>
                            <table className="mini-data-table">
                                <thead>
                                    <tr>
                                        <th>Particulars</th>
                                        <th>Incurred</th>
                                        <th>To be Incurred</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Land including Development</td>
                                        <td>₹600.00 L</td>
                                        <td>₹0.00 L</td>
                                        <td><strong>₹600.00 L</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Building & Civil Works</td>
                                        <td>₹200.00 L</td>
                                        <td>₹800.00 L</td>
                                        <td><strong>₹1000.00 L</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Plant & Machinery (Indigenous)</td>
                                        <td>₹100.00 L</td>
                                        <td>₹1900.00 L</td>
                                        <td><strong>₹2000.00 L</strong></td>
                                    </tr>
                                    <tr className="total-highlight">
                                        <td><strong>TOTAL PROJECT COST</strong></td>
                                        <td><strong>₹900.00 L</strong></td>
                                        <td><strong>₹2700.00 L</strong></td>
                                        <td><strong className="text-gold">₹3600.00 L (₹36.00 Cr)</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="finance-section-card">
                            <h3>Means of Finance</h3>
                            <table className="mini-data-table">
                                <thead>
                                    <tr>
                                        <th>Funding Source</th>
                                        <th>Raised</th>
                                        <th>Proposed</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Partners / Promoter Capital</td>
                                        <td>₹600.00 L</td>
                                        <td>₹0.00 L</td>
                                        <td><strong>₹600.00 L</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Unsecured Loans (Interest-Free)</td>
                                        <td>₹300.00 L</td>
                                        <td>₹0.00 L</td>
                                        <td><strong>₹300.00 L</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Term Loan from SIDBI</td>
                                        <td>₹0.00 L</td>
                                        <td>₹2700.00 L</td>
                                        <td><strong>₹2700.00 L</strong></td>
                                    </tr>
                                    <tr className="total-highlight">
                                        <td><strong>TOTAL MEANS OF FINANCE</strong></td>
                                        <td><strong>₹900.00 L</strong></td>
                                        <td><strong>₹2700.00 L</strong></td>
                                        <td><strong className="text-gold">₹3600.00 L (₹36.00 Cr)</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: 0–100 Risk Scorecard */}
                {activeTab === 'scorecard' && (
                    <div className="scorecard-tab-layout">
                        <div className="scorecard-hero-box">
                            <div className="scorecard-number-circle">
                                <span className="score-num">88</span>
                                <span className="score-max">/ 100</span>
                            </div>
                            <div className="scorecard-verdict">
                                <h3>Tier-1 Bankable Credit Profile (Sanction Recommended)</h3>
                                <p>Strong equity backing (₹900L already deployed), unblemished 758 CIBIL score, zero cheque bounces, and prime industrial land collateral.</p>
                            </div>
                        </div>

                        <div className="score-pillars-list">
                            <div className="score-pillar-row">
                                <div className="pillar-info">
                                    <span className="pillar-name">1. CIBIL Bureau & DPD History</span>
                                    <span className="pillar-desc">758 CIR score, zero past 36M delays, 0 written-off records</span>
                                </div>
                                <div className="pillar-score text-green">30 / 30 Pts</div>
                            </div>

                            <div className="score-pillar-row">
                                <div className="pillar-info">
                                    <span className="pillar-name">2. Debt Service & FOIR Capacity</span>
                                    <span className="pillar-desc">Projected DSCR of 1.74x under 108M amortisation tenure</span>
                                </div>
                                <div className="pillar-score text-green">20 / 20 Pts</div>
                            </div>

                            <div className="score-pillar-row">
                                <div className="pillar-info">
                                    <span className="pillar-name">3. Banking Cash Flow & Average Bank Balance</span>
                                    <span className="pillar-desc">₹116.7L ABB, healthy payroll credits, zero inward returns</span>
                                </div>
                                <div className="pillar-score text-green">18 / 20 Pts</div>
                            </div>

                            <div className="score-pillar-row">
                                <div className="pillar-info">
                                    <span className="pillar-name">4. Declared vs Verified Turnover Match</span>
                                    <span className="pillar-desc">₹32.49 Cr sales matches ITR and GSTR-3B filings exactly</span>
                                </div>
                                <div className="pillar-score text-green">15 / 15 Pts</div>
                            </div>

                            <div className="score-pillar-row">
                                <div className="pillar-info">
                                    <span className="pillar-name">5. Statutory & Corporate Governance</span>
                                    <span className="pillar-desc">Zero disputed arrears, SPCB valid consent, non-disputed status</span>
                                </div>
                                <div className="pillar-score text-green">5 / 5 Pts</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 4: Bank Proposal Dossier & Exports */}
                {activeTab === 'dossier' && (
                    <div className="dossier-tab-layout">
                        <div className="dossier-export-actions">
                            <div className="dossier-card">
                                <h4>14-Page Institutional SIDBI / Bank Proposal Dossier (PDF)</h4>
                                <p>Comprehensive credit proposal containing Enterprise Profile, Project Sizing, Means of Finance, 4 Guarantors Net Worth (₹23.81 Cr), Security 1st Charge, Financial Estimates, and Facilitator E-Signature.</p>
                                <button type="button" onClick={handleExportPDF} className="btn-export-pdf">
                                    Download Complete Bank Proposal Dossier (.PDF)
                                </button>
                            </div>

                            <div className="dossier-card">
                                <h4>Granular Financial Modeling & CMA Excel Workbook (.XLSX)</h4>
                                <p>Multi-sheet CMA data including Balance Sheet projections (2027–2030), P&L Statements, DSCR schedules, Cash Flow projections, and Sensitivity Analysis.</p>
                                <button type="button" onClick={handleExportExcel} className="btn-export-excel">
                                    Export Full CMA & Financial Model (.XLSX)
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PartnerLMSCaseDetail;
